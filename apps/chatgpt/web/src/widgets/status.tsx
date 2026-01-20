import "@/index.css";
import { mountWidget } from "skybridge/web";
import { useToolInfo } from "../helpers";
import { Badge } from "@openai/apps-sdk-ui/components/Badge";
import { AppsSDKUIProvider } from "@openai/apps-sdk-ui/components/AppsSDKUIProvider";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Target, Upload, Zap, Check, Circle } from "lucide-react";

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

const cardVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 }
};

function StatusStep({
  stepNumber,
  label,
  isComplete,
  isLast = false
}: {
  stepNumber: number;
  label: string;
  isComplete: boolean;
  isLast?: boolean;
}) {
  return (
    <>
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: stepNumber * 0.15 }}
        className="flex flex-col items-center gap-1"
      >
        <motion.span
          animate={{
            backgroundColor: isComplete ? "var(--color-success)" : "var(--color-subtle)",
            scale: isComplete ? [1, 1.1, 1] : 1
          }}
          transition={{ duration: 0.3 }}
          className={`w-8 h-8 flex items-center justify-center rounded-full text-xs font-semibold ${isComplete ? "text-white" : "text-secondary"
            }`}
        >
          <AnimatePresence mode="wait">
            {isComplete ? (
              <motion.div
                key="check"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
              >
                <Check className="size-4" />
              </motion.div>
            ) : (
              <motion.span key="number">{stepNumber}</motion.span>
            )}
          </AnimatePresence>
        </motion.span>
        <span className={`text-[10px] ${isComplete ? "text-success font-medium" : "text-secondary"}`}>
          {label}
        </span>
      </motion.div>
      {!isLast && (
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: stepNumber * 0.15 + 0.1 }}
          className={`w-10 h-0.5 mx-1 origin-left ${isComplete ? "bg-success" : "bg-subtle"}`}
        />
      )}
    </>
  );
}

function StatusCard({
  icon: Icon,
  title,
  isActive,
  children
}: {
  icon: any;
  title: string;
  isActive: boolean;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ x: 4 }}
      className={`flex gap-3 p-3 rounded-lg border-l-4 bg-surface ${isActive ? "border-success" : "border-warning"
        }`}
    >
      <motion.div
        animate={{
          scale: isActive ? [1, 1.1, 1] : 1,
          rotate: isActive ? [0, 5, -5, 0] : 0
        }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className={`w-10 h-10 rounded-lg flex items-center justify-center ${isActive ? "bg-success/10" : "bg-warning/10"
          }`}
      >
        <Icon className={`size-5 ${isActive ? "text-success" : "text-warning"}`} />
      </motion.div>
      <div className="flex-1">
        <h3 className="text-sm font-semibold mb-1">{title}</h3>
        {children}
      </div>
    </motion.div>
  );
}

function Status() {
  const { output } = useToolInfo<"status">();

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
        <p className="text-body-sm">Loading status...</p>
      </motion.div>
    );
  }

  const allComplete = output.hasICP && output.leadsCount > 0 && output.hasResults;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-4"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center gap-2 pb-3 border-b border-subtle">
        <Activity className="size-5 text-primary" />
        <h2 className="heading-sm">LeadSwap Status</h2>
        {allComplete && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", bounce: 0.5 }}
          >
            <Badge color="success">All Set! 🎉</Badge>
          </motion.div>
        )}
      </motion.div>

      {/* Status Cards */}
      <motion.div variants={containerVariants} className="flex flex-col gap-3">
        {/* ICP Status */}
        <StatusCard icon={Target} title="ICP Profile" isActive={output.hasICP}>
          {output.hasICP && output.icp ? (
            <div className="flex flex-col gap-1">
              <Badge color="success" variant="soft">Active</Badge>
              <p className="text-xs text-secondary whitespace-pre-wrap">{output.icp.summary}</p>
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              <Badge color="warning" variant="soft">Not Defined</Badge>
              <p className="text-xs text-secondary italic">Use define-icp to set your target</p>
            </div>
          )}
        </StatusCard>

        {/* Leads Status */}
        <StatusCard icon={Upload} title="Leads" isActive={output.leadsCount > 0}>
          {output.leadsCount > 0 ? (
            <div className="flex flex-col gap-1">
              <Badge color="success" variant="soft">{output.leadsCount} loaded</Badge>
              <p className="text-xs text-secondary">Ready for scoring</p>
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              <Badge color="warning" variant="soft">Empty</Badge>
              <p className="text-xs text-secondary italic">Use upload-leads or search-leads</p>
            </div>
          )}
        </StatusCard>

        {/* Scoring Status */}
        <StatusCard icon={Zap} title="Scoring" isActive={output.hasResults}>
          {output.hasResults && output.lastScoring ? (
            <div className="flex flex-col gap-2">
              <Badge color="success" variant="soft">Complete</Badge>
              <div className="flex gap-2">
                <Badge color="success">A: {output.lastScoring.tierBreakdown.tierA}</Badge>
                <Badge color="warning">B: {output.lastScoring.tierBreakdown.tierB}</Badge>
                <Badge color="danger">C: {output.lastScoring.tierBreakdown.tierC}</Badge>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              <Badge color="warning" variant="soft">Not Run</Badge>
              <p className="text-xs text-secondary italic">Use score-leads after setup</p>
            </div>
          )}
        </StatusCard>
      </motion.div>

      {/* Progress Tracker */}
      <motion.div
        variants={itemVariants}
        className="flex items-center justify-center p-4 bg-surface border border-default rounded-lg"
      >
        <StatusStep stepNumber={1} label="Define ICP" isComplete={output.hasICP} />
        <StatusStep stepNumber={2} label="Load Leads" isComplete={output.leadsCount > 0} />
        <StatusStep stepNumber={3} label="Score" isComplete={output.hasResults} isLast />
      </motion.div>
    </motion.div>
  );
}

export default Status;
mountWidget(
  <AppsSDKUIProvider linkComponent="a">
    <Status />
  </AppsSDKUIProvider>
);
