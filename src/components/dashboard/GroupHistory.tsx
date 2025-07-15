import { memo, useCallback, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Clock, Users, PhoneCall, Building2, UserCheck, Search, DollarSign, Headphones, Megaphone, Heart, Wrench, Box } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Group, Contact, PerformanceMetric } from "@/types/groupHistory.types"; // Adjust the import path as necessary
import { Input } from "../ui/input";

// Constants for repeated strings
const COLORS = {
    PRIMARY: "from-blue-400 to-blue-600",
    SUCCESS: "bg-green-50 dark:bg-green-900/20 text-green-600",
    ERROR: "bg-red-50 dark:bg-red-900/20 text-red-600",
    NEUTRAL: "bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white",
    INSIGHT_BLUE: "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400",
    INSIGHT_PURPLE: "bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400",
    INSIGHT_GREEN: "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400",
    INSIGHT_ORANGE: "bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400",
};

// Sample data
const groupHistoryData: Group[] = [
    { id: 1, name: "Sales Team A", totalCalls: 1450, avgDuration: "2m 15s", successRate: 82, lastCall: "2025-07-09", answered: 1200, missed: 250 },
    { id: 2, name: "Support Crew", totalCalls: 2300, avgDuration: "3m 45s", successRate: 78, lastCall: "2025-07-08", answered: 1800, missed: 500 },
    { id: 3, name: "Marketing Squad", totalCalls: 980, avgDuration: "1m 50s", successRate: 85, lastCall: "2025-07-07", answered: 850, missed: 130 },
    { id: 4, name: "Customer Success", totalCalls: 1750, avgDuration: "2m 30s", successRate: 80, lastCall: "2025-07-09", answered: 1400, missed: 350 },
    { id: 5, name: "Tech Support", totalCalls: 3200, avgDuration: "4m 10s", successRate: 75, lastCall: "2025-07-08", answered: 2400, missed: 800 },
    { id: 6, name: "Product Team", totalCalls: 650, avgDuration: "1m 45s", successRate: 88, lastCall: "2025-07-06", answered: 570, missed: 80 },
];

// Icon mapping for groups
const GROUP_ICONS: { [key: string]: React.ComponentType<{ className?: string; 'aria-label'?: string }> } = {
    "Sales Team A": DollarSign,
    "Support Crew": Headphones,
    "Marketing Squad": Megaphone,
    "Customer Success": Heart,
    "Tech Support": Wrench,
    "Product Team": Box,
};

