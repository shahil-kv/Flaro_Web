"use client";
import { useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search, Plus, Pencil, Trash2, Upload, X } from "lucide-react";
import * as XLSX from "xlsx";

// Define the Contact type
interface Contact {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  phoneNumbers: {
    id: string;
    label: string;
    number: string;
    digits: string;
    countryCode: string;
  }[];
  isContactFromDevice: boolean;
}

// Define the Group type
interface Group {
  id: number;
  name: string;
  description: string;
  contacts: Contact[];
}

// Mock contacts for selection (replace with API data)
const mockContacts: Contact[] = [
  {
    id: "1",
    name: "John Doe",
    firstName: "John",
    lastName: "Doe",
    phoneNumbers: [
      {
        id: "1",
        label: "mobile",
        number: "+91 9876543210",
        digits: "9876543210",
        countryCode: "+91",
      },
    ],
    isContactFromDevice: true,
  },
  {
    id: "2",
    name: "Jane Smith",
    firstName: "Jane",
    lastName: "Smith",
    phoneNumbers: [
      {
        id: "2",
        label: "mobile",
        number: "+91 9123456789",
        digits: "9123456789",
        countryCode: "+91",
      },
    ],
    isContactFromDevice: true,
  },
];

export default function GroupsPage() {
  const [groups, setGroups] = useState<Group[]>([
    {
      id: 1,
      name: "Team Alpha",
      description: "Alpha team group",
      contacts: [mockContacts[0]],
    },
    {
      id: 2,
      name: "Team Beta",
      description: "Beta team group",
      contacts: [mockContacts[1]],
    },
  ]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    contacts: [] as Contact[],
  });
  const [showContactSelection, setShowContactSelection] = useState(false);
  // const [showImportedContacts, setShowImportedContacts] = useState(false);
  const [importedContacts, setImportedContacts] = useState<Contact[]>([]);

  // Filter groups based on search query
  const filteredGroups = groups.filter(
    (group) =>
      group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle Create Group
  const handleCreateGroup = () => {
    if (!formData.name.trim()) {
      // toast({ variant: "destructive", title: "Error", description: "Group name is required." });
      return;
    }
    if (formData.contacts.length === 0) {
      // toast({ variant: "destructive", title: "Error", description: "At least one contact is required." });
      return;
    }

    const newGroup: Group = {
      id: groups.length + 1,
      name: formData.name,
      description: formData.description,
      contacts: formData.contacts,
    };

    // TODO: Replace with API call
    // await api.post("/group/manage-group", { groupName: formData.name, description: formData.description, contacts: formData.contacts, opsMode: "INSERT" });

    setGroups([...groups, newGroup]);
    setIsCreateDialogOpen(false);
    resetForm();
    // toast({ title: "Success", description: "Group created successfully." });
  };

  // Handle Edit Group
  const handleEditGroup = () => {
    if (!selectedGroup || !formData.name.trim()) {
      // toast({ variant: "destructive", title: "Error", description: "Group name is required." });
      return;
    }
    if (formData.contacts.length === 0) {
      // toast({ variant: "destructive", title: "Error", description: "At least one contact is required." });
      return;
    }

    const updatedGroups = groups.map((group) =>
      group.id === selectedGroup.id
        ? {
            ...group,
            name: formData.name,
            description: formData.description,
            contacts: formData.contacts,
          }
        : group
    );

    // TODO: Replace with API call
    // await api.put(`/group/manage-group`, { groupId: selectedGroup.id, groupName: formData.name, description: formData.description, contacts: formData.contacts, opsMode: "UPDATE" });

    setGroups(updatedGroups);
    setIsEditDialogOpen(false);
    setSelectedGroup(null);
    resetForm();
    // toast({ title: "Success", description: "Group updated successfully." });
  };

  // Handle Delete Group
  const handleDeleteGroup = () => {
    if (!selectedGroup) return;

    const updatedGroups = groups.filter(
      (group) => group.id !== selectedGroup.id
    );

    // TODO: Replace with API call
    // await api.post("/group/manage-group", { groupId: selectedGroup.id, opsMode: "DELETE" });

    setGroups(updatedGroups);
    setIsDeleteDialogOpen(false);
    setSelectedGroup(null);
    // toast({ title: "Success", description: "Group deleted successfully." });
  };

  // Open Edit Dialog
  const openEditDialog = (group: Group) => {
    setSelectedGroup(group);
    setFormData({
      name: group.name,
      description: group.description,
      contacts: group.contacts,
    });
    setImportedContacts(group.contacts.filter((c) => !c.isContactFromDevice));
    setIsEditDialogOpen(true);
  };

  // Open Delete Dialog
  const openDeleteDialog = (group: Group) => {
    setSelectedGroup(group);
    setIsDeleteDialogOpen(true);
  };

  // Reset Form
  const resetForm = () => {
    setFormData({ name: "", description: "", contacts: [] });
    setImportedContacts([]);
    setShowContactSelection(false);
    // setShowImportedContacts(false);
  };

  // Handle File Import
  const handleFileImport = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(sheet);

        const contacts = jsonData
          .map((row: any) => {
            const name = row.name || row.Name || "";
            const phone =
              row.phone ||
              row.Phone ||
              row.phoneNumber ||
              row.PhoneNumber ||
              "";
            if (!name || !phone) return null;

            const normalizedPhone = phone.startsWith("+")
              ? phone
              : `+91${phone}`;
            const digits = normalizedPhone.replace(/\D/g, "");
            const [firstName = "", ...lastNameParts] = name.trim().split(" ");
            const lastName = lastNameParts.join(" ");

            return {
              id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
              name,
              firstName,
              lastName,
              phoneNumbers: [
                {
                  id: `${Date.now()}`,
                  label: "mobile",
                  number: normalizedPhone,
                  digits,
                  countryCode: "+91",
                },
              ],
              isContactFromDevice: false,
            };
          })
          .filter((contact): contact is Contact => contact !== null);

        if (contacts.length === 0) {
          // toast({ variant: "destructive", title: "Warning", description: "No valid contacts found in the file." });
          return;
        }

        setImportedContacts(contacts);
        setFormData((prev) => ({
          ...prev,
          contacts: [
            ...prev.contacts.filter((c) => c.isContactFromDevice),
            ...contacts,
          ],
        }));
        // toast({ title: "Success", description: `${contacts.length} contacts imported.` });
      };
      reader.readAsBinaryString(file);
    } catch (err) {
      console.error("File import error:", err);
      // toast({ variant: "destructive", title: "Error", description: "Failed to import contacts. Please check the file format." });
    }
  };

  // Handle Clear Imported Contacts
  const handleClearImported = () => {
    setImportedContacts([]);
    setFormData((prev) => ({
      ...prev,
      contacts: prev.contacts.filter((c) => c.isContactFromDevice),
    }));
  };

  // Handle Contact Selection
  const handleContactsSelected = (contact: Contact) => {
    setFormData((prev) => {
      const isSelected = prev.contacts.find((c) => c.id === contact.id);
      if (isSelected) {
        return {
          ...prev,
          contacts: prev.contacts.filter((c) => c.id !== contact.id),
        };
      }
      return { ...prev, contacts: [...prev.contacts, contact] };
    });
  };

  return (
    <section className="p-4 md:p-6 lg:p-8 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Groups</h1>
        <Button
          onClick={() => {
            resetForm();
            setIsCreateDialogOpen(true);
          }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="w-4 h-4" />
          Create New Group
        </Button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search groups"
            className="pl-10 border-gray-300"
          />
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">#</TableHead>
              <TableHead>Group Name</TableHead>
              <TableHead>Contacts</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredGroups.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-10 text-gray-500"
                >
                  <div className="flex flex-col items-center gap-2">
                    <svg
                      className="w-12 h-12 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 14h6m-3-3v6m-9 3h18a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      ></path>
                    </svg>
                    <p>
                      {searchQuery
                        ? "No groups match your search"
                        : "No groups found. Create your first group to get started."}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredGroups.map((group) => (
                <TableRow key={group.id}>
                  <TableCell>{group.id}</TableCell>
                  <TableCell className="font-medium text-gray-800">
                    {group.name}
                  </TableCell>
                  <TableCell>{group.contacts.length} contacts</TableCell>
                  <TableCell>{group.description || "N/A"}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditDialog(group)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Pencil className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openDeleteDialog(group)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Create Group Dialog */}
      <Dialog
        open={isCreateDialogOpen}
        onOpenChange={(open) => {
          if (!open) resetForm();
          setIsCreateDialogOpen(open);
        }}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New Group</DialogTitle>
            <DialogDescription>
              Fill in the details to create a new group.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label
                htmlFor="name"
                className="text-sm font-medium text-gray-700"
              >
                Group Name
              </label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter group name"
              />
            </div>
            <div className="grid gap-2">
              <label
                htmlFor="description"
                className="text-sm font-medium text-gray-700"
              >
                Description (Optional)
              </label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Enter description"
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium text-gray-700">
                Add Contacts
              </label>
              <Button
                variant="outline"
                onClick={() => setShowContactSelection(true)}
                className="flex justify-between"
              >
                <span>
                  {formData.contacts.filter((c) => c.isContactFromDevice)
                    .length > 0
                    ? `${
                        formData.contacts.filter((c) => c.isContactFromDevice)
                          .length
                      } contacts selected`
                    : "Select contacts"}
                </span>
                <ChevronRight className="w-4 h-4" />
              </Button>
              <div className="flex items-center justify-between border border-gray-200 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <Upload className="w-5 h-5 text-gray-500" />
                  <span>
                    {importedContacts.length > 0
                      ? `${importedContacts.length} contacts imported`
                      : "Import from Excel/CSV"}
                  </span>
                </div>
                {importedContacts.length > 0 ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearImported}
                  >
                    <X className="w-4 h-4 text-red-600" />
                  </Button>
                ) : (
                  <Button variant="ghost" size="sm" asChild>
                    <label>
                      <input
                        type="file"
                        accept=".xlsx, .xls, .csv"
                        onChange={handleFileImport}
                        className="hidden"
                      />
                      <Upload className="w-4 h-4 text-gray-500" />
                    </label>
                  </Button>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateGroup}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Group Dialog */}
      <Dialog
        open={isEditDialogOpen}
        onOpenChange={(open) => {
          if (!open) resetForm();
          setIsEditDialogOpen(open);
        }}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Group</DialogTitle>
            <DialogDescription>
              Update the details for {selectedGroup?.name}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label
                htmlFor="name"
                className="text-sm font-medium text-gray-700"
              >
                Group Name
              </label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter group name"
              />
            </div>
            <div className="grid gap-2">
              <label
                htmlFor="description"
                className="text-sm font-medium text-gray-700"
              >
                Description (Optional)
              </label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Enter description"
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium text-gray-700">
                Add Contacts
              </label>
              <Button
                variant="outline"
                onClick={() => setShowContactSelection(true)}
                className="flex justify-between"
              >
                <span>
                  {formData.contacts.filter((c) => c.isContactFromDevice)
                    .length > 0
                    ? `${
                        formData.contacts.filter((c) => c.isContactFromDevice)
                          .length
                      } contacts selected`
                    : "Select contacts"}
                </span>
                <ChevronRight className="w-4 h-4" />
              </Button>
              <div className="flex items-center justify-between border border-gray-200 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <Upload className="w-5 h-5 text-gray-500" />
                  <span>
                    {importedContacts.length > 0
                      ? `${importedContacts.length} contacts imported`
                      : "Import from Excel/CSV"}
                  </span>
                </div>
                {importedContacts.length > 0 ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearImported}
                  >
                    <X className="w-4 h-4 text-red-600" />
                  </Button>
                ) : (
                  <Button variant="ghost" size="sm" asChild>
                    <label>
                      <input
                        type="file"
                        accept=".xlsx, .xls, .csv"
                        onChange={handleFileImport}
                        className="hidden"
                      />
                      <Upload className="w-4 h-4 text-gray-500" />
                    </label>
                  </Button>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleEditGroup}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Contact Selection Dialog */}
      <Dialog
        open={showContactSelection}
        onOpenChange={setShowContactSelection}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Select Contacts</DialogTitle>
            <DialogDescription>
              Choose contacts to add to the group.
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[400px] overflow-y-auto">
            {mockContacts.map((contact) => (
              <div
                key={contact.id}
                className="flex items-center justify-between p-3 border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
                onClick={() => handleContactsSelected(contact)}
              >
                <div>
                  <p className="font-medium text-gray-800">{contact.name}</p>
                  <p className="text-sm text-gray-500">
                    {contact.phoneNumbers[0]?.number}
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={!!formData.contacts.find((c) => c.id === contact.id)}
                  onChange={() => handleContactsSelected(contact)}
                  className="w-5 h-5"
                />
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button onClick={() => setShowContactSelection(false)}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Group</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedGroup?.name}? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteGroup}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}

// Placeholder ChevronRight icon (since it's not in lucide-react by default)
const ChevronRight = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 5l7 7-7 7"
    />
  </svg>
);
