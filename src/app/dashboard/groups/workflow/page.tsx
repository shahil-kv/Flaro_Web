// 'use client';
// import * as React from 'react';
// import { useState } from 'react';
// import { Button } from '@/components/ui/button';
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from '@/components/ui/dialog';
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from '@/components/ui/table';
// import { Plus, Edit, Trash2 } from 'lucide-react';
// import { useGet, usePost } from '@/lib/useApi';
// import {
//   Workflow,
//   Step,
//   WorkflowResponse,
//   ManageWorkflowPayload,
// } from '@/types/workflow.types';
// import { toast } from 'sonner';

// const ANSWER_TYPES = [
//   { value: 'yes_no', label: 'Yes/No' },
//   { value: 'text', label: 'Text' },
//   { value: 'number', label: 'Number' },
//   { value: 'end', label: 'End' },
// ];

// function slugify(text: string) {
//   return text
//     .toLowerCase()
//     .replace(/[^a-z0-9]+/g, '_')
//     .replace(/^_+|_+$/g, '');
// }

// export default function WorkflowPage() {
//   // API hooks
//   const { data: fetchedWorkflows, refetch: refetchWorkflows } = useGet<
//     { data: WorkflowResponse[] },
//     object
//   >(
//     '/workflow/get-workflows',
//     {},
//     { showErrorToast: true, showSuccessToast: false, showLoader: true },
//   );

//   const { mutate: manageWorkflow } = usePost<any, ManageWorkflowPayload>(
//     '/workflow/manage',
//     { showErrorToast: true, showSuccessToast: true, showLoader: true },
//   );

//   // State
//   const [workflows, setWorkflows] = useState<WorkflowResponse[]>([]);
//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const [editingWorkflow, setEditingWorkflow] = useState<number | null>(null);
//   const [workflowForm, setWorkflowForm] = useState<Workflow>({
//     id: 0,
//     name: '',
//     description: '',
//     steps: [],
//   });
//   const [stepForm, setStepForm] = useState<Step>({
//     id: '',
//     question: '',
//     answerType: 'yes_no',
//     branch: {},
//   });
//   const [isStepDialogOpen, setIsStepDialogOpen] = useState(false);
//   const [editingStepIndex, setEditingStepIndex] = useState<number | null>(null);

//   React.useEffect(() => {
//     if (fetchedWorkflows?.data) setWorkflows(fetchedWorkflows.data);
//   }, [fetchedWorkflows]);

//   // Handlers for workflow dialog
//   const openNewWorkflowDialog = () => {
//     setEditingWorkflow(null);
//     setWorkflowForm({ id: 0, name: '', description: '', steps: [] });
//     setIsDialogOpen(true);
//   };
//   const openEditWorkflowDialog = (wf: WorkflowResponse) => {
//     setEditingWorkflow(wf.id);
//     setWorkflowForm({ ...wf });
//     setIsDialogOpen(true);
//   };
//   const handleWorkflowFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setWorkflowForm({ ...workflowForm, [e.target.name]: e.target.value });
//   };
//   const saveWorkflow = () => {
//     if (!workflowForm.name.trim()) return;
//     const payload: ManageWorkflowPayload = {
//       workflowId: editingWorkflow ?? undefined,
//       name: workflowForm.name,
//       description: workflowForm.description,
//       steps: workflowForm.steps,
//       opsMode: editingWorkflow ? 'UPDATE' : 'INSERT',
//     };
//     manageWorkflow(payload, {
//       onSuccess: () => {
//         setIsDialogOpen(false);
//         setEditingWorkflow(null);
//         setWorkflowForm({ id: 0, name: '', description: '', steps: [] });
//         refetchWorkflows();
//       },
//       onError: () => toast.error('Failed to save workflow.'),
//     });
//   };
//   const deleteWorkflow = (id: number) => {
//     const payload: ManageWorkflowPayload = {
//       workflowId: id,
//       name: '',
//       description: '',
//       steps: [],
//       opsMode: 'DELETE',
//     };
//     manageWorkflow(payload, {
//       onSuccess: () => refetchWorkflows(),
//       onError: () => toast.error('Failed to delete workflow.'),
//     });
//   };