const contactDetails: { [key: number]: Contact[] } = {
    1: [
        { id: 1, name: "John Smith", role: "Sales Lead", phone: "+1-555-123-4567", email: "john.smith@example.com", lastContacted: "2025-07-09", status: "Active", calls: 300, answered: 250 },
        { id: 2, name: "Sarah Johnson", role: "Sales Rep", phone: "+1-555-234-5678", email: "sarah.johnson@example.com", lastContacted: "2025-07-08", status: "Active", calls: 200, answered: 180 },
        { id: 7, name: "Alex Carter", role: "Sales Manager", phone: "+1-555-345-6789", email: "alex.carter@example.com", lastContacted: "2025-07-07", status: "Active", calls: 250, answered: 210 },
        { id: 8, name: "Emily Brown", role: "Sales Associate", phone: "+1-555-456-7890", email: "emily.brown@example.com", lastContacted: "2025-07-06", status: "Inactive", calls: 150, answered: 120 },
    ],
    2: [
        { id: 3, name: "Emma Wilson", role: "Support Manager", phone: "+1-555-987-6543", email: "emma.wilson@example.com", lastContacted: "2025-07-08", status: "Active", calls: 500, answered: 400 },
        { id: 4, name: "Michael Chen", role: "Support Specialist", phone: "+1-555-876-5432", email: "michael.chen@example.com", lastContacted: "2025-07-07", status: "Inactive", calls: 350, answered: 280 },
        { id: 9, name: "David Lee", role: "Support Lead", phone: "+1-555-567-8901", email: "david.lee@example.com", lastContacted: "2025-07-09", status: "Active", calls: 600, answered: 480 },
        { id: 10, name: "Sophia Kim", role: "Support Agent", phone: "+1-555-678-9012", email: "sophia.kim@example.com", lastContacted: "2025-07-06", status: "Active", calls: 400, answered: 320 },
    ],
    3: [
        { id: 5, name: "Liam Brown", role: "Marketing Coordinator", phone: "+1-555-456-7890", email: "liam.brown@example.com", lastContacted: "2025-07-07", status: "Active", calls: 150, answered: 140 },
        { id: 6, name: "Olivia Davis", role: "Marketing Analyst", phone: "+1-555-567-8901", email: "olivia.davis@example.com", lastContacted: "2025-07-06", status: "Active", calls: 120, answered: 100 },
        { id: 11, name: "Noah Martinez", role: "Marketing Specialist", phone: "+1-555-789-0123", email: "noah.martinez@example.com", lastContacted: "2025-07-05", status: "Active", calls: 100, answered: 90 },
    ],
    4: [
        { id: 12, name: "Isabella Garcia", role: "Success Manager", phone: "+1-555-890-1234", email: "isabella.garcia@example.com", lastContacted: "2025-07-09", status: "Active", calls: 400, answered: 340 },
        { id: 13, name: "James Wilson", role: "Success Specialist", phone: "+1-555-901-2345", email: "james.wilson@example.com", lastContacted: "2025-07-08", status: "Active", calls: 300, answered: 260 },
        { id: 14, name: "Ava Thompson", role: "Client Advocate", phone: "+1-555-012-3456", email: "ava.thompson@example.com", lastContacted: "2025-07-07", status: "Inactive", calls: 250, answered: 200 },
    ],
    5: [
        { id: 15, name: "Ethan Nguyen", role: "Tech Lead", phone: "+1-555-123-6789", email: "ethan.nguyen@example.com", lastContacted: "2025-07-08", status: "Active", calls: 700, answered: 550 },
        { id: 16, name: "Mia Patel", role: "Tech Specialist", phone: "+1-555-234-7890", email: "mia.patel@example.com", lastContacted: "2025-07-07", status: "Active", calls: 600, answered: 480 },
        { id: 17, name: "Lucas Kim", role: "Support Engineer", phone: "+1-555-345-8901", email: "lucas.kim@example.com", lastContacted: "2025-07-06", status: "Active", calls: 550, answered: 440 },
        { id: 18, name: "Charlotte Lee", role: "Tech Analyst", phone: "+1-555-456-9012", email: "charlotte.lee@example.com", lastContacted: "2025-07-05", status: "Inactive", calls: 450, answered: 360 },
    ],
    6: [
        { id: 19, name: "Benjamin Clark", role: "Product Manager", phone: "+1-555-567-0123", email: "benjamin.clark@example.com", lastContacted: "2025-07-06", status: "Active", calls: 200, answered: 180 },
        { id: 20, name: "Amelia Rodriguez", role: "Product Analyst", phone: "+1-555-678-1234", email: "amelia.rodriguez@example.com", lastContacted: "2025-07-05", status: "Active", calls: 150, answered: 135 },
    ],
};

const performanceMetrics: PerformanceMetric[] = [
    { metric: "Response Rate", value: 88, color: "#2b67ff" },
    { metric: "Resolution Rate", value: 75, color: "#10b981" },
    { metric: "Customer Satisfaction", value: 92, color: "#f59e0b" },
    { metric: "Average Call Duration", value: 80, color: "#8b5cf6" },
    { metric: "First Call Resolution", value: 70, color: "#ec4899" },
    { metric: "Agent Availability", value: 95, color: "#eab308" },
];

// Reusable Group Card Component
interface GroupCardProps {
    group: Group;
    onClick: (id: number) => void;
    index: number;
}

const GroupCard = memo(({ group, onClick, index }: GroupCardProps) => {
    const IconComponent = GROUP_ICONS[group.name] || Building2; // Fallback to Building2 if no icon is mapped

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            onClick={() => onClick(group.id)}
            className="px-6 py-4 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl hover:shadow-xl hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 cursor-pointer group"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && onClick(group.id)}
            aria-label={`View details for ${group.name}`}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${COLORS.PRIMARY} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <IconComponent className="h-7 w-7 text-white" aria-label={`${group.name} icon`} />
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-900 dark:text-white text-xl">{group.name}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            {contactDetails[group.id].length} contacts • Avg Duration: {group.avgDuration}
                        </p>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-3xl font-bold text-blue-600">{group.successRate}%</div>
                    <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800 border-blue-200">
                        Success Rate
                    </Badge>
                </div>
            </div>
            <div className="grid-cols-3 gap-4 mb-4 hidden">
                <div className={`text-center p-3 ${COLORS.NEUTRAL} rounded-lg`}>
                    <div className="text-lg font-bold">{group.totalCalls.toLocaleString()}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Total Calls</div>
                </div>
                <div className={`text-center p-3 ${COLORS.SUCCESS} rounded-lg`}>
                    <div className="text-lg font-bold">{group.answered.toLocaleString()}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Answered</div>
                </div>
                <div className={`text-center p-3 ${COLORS.ERROR} rounded-lg`}>
                    <div className="text-lg font-bold">{group.missed.toLocaleString()}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Missed</div>
                </div>
            </div>
            <div className="space-y-2 hidden">
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div
                        className={`bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500 group-hover:${COLORS.PRIMARY}`}
                        style={{ width: `${group.successRate}%` }}
                    ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>Click to view details</span>
                    <span>→</span>
                </div>
            </div>
        </motion.div>
    );
});
GroupCard.displayName = "GroupCard";

