import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/useToast";
import { Download, Share, FileText, Mail, Printer } from "lucide-react";

const ExportReports = () => {
    const { showSuccess } = useToast();

    const handleExport = (format: string) => {
        showSuccess(`Your ${format} report is being generated and will download shortly.`);
    };

    const handleShare = (method: string) => {
        showSuccess(`Opening ${method} to share your analytics report.`);
    };

    return (
        <div className="flex gap-2">
            {/* Export Dropdown */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="outline"
                        size="sm"
                        className="border-gray-300 text-gray-700 hover:bg-gray-200 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
                    >
                        <Download className="w-4 h-4 mr-2" />
                        Export
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    align="end"
                    className="w-48 bg-white border border-gray-200 shadow-lg dark:bg-gray-900 dark:border-gray-700"
                >
                    <DropdownMenuItem
                        onClick={() => handleExport("CSV")}
                        className="text-sm text-gray-700 hover:bg-gray-200 dark:text-gray-200 dark:hover:bg-gray-800"
                    >
                        <FileText className="w-4 h-4 mr-2" />
                        Download as CSV
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => handleExport("PDF")}
                        className="text-sm text-gray-700 hover:bg-gray-200 dark:text-gray-200 dark:hover:bg-gray-800"
                    >
                        <FileText className="w-4 h-4 mr-2" />
                        Download as PDF
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="my-1 h-px bg-gray-200 dark:bg-gray-700" />
                    <DropdownMenuItem
                        onClick={() => handleShare("email")}
                        className="text-sm text-gray-700 hover:bg-gray-200 dark:text-gray-200 dark:hover:bg-gray-800"
                    >
                        <Mail className="w-4 h-4 mr-2" />
                        Share via Email
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => handleExport("print")}
                        className="text-sm text-gray-700 hover:bg-gray-200 dark:text-gray-200 dark:hover:bg-gray-800"
                    >
                        <Printer className="w-4 h-4 mr-2" />
                        Print Report
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Share Dropdown */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="outline"
                        size="sm"
                        className="border-gray-300 text-gray-700 hover:bg-gray-200 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
                    >
                        <Share className="w-4 h-4 mr-2" />
                        Share
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    align="end"
                    className="w-48 bg-white border border-gray-200 shadow-lg dark:bg-gray-900 dark:border-gray-700"
                >
                    <DropdownMenuItem
                        onClick={() => handleShare("email")}
                        className="text-sm text-gray-700 hover:bg-gray-200 dark:text-gray-200 dark:hover:bg-gray-800"
                    >
                        <Mail className="w-4 h-4 mr-2" />
                        Email Report
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => {
                            navigator.clipboard.writeText(window.location.href);
                            showSuccess("Link copied to clipboard.");
                        }}
                        className="text-sm text-gray-700 hover:bg-gray-200 dark:text-gray-200 dark:hover:bg-gray-800"
                    >
                        <Share className="w-4 h-4 mr-2" />
                        Copy Link
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};

export default ExportReports;
