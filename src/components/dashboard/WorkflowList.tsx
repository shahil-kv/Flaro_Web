"use client";

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
import { Workflow } from "@/types/workflow.types";

interface WorkflowListProps {
    workflows: Workflow[];
    onEdit: (workflow: Workflow) => void;
    onDelete: (id: string) => void;
    onToggleActive: (id: string) => void;
}

export function WorkflowList({ workflows, onEdit, onDelete, onToggleActive }: WorkflowListProps) {
    if (workflows.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="text-gray-500 dark:text-slate-400 mb-4">No workflows found</div>
                <p className="text-sm text-gray-500 dark:text-slate-400">
                    Create your first AI call workflow to get started
                </p>
            </div>
        );
    }

    return (
        <Table>
            <TableHeader>
                <TableRow className="bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-600">
                    <TableHead className="text-gray-900 dark:text-slate-200">Name</TableHead>
                    <TableHead className="text-gray-900 dark:text-slate-200">Description</TableHead>
                    <TableHead className="text-gray-900 dark:text-slate-200">Status</TableHead>
                    <TableHead className="text-gray-900 dark:text-slate-200">Updated</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {workflows.map((workflow) => (
                    <TableRow
                        key={workflow.id}
                        className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-600"
                    >
                        <TableCell>
                            <div className="font-medium text-gray-900 dark:text-slate-200">{workflow.name}</div>
                        </TableCell>
                        <TableCell>
                            <div className="text-sm text-gray-500 dark:text-slate-400 max-w-[300px] truncate">
                                {workflow.description}
                            </div>
                        </TableCell>
                        <TableCell>
                            <Badge
                                variant={workflow.isActive ? "default" : "secondary"}
                                className={
                                    workflow.isActive
                                        ? "bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white"
                                        : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-slate-200"
                                }
                            >
                                {workflow.isActive ? "Active" : "Draft"}
                            </Badge>
                        </TableCell>
                        <TableCell>
                            <div className="text-sm text-gray-500 dark:text-slate-400">
                                {formatDistanceToNow(workflow.updatedAt, { addSuffix: true })}
                            </div>
                        </TableCell>
                        <TableCell>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-gray-900 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400 focus-visible:ring-offset-2 ring-offset-white dark:ring-offset-gray-900"
                                    >
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    align="end"
                                    className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-slate-200"
                                >
                                    <DropdownMenuItem
                                        onClick={() => onEdit(workflow)}
                                        className="hover:bg-gray-100 dark:hover:bg-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400 focus-visible:ring-offset-2 ring-offset-white dark:ring-offset-gray-900"
                                    >
                                        <Edit className="h-4 w-4 mr-2" />
                                        Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => onToggleActive(workflow.id)}
                                        className="hover:bg-gray-100 dark:hover:bg-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400 focus-visible:ring-offset-2 ring-offset-white dark:ring-offset-gray-900"
                                    >
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
                                        onClick={() => onDelete(workflow.id)}
                                        className="text-red-500 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400 focus-visible:ring-offset-2 ring-offset-white dark:ring-offset-gray-900"
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
    );
}