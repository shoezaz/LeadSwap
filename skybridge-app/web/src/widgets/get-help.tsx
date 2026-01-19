import "@/index.css";
import { mountWidget } from "skybridge/web";
import { useToolInfo } from "../helpers";
import { AppsSDKUIProvider } from "@openai/apps-sdk-ui/components/AppsSDKUIProvider";
import { motion } from "framer-motion";
import { HelpCircle, BookOpen, Upload, CheckCircle, Download, Target, Settings, Zap, Search, FileText } from "lucide-react";

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

function ToolCard({
  icon: Icon,
  name,
  description
}: {
  icon: any;
  name: string;
  description: string;
}) {
  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ scale: 1.02 }}
      className="flex items-start gap-3 p-3 bg-surface border border-default rounded-lg"
    >
      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
        <Icon className="size-4 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <code className="text-xs font-semibold text-primary">{name}</code>
        <p className="text-xs text-secondary mt-0.5">{description}</p>
      </div>
    </motion.div>
  );
}

function GetHelp() {
  const { output } = useToolInfo<"get-help">();

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
        <p className="text-body-sm">Loading help...</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-4"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center gap-2 pb-3 border-b border-subtle">
        <HelpCircle className="size-5 text-primary" />
        <h2 className="heading-sm">LeadSwap Help</h2>
      </motion.div>

      {/* Workflow Section */}
      <motion.div variants={itemVariants} className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <BookOpen className="size-4 text-secondary" />
          <h3 className="text-xs font-semibold text-secondary uppercase tracking-wide">
            Workflow
          </h3>
        </div>
        <div className="flex flex-col gap-1 pl-6">
          <div className="flex items-center gap-2 text-sm">
            <span className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">1</span>
            <span>Define your ICP (Ideal Customer Profile)</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">2</span>
            <span>Upload or search for leads</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">3</span>
            <span>Score leads against your ICP</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">4</span>
            <span>Review results and export</span>
          </div>
        </div>
      </motion.div>

      {/* Available Tools */}
      <motion.div variants={itemVariants} className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Settings className="size-4 text-secondary" />
          <h3 className="text-xs font-semibold text-secondary uppercase tracking-wide">
            Available Tools
          </h3>
        </div>
        <motion.div variants={containerVariants} className="grid gap-2">
          <ToolCard
            icon={Target}
            name="define-icp"
            description="Create your Ideal Customer Profile"
          />
          <ToolCard
            icon={Settings}
            name="modify-icp"
            description="Update your ICP criteria"
          />
          <ToolCard
            icon={Upload}
            name="upload-leads"
            description="Upload leads for processing"
          />
          <ToolCard
            icon={Search}
            name="search-leads"
            description="Find new leads matching your ICP"
          />
          <ToolCard
            icon={Zap}
            name="score-leads"
            description="Score leads against your ICP"
          />
          <ToolCard
            icon={FileText}
            name="get-results"
            description="View scoring results with pagination"
          />
          <ToolCard
            icon={CheckCircle}
            name="get-lead-details"
            description="Deep dive into a specific lead"
          />
          <ToolCard
            icon={Download}
            name="export-leads"
            description="Download your data as CSV/JSON"
          />
        </motion.div>
      </motion.div>

      {/* Footer */}
      <motion.div
        variants={itemVariants}
        className="mt-2 pt-3 border-t border-subtle text-xs text-secondary text-center"
      >
        Ask me anything about these tools!
      </motion.div>
    </motion.div>
  );
}

export default GetHelp;
mountWidget(
  <AppsSDKUIProvider linkComponent="a">
    <GetHelp />
  </AppsSDKUIProvider>
);