//   // Step dialog handlers
//   const openNewStepDialog = () => {
//     setEditingStepIndex(null);
//     setStepForm({ id: '', question: '', answerType: 'yes_no', branch: {} });
//     setIsStepDialogOpen(true);
//   };
//   const openEditStepDialog = (step: Step, idx: number) => {
//     setEditingStepIndex(idx);
//     setStepForm({ ...step });
//     setIsStepDialogOpen(true);
//   };
//   const handleStepFormChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
//   ) => {
//     const { name, value } = e.target;
//     if (name === 'question' && editingStepIndex === null) {
//       setStepForm((prev) => ({
//         ...prev,
//         question: value,
//         id: slugify(value),
//       }));
//     } else {
//       setStepForm((prev) => ({
//         ...prev,
//         [name]: value,
//       }));
//     }
//   };
//   const getAvailableStepIds = () =>
//     workflowForm.steps
//       .filter((s) => s.id !== stepForm.id)
//       .map((s) => ({ id: s.id, label: s.question }));

//   const saveStep = () => {
//     if (!stepForm.question.trim()) return;
//     // Ensure unique step ID
//     if (
//       workflowForm.steps.some(
//         (s, idx) => s.id === stepForm.id && idx !== editingStepIndex,
//       )
//     ) {
//       toast.error('Step ID must be unique.');
//       return;
//     }
//     const steps = [...workflowForm.steps];
//     if (editingStepIndex !== null) {
//       steps[editingStepIndex] = { ...stepForm };
//     } else {
//       steps.push({ ...stepForm });
//     }
//     setWorkflowForm({ ...workflowForm, steps });
//     setIsStepDialogOpen(false);
//   };
//   const deleteStep = (idx: number) => {
//     const steps = [...workflowForm.steps];
//     steps.splice(idx, 1);
//     setWorkflowForm({ ...workflowForm, steps });
//   };

//   return (
//     <div className='space-y-8 max-w-4xl mx-auto py-8 bg-gray-100 dark:bg-gray-900'>
//       <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>
//         Workflow Brain Center
//       </h1>
//       <p className='text-gray-500 dark:text-gray-400 mb-6'>
//         Define, edit, and assign workflows for your groups. Each workflow is a set of
//         questions and logic that powers your AI calling experience.
//       </p>
//       <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6'>
//         <div className='flex justify-between items-center mb-4'>
//           <h2 className='text-xl font-bold text-gray-800 dark:text-gray-200'>
//             Workflows
//           </h2>
//           <Button
//             onClick={openNewWorkflowDialog}
//             className='flex items-center gap-2 bg-red-600 hover:bg-red-700 dark:hover:bg-red-500 text-white'
//           >
//             <Plus className='w-4 h-4' /> New Workflow
//           </Button>
//         </div>
//         <Table>
//           <TableHeader>
//             <TableRow className='bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700'>
//               <TableHead>Name</TableHead>
//               <TableHead>Description</TableHead>
//               <TableHead>Steps</TableHead>
//               <TableHead>Actions</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {workflows.map((wf) => (
//               <TableRow key={wf.id}>
//                 <TableCell>{wf.name}</TableCell>
//                 <TableCell>{wf.description}</TableCell>
//                 <TableCell>{wf.steps.length}</TableCell>
//                 <TableCell>
//                   <Button
//                     variant='outline'
//                     size='sm'
//                     onClick={() => openEditWorkflowDialog(wf)}
//                   >
//                     <Edit className='w-4 h-4' />
//                   </Button>
//                   <Button
//                     variant='destructive'
//                     size='sm'
//                     onClick={() => deleteWorkflow(wf.id)}
//                   >
//                     <Trash2 className='w-4 h-4' />
//                   </Button>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </div>

