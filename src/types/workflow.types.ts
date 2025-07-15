export interface Step {
    id: string; // was number | string
    question: string;
    malayalam?: string;
    answerType?: string;
    branch?: { [answer: string]: string };
}

// export interface Workflow {
//     id: number;
//     name: string;
//     description: string;
//     steps: Step[];
// }

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
////
export interface WorkflowNode {
    id: string;
    type: 'start' | 'question' | 'action' | 'end';
    position: { x: number; y: number };
    data: {
        label: string;
        question?: string;
        answerType?: 'yes_no' | 'text' | 'number' | 'multiple_choice';
        options?: string[];
        action?: string;
        nextNode?: string;
        yesNode?: string;
        noNode?: string;
    };
}

export interface WorkflowEdge {
    id: string;
    source: string;
    target: string;
    label?: string;
}

export interface Workflow {
    id: string;
    name: string;
    description: string;
    nodes: WorkflowNode[];
    edges: WorkflowEdge[];
    createdAt: Date;
    updatedAt: Date;
    isActive: boolean;
}