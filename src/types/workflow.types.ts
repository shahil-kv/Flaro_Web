export interface Step {
    id: number;
    question: string;
    answerType: string;
    branch?: { [key: string]: number };
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