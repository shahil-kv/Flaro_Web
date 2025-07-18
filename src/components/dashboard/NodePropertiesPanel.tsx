"use client";

import { useCallback, useEffect, useRef } from "react";
import { X, Phone, MessageCircle, PlayCircle, PhoneOff, ArrowRight, Trash2, Link } from "lucide-react";
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
import { WorkflowNode } from "@/types/workflow.types";

// Connection type definition
interface Connection {
    id: string;
    source: string;
    target: string;
    sourceHandle?: string;
    targetHandle?: string;
    type?: string;
    label?: string;
}

// Component props
interface NodePropertiesPanelProps {
    node: WorkflowNode;
    nodes: WorkflowNode[];
    connections: Connection[];
    onNodeUpdate: (updates: Partial<WorkflowNode>) => void;
    onConnectionDelete: (connectionId: string) => void;
    onClose: () => void;
}

export function NodePropertiesPanel({
    node,
    nodes,
    connections,
    onNodeUpdate,
    onConnectionDelete,
    onClose
}: NodePropertiesPanelProps) {
    const panelRef = useRef<HTMLDivElement>(null);
    const isFocused = useRef(false);

    // Get node icon based on type
    const getNodeIcon = useCallback((nodeType: string) => {
        switch (nodeType) {
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
    }, []);

    // Get node type label
    const getNodeTypeLabel = useCallback((nodeType: string) => {
        switch (nodeType) {
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

    // Get connected nodes
    const getConnectedNodes = useCallback(() => {
        const incomingConnections = connections.filter(conn => conn.target === node.id);
        const outgoingConnections = connections.filter(conn => conn.source === node.id);

        const incoming = incomingConnections.map(conn => {
            const sourceNode = nodes.find(n => n.id === conn.source);
            return {
                connection: conn,
                node: sourceNode,
                direction: 'incoming' as const
            };
        }).filter(item => item.node);

        const outgoing = outgoingConnections.map(conn => {
            const targetNode = nodes.find(n => n.id === conn.target);
            return {
                connection: conn,
                node: targetNode,
                direction: 'outgoing' as const
            };
        }).filter(item => item.node);

        return { incoming, outgoing };
    }, [connections, nodes, node.id]);

    // Get connection label based on source handle
    const getConnectionLabel = useCallback((connection: Connection, sourceNode?: WorkflowNode) => {
        if (sourceNode?.type === "question" && sourceNode.data.answerType === "yes_no") {
            if (connection.sourceHandle === "yes") return "Yes";
            if (connection.sourceHandle === "no") return "No";
        }
        return connection.label || "Default";
    }, []);

    // Check if node can have multiple connections
    const canHaveMultipleConnections = useCallback((nodeType: string, answerType?: string) => {
        return nodeType === "question" && answerType === "yes_no";
    }, []);

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

    // Handle connection deletion
    const handleDeleteConnection = useCallback(
        (connectionId: string) => {
            onConnectionDelete(connectionId);
        },
        [onConnectionDelete]
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

    const connectedNodes = getConnectedNodes();

    return (
        <div
            ref={panelRef}
            className=" bg-background border-l border-border flex flex-col h-full"
            tabIndex={0}
            role="region"
            aria-label="Node Properties Panel"
        >
            {/* Header */}
            <div className="p-4 border-b border-border flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    {getNodeIcon(node.type)}
                    <span className="font-medium text-foreground">{getNodeTypeLabel(node.type)}</span>
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
            <div className="h-full w-full flex flex-col  p-4 space-y-6 overflow-y-auto">
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
                                <Badge variant="secondary">{getNodeTypeLabel(node.type)}</Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Connections */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm text-foreground flex items-center gap-2">
                            <Link className="h-4 w-4" />
                            Connections
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Incoming Connections */}
                        {connectedNodes.incoming.length > 0 && (
                            <div>
                                <Label className="text-foreground text-xs font-medium">Incoming Connections</Label>
                                <div className="mt-2 space-y-2">
                                    {connectedNodes.incoming.map(({ connection, node: connectedNode }) => (
                                        <div key={connection.id} className="flex items-center justify-between p-2 bg-muted/30 rounded-md">
                                            <div className="flex items-center space-x-2">
                                                {getNodeIcon(connectedNode!.type)}
                                                <span className="text-sm text-foreground">{connectedNode!.data.label}</span>
                                                <ArrowRight className="h-3 w-3 text-muted-foreground" />
                                                <Badge variant="outline" className="text-xs">
                                                    {getConnectionLabel(connection, connectedNode)}
                                                </Badge>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDeleteConnection(connection.id)}
                                                className="h-6 w-6 p-0 hover:bg-destructive/10 hover:text-destructive"
                                                title="Delete connection"
                                                aria-label="Delete connection"
                                            >
                                                <Trash2 className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Outgoing Connections */}
                        {connectedNodes.outgoing.length > 0 && (
                            <div>
                                <Label className="text-foreground text-xs font-medium">Outgoing Connections</Label>
                                <div className="mt-2 space-y-2">
                                    {connectedNodes.outgoing.map(({ connection, node: connectedNode }) => (
                                        <div key={connection.id} className="flex items-center justify-between p-2 bg-muted/30 rounded-md">
                                            <div className="flex items-center space-x-2">
                                                <Badge variant="outline" className="text-xs">
                                                    {getConnectionLabel(connection, node)}
                                                </Badge>
                                                <ArrowRight className="h-3 w-3 text-muted-foreground" />
                                                {getNodeIcon(connectedNode!.type)}
                                                <span className="text-sm text-foreground">{connectedNode!.data.label}</span>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDeleteConnection(connection.id)}
                                                className="h-6 w-6 p-0 hover:bg-destructive/10 hover:text-destructive"
                                                title="Delete connection"
                                                aria-label="Delete connection"
                                            >
                                                <Trash2 className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* No Connections */}
                        {connectedNodes.incoming.length === 0 && connectedNodes.outgoing.length === 0 && (
                            <div className="text-center py-4">
                                <p className="text-sm text-muted-foreground">No connections found</p>
                            </div>
                        )}

                        {/* Connection Rules Info */}
                        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-md">
                            <p className="text-xs text-blue-700 dark:text-blue-300">
                                <strong>Connection Rules:</strong> Only Yes/No question nodes can have multiple outgoing connections (Yes and No paths). All other nodes support single connections only.
                            </p>
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
                                {node.data.answerType === "yes_no" && (
                                    <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                                        This node can have two outgoing connections (Yes and No paths)
                                    </p>
                                )}
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
                            <div>Connections: {connectedNodes.incoming.length + connectedNodes.outgoing.length}</div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}