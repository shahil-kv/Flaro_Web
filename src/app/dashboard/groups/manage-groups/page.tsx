'use client';
import * as React from 'react';
import { useState, useCallback, useMemo, useEffect } from 'react';
import { toast } from 'sonner';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Search, Plus, Pencil, Trash2, Upload, X } from 'lucide-react';
import * as XLSX from 'xlsx';
import { useGet, usePost } from '@/lib/useApi';
import { useAuth } from '@/context/AuthContext';
import { Contact, Group, GroupResponse, ManageGroupPayload } from '@/types/group.tyes';

// Utility function to clean contact ID
const cleanContactId = (id: string) => id.replace(':ABPerson', '');

// Utility function to normalize phone number
const normalizePhoneNumber = (phone: string): string => {
  const cleanedPhone = phone.replace(/\D/g, '');
  return cleanedPhone.startsWith('91')
    ? `+91${cleanedPhone.slice(2)}`
    : `+91${cleanedPhone}`;
};

export default function GroupsPage() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isGroupDialogOpen, setIsGroupDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);
  const [isImportedContactsDialogOpen, setIsImportedContactsDialogOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    selectedContacts: [] as Contact[],
  });
  const [excelContacts, setExcelContacts] = useState<Contact[]>([]);
  const [sortField, setSortField] = useState<keyof Group | 'contactCount'>('name');
  const [opsMode, setOpsMode] = useState<'INSERT' | 'UPDATE' | 'DELETE'>('INSERT');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const { user } = useAuth();
  const stableUserId = useMemo(
    () => (user?.id != null ? String(user.id) : undefined),
    [user?.id],
  );

  // Fetch groups
  const {
    data: fetchedGroups,
    refetch: fetchGroupsAgain,
    isFetching,
  } = useGet<{ data: GroupResponse[] }, { userId: string | undefined }>(
    '/group/get-groups',
    { userId: stableUserId },
    {
      showErrorToast: true,
      showSuccessToast: false,
      showLoader: true,
      enabled: !!stableUserId,
    },
  );

  // Manage group mutation
  const { mutate: manageGroup, isPending: isManagingGroup } = usePost<
    any,
    ManageGroupPayload
  >('/group/manage-group', {
    showErrorToast: true,
    showSuccessToast: true,
    showLoader: true,
  });

  // Update groups state
  useEffect(() => {
    if (fetchedGroups?.data) {
      const transformedGroups: Group[] = fetchedGroups.data.map((group) => ({
        id: group.id,
        name: group.group_name,
        description: group.description,
        contacts: group.contacts.map((contact) => ({
          id: contact.contact_id || contact.id,
          name: contact.name,
          firstName: contact.first_name || contact.name.split(' ')[0],
          lastName: contact.last_name || contact.name.split(' ').slice(1).join(' '),
          phoneNumbers: [
            {
              id: contact.id,
              label: 'mobile',
              number: contact.phone_number,
              digits: contact.phone_number.replace(/\D/g, ''),
              countryCode:
                contact.country_code || contact.phone_number.split(' ')[0] || '',
            },
          ],
          isContactFromDevice: contact.is_contact_from_device,
        })),
      }));
      if (JSON.stringify(transformedGroups) !== JSON.stringify(groups)) {
        setGroups(transformedGroups);
      }
    }
  }, [fetchedGroups, groups]);

  // Filter and sort groups
  const filteredGroups = useMemo(() => {
    return [...groups]
      .filter(
        (group) =>
          group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          group.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          group.contacts.some((contact) =>
            contact.name.toLowerCase().includes(searchQuery.toLowerCase()),
          ),
      )
      .sort((a, b) => {
        const aValue = sortField === 'contactCount' ? a.contacts.length : a[sortField];
        const bValue = sortField === 'contactCount' ? b.contacts.length : b[sortField];
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortOrder === 'asc'
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }
        return sortOrder === 'asc'
          ? Number(aValue) - Number(bValue)
          : Number(bValue) - Number(aValue);
      });
  }, [groups, searchQuery, sortField, sortOrder]);

  // Reset form
  const resetForm = useCallback(() => {
    setFormData({ name: '', description: '', selectedContacts: [] });
    setExcelContacts([]);
  }, []);

  // Handle group operation
  const handleGroupOperation = useCallback(async () => {
    if (!formData.name.trim()) {
      toast.error('Error', { description: 'Group name is required.' });
      return;
    }
    if (formData.selectedContacts.length + excelContacts.length === 0) {
      toast.error('Error', { description: 'At least one contact is required.' });
      return;
    }
    if (!stableUserId) {
      toast.error('Error', { description: 'User not authenticated.' });
      return;
    }

    const allContacts = [...formData.selectedContacts, ...excelContacts];
    const payload: ManageGroupPayload = {
      userId: stableUserId,
      groupId: opsMode === 'INSERT' ? 0 : (selectedGroup?.id as number),
      groupName: formData.name,
      description: formData.description,
      contacts: allContacts.map((contact) => ({
        ...contact,
        id: cleanContactId(
          contact.id || `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        ),
        phoneNumbers: contact.phoneNumbers.map((phone) => ({
          ...phone,
          number: normalizePhoneNumber(phone.number || ''),
          digits: phone.number?.replace(/\D/g, '') || '',
          countryCode: phone.number?.startsWith('+') ? phone.number.split(' ')[0] : '+91',
        })),
        isContactFromDevice: contact.isContactFromDevice ?? true,
      })),
      opsMode: opsMode,
    };

    manageGroup(payload, {
      onSuccess: () => {
        setIsGroupDialogOpen(false);
        setSelectedGroup(null);
        resetForm();
        fetchGroupsAgain();
      },
      onError: (error) => {
        toast.error('Error', { description: 'Failed to save group. Please try again.' });
        console.error('API error:', error);
      },
    });
  }, [
    opsMode,
    formData,
    selectedGroup,
    stableUserId,
    manageGroup,
    resetForm,
    fetchGroupsAgain,
    excelContacts,
  ]);

  // Handle delete group
  const handleDeleteGroup = useCallback(async () => {
    if (!selectedGroup || !stableUserId) return;

    const payload: ManageGroupPayload = {
      userId: stableUserId,
      groupId: selectedGroup.id,
      groupName: selectedGroup.name || '',
      description: selectedGroup.description || '',
      contacts: [],
      opsMode: 'DELETE',
    };

    manageGroup(payload, {
      onSuccess: () => {
        setIsDeleteDialogOpen(false);
        setSelectedGroup(null);
        fetchGroupsAgain();
      },
    });
  }, [selectedGroup, stableUserId, manageGroup, fetchGroupsAgain]);

  // Open group dialog
  const openGroupDialog = useCallback(
    (group?: Group) => {
      if (group) {
        setOpsMode('UPDATE');
        setSelectedGroup(group);
        setFormData({
          name: group.name,
          description: group.description,
          selectedContacts: group.contacts.filter((c) => c.isContactFromDevice),
        });
        setExcelContacts(group.contacts.filter((c) => !c.isContactFromDevice));
      } else {
        setOpsMode('INSERT');
        resetForm();
      }
      setIsGroupDialogOpen(true);
    },
    [resetForm],
  );

  // Handle file import for Excel contacts
  const handleFileImport = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
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

              const normalizedPhone = phone.startsWith('+') ? phone : `+91${phone}`;
              const digits = normalizedPhone.replace(/\D/g, '');
              const [firstName = '', ...lastNameParts] = name.trim().split(' ');
              const lastName = lastNameParts.join(' ');

              return {
                id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
                name,
                firstName,
                lastName,
                phoneNumbers: [
                  {
                    id: `${Date.now()}`,
                    label: 'mobile',
                    number: normalizedPhone,
                    digits,
                    countryCode: '+91',
                  },
                ],
                isContactFromDevice: false,
              };
            })
            .filter((contact): contact is Contact => contact !== null);

          if (contacts.length === 0) {
            toast.error('Warning', {
              description: 'No valid contacts found in the file.',
            });
            return;
          }

          setExcelContacts((prev) => [...prev, ...contacts]);
          toast.success('Success', {
            description: `${contacts.length} contacts imported.`,
          });
        };
        reader.readAsBinaryString(file);
      } catch (err) {
        console.error('File import error:', err);
        toast.error('Error', {
          description: 'Failed to import contacts. Please check the file format.',
        });
      }
    },
    [],
  );

  // Handle clear imported Excel contacts
  const handleClearImported = useCallback(() => {
    setExcelContacts([]);
  }, []);

  // Handle sort
  const handleSort = useCallback((field: keyof Group | 'contactCount') => {
    setSortField(field);
    setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
  }, []);

  return (
    <section className='p-4 md:p-6 lg:p-8 bg-gray-50 min-h-screen'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl md:text-3xl font-bold text-gray-800'>Groups</h1>
        <Button
          onClick={() => openGroupDialog()}
          className='flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white'
          disabled={!stableUserId}
        >
          <Plus className='w-4 h-4' />
          Create New Group
        </Button>
      </div>

      <div className='mb-6'>
        <div className='relative'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder='Search groups by name, description, or contact'
            className='pl-10 border-gray-300'
          />
        </div>
      </div>

      <div className='bg-white shadow-sm rounded-lg border border-gray-200'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='w-[50px]'>
                <Button variant='ghost' onClick={() => handleSort('id')}>
                  # {sortField === 'id' && (sortOrder === 'asc' ? '↑' : '↓')}
                </Button>
              </TableHead>
              <TableHead>
                <Button variant='ghost' onClick={() => handleSort('name')}>
                  Group Name {sortField === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
                </Button>
              </TableHead>
              <TableHead>
                <Button variant='ghost' onClick={() => handleSort('contactCount')}>
                  Contacts{' '}
                  {sortField === 'contactCount' && (sortOrder === 'asc' ? '↑' : '↓')}
                </Button>
              </TableHead>
              <TableHead>
                <Button variant='ghost' onClick={() => handleSort('description')}>
                  Description{' '}
                  {sortField === 'description' && (sortOrder === 'asc' ? '↑' : '↓')}
                </Button>
              </TableHead>
              <TableHead className='text-right'>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isFetching ? (
              <TableRow>
                <TableCell colSpan={5} className='text-center py-10 text-gray-500'>
                  Loading...
                </TableCell>
              </TableRow>
            ) : filteredGroups.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className='text-center py-10 text-gray-500'>
                  <div className='flex flex-col items-center gap-2'>
                    <svg
                      className='w-12 h-12 text-gray-400'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        d='M9 14h6m-3-3v6m-9 3h18a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
                      ></path>
                    </svg>
                    <p>
                      {searchQuery
                        ? 'No groups match your search'
                        : 'No groups found. Create your first group to get started.'}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredGroups.map((group, index: number) => (
                <TableRow key={group.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell className='font-medium text-gray-800'>
                    {group.name}
                  </TableCell>
                  <TableCell>{group.contacts.length} contacts</TableCell>
                  <TableCell>{group.description || 'N/A'}</TableCell>
                  <TableCell className='text-right space-x-2'>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() => openGroupDialog(group)}
                      className='text-blue-600 hover:text-blue-800'
                    >
                      <Pencil className='w-4 h-4 mr-1' />
                      Edit
                    </Button>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() => {
                        setSelectedGroup(group);
                        setIsDeleteDialogOpen(true);
                      }}
                      className='text-red-600 hover:text-red-800'
                    >
                      <Trash2 className='w-4 h-4 mr-1' />
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog
        open={isGroupDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            resetForm();
            setSelectedGroup(null);
          }
          setIsGroupDialogOpen(open);
        }}
      >
        <DialogContent className='sm:max-w-[600px]'>
          <DialogHeader>
            <DialogTitle>{selectedGroup ? 'Edit Group' : 'Create New Group'}</DialogTitle>
            <DialogDescription>
              {selectedGroup
                ? `Update the details for ${selectedGroup.name}.`
                : 'Fill in the details to create a new group.'}
            </DialogDescription>
          </DialogHeader>
          <div className='grid gap-4 py-4'>
            <div className='grid gap-2'>
              <label htmlFor='name' className='text-sm font-medium text-gray-700'>
                Group Name
              </label>
              <Input
                id='name'
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder='Enter group name'
              />
            </div>
            <div className='grid gap-2'>
              <label htmlFor='description' className='text-sm font-medium text-gray-700'>
                Description (Optional)
              </label>
              <Input
                id='description'
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder='Enter description'
              />
            </div>
            <div className='grid gap-2'>
              <label className='text-sm font-medium text-gray-700'>Add Contacts</label>
              <Button
                disabled={formData.selectedContacts.length <= 0}
                variant='outline'
                onClick={() => setIsContactDialogOpen(true)}
                className='flex justify-between'
              >
                <span>
                  {formData.selectedContacts.length > 0
                    ? `${formData.selectedContacts.length} contacts selected`
                    : 'Select contacts'}
                </span>
                <ChevronRight className='w-4 h-4' />
              </Button>
              <div className='flex items-center justify-between border border-gray-200 rounded-lg p-3'>
                {excelContacts.length > 0 ? (
                  <>
                    <Button
                      variant='ghost'
                      onClick={() => setIsImportedContactsDialogOpen(true)}
                      className='flex items-center gap-2'
                    >
                      <Upload className='w-5 h-5 text-gray-500' />
                      <span>{`${excelContacts.length} contacts imported`}</span>
                    </Button>
                    <Button variant='ghost' size='sm' onClick={handleClearImported}>
                      <X className='w-4 h-4 text-red-600' />
                    </Button>
                  </>
                ) : (
                  <>
                    <span className='flex items-center gap-2'>
                      <Upload className='w-5 h-5 text-gray-500' />
                      Import from Excel/CSV
                    </span>
                    <Button variant='ghost' size='sm' asChild>
                      <label>
                        <input
                          type='file'
                          accept='.xlsx, .xls, .csv'
                          onChange={handleFileImport}
                          className='hidden'
                        />
                        <Upload className='w-4 h-4 text-gray-500' />
                      </label>
                    </Button>
                  </>
                )}
              </div>
              <p className='text-sm text-gray-500'>
                Note: Web browsers cannot access device contacts. Use Excel/CSV import or
                sync contacts via the mobile app.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant='outline' onClick={() => setIsGroupDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleGroupOperation} disabled={isManagingGroup}>
              {isManagingGroup ? 'Saving...' : selectedGroup ? 'Save' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isContactDialogOpen} onOpenChange={setIsContactDialogOpen}>
        <DialogContent className='sm:max-w-[800px] h-max max-h-[80vh] overflow-y-auto flex flex-col justify-between'>
          <div>
            <DialogHeader>
              <DialogTitle>Contacts in {selectedGroup?.name || 'Group'}</DialogTitle>
              <DialogDescription>
                List of contacts for the selected group. This view is read-only and shows
                only backend-fetched contacts.
              </DialogDescription>
            </DialogHeader>
            <div className='py-4'>
              <Table>
                <TableHeader className='sticky top-0'>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Phone Number</TableHead>
                    <TableHead>Source</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {formData.selectedContacts.map((contact) => (
                    <TableRow key={contact.id}>
                      <TableCell className='font-medium text-gray-800'>
                        {contact.name}
                      </TableCell>
                      <TableCell>{contact.phoneNumbers[0]?.number}</TableCell>
                      <TableCell>
                        {contact.isContactFromDevice ? 'Synced from mobile' : 'Imported'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsContactDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isImportedContactsDialogOpen}
        onOpenChange={setIsImportedContactsDialogOpen}
      >
        <DialogContent className='sm:max-w-[800px] h-max max-h-[80vh] overflow-y-auto flex flex-col justify-between'>
          <div className=''>
            <DialogHeader>
              <DialogTitle>Imported Contacts</DialogTitle>
              <DialogDescription>
                List of contacts imported from Excel/CSV.
              </DialogDescription>
            </DialogHeader>
            <div className='py-4'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Phone Number</TableHead>
                    <TableHead>Source</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {excelContacts.map((contact) => (
                    <TableRow key={contact.id}>
                      <TableCell className='font-medium text-gray-800'>
                        {contact.name}
                      </TableCell>
                      <TableCell>{contact.phoneNumbers[0]?.number}</TableCell>
                      <TableCell>Imported</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsImportedContactsDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>Delete Group</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedGroup?.name}? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant='outline' onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant='destructive'
              onClick={handleDeleteGroup}
              disabled={isManagingGroup}
            >
              {isManagingGroup ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}

const ChevronRight = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    fill='none'
    viewBox='0 0 24 24'
    stroke='currentColor'
    {...props}
  >
    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
  </svg>
);
