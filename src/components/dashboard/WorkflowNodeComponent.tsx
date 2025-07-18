"use client";

import { useState, useCallback, useEffect, memo } from "react";
import { WorkflowNode } from "@/types/workflow.types";
import { Phone, MessageCircle, PlayCircle, PhoneOff, Trash2, Link } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

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

const NODE_WIDTH = 208;
const NODE_HEIGHT = 100;

export const WorkflowNodeComponent = memo(
    ({
        node,
        isSelected,
        onSelect,
        onPositionChange,
        onDelete,
        onStartConnection,
        onCompleteConnection,
        connecting,
        dragMode,
        zoom,
    }: WorkflowNodeComponentProps) => {
        const [isDragging, setIsDragging] = useState(false);
        const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
        const [initialPosition, setInitialPosition] = useState(node.position);

        const getNodeIcon = useCallback(() => {
            const icons = {
                start: Phone,
                question: MessageCircle,
                action: PlayCircle,
                end: PhoneOff,
            };
            const Icon = icons[node.type] || PlayCircle;
            return <Icon className="h-4 w-4" />;
        }, [node.type]);

        const getNodeColor = useCallback(() => {
            const colors = {
                start: "border-green-500 bg-green-50 dark:bg-green-900/50",
                question: "border-blue-500 bg-blue-50 dark:bg-blue-900/50",
                action: "border-purple-500 bg-purple-50 dark:bg-purple-900/50",
                end: "border-red-500 bg-red-50 dark:bg-red-900/50",
            };
            return colors[node.type] || "border-gray-300 bg-white dark:bg-gray-800";
        }, [node.type]);

        const getNodeTypeLabel = useCallback(() => {
            const labels = {
                start: "Start",
                question: "Question",
                action: "Action",
                end: "End",
            };
            return labels[node.type] || "Node";
        }, [node.type]);

        const handleMouseDown = useCallback(
            (e: React.PointerEvent) => {
                if (dragMode !== "select") return;
                e.stopPropagation();
                e.preventDefault();
                setIsDragging(true);
                setDragStart({ x: e.clientX, y: e.clientY });
                setInitialPosition(node.position);
                onSelect();
                const target = e.currentTarget as HTMLElement;
                target.setPointerCapture(e.pointerId);
            },
            [dragMode, onSelect, node.position]
        );

        const handleMouseMove = useCallback(
            (e: PointerEvent) => {
                if (!isDragging || dragMode !== "select") return;
                e.preventDefault();
                const deltaX = (e.clientX - dragStart.x) / zoom;
                const deltaY = (e.clientY - dragStart.y) / zoom;
                onPositionChange({
                    x: Math.max(0, initialPosition.x + deltaX),
                    y: Math.max(0, initialPosition.y + deltaY),
                });
            },
            [isDragging, dragMode, dragStart, initialPosition, onPositionChange, zoom]
        );

        const handleMouseUp = useCallback(
            (e: PointerEvent) => {
                if (!isDragging) return;
                setIsDragging(false);
                const target = e.target as HTMLElement;
                if (target && target.releasePointerCapture) {
                    target.releasePointerCapture(e.pointerId);
                }
            },
            [isDragging]
        );

        useEffect(() => {
            if (isDragging) {
                document.addEventListener("pointermove", handleMouseMove, { passive: false });
                document.addEventListener("pointerup", handleMouseUp);
                document.addEventListener("pointerleave", handleMouseUp);
                document.body.style.userSelect = "none";
                document.body.style.cursor = "grabbing";
                return () => {
                    document.removeEventListener("pointermove", handleMouseMove);
                    document.removeEventListener("pointerup", handleMouseUp);
                    document.removeEventListener("pointerleave", handleMouseUp);
                    document.body.style.userSelect = "";
                    document.body.style.cursor = "";
                };
            }
        }, [isDragging, handleMouseMove, handleMouseUp]);

        const handleConnectionStart = useCallback(
            (e: React.PointerEvent, connectionType: string = "default") => {
                e.stopPropagation();
                if (connecting) {
                    onCompleteConnection(node.id);
                } else {
                    const position = {
                        x: node.position.x + NODE_WIDTH,
                        y: node.position.y + (node.type === "question" && node.data.answerType === "yes_no"
                            ? connectionType === "yes_path" ? 25 : connectionType === "no_path" ? 75 : NODE_HEIGHT / 2
                            : NODE_HEIGHT / 2),
                    };
                    onStartConnection(node.id, connectionType, position);
                }
            },
            [connecting, node.id, node.position, node.type, node.data.answerType, onCompleteConnection, onStartConnection]
        );

        const handleConnectionEnd = useCallback(
            (e: React.PointerEvent) => {
                e.stopPropagation();
                if (connecting && connecting.sourceId !== node.id) {
                    onCompleteConnection(node.id);
                }
            },
            [connecting, node.id, onCompleteConnection]
        );

        return (
            <div
                className={cn(
                    "absolute select-none group transition-all duration-200",
                    isSelected && "z-10",
                    isDragging && "z-20",
                    dragMode === "select" && !isDragging ? "cursor-grab" : "",
                    isDragging && "cursor-grabbing"
                )}
                style={{
                    left: node.position.x,
                    top: node.position.y,
                    touchAction: "none",
                    willChange: isDragging ? "transform" : "auto",
                }}
                onPointerDown={handleMouseDown}
                role="button"
                tabIndex={0}
                aria-label={`${getNodeTypeLabel()} node: ${node.data.label}`}
            >
                {/* Main Node */}
                <div
                    className={cn(
                        "w-52 min-h-[100px] p-4 rounded-xl border-2 transition-all duration-200",
                        "bg-background/95 backdrop-blur-sm shadow-lg hover:shadow-xl",
                        !isDragging && "hover:scale-[1.02]",
                        getNodeColor(),
                        isSelected && "ring-2 ring-blue-500 dark:ring-blue-400 ring-offset-2 shadow-2xl scale-[1.02]",
                        connecting?.sourceId === node.id && "ring-2 ring-blue-500 dark:ring-blue-400 ring-offset-2 animate-pulse",
                        connecting && connecting.sourceId !== node.id && node.type !== "start" && "ring-2 ring-green-500 dark:ring-green-400 ring-offset-2 hover:ring-green-600 dark:hover:ring-green-500"
                    )}
                >
                    {/* Node Header */}
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                            <div className="p-1.5 rounded-full bg-white/80 dark:bg-gray-800/80 shadow-sm">
                                {getNodeIcon()}
                            </div>
                            <Badge variant="secondary" className="text-xs font-medium">
                                {getNodeTypeLabel()}
                            </Badge>
                        </div>
                        {isSelected && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 opacity-0 group-hover:opacity-100 hover:bg-red-100 dark:hover:bg-red-900/50 hover:text-red-600 dark:hover:text-red-400"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete();
                                }}
                                title="Delete node"
                                aria-label="Delete node"
                            >
                                <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                        )}
                    </div>

                    {/* Node Content */}
                    <div className="space-y-2">
                        <div className="font-semibold text-sm text-gray-900 dark:text-gray-100 truncate">
                            {node.data.label}
                        </div>
                        {node.type === "question" && node.data.question && (
                            <div className="text-xs text-gray-600 dark:text-gray-300 p-2 bg-gray-100 dark:bg-gray-800/50 rounded-lg">
                                &quot;{node.data.question}&quot;
                            </div>
                        )}
                        {node.type === "question" && node.data.answerType && (
                            <Badge variant="outline" className="text-xs border-gray-300 dark:border-gray-600">
                                {node.data.answerType.replace("_", "/")}
                            </Badge>
                        )}
                        {node.type === "action" && node.data.action && (
                            <div className="text-xs text-gray-600 dark:text-gray-300 p-2 bg-gray-100 dark:bg-gray-800/50 rounded-lg">
                                {node.data.action}
                            </div>
                        )}
                    </div>

                    {/* Connection Points */}
                    {node.type !== "end" && (
                        <div
                            className="absolute -right-3 top-1/2 -translate-y-1/2 z-30"
                            onPointerDown={handleConnectionStart}
                            role="button"
                            aria-label="Start connection"
                        >
                            <div
                                className={cn(
                                    "w-6 h-6 rounded-full cursor-pointer transition-all duration-200",
                                    "bg-blue-500 hover:bg-blue-600 dark:bg-blue-400 dark:hover:bg-blue-500 shadow-lg hover:shadow-xl hover:scale-110",
                                    "border-2 border-white dark:border-gray-900",
                                    "flex items-center justify-center",
                                    connecting?.sourceId === node.id && "bg-green-500 dark:bg-green-400 animate-pulse",
                                    connecting && connecting.sourceId !== node.id && "bg-green-500 dark:bg-green-400 animate-pulse"
                                )}
                            >
                                <div className="w-2 h-2 bg-white dark:bg-gray-900 rounded-full" />
                            </div>
                        </div>
                    )}
                    {node.type !== "start" && (
                        <div
                            className="absolute -left-3 top-1/2 -translate-y-1/2 z-30"
                            onPointerDown={handleConnectionEnd}
                            role="button"
                            aria-label="End connection"
                        >
                            <div
                                className={cn(
                                    "w-6 h-6 rounded-full cursor-pointer transition-all duration-200",
                                    "bg-gray-400 hover:bg-gray-500 dark:bg-gray-500 dark:hover:bg-gray-600 shadow-lg hover:shadow-xl hover:scale-110",
                                    "border-2 border-white dark:border-gray-900",
                                    "flex items-center justify-center",
                                    connecting && connecting.sourceId !== node.id && "bg-green-500 dark:bg-green-400 animate-pulse"
                                )}
                            >
                                <div className="w-2 h-2 bg-white dark:bg-gray-900 rounded-full" />
                            </div>
                        </div>
                    )}
                </div>

                {/* Question Type Outputs */}
                {node.type === "question" && node.data.answerType === "yes_no" && isSelected && (
                    <div className="absolute top-full left-0 mt-2 space-y-1.5 z-20">
                        {[
                            { type: "yes_path", label: "Yes", color: "green", bg: "bg-green-50 dark:bg-green-900/50" },
                            { type: "no_path", label: "No", color: "red", bg: "bg-red-50 dark:bg-red-900/50" },
                        ].map(({ type, label, color, bg }) => (
                            <div
                                key={type}
                                className={cn(
                                    "flex items-center space-x-2 text-xs cursor-pointer p-2 rounded-lg shadow-lg transition-all duration-200",
                                    `hover:${bg} hover:bg-opacity-80`
                                )}
                                onPointerDown={(e) => handleConnectionStart(e, type)}
                                role="button"
                                aria-label={`Connect ${label} path`}
                            >
                                <div className={`w-3 h-3 bg-${color}-500 rounded-full`} />
                                <span className={`text-${color}-600 dark:text-${color}-400 ${bg} px-2 py-1 rounded`}>{label}</span>
                                <Link className={`h-3 w-3 text-${color}-600 dark:text-${color}-400`} />
                            </div>
                        ))}
                    </div>
                )}

                {node.type === "question" && node.data.answerType === "multiple_choice" && node.data.options && isSelected && (
                    <div className="absolute top-full left-0 mt-2 space-y-1.5 z-20 max-w-52">
                        {node.data.options.map((option, index) => (
                            <div
                                key={index}
                                className="flex items-center space-x-2 text-xs cursor-pointer p-2 rounded-lg shadow-lg transition-all duration-200 hover:bg-blue-100/80 dark:hover:bg-blue-900/50"
                                onPointerDown={(e) => handleConnectionStart(e, `option_${index}`)}
                                role="button"
                                aria-label={`Connect option: ${option}`}
                            >
                                <div className="w-3 h-3 bg-blue-500 rounded-full" />
                                <span className="text-blue-600 dark:text-blue-400 bg-blue-50/90 dark:bg-blue-900/50 px-2 py-1 rounded truncate">
                                    {option}
                                </span>
                                <Link className="h-3 w-3 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    }
);

WorkflowNodeComponent.displayName = "WorkflowNodeComponent";