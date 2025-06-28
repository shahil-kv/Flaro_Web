'use client';
import * as React from "react";
import { io, Socket } from 'socket.io-client';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { useGet, usePost } from '@/lib/useApi';
import {
  ApiContact,
  CallHistoryEntry,
  CallState,
  CallStatusData,
  Group,
} from '@/types/calling.types';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Phone, Users, X } from 'lucide-react';
import * as XLSX from 'xlsx';

// const API_URL = 'https://busappnodejs.onrender.com';
const API_URL = 'http://localhost:8080';

export default function CallsPage() {
  const { user } = useAuth();
  const [selectedGroup, setSelectedGroup] = React.useState<string | null>(null);
  const [selectedContacts, setSelectedContacts] = React.useState<any[]>([]);
  const [isContactDialogOpen, setIsContactDialogOpen] = React.useState(false);
  const [isRecording, setIsRecording] = React.useState(false);
  const [recordedMessage, setRecordedMessage] = React.useState('');
  const [currentCall, setCurrentCall] = React.useState<CallState>({
    status: 'idle',
    contacts: [],
    currentIndex: 0,
    sessionId: null,
    currentContact: null,
    attempt: 0,
  });
  const [callHistory, setCallHistory] = React.useState<CallHistoryEntry[]>([]);
  const [socket, setSocket] = React.useState<Socket | null>(null);
  const stableUserId = React.useMemo(
    () => (user?.id != null ? String(user.id) : undefined),
    [user?.id],
  );
  const isCallActive = currentCall.status !== 'idle';

  // Fetch groups
  const {
    data: fetchedGroups,
    refetch: fetchGroups,
    isFetching: isFetchingGroups,
  } = useGet<any, { userId: string | undefined }>(
    'group/get-groups',
    { userId: stableUserId },
    {
      showErrorToast: true,
      showSuccessToast: false,
      showLoader: false,
      enabled: Number(stableUserId) > 0,
    },
  );

  // Start/Stop call mutations
  const { mutateAsync: StartCallSession } = usePost('call/call_list', {
    invalidateQueriesOnSuccess: [],
    showErrorToast: true,
    showSuccessToast: true,
    showLoader: true,
  });
  const { mutateAsync: StopCallSession } = usePost('call/stop', {
    invalidateQueriesOnSuccess: [],
    showErrorToast: true,
    showSuccessToast: true,
    showLoader: true,
  });

  // Initialize socket
  React.useEffect(() => {
    const socketInstance: Socket = io(API_URL, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      transportOptions: { transports: ['websocket'] },
    });
    socketInstance.on('connect', () => console.log('Socket.IO connected'));
    socketInstance.on('connect_error', (error) =>
      console.log('Socket.IO connection error:', error),
    );
    setSocket(socketInstance);
    return () => {
      socketInstance.disconnect();
    };
  }, []);

  // Handle socket events
  React.useEffect(() => {
    if (!socket || !currentCall.sessionId) return;

    socket.on('callStatusUpdate', (data: CallStatusData) => {
      if (data.sessionId !== currentCall.sessionId) return;
      setCurrentCall((prev: any) => ({
        ...prev,
        status: data.status,
        currentIndex: data.currentIndex || prev.currentIndex,
        currentContact: data.currentContact,
        attempt: data.attempt,
      }));
      if (
        data.currentIndex >= data.totalCalls ||
        data.status === 'completed' ||
        data.status === 'stopped'
      ) {
        setCurrentCall({
          status: 'idle',
          contacts: [],
          currentIndex: 0,
          sessionId: null,
          currentContact: null,
          attempt: 0,
        });
        setCallHistory([]);
        toast.success('Call Session Ended', {
          description: 'All calls have been completed.',
        });
      }
    });

    socket.on(
      'callHistoryUpdate',
      (data: { sessionId: number; callHistory: CallHistoryEntry }) => {
        if (data.sessionId !== currentCall.sessionId) return;
        setCallHistory((prev) => {
          const existingIndex = prev.findIndex(
            (entry) => entry.id === data.callHistory.id,
          );
          if (existingIndex >= 0) {
            const updatedHistory = [...prev];
            updatedHistory[existingIndex] = data.callHistory;
            return updatedHistory;
          }
          return [...prev, data.callHistory];
        });
      },
    );

    return () => {
      socket.off('callStatusUpdate');
      socket.off('callHistoryUpdate');
    };
  }, [socket, currentCall.sessionId]);

  // Process valid contacts
  const validContacts = React.useMemo(() => {
    return selectedContacts
      .filter((contact) => contact.phoneNumbers?.[0]?.number?.trim())
      .map((contact) => ({
        id: contact.id || `contact-${Date.now()}-${Math.random()}`,
        name: contact.name || 'Unknown Contact',
        phoneNumber: contact.phoneNumbers?.[0]?.number?.trim() || '',
      }));
  }, [selectedContacts]);

  // Start call handler
  const handleStartCall = React.useCallback(async () => {
    const MAX_CONTACTS_FREE = 50;
    const MAX_CONTACTS_PREMIUM = 500;

    if (selectedContacts.length === 0) {
      toast.error('No Contacts Selected', {
        description: 'Please select at least one contact.',
      });
      return;
    }

    const contactLimit = user?.is_premium ? MAX_CONTACTS_PREMIUM : MAX_CONTACTS_FREE;
    if (selectedContacts.length > contactLimit) {
      toast.error('Contact Limit Exceeded', {
        description: `Free users: ${MAX_CONTACTS_FREE} contacts. Pro: ${MAX_CONTACTS_PREMIUM}.`,
      });
      return;
    }

    if (validContacts.length === 0) {
      toast.error('Invalid Contacts', { description: 'No valid phone numbers found.' });
      return;
    }

    const messageContent =
      user?.is_premium && recordedMessage
        ? recordedMessage
        : 'Hello, this is an automated call. Thank you!';
    const payload =
      selectedGroup === null
        ? {
          userId: Number(user?.id),
          contacts: validContacts.map((contact) => ({
            name: contact.name,
            phoneNumber: contact.phoneNumber,
          })),
          groupId: 0,
          groupType: 'MANUAL',
          messageContent,
        }
        : {
          userId: Number(user?.id),
          groupId: Number(selectedGroup),
          groupType: 'USER_DEFINED',
          messageContent,
        };

    try {
      const response: any = await StartCallSession(payload);
      if (response.statusCode !== 200)
        throw new Error(response.message || 'Failed to start call');
      setCurrentCall({
        status: 'in_progress',
        contacts: validContacts,
        currentIndex: 0,
        sessionId: response.data.sessionId,
        currentContact: validContacts[0],
        attempt: 1,
      });
      toast.success('Call Session Started');
    } catch (error: any) {
      toast.error('Error', { description: error.message || 'Failed to start call.' });
    }
  }, [
    selectedContacts,
    user,
    validContacts,
    recordedMessage,
    selectedGroup,
    StartCallSession,
  ]);

  // End call handler
  const handleEndCall = React.useCallback(async () => {
    if (!currentCall.sessionId) return;
    try {
      const data = await StopCallSession({ sessionId: currentCall.sessionId });
      if (data.statusCode !== 200)
        throw new Error(data.message || 'Failed to stop call session');
      setCurrentCall({
        status: 'idle',
        contacts: [],
        currentIndex: 0,
        sessionId: null,
        currentContact: null,
        attempt: 0,
      });
      setCallHistory([]);
      toast.warning('Call Session Ended');
    } catch (error: any) {
      toast.error('Error', { description: error.message || 'Failed to end call.' });
    }
  }, [currentCall, StopCallSession]);

  // Group selection handler
  const handleGroupSelect = (groupId: string | null) => {
    setSelectedGroup(groupId);
    if (groupId) {
      const group = fetchedGroups?.data?.find((g: Group) => g.id === groupId);
      if (group) {
        const expoContacts: any[] = group.contacts
          .filter((contact: ApiContact) => contact.phone_number?.trim())
          .map((contact: ApiContact) => ({
            id: contact.contact_id || String(contact.id),
            name: contact.name || 'Unknown Contact',
            phoneNumbers: [
              { number: contact.phone_number, type: 'mobile', label: 'mobile' },
            ],
            contactType: 'person',
          }));
        setSelectedContacts(expoContacts);
      }
    } else {
      setSelectedContacts([]);
    }
  };

  // Record message handler
  const handleRecordMessage = () => {
    if (!user?.is_premium) {
      toast.error('Premium Feature', {
        description: 'Voice recording requires Pro. Upgrade now.',
      });
      return;
    }
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
      setRecordedMessage('This is a pre-recorded message. Thank you!');
      toast.success('Message Recorded', {
        description: 'Your message has been recorded.',
      });
    }, 2000);
  };

  // Status display
  const getStatusDisplay = (status: string) => {
    const newStatus = status.toUpperCase();
    switch (newStatus) {
      case 'ACCEPTED':
        return 'Accepted';
      case 'MISSED':
        return 'Rejected';
      case 'DECLINED':
        return 'Busy';
      case 'FAILED':
        return 'Failed';
      case 'IN_PROGRESS':
        return 'Calling';
      default:
        return status;
    }
  };

  const handleFileImport = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(sheet);

        const contacts = jsonData
          .map((row: any) => {
            const name = row.name || row.Name || '';
            const phone =
              row.phone || row.Phone || row.phoneNumber || row.PhoneNumber || '';
            if (!name || !phone) return null;
            return {
              id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
              name,
              phoneNumbers: [{ number: phone, type: 'mobile', label: 'mobile' }],
              contactType: 'person',
            };
          })
          .filter((contact): contact is any => contact !== null);

        if (contacts.length === 0) {
          toast.error('No valid contacts found in the file.');
          return;
        }
        setSelectedContacts(contacts); // Replace instead of append
        toast.success(`${contacts.length} contacts imported.`);
      };
      reader.readAsBinaryString(file);
    } catch {
      toast.error('Failed to import contacts. Please check the file format.');
    }
  }, []);

  // Render active call view
  if (isCallActive) {
    return (
      <section className="p-4 md:p-6 lg:p-8 bg-gray-100 dark:bg-gray-900 min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-200">Active Call</h1>
          <Button
            variant="destructive"
            onClick={handleEndCall}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 dark:hover:bg-red-500 text-white"
          >
            <X className="w-4 h-4" /> End Call
          </Button>
        </div>
        {currentCall.currentContact && (
          <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 mb-4">
              <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
              {currentCall.currentContact.name}
            </h2>
            <p className="text-gray-500 dark:text-gray-400">{currentCall.currentContact.phoneNumber}</p>
            <p className="mt-2 text-blue-600 dark:text-blue-400">{getStatusDisplay(currentCall.status)}</p>
          </div>
        )}
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700">
          <Table>
            <TableHeader>
              <TableRow className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
                <TableHead className="text-gray-700 dark:text-gray-300">Contact</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-300">Phone Number</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-300">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentCall.contacts.map((contact: any, index: number) => {
                const historyEntry = callHistory.find(
                  (entry) => entry.contact_phone === contact.phoneNumber,
                );
                const status =
                  historyEntry?.status ||
                  (index === currentCall.currentIndex ? 'IN_PROGRESS' : 'PENDING');
                return (
                  <TableRow key={contact.id} className="text-gray-900 dark:text-gray-300">
                    <TableCell className="font-medium text-gray-800 dark:text-gray-200">
                      {contact.name}
                    </TableCell>
                    <TableCell className="text-gray-900 dark:text-gray-300">{contact.phoneNumber}</TableCell>
                    <TableCell>
                      <span
                        className={`text-sm ${status === 'ACCEPTED'
                          ? 'text-green-500 dark:text-green-400'
                          : status === 'FAILED' || status === 'DECLINED'
                            ? 'text-red-500 dark:text-red-400'
                            : 'text-gray-500 dark:text-gray-400'
                          }`}
                      >
                        {getStatusDisplay(status)}
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
        <Button
          variant="destructive"
          onClick={handleEndCall}
          className="w-full mt-6 bg-red-600 hover:bg-red-700 dark:hover:bg-red-500 text-white"
        >
          End Call Session
        </Button>
      </section>
    );
  }

  // Render idle call view
  return (
    <section className="p-4 md:p-6 lg:p-8 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Phone className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-200">Start a Call</h1>
        </div>
        <Button
          variant="ghost"
          onClick={() => {
            /* Navigate to reports */
          }}
          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </Button>
      </div>
      <div className="space-y-6">
        {/* Group Selection */}
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Select Group</h2>
          </div>
          {isFetchingGroups ? (
            <p className="text-gray-500 dark:text-gray-400">Loading groups...</p>
          ) : fetchedGroups?.data?.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedGroup === null ? 'default' : 'outline'}
                onClick={() => handleGroupSelect(null)}
                className={selectedGroup === null ? 'bg-red-600 hover:bg-red-700 dark:hover:bg-red-500 text-white' : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600'}
              >
                Custom
              </Button>
              {fetchedGroups.data.map((group: Group) => (
                <Button
                  key={group.id}
                  variant={selectedGroup === group.id ? 'default' : 'outline'}
                  onClick={() => handleGroupSelect(group.id)}
                  className={selectedGroup === group.id ? 'bg-red-600 hover:bg-red-700 dark:hover:bg-red-500 text-white' : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600'}
                >
                  {group.group_name}
                </Button>
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <p className="text-gray-500 dark:text-gray-400">No groups available</p>
              <Button
                variant="link"
                onClick={() => fetchGroups()}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
              >
                Retry
              </Button>
            </div>
          )}
        </div>

        {/* Contact Selection */}
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              {/* <AddressBook className="w-5 h-5 text-blue-600" /> */}
              <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Selected Contacts</h2>
            </div>
            <Button
              variant="link"
              onClick={() => setIsContactDialogOpen(true)}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
            >
              {selectedGroup ? 'Change' : 'Select'}
            </Button>
          </div>
          {selectedContacts.length > 0 ? (
            <div>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                {selectedContacts.length} contacts selected
              </p>
              <div className="flex flex-wrap gap-4">
                {selectedContacts.slice(0, 5).map((contact: any) => (
                  <div key={contact.id} className="text-center">
                    <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-1">
                      <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <p className="text-xs text-gray-800 dark:text-gray-200 truncate w-12">{contact.name}</p>
                  </div>
                ))}
                {selectedContacts.length > 5 && (
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-1">
                      <span className="font-bold text-gray-800 dark:text-gray-200">
                        +{selectedContacts.length - 5}
                      </span>
                    </div>
                    <p className="text-xs text-gray-800 dark:text-gray-200">More</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <Users className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto" />
              <p className="mt-2 text-gray-500 dark:text-gray-400">
                No contacts selected. Select a group or add contacts.
              </p>
              <Button
                onClick={() => setIsContactDialogOpen(true)}
                className="mt-4 bg-red-600 hover:bg-red-700 dark:hover:bg-red-500 text-white"
              >
                Select Contacts
              </Button>
            </div>
          )}
        </div>

        {/* Voice Message */}
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-2 mb-4">
            {/* <Microphone className="w-5 h-5 text-blue-600" /> */}
            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Voice Message</h2>
            {!user?.is_premium && (
              <span className="px-2 py-1 text-xs text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900 rounded">
                Premium
              </span>
            )}
          </div>
          <Button
            variant="outline"
            className={`w-full justify-between bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600 ${isRecording ? 'bg-red-100 dark:bg-red-900' : ''} ${!user?.is_premium ? 'opacity-50' : ''
              }`}
            onClick={handleRecordMessage}
            disabled={!user?.is_premium}
          >
            <span className={isRecording ? 'text-red-600 dark:text-red-400' : 'text-gray-700 dark:text-gray-300'}>
              {isRecording
                ? 'Recording...'
                : recordedMessage
                  ? 'Re-record Message'
                  : 'Record Voice Message'}
            </span>
            {/* <Microphone className={`w-5 h-5 ${isRecording ? 'text-red-600' : 'text-gray-500'}`} /> */}
          </Button>
          {!user?.is_premium && (
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Upgrade to Pro to record voice messages
            </p>
          )}
          {recordedMessage && (
            <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-gray-700 dark:text-gray-300">{recordedMessage}</p>
            </div>
          )}
        </div>

        {/* Start Call Button */}
        <Button
          className={`w-full bg-red-600 hover:bg-red-700 dark:hover:bg-red-500 text-white ${selectedContacts.length === 0 ? 'opacity-50' : ''}`}
          onClick={handleStartCall}
          disabled={selectedContacts.length === 0}
        >
          <Phone className="w-5 h-5 mr-2" />
          Start Calling{' '}
          {selectedContacts.length > 0 && `(${selectedContacts.length} contacts)`}
        </Button>
      </div>

      {/* Contact Selection Dialog */}
      <Dialog open={isContactDialogOpen} onOpenChange={setIsContactDialogOpen}>
        <DialogContent className="sm:max-w-[600px] bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-white">Select Contacts</DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-400">
              Import contacts via Excel/CSV. Web browsers cannot access device contacts.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="flex items-center justify-between border border-gray-200 dark:border-gray-700 rounded-lg p-3 bg-white dark:bg-gray-700">
              <span className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                {/* <Upload className="w-5 h-5 text-gray-500" /> */}
                Import from Excel/CSV
              </span>
              <Button variant="ghost" size="sm" asChild className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                <label>
                  <input
                    type="file"
                    accept=".xlsx, .xls, .csv"
                    onChange={handleFileImport}
                    className="hidden"
                  />
                  {/* <Upload className="w-4 h-4 text-gray-500" /> */}
                </label>
              </Button>
            </div>
            {selectedContacts.length > 0 && (
              <Table className="mt-4">
                <TableHeader>
                  <TableRow className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <TableHead className="text-gray-700 dark:text-gray-300">Name</TableHead>
                    <TableHead className="text-gray-700 dark:text-gray-300">Phone Number</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedContacts.map((contact) => (
                    <TableRow key={contact.id} className="text-gray-900 dark:text-gray-300">
                      <TableCell className="font-medium text-gray-800 dark:text-gray-200">
                        {contact.name}
                      </TableCell>
                      <TableCell className="text-gray-900 dark:text-gray-300">{contact.phoneNumbers[0]?.number}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
          <DialogFooter>
            <Button
              onClick={() => setIsContactDialogOpen(false)}
              className="bg-red-600 hover:bg-red-700 dark:hover:bg-red-500 text-white"
            >
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}