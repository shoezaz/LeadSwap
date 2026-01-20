import "@/index.css";
import { mountWidget } from "skybridge/web";
import { useToolInfo } from "../helpers";
import { useState } from "react";
import { Badge } from "@openai/apps-sdk-ui/components/Badge";
import { Button } from "@openai/apps-sdk-ui/components/Button";
import { Checkbox } from "@openai/apps-sdk-ui/components/Checkbox";
import { TextLink } from "@openai/apps-sdk-ui/components/TextLink";
import { Select } from "@openai/apps-sdk-ui/components/Select";
import { Menu } from "@openai/apps-sdk-ui/components/Menu";
import { Tooltip } from "@openai/apps-sdk-ui/components/Tooltip";
import { Avatar } from "@openai/apps-sdk-ui/components/Avatar";
import { SegmentedControl } from "@openai/apps-sdk-ui/components/SegmentedControl";
import { Input } from "@openai/apps-sdk-ui/components/Input";
import { EmptyMessage } from "@openai/apps-sdk-ui/components/EmptyMessage";
import { AppsSDKUIProvider } from "@openai/apps-sdk-ui/components/AppsSDKUIProvider";
import { motion } from "framer-motion";
import { ListChecks, Maximize2, Download, Users, BarChart3, Search, MoreVertical, Mail, ExternalLink, Trash2 } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 }
};

const rowVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0 }
};

