
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

interface Group {
    id: number;
    name: string;
    description: string;
    contacts: Contact[];
}

interface GroupResponse {
    id: number;
    group_name: string;
    description: string;
    contacts: {
        contact_id?: string;
        id: string;
        name: string;
        first_name?: string;
        last_name?: string;
        phone_number: string;
        country_code?: string;
        is_contact_from_device: boolean;
    }[];
}

interface ManageGroupPayload {
    userId: string;
    groupId: number;
    groupName: string;
    description: string;
    contacts: {
        id: string;
        name: string;
        phoneNumbers: Contact['phoneNumbers'];
        isContactFromDevice: boolean;
    }[];
    opsMode: 'INSERT' | 'UPDATE' | 'DELETE';
}

export type { Contact, Group, GroupResponse, ManageGroupPayload };
