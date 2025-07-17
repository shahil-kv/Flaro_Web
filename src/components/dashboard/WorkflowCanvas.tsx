"use client";

import { useState, useCallback, useRef, useEffect, memo } from "react";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, Move, Hand, MousePointer2, Maximize2, Minimize2 } from "lucide-react";
import { Workflow, WorkflowNode, WorkflowEdge } from "@/types/workflow.types";
import { WorkflowNodeComponent } from "./WorkflowNodeComponent";
import { cn } from "@/lib/utils";

// Component props
interface WorkflowCanvasProps {
    workflow: Workflow;
    selectedNode: WorkflowNode | null;
    onNodeSelect: (node: WorkflowNode | null) => void;
    onNodeUpdate: (nodeId: string, updates: Partial<WorkflowNode>) => void;
    onNodeDelete: (nodeId: string) => void;
    onWorkflowUpdate: (workflow: Workflow) => void;
}

// Constants for node layout and canvas
const NODE_WIDTH = 208; // Matches WorkflowNodeComponent (w-52)
const NODE_HEIGHT = 100; // Matches WorkflowNodeComponent (min-h-[100px])
const NODE_MARGIN = 40; // Spacing between nodes
const GRID_SIZE = 50; // Grid snapping size
const MAX_ZOOM = 3; // Maximum zoom level
const MIN_ZOOM = 0.3; // Minimum zoom level

// Interfaces for control panel buttons
interface ModeButton {
    type: "mode";
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    mode: "pan" | "select";
    shortcut: string;
    description: string;
}

interface ActionButton {
    type: "action";
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    action: () => void;
    shortcut: string;
    description: string;
}

type ControlButton = ModeButton | ActionButton;

interface ControlSection {
    title: string;
    buttons: ControlButton[];
    footer?: React.ReactNode;
}