function GetResults() {
  const { output } = useToolInfo<"get-results">();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [tierFilter, setTierFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("score");

  if (!output) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center min-h-[120px] gap-3 text-secondary"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-6 h-6 border-2 border-subtle border-t-primary rounded-full"
        />
        <p className="text-body-sm">Loading results...</p>
      </motion.div>
    );
  }

  const outputData = output as any;
  const { leads: allLeads, tier, filteredCount, totalResults, tierBreakdown } = outputData;

  // Filter leads
  let leads = allLeads;
  if (tierFilter !== "all") {
    leads = leads.filter((l: any) => l.tier === tierFilter);
  }
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    leads = leads.filter((l: any) =>
      l.company?.toLowerCase().includes(q) ||
      l.name?.toLowerCase().includes(q) ||
      l.email?.toLowerCase().includes(q)
    );
  }

  // Sort leads
  leads = [...leads].sort((a: any, b: any) => {
    if (sortBy === "score") return b.score - a.score;
    if (sortBy === "company") return a.company.localeCompare(b.company);
    return 0;
  });

  const toggleSelection = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (selectedIds.length === leads.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(leads.map((l: any) => l.id));
    }
  };

  const handleFullscreen = () => {
    if (typeof window !== "undefined" && (window as any).openai?.requestDisplayMode) {
      (window as any).openai.requestDisplayMode("fullscreen");
    }
  };

  const handleExportSelected = (format: string = "csv") => {
    if (typeof window !== "undefined" && (window as any).openai?.callTool) {
      (window as any).openai.callTool("export-leads", {
        leadIds: selectedIds,
        format
      });
    }
  };

  const handleLeadAction = (action: string, leadId: string) => {
    const lead = allLeads.find((l: any) => l.id === leadId);
    if (!lead) return;

    if (action === "email" && lead.email) {
      (window as any).openai?.openExternal?.(`mailto:${lead.email}`);
    } else if (action === "visit" && lead.url) {
      (window as any).openai?.openExternal?.(lead.url);
    } else if (action === "remove") {
      setSelectedIds(prev => prev.filter(id => id !== leadId));
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-4"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ListChecks className="size-5 text-primary" />
          <h2 className="heading-sm">Lead Results</h2>
          <Badge color="success" variant="soft">Live</Badge>
        </div>
        <div className="flex items-center gap-2">
          <Tooltip content="Expand to fullscreen">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleFullscreen}
              className="p-1.5 rounded-lg bg-surface border border-default hover:bg-subtle transition-colors"
            >
              <Maximize2 className="size-4 text-secondary" />
            </motion.button>
          </Tooltip>
        </div>
      </motion.div>

      {/* Tier Filter - SegmentedControl */}
      <motion.div variants={itemVariants}>
        <SegmentedControl
          value={tierFilter}
          onValueChange={setTierFilter}
          options={[
            { value: "all", label: `All (${totalResults})` },
            { value: "A", label: `Tier A (${tierBreakdown.tierA})` },
            { value: "B", label: `Tier B (${tierBreakdown.tierB})` },
            { value: "C", label: `Tier C (${tierBreakdown.tierC})` },
          ]}
        />
      </motion.div>

      {/* Search & Sort Row */}
      <motion.div variants={itemVariants} className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-secondary" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search leads..."
            className="pl-9"
          />
        </div>
        <Select
          value={sortBy}
          onValueChange={setSortBy}
          options={[
            { value: "score", label: "Sort by Score" },
            { value: "company", label: "Sort by Company" },
          ]}
        />
      </motion.div>

      {/* Selection Actions Bar */}
      {selectedIds.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between p-2 bg-primary/10 border border-primary/20 rounded-lg"
        >
          <div className="flex items-center gap-2">
            <Users className="size-4 text-primary" />
            <span className="text-sm font-medium">{selectedIds.length} lead{selectedIds.length > 1 ? "s" : ""} selected</span>
          </div>
          <div className="flex items-center gap-2">
            <Menu
              trigger={
                <Button color="secondary">
                  Export <MoreVertical className="size-4 ml-1" />
                </Button>
              }
              items={[
                { label: "Export as CSV", onSelect: () => handleExportSelected("csv") },
                { label: "Export as JSON", onSelect: () => handleExportSelected("json") },
                { label: "Export for HubSpot", onSelect: () => handleExportSelected("hubspot") },
              ]}
            />
            <Button color="primary" onClick={() => handleExportSelected("csv")}>
              <Download className="size-4 mr-1" />
              Quick Export
            </Button>
          </div>
        </motion.div>
      )}

      {/* Empty State */}
      {leads.length === 0 && (
        <EmptyMessage
          title="No leads found"
          description={searchQuery ? "Try adjusting your search or filters" : "No leads match the current filter"}
        />
      )}

      {/* Results Table */}
      {leads.length > 0 && (
        <motion.div variants={itemVariants} className="overflow-x-auto rounded-lg border border-subtle">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-subtle/50">
                <th className="text-left px-3 py-2 w-10">
                  <Tooltip content="Select all">
                    <Checkbox
                      checked={selectedIds.length === leads.length && leads.length > 0}
                      onCheckedChange={toggleAll}
                    />
                  </Tooltip>
                </th>
                <th className="text-left px-3 py-2 text-xs font-semibold text-secondary uppercase">Score</th>
                <th className="text-left px-3 py-2 text-xs font-semibold text-secondary uppercase">Contact</th>
                <th className="text-left px-3 py-2 text-xs font-semibold text-secondary uppercase">Company</th>
                <th className="text-left px-3 py-2 text-xs font-semibold text-secondary uppercase w-10">Actions</th>
              </tr>
            </thead>
            <motion.tbody
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="divide-y divide-subtle"
            >
              {leads.map((lead: any) => (
                <motion.tr
                  key={lead.id}
                  variants={rowVariants}
                  whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
                  className={`transition-colors ${selectedIds.includes(lead.id) ? "bg-primary/5" : ""}`}
                >
                  <td className="px-3 py-2">
                    <Checkbox
                      checked={selectedIds.includes(lead.id)}
                      onCheckedChange={() => toggleSelection(lead.id)}
                    />
                  </td>
                  <td className="px-3 py-2">
                    <Tooltip content={`Score: ${lead.score}/100 - Tier ${lead.tier}`}>
                      <Badge color={lead.tier === "A" ? "success" : lead.tier === "B" ? "warning" : "danger"}>
                        {String(lead.score)}
                      </Badge>
                    </Tooltip>
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      <Avatar
                        size="sm"
                        name={lead.name || lead.email || "?"}
                      />
                      <div className="flex flex-col">
                        <span className="font-medium text-sm">{lead.name || "-"}</span>
                        {lead.email && (
                          <TextLink href={`mailto:${lead.email}`} className="text-xs">
                            {lead.email}
                          </TextLink>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex flex-col">
                      <span className="font-medium">{lead.company}</span>
                      {lead.title && <span className="text-xs text-secondary">{lead.title}</span>}
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <Menu
                      trigger={
                        <button className="p-1 rounded hover:bg-subtle">
                          <MoreVertical className="size-4 text-secondary" />
                        </button>
                      }
                      items={[
                        ...(lead.email ? [{ label: "Send Email", icon: <Mail className="size-4" />, onSelect: () => handleLeadAction("email", lead.id) }] : []),
                        ...(lead.url ? [{ label: "Visit Website", icon: <ExternalLink className="size-4" />, onSelect: () => handleLeadAction("visit", lead.id) }] : []),
                        { label: "Remove", icon: <Trash2 className="size-4" />, onSelect: () => handleLeadAction("remove", lead.id), variant: "danger" as const },
                      ]}
                    />
                  </td>
                </motion.tr>
              ))}
            </motion.tbody>
          </table>
        </motion.div>
      )}

      {/* Match Details */}
      {leads.length > 0 && leads[0].matchDetails && (
        <motion.div
          variants={itemVariants}
          className="p-3 bg-surface border border-default rounded-lg flex flex-col gap-3"
        >
          <div className="flex items-center gap-2">
            <BarChart3 className="size-4 text-secondary" />
            <h4 className="text-xs font-semibold text-secondary">
              Score Breakdown ({leads[0].company})
            </h4>
          </div>
          <div className="flex flex-col gap-2">
            {[
              { label: "Industry", value: leads[0].matchDetails.industryMatch, max: 30 },
              { label: "Size", value: leads[0].matchDetails.sizeMatch, max: 20 },
              { label: "Geography", value: leads[0].matchDetails.geoMatch, max: 20 },
              { label: "Title", value: leads[0].matchDetails.titleMatch, max: 20 },
            ].map((item) => (
              <Tooltip key={item.label} content={`${item.value}/${item.max} points`}>
                <div className="flex items-center gap-2 text-xs">
                  <span className="w-16 text-secondary">{item.label}</span>
                  <div className="flex-1 h-1.5 bg-subtle rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(item.value / item.max) * 100}%` }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                      className="h-full bg-primary rounded-full"
                    />
                  </div>
                  <span className="w-10 font-medium text-right">{item.value}/{item.max}</span>
                </div>
              </Tooltip>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

export default GetResults;
mountWidget(
  <AppsSDKUIProvider linkComponent="a">
    <GetResults />
  </AppsSDKUIProvider>
);

