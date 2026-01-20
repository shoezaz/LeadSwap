"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Button,
  Badge,
  Avatar,
  Card,
  Modal,
  Input,
  Tooltip,
} from "@leadswap/ui";
import {
  Mail,
  Check,
  X,
  Trash2,
  Star,
  AlertCircle,
  ExternalLink,
  RefreshCw,
  Plus,
  Settings2,
  Zap,
} from "lucide-react";
import { cn, fetcher } from "@leadswap/utils";
import useSWR, { mutate } from "swr";
import { useParams } from "next/navigation";
import useWorkspace from "@/lib/swr/use-workspace";
import { toast } from "sonner";

interface EmailAccount {
  id: string;
  provider: "gmail" | "outlook" | "other";
  email: string;
  displayName?: string;
  isDefault: boolean;
  isActive: boolean;
  lastUsedAt?: string;
  totalSent: number;
  createdAt: string;
}

const PROVIDER_INFO = {
  gmail: {
    name: "Gmail",
    icon: "https://upload.wikimedia.org/wikipedia/commons/7/7e/Gmail_icon_%282020%29.svg",
    color: "bg-red-50 border-red-200",
    description: "Connect your Gmail account to send outreach emails",
  },
  outlook: {
    name: "Outlook",
    icon: "https://upload.wikimedia.org/wikipedia/commons/d/df/Microsoft_Office_Outlook_%282018%E2%80%93present%29.svg",
    color: "bg-blue-50 border-blue-200",
    description: "Connect your Microsoft Outlook account",
  },
  other: {
    name: "Other",
    icon: null,
    color: "bg-neutral-50 border-neutral-200",
    description: "Generic email provider",
  },
};

