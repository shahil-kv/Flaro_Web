"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import {
    ArrowLeft,
    Save,
    Play,
    Phone,
    MessageCircle,
    PlayCircle,
    PhoneOff,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Workflow, WorkflowNode } from "@/types/workflow.types"; // Aligned with WorkflowCanvas
import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";
import { WorkflowCanvas } from "./WorkflowCanvas";
import { NodePropertiesPanel } from "./NodePropertiesPanel";

// Component props
interface WorkflowBuilderProps {
    workflow: Workflow;
    onSave: (workflow: Workflow) => void;
    onClose: () => void;
}

export function WorkflowBuilder({ workflow, onSave, onClose }: WorkflowBuilderProps) {
    const [currentWorkflow, setCurrentWorkflow] = useState(workflow);
    const [selectedNode, setSelectedNode] = useState<WorkflowNode | null>(null);
    const [isLeftSidebarCollapsed, setIsLeftSidebarCollapsed] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const isFocused = useRef(false);

    // Get default label for node types
    const getDefaultLabel = useCallback((type: WorkflowNode["type"]): string => {
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
    }, []);

    // Handle adding a new node
    const handleAddNode = useCallback(
        (type: WorkflowNode["type"]) => {
            const newNode: WorkflowNode = {
                id: `${type}-${Date.now()}`,
                type,
                position: { x: 200, y: 200 }, // Matches WorkflowCanvas default positioning
                data: {
                    label: getDefaultLabel(type),
                    ...(type === "question" && {
                        question: "",
                        answerType: "yes_no" as const,
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
        },
        [getDefaultLabel]
    );

    // Handle node updates
    const handleNodeUpdate = useCallback(
        (nodeId: string, updates: Partial<WorkflowNode>) => {
            setCurrentWorkflow((prev) => ({
                ...prev,
                nodes: prev.nodes.map((node) =>
                    node.id === nodeId ? { ...node, ...updates } : node
                ),
            }));
        },
        []
    );

    // Handle node deletion
    const handleNodeDelete = useCallback(
        (nodeId: string) => {
            setCurrentWorkflow((prev) => ({
                ...prev,
                nodes: prev.nodes.filter((node) => node.id !== nodeId),
                edges: prev.edges.filter(
                    (edge) => edge.source !== nodeId && edge.target !== nodeId
                ),
            }));
            if (selectedNode?.id === nodeId) {
                setSelectedNode(null);
            }
        },
        [selectedNode]
    );

    // Handle save workflow
    const handleSave = useCallback(() => {
        onSave(currentWorkflow);
    }, [currentWorkflow, onSave]);

    // Handle keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Only process shortcuts if the component is focused
            if (!isFocused.current) return;

            if (e.ctrlKey || e.metaKey) {
                switch (e.key.toLowerCase()) {
                    case "s":
                        e.preventDefault();
                        handleSave();
                        break;
                    case "1":
                        e.preventDefault();
                        handleAddNode("start");
                        break;
                    case "2":
                        e.preventDefault();
                        handleAddNode("question");
                        break;
                    case "3":
                        e.preventDefault();
                        handleAddNode("action");
                        break;
                    case "4":
                        e.preventDefault();
                        handleAddNode("end");
                        break;
                    case "b":
                        e.preventDefault();
                        setIsLeftSidebarCollapsed((prev) => !prev);
                        break;
                }
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [handleSave, handleAddNode]);

    // Track focus state
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleFocus = () => {
            isFocused.current = true;
        };
        const handleBlur = () => {
            isFocused.current = false;
        };

        container.addEventListener("focus", handleFocus);
        container.addEventListener("blur", handleBlur);
        return () => {
            container.removeEventListener("focus", handleFocus);
            container.removeEventListener("blur", handleBlur);
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className="h-full flex flex-col bg-gray-50 dark:bg-gray-900"
            tabIndex={0}
            role="region"
            aria-label="Workflow Builder"
        >
            {/* Header */}
            <div className="border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
                        title="Close Workflow"
                        aria-label="Close Workflow"
                    >
                        <ArrowLeft className="h-4 w-4 text-gray-900 dark:text-gray-100" />
                    </Button>
                    <div>
                        <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                            {currentWorkflow.name}
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{currentWorkflow.description}</p>
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    <Badge
                        variant={currentWorkflow.isActive ? "default" : "secondary"}
                        className={
                            currentWorkflow.isActive
                                ? "bg-green-500 dark:bg-green-600 text-white"
                                : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        }
                    >
                        {currentWorkflow.isActive ? "Active" : "Draft"}
                    </Badge>
                    <Button
                        variant="outline"
                        onClick={handleSave}
                        className="border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
                        title="Save Workflow (Ctrl + S)"
                        aria-label="Save Workflow"
                    >
                        <Save className="h-4 w-4 mr-2 text-gray-900 dark:text-gray-100" />
                        Save
                    </Button>
                    <Button
                        variant="default"
                        className="bg-blue-500 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-700 text-white transition-all duration-200"
                        title="Test Workflow"
                        aria-label="Test Workflow"
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
                        "border-r border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 transition-all duration-300 ease-in-out relative",
                        isLeftSidebarCollapsed ? "w-16" : "w-64"
                    )}
                >
                    {/* Collapse Toggle */}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsLeftSidebarCollapsed(!isLeftSidebarCollapsed)}
                        className="absolute top-4 right-2 z-20 h-8 w-8 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-all duration-200 hover:shadow-md"
                        title={isLeftSidebarCollapsed ? "Expand Panel (Ctrl + B)" : "Collapse Panel (Ctrl + B)"}
                        aria-label={isLeftSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
                    >
                        {isLeftSidebarCollapsed ? (
                            <ChevronRight className="h-4 w-4 text-gray-900 dark:text-gray-100" />
                        ) : (
                            <ChevronLeft className="h-4 w-4 text-gray-900 dark:text-gray-100" />
                        )}
                    </Button>

                    <div className="p-4 pt-16">
                        {!isLeftSidebarCollapsed && (
                            <h3 className="font-medium mb-4 text-gray-900 dark:text-gray-100">Add Nodes</h3>
                        )}

                        <div className="space-y-2">
                            {[
                                { type: "start" as const, icon: Phone, label: "Start Call", shortcut: "Ctrl + 1" },
                                { type: "question" as const, icon: MessageCircle, label: "Ask Question", shortcut: "Ctrl + 2" },
                                { type: "action" as const, icon: PlayCircle, label: "Perform Action", shortcut: "Ctrl + 3" },
                                { type: "end" as const, icon: PhoneOff, label: "End Call", shortcut: "Ctrl + 4" },
                            ].map((node) => (
                                <Button
                                    key={node.type}
                                    variant="outline"
                                    className={cn(
                                        isLeftSidebarCollapsed ? "w-8 h-8 p-0" : "w-full justify-start",
                                        "border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 hover:shadow-md"
                                    )}
                                    onClick={() => handleAddNode(node.type)}
                                    title={`${node.label} (${node.shortcut})`}
                                    aria-label={`Add ${node.label}`}
                                >
                                    <node.icon
                                        className={cn(
                                            "h-4 w-4",
                                            node.type === "start" && "text-blue-500 dark:text-blue-400",
                                            node.type === "question" && "text-green-500 dark:text-green-400",
                                            node.type === "action" && "text-yellow-500 dark:text-yellow-400",
                                            node.type === "end" && "text-red-500 dark:text-red-400"
                                        )}
                                    />
                                    {!isLeftSidebarCollapsed && <span className="ml-2">{node.label}</span>}
                                </Button>
                            ))}
                        </div>

                        {!isLeftSidebarCollapsed && (
                            <div className="mt-8">
                                <h3 className="font-medium mb-4 text-gray-900 dark:text-gray-100">Workflow Info</h3>
                                <div className="space-y-3">
                                    <div>
                                        <Label htmlFor="workflow-name" className="text-sm text-gray-900 dark:text-gray-100">
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
                                            className="mt-1 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800"
                                            aria-label="Workflow Name"
                                        />
                                    </div>
                                    <div>
                                        <Label
                                            htmlFor="workflow-description"
                                            className="text-sm text-gray-900 dark:text-gray-100"
                                        >
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
                                            className="mt-1 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800"
                                            rows={3}
                                            aria-label="Workflow Description"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Main Canvas Area */}
                <div className="h-full w-full flex">
                    <div className="h-full w-full relative">
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
                        <div className="w-80 h-full border-l border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800">
                            <NodePropertiesPanel
                                node={selectedNode}
                                nodes={currentWorkflow.nodes}
                                connections={currentWorkflow.edges}
                                onNodeUpdate={(updates) => handleNodeUpdate(selectedNode.id, updates)}
                                onConnectionDelete={(connectionId: string) => {
                                    setCurrentWorkflow((prev) => ({
                                        ...prev,
                                        edges: prev.edges.filter(edge => edge.id !== connectionId),
                                    }));
                                }}
                                onClose={() => setSelectedNode(null)}
                            />
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
}