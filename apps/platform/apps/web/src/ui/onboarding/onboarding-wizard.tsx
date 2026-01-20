"use client";

import { useState, useCallback } from "react";
import { Button } from "@leadswap/ui";
import { ArrowLeft, Loader2, Plus, X, RefreshCw } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { ScanningAnimation } from "@/ui/shared/scanning-animation";
import type { MarketScanResult, SocialPlatform } from "@/lib/ai/market-intelligence";

type OnboardingStep = "url" | "workspace-name" | "manual" | "scanning" | "competitors" | "generating";

const TOTAL_STEPS = 4;

interface OnboardingWizardProps {
  onComplete: (data: {
    websiteUrl: string;
    workspaceName: string;
    scanResult: MarketScanResult;
    competitors: string[];
    socialAccounts: Record<SocialPlatform, string>;
  }) => void;
}

export function OnboardingWizard({ onComplete }: OnboardingWizardProps) {
  const [step, setStep] = useState<OnboardingStep>("url");
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [workspaceName, setWorkspaceName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scanResult, setScanResult] = useState<MarketScanResult | null>(null);
  const [competitors, setCompetitors] = useState<string[]>([]);
  const [suggestedCompetitors, setSuggestedCompetitors] = useState<{name: string; url: string; favicon?: string}[]>([]);
  const [newCompetitor, setNewCompetitor] = useState("");
  const [generatingStep, setGeneratingStep] = useState("workspace");
  const [socialAccounts] = useState<Record<SocialPlatform, string>>({
    tiktok: "",
    instagram: "",
    twitter: "",
    youtube: "",
    linkedin: "",
    reddit: "",
  });
  const [generatingMessage, setGeneratingMessage] = useState(0);

  // Generating step messages
  const generatingMessages = [
    "Creating workspace...",
    "Generating your report...",
    "Analyzing competitors...",
    "Refining data...",
    "Almost there...",
  ];

  // Progress calculation
  const progress = ((currentStepIndex + 1) / TOTAL_STEPS) * 100;

  // Start market scan
  const startScan = useCallback(async () => {
    if (!websiteUrl) {
      setError("Please enter your website URL");
      return;
    }

    // Add https:// if not present
    const fullUrl = websiteUrl.startsWith("http") ? websiteUrl : `https://${websiteUrl}`;

    // Pre-fill workspace name from URL if not set
    if (!workspaceName) {
      const domain = new URL(fullUrl).hostname.replace("www.", "");
      const name = domain.split(".")[0];
      setWorkspaceName(name.charAt(0).toUpperCase() + name.slice(1));
    }

    setStep("workspace-name");
  }, [websiteUrl, workspaceName]);

  // Continue from workspace name to scanning
  const startActualScan = useCallback(async () => {
    const fullUrl = websiteUrl.startsWith("http") ? websiteUrl : `https://${websiteUrl}`;

    setStep("scanning");
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/ai/market-scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: fullUrl }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Scan failed");
      }

      setScanResult(data.data);
      // Set suggested competitors from scan result
      const suggested = (data.data.competitors || []).slice(0, 8).map((c: any) => ({
        name: c.name,
        url: c.url,
        favicon: c.favicon,
      }));
      setSuggestedCompetitors(suggested);
      // Pre-select the first 3 competitors
      setCompetitors(suggested.slice(0, 3).map((c: any) => c.url));
      setIsLoading(false);
      setStep("competitors");
      setCurrentStepIndex(1);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Scan failed");
      setIsLoading(false);
      setStep("url");
    }
  }, [websiteUrl]);

  // Handle manual entry
  const handleManualContinue = () => {
    // Set workspace name from company name for manual flow
    setWorkspaceName(companyName);
    const slug = companyName.toLowerCase().replace(/\s+/g, "-");
    const generatedUrl = `https://${slug}.com`;
    const mockResult: MarketScanResult = {
      website: {
        url: generatedUrl,
        title: companyName,
        description: "",
        industry,
        keywords: [],
        products: [],
        targetAudience: "",
        valueProposition: "",
      },
      competitors: [],
      socialPresence: [],
      mentions: [],
      situationSummary: "Manual entry - no website scanned",
      quickWins: [
        "Set up your social media profiles",
        "Define your target audience",
        "Research your competitors",
      ],
      recommendations: [],
    };
    setScanResult(mockResult);
    setWebsiteUrl(generatedUrl);
    setStep("competitors");
    setCurrentStepIndex(1);
  };

  // Handle completion - show generating step first
  const handleComplete = () => {
    if (!scanResult) return;
    setStep("generating");
    setCurrentStepIndex(3);
    setGeneratingStep("workspace");
    
    // Call onComplete after a brief moment to let the UI transition
    setTimeout(() => {
      onComplete({
        websiteUrl: websiteUrl.startsWith("http") ? websiteUrl : `https://${websiteUrl}`,
        workspaceName,
        scanResult,
        competitors: competitors.filter(Boolean),
        socialAccounts,
      });
    }, 100);

    // Start cycling through generating messages
    const interval = setInterval(() => {
      setGeneratingMessage((prev) => (prev + 1) % generatingMessages.length);
    }, 2000);

    return () => clearInterval(interval);
  };

  // Can continue to next step
  const canContinue = () => {
    if (step === "url") return !!websiteUrl;
    if (step === "workspace-name") return !!workspaceName;
    if (step === "manual") return !!companyName && !!industry;
    if (step === "competitors") return competitors.some(Boolean);
    return false;
  };

  // Handle back
  const handleBack = () => {
    if (step === "workspace-name") {
      setStep("url");
    } else if (step === "manual") {
      setStep("url");
    } else if (step === "competitors") {
      setStep("workspace-name");
      setCurrentStepIndex(1);
    }
  };

  return (
    <div className="relative flex h-full flex-col">
      {/* Scanning Step Overlay */}
      <AnimatePresence>
        {step === "scanning" && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-white"
          >
            <ScanningAnimation isScanning={isLoading} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Generating Report Step Overlay */}
      <AnimatePresence>
        {step === "generating" && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white"
          >
            <ScanningAnimation isScanning={true} />
            
            {/* Animated Status Text */}
            <div className="mt-8 text-center">
              <AnimatePresence mode="wait">
                <motion.p
                  key={generatingMessage}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="text-lg font-medium text-neutral-900"
                >
                  {generatingMessages[generatingMessage]}
                </motion.p>
              </AnimatePresence>
              <p className="mt-2 text-sm text-neutral-500">
                This may take a few moments
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-8 pb-24 lg:px-8 lg:py-12 lg:pb-32">
        <div className="w-full max-w-md">
          <AnimatePresence mode="wait">
            {step === "url" && (
              <motion.div
                key="url"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6 lg:space-y-8"
              >
                <div>
                  <h1 className="text-xl font-medium tracking-tight text-neutral-900 lg:text-2xl">
                    Track your first brand
                  </h1>
                  <p className="mt-2 text-sm text-neutral-500">
                    This will be the first brand you'll track on Cliqo. You can add more later.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center border-b-2 border-neutral-200 pb-4 transition-colors focus-within:border-neutral-900">
                    <span className="text-xl text-neutral-400">https://</span>
                    <input
                      type="text"
                      placeholder="example.com"
                      value={websiteUrl.replace(/^https?:\/\//, "")}
                      onChange={(e) => setWebsiteUrl(e.target.value)}
                      className="flex-1 border-none bg-transparent text-xl text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-0"
                      autoFocus
                    />
                  </div>
                  <p className="text-center text-xs text-neutral-400">
                    You can enter with or without https://
                  </p>
                </div>

                {error && (
                  <p className="text-center text-sm text-red-500">{error}</p>
                )}

                <button
                  type="button"
                  onClick={() => setStep("manual")}
                  className="block w-full text-center text-sm text-neutral-400 hover:text-neutral-600"
                >
                  I don't have a website yet
                </button>
              </motion.div>
            )}

            {step === "workspace-name" && (
              <motion.div
                key="workspace-name"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6 lg:space-y-8"
              >
                <div>
                  <h1 className="text-xl font-medium tracking-tight text-neutral-900 lg:text-2xl">
                    Name your workspace
                  </h1>
                  <p className="mt-2 text-sm text-neutral-500">
                    This is usually your company or brand name
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="border-b-2 border-neutral-200 pb-4 transition-colors focus-within:border-neutral-900">
                    <input
                      type="text"
                      placeholder="Acme Inc"
                      value={workspaceName}
                      onChange={(e) => setWorkspaceName(e.target.value)}
                      className="w-full border-none bg-transparent text-xl text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-0"
                      autoFocus
                    />
                  </div>
                </div>

                {error && (
                  <p className="text-center text-sm text-red-500">{error}</p>
                )}
              </motion.div>
            )}

            {step === "manual" && (
              <motion.div
                key="manual"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                <div>
                  <h1 className="text-2xl font-medium tracking-tight text-neutral-900">
                    Tell us about your business
                  </h1>
                  <p className="mt-2 text-sm text-neutral-500">
                    We'll use this to personalize your experience.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="border-b-2 border-neutral-200 pb-2 transition-colors focus-within:border-neutral-900">
                    <label className="mb-1 block text-xs text-neutral-400">Company Name</label>
                    <input
                      type="text"
                      placeholder="Acme Inc."
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full border-none bg-transparent text-lg text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-0"
                      autoFocus
                    />
                  </div>

                  <div className="border-b-2 border-neutral-200 pb-2 transition-colors focus-within:border-neutral-900">
                    <label className="mb-1 block text-xs text-neutral-400">Industry</label>
                    <select
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                      className="w-full border-none bg-transparent text-lg text-neutral-900 focus:outline-none focus:ring-0"
                    >
                      <option value="">Select your industry</option>
                      <option value="saas">SaaS / Software</option>
                      <option value="ecommerce">E-commerce</option>
                      <option value="agency">Agency / Services</option>
                      <option value="fintech">Fintech</option>
                      <option value="healthtech">Healthtech</option>
                      <option value="edtech">Edtech</option>
                      <option value="marketplace">Marketplace</option>
                      <option value="media">Media / Content</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setStep("url")}
                  className="block w-full text-center text-sm text-neutral-400 hover:text-neutral-600"
                >
                  I have a website
                </button>
              </motion.div>
            )}

            {step === "competitors" && (
              <motion.div
                key="competitors"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div>
                  <h1 className="text-2xl font-medium tracking-tight text-neutral-900">
                    Who are your competitors?
                  </h1>
                  <p className="mt-2 text-sm text-neutral-500">
                    List your 3 main competitors{" "}
                    <span className="text-neutral-400">(up to 5 total)</span>
                  </p>
                </div>

                {/* 5 Input Slots (3 required, 2 optional) */}
                <div className="space-y-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="relative">
                      <input
                        type="text"
                        placeholder={i < 3 ? "e.g. competitor.com" : "Optional"}
                        value={competitors[i] || ""}
                        onChange={(e) => {
                          const newComps = [...competitors];
                          // Ensure array has enough slots
                          while (newComps.length <= i) newComps.push("");
                          newComps[i] = e.target.value;
                          setCompetitors(newComps);
                        }}
                        className="w-full rounded-[10px] border-2 border-[#eae8e3] bg-[#fcfbf7] px-4 py-2.5 text-sm text-[#39312e] placeholder:text-[#9c9792] focus:border-neutral-900 focus:outline-none"
                      />
                      {competitors[i] && (
                        <button
                          type="button"
                          onClick={() => {
                            const newComps = [...competitors];
                            newComps[i] = "";
                            // Filter out empty strings to shift up, but maintain 5 slots logic
                            // Actually for this specific design, we might want to just clear the slot
                            // to match "filling slots" behavior. Let's just clear it.
                            newComps[i] = "";
                            setCompetitors(newComps);
                          }}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Suggested Competitors Section */}
                {suggestedCompetitors.length > 0 && (
                  <div className="mt-6">
                    <div className="mb-3 flex items-center justify-between">
                      <p className="text-sm font-medium text-[#39312e]">
                        Suggested competitors
                      </p>
                      <button 
                        type="button"
                        className="text-neutral-400 hover:text-neutral-600"
                        onClick={startScan} // Allow re-scanning
                      >
                        <RefreshCw className="h-4 w-4" />
                      </button>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {suggestedCompetitors.map((comp, i) => {
                        // Check if this URL is already in one of the inputs
                        const isSelected = competitors.some(c => c === comp.url || c === comp.name);
                        
                        if (isSelected) return null; // Hide if already selected/added

                        return (
                          <button
                            key={i}
                            type="button"
                            onClick={() => {
                              // Find first empty slot
                              const firstEmptyIndex = competitors.findIndex(c => !c);
                              const targetIndex = firstEmptyIndex === -1 ? competitors.length : firstEmptyIndex;
                              
                              if (targetIndex < 5) {
                                const newComps = [...competitors];
                                // Fill array up to target index
                                while (newComps.length <= targetIndex) newComps.push("");
                                newComps[targetIndex] = comp.url;
                                setCompetitors(newComps);
                              }
                            }}
                            className="flex items-center gap-2 rounded-[20px] border border-[#eae8e3] bg-white px-3 py-1.5 transition-colors hover:border-[#d0cdc7]"
                          >
                            {comp.favicon ? (
                              <img
                                src={comp.favicon}
                                alt=""
                                className="h-4 w-4 rounded-[4px]"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display = "none";
                                }}
                              />
                            ) : (
                              <div className="h-4 w-4 rounded-[4px] bg-neutral-200" />
                            )}
                            <span className="text-sm font-medium text-[#39312e]">
                              {new URL(comp.url).hostname.replace("www.", "")}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}


              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Footer with Progress - Fixed at bottom */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-neutral-100 bg-white">
        {/* Progress Bar */}
        <div className="h-1 bg-neutral-100">
          <motion.div
            className="h-full bg-neutral-900"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between px-8 py-4">
          <button
            type="button"
            onClick={handleBack}
            disabled={step === "url"}
            className="flex items-center gap-1 text-sm text-neutral-500 hover:text-neutral-700 disabled:invisible"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>

          <Button
            onClick={() => {
              if (step === "url") startScan();
              else if (step === "workspace-name") startActualScan();
              else if (step === "manual") handleManualContinue();
              else if (step === "competitors") handleComplete();
            }}
            disabled={!canContinue() || isLoading}
            variant="primary"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Continue"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