// Reusable Contact Row Component
interface ContactRowProps {
    contact: Contact;
    index: number;
}

const ContactRow = memo(({ contact, index }: ContactRowProps) => (
    <motion.tr
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.1 }}
    >
        <TableCell className="font-medium text-gray-800 dark:text-gray-100 flex items-center gap-2">
            <div className={`w-8 h-8 bg-gradient-to-r ${COLORS.PRIMARY} rounded-lg flex items-center justify-center`}>
                <UserCheck className="h-4 w-4 text-white" />
            </div>
            {contact.name}
        </TableCell>
        <TableCell>{contact.role}</TableCell>
        <TableCell>{contact.phone}</TableCell>
        <TableCell>{contact.email}</TableCell>
        <TableCell>
            <Badge
                variant={contact.status === "Active" ? "default" : "secondary"}
                className={`${contact.status === "Active"
                    ? "bg-green-100 text-green-800 border-green-200"
                    : "bg-gray-100 text-gray-600 border-gray-200"
                    } shadow-sm`}
            >
                {contact.status}
            </Badge>
        </TableCell>
        <TableCell>{contact.calls.toLocaleString()}</TableCell>
        <TableCell>{contact.answered.toLocaleString()}</TableCell>
        <TableCell>{Math.round((contact.answered / contact.calls) * 100)}%</TableCell>
        <TableCell>{contact.lastContacted}</TableCell>
    </motion.tr>
));
ContactRow.displayName = "ContactRow";

