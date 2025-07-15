"use client";

import { X, Phone, MessageCircle, PlayCircle, PhoneOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { WorkflowNode } from "@/types/workflow.types";
import { Textarea } from "../ui/textarea";

interface NodePropertiesPanelProps {
    node: WorkflowNode;
    onNodeUpdate: (updates: Partial<WorkflowNode>) => void;
    onClose: () => void;
}

export function NodePropertiesPanel({ node, onNodeUpdate, onClose }: NodePropertiesPanelProps) {
    const getNodeIcon = () => {
        switch (node.type) {
            case "start":
                return <Phone className="h-4 w-4 text-green-500 dark:text-green-400" />;
            case "question":
                return <MessageCircle className="h-4 w-4 text-blue-500 dark:text-blue-400" />;
            case "action":
                return <PlayCircle className="h-4 w-4 text-yellow-500 dark:text-yellow-400" />;
            case "end":
                return <PhoneOff className="h-4 w-4 text-red-500 dark:text-red-400" />;
            default:
                return <PlayCircle className="h-4 w-4 text-gray-500 dark:text-slate-400" />;
        }
    };

    const getNodeTypeLabel = () => {
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
    };

    const handleLabelChange = (label: string) => {
        onNodeUpdate({
            data: {
                ...node.data,
                label,
            },
        });
    };

    const handleQuestionChange = (question: string) => {
        onNodeUpdate({
            data: {
                ...node.data,
                question,
            },
        });
    };

    const handleAnswerTypeChange = (answerType: "yes_no" | "text" | "number" | "multiple_choice") => {
        onNodeUpdate({
            data: {
                ...node.data,
                answerType,
                options: answerType === "multiple_choice" ? ["Option 1", "Option 2"] : undefined,
            },
        });
    };

    const handleActionChange = (action: string) => {
        onNodeUpdate({
            data: {
                ...node.data,
                action,
            },
        });
    };

    const handleOptionsChange = (options: string[]) => {
        onNodeUpdate({
            data: {
                ...node.data,
                options,
            },
        });
    };

    const addOption = () => {
        const currentOptions = node.data.options || [];
        handleOptionsChange([...currentOptions, `Option ${currentOptions.length + 1}`]);
    };

    const removeOption = (index: number) => {
        const currentOptions = node.data.options || [];
        handleOptionsChange(currentOptions.filter((_, i) => i !== index));
    };

    const updateOption = (index: number, value: string) => {
        const currentOptions = node.data.options || [];
        const newOptions = [...currentOptions];
        newOptions[index] = value;
        handleOptionsChange(newOptions);
    };

    return (
        <div className="h-full bg-white dark:bg-gray-800 border-l border-gray-300 dark:border-gray-600 flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-300 dark:border-gray-600 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    {getNodeIcon()}
                    <span className="font-medium text-gray-900 dark:text-slate-200">{getNodeTypeLabel()}</span>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="text-gray-900 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400 focus-visible:ring-offset-2 ring-offset-white dark:ring-offset-gray-800"
                >
                    <X className="h-4 w-4" />
                </Button>
            </div>

            {/* Content */}
            <div className="flex-1 p-4 space-y-6 overflow-y-auto">
                {/* Basic Properties */}
                <Card className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                    <CardHeader>
                        <CardTitle className="text-sm text-gray-900 dark:text-slate-200">Basic Properties</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="node-label" className="text-sm text-gray-900 dark:text-slate-200">
                                Label
                            </Label>
                            <Input
                                id="node-label"
                                value={node.data.label}
                                onChange={(e) => handleLabelChange(e.target.value)}
                                placeholder="Enter node label"
                                className="mt-1 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-slate-200 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400 focus-visible:ring-offset-2 ring-offset-white dark:ring-offset-gray-800"
                            />
                        </div>
                        <div>
                            <Label className="text-sm text-gray-900 dark:text-slate-200">Node Type</Label>
                            <div className="mt-1">
                                <Badge
                                    variant="secondary"
                                    className="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-slate-200"
                                >
                                    {getNodeTypeLabel()}
                                </Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Question Node Properties */}
                {node.type === "question" && (
                    <Card className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                        <CardHeader>
                            <CardTitle className="text-sm text-gray-900 dark:text-slate-200">Question Settings</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="question-text" className="text-sm text-gray-900 dark:text-slate-200">
                                    Question Text
                                </Label>
                                <Textarea
                                    id="question-text"
                                    value={node.data.question || ""}
                                    onChange={(e) => handleQuestionChange(e.target.value)}
                                    placeholder="What question should the AI ask?"
                                    className="mt-1 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-slate-200 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400 focus-visible:ring-offset-2 ring-offset-white dark:ring-offset-gray-800"
                                    rows={3}
                                />
                            </div>
                            <div>
                                <Label htmlFor="answer-type" className="text-sm text-gray-900 dark:text-slate-200">
                                    Expected Answer Type
                                </Label>
                                <Select
                                    value={node.data.answerType || "yes_no"}
                                    onValueChange={handleAnswerTypeChange}
                                >
                                    <SelectTrigger
                                        id="answer-type"
                                        className="mt-1 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-slate-200 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400 focus-visible:ring-offset-2 ring-offset-white dark:ring-offset-gray-800"
                                    >
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-slate-200">
                                        <SelectItem value="yes_no">Yes/No</SelectItem>
                                        <SelectItem value="text">Free Text</SelectItem>
                                        <SelectItem value="number">Number</SelectItem>
                                        <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            {node.data.answerType === "multiple_choice" && (
                                <div>
                                    <Label className="text-sm text-gray-900 dark:text-slate-200">Answer Options</Label>
                                    <div className="mt-1 space-y-2">
                                        {(node.data.options || []).map((option, index) => (
                                            <div key={index} className="flex items-center space-x-2">
                                                <Input
                                                    value={option}
                                                    onChange={(e) => updateOption(index, e.target.value)}
                                                    placeholder={`Option ${index + 1}`}
                                                    className="border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-slate-200 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400 focus-visible:ring-offset-2 ring-offset-white dark:ring-offset-gray-800"
                                                />
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() => removeOption(index)}
                                                    className="shrink-0 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400 focus-visible:ring-offset-2 ring-offset-white dark:ring-offset-gray-800"
                                                >
                                                    <X className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        ))}
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={addOption}
                                            className="w-full border-gray-300 dark:border-gray-600 text-gray-900 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400 focus-visible:ring-offset-2 ring-offset-white dark:ring-offset-gray-800"
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
                    <Card className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                        <CardHeader>
                            <CardTitle className="text-sm text-gray-900 dark:text-slate-200">Action Settings</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="action-description" className="text-sm text-gray-900 dark:text-slate-200">
                                    Action Description
                                </Label>
                                <Textarea
                                    id="action-description"
                                    value={node.data.action || ""}
                                    onChange={(e) => handleActionChange(e.target.value)}
                                    placeholder="Describe what action the AI should perform"
                                    className="mt-1 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-slate-200 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400 focus-visible:ring-offset-2 ring-offset-white dark:ring-offset-gray-800"
                                    rows={3}
                                />
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Start Node Properties */}
                {node.type === "start" && (
                    <Card className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                        <CardHeader>
                            <CardTitle className="text-sm text-gray-900 dark:text-slate-200">Start Call Settings</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-gray-500 dark:text-slate-400">
                                This node marks the beginning of your call workflow. Configure the initial greeting and setup in the label above.
                            </p>
                        </CardContent>
                    </Card>
                )}

                {/* End Node Properties */}
                {node.type === "end" && (
                    <Card className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                        <CardHeader>
                            <CardTitle className="text-sm text-gray-900 dark:text-slate-200">End Call Settings</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-gray-500 dark:text-slate-400">
                                This node marks the end of your call workflow. Configure the closing message in the label above.
                            </p>
                        </CardContent>
                    </Card>
                )}

                {/* Advanced Properties */}
                <Card className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                    <CardHeader>
                        <CardTitle className="text-sm text-gray-900 dark:text-slate-200">Advanced</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="text-xs text-gray-500 dark:text-slate-400">
                            <div>Node ID: {node.id}</div>
                            <div>Position: ({node.position.x}, {node.position.y})</div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}