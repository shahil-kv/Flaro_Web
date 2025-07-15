"use client";

import { useState } from "react";
import {
    Phone,
    MessageCircle,
    PlayCircle,
    PhoneOff,
    Trash2,
    Link,
    Move,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { WorkflowNode } from "@/types/workflow.types";

interface WorkflowNodeComponentProps {
    node: WorkflowNode;
    isSelected: boolean;
    onSelect: () => void;
    onPositionChange: (position: { x: number; y: number }) => void;
    onDelete: () => void;
    onStartConnection: (sourceId: string, sourceType: string, position: { x: number; y: number }) => void;
    onCompleteConnection: (targetId: string) => void;
    connecting: { sourceId: string; sourceType: string; startPos: { x: number; y: number } } | null;
    dragMode: "pan" | "select";
    zoom: number;
}

export function WorkflowNodeComponent({
    node,
    isSelected,
    onSelect,
    onPositionChange,
    onDelete,
    onStartConnection,
    onCompleteConnection,
    connecting,
    dragMode,
}: WorkflowNodeComponentProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);

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

    const getNodeColor = () => {
        switch (node.type) {
            case "start":
                return "border-green-500 bg-green-50 dark:border-green-600 dark:bg-green-900/30";
            case "question":
                return "border-blue-500 bg-blue-50 dark:border-blue-600 dark:bg-blue-900/30";
            case "action":
                return "border-yellow-500 bg-yellow-50 dark:border-yellow-600 dark:bg-yellow-900/30";
            case "end":
                return "border-red-500 bg-red-50 dark:border-red-600 dark:bg-red-900/30";
            default:
                return "border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-800";
        }
    };

    const getNodeTypeLabel = () => {
        switch (node.type) {
            case "start":
                return "Start";
            case "question":
                return "Question";
            case "action":
                return "Action";
            case "end":
                return "End";
            default:
                return "Node";
        }
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (dragMode === "select") {
            setIsDragging(true);
            setDragStart({
                x: e.clientX - node.position.x,
                y: e.clientY - node.position.y,
            });
            onSelect();
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (isDragging && dragMode === "select") {
            e.preventDefault();
            const newPosition = {
                x: Math.max(0, e.clientX - dragStart.x),
                y: Math.max(0, e.clientY - dragStart.y),
            };
            onPositionChange(newPosition);
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    return (
        <div
            className={cn(
                "absolute select-none group transition-all duration-200",
                isSelected && "z-10",
                isDragging && "z-20 cursor-grabbing",
                dragMode === "select" ? (isDragging ? "cursor-grabbing" : "cursor-grab") : "cursor-pointer"
            )}
            style={{
                left: node.position.x,
                top: node.position.y,
                touchAction: "none",
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={() => {
                handleMouseUp();
                setIsHovering(false);
            }}
            onMouseEnter={() => setIsHovering(true)}
        >
            {/* Main Node */}
            <div
                className={cn(
                    "w-48 min-h-[80px] p-4 rounded-lg border-2 transition-all duration-200",
                    "bg-white/95 dark:bg-gray-800/95 shadow-lg hover:shadow-xl",
                    "hover:scale-[1.02] hover:-translate-y-1",
                    getNodeColor(),
                    isSelected ? "ring-2 ring-blue-500 dark:ring-blue-400 ring-offset-2 shadow-2xl scale-[1.02]" : "",
                    connecting?.sourceId === node.id ? "ring-2 ring-blue-500 dark:ring-blue-400 ring-offset-2 animate-pulse" : "",
                    connecting && connecting.sourceId !== node.id && node.type !== "start"
                        ? "ring-2 ring-green-500 dark:ring-green-400 ring-offset-2 hover:ring-green-600 dark:hover:ring-green-500"
                        : ""
                )}
            >
                {/* Node Header */}
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                        <div className="p-1 rounded-full bg-white/80 dark:bg-gray-800/80 shadow-sm">
                            {getNodeIcon()}
                        </div>
                        <Badge
                            variant="secondary"
                            className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-slate-200"
                        >
                            {getNodeTypeLabel()}
                        </Badge>
                    </div>

                    {isSelected && (
                        <div className="flex items-center space-x-1">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-100/80 dark:hover:bg-red-900/80 hover:text-red-500 dark:hover:text-red-400"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete();
                                }}
                            >
                                <Trash2 className="h-3 w-3" />
                            </Button>
                        </div>
                    )}
                </div>

                {/* Node Content */}
                <div className="space-y-2">
                    <div className="font-medium text-sm text-gray-900 dark:text-slate-200">{node.data.label}</div>

                    {node.type === "question" && node.data.question && (
                        <div className="text-xs text-gray-500 dark:text-slate-400 p-2 bg-gray-50 dark:bg-gray-700 rounded">
                            &quot;{node.data.question}&quot;
                        </div>
                    )}

                    {node.type === "question" && node.data.answerType && (
                        <Badge
                            variant="outline"
                            className="text-xs bg-white/80 dark:bg-gray-800/80 text-gray-900 dark:text-slate-200 border-gray-300 dark:border-gray-600"
                        >
                            {node.data.answerType.replace("_", "/")}
                        </Badge>
                    )}

                    {node.type === "action" && node.data.action && (
                        <div className="text-xs text-gray-500 dark:text-slate-400 p-2 bg-gray-50 dark:bg-gray-700 rounded">
                            {node.data.action}
                        </div>
                    )}
                </div>

                {/* Connection Points */}
                {node.type !== "end" && (
                    <div
                        className="absolute -right-2 top-1/2 transform -translate-y-1/2 group/output z-30"
                        onClick={(e) => {
                            e.stopPropagation();
                            if (connecting) {
                                onCompleteConnection(node.id);
                            } else {
                                const position = {
                                    x: node.position.x + 200,
                                    y: node.position.y + 40,
                                };
                                onStartConnection(node.id, node.type, position);
                            }
                        }}
                    >
                        <div
                            className={cn(
                                "w-6 h-6 border-3 border-white dark:border-gray-800 rounded-full cursor-pointer transition-all duration-200",
                                "shadow-lg hover:scale-125 hover:shadow-xl relative flex items-center justify-center group-hover/output:animate-pulse",
                                connecting?.sourceId === node.id
                                    ? "bg-blue-500 dark:bg-blue-600 scale-125 shadow-blue-500/50 dark:shadow-blue-600/50 animate-pulse"
                                    : "bg-gray-400 dark:bg-gray-600 hover:bg-gray-500 dark:hover:bg-gray-500"
                            )}
                        >
                            <div className="w-3 h-3 bg-white dark:bg-gray-800 rounded-full transition-all duration-200 group-hover/output:scale-90" />
                            <div className="absolute inset-0 rounded-full border-2 border-transparent transition-all duration-200 group-hover/output:border-blue-500/30 dark:group-hover/output:border-blue-400/30 group-hover/output:scale-150" />
                        </div>
                        {isSelected && !connecting && (
                            <div className="absolute top-8 left-1/2 transform -translate-x-1/2 text-xs bg-white/95 dark:bg-gray-900/95 text-gray-900 dark:text-slate-200 px-2 py-1 rounded shadow-lg whitespace-nowrap opacity-0 group-hover/output:opacity-100 transition-all duration-200 pointer-events-none">
                                Start connection
                            </div>
                        )}
                    </div>
                )}

                {node.type !== "start" && (
                    <div
                        className="absolute -left-2 top-1/2 transform -translate-y-1/2 group/input z-30"
                        onClick={(e) => {
                            e.stopPropagation();
                            if (connecting && connecting.sourceId !== node.id) {
                                onCompleteConnection(node.id);
                            }
                        }}
                    >
                        <div
                            className={cn(
                                "w-6 h-6 border-3 border-white dark:border-gray-800 rounded-full cursor-pointer transition-all duration-200",
                                "shadow-lg hover:scale-125 hover:shadow-xl relative flex items-center justify-center",
                                connecting && connecting.sourceId !== node.id
                                    ? "bg-green-500 dark:bg-green-600 animate-pulse scale-125 shadow-green-500/50 dark:shadow-green-600/50 group-hover/input:animate-ping"
                                    : "bg-gray-400 dark:bg-gray-600 hover:bg-gray-500 dark:hover:bg-gray-500"
                            )}
                        >
                            <div className="w-3 h-3 bg-white dark:bg-gray-800 rounded-full transition-all duration-200" />
                            {connecting && connecting.sourceId !== node.id && (
                                <div className="absolute inset-0 rounded-full border-2 border-green-400 dark:border-green-500 animate-ping" />
                            )}
                        </div>
                        {connecting && connecting.sourceId !== node.id && (
                            <div className="absolute top-8 left-1/2 transform -translate-x-1/2 text-xs bg-green-100/95 dark:bg-green-900/95 text-green-800 dark:text-green-200 px-2 py-1 rounded shadow-lg whitespace-nowrap pointer-events-none z-40">
                                Click to connect
                            </div>
                        )}
                    </div>
                )}

                {/* Drag Mode Indicator */}
                {dragMode === "select" && (isHovering || isSelected) && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500/20 dark:bg-blue-600/20 rounded-full flex items-center justify-center">
                        <Move className="h-3 w-3 text-blue-500 dark:text-blue-400" />
                    </div>
                )}
            </div>

            {/* Question Type Specific Outputs */}
            {node.type === "question" && node.data.answerType === "yes_no" && isSelected && (
                <div className="absolute top-full left-0 mt-2 space-y-1 z-20">
                    <div
                        className="flex items-center space-x-2 text-xs cursor-pointer hover:bg-green-100/80 dark:hover:bg-green-900/80 p-2 rounded-lg shadow-lg transition-all duration-200 hover:scale-105"
                        onClick={(e) => {
                            e.stopPropagation();
                            const position = {
                                x: node.position.x + 192,
                                y: node.position.y + 40,
                            };
                            onStartConnection(`${node.id}-yes`, "yes_path", position);
                        }}
                    >
                        <div className="w-3 h-3 bg-green-500 dark:bg-green-600 rounded-full shadow-sm" />
                        <span className="text-green-600 dark:text-green-200 bg-green-50/90 dark:bg-green-800/90 px-2 py-1 rounded">
                            Yes Path
                        </span>
                        <Link className="h-3 w-3 text-green-600 dark:text-green-200" />
                    </div>
                    <div
                        className="flex items-center space-x-2 text-xs cursor-pointer hover:bg-red-100/80 dark:hover:bg-red-900/80 p-2 rounded-lg shadow-lg transition-all duration-200 hover:scale-105"
                        onClick={(e) => {
                            e.stopPropagation();
                            const position = {
                                x: node.position.x + 192,
                                y: node.position.y + 40,
                            };
                            onStartConnection(`${node.id}-no`, "no_path", position);
                        }}
                    >
                        <div className="w-3 h-3 bg-red-500 dark:bg-red-600 rounded-full shadow-sm" />
                        <span className="text-red-600 dark:text-red-200 bg-red-50/90 dark:bg-red-800/90 px-2 py-1 rounded">
                            No Path
                        </span>
                        <Link className="h-3 w-3 text-red-600 dark:text-red-200" />
                    </div>
                </div>
            )}

            {/* Multiple Choice Options */}
            {node.type === "question" && node.data.answerType === "multiple_choice" && node.data.options && isSelected && (
                <div className="absolute top-full left-0 mt-2 space-y-1 z-20 max-w-48">
                    {node.data.options.map((option, index) => (
                        <div
                            key={index}
                            className="flex items-center space-x-2 text-xs cursor-pointer hover:bg-blue-100/80 dark:hover:bg-blue-900/80 p-2 rounded-lg shadow-lg transition-all duration-200 hover:scale-105"
                            onClick={(e) => {
                                e.stopPropagation();
                                const position = {
                                    x: node.position.x + 192,
                                    y: node.position.y + 40,
                                };
                                onStartConnection(`${node.id}-option-${index}`, "option_path", position);
                            }}
                        >
                            <div className="w-3 h-3 bg-blue-500 dark:bg-blue-600 rounded-full shadow-sm" />
                            <span className="text-blue-600 dark:text-blue-200 bg-blue-50/90 dark:bg-blue-800/90 px-2 py-1 rounded truncate">
                                {option}
                            </span>
                            <Link className="h-3 w-3 text-blue-600 dark:text-blue-200 flex-shrink-0" />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}