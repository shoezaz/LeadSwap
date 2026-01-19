import "@/index.css";
import { mountWidget } from "skybridge/web";
import { useToolInfo } from "../helpers";
import { Badge } from "@openai/apps-sdk-ui/components/Badge";
import { AppsSDKUIProvider } from "@openai/apps-sdk-ui/components/AppsSDKUIProvider";
import { motion } from "framer-motion";
import { Building2, User, Mail, Globe, Briefcase, Target, Zap, MessageSquare, TrendingUp, Hash } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 }
};

function getTierColor(tier: string): "success" | "warning" | "danger" {
  switch (tier) {
    case "A": return "success";
    case "B": return "warning";
    case "C": return "danger";
    default: return "warning";
  }
}

function ScoreBar({ score }: { score: number }) {
  const color = score >= 70 ? "bg-success" : score >= 40 ? "bg-warning" : "bg-danger";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-subtle rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={`h-full ${color} rounded-full`}
        />
      </div>
      <span className="text-sm font-bold min-w-[2.5rem] text-right">{score}</span>
    </div>
  );
}

function IntentSignal({ signal }: { signal: { type: string; description: string; emoji?: string } }) {
  return (
    <motion.div
      variants={itemVariants}
      className="flex items-start gap-2 p-2 bg-surface border border-default rounded-lg"
    >
      <span className="text-lg">{signal.emoji || "📊"}</span>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-primary">{signal.type}</p>
        <p className="text-xs text-secondary">{signal.description}</p>
      </div>
    </motion.div>
  );
}

function GetLeadDetails() {
  const { output } = useToolInfo<"get-lead-details">();

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
        <p className="text-sm">Loading lead details...</p>
      </motion.div>
    );
  }

  const outputData = output as any;

  if (!outputData.success || !outputData.lead) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-6 rounded-xl bg-surface text-center border border-default"
      >
        <p className="text-sm font-medium text-primary">Lead not found</p>
      </motion.div>
    );
  }

  const { lead } = outputData;
  const matchDetails = lead.matchDetails || {};
  const intentSignals = lead.intentSignals || [];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-4"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", bounce: 0.5 }}
            className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center"
          >
            <Building2 className="size-6 text-primary" />
          </motion.div>
          <div>
            <h2 className="heading-sm">{lead.company}</h2>
            {lead.url && (
              <a
                href={lead.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-secondary hover:text-primary flex items-center gap-1"
              >
                <Globe className="size-3" />
                {new URL(lead.url).hostname}
              </a>
            )}
          </div>
        </div>
        <Badge color={getTierColor(lead.tier)} variant="soft">
          Tier {lead.tier}
        </Badge>
      </motion.div>

      {/* Score */}
      <motion.div variants={itemVariants} className="p-3 bg-surface border border-default rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <Target className="size-4 text-secondary" />
          <span className="text-xs font-semibold text-secondary uppercase tracking-wide">ICP Match Score</span>
        </div>
        <ScoreBar score={lead.score || 0} />
      </motion.div>

      {/* Contact Info */}
      <motion.div variants={itemVariants} className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <User className="size-4 text-secondary" />
          <h3 className="text-xs font-semibold text-secondary uppercase tracking-wide">Contact</h3>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {lead.name && (
            <div className="flex items-center gap-2 p-2 bg-surface border border-default rounded-lg">
              <User className="size-4 text-secondary" />
              <span className="text-sm truncate">{lead.name}</span>
            </div>
          )}
          {lead.title && (
            <div className="flex items-center gap-2 p-2 bg-surface border border-default rounded-lg">
              <Briefcase className="size-4 text-secondary" />
              <span className="text-sm truncate">{lead.title}</span>
            </div>
          )}
          {lead.email && (
            <div className="col-span-2 flex items-center gap-2 p-2 bg-surface border border-default rounded-lg">
              <Mail className="size-4 text-secondary" />
              <a href={`mailto:${lead.email}`} className="text-sm text-primary hover:underline truncate">
                {lead.email}
              </a>
            </div>
          )}
        </div>
      </motion.div>

      {/* Match Analysis */}
      {matchDetails.explanation && (
        <motion.div variants={itemVariants} className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <MessageSquare className="size-4 text-secondary" />
            <h3 className="text-xs font-semibold text-secondary uppercase tracking-wide">Match Analysis</h3>
          </div>
          <div className="p-3 bg-surface border border-default rounded-lg">
            <p className="text-sm text-secondary whitespace-pre-wrap">{matchDetails.explanation}</p>
          </div>
        </motion.div>
      )}

      {/* Intent Signals */}
      {intentSignals.length > 0 && (
        <motion.div variants={itemVariants} className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Zap className="size-4 text-warning" />
            <h3 className="text-xs font-semibold text-secondary uppercase tracking-wide">Intent Signals</h3>
            <Badge color="warning" variant="soft">{intentSignals.length}</Badge>
          </div>
          <motion.div variants={containerVariants} className="flex flex-col gap-2">
            {intentSignals.map((signal: any, i: number) => (
              <IntentSignal key={i} signal={signal} />
            ))}
          </motion.div>
        </motion.div>
      )}

      {/* Footer */}
      <motion.div
        variants={itemVariants}
        className="mt-2 pt-3 border-t border-subtle flex items-center gap-2"
      >
        <Hash className="size-3 text-secondary" />
        <small className="text-xs text-secondary">ID: {lead.id}</small>
      </motion.div>
    </motion.div>
  );
}

export default GetLeadDetails;
mountWidget(
  <AppsSDKUIProvider linkComponent="a">
    <GetLeadDetails />
  </AppsSDKUIProvider>
);