//       {/* Workflow Dialog */}
//       <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
//         <DialogContent className='sm:max-w-[700px] w-full h-[900px] overflow-auto'>
//           <DialogHeader>
//             <DialogTitle>
//               {editingWorkflow ? 'Edit Workflow' : 'New Workflow'}
//             </DialogTitle>
//           </DialogHeader>
//           <div className='space-y-4 py-2'>
//             <div>
//               <label className='block font-semibold mb-1'>Name</label>
//               <input
//                 className='w-full border rounded px-3 py-2'
//                 name='name'
//                 value={workflowForm.name}
//                 onChange={handleWorkflowFormChange}
//                 placeholder='Workflow name'
//               />
//             </div>
//             <div>
//               <label className='block font-semibold mb-1'>Description</label>
//               <input
//                 className='w-full border rounded px-3 py-2'
//                 name='description'
//                 value={workflowForm.description}
//                 onChange={handleWorkflowFormChange}
//                 placeholder='Short description'
//               />
//             </div>
//             <div>
//               <div className='flex justify-between items-center mb-2'>
//                 <span className='font-semibold'>Steps</span>
//                 <Button size='sm' onClick={openNewStepDialog}>
//                   <Plus className='w-4 h-4' /> Add Step
//                 </Button>
//               </div>
//               {workflowForm.steps.length === 0 ? (
//                 <p className='text-gray-500'>No steps added yet.</p>
//               ) : (
//                 <Table>
//                   <TableHeader>
//                     <TableRow>
//                       <TableHead>#</TableHead>
//                       <TableHead>Step ID</TableHead>
//                       <TableHead>Question</TableHead>
//                       <TableHead>Answer Type</TableHead>
//                       <TableHead>Branch</TableHead>
//                       <TableHead>Actions</TableHead>
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     {workflowForm.steps.map((step, idx) => (
//                       <TableRow key={step.id}>
//                         <TableCell>{idx + 1}</TableCell>
//                         <TableCell>{step.id}</TableCell>
//                         <TableCell>{step.question}</TableCell>
//                         <TableCell>
//                           {ANSWER_TYPES.find((a) => a.value === step.answerType)?.label ||
//                             step.answerType}
//                         </TableCell>
//                         <TableCell>
//                           {step.branch && Object.keys(step.branch).length > 0
//                             ? Object.entries(step.branch)
//                               .map(
//                                 ([k, v]) =>
//                                   `${k}→${workflowForm.steps.find((s) => s.id === v)
//                                     ?.question || v
//                                   }`,
//                               )
//                               .join(', ')
//                             : '-'}
//                         </TableCell>
//                         <TableCell>
//                           <Button
//                             variant='outline'
//                             size='sm'
//                             onClick={() => openEditStepDialog(step, idx)}
//                           >
//                             <Edit className='w-4 h-4' />
//                           </Button>
//                           <Button
//                             variant='destructive'
//                             size='sm'
//                             onClick={() => deleteStep(idx)}
//                           >
//                             <Trash2 className='w-4 h-4' />
//                           </Button>
//                         </TableCell>
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               )}
//             </div>
//           </div>
//           <DialogFooter>
//             <Button onClick={saveWorkflow} className='bg-red-600 text-white'>
//               {editingWorkflow ? 'Save Changes' : 'Create Workflow'}
//             </Button>
//             <Button variant='outline' onClick={() => setIsDialogOpen(false)}>
//               Cancel
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* Step Dialog */}
//       <Dialog open={isStepDialogOpen} onOpenChange={setIsStepDialogOpen}>
//         <DialogContent className='sm:max-w-[500px]'>
//           <DialogHeader>
//             <DialogTitle>
//               {editingStepIndex !== null ? 'Edit Step' : 'Add Step'}
//             </DialogTitle>
//           </DialogHeader>
//           <div className='space-y-4 py-2'>
//             <div>
//               <label className='block font-semibold mb-1'>Step ID</label>
//               <input
//                 className='w-full border rounded px-3 py-2'
//                 name='id'
//                 value={stepForm.id}
//                 onChange={handleStepFormChange}
//                 placeholder='Unique step ID (e.g. ask_budget)'
//               />
//               <p className='text-xs text-gray-500'>
//                 Auto-generated from question, but you can edit for clarity/uniqueness.
//               </p>
//             </div>
//             <div>
//               <label className='block font-semibold mb-1'>Question</label>
//               <input
//                 className='w-full border rounded px-3 py-2'
//                 name='question'
//                 value={stepForm.question}
//                 onChange={handleStepFormChange}
//                 placeholder='What should the AI ask?'
//               />
//             </div>
//             <div>
//               <label className='block font-semibold mb-1'>Answer Type</label>
//               <select
//                 className='w-full border rounded px-3 py-2'
//                 name='answerType'
//                 value={stepForm.answerType}
//                 onChange={handleStepFormChange}
//               >
//                 {ANSWER_TYPES.map((a) => (
//                   <option key={a.value} value={a.value}>
//                     {a.label}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             {stepForm.answerType === 'yes_no' && (
//               <div>
//                 <label className='block font-semibold mb-1'>Branching (optional)</label>
//                 <div className='flex gap-2'>
//                   <div className='w-1/2'>
//                     <label className='text-xs'>If Yes, go to</label>
//                     <select
//                       className='w-full border rounded px-2 py-1'
//                       value={stepForm.branch?.yes || ''}
//                       onChange={(e) =>
//                         setStepForm({
//                           ...stepForm,
//                           branch: { ...stepForm.branch, yes: e.target.value },
//                         })
//                       }
//                     >
//                       <option value=''>Next step (default)</option>
//                       {getAvailableStepIds().map((s) => (
//                         <option key={s.id} value={s.id}>
//                           {s.label} ({s.id})
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                   <div className='w-1/2'>
//                     <label className='text-xs'>If No, go to</label>
//                     <select
//                       className='w-full border rounded px-2 py-1'
//                       value={stepForm.branch?.no || ''}
//                       onChange={(e) =>
//                         setStepForm({
//                           ...stepForm,
//                           branch: { ...stepForm.branch, no: e.target.value },
//                         })
//                       }
//                     >
//                       <option value=''>Next step (default)</option>
//                       {getAvailableStepIds().map((s) => (
//                         <option key={s.id} value={s.id}>
//                           {s.label} ({s.id})
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                 </div>
//                 <p className='text-xs text-gray-500 mt-1'>
//                   Leave blank to go to next step automatically.
//                 </p>
//               </div>
//             )}
//           </div>
//           <DialogFooter>
//             <Button onClick={saveStep} className='bg-red-600 text-white'>
//               {editingStepIndex !== null ? 'Save Step' : 'Add Step'}
//             </Button>
//             <Button variant='outline' onClick={() => setIsStepDialogOpen(false)}>
//               Cancel
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }
"use client";

