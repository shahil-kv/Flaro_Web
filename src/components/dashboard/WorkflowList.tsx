"use client";

import { useCallback, useRef, useEffect, memo } from "react";
import { formatDistanceToNow } from "date-fns";
import { Edit, Trash2, Play, Pause, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Workflow } from "@/types/workflow.types"; // Aligned with WorkflowCanvas, WorkflowBuilder, NodePropertiesPanel

// Component props
interface WorkflowListProps {
    workflows: Workflow[];
    onEdit: (workflow: Workflow) => void;
    onDelete: (id: string) => void;
    onToggleActive: (id: string) => void;
}

export const WorkflowList = memo(({ workflows, onEdit, onDelete, onToggleActive }: WorkflowListProps) => {
    const tableRef = useRef<HTMLDivElement>(null);
    const isFocused = useRef(false);

    // Handle edit action
    const handleEdit = useCallback(
        (workflow: Workflow) => {
            onEdit(workflow);
        },
        [onEdit]
    );

    // Handle toggle active action
    const handleToggleActive = useCallback(
        (id: string) => {
            onToggleActive(id);
        },
        [onToggleActive]
    );

    // Handle delete action
    const handleDelete = useCallback(
        (id: string) => {
            onDelete(id);
        },
        [onDelete]
    );

    // Track focus state
    useEffect(() => {
        const table = tableRef.current;
        if (!table) return;

        const handleFocus = () => {
            isFocused.current = true;
        };
        const handleBlur = () => {
            isFocused.current = false;
        };

        table.addEventListener("focus", handleFocus);
        table.addEventListener("blur", handleBlur);
        return () => {
            table.removeEventListener("focus", handleFocus);
            table.removeEventListener("blur", handleBlur);
        };
    }, []);

    if (workflows.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="text-muted-foreground mb-4">No workflows found</div>
                <p className="text-sm text-muted-foreground">
                    Create your first AI call workflow to get started
                </p>
            </div>
        );
    }

    return (
        <div
            ref={tableRef}
            className="relative"
            tabIndex={0}
            role="grid"
            aria-label="Workflow List Table"
        >
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Updated</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {workflows.map((workflow) => (
                        <TableRow
                            key={workflow.id}
                            className="cursor-pointer hover:bg-muted/50 transition-all duration-200"
                            role="row"
                        >
                            <TableCell>
                                <div className="font-medium text-foreground">{workflow.name}</div>
                            </TableCell>
                            <TableCell>
                                <div
                                    className="text-sm text-muted-foreground max-w-[300px] truncate"
                                    title={workflow.description}
                                >
                                    {workflow.description}
                                </div>
                            </TableCell>
                            <TableCell>
                                <Badge
                                    variant={workflow.isActive ? "default" : "secondary"}
                                    className={workflow.isActive ? "bg-green-500 hover:bg-green-600" : ""}
                                >
                                    {workflow.isActive ? "Active" : "Draft"}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <div className="text-sm text-muted-foreground">
                                    {formatDistanceToNow(workflow.updatedAt, { addSuffix: true })}
                                </div>
                            </TableCell>
                            <TableCell>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            aria-label="Workflow Actions"
                                            title="Workflow Actions"
                                        >
                                            <MoreVertical className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => handleEdit(workflow)}>
                                            <Edit className="h-4 w-4 mr-2" />
                                            Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleToggleActive(workflow.id)}>
                                            {workflow.isActive ? (
                                                <>
                                                    <Pause className="h-4 w-4 mr-2" />
                                                    Deactivate
                                                </>
                                            ) : (
                                                <>
                                                    <Play className="h-4 w-4 mr-2" />
                                                    Activate
                                                </>
                                            )}
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() => handleDelete(workflow.id)}
                                            className="text-destructive"
                                        >
                                            <Trash2 className="h-4 w-4 mr-2" />
                                            Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
});

WorkflowList.displayName = "WorkflowList";