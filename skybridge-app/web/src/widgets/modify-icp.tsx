import "@/index.css";
import { mountWidget } from "skybridge/web";
import { useToolInfo } from "../helpers";
import { Badge } from "@openai/apps-sdk-ui/components/Badge";
import { AppsSDKUIProvider } from "@openai/apps-sdk-ui/components/AppsSDKUIProvider";
import { motion } from "framer-motion";
import { Target, Building2, Globe, Users, Tag, Hash, RefreshCw, Pencil } from "lucide-react";

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

function ModifyICP() {
  const { output } = useToolInfo<"modify-icp">();

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
        <p className="text-sm">Updating your ICP...</p>
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
        <p className="text-sm font-medium text-primary">Failed to modify ICP</p>
      </motion.div>
    );
  }

  const { icp, action, changes } = outputData;

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
          <h2 className="heading-sm">ICP Updated</h2>
        </div>
        <div className="flex items-center gap-2">
          {action === "replaced" ? (
            <Badge color="warning" variant="soft">
              <RefreshCw className="size-3 mr-1" />
              Replaced
            </Badge>
          ) : (
            <Badge color="success" variant="soft">
              <Pencil className="size-3 mr-1" />
              Modified
            </Badge>
          )}
        </div>
      </motion.div>

      {/* Changes Applied */}
      {changes && (
        <motion.div variants={itemVariants} className="p-3 bg-success/5 border border-success/20 rounded-lg">
          <p className="text-xs text-secondary mb-1">Changes applied:</p>
          <p className="text-sm font-medium">{changes}</p>
        </motion.div>
      )}

      {/* ICP Display */}
      <div className="flex flex-col gap-5">
        {/* Industries */}
        {icp.industries && icp.industries.length > 0 && (
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
        {icp.geographies && icp.geographies.length > 0 && (
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
        {icp.titles && icp.titles.length > 0 && (
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
        {icp.keywords && icp.keywords.length > 0 && (
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

export default ModifyICP;
mountWidget(
  <AppsSDKUIProvider linkComponent="a">
    <ModifyICP />
  </AppsSDKUIProvider>
);
