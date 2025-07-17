"use client";

import { useCallback, useEffect, useRef } from "react";
import { X, Phone, MessageCircle, PlayCircle, PhoneOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { WorkflowNode } from "@/types/workflow.types"; // Aligned with WorkflowCanvas and WorkflowBuilder

// Component props
interface NodePropertiesPanelProps {
    node: WorkflowNode;
    onNodeUpdate: (updates: Partial<WorkflowNode>) => void;
    onClose: () => void;
}

export function NodePropertiesPanel({ node, onNodeUpdate, onClose }: NodePropertiesPanelProps) {
    const panelRef = useRef<HTMLDivElement>(null);
    const isFocused = useRef(false);

    // Get node icon based on type
    const getNodeIcon = useCallback(() => {
        switch (node.type) {
            case "start":
                return <Phone className="h-4 w-4 text-workflow-start" />;
            case "question":
                return <MessageCircle className="h-4 w-4 text-workflow-question" />;
            case "action":
                return <PlayCircle className="h-4 w-4 text-workflow-action" />;
            case "end":
                return <PhoneOff className="h-4 w-4 text-workflow-end" />;
            default:
                return <PlayCircle className="h-4 w-4 text-muted-foreground" />;
        }
    }, [node.type]);

    // Get node type label
    const getNodeTypeLabel = useCallback(() => {
        switch (node.type) {
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
    }, [node.type]);

    // Handle label change
    const handleLabelChange = useCallback(
        (label: string) => {
            onNodeUpdate({
                data: {
                    ...node.data,
                    label,
                },
            });
        },
        [node.data, onNodeUpdate]
    );

    // Handle question text change
    const handleQuestionChange = useCallback(
        (question: string) => {
            onNodeUpdate({
                data: {
                    ...node.data,
                    question,
                },
            });
        },
        [node.data, onNodeUpdate]
    );

    // Handle answer type change
    const handleAnswerTypeChange = useCallback(
        (answerType: "yes_no" | "text" | "number" | "multiple_choice") => {
            onNodeUpdate({
                data: {
                    ...node.data,
                    answerType,
                    options: answerType === "multiple_choice" ? ["Option 1", "Option 2"] : undefined,
                },
            });
        },
        [node.data, onNodeUpdate]
    );

    // Handle action description change
    const handleActionChange = useCallback(
        (action: string) => {
            onNodeUpdate({
                data: {
                    ...node.data,
                    action,
                },
            });
        },
        [node.data, onNodeUpdate]
    );

    // Handle options change for multiple-choice questions
    const handleOptionsChange = useCallback(
        (options: string[]) => {
            onNodeUpdate({
                data: {
                    ...node.data,
                    options,
                },
            });
        },
        [node.data, onNodeUpdate]
    );

    // Add a new option
    const addOption = useCallback(() => {
        const currentOptions = node.data.options || [];
        handleOptionsChange([...currentOptions, `Option ${currentOptions.length + 1}`]);
    }, [node.data.options, handleOptionsChange]);

    // Remove an option
    const removeOption = useCallback(
        (index: number) => {
            const currentOptions = node.data.options || [];
            handleOptionsChange(currentOptions.filter((_, i) => i !== index));
        },
        [node.data.options, handleOptionsChange]
    );

    // Update an option
    const updateOption = useCallback(
        (index: number, value: string) => {
            const currentOptions = node.data.options || [];
            const newOptions = [...currentOptions];
            newOptions[index] = value;
            handleOptionsChange(newOptions);
        },
        [node.data.options, handleOptionsChange]
    );

    // Handle keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Only process shortcuts if the panel is focused
            if (!isFocused.current) return;

            switch (e.key.toLowerCase()) {
                case "escape":
                    e.preventDefault();
                    onClose();
                    break;
                case "enter":
                    if (e.ctrlKey || e.metaKey) {
                        e.preventDefault();
                        onNodeUpdate({ data: { ...node.data } }); // Trigger update to save changes
                    }
                    break;
                case "o":
                    if (e.ctrlKey || e.metaKey && node.type === "question" && node.data.answerType === "multiple_choice") {
                        e.preventDefault();
                        addOption();
                    }
                    break;
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [onClose, onNodeUpdate, node.data, node.type, addOption]);

    // Track focus state
    useEffect(() => {
        const panel = panelRef.current;
        if (!panel) return;

        const handleFocus = () => {
            isFocused.current = true;
        };
        const handleBlur = () => {
            isFocused.current = false;
        };

        panel.addEventListener("focus", handleFocus);
        panel.addEventListener("blur", handleBlur);
        return () => {
            panel.removeEventListener("focus", handleFocus);
            panel.removeEventListener("blur", handleBlur);
        };
    }, []);

    return (
        <div
            ref={panelRef}
            className="h-full bg-background border-l border-border flex flex-col"
            tabIndex={0}
            role="region"
            aria-label="Node Properties Panel"
        >
            {/* Header */}
            <div className="p-4 border-b border-border flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    {getNodeIcon()}
                    <span className="font-medium text-foreground">{getNodeTypeLabel()}</span>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="hover:bg-muted transition-all duration-200"
                    title="Close Panel (Esc)"
                    aria-label="Close Node Properties Panel"
                >
                    <X className="h-4 w-4" />
                </Button>
            </div>

            {/* Content */}
            <div className="flex-1 p-4 space-y-6 overflow-y-auto">
                {/* Basic Properties */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm text-foreground">Basic Properties</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="node-label" className="text-foreground">Label</Label>
                            <Input
                                id="node-label"
                                value={node.data.label}
                                onChange={(e) => handleLabelChange(e.target.value)}
                                placeholder="Enter node label"
                                className="mt-1"
                                aria-label="Node Label"
                            />
                        </div>

                        <div>
                            <Label className="text-foreground">Node Type</Label>
                            <div className="mt-1">
                                <Badge variant="secondary">{getNodeTypeLabel()}</Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Question Node Properties */}
                {node.type === "question" && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm text-foreground">Question Settings</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="question-text" className="text-foreground">Question Text</Label>
                                <Textarea
                                    id="question-text"
                                    value={node.data.question || ""}
                                    onChange={(e) => handleQuestionChange(e.target.value)}
                                    placeholder="What question should the AI ask?"
                                    className="mt-1"
                                    rows={3}
                                    aria-label="Question Text"
                                />
                            </div>

                            <div>
                                <Label htmlFor="answer-type" className="text-foreground">Expected Answer Type</Label>
                                <Select
                                    value={node.data.answerType || "yes_no"}
                                    onValueChange={handleAnswerTypeChange}
                                >
                                    <SelectTrigger className="mt-1" aria-label="Answer Type">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="yes_no">Yes/No</SelectItem>
                                        <SelectItem value="text">Free Text</SelectItem>
                                        <SelectItem value="number">Number</SelectItem>
                                        <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {node.data.answerType === "multiple_choice" && (
                                <div>
                                    <Label className="text-foreground">Answer Options</Label>
                                    <div className="mt-1 space-y-2">
                                        {(node.data.options || []).map((option, index) => (
                                            <div key={index} className="flex items-center space-x-2">
                                                <Input
                                                    value={option}
                                                    onChange={(e) => updateOption(index, e.target.value)}
                                                    placeholder={`Option ${index + 1}`}
                                                    aria-label={`Option ${index + 1}`}
                                                />
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() => removeOption(index)}
                                                    className="shrink-0"
                                                    title={`Remove Option ${index + 1}`}
                                                    aria-label={`Remove Option ${index + 1}`}
                                                >
                                                    <X className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        ))}
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={addOption}
                                            className="w-full"
                                            title="Add Option (Ctrl + O)"
                                            aria-label="Add Option"
                                        >
                                            Add Option
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* Action Node Properties */}
                {node.type === "action" && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm text-foreground">Action Settings</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="action-description" className="text-foreground">Action Description</Label>
                                <Textarea
                                    id="action-description"
                                    value={node.data.action || ""}
                                    onChange={(e) => handleActionChange(e.target.value)}
                                    placeholder="Describe what action the AI should perform"
                                    className="mt-1"
                                    rows={3}
                                    aria-label="Action Description"
                                />
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Start Node Properties */}
                {node.type === "start" && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm text-foreground">Start Call Settings</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                This node marks the beginning of your call workflow. Configure the initial greeting and setup in the label above.
                            </p>
                        </CardContent>
                    </Card>
                )}

                {/* End Node Properties */}
                {node.type === "end" && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm text-foreground">End Call Settings</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                This node marks the end of your call workflow. Configure the closing message in the label above.
                            </p>
                        </CardContent>
                    </Card>
                )}

                {/* Advanced Properties */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm text-foreground">Advanced</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="text-xs text-muted-foreground">
                            <div>Node ID: {node.id}</div>
                            <div>Position: ({node.position.x}, {node.position.y})</div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Keyboard Shortcuts Indicator */}
            <div className="p-4 border-t border-border bg-muted/30">
                <div className="text-xs font-semibold text-blue-300 mb-2">Keyboard Shortcuts</div>
                <div className="space-y-1 text-xs text-gray-300">
                    <div>
                        <kbd className="bg-gray-700 px-1.5 py-0.5 rounded text-xs">Esc</kbd> Close Panel
                    </div>
                    <div>
                        <kbd className="bg-gray-700 px-1.5 py-0.5 rounded text-xs">Ctrl + Enter</kbd> Save Changes
                    </div>
                    {node.type === "question" && node.data.answerType === "multiple_choice" && (
                        <div>
                            <kbd className="bg-gray-700 px-1.5 py-0.5 rounded text-xs">Ctrl + O</kbd> Add Option
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}