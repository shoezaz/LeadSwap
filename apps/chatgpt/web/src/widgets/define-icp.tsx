import "@/index.css";
import { mountWidget } from "skybridge/web";
import { useToolInfo } from "../helpers";
import { useState } from "react";
import { Badge } from "@openai/apps-sdk-ui/components/Badge";
import { Button } from "@openai/apps-sdk-ui/components/Button";
import { Textarea } from "@openai/apps-sdk-ui/components/Textarea";
import { AppsSDKUIProvider } from "@openai/apps-sdk-ui/components/AppsSDKUIProvider";
import { motion, AnimatePresence } from "framer-motion";
import { Target, Building2, Globe, Users, Tag, Hash, Pencil, X, Save, RefreshCw } from "lucide-react";

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

const badgeContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

const badgeVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 }
};

function DefineICP() {
  const { output } = useToolInfo<"define-icp">();
  const [isEditing, setIsEditing] = useState(false);
  const [editDescription, setEditDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        <p className="text-sm">Analyzing your ICP description...</p>
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
        <p className="text-sm font-medium text-primary">❌ Failed to create ICP</p>
      </motion.div>
    );
  }

  const { icp } = outputData;

  const handleEditStart = () => {
    // Build current ICP as text description
    const description = [
      icp.industries.length > 0 ? `Industries: ${icp.industries.join(", ")}` : "",
      icp.companySizeMin || icp.companySizeMax
        ? `Company size: ${icp.companySizeMin || "any"}-${icp.companySizeMax || "any"} employees`
        : "",
      icp.geographies.length > 0 ? `Geographies: ${icp.geographies.join(", ")}` : "",
      icp.titles.length > 0 ? `Target titles: ${icp.titles.join(", ")}` : "",
      icp.keywords.length > 0 ? `Keywords: ${icp.keywords.join(", ")}` : "",
    ].filter(Boolean).join("\n");

    setEditDescription(description);
    setIsEditing(true);
  };

  const handleModifyICP = async () => {
    if (typeof window !== "undefined" && (window as any).openai?.callTool) {
      setIsSubmitting(true);
      try {
        await (window as any).openai.callTool("modify-icp", {
          description: editDescription,
          replace: true
        });
        setIsEditing(false);
      } catch (e) {
        console.error("Failed to modify ICP", e);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleRefineWithAI = () => {
    if (typeof window !== "undefined" && (window as any).openai?.sendFollowUpMessage) {
      (window as any).openai.sendFollowUpMessage(
        `Please help me refine my ICP. Current description:\n${editDescription}`
      );
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
          <Target className="size-5 text-primary" />
          <h2 className="heading-sm">Ideal Customer Profile</h2>
        </div>
        <div className="flex items-center gap-2">
          <Badge color="success" variant="soft">Active</Badge>
          {!isEditing && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleEditStart}
              className="p-1.5 rounded-lg bg-surface border border-default hover:bg-subtle transition-colors"
              title="Edit ICP"
            >
              <Pencil className="size-4 text-secondary" />
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* Edit Mode */}
      <AnimatePresence>
        {isEditing && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 bg-surface border border-default rounded-lg flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Edit ICP Description</span>
                <button
                  onClick={() => setIsEditing(false)}
                  className="p-1 rounded hover:bg-subtle"
                >
                  <X className="size-4 text-secondary" />
                </button>
              </div>

              <Textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                placeholder="Describe your ideal customer profile..."
                rows={6}
              />

              <div className="flex items-center gap-2">
                <Button
                  color="primary"
                  onClick={handleModifyICP}
                  disabled={isSubmitting || !editDescription.trim()}
                >
                  {isSubmitting ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="size-4 border-2 border-white/30 border-t-white rounded-full mr-2"
                    />
                  ) : (
                    <Save className="size-4 mr-2" />
                  )}
                  Save Changes
                </Button>
                <Button
                  color="secondary"
                  onClick={handleRefineWithAI}
                >
                  <RefreshCw className="size-4 mr-2" />
                  Refine with AI
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ICP Display */}
      <div className="flex flex-col gap-5">
        {/* Industries */}
        {icp.industries.length > 0 && (
          <motion.div variants={itemVariants} className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Building2 className="size-4 text-secondary" />
              <h3 className="text-xs font-semibold text-secondary uppercase tracking-wide">
                Industries
              </h3>
            </div>
            <motion.div
              variants={badgeContainerVariants}
              className="flex flex-wrap gap-2"
            >
              {icp.industries.map((ind: string, i: number) => (
                <motion.div key={i} variants={badgeVariants}>
                  <Badge color="secondary">{ind}</Badge>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}

        {/* Company Size */}
        {(icp.companySizeMin || icp.companySizeMax) && (
          <motion.div variants={itemVariants} className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Users className="size-4 text-secondary" />
              <h3 className="text-xs font-semibold text-secondary uppercase tracking-wide">
                Company Size
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <Badge color="info" variant="soft">
                {icp.companySizeMin && icp.companySizeMax
                  ? `${icp.companySizeMin} - ${icp.companySizeMax} employees`
                  : icp.companySizeMin
                    ? `${icp.companySizeMin}+ employees`
                    : `Up to ${icp.companySizeMax} employees`}
              </Badge>
            </div>
          </motion.div>
        )}

        {/* Geographies */}
        {icp.geographies.length > 0 && (
          <motion.div variants={itemVariants} className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Globe className="size-4 text-secondary" />
              <h3 className="text-xs font-semibold text-secondary uppercase tracking-wide">
                Geographies
              </h3>
            </div>
            <motion.div
              variants={badgeContainerVariants}
              className="flex flex-wrap gap-2"
            >
              {icp.geographies.map((geo: string, i: number) => (
                <motion.div key={i} variants={badgeVariants}>
                  <Badge color="success">{geo}</Badge>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}

        {/* Target Titles */}
        {icp.titles.length > 0 && (
          <motion.div variants={itemVariants} className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Users className="size-4 text-secondary" />
              <h3 className="text-xs font-semibold text-secondary uppercase tracking-wide">
                Target Titles
              </h3>
            </div>
            <motion.div
              variants={badgeContainerVariants}
              className="flex flex-wrap gap-2"
            >
              {icp.titles.map((title: string, i: number) => (
                <motion.div key={i} variants={badgeVariants}>
                  <Badge color="warning">{title}</Badge>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}

        {/* Keywords */}
        {icp.keywords.length > 0 && (
          <motion.div variants={itemVariants} className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Tag className="size-4 text-secondary" />
              <h3 className="text-xs font-semibold text-secondary uppercase tracking-wide">
                Keywords
              </h3>
            </div>
            <motion.div
              variants={badgeContainerVariants}
              className="flex flex-wrap gap-2"
            >
              {icp.keywords.map((kw: string, i: number) => (
                <motion.div key={i} variants={badgeVariants}>
                  <Badge color="info">{kw}</Badge>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </div>

      {/* Footer */}
      <motion.div
        variants={itemVariants}
        className="mt-2 pt-3 border-t border-subtle flex items-center gap-2"
      >
        <Hash className="size-3 text-secondary" />
        <small className="text-xs text-secondary">ID: {icp.id}</small>
      </motion.div>
    </motion.div>
  );
}

export default DefineICP;
mountWidget(
  <AppsSDKUIProvider linkComponent="a">
    <DefineICP />
  </AppsSDKUIProvider>
);

