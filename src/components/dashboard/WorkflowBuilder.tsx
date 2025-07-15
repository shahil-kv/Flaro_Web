"use client";

import { useState } from "react";
import {
    ArrowLeft,
    Save,
    Play,
    MessageCircle,
    PlayCircle,
    Phone,
    PhoneOff,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Workflow, WorkflowNode } from "@/types/workflow.types";
import { WorkflowCanvas } from "./WorkflowCanvas";
import { NodePropertiesPanel } from "./NodePropertiesPanel";
import { cn } from "@/lib/utils"; // Add this line if you have a cn utility in your project

interface WorkflowBuilderProps {
    workflow: Workflow;
    onSave: (workflow: Workflow) => void;
    onClose: () => void;
}

export function WorkflowBuilder({ workflow, onSave, onClose }: WorkflowBuilderProps) {
    const [currentWorkflow, setCurrentWorkflow] = useState(workflow);
    const [selectedNode, setSelectedNode] = useState<WorkflowNode | null>(null);
    const [isLeftSidebarCollapsed, setIsLeftSidebarCollapsed] = useState(false);

    const handleSave = () => {
        onSave(currentWorkflow);
    };

    const handleAddNode = (type: WorkflowNode["type"]) => {
        const newNode: WorkflowNode = {
            id: `${type}-${Date.now()}`,
            type,
            position: { x: 200, y: 200 },
            data: {
                label: getDefaultLabel(type),
                ...(type === "question" && {
                    question: "",
                    answerType: "yes_no",
                }),
                ...(type === "action" && {
                    action: "",
                }),
            },
        };

        setCurrentWorkflow((prev) => ({
            ...prev,
            nodes: [...prev.nodes, newNode],
        }));
    };

    const getDefaultLabel = (type: WorkflowNode["type"]): string => {
        switch (type) {
            case "start":
                return "Start Call";
            case "question":
                return "Ask Question";
            case "action":
                return "Perform Action";
            case "end":
                return "End Call";
            default:
                return "Node";
        }
    };

    const handleNodeUpdate = (nodeId: string, updates: Partial<WorkflowNode>) => {
        setCurrentWorkflow((prev) => ({
            ...prev,
            nodes: prev.nodes.map((node) => (node.id === nodeId ? { ...node, ...updates } : node)),
        }));
    };

    const handleNodeDelete = (nodeId: string) => {
        setCurrentWorkflow((prev) => ({
            ...prev,
            nodes: prev.nodes.filter((node) => node.id !== nodeId),
            edges: prev.edges.filter((edge) => edge.source !== nodeId && edge.target !== nodeId),
        }));

        if (selectedNode?.id === nodeId) {
            setSelectedNode(null);
        }
    };

    return (
        <div className="h-screen flex flex-col bg-white dark:bg-gray-800">
            {/* Header */}
            <div className="border-b border-gray-300 dark:border-gray-600 p-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        className="text-gray-900 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400 focus-visible:ring-offset-2 ring-offset-white dark:ring-offset-gray-800"
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h1 className="text-xl font-semibold text-gray-900 dark:text-slate-200">{currentWorkflow.name}</h1>
                        <p className="text-sm text-gray-500 dark:text-slate-400">{currentWorkflow.description}</p>
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    <Badge
                        variant={currentWorkflow.isActive ? "default" : "secondary"}
                        className={
                            currentWorkflow.isActive
                                ? "bg-green-500 dark:bg-green-600 text-white hover:bg-green-600 dark:hover:bg-green-700"
                                : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-slate-200"
                        }
                    >
                        {currentWorkflow.isActive ? "Active" : "Draft"}
                    </Badge>
                    <Button
                        variant="outline"
                        onClick={handleSave}
                        className="border-gray-300 dark:border-gray-600 text-gray-900 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400 focus-visible:ring-offset-2 ring-offset-white dark:ring-offset-gray-800"
                    >
                        <Save className="h-4 w-4 mr-2" />
                        Save
                    </Button>
                    <Button
                        variant="default"
                        className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400 focus-visible:ring-offset-2 ring-offset-white dark:ring-offset-gray-800"
                    >
                        <Play className="h-4 w-4 mr-2" />
                        Test Flow
                    </Button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex">
                {/* Left Sidebar - Node Palette */}
                <div
                    className={cn(
                        isLeftSidebarCollapsed ? "w-16" : "w-64",
                        "border-r border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-900 transition-all duration-300 ease-in-out relative"
                    )}
                >
                    {/* Collapse Toggle */}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsLeftSidebarCollapsed(!isLeftSidebarCollapsed)}
                        className="absolute top-4 right-2 z-20 h-8 w-8 text-gray-900 dark:text-slate-200 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-all duration-200 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400 focus-visible:ring-offset-2 ring-offset-gray-100 dark:ring-offset-gray-900"
                        title={isLeftSidebarCollapsed ? "Expand Panel" : "Collapse Panel"}
                    >
                        {isLeftSidebarCollapsed ? (
                            <ChevronRight className="h-4 w-4" />
                        ) : (
                            <ChevronLeft className="h-4 w-4" />
                        )}
                    </Button>

                    <div className="p-4 pt-16">
                        {!isLeftSidebarCollapsed && <h3 className="font-medium mb-4 text-gray-900 dark:text-slate-200">Add Nodes</h3>}

                        <div className="space-y-2">
                            <Button
                                variant="outline"
                                className={cn(
                                    isLeftSidebarCollapsed ? "w-8 h-8 p-0" : "w-full justify-start",
                                    "border-gray-300 dark:border-gray-600 text-gray-900 dark:text-slate-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400 focus-visible:ring-offset-2 ring-offset-gray-100 dark:ring-offset-gray-900"
                                )}
                                onClick={() => handleAddNode("start")}
                                title="Start Call"
                            >
                                <Phone className="h-4 w-4 text-green-500 dark:text-green-400" />
                                {!isLeftSidebarCollapsed && <span className="ml-2">Start Call</span>}
                            </Button>

                            <Button
                                variant="outline"
                                className={cn(
                                    isLeftSidebarCollapsed ? "w-8 h-8 p-0" : "w-full justify-start",
                                    "border-gray-300 dark:border-gray-600 text-gray-900 dark:text-slate-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400 focus-visible:ring-offset-2 ring-offset-gray-100 dark:ring-offset-gray-900"
                                )}
                                onClick={() => handleAddNode("question")}
                                title="Ask Question"
                            >
                                <MessageCircle className="h-4 w-4 text-blue-500 dark:text-blue-400" />
                                {!isLeftSidebarCollapsed && <span className="ml-2">Ask Question</span>}
                            </Button>

                            <Button
                                variant="outline"
                                className={cn(
                                    isLeftSidebarCollapsed ? "w-8 h-8 p-0" : "w-full justify-start",
                                    "border-gray-300 dark:border-gray-600 text-gray-900 dark:text-slate-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400 focus-visible:ring-offset-2 ring-offset-gray-100 dark:ring-offset-gray-900"
                                )}
                                onClick={() => handleAddNode("action")}
                                title="Perform Action"
                            >
                                <PlayCircle className="h-4 w-4 text-yellow-500 dark:text-yellow-400" />
                                {!isLeftSidebarCollapsed && <span className="ml-2">Perform Action</span>}
                            </Button>

                            <Button
                                variant="outline"
                                className={cn(
                                    isLeftSidebarCollapsed ? "w-8 h-8 p-0" : "w-full justify-start",
                                    "border-gray-300 dark:border-gray-600 text-gray-900 dark:text-slate-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400 focus-visible:ring-offset-2 ring-offset-gray-100 dark:ring-offset-gray-900"
                                )}
                                onClick={() => handleAddNode("end")}
                                title="End Call"
                            >
                                <PhoneOff className="h-4 w-4 text-red-500 dark:text-red-400" />
                                {!isLeftSidebarCollapsed && <span className="ml-2">End Call</span>}
                            </Button>
                        </div>

                        {!isLeftSidebarCollapsed && (
                            <div className="mt-8">
                                <h3 className="font-medium mb-4 text-gray-900 dark:text-slate-200">Workflow Info</h3>
                                <div className="space-y-3">
                                    <div>
                                        <Label htmlFor="workflow-name" className="text-sm text-gray-900 dark:text-slate-200">
                                            Name
                                        </Label>
                                        <Input
                                            id="workflow-name"
                                            value={currentWorkflow.name}
                                            onChange={(e) =>
                                                setCurrentWorkflow((prev) => ({
                                                    ...prev,
                                                    name: e.target.value,
                                                }))
                                            }
                                            className="mt-1 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-slate-200 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400 focus-visible:ring-offset-2 ring-offset-white dark:ring-offset-gray-800"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="workflow-description" className="text-sm text-gray-900 dark:text-slate-200">
                                            Description
                                        </Label>
                                        <Textarea
                                            id="workflow-description"
                                            value={currentWorkflow.description}
                                            onChange={(e) =>
                                                setCurrentWorkflow((prev) => ({
                                                    ...prev,
                                                    description: e.target.value,
                                                }))
                                            }
                                            className="mt-1 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-slate-200 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400 focus-visible:ring-offset-2 ring-offset-white dark:ring-offset-gray-800"
                                            rows={3}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Main Canvas Area */}
                <div className="flex-1 flex">
                    <div className="flex-1 relative">
                        <WorkflowCanvas
                            workflow={currentWorkflow}
                            selectedNode={selectedNode}
                            onNodeSelect={setSelectedNode}
                            onNodeUpdate={handleNodeUpdate}
                            onNodeDelete={handleNodeDelete}
                            onWorkflowUpdate={setCurrentWorkflow}
                        />
                    </div>

                    {/* Right Sidebar - Properties */}
                    {selectedNode && (
                        <div className="w-80 border-l border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800">
                            <NodePropertiesPanel
                                node={selectedNode}
                                onNodeUpdate={(updates) => handleNodeUpdate(selectedNode.id, updates)}
                                onClose={() => setSelectedNode(null)}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}