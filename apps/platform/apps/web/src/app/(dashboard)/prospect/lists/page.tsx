"use client";

import React, { useState, useMemo } from "react";
import { Search, Filter, Plus, MoreHorizontal, ArrowUpDown, Trash2, Edit2, Archive, CheckCircle, Star } from "lucide-react";

// Types
type ListStatus = "Active" | "Archived";

interface LeadList {
    id: number;
    name: string;
    count: number;
    createdDate: string; // ISO-like string for sorting
    status: ListStatus;
    isFavorite: boolean;
}

// Mock Data
const initialLists: LeadList[] = [
    { id: 1, name: "Q1 Outreach - CEO", count: 1250, createdDate: "2024-01-15", status: "Active", isFavorite: true },
    { id: 2, name: "Tech Startups - Series A", count: 850, createdDate: "2024-01-10", status: "Active", isFavorite: false },
    { id: 3, name: "E-commerce Owners", count: 2300, createdDate: "2023-12-28", status: "Archived", isFavorite: false },
    { id: 4, name: "Local Agencies", count: 450, createdDate: "2023-12-15", status: "Active", isFavorite: true },
    { id: 5, name: "SaaS Founders", count: 120, createdDate: "2024-01-18", status: "Active", isFavorite: false },
];

export default function ListsPage() {
    // State
    const [lists, setLists] = useState<LeadList[]>(initialLists);
    const [activeTab, setActiveTab] = useState<"all" | "archived" | "favorites">("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [sortOption, setSortOption] = useState<"date" | "name">("date");
    const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

    // Modal State
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [newListName, setNewListName] = useState("");

    // Menu State (for the row actions)
    const [openMenuId, setOpenMenuId] = useState<number | null>(null);

    // --- Derived State (Logic) ---

    const filteredLists = useMemo(() => {
        let result = lists;

        // Tab Filter
        if (activeTab === "archived") {
            result = result.filter(l => l.status === "Archived");
        } else if (activeTab === "favorites") {
            result = result.filter(l => l.isFavorite);
        }
        // "all" typically shows Active (or everything? Usually "All" implies everything, or maybe just Active? Let's show All non-archived for "All" and have "Archived" separate?
        // User requested "All Lists". Usually "All Lists" includes everything.
        // However, typical pattern is "All" (Active) vs "Archived".
        // Let's stick to "All Lists" = All Lists (including archived) for now, or match Figma.
        // If I show Archived in All, it might be clutter.
        // Let's filter: All = All.

        // Search Filter
        if (searchQuery) {
            result = result.filter(l => l.name.toLowerCase().includes(searchQuery.toLowerCase()));
        }

        return result;
    }, [lists, activeTab, searchQuery]);

    const sortedLists = useMemo(() => {
        return [...filteredLists].sort((a, b) => {
            if (sortOption === "date") {
                // Newest first
                return new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime();
            } else {
                // Name A-Z
                return a.name.localeCompare(b.name);
            }
        });
    }, [filteredLists, sortOption]);

    // --- Handlers ---

    const handleCreateList = () => {
        if (!newListName.trim()) return;
        const newList: LeadList = {
            id: Date.now(),
            name: newListName,
            count: 0,
            createdDate: new Date().toISOString().split('T')[0],
            status: "Active",
            isFavorite: false,
        };
        setLists([newList, ...lists]);
        setNewListName("");
        setIsCreateModalOpen(false);
    };

    const deleteList = (id: number) => {
        setLists(lists.filter(l => l.id !== id));
        setOpenMenuId(null);
    };

    const toggleArchive = (id: number) => {
        setLists(lists.map(l => l.id === id ? { ...l, status: l.status === "Active" ? "Archived" : "Active" } : l));
        setOpenMenuId(null);
    };

    const toggleFavorite = (id: number) => {
        setLists(lists.map(l => l.id === id ? { ...l, isFavorite: !l.isFavorite } : l));
    };

    const toggleSelection = (id: number) => {
        const newSet = new Set(selectedIds);
        if (newSet.has(id)) newSet.delete(id);
        else newSet.add(id);
        setSelectedIds(newSet);
    };

    const toggleSelectAll = () => {
        if (selectedIds.size === sortedLists.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(sortedLists.map(l => l.id)));
        }
    };

    // --- Render Helpers ---

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    };

    return (
        <div className="w-full h-full bg-white rounded-tl-[12px] rounded-lg shadow-sm border border-[#eef0f2] flex flex-col relative overflow-hidden" onClick={() => setOpenMenuId(null)}>
            {/* Header Section */}
            <div className="flex-none px-6 pt-6 pb-0 border-b border-[#eef0f2]">
                <div className="w-full">
                    <h1 className="text-[26px] font-medium text-[#212529] tracking-[-0.078px] mb-1">
                        My Lists
                    </h1>
                    <p className="text-[14px] text-[#3a4455] tracking-[-0.042px] mb-6">
                        Manage and organize your custom lead lists.
                    </p>

                    {/* Tabs */}
                    <div className="flex space-x-6 text-[14px] font-medium text-[#3a4455]">
                        <button
                            onClick={() => setActiveTab("all")}
                            className={`pb-3 border-b-[2px] transition-colors ${activeTab === "all" ? "border-[#1b56e0] text-[#212529]" : "border-transparent hover:text-[#212529]"}`}
                        >
                            All Lists
                        </button>
                        <button
                            onClick={() => setActiveTab("archived")}
                            className={`pb-3 border-b-[2px] transition-colors ${activeTab === "archived" ? "border-[#1b56e0] text-[#212529]" : "border-transparent hover:text-[#212529]"}`}
                        >
                            Archived
                        </button>
                        <button
                            onClick={() => setActiveTab("favorites")}
                            className={`pb-3 border-b-[2px] transition-colors ${activeTab === "favorites" ? "border-[#1b56e0] text-[#212529]" : "border-transparent hover:text-[#212529]"}`}
                        >
                            Favorites
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Toolbar */}
                <div className="flex-none flex items-center justify-between p-4 border-b border-[#eef0f2] bg-white">
                    <div className="flex items-center space-x-2">
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-4 w-4 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search lists..."
                                className="pl-9 pr-4 py-1.5 text-sm border border-gray-200 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 w-64 text-[#3a4455] placeholder-gray-400 focus:outline-none transition-shadow"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="h-4 w-px bg-gray-200 mx-2"></div>
                        <button
                            onClick={() => setSortOption(sortOption === "date" ? "name" : "date")}
                            className="flex items-center space-x-2 px-3 py-1.5 text-sm font-medium text-[#3a4455] hover:bg-gray-50 rounded-md transition-colors"
                        >
                            <ArrowUpDown className="h-4 w-4 text-gray-400" />
                            <span>Sort by {sortOption === "date" ? "Last updated" : "Name"}</span>
                        </button>
                        <div className="h-4 w-px bg-gray-200 mx-2"></div>
                        <button className="flex items-center space-x-2 px-3 py-1.5 text-sm font-medium text-[#3a4455] hover:bg-gray-50 rounded-md transition-colors">
                            <Filter className="h-4 w-4 text-gray-400" />
                            <span>Filters</span>
                        </button>
                    </div>

                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="flex items-center items-center space-x-1.5 bg-[#1b56e0] text-white px-4 py-1.5 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
                        >
                            <Plus className="h-4 w-4" />
                            <span>Create List</span>
                        </button>
                    </div>
                </div>

                {/* Lists Table Container */}
                <div className="flex-1 overflow-auto">
                    <div className="min-w-full inline-block align-middle">
                        <table className="w-full text-left border-collapse">
                            <thead className="sticky top-0 bg-[#f9fafb] z-10">
                                <tr className="border-b border-[#eef0f2]">
                                    <th className="py-3 px-6 text-[12px] font-semibold text-[#3a4455] uppercase tracking-wider w-12 bg-[#f9fafb]">
                                        <input
                                            type="checkbox"
                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                            checked={selectedIds.size === sortedLists.length && sortedLists.length > 0}
                                            onChange={toggleSelectAll}
                                        />
                                    </th>
                                    <th className="py-3 px-6 text-[13px] font-medium text-[#3a4455] bg-[#f9fafb]">Name</th>
                                    <th className="py-3 px-6 text-[13px] font-medium text-[#3a4455] bg-[#f9fafb]">Leads Count</th>
                                    <th className="py-3 px-6 text-[13px] font-medium text-[#3a4455] bg-[#f9fafb]">Created Date</th>
                                    <th className="py-3 px-6 text-[13px] font-medium text-[#3a4455] bg-[#f9fafb]">Status</th>
                                    <th className="py-3 px-6 text-[13px] font-medium text-[#3a4455] text-right bg-[#f9fafb]">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#eef0f2]">
                                {sortedLists.map((list) => (
                                    <tr key={list.id} className="hover:bg-gray-50 transition-colors group relative">
                                        <td className="py-3 px-6">
                                            <input
                                                type="checkbox"
                                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                checked={selectedIds.has(list.id)}
                                                onChange={() => toggleSelection(list.id)}
                                            />
                                        </td>
                                        <td className="py-3 px-6">
                                            <div className="flex items-center">
                                                {/* Status Dot */}
                                                <div className={`w-2.5 h-2.5 rounded-full mr-3 ${list.status === 'Active' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                                                <span className="text-[14px] font-medium text-[#212529] mr-2">{list.name}</span>
                                                {/* Favorite Star */}
                                                <button onClick={(e) => { e.stopPropagation(); toggleFavorite(list.id); }} className="focus:outline-none">
                                                    <Star className={`h-4 w-4 ${list.isFavorite ? "fill-yellow-400 text-yellow-400" : "text-gray-300 hover:text-gray-400"}`} />
                                                </button>
                                            </div>
                                        </td>
                                        <td className="py-3 px-6">
                                            <span className="text-[14px] text-[#3a4455]">{list.count.toLocaleString()}</span>
                                        </td>
                                        <td className="py-3 px-6">
                                            <span className="text-[13px] text-[#3a4455]">{formatDate(list.createdDate)}</span>
                                        </td>
                                        <td className="py-3 px-6">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${list.status === 'Active' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-100 text-gray-800 border-gray-200'}`}>
                                                {list.status}
                                            </span>
                                        </td>
                                        <td className="py-3 px-6 text-right relative">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setOpenMenuId(openMenuId === list.id ? null : list.id);
                                                }}
                                                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
                                            >
                                                <MoreHorizontal className="h-4 w-4" />
                                            </button>

                                            {/* Dropdown Menu */}
                                            {openMenuId === list.id && (
                                                <div className="absolute right-8 top-8 w-40 bg-white border border-[#eef0f2] rounded-lg shadow-lg z-50 py-1"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <button
                                                        onClick={() => toggleArchive(list.id)}
                                                        className="w-full text-left px-4 py-2 text-sm text-[#3a4455] hover:bg-gray-50 flex items-center gap-2"
                                                    >
                                                        {list.status === 'Active' ? <Archive className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                                                        {list.status === 'Active' ? "Archive" : "Activate"}
                                                    </button>
                                                    <button
                                                        onClick={() => {/* Mock Rename */ }}
                                                        className="w-full text-left px-4 py-2 text-sm text-[#3a4455] hover:bg-gray-50 flex items-center gap-2"
                                                    >
                                                        <Edit2 className="h-4 w-4" />
                                                        Rename
                                                    </button>
                                                    <div className="h-px bg-gray-100 my-1"></div>
                                                    <button
                                                        onClick={() => deleteList(list.id)}
                                                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                        Delete
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {/* Empty State */}
                        {sortedLists.length === 0 && (
                            <div className="text-center py-16 flex flex-col items-center">
                                <div className="bg-gray-100 p-4 rounded-full mb-4">
                                    <Search className="h-6 w-6 text-gray-400" />
                                </div>
                                <h3 className="text-[#212529] font-medium text-lg mb-1">No lists found</h3>
                                <p className="text-gray-500 text-sm mb-6">Try adjusting your filters or create a new list.</p>
                                <button
                                    onClick={() => setIsCreateModalOpen(true)}
                                    className="bg-[#1b56e0] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                                >
                                    Create New List
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Create List Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setIsCreateModalOpen(false)}>
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
                        <h2 className="text-xl font-semibold text-[#212529] mb-4">Create New List</h2>
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-[#3a4455] mb-2">List Name</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 border border-[#eef0f2] rounded-md focus:border-[#1b56e0] focus:ring-1 focus:ring-[#1b56e0] outline-none transition-all"
                                placeholder="e.g., Q2 Warm Leads"
                                value={newListName}
                                onChange={(e) => setNewListName(e.target.value)}
                                autoFocus
                                onKeyDown={(e) => e.key === 'Enter' && handleCreateList()}
                            />
                        </div>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setIsCreateModalOpen(false)}
                                className="px-4 py-2 text-sm font-medium text-[#3a4455] hover:bg-gray-100 rounded-md transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreateList}
                                disabled={!newListName.trim()}
                                className="px-4 py-2 text-sm font-medium text-white bg-[#1b56e0] rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Create List
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