import { useState } from "react";
import { Plus, Upload, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/useToast";
import { Workflow } from "@/types/workflow.types";
import { WorkflowBuilder } from "@/components/dashboard/WorkflowBuilder";
import { WorkflowList } from "@/components/dashboard/WorkflowList";

export default function WorkflowsPage() {
  const [workflows, setWorkflows] = useState<Workflow[]>([
    {
      id: "1",
      name: "Lead Generation & Qualification",
      description: "Comprehensive lead generation workflow with qualification process",
      nodes: [
        {
          id: "start-1",
          type: "start",
          position: { x: 50, y: 100 },
          data: {
            label: "Start Call",
            nextNode: "question-1"
          }
        },
        {
          id: "question-1",
          type: "question",
          position: { x: 300, y: 100 },
          data: {
            label: "Introduction",
            question: "Hi! This is Sarah from Flaro. We help businesses improve their sales process. Do you have 2 minutes to talk?",
            answerType: "yes_no",
            yesNode: "question-2",
            noNode: "action-1"
          }
        },
        {
          id: "action-1",
          type: "action",
          position: { x: 550, y: 50 },
          data: {
            label: "Schedule Callback",
            action: "Schedule a callback for later and add to follow-up list",
            nextNode: "end-1"
          }
        },
        {
          id: "question-2",
          type: "question",
          position: { x: 550, y: 250 },
          data: {
            label: "Business Type",
            question: "What type of business do you run?",
            answerType: "multiple_choice",
            options: ["E-commerce", "SaaS", "Local Service", "Manufacturing", "Other"],
            nextNode: "question-3"
          }
        },
        {
          id: "question-3",
          type: "question",
          position: { x: 800, y: 250 },
          data: {
            label: "Team Size",
            question: "How many people are on your sales team?",
            answerType: "number",
            nextNode: "question-4"
          }
        },
        {
          id: "question-4",
          type: "question",
          position: { x: 1050, y: 150 },
          data: {
            label: "Pain Point",
            question: "What's your biggest challenge in generating leads right now?",
            answerType: "text",
            nextNode: "action-2"
          }
        },
        {
          id: "action-2",
          type: "action",
          position: { x: 1300, y: 150 },
          data: {
            label: "Qualify Lead",
            action: "Score lead based on responses and add to CRM with qualification data",
            nextNode: "question-5"
          }
        },
        {
          id: "question-5",
          type: "question",
          position: { x: 1550, y: 150 },
          data: {
            label: "Book Demo",
            question: "Based on what you've told me, I think Flaro could really help. Would you be interested in a 15-minute demo this week?",
            answerType: "yes_no",
            yesNode: "action-3",
            noNode: "action-4"
          }
        },
        {
          id: "action-3",
          type: "action",
          position: { x: 1800, y: 100 },
          data: {
            label: "Schedule Demo",
            action: "Send calendar link and book demo appointment",
            nextNode: "end-2"
          }
        },
        {
          id: "action-4",
          type: "action",
          position: { x: 1800, y: 300 },
          data: {
            label: "Send Resources",
            action: "Send relevant case studies and add to nurture sequence",
            nextNode: "end-3"
          }
        },
        {
          id: "end-1",
          type: "end",
          position: { x: 800, y: 50 },
          data: {
            label: "End - Callback Scheduled"
          }
        },
        {
          id: "end-2",
          type: "end",
          position: { x: 2050, y: 100 },
          data: {
            label: "End - Demo Booked"
          }
        },
        {
          id: "end-3",
          type: "end",
          position: { x: 2050, y: 300 },
          data: {
            label: "End - Nurture Sequence"
          }
        }
      ],
      edges: [
        { id: "e1", source: "start-1", target: "question-1", label: "" },
        { id: "e2", source: "question-1", target: "question-2", label: "Yes" },
        { id: "e3", source: "question-1", target: "action-1", label: "No" },
        { id: "e4", source: "action-1", target: "end-1", label: "" },
        { id: "e5", source: "question-2", target: "question-3", label: "" },
        { id: "e6", source: "question-3", target: "question-4", label: "" },
        { id: "e7", source: "question-4", target: "action-2", label: "" },
        { id: "e8", source: "action-2", target: "question-5", label: "" },
        { id: "e9", source: "question-5", target: "action-3", label: "Yes" },
        { id: "e10", source: "question-5", target: "action-4", label: "No" },
        { id: "e11", source: "action-3", target: "end-2", label: "" },
        { id: "e12", source: "action-4", target: "end-3", label: "" }
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true
    },
    {
      id: '2',
      name: 'Customer Support Flow',
      description: 'Basic customer support workflow for handling inquiries',
      nodes: [
        {
          id: 'start-support',
          type: 'start',
          position: { x: 50, y: 100 },
          data: { label: 'Start Support Call' }
        },
        {
          id: 'question-support',
          type: 'question',
          position: { x: 300, y: 100 },
          data: {
            label: 'Issue Type',
            question: 'What can I help you with today?',
            answerType: 'multiple_choice',
            options: ['Technical Issue', 'Billing Question', 'Feature Request', 'General Inquiry']
          }
        }
      ],
      edges: [
        { id: 'es1', source: 'start-support', target: 'question-support', label: '' }
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: false,
    }
  ]);

  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const { showSuccess } = useToast();

  const handleCreateWorkflow = () => {
    const newWorkflow: Workflow = {
      id: Date.now().toString(),
      name: 'New Workflow',
      description: 'New AI call agent workflow',
      nodes: [{
        id: 'start-1',
        type: 'start',
        position: { x: 100, y: 100 },
        data: { label: 'Start Call' }
      }],
      edges: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: false,
    };

    setWorkflows(prev => [...prev, newWorkflow]);
    setSelectedWorkflow(newWorkflow);
    setIsBuilderOpen(true);

    showSuccess("New workflow has been created successfully.");
  };

  const handleSaveWorkflow = (workflow: Workflow) => {
    setWorkflows(prev =>
      prev.map(w => w.id === workflow.id ? { ...workflow, updatedAt: new Date() } : w)
    );

    showSuccess("Workflow has been saved successfully.");
  };

  const handleDeleteWorkflow = (id: string) => {
    setWorkflows(prev => prev.filter(w => w.id !== id));
    if (selectedWorkflow?.id === id) {
      setSelectedWorkflow(null);
      setIsBuilderOpen(false);
    }

    showSuccess("Workflow has been deleted successfully.");
  };

  const handleToggleActive = (id: string) => {
    setWorkflows(prev =>
      prev.map(w => w.id === id ? { ...w, isActive: !w.isActive } : w)
    );
  };

  if (isBuilderOpen && selectedWorkflow) {
    return (
      <div className="h-full">
        <WorkflowBuilder
          workflow={selectedWorkflow}
          onSave={handleSaveWorkflow}
          onClose={() => setIsBuilderOpen(false)}
        />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-white h-full dark:bg-gray-800 text-gray-900 dark:text-slate-200">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">AI Call Workflows</h1>
          <p className="text-gray-500 dark:text-slate-400 mt-1">
            Create and manage your AI call agent workflows
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="border-gray-300 dark:border-gray-600 text-gray-900 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-gray-300 dark:border-gray-600 text-gray-900 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button
            onClick={handleCreateWorkflow}
            className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Workflow
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-slate-400">
              Total Workflows
            </CardTitle>
            <div className="text-2xl font-bold text-gray-900 dark:text-slate-200">{workflows.length}</div>
          </CardHeader>
        </Card>
        <Card className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-slate-400">
              Active Workflows
            </CardTitle>
            <div className="text-2xl font-bold text-green-600 dark:text-green-500">
              {workflows.filter(w => w.isActive).length}
            </div>
          </CardHeader>
        </Card>
        <Card className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-slate-400">
              Draft Workflows
            </CardTitle>
            <div className="text-2xl font-bold text-amber-600 dark:text-amber-500">
              {workflows.filter(w => !w.isActive).length}
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* Workflow List */}
      <Card className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-slate-200">Your Workflows</CardTitle>
          <CardDescription className="text-gray-500 dark:text-slate-400">
            Manage your AI call agent workflows. Click on a workflow to edit it.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <WorkflowList
            workflows={workflows}
            onEdit={(workflow) => {
              setSelectedWorkflow(workflow);
              setIsBuilderOpen(true);
            }}
            onDelete={handleDeleteWorkflow}
            onToggleActive={handleToggleActive}
          />
        </CardContent>
      </Card>
    </div>
  );
}