'use client';
import React, { useState } from 'react';
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
import { Plus, Edit, Trash2, Upload, FileText } from 'lucide-react';
import { useGet, usePost } from '@/lib/useApi';
import {
  Workflow,
  Step,
  WorkflowResponse,
  ManageWorkflowPayload,
} from '@/types/workflow.types';
import { toast } from 'sonner';

// Mock answer types
const ANSWER_TYPES = [
  { value: 'yes_no', label: 'Yes/No' },
  { value: 'text', label: 'Text' },
  { value: 'number', label: 'Number' },
  { value: 'end', label: 'End' },
];

function WorkflowDocumentsManager({ workflowId }: { workflowId?: number }) {
  const [selectedFiles, setSelectedFiles] = React.useState<File[]>([]);
  const [uploading, setUploading] = React.useState(false);
  const [uploadProgress, setUploadProgress] = React.useState<{ [key: string]: number }>(
    {},
  );
  const [error, setError] = React.useState<string | null>(null);
  const [documents, setDocuments] = React.useState<any[]>([]);
  const { data, refetch, isFetching } = useGet<
    { data: any[] },
    { userId?: string | number; sessionId?: number; workflowId?: number }
  >(
    '/workflow-document/get-documents',
    { workflowId },
    {
      enabled: !!workflowId,
      showErrorToast: true,
      showSuccessToast: false,
      showLoader: false,
    },
  );
  const { mutate: manageDocument } = usePost<any, any>(
    '/workflow-document/manage-documents',
    {
      showErrorToast: true,
      showSuccessToast: true,
      showLoader: true,
    },
  );

  React.useEffect(() => {
    if (data?.data) setDocuments(data.data);
  }, [data]);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  // Handle upload
  const handleUpload = async () => {
    if (!workflowId || selectedFiles.length === 0) return;
    setUploading(true);
    setError(null);
    for (const file of selectedFiles) {
      const formData = new FormData();
      formData.append('opsMode', 'INSERT');
      formData.append('workflowId', String(workflowId));
      formData.append('file', file);
      try {
        await new Promise((resolve, reject) => {
          // Use XMLHttpRequest for progress
          const xhr = new XMLHttpRequest();
          xhr.open(
            'POST',
            'http://localhost:8080/api/v1/workflow-document/manage-documents',
          );
          xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
              setUploadProgress((prev) => ({
                ...prev,
                [file.name]: Math.round((event.loaded / event.total) * 100),
              }));
            }
          };
          xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              resolve(xhr.response);
            } else {
              reject(xhr.statusText);
            }
          };
          xhr.onerror = () => reject(xhr.statusText);
          xhr.send(formData);
        });
        toast.success(`Uploaded: ${file.name}`);
      } catch {
        setError(`Failed to upload ${file.name}`);
        toast.error(`Failed to upload ${file.name}`);
      }
    }
    setSelectedFiles([]);
    setUploading(false);
    setUploadProgress({});
    refetch();
  };

  // Handle delete
  const handleDelete = (documentId: number) => {
    manageDocument(
      { opsMode: 'DELETE', documentId },
      {
        onSuccess: () => {
          toast.success('Document deleted');
          refetch();
        },
        onError: () => {
          toast.error('Failed to delete document');
        },
      },
    );
  };

  return (
    <div className='mt-6'>
      <h3 className='font-semibold text-gray-700 mb-2 flex items-center gap-2'>
        <FileText className='w-5 h-5' /> Documents
      </h3>
      <div className='flex flex-col gap-2 mb-2'>
        <label className='flex items-center gap-2 cursor-pointer'>
          <Upload className='w-4 h-4 text-gray-500' />
          <span className='text-sm'>Upload files (PDF, DOCX, etc.)</span>
          <input
            type='file'
            multiple
            className='hidden'
            onChange={handleFileChange}
            accept='.pdf,.doc,.docx,.txt,.xlsx,.xls,.csv,.png,.jpg,.jpeg'
            disabled={uploading}
          />
        </label>
        {selectedFiles.length > 0 && (
          <div className='flex flex-col gap-1 mt-2'>
            {selectedFiles.map((file) => (
              <div key={file.name} className='flex items-center gap-2 text-sm'>
                <span>{file.name}</span>
                {uploading && (
                  <span className='text-xs text-gray-500'>
                    {uploadProgress[file.name] || 0}%
                  </span>
                )}
              </div>
            ))}
            <Button
              size='sm'
              onClick={handleUpload}
              disabled={uploading}
              className='mt-1 w-fit'
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </Button>
          </div>
        )}
        {error && <div className='text-red-500 text-xs'>{error}</div>}
      </div>
      <div className='mt-2'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>File Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Uploaded At</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isFetching ? (
              <TableRow>
                <TableCell colSpan={4}>Loading...</TableCell>
              </TableRow>
            ) : documents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className='text-gray-400'>
                  No documents uploaded.
                </TableCell>
              </TableRow>
            ) : (
              documents.map((doc) => (
                <TableRow key={doc.id} className='text-white'>
                  <TableCell>
                    <a
                      href={doc.file_path}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-blue-600 underline'
                    >
                      {doc.file_name}
                    </a>
                  </TableCell>
                  <TableCell>{doc.status}</TableCell>
                  <TableCell>
                    {doc.created_at ? new Date(doc.created_at).toLocaleString() : '-'}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant='destructive'
                      size='sm'
                      onClick={() => handleDelete(doc.id)}
                    >
                      <Trash2 className='w-4 h-4' />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default function WorkflowPage() {
  // API hooks
  const { data: fetchedWorkflows, refetch: refetchWorkflows } = useGet<
    { data: WorkflowResponse[] },
    object
  >(
    '/workflow/get-workflows',
    {},
    {
      showErrorToast: true,
      showSuccessToast: false,
      showLoader: true,
    },
  );

  const { mutate: manageWorkflow } = usePost<any, ManageWorkflowPayload>(
    '/workflow/manage',
    {
      showErrorToast: true,
      showSuccessToast: true,
      showLoader: true,
    },
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
    id: 0,
    question: '',
    answerType: 'yes_no',
    branch: {},
  });
  const [isStepDialogOpen, setIsStepDialogOpen] = useState(false);
  const [editingStepIndex, setEditingStepIndex] = useState<number | null>(null);

  // Sync fetched workflows
  React.useEffect(() => {
    if (fetchedWorkflows?.data) {
      setWorkflows(fetchedWorkflows.data);
    }
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
      onError: () => {
        toast.error('Failed to save workflow.');
      },
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
      onSuccess: () => {
        refetchWorkflows();
      },
      onError: () => {
        toast.error('Failed to delete workflow.');
      },
    });
  };

  // Handlers for step dialog
  const openNewStepDialog = () => {
    setEditingStepIndex(null);
    setStepForm({ id: 0, question: '', answerType: 'yes_no', branch: {} });
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
    setStepForm({ ...stepForm, [e.target.name]: e.target.value });
  };
  const saveStep = () => {
    if (!stepForm.question.trim()) return;
    const steps = [...workflowForm.steps];
    if (editingStepIndex !== null) {
      steps[editingStepIndex] = { ...stepForm, id: steps[editingStepIndex].id };
    } else {
      steps.push({ ...stepForm, id: steps.length + 1 });
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
    <div className='space-y-8 max-w-4xl mx-auto py-8'>
      <h1 className='text-3xl font-bold text-white'>Workflow Brain Center</h1>
      <p className='text-gray-400 mb-6'>
        Define, edit, and assign workflows for your groups. Each workflow is a set of
        questions and logic that powers your AI calling experience.
      </p>
      <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-xl font-bold text-gray-800'>Workflows</h2>
          <Button onClick={openNewWorkflowDialog} className='flex items-center gap-2'>
            <Plus className='w-4 h-4' /> New Workflow
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Steps</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {workflows.map((wf) => (
              <TableRow key={wf.id} className='text-white'>
                <TableCell className='font-medium text-gray-800'>{wf.name}</TableCell>
                <TableCell>{wf.description}</TableCell>
                <TableCell>{wf.steps.length}</TableCell>
                <TableCell>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => openEditWorkflowDialog(wf)}
                    className='mr-2'
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
        <DialogContent className='sm:max-w-[700px]'>
          <DialogHeader>
            <DialogTitle>
              {editingWorkflow ? 'Edit Workflow' : 'New Workflow'}
            </DialogTitle>
          </DialogHeader>
          <div className='space-y-4 py-2'>
            <div>
              <label className='block text-gray-700 font-semibold mb-1'>Name</label>
              <input
                className='w-full border rounded px-3 py-2'
                name='name'
                value={workflowForm.name}
                onChange={handleWorkflowFormChange}
                placeholder='Workflow name'
              />
            </div>
            <div>
              <label className='block text-gray-700 font-semibold mb-1'>
                Description
              </label>
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
                <span className='font-semibold text-gray-700'>Steps</span>
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
                      <TableHead>Question</TableHead>
                      <TableHead>Answer Type</TableHead>
                      <TableHead>Branch</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {workflowForm.steps.map((step, idx) => (
                      <TableRow key={step.id} className='text-white'>
                        <TableCell>{idx + 1}</TableCell>
                        <TableCell>{step.question}</TableCell>
                        <TableCell>
                          {ANSWER_TYPES.find((a) => a.value === step.answerType)?.label ||
                            step.answerType}
                        </TableCell>
                        <TableCell>
                          {step.branch && Object.keys(step.branch).length > 0
                            ? Object.entries(step.branch)
                                .map(([k, v]) => `${k}→${v}`)
                                .join(', ')
                            : '-'}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant='outline'
                            size='sm'
                            onClick={() => openEditStepDialog(step, idx)}
                            className='mr-2'
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
            {editingWorkflow || workflowForm.id ? (
              <WorkflowDocumentsManager workflowId={editingWorkflow ?? workflowForm.id} />
            ) : null}
          </div>
          <DialogFooter>
            <Button onClick={saveWorkflow}>
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
              <label className='block text-gray-700 font-semibold mb-1'>Question</label>
              <input
                className='w-full border rounded px-3 py-2'
                name='question'
                value={stepForm.question}
                onChange={handleStepFormChange}
                placeholder='What should the AI ask?'
              />
            </div>
            <div>
              <label className='block text-gray-700 font-semibold mb-1'>
                Answer Type
              </label>
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
                <label className='block text-gray-700 font-semibold mb-1'>
                  Branching (optional)
                </label>
                <div className='flex gap-2'>
                  <input
                    className='w-1/2 border rounded px-3 py-2'
                    placeholder='If Yes, go to step #'
                    type='number'
                    value={stepForm.branch?.yes || ''}
                    onChange={(e) =>
                      setStepForm({
                        ...stepForm,
                        branch: { ...stepForm.branch, yes: Number(e.target.value) },
                      })
                    }
                  />
                  <input
                    className='w-1/2 border rounded px-3 py-2'
                    placeholder='If No, go to step #'
                    type='number'
                    value={stepForm.branch?.no || ''}
                    onChange={(e) =>
                      setStepForm({
                        ...stepForm,
                        branch: { ...stepForm.branch, no: Number(e.target.value) },
                      })
                    }
                  />
                </div>
                <p className='text-xs text-gray-500 mt-1'>
                  Leave blank to go to next step automatically.
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button onClick={saveStep}>
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