export function IntegrationsPageClient() {
  const { slug } = useParams();
  const { id: workspaceId } = useWorkspace();
  const [selectedAccount, setSelectedAccount] = useState<EmailAccount | null>(null);
  const [showDisconnectModal, setShowDisconnectModal] = useState(false);

  const { data: emailAccounts, isLoading } = useSWR<EmailAccount[]>(
    workspaceId ? `/api/workspaces/${slug}/email-accounts` : null,
    fetcher
  );

  const handleConnectGmail = async () => {
    try {
      const response = await fetch(`/api/integrations/gmail/auth?workspaceId=${workspaceId}`);
      const data = await response.json();
      
      if (data.authUrl) {
        window.location.href = data.authUrl;
      } else {
        toast.error("Failed to generate auth URL");
      }
    } catch (error) {
      toast.error("Failed to connect Gmail");
    }
  };

  const handleConnectOutlook = async () => {
    try {
      const response = await fetch(`/api/integrations/outlook/auth?workspaceId=${workspaceId}`);
      const data = await response.json();
      
      if (data.authUrl) {
        window.location.href = data.authUrl;
      } else {
        toast.error("Failed to generate auth URL");
      }
    } catch (error) {
      toast.error("Failed to connect Outlook");
    }
  };

  const handleSetDefault = async (accountId: string) => {
    try {
      await fetch(`/api/workspaces/${slug}/email-accounts`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accountId, action: "set-default" }),
      });
      
      await mutate(`/api/workspaces/${slug}/email-accounts`);
      toast.success("Default email account updated");
    } catch (error) {
      toast.error("Failed to update default");
    }
  };

  const handleDisconnect = async () => {
    if (!selectedAccount) return;

    try {
      await fetch(`/api/workspaces/${slug}/email-accounts`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accountId: selectedAccount.id, action: "disconnect" }),
      });
      
      await mutate(`/api/workspaces/${slug}/email-accounts`);
      setShowDisconnectModal(false);
      setSelectedAccount(null);
      toast.success("Email account disconnected");
    } catch (error) {
      toast.error("Failed to disconnect");
    }
  };

  return (
    <div className="space-y-8">
      {/* Email Accounts Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-neutral-900">Email Accounts</h2>
            <p className="text-sm text-neutral-500">
              Connect your email to send outreach campaigns from your own address
            </p>
          </div>
        </div>

        {/* Connected Accounts */}
        {emailAccounts && emailAccounts.length > 0 && (
          <div className="space-y-3 mb-6">
            {emailAccounts.map((account) => {
              const providerInfo = PROVIDER_INFO[account.provider];
              return (
                <motion.div
                  key={account.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "flex items-center gap-4 p-4 rounded-xl border transition-all",
                    providerInfo.color,
                    account.isDefault && "ring-2 ring-violet-500 ring-offset-2"
                  )}
                >
                  {/* Provider Icon */}
                  <div className="flex-shrink-0">
                    {providerInfo.icon ? (
                      <img
                        src={providerInfo.icon}
                        alt={providerInfo.name}
                        className="w-10 h-10"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-neutral-200 flex items-center justify-center">
                        <Mail className="h-5 w-5 text-neutral-500" />
                      </div>
                    )}
                  </div>

                  {/* Account Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-neutral-900 truncate">
                        {account.email}
                      </span>
                      {account.isDefault && (
                        <Badge variant="violet" className="text-xs">
                          Default
                        </Badge>
                      )}
                      {!account.isActive && (
                        <Tooltip content="This account needs to be reconnected">
                          <AlertCircle className="h-4 w-4 text-amber-500" />
                        </Tooltip>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-neutral-500 mt-1">
                      <span>{providerInfo.name}</span>
                      {account.displayName && (
                        <>
                          <span>•</span>
                          <span>{account.displayName}</span>
                        </>
                      )}
                      <span>•</span>
                      <span>{account.totalSent} emails sent</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {!account.isDefault && (
                      <Tooltip content="Set as default">
                        <Button
                          variant="secondary"
                          onClick={() => handleSetDefault(account.id)}
                          className="p-2"
                        >
                          <Star className="h-4 w-4" />
                        </Button>
                      </Tooltip>
                    )}
                    <Tooltip content="Disconnect">
                      <Button
                        variant="secondary"
                        onClick={() => {
                          setSelectedAccount(account);
                          setShowDisconnectModal(true);
                        }}
                        className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </Tooltip>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Connect New Account Cards */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* Gmail Card */}
          <Card className="p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              <img
                src={PROVIDER_INFO.gmail.icon}
                alt="Gmail"
                className="w-12 h-12"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-neutral-900">Gmail</h3>
                <p className="text-sm text-neutral-500 mt-1">
                  {PROVIDER_INFO.gmail.description}
                </p>
                <Button
                  onClick={handleConnectGmail}
                  className="mt-4"
                  variant="secondary"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Connect Gmail
                </Button>
              </div>
            </div>
          </Card>

          {/* Outlook Card */}
          <Card className="p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              <img
                src={PROVIDER_INFO.outlook.icon}
                alt="Outlook"
                className="w-12 h-12"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-neutral-900">Microsoft Outlook</h3>
                <p className="text-sm text-neutral-500 mt-1">
                  {PROVIDER_INFO.outlook.description}
                </p>
                <Button
                  onClick={handleConnectOutlook}
                  className="mt-4"
                  variant="secondary"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Connect Outlook
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Empty State */}
        {!isLoading && emailAccounts?.length === 0 && (
          <div className="text-center py-8 border-2 border-dashed border-neutral-200 rounded-xl mt-4">
            <Mail className="h-12 w-12 mx-auto text-neutral-300 mb-3" />
            <h3 className="font-medium text-neutral-900">No email accounts connected</h3>
            <p className="text-sm text-neutral-500 mt-1">
              Connect your email to start sending outreach campaigns
            </p>
          </div>
        )}
      </section>

      {/* AI & Search Integrations */}
      <section>
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-neutral-900">AI & Search</h2>
          <p className="text-sm text-neutral-500">
            API keys for AI-powered features like creator discovery
          </p>
        </div>

        <div className="space-y-4">
          {/* SCIRA Providers Status */}
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-medium text-neutral-900">SCIRA Search Tools</h3>
                  <p className="text-xs text-neutral-500">
                    Multi-platform creator discovery
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="success" className="text-xs">
                  <Check className="h-3 w-3 mr-1" />
                  Configured
                </Badge>
                <a
                  href="/SCIRA_ENV_SETUP.md"
                  target="_blank"
                  className="text-sm text-violet-600 hover:text-violet-700 flex items-center gap-1"
                >
                  Setup Guide
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-4">
              <ProviderStatusBadge name="Tavily" status={!!process.env.NEXT_PUBLIC_HAS_TAVILY} />
              <ProviderStatusBadge name="Supadata" status={!!process.env.NEXT_PUBLIC_HAS_SUPADATA} />
              <ProviderStatusBadge name="Parallel" status={!!process.env.NEXT_PUBLIC_HAS_PARALLEL} />
            </div>
          </Card>

          {/* Anthropic AI */}
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                  <span className="text-xl">🤖</span>
                </div>
                <div>
                  <h3 className="font-medium text-neutral-900">Anthropic Claude</h3>
                  <p className="text-xs text-neutral-500">
                    AI negotiation and scoring
                  </p>
                </div>
              </div>
              <Badge variant="success" className="text-xs">
                <Check className="h-3 w-3 mr-1" />
                Connected
              </Badge>
            </div>
          </Card>
        </div>
      </section>

      {/* Disconnect Confirmation Modal */}
      <Modal
        showModal={showDisconnectModal}
        setShowModal={setShowDisconnectModal}
      >
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
              <AlertCircle className="h-5 w-5 text-red-500" />
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900">Disconnect Email Account</h3>
              <p className="text-sm text-neutral-500">
                This will remove {selectedAccount?.email}
              </p>
            </div>
          </div>
          <p className="text-sm text-neutral-600 mb-6">
            You won't be able to send emails from this account anymore. 
            Any scheduled campaigns using this account will be paused.
          </p>
          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={() => setShowDisconnectModal(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDisconnect}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Disconnect
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function ProviderStatusBadge({ name, status }: { name: string; status: boolean }) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 px-3 py-2 rounded-lg text-xs",
        status
          ? "bg-green-50 text-green-700"
          : "bg-neutral-100 text-neutral-500"
      )}
    >
      {status ? (
        <Check className="h-3 w-3" />
      ) : (
        <X className="h-3 w-3" />
      )}
      {name}
    </div>
  );
}

