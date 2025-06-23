
interface ApiContact {
    id: number;
    group_id: number;
    contact_id: string | null;
    name: string;
    first_name: string | null;
    last_name: string | null;
    phone_number: string;
    country_code: string | null;
    raw_contact: any;
    created_at: string;
    updated_at: string;
    is_contact_from_device: boolean;
}

interface Group {
    id: string;
    name: string;
    contacts: ApiContact[];
    group_type: 'MANUAL' | 'USER_DEFINED';
    group_name: string;
}

interface CallState {
    status: 'idle' | 'in_progress' | 'completed' | 'stopped';
    contacts: Array<{ id: string; name: string; phoneNumber: string }>;
    currentIndex: number;
    sessionId: number | null;
    currentContact: { name: string; phoneNumber: string } | null;
    attempt: number;
}

interface CallHistoryEntry {
    id: number;
    contact_phone: string;
    status: string;
    attempt: number;
    duration: number | null;
    ended_at: string | null;
}

type CallStatus = 'idle' | 'in_progress' | 'completed' | 'stopped';

type CallStatusData = {
    sessionId: number,
    status: CallStatus,
    currentIndex: number,
    totalCalls: number,
    currentContact: { name: string; phoneNumber: string } | null,
    attempt: number,
}

export type { ApiContact, CallHistoryEntry, CallState, CallStatus, CallStatusData, Group };

