export interface Step {
    id: string; // was number | string
    question: string;
    malayalam?: string;
    answerType?: string;
    branch?: { [answer: string]: string };
}

export interface Workflow {
    id: number;
    name: string;
    description: string;
    steps: Step[];
}

export interface WorkflowResponse {
    id: number;
    name: string;
    description: string;
    steps: Step[];
    created_at?: string;
    updated_at?: string;
}

export interface ManageWorkflowPayload {
    workflowId?: number;
    name: string;
    description: string;
    steps: Step[];
    opsMode: 'INSERT' | 'UPDATE' | 'DELETE';
} 