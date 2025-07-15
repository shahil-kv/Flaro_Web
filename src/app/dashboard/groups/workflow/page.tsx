'use client';
import * as React from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useGet, usePost } from '@/lib/useApi';
import {
  Workflow,
  Step,
  WorkflowResponse,
  ManageWorkflowPayload,
} from '@/types/workflow.types';
import { toast } from 'sonner';

const ANSWER_TYPES = [
  { value: 'yes_no', label: 'Yes/No' },
  { value: 'text', label: 'Text' },
  { value: 'number', label: 'Number' },
  { value: 'end', label: 'End' },
];

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

export default function WorkflowPage() {
  // API hooks
  const { data: fetchedWorkflows, refetch: refetchWorkflows } = useGet<
    { data: WorkflowResponse[] },
    object
  >(
    '/workflow/get-workflows',
    {},
    { showErrorToast: true, showSuccessToast: false, showLoader: true },
  );

  const { mutate: manageWorkflow } = usePost<any, ManageWorkflowPayload>(
    '/workflow/manage',
    { showErrorToast: true, showSuccessToast: true, showLoader: true },
  );

  // State
  const [workflows, setWorkflows] = useState<WorkflowResponse[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingWorkflow, setEditingWorkflow] = useState<number | null>(null);
  const [workflowForm, setWorkflowForm] = useState<Workflow>({
    id: 0,
    name: '',
    description: '',
    steps: [],
  });
  const [stepForm, setStepForm] = useState<Step>({
    id: '',
    question: '',
    answerType: 'yes_no',
    branch: {},
  });
  const [isStepDialogOpen, setIsStepDialogOpen] = useState(false);
  const [editingStepIndex, setEditingStepIndex] = useState<number | null>(null);

  React.useEffect(() => {
    if (fetchedWorkflows?.data) setWorkflows(fetchedWorkflows.data);
  }, [fetchedWorkflows]);

  // Handlers for workflow dialog
  const openNewWorkflowDialog = () => {
    setEditingWorkflow(null);
    setWorkflowForm({ id: 0, name: '', description: '', steps: [] });
    setIsDialogOpen(true);
  };
  const openEditWorkflowDialog = (wf: WorkflowResponse) => {
    setEditingWorkflow(wf.id);
    setWorkflowForm({ ...wf });
    setIsDialogOpen(true);
  };
  const handleWorkflowFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWorkflowForm({ ...workflowForm, [e.target.name]: e.target.value });
  };
  const saveWorkflow = () => {
    if (!workflowForm.name.trim()) return;
    const payload: ManageWorkflowPayload = {
      workflowId: editingWorkflow ?? undefined,
      name: workflowForm.name,
      description: workflowForm.description,
      steps: workflowForm.steps,
      opsMode: editingWorkflow ? 'UPDATE' : 'INSERT',
    };
    manageWorkflow(payload, {
      onSuccess: () => {
        setIsDialogOpen(false);
        setEditingWorkflow(null);
        setWorkflowForm({ id: 0, name: '', description: '', steps: [] });
        refetchWorkflows();
      },
      onError: () => toast.error('Failed to save workflow.'),
    });
  };
  const deleteWorkflow = (id: number) => {
    const payload: ManageWorkflowPayload = {
      workflowId: id,
      name: '',
      description: '',
      steps: [],
      opsMode: 'DELETE',
    };
    manageWorkflow(payload, {
      onSuccess: () => refetchWorkflows(),
      onError: () => toast.error('Failed to delete workflow.'),
    });
  };

  // Step dialog handlers
  const openNewStepDialog = () => {
    setEditingStepIndex(null);
    setStepForm({ id: '', question: '', answerType: 'yes_no', branch: {} });
    setIsStepDialogOpen(true);
  };
  const openEditStepDialog = (step: Step, idx: number) => {
    setEditingStepIndex(idx);
    setStepForm({ ...step });
    setIsStepDialogOpen(true);
  };
  const handleStepFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    if (name === 'question' && editingStepIndex === null) {
      setStepForm((prev) => ({
        ...prev,
        question: value,
        id: slugify(value),
      }));
    } else {
      setStepForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };
  const getAvailableStepIds = () =>
    workflowForm.steps
      .filter((s) => s.id !== stepForm.id)
      .map((s) => ({ id: s.id, label: s.question }));

  const saveStep = () => {
    if (!stepForm.question.trim()) return;
    // Ensure unique step ID
    if (
      workflowForm.steps.some(
        (s, idx) => s.id === stepForm.id && idx !== editingStepIndex,
      )
    ) {
      toast.error('Step ID must be unique.');
      return;
    }
    const steps = [...workflowForm.steps];
    if (editingStepIndex !== null) {
      steps[editingStepIndex] = { ...stepForm };
    } else {
      steps.push({ ...stepForm });
    }
    setWorkflowForm({ ...workflowForm, steps });
    setIsStepDialogOpen(false);
  };
  const deleteStep = (idx: number) => {
    const steps = [...workflowForm.steps];
    steps.splice(idx, 1);
    setWorkflowForm({ ...workflowForm, steps });
  };

  return (
    <div className='space-y-8 max-w-4xl mx-auto py-8 bg-gray-100 dark:bg-gray-900'>
      <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>
        Workflow Brain Center
      </h1>
      <p className='text-gray-500 dark:text-gray-400 mb-6'>
        Define, edit, and assign workflows for your groups. Each workflow is a set of
        questions and logic that powers your AI calling experience.
      </p>
      <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6'>
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-xl font-bold text-gray-800 dark:text-gray-200'>
            Workflows
          </h2>
          <Button
            onClick={openNewWorkflowDialog}
            className='flex items-center gap-2 bg-red-600 hover:bg-red-700 dark:hover:bg-red-500 text-white'
          >
            <Plus className='w-4 h-4' /> New Workflow
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow className='bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700'>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Steps</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {workflows.map((wf) => (
              <TableRow key={wf.id}>
                <TableCell>{wf.name}</TableCell>
                <TableCell>{wf.description}</TableCell>
                <TableCell>{wf.steps.length}</TableCell>
                <TableCell>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => openEditWorkflowDialog(wf)}
                  >
                    <Edit className='w-4 h-4' />
                  </Button>
                  <Button
                    variant='destructive'
                    size='sm'
                    onClick={() => deleteWorkflow(wf.id)}
                  >
                    <Trash2 className='w-4 h-4' />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Workflow Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className='sm:max-w-[700px] w-full h-[900px] overflow-auto'>
          <DialogHeader>
            <DialogTitle>
              {editingWorkflow ? 'Edit Workflow' : 'New Workflow'}
            </DialogTitle>
          </DialogHeader>
          <div className='space-y-4 py-2'>
            <div>
              <label className='block font-semibold mb-1'>Name</label>
              <input
                className='w-full border rounded px-3 py-2'
                name='name'
                value={workflowForm.name}
                onChange={handleWorkflowFormChange}
                placeholder='Workflow name'
              />
            </div>
            <div>
              <label className='block font-semibold mb-1'>Description</label>
              <input
                className='w-full border rounded px-3 py-2'
                name='description'
                value={workflowForm.description}
                onChange={handleWorkflowFormChange}
                placeholder='Short description'
              />
            </div>
            <div>
              <div className='flex justify-between items-center mb-2'>
                <span className='font-semibold'>Steps</span>
                <Button size='sm' onClick={openNewStepDialog}>
                  <Plus className='w-4 h-4' /> Add Step
                </Button>
              </div>
              {workflowForm.steps.length === 0 ? (
                <p className='text-gray-500'>No steps added yet.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>#</TableHead>
                      <TableHead>Step ID</TableHead>
                      <TableHead>Question</TableHead>
                      <TableHead>Answer Type</TableHead>
                      <TableHead>Branch</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {workflowForm.steps.map((step, idx) => (
                      <TableRow key={step.id}>
                        <TableCell>{idx + 1}</TableCell>
                        <TableCell>{step.id}</TableCell>
                        <TableCell>{step.question}</TableCell>
                        <TableCell>
                          {ANSWER_TYPES.find((a) => a.value === step.answerType)?.label ||
                            step.answerType}
                        </TableCell>
                        <TableCell>
                          {step.branch && Object.keys(step.branch).length > 0
                            ? Object.entries(step.branch)
                              .map(
                                ([k, v]) =>
                                  `${k}→${workflowForm.steps.find((s) => s.id === v)
                                    ?.question || v
                                  }`,
                              )
                              .join(', ')
                            : '-'}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant='outline'
                            size='sm'
                            onClick={() => openEditStepDialog(step, idx)}
                          >
                            <Edit className='w-4 h-4' />
                          </Button>
                          <Button
                            variant='destructive'
                            size='sm'
                            onClick={() => deleteStep(idx)}
                          >
                            <Trash2 className='w-4 h-4' />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button onClick={saveWorkflow} className='bg-red-600 text-white'>
              {editingWorkflow ? 'Save Changes' : 'Create Workflow'}
            </Button>
            <Button variant='outline' onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Step Dialog */}
      <Dialog open={isStepDialogOpen} onOpenChange={setIsStepDialogOpen}>
        <DialogContent className='sm:max-w-[500px]'>
          <DialogHeader>
            <DialogTitle>
              {editingStepIndex !== null ? 'Edit Step' : 'Add Step'}
            </DialogTitle>
          </DialogHeader>
          <div className='space-y-4 py-2'>
            <div>
              <label className='block font-semibold mb-1'>Step ID</label>
              <input
                className='w-full border rounded px-3 py-2'
                name='id'
                value={stepForm.id}
                onChange={handleStepFormChange}
                placeholder='Unique step ID (e.g. ask_budget)'
              />
              <p className='text-xs text-gray-500'>
                Auto-generated from question, but you can edit for clarity/uniqueness.
              </p>
            </div>
            <div>
              <label className='block font-semibold mb-1'>Question</label>
              <input
                className='w-full border rounded px-3 py-2'
                name='question'
                value={stepForm.question}
                onChange={handleStepFormChange}
                placeholder='What should the AI ask?'
              />
            </div>
            <div>
              <label className='block font-semibold mb-1'>Answer Type</label>
              <select
                className='w-full border rounded px-3 py-2'
                name='answerType'
                value={stepForm.answerType}
                onChange={handleStepFormChange}
              >
                {ANSWER_TYPES.map((a) => (
                  <option key={a.value} value={a.value}>
                    {a.label}
                  </option>
                ))}
              </select>
            </div>
            {stepForm.answerType === 'yes_no' && (
              <div>
                <label className='block font-semibold mb-1'>Branching (optional)</label>
                <div className='flex gap-2'>
                  <div className='w-1/2'>
                    <label className='text-xs'>If Yes, go to</label>
                    <select
                      className='w-full border rounded px-2 py-1'
                      value={stepForm.branch?.yes || ''}
                      onChange={(e) =>
                        setStepForm({
                          ...stepForm,
                          branch: { ...stepForm.branch, yes: e.target.value },
                        })
                      }
                    >
                      <option value=''>Next step (default)</option>
                      {getAvailableStepIds().map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.label} ({s.id})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className='w-1/2'>
                    <label className='text-xs'>If No, go to</label>
                    <select
                      className='w-full border rounded px-2 py-1'
                      value={stepForm.branch?.no || ''}
                      onChange={(e) =>
                        setStepForm({
                          ...stepForm,
                          branch: { ...stepForm.branch, no: e.target.value },
                        })
                      }
                    >
                      <option value=''>Next step (default)</option>
                      {getAvailableStepIds().map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.label} ({s.id})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <p className='text-xs text-gray-500 mt-1'>
                  Leave blank to go to next step automatically.
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button onClick={saveStep} className='bg-red-600 text-white'>
              {editingStepIndex !== null ? 'Save Step' : 'Add Step'}
            </Button>
            <Button variant='outline' onClick={() => setIsStepDialogOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