export const WorkflowCanvas = memo(
    ({
        workflow,
        selectedNode,
        onNodeSelect,
        onNodeUpdate,
        onNodeDelete,
        onWorkflowUpdate,
    }: WorkflowCanvasProps) => {
        // State management
        const [zoom, setZoom] = useState(1);
        const [pan, setPan] = useState({ x: 0, y: 0 });
        const [isDragging, setIsDragging] = useState(false);
        const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
        const [dragMode, setDragMode] = useState<"pan" | "select">("select");
        const [isFullscreen, setIsFullscreen] = useState(false);
        const [connecting, setConnecting] = useState<{
            sourceId: string;
            sourceType: string;
            startPos: { x: number; y: number };
        } | null>(null);
        const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
        const canvasRef = useRef<HTMLDivElement>(null);
        const containerRef = useRef<HTMLDivElement>(null);
        const isFocused = useRef(false);

        // Check for node overlap during positioning
        const checkNodeOverlap = useCallback(
            (newPos: { x: number; y: number }, nodeId: string) => {
                return workflow.nodes.some(
                    (node) =>
                        node.id !== nodeId &&
                        Math.abs(newPos.x - node.position.x) < NODE_WIDTH + NODE_MARGIN &&
                        Math.abs(newPos.y - node.position.y) < NODE_HEIGHT + NODE_MARGIN
                );
            },
            [workflow.nodes]
        );

        // Find nearest valid position for a node with grid snapping
        const findNearestValidPosition = useCallback(
            (targetPos: { x: number; y: number }, nodeId: string) => {
                const snappedPos = {
                    x: Math.round(targetPos.x / GRID_SIZE) * GRID_SIZE,
                    y: Math.round(targetPos.y / GRID_SIZE) * GRID_SIZE,
                };

                if (!checkNodeOverlap(snappedPos, nodeId)) return snappedPos;

                let bestPos = { ...snappedPos };
                let minDistance = Infinity;

                for (let radius = 1; radius <= 10; radius++) {
                    for (let angle = 0; angle < 360; angle += 30) {
                        const radian = (angle * Math.PI) / 180;
                        const distance = radius * (NODE_WIDTH + NODE_MARGIN);
                        const testPos = {
                            x: Math.max(
                                0,
                                Math.round((targetPos.x + Math.cos(radian) * distance) / GRID_SIZE) * GRID_SIZE
                            ),
                            y: Math.max(
                                0,
                                Math.round((targetPos.y + Math.sin(radian) * distance) / GRID_SIZE) * GRID_SIZE
                            ),
                        };

                        if (!checkNodeOverlap(testPos, nodeId)) {
                            const dist = Math.sqrt(
                                Math.pow(testPos.x - targetPos.x, 2) + Math.pow(testPos.y - targetPos.y, 2)
                            );
                            if (dist < minDistance) {
                                minDistance = dist;
                                bestPos = testPos;
                            }
                        }
                    }
                    if (minDistance < Infinity) break;
                }
                return bestPos;
            },
            [checkNodeOverlap]
        );

        // Handle keyboard shortcuts
        useEffect(() => {
            const handleKeyDown = (e: KeyboardEvent) => {
                if (!isFocused.current) return;

                if (e.ctrlKey || e.metaKey) {
                    switch (e.key) {
                        case "=":
                        case "+":
                            setZoom((prev) => Math.min(prev * 1.2, MAX_ZOOM));
                            e.preventDefault();
                            break;
                        case "-":
                            setZoom((prev) => Math.max(prev / 1.2, MIN_ZOOM));
                            e.preventDefault();
                            break;
                        case "0":
                            setZoom(1);
                            setPan({ x: 0, y: 0 });
                            e.preventDefault();
                            break;
                    }
                } else {
                    switch (e.key.toLowerCase()) {
                        case "v":
                            setDragMode("select");
                            break;
                        case "h":
                            setDragMode("pan");
                            break;
                        case "f":
                            setIsFullscreen((prev) => !prev);
                            break;
                        case "escape":
                            setIsFullscreen(false);
                            setConnecting(null);
                            break;
                    }
                }
            };

            window.addEventListener("keydown", handleKeyDown);
            return () => {
                window.removeEventListener("keydown", handleKeyDown);
            };
        }, []);

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

        // Update node position with collision detection
        const handleNodePositionUpdate = useCallback(
            (nodeId: string, position: { x: number; y: number }) => {
                onNodeUpdate(nodeId, { position: findNearestValidPosition(position, nodeId) });
            },
            [onNodeUpdate, findNearestValidPosition]
        );

        // Handle canvas pointer down for panning
        const handleCanvasPointerDown = useCallback(
            (e: React.PointerEvent<HTMLDivElement>) => {
                if (dragMode === "pan") {
                    e.preventDefault();
                    setIsDragging(true);
                    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
                    onNodeSelect(null);
                    const target = e.currentTarget as HTMLElement;
                    target.setPointerCapture(e.pointerId);
                }
            },
            [dragMode, pan, onNodeSelect]
        );

        // Handle canvas pointer move for mouse position and panning
        const handleCanvasPointerMove = useCallback(
            (e: React.PointerEvent<HTMLDivElement>) => {
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
            },
            [isDragging, dragMode, pan, dragStart, zoom]
        );

        // Handle canvas pointer up to end panning
        const handleCanvasPointerUp = useCallback(
            (e: React.PointerEvent<HTMLDivElement>) => {
                if (!isDragging) return;
                setIsDragging(false);
                const target = canvasRef.current;
                if (target && target.releasePointerCapture) {
                    target.releasePointerCapture(e.pointerId);
                }
            },
            [isDragging]
        );

        // Handle global pointer move for panning
        const handleGlobalPointerMove = useCallback(
            (e: PointerEvent) => {
                if (!isDragging || dragMode !== "pan") return;
                e.preventDefault();
                const rect = canvasRef.current?.getBoundingClientRect();
                if (rect) {
                    setMousePosition({
                        x: (e.clientX - rect.left - pan.x) / zoom,
                        y: (e.clientY - rect.top - pan.y) / zoom,
                    });
                }
                setPan({
                    x: e.clientX - dragStart.x,
                    y: e.clientY - dragStart.y,
                });
            },
            [isDragging, dragMode, pan, dragStart, zoom]
        );

        // Handle global pointer up for panning
        const handleGlobalPointerUp = useCallback(
            (e: PointerEvent) => {
                if (!isDragging) return;
                setIsDragging(false);
                const target = canvasRef.current;
                if (target && target.releasePointerCapture) {
                    target.releasePointerCapture(e.pointerId);
                }
            },
            [isDragging]
        );

        // Manage global pointer events for panning
        useEffect(() => {
            if (isDragging && dragMode === "pan") {
                document.addEventListener("pointermove", handleGlobalPointerMove, { passive: false });
                document.addEventListener("pointerup", handleGlobalPointerUp);
                document.addEventListener("pointerleave", handleGlobalPointerUp);
                document.body.style.userSelect = "none";
                document.body.style.cursor = "grabbing";
                return () => {
                    document.removeEventListener("pointermove", handleGlobalPointerMove);
                    document.removeEventListener("pointerup", handleGlobalPointerUp);
                    document.removeEventListener("pointerleave", handleGlobalPointerUp);
                    document.body.style.userSelect = "";
                    document.body.style.cursor = "";
                };
            }
        }, [isDragging, dragMode, handleGlobalPointerMove, handleGlobalPointerUp]);

        // Create a new edge between nodes
        const handleCreateConnection = useCallback(
            (sourceId: string, targetId: string, label?: string) => {
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
            },
            [onWorkflowUpdate, workflow]
        );

        // Start a connection from a node
        const handleStartConnection = useCallback(
            (sourceId: string, sourceType: string, position: { x: number; y: number }) => {
                setConnecting({ sourceId, sourceType, startPos: position });
            },
            []
        );

        // Complete a connection to a target node
        const handleCompleteConnection = useCallback(
            (targetId: string) => {
                if (connecting && connecting.sourceId !== targetId) {
                    const sourceNode = workflow.nodes.find((n) => n.id === connecting.sourceId);
                    let label = "";
                    if (sourceNode?.type === "question" && sourceNode.data.answerType === "yes_no") {
                        label = connecting.sourceType === "yes_path" ? "Yes" : connecting.sourceType === "no_path" ? "No" : "";
                    }
                    handleCreateConnection(connecting.sourceId, targetId, label);
                }
            },
            [connecting, workflow.nodes, handleCreateConnection]
        );

        // Get connection point coordinates for edges
        const getConnectionPoint = useCallback(
            (nodeId: string, isSource: boolean) => {
                const node = workflow.nodes.find((n) => n.id === nodeId);
                if (!node) return { x: 0, y: 0 };
                const baseX = node.position.x;
                const baseY = node.position.y + NODE_HEIGHT / 2;
                let sourceY = baseY;
                if (node.type === "question" && node.data.answerType === "yes_no" && isSource) {
                    sourceY = connecting?.sourceType === "yes_path" ? node.position.y + 25 : node.position.y + 75;
                }
                return isSource ? { x: baseX + NODE_WIDTH, y: sourceY } : { x: baseX, y: baseY };
            },
            [workflow.nodes, connecting]
        );

        // Render a single edge in SVG
        const renderEdge = useCallback(
            (edge: WorkflowEdge) => {
                const sourcePoint = getConnectionPoint(edge.source, true);
                const targetPoint = getConnectionPoint(edge.target, false);
                const deltaX = targetPoint.x - sourcePoint.x;
                const controlOffset = Math.min(Math.abs(deltaX) * 0.5, 100);
                const controlX1 = sourcePoint.x + controlOffset;
                const controlY1 = sourcePoint.y;
                const controlX2 = targetPoint.x - controlOffset;
                const controlY2 = targetPoint.y;
                const strokeColor = edge.label === "Yes"
                    ? "stroke-green-500 dark:stroke-green-400"
                    : edge.label === "No"
                        ? "stroke-red-500 dark:stroke-red-400"
                        : "stroke-blue-500 dark:stroke-blue-400";
                const fillColor = edge.label === "Yes"
                    ? "fill-green-500 dark:fill-green-400"
                    : edge.label === "No"
                        ? "fill-red-500 dark:fill-red-400"
                        : "fill-blue-500 dark:fill-blue-400";

                return (
                    <g key={edge.id}>
                        <path
                            d={`M ${sourcePoint.x} ${sourcePoint.y} C ${controlX1} ${controlY1} ${controlX2} ${controlY2} ${targetPoint.x} ${targetPoint.y}`}
                            strokeWidth="4"
                            fill="none"
                            opacity="0.3"
                            className={strokeColor}
                            transform="translate(2, 2)"
                        />
                        <path
                            d={`M ${sourcePoint.x} ${sourcePoint.y} C ${controlX1} ${controlY1} ${controlX2} ${controlY2} ${targetPoint.x} ${targetPoint.y}`}
                            strokeWidth="2"
                            fill="none"
                            markerEnd="url(#arrowhead)"
                            className={cn("drop-shadow-sm transition-colors duration-200", strokeColor)}
                            style={{ cursor: "pointer" }}
                        />
                        <circle
                            cx={sourcePoint.x}
                            cy={sourcePoint.y}
                            r="4"
                            stroke="white"
                            strokeWidth="2"
                            className={cn("dark:stroke-gray-800", fillColor)}
                        />
                        <circle
                            cx={targetPoint.x}
                            cy={targetPoint.y}
                            r="4"
                            stroke="white"
                            strokeWidth="2"
                            className={cn("dark:stroke-gray-800", fillColor)}
                        />
                        {edge.label && (
                            <text
                                x={(sourcePoint.x + targetPoint.x) / 2}
                                y={(sourcePoint.y + targetPoint.y) / 2 - 10}
                                textAnchor="middle"
                                className="text-xs text-gray-600 dark:text-gray-300 font-medium"
                                style={{ fontSize: "11px" }}
                            >
                                {edge.label}
                            </text>
                        )}
                    </g>
                );
            },
            [getConnectionPoint]
        );

        return (
            <div
                ref={containerRef}
                className={cn(
                    "relative overflow-hidden bg-gray-100 dark:bg-gray-900 transition-all duration-300",
                    isFullscreen ? "fixed inset-0 z-50 h-screen w-screen" : "h-full w-full",
                    "bg-[radial-gradient(circle,#9ca3af_1px,transparent_1px)] bg-[length:20px_20px]"
                )}
                style={{
                    backgroundPosition: `${pan.x}px ${pan.y}px`,
                }}
                role="region"
                aria-label="Workflow Canvas"
                tabIndex={0}
            >
                {/* Control Panel */}
                <div className="absolute top-4 right-4 z-20 space-y-4">
                    {([
                        {
                            title: "Canvas Mode",
                            buttons: [
                                {
                                    type: "mode" as const,
                                    icon: MousePointer2,
                                    label: "Select",
                                    mode: "select" as const,
                                    shortcut: "V",
                                    description: "Click and drag nodes",
                                },
                                {
                                    type: "mode" as const,
                                    icon: Hand,
                                    label: "Pan",
                                    mode: "pan" as const,
                                    shortcut: "H",
                                    description: "Drag to move canvas",
                                },
                            ],
                        },
                        {
                            title: "Zoom & View",
                            buttons: [
                                {
                                    type: "action" as const,
                                    icon: ZoomIn,
                                    label: "Zoom In",
                                    action: () => setZoom((prev) => Math.min(prev * 1.2, MAX_ZOOM)),
                                    shortcut: "⌘ +",
                                    description: "Zoom in canvas",
                                },
                                {
                                    type: "action" as const,
                                    icon: ZoomOut,
                                    label: "Zoom Out",
                                    action: () => setZoom((prev) => Math.max(prev / 1.2, MIN_ZOOM)),
                                    shortcut: "⌘ -",
                                    description: "Zoom out canvas",
                                },
                                {
                                    type: "action" as const,
                                    icon: Move,
                                    label: "Reset",
                                    action: () => {
                                        setZoom(1);
                                        setPan({ x: 0, y: 0 });
                                    },
                                    shortcut: "⌘ 0",
                                    description: "Reset view",
                                },
                            ],
                            footer: (
                                <div className="bg-gray-200 dark:bg-gray-800 px-2 py-1 rounded text-xs text-center text-gray-900 dark:text-gray-100 font-medium">
                                    {Math.round(zoom * 100)}%
                                </div>
                            ),
                        },
                        {
                            title: "Display",
                            buttons: [
                                {
                                    type: "action" as const,
                                    icon: isFullscreen ? Minimize2 : Maximize2,
                                    label: isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen",
                                    action: () => setIsFullscreen((prev) => !prev),
                                    shortcut: isFullscreen ? "F / ESC" : "F",
                                    description: isFullscreen ? "Exit fullscreen mode" : "Enter fullscreen mode",
                                },
                            ],
                        },
                    ] as ControlSection[]).map((section, index) => (
                        <div
                            key={index}
                            className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-3"
                        >
                            <div className="text-xs font-semibold text-gray-600 dark:text-gray-300 mb-2 px-2">
                                {section.title}
                            </div>
                            <div
                                className={cn(
                                    "flex flex-col space-y-1",
                                    section.title === "Canvas Mode" && "flex-row space-x-1 space-y-0"
                                )}
                            >
                                {section.buttons.map((btn) => (
                                    <Button
                                        key={btn.label}
                                        variant={btn.type === "mode" && dragMode === btn.mode ? "default" : "ghost"}
                                        size="sm"
                                        onClick={btn.type === "mode" ? () => setDragMode(btn.mode) : btn.action}
                                        className={cn(
                                            "h-8 px-3 text-xs transition-all duration-200",
                                            btn.type === "mode" && dragMode === btn.mode
                                                ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md"
                                                : btn.label.includes("Fullscreen")
                                                    ? "w-full justify-start text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                                    : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                        )}
                                        title={`${btn.description} (${btn.shortcut})`}
                                        aria-label={btn.description}
                                    >
                                        <btn.icon className="h-3 w-3 mr-2" />
                                        {btn.label}
                                    </Button>
                                ))}
                            </div>
                            {section.footer}
                        </div>
                    ))}
                </div>

                {/* Keyboard Shortcuts Indicator */}
                {isFullscreen && (
                    <div className="absolute top-4 left-4 z-20 bg-gray-800/90 dark:bg-gray-900/90 text-white text-xs px-4 py-3 rounded-lg backdrop-blur-sm shadow-xl border border-gray-700/30">
                        <div className="font-semibold mb-2 text-blue-300">Keyboard Shortcuts</div>
                        <div className="space-y-1 text-gray-300">
                            <div>
                                <kbd className="bg-gray-700 px-1.5 py-0.5 rounded text-xs">F</kbd> /{" "}
                                <kbd className="bg-gray-700 px-1.5 py-0.5 rounded text-xs">ESC</kbd> Toggle Fullscreen
                            </div>
                            <div>
                                <kbd className="bg-gray-700 px-1.5 py-0.5 rounded text-xs">V</kbd> Select Mode
                            </div>
                            <div>
                                <kbd className="bg-gray-700 px-1.5 py-0.5 rounded text-xs">H</kbd> Pan Mode
                            </div>
                            <div>
                                <kbd className="bg-gray-700 px-1.5 py-0.5 rounded text-xs">⌘+/-</kbd> Zoom
                            </div>
                            <div>
                                <kbd className="bg-gray-700 px-1.5 py-0.5 rounded text-xs">⌘0</kbd> Reset View
                            </div>
                            <div>
                                <kbd className="bg-gray-700 px-1.5 py-0.5 rounded text-xs">ESC</kbd> Cancel Connection
                            </div>
                        </div>
                    </div>
                )}

                {/* Canvas */}
                <div
                    ref={canvasRef}
                    className={cn(
                        "w-full h-full transition-all duration-200 select-none",
                        dragMode === "pan" ? (isDragging ? "cursor-grabbing" : "cursor-grab") : "cursor-default",
                        isDragging && "transition-none"
                    )}
                    onPointerDown={handleCanvasPointerDown}
                    onPointerMove={handleCanvasPointerMove}
                    onPointerUp={handleCanvasPointerUp}
                    onPointerLeave={handleCanvasPointerUp}
                    style={{ touchAction: "none" }}
                    role="application"
                    aria-label="Interactive Workflow Canvas"
                >
                    <div
                        className="relative"
                        style={{
                            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                            transformOrigin: "0 0",
                            width: "1000%",
                            height: "1000%",
                            willChange: isDragging ? "transform" : "auto",
                        }}
                    >
                        {/* Edges and Connections */}
                        <svg className="absolute inset-0 pointer-events-none" style={{ width: "100%", height: "100%" }}>
                            {workflow.edges.map(renderEdge)}
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
                                        strokeWidth="3"
                                        strokeDasharray="8,4"
                                        fill="none"
                                        filter="url(#connectionGlow)"
                                        className="stroke-blue-500 dark:stroke-blue-400 animate-pulse opacity-80"
                                    />
                                    <circle
                                        cx={connecting.startPos.x}
                                        cy={connecting.startPos.y}
                                        r="6"
                                        stroke="white"
                                        strokeWidth="2"
                                        className="fill-blue-500 dark:fill-blue-400 animate-pulse dark:stroke-gray-800"
                                    />
                                    <circle
                                        cx={mousePosition.x}
                                        cy={mousePosition.y}
                                        r="12"
                                        fillOpacity="0.2"
                                        strokeWidth="2"
                                        className="fill-blue-500 dark:fill-blue-400 stroke-blue-500 dark:stroke-blue-400 animate-ping"
                                    />
                                    <circle
                                        cx={mousePosition.x}
                                        cy={mousePosition.y}
                                        r="6"
                                        stroke="white"
                                        strokeWidth="2"
                                        className="fill-blue-500 dark:fill-blue-400 dark:stroke-gray-800"
                                    />
                                </g>
                            )}
                            <defs>
                                <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                                    <polygon
                                        points="0 0, 10 3.5, 0 7"
                                        className="fill-blue-500 dark:fill-blue-400"
                                    />
                                </marker>
                            </defs>
                        </svg>

                        {/* Nodes */}
                        {workflow.nodes.map((node) => (
                            <WorkflowNodeComponent
                                key={node.id}
                                node={node}
                                isSelected={selectedNode?.id === node.id}
                                onSelect={() => onNodeSelect(node)}
                                onPositionChange={(position: { x: number; y: number }) =>
                                    handleNodePositionUpdate(node.id, position)
                                }
                                onDelete={() => onNodeDelete(node.id)}
                                onStartConnection={handleStartConnection}
                                onCompleteConnection={handleCompleteConnection}
                                connecting={connecting}
                                dragMode={dragMode}
                                zoom={zoom}
                            />
                        ))}

                        {/* Connecting Tooltip */}
                        {connecting && (
                            <div
                                className="absolute pointer-events-none z-30 bg-blue-600/90 dark:bg-blue-700/90 text-white px-4 py-2 rounded-lg shadow-xl backdrop-blur-sm border border-blue-400/30"
                                style={{
                                    left: mousePosition.x + 20,
                                    top: mousePosition.y - 20,
                                    transform: `scale(${1 / zoom})`,
                                }}
                            >
                                <div className="text-sm font-semibold">Connecting...</div>
                                <div className="text-xs opacity-90 mt-1">Click target node or ESC to cancel</div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Empty State */}
                {workflow.nodes.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="text-center text-gray-500 dark:text-gray-400 max-w-md p-6">
                            <Move className="h-16 w-16 mx-auto mb-6 opacity-30" />
                            <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
                                Start Your Workflow
                            </h3>
                            <p className="text-sm mb-6 leading-relaxed">
                                Add nodes from the left panel to create your AI call agent workflow. Use the right controls to navigate and customize.
                            </p>
                            <div className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
                                <div className="flex items-center justify-center space-x-2">
                                    <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs font-mono">F</kbd>
                                    <span>Toggle fullscreen</span>
                                </div>
                                <div className="flex items-center justify-center space-x-2">
                                    <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs font-mono">V</kbd>
                                    <span>Select mode</span>
                                    <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs font-mono">H</kbd>
                                    <span>Pan mode</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }
);

WorkflowCanvas.displayName = "WorkflowCanvas";