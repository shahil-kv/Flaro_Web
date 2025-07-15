"use client";

import { useState, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, Move, Hand, MousePointer2, Maximize2 } from "lucide-react";
import { Workflow, WorkflowNode, WorkflowEdge } from "@/types/workflow.types";
import { WorkflowNodeComponent } from "./WorkflowNodeComponent";
import { cn } from "@/lib/utils";

interface WorkflowCanvasProps {
    workflow: Workflow;
    selectedNode: WorkflowNode | null;
    onNodeSelect: (node: WorkflowNode | null) => void;
    onNodeUpdate: (nodeId: string, updates: Partial<WorkflowNode>) => void;
    onNodeDelete: (nodeId: string) => void;
    onWorkflowUpdate: (workflow: Workflow) => void;
}

export function WorkflowCanvas({
    workflow,
    selectedNode,
    onNodeSelect,
    onNodeUpdate,
    onNodeDelete,
    onWorkflowUpdate,
}: WorkflowCanvasProps) {
    const [zoom, setZoom] = useState(1);
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [dragMode, setDragMode] = useState<"pan" | "select">("select");
    const [connecting, setConnecting] = useState<{
        sourceId: string;
        sourceType: string;
        startPos: { x: number; y: number };
    } | null>(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const canvasRef = useRef<HTMLDivElement>(null);

    const handleNodePositionUpdate = useCallback(
        (nodeId: string, position: { x: number; y: number }) => {
            onNodeUpdate(nodeId, { position });
        },
        [onNodeUpdate]
    );

    const handleCanvasMouseDown = (e: React.MouseEvent) => {
        if (dragMode === "pan") {
            e.preventDefault();
            setIsDragging(true);
            setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
            onNodeSelect(null);
        }
    };

    const handleCanvasMouseMove = (e: React.MouseEvent) => {
        const rect = canvasRef.current?.getBoundingClientRect();
        if (rect) {
            setMousePosition({
                x: (e.clientX - rect.left - pan.x) / zoom,
                y: (e.clientY - rect.top - pan.y) / zoom,
            });
        }

        if (isDragging && dragMode === "pan") {
            e.preventDefault();
            setPan({
                x: e.clientX - dragStart.x,
                y: e.clientY - dragStart.y,
            });
        }
    };

    const handleCanvasMouseUp = () => {
        setIsDragging(false);
    };

    const handleZoomIn = () => {
        setZoom((prev) => Math.min(prev * 1.2, 3));
    };

    const handleZoomOut = () => {
        setZoom((prev) => Math.max(prev / 1.2, 0.3));
    };

    const handleCreateConnection = (sourceId: string, targetId: string, label?: string) => {
        const newEdge: WorkflowEdge = {
            id: `edge-${sourceId}-${targetId}-${Date.now()}`,
            source: sourceId,
            target: targetId,
            label: label || "",
        };

        onWorkflowUpdate({
            ...workflow,
            edges: [...workflow.edges, newEdge],
        });
        setConnecting(null);
    };

    const handleStartConnection = (sourceId: string, sourceType: string, position: { x: number; y: number }) => {
        setConnecting({ sourceId, sourceType, startPos: position });
    };

    const handleCompleteConnection = (targetId: string) => {
        if (connecting && connecting.sourceId !== targetId) {
            const sourceNode = workflow.nodes.find((n) => n.id === connecting.sourceId);
            let label = "";

            if (sourceNode?.type === "question" && sourceNode.data.answerType === "yes_no") {
                label = connecting.sourceType === "yes_path" ? "Yes" : connecting.sourceType === "no_path" ? "No" : "";
            }

            handleCreateConnection(connecting.sourceId, targetId, label);
        }
    };

    const handleResetView = () => {
        setZoom(1);
        setPan({ x: 0, y: 0 });
    };

    return (
        <div className="h-full relative overflow-hidden bg-gray-100 dark:bg-gray-800">
            {/* Canvas Controls */}
            <div className="absolute top-4 right-4 z-10 flex flex-col space-y-2">
                {/* Drag Mode Toggle */}
                <div className="flex space-x-1 bg-white/95 dark:bg-gray-900/95 rounded-lg shadow-lg p-1">
                    <Button
                        variant={dragMode === "select" ? "default" : "ghost"}
                        size="icon"
                        onClick={() => setDragMode("select")}
                        className={cn(
                            dragMode === "select" ? "bg-blue-500 dark:bg-blue-600 text-white" : "text-gray-900 dark:text-slate-200",
                            "h-8 w-8 hover:bg-blue-100 dark:hover:bg-blue-900/80",
                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400 focus-visible:ring-offset-2 ring-offset-white dark:ring-offset-gray-900"
                        )}
                        title="Select Mode"
                    >
                        <MousePointer2 className="h-4 w-4" />
                    </Button>
                    <Button
                        variant={dragMode === "pan" ? "default" : "ghost"}
                        size="icon"
                        onClick={() => setDragMode("pan")}
                        className={cn(
                            dragMode === "pan" ? "bg-blue-500 dark:bg-blue-600 text-white" : "text-gray-900 dark:text-slate-200",
                            "h-8 w-8 hover:bg-blue-100 dark:hover:bg-blue-900/80",
                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400 focus-visible:ring-offset-2 ring-offset-white dark:ring-offset-gray-900"
                        )}
                        title="Pan Mode"
                    >
                        <Hand className="h-4 w-4" />
                    </Button>
                </div>

                {/* Zoom Controls */}
                <div className="flex flex-col space-y-1 bg-white/95 dark:bg-gray-900/95 rounded-lg shadow-lg p-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleZoomIn}
                        className={cn(
                            "h-8 w-8 text-gray-900 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-gray-700",
                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400 focus-visible:ring-offset-2 ring-offset-white dark:ring-offset-gray-900"
                        )}
                        title="Zoom In"
                    >
                        <ZoomIn className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleZoomOut}
                        className={cn(
                            "h-8 w-8 text-gray-900 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-gray-700",
                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400 focus-visible:ring-offset-2 ring-offset-white dark:ring-offset-gray-900"
                        )}
                        title="Zoom Out"
                    >
                        <ZoomOut className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleResetView}
                        className={cn(
                            "h-8 w-8 text-gray-900 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-gray-700",
                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400 focus-visible:ring-offset-2 ring-offset-white dark:ring-offset-gray-900"
                        )}
                        title="Reset View"
                    >
                        <Maximize2 className="h-4 w-4" />
                    </Button>
                    <div className="bg-white/90 dark:bg-gray-900/90 px-2 py-1 rounded text-xs text-center text-gray-900 dark:text-slate-200 min-w-[3rem]">
                        {Math.round(zoom * 100)}%
                    </div>
                </div>
            </div>

            {/* Canvas */}
            <div
                ref={canvasRef}
                className={cn(
                    "w-full h-full",
                    dragMode === "pan" ? (isDragging ? "cursor-grabbing" : "cursor-grab") : "cursor-default",
                    "select-none"
                )}
                onMouseDown={handleCanvasMouseDown}
                onMouseMove={handleCanvasMouseMove}
                onMouseUp={handleCanvasMouseUp}
                onMouseLeave={handleCanvasMouseUp}
                style={{ touchAction: "none" }}
            >
                <div
                    className="relative"
                    style={{
                        transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                        transformOrigin: "0 0",
                        width: "200%",
                        height: "200%",
                        backgroundImage: `radial-gradient(circle, #6b7280 1px, transparent 1px)`,
                        backgroundSize: "20px 20px",
                        backgroundPosition: `${pan.x}px ${pan.y}px`,
                        backgroundColor: "inherit",
                    }}
                >
                    {/* Render Connections */}
                    <svg
                        className="absolute inset-0 pointer-events-none"
                        style={{ width: "100%", height: "100%" }}
                    >
                        {workflow.edges.map((edge) => {
                            const sourceNode = workflow.nodes.find((n) => n.id === edge.source);
                            const targetNode = workflow.nodes.find((n) => n.id === edge.target);

                            if (!sourceNode || !targetNode) return null;

                            // Determine source coordinates based on sourceType
                            const sourceX = sourceNode.position.x + 200; // Default right side
                            let sourceY = sourceNode.position.y + 40; // Default center
                            if (sourceNode.type === "question" && sourceNode.data.answerType === "yes_no") {
                                sourceY = edge.label === "Yes" ? sourceNode.position.y + 20 : sourceNode.position.y + 60;
                            }

                            // Target is always the input dot on the left side
                            const targetX = targetNode.position.x - 8;
                            const targetY = targetNode.position.y + 40;

                            const deltaX = targetX - sourceX;
                            const controlOffset = Math.min(Math.abs(deltaX) * 0.5, 100);

                            const controlX1 = sourceX + controlOffset;
                            const controlY1 = sourceY;
                            const controlX2 = targetX - controlOffset;
                            const controlY2 = targetY;

                            // Determine stroke and fill based on edge label
                            const isYesPath = edge.label === "Yes";
                            const isNoPath = edge.label === "No";
                            const strokeColor = isYesPath
                                ? "stroke-green-500 dark:stroke-green-400"
                                : isNoPath
                                    ? "stroke-red-500 dark:stroke-red-400"
                                    : "stroke-gray-400 dark:stroke-gray-600";
                            const fillColor = isYesPath
                                ? "fill-green-500 dark:fill-green-400"
                                : isNoPath
                                    ? "fill-red-500 dark:fill-red-400"
                                    : "fill-gray-400 dark:fill-gray-600";
                            const hoverStroke = isYesPath
                                ? "hover:stroke-green-600 dark:hover:stroke-green-500"
                                : isNoPath
                                    ? "hover:stroke-red-600 dark:hover:stroke-red-500"
                                    : "hover:stroke-blue-500 dark:hover:stroke-blue-600";

                            return (
                                <g key={edge.id}>
                                    <path
                                        d={`M ${sourceX} ${sourceY} C ${controlX1} ${controlY1} ${controlX2} ${controlY2} ${targetX} ${targetY}`}
                                        strokeWidth="4"
                                        fill="none"
                                        opacity="0.3"
                                        className={strokeColor}
                                        transform="translate(2, 2)"
                                    />
                                    <path
                                        d={`M ${sourceX} ${sourceY} C ${controlX1} ${controlY1} ${controlX2} ${controlY2} ${targetX} ${targetY}`}
                                        strokeWidth="2"
                                        fill="none"
                                        markerEnd="url(#arrowhead)"
                                        className={cn("drop-shadow-sm transition-colors duration-200", strokeColor, hoverStroke)}
                                        style={{ cursor: "pointer" }}
                                    />
                                    <circle
                                        cx={sourceX}
                                        cy={sourceY}
                                        r="4"
                                        stroke="white"
                                        strokeWidth="2"
                                        className={cn("dark:stroke-gray-800", fillColor)}
                                    />
                                    <circle
                                        cx={targetX}
                                        cy={targetY}
                                        r="4"
                                        stroke="white"
                                        strokeWidth="2"
                                        className={cn("dark:stroke-gray-800", fillColor)}
                                    />
                                    {edge.label && (
                                        <text
                                            x={(sourceX + targetX) / 2}
                                            y={(sourceY + targetY) / 2 - 10}
                                            textAnchor="middle"
                                            className="text-xs text-gray-500 dark:text-slate-400"
                                            style={{ fontSize: "10px" }}
                                        >
                                            {edge.label}
                                        </text>
                                    )}
                                </g>
                            );
                        })}

                        {/* Connection Preview Line */}
                        {connecting && (
                            <g>
                                <defs>
                                    <filter id="connectionGlow">
                                        <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                                        <feMerge>
                                            <feMergeNode in="coloredBlur" />
                                            <feMergeNode in="SourceGraphic" />
                                        </feMerge>
                                    </filter>
                                </defs>
                                <path
                                    d={`M ${connecting.startPos.x} ${connecting.startPos.y} C ${connecting.startPos.x + 50} ${connecting.startPos.y} ${mousePosition.x - 50} ${mousePosition.y} ${mousePosition.x} ${mousePosition.y}`}
                                    stroke="#3b82f6"
                                    strokeWidth="3"
                                    strokeDasharray="8,4"
                                    fill="none"
                                    filter="url(#connectionGlow)"
                                    className="animate-pulse opacity-80 dark:stroke-blue-600"
                                />
                                <circle
                                    cx={connecting.startPos.x}
                                    cy={connecting.startPos.y}
                                    r="6"
                                    fill="#3b82f6"
                                    stroke="white"
                                    strokeWidth="2"
                                    className="animate-pulse dark:fill-blue-600 dark:stroke-gray-800"
                                />
                                <circle
                                    cx={mousePosition.x}
                                    cy={mousePosition.y}
                                    r="12"
                                    fill="#3b82f6"
                                    fillOpacity="0.2"
                                    stroke="#3b82f6"
                                    strokeWidth="2"
                                    className="animate-ping dark:fill-blue-600 dark:stroke-blue-600"
                                />
                                <circle
                                    cx={mousePosition.x}
                                    cy={mousePosition.y}
                                    r="6"
                                    fill="#3b82f6"
                                    stroke="white"
                                    strokeWidth="2"
                                    className="dark:fill-blue-600 dark:stroke-gray-800"
                                />
                            </g>
                        )}

                        {/* Arrow marker definition */}
                        <defs>
                            <marker
                                id="arrowhead"
                                markerWidth="10"
                                markerHeight="7"
                                refX="9"
                                refY="3.5"
                                orient="auto"
                            >
                                <polygon
                                    points="0 0, 10 3.5, 0 7"
                                    className="fill-gray-400 dark:fill-gray-600"
                                />
                            </marker>
                        </defs>
                    </svg>

                    {/* Render Nodes */}
                    {workflow.nodes.map((node) => (
                        <WorkflowNodeComponent
                            key={node.id}
                            node={node}
                            isSelected={selectedNode?.id === node.id}
                            onSelect={() => onNodeSelect(node)}
                            onPositionChange={(position: { x: number; y: number }) => handleNodePositionUpdate(node.id, position)}
                            onDelete={() => onNodeDelete(node.id)}
                            onStartConnection={handleStartConnection}
                            onCompleteConnection={handleCompleteConnection}
                            connecting={connecting}
                            dragMode={dragMode}
                            zoom={zoom}
                        />
                    ))}

                    {/* Connection Helper Text */}
                    {connecting && (
                        <div
                            className="absolute pointer-events-none z-30 bg-blue-500/90 dark:bg-blue-600/90 text-white px-3 py-2 rounded-lg shadow-lg"
                            style={{
                                left: mousePosition.x + 20,
                                top: mousePosition.y - 20,
                                transform: `scale(${1 / zoom})`,
                            }}
                        >
                            <div className="text-sm font-medium">Connecting...</div>
                            <div className="text-xs opacity-80">Click on a target node</div>
                        </div>
                    )}
                </div>
            </div>

            {/* Empty State */}
            {workflow.nodes.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="text-center text-gray-500 dark:text-slate-400">
                        <Move className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-slate-200">
                            Start Building Your Workflow
                        </h3>
                        <p className="text-sm">Add nodes from the left panel to create your AI call agent workflow</p>
                    </div>
                </div>
            )}
        </div>
    );
}