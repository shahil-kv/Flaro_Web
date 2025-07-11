export interface Group {
    id: number;
    name: string;
    totalCalls: number;
    avgDuration: string;
    successRate: number;
    lastCall: string;
    answered: number;
    missed: number;
}

export interface Contact {
    id: number;
    name: string;
    role: string;
    phone: string;
    email: string;
    lastContacted: string;
    status: 'Active' | 'Inactive';
    calls: number;
    answered: number;
}

export interface PerformanceMetric {
    metric: string;
    value: number;
    color: string;
}

export interface GroupHistoryData {
    groups: Group[];
    contacts: { [key: number]: Contact[] };
    performanceMetrics: PerformanceMetric[];
}