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
// function WorkflowDocumentsManager({ workflowId }: { workflowId?: number }) {
//   const [selectedFiles, setSelectedFiles] = React.useState<File[]>([]);
//   const [uploading, setUploading] = React.useState(false);
//   const [uploadProgress, setUploadProgress] = React.useState<{ [key: string]: number }>(
//     {},
//   );
//   const [error, setError] = React.useState<string | null>(null);
//   const [documents, setDocuments] = React.useState<any[]>([]);
//   const { data, refetch, isFetching } = useGet<
//     { data: any[] },
//     { userId?: string | number; sessionId?: number; workflowId?: number }
//   >(
//     '/workflow-document/get-documents',
//     { workflowId },
//     {
//       enabled: !!workflowId,
//       showErrorToast: true,
//       showSuccessToast: false,
//       showLoader: false,
//     },
//   );
//   const { mutate: manageDocument } = usePost<any, any>(
//     '/workflow-document/manage-documents',
//     {
//       showErrorToast: true,
//       showSuccessToast: true,
//       showLoader: true,
//     },
//   );

//   React.useEffect(() => {
//     if (data?.data) setDocuments(data.data);
//   }, [data]);

//   // Handle file selection
//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files) {
//       setSelectedFiles(Array.from(e.target.files));
//     }
//   };

//   // Handle upload
//   const handleUpload = async () => {
//     if (!workflowId || selectedFiles.length === 0) return;
//     setUploading(true);
//     setError(null);
//     for (const file of selectedFiles) {
//       const formData = new FormData();
//       formData.append('opsMode', 'INSERT');
//       formData.append('workflowId', String(workflowId));
//       formData.append('file', file);
//       try {
//         await new Promise((resolve, reject) => {
//           // Use XMLHttpRequest for progress
//           const xhr = new XMLHttpRequest();
//           xhr.open(
//             'POST',
//             'http://localhost:8080/api/v1/workflow-document/manage-documents',
//           );
//           xhr.upload.onprogress = (event) => {
//             if (event.lengthComputable) {
//               setUploadProgress((prev) => ({
//                 ...prev,
//                 [file.name]: Math.round((event.loaded / event.total) * 100),
//               }));
//             }
//           };
//           xhr.onload = () => {
//             if (xhr.status >= 200 && xhr.status < 300) {
//               resolve(xhr.response);
//             } else {
//               reject(xhr.statusText);
//             }
//           };
//           xhr.onerror = () => reject(xhr.statusText);
//           xhr.send(formData);
//         });
//         toast.success(`Uploaded: ${file.name}`);
//       } catch {
//         setError(`Failed to upload ${file.name}`);
//         toast.error(`Failed to upload ${file.name}`);
//       }
//     }
//     setSelectedFiles([]);
//     setUploading(false);
//     setUploadProgress({});
//     refetch();
//   };

//   // Handle delete
//   const handleDelete = (documentId: number) => {
//     manageDocument(
//       { opsMode: 'DELETE', documentId },
//       {
//         onSuccess: () => {
//           toast.success('Document deleted');
//           refetch();
//         },
//         onError: () => {
//           toast.error('Failed to delete document');
//         },
//       },
//     );
//   };

//   return (
//     <div className="mt-6">
//       <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
//         <FileText className="w-5 h-5" /> Documents
//       </h3>
//       <div className="flex flex-col gap-2 mb-2">
//         <label className="flex items-center gap-2 cursor-pointer text-gray-700 dark:text-gray-300">
//           <Upload className="w-4 h-4 text-gray-500" />
//           <span className="text-sm">Upload files (PDF, DOCX, etc.)</span>
//           <input
//             type="file"
//             multiple
//             className="hidden"
//             onChange={handleFileChange}
//             accept=".pdf,.doc,.docx,.txt,.xlsx,.xls,.csv,.png,.jpg,.jpeg"
//             disabled={uploading}
//           />
//         </label>
//         {selectedFiles.length > 0 && (
//           <div className="flex flex-col gap-1 mt-2">
//             {selectedFiles.map((file) => (
//               <div key={file.name} className="flex items-center gap-2 text-sm text-gray-900 dark:text-gray-300">
//                 <span>{file.name}</span>
//                 {uploading && (
//                   <span className="text-xs text-gray-500 dark:text-gray-400">
//                     {uploadProgress[file.name] || 0}%
//                   </span>
//                 )}
//               </div>
//             ))}
//             <Button
//               size="sm"
//               onClick={handleUpload}
//               disabled={uploading}
//               className="mt-1 w-fit bg-red-600 hover:bg-red-700 dark:hover:bg-red-500 text-white"
//             >
//               {uploading ? 'Uploading...' : 'Upload'}
//             </Button>
//           </div>
//         )}
//         {error && <div className="text-red-500 dark:text-red-400 text-xs">{error}</div>}
//       </div>
//       <div className="mt-2">
//         <Table>
//           <TableHeader>
//             <TableRow className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
//               <TableHead className="text-gray-700 dark:text-gray-300">File Name</TableHead>
//               <TableHead className="text-gray-700 dark:text-gray-300">Status</TableHead>
//               <TableHead className="text-gray-700 dark:text-gray-300">Uploaded At</TableHead>
//               <TableHead className="text-gray-700 dark:text-gray-300">Actions</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {isFetching ? (
//               <TableRow>
//                 <TableCell colSpan={4} className="text-gray-500 dark:text-gray-400">Loading...</TableCell>
//               </TableRow>
//             ) : documents.length === 0 ? (
//               <TableRow>
//                 <TableCell colSpan={4} className="text-gray-400 dark:text-gray-500">
//                   No documents uploaded.
//                 </TableCell>
//               </TableRow>
//             ) : (
//               documents.map((doc) => (
//                 <TableRow key={doc.id} className="text-gray-900 dark:text-gray-300">
//                   <TableCell>
//                     <a
//                       href={doc.file_path}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="text-blue-600 dark:text-blue-400 underline hover:text-blue-800 dark:hover:text-blue-300"
//                     >
//                       {doc.file_name}
//                     </a>
//                   </TableCell>
//                   <TableCell>{doc.status}</TableCell>
//                   <TableCell>
//                     {doc.created_at ? new Date(doc.created_at).toLocaleString() : '-'}
//                   </TableCell>
//                   <TableCell>
//                     <Button
//                       variant="destructive"
//                       size="sm"
//                       onClick={() => handleDelete(doc.id)}
//                       className="bg-red-600 hover:bg-red-700 dark:hover:bg-red-500 text-white"
//                     >
//                       <Trash2 className="w-4 h-4" />
//                     </Button>
//                   </TableCell>
//                 </TableRow>
//               ))
//             )}
//           </TableBody>
//         </Table>
//       </div>
//     </div>
//   );
// }

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
                                    `${k}→${
                                      workflowForm.steps.find((s) => s.id === v)
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
