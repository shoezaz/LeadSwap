import "@/index.css";
import { mountWidget } from "skybridge/web";
import { useToolInfo } from "../helpers";
import { Badge } from "@openai/apps-sdk-ui/components/Badge";
import { AppsSDKUIProvider } from "@openai/apps-sdk-ui/components/AppsSDKUIProvider";
import { motion } from "framer-motion";
import { Star, Trophy, Clock, Users } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 }
};

const tierCardVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 }
};

const rowVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0 }
};

function AnimatedProgress({ value, max, color }: { value: number; max: number; color: string }) {
  const percentage = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="mt-2 h-1.5 bg-subtle rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
        className={`h-full rounded-full ${color}`}
      />
    </div>
  );
}

function ScoreLeads() {
  const { output } = useToolInfo<"score-leads">();

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
        <p className="text-body-sm">Scoring leads against your ICP...</p>
        <small className="text-xs text-secondary">This may take a moment</small>
      </motion.div>
    );
  }

  const outputData = output as any;

  if (!outputData.success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-6 rounded-xl bg-surface text-center border border-default"
      >
        <p className="text-body-sm font-medium text-primary">❌ Scoring failed</p>
      </motion.div>
    );
  }

  const { tierBreakdown, topLeads, totalLeads, processingTimeMs } = outputData;

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
          <Star className="size-5 text-primary" />
          <h2 className="heading-sm">Scoring Complete</h2>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="size-3 text-secondary" />
          <Badge color="secondary" variant="soft">{String(processingTimeMs)}ms</Badge>
        </div>
      </motion.div>

      {/* Tier Breakdown */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-3 gap-2"
      >
        {/* Tier A */}
        <motion.div
          variants={tierCardVariants}
          whileHover={{ scale: 1.02 }}
          className="p-3 rounded-lg bg-surface border border-default text-center cursor-default"
        >
          <span className="text-xs font-semibold uppercase text-success">Tier A</span>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="block text-xl font-bold"
          >
            {tierBreakdown.tierA}
          </motion.span>
          <span className="text-[10px] text-secondary">80-100 pts</span>
          <AnimatedProgress value={tierBreakdown.tierA} max={totalLeads} color="bg-success" />
        </motion.div>

        {/* Tier B */}
        <motion.div
          variants={tierCardVariants}
          whileHover={{ scale: 1.02 }}
          className="p-3 rounded-lg bg-surface border border-default text-center cursor-default"
        >
          <span className="text-xs font-semibold uppercase text-warning">Tier B</span>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="block text-xl font-bold"
          >
            {tierBreakdown.tierB}
          </motion.span>
          <span className="text-[10px] text-secondary">50-79 pts</span>
          <AnimatedProgress value={tierBreakdown.tierB} max={totalLeads} color="bg-warning" />
        </motion.div>

        {/* Tier C */}
        <motion.div
          variants={tierCardVariants}
          whileHover={{ scale: 1.02 }}
          className="p-3 rounded-lg bg-surface border border-default text-center cursor-default"
        >
          <span className="text-xs font-semibold uppercase text-danger">Tier C</span>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="block text-xl font-bold"
          >
            {tierBreakdown.tierC}
          </motion.span>
          <span className="text-[10px] text-secondary">0-49 pts</span>
          <AnimatedProgress value={tierBreakdown.tierC} max={totalLeads} color="bg-danger" />
        </motion.div>
      </motion.div>

      {/* Top Leads Table */}
      <motion.div variants={itemVariants} className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Trophy className="size-4 text-warning" />
          <h3 className="text-xs font-semibold text-secondary uppercase tracking-wide">
            Top {topLeads.length} Leads
          </h3>
        </div>
        <div className="overflow-x-auto rounded-lg border border-subtle">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-subtle/50">
                <th className="text-left px-3 py-2 text-xs font-semibold text-secondary uppercase">Score</th>
                <th className="text-left px-3 py-2 text-xs font-semibold text-secondary uppercase">Company</th>
                <th className="text-left px-3 py-2 text-xs font-semibold text-secondary uppercase">Title</th>
              </tr>
            </thead>
            <motion.tbody
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="divide-y divide-subtle"
            >
              {topLeads.map((lead: any, i: number) => (
                <motion.tr
                  key={i}
                  variants={rowVariants}
                  whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
                  className="transition-colors"
                >
                  <td className="px-3 py-2">
                    <Badge color={lead.tier === "A" ? "success" : lead.tier === "B" ? "warning" : "danger"}>
                      {String(lead.score)}
                    </Badge>
                  </td>
                  <td className="px-3 py-2 font-medium">{lead.company}</td>
                  <td className="px-3 py-2 text-secondary">{lead.title || "-"}</td>
                </motion.tr>
              ))}
            </motion.tbody>
          </table>
        </div>
      </motion.div>

      {/* Footer */}
      <motion.div
        variants={itemVariants}
        className="pt-2 border-t border-subtle text-xs text-secondary flex items-center gap-2"
      >
        <Users className="size-3" />
        <span>Total: {totalLeads} leads scored</span>
      </motion.div>
    </motion.div>
  );
}

export default ScoreLeads;
mountWidget(
  <AppsSDKUIProvider linkComponent="a">
    <ScoreLeads />
  </AppsSDKUIProvider>
);