// Main Component
const GroupHistory = () => {
    const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const handleGroupClick = useCallback((groupId: number) => {
        setSelectedGroupId(groupId);
    }, []);


    // Handle search input
    const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    }, []);

    // Filter groups based on search term
    const filteredGroups = groupHistoryData.filter((group) =>
        group.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Selected group data
    const selectedGroup = groupHistoryData.find((group) => group.id === selectedGroupId);

    return (
        <div className="space-y-6">
            {/* Group History Header */}
            <Card className="border-0 shadow-sm bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                                <Users className="w-5 h-5 text-blue-600" />
                                Group History
                            </CardTitle>
                            <CardDescription className="text-gray-600 dark:text-gray-400">
                                Detailed analytics of group activities and contacts
                            </CardDescription>
                        </div>
                        <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-100">
                            Active Groups
                        </Badge>
                    </div>
                </CardHeader>
            </Card>

            <div className="grid grid-cols-1  gap-6">
                {/* Performance Metrics */}
                <Card className="border-0 shadow-sm bg-white dark:bg-gray-900">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                            <Clock className="w-5 h-5 text-blue-600" />
                            Performance Metrics
                        </CardTitle>
                        <CardDescription className="text-gray-600 dark:text-gray-400">
                            Key performance indicators for group activities
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-2 grid grid-cols-2 md:grid-cols-3 gap-4">
                            {performanceMetrics.map((metric, index) => (
                                <div key={index} className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="font-medium text-gray-800 dark:text-gray-100">{metric.metric}</span>
                                        <span className="font-bold text-lg text-gray-900 dark:text-white">{metric.value}%</span>
                                    </div>
                                    <Progress value={metric.value} className="h-2" style={{ backgroundColor: metric.color }} />
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Group Performance Overview */}
                <Card className="border-0 shadow-sm bg-white dark:bg-gray-900">
                    <CardHeader className="grid w-full grid-cols-1 md:grid-cols-12 items-center justify-between gap-4">
                        <div className="md:col-span-4">
                            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                                <PhoneCall className="w-5 h-5 text-purple-600" />
                                Group Performance
                            </CardTitle>
                            <CardDescription className="text-gray-600 dark:text-gray-400">
                                Search and click a group to view detailed information and contacts
                            </CardDescription>
                        </div>
                        <div className="md:col-span-8 flex justify-end">
                            <div className="relative w-full md:w-1/2">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <Input
                                    type="text"
                                    placeholder="Search groups by name..."
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                    className="pl-10 bg-gray-50 w-full dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:border-blue-300 dark:focus:border-blue-600"
                                    aria-label="Search groups"
                                />
                            </div>
                        </div>

                    </CardHeader>

                    <CardContent>

                        <div className="grid grid-cols-2 gap-4">
                            {filteredGroups.length === 0 ? (
                                <p className="text-center text-gray-600 dark:text-gray-400 col-span-2">
                                    No groups found matching your search
                                </p>
                            ) : (
                                filteredGroups.map((group, index) => (
                                    <GroupCard key={group.id} group={group} onClick={handleGroupClick} index={index} />
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Insights Summary */}
                {/* <Card className="border-0 shadow-sm bg-white dark:bg-gray-900">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                            <Users className="w-5 h-5 text-orange-600" />
                            Group Insights
                        </CardTitle>
                        <CardDescription className="text-gray-600 dark:text-gray-400">
                            Key takeaways from group performance
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className={`p-4 ${COLORS.INSIGHT_BLUE} rounded-lg`}>
                                <div className="text-sm font-medium">High Engagement</div>
                                <div className="text-xs">Sales Team A shows consistent high success rates.</div>
                            </div>
                            <div className={`p-4 ${COLORS.INSIGHT_PURPLE} rounded-lg`}>
                                <div className="text-sm font-medium">Long Call Durations</div>
                                <div className="text-xs">Support Crew and Tech Support have longer average call durations, indicating complex queries.</div>
                            </div>
                            <div className={`p-4 ${COLORS.INSIGHT_GREEN} rounded-lg`}>
                                <div className="text-sm font-medium">Recent Activity</div>
                                <div className="text-xs">Marketing Squad and Customer Success had recent spikes in call volume.</div>
                            </div>
                            <div className={`p-4 ${COLORS.INSIGHT_ORANGE} rounded-lg`}>
                                <div className="text-sm font-medium">Product Team Efficiency</div>
                                <div className="text-xs">Product Team maintains high success rates with fewer calls.</div>
                            </div>
                        </div>
                    </CardContent>
                </Card> */}
            </div>

            {/* Popup for Group Details and Contacts */}
            <AnimatePresence>
                {selectedGroupId && selectedGroup && (
                    <Dialog open={!!selectedGroupId} onOpenChange={() => setSelectedGroupId(null)}>
                        <DialogContent className="max-w-7xl max-h-[82vh] overflow-y-auto bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl " >
                            <DialogHeader className="mb-4 border-b border-gray-200 dark:border-gray-700 pb-4">
                                <div className="flex items-center justify-between">
                                    <DialogTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                                        <Building2 className="w-6 h-6 text-blue-600" />
                                        {selectedGroup.name} Details
                                    </DialogTitle>
                                </div>
                            </DialogHeader>
                            <div className="space-y-6 p-6">
                                {/* Group Details */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Group Overview</h4>
                                        <div className="grid grid-cols-3 gap-4">
                                            <div className={`text-center p-3 ${COLORS.NEUTRAL} rounded-lg`}>
                                                <div className="text-lg font-bold">{selectedGroup.totalCalls.toLocaleString()}</div>
                                                <div className="text-xs text-gray-600 dark:text-gray-400">Total Calls</div>
                                            </div>
                                            <div className={`text-center p-3 ${COLORS.SUCCESS} rounded-lg`}>
                                                <div className="text-lg font-bold">{selectedGroup.answered.toLocaleString()}</div>
                                                <div className="text-xs text-gray-600 dark:text-gray-400">Answered</div>
                                            </div>
                                            <div className={`text-center p-3 ${COLORS.ERROR} rounded-lg`}>
                                                <div className="text-lg font-bold">{selectedGroup.missed.toLocaleString()}</div>
                                                <div className="text-xs text-gray-600 dark:text-gray-400">Missed</div>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Success Rate</span>
                                                <span className="text-sm font-bold text-blue-600">{selectedGroup.successRate}%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                                                <div
                                                    className={`bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500`}
                                                    style={{ width: `${selectedGroup.successRate}%` }}
                                                ></div>
                                            </div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">Last Call: {selectedGroup.lastCall}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">Avg Duration: {selectedGroup.avgDuration}</p>
                                        </div>
                                    </div>
                                    <div className={`text-center p-4 ${COLORS.INSIGHT_BLUE} rounded-lg`}>
                                        <div className="text-2xl font-bold text-blue-600">{contactDetails[selectedGroupId].length}</div>
                                        <div className="text-sm text-blue-600 dark:text-blue-500">Total Contacts</div>
                                    </div>
                                </div>

                                {/* Contact List */}
                                <div className="space-y-4">
                                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Contacts</h4>
                                    {contactDetails[selectedGroupId].length === 0 ? (
                                        <p className="text-center text-gray-600 dark:text-gray-400">No contacts available for this group</p>
                                    ) : (
                                        <div className="max-h-[50vh] overflow-y-auto">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>Name</TableHead>
                                                        <TableHead>Role</TableHead>
                                                        <TableHead>Phone</TableHead>
                                                        <TableHead>Email</TableHead>
                                                        <TableHead>Status</TableHead>
                                                        <TableHead>Calls</TableHead>
                                                        <TableHead>Answered</TableHead>
                                                        <TableHead>Success Rate</TableHead>
                                                        <TableHead>Last Contacted</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {contactDetails[selectedGroupId].map((contact, index) => (
                                                        <ContactRow key={contact.id} contact={contact} index={index} />
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                )}
            </AnimatePresence>
        </div>
    );
};

export default GroupHistory;