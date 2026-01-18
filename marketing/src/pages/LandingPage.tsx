import { useState } from 'react';
import Lottie from 'lottie-react';
import meterAnimation from '../assets/meter.json';
import analyticsAnimation from '../assets/analytics.json';
import './LandingPage.css';
import { FileUploadDropzone } from '../components/FileUploadDropzone';

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="landing-page">
      <main className="main-content">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="container">
            <div className="hero-content">
              <div className="hero-grid">
                <div className="hero-text">
                  <h1 className="hero-title">Don't buy leads. Build them.</h1>
                  <p className="hero-subtitle">
                    Enrich is the AI agent that sources, verifies, and enriches B2B prospects in real-time. No more stale databases.
                  </p>
                  <FileUploadDropzone
                    onFileSelect={(file) => console.log('File selected:', file.name)}
                    onContinueWithoutFile={() => console.log('Continue without file')}
                  />
                </div>
                <div className="hero-visual">
                  <video
                    src="/herovid.mp4"
                    className="hero-video"
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
                </div>
              </div>
              <div className="trust-bar">
                <p className="trust-text">
                  Powered by
                </p>
                <div className="trust-logos">
                  <img alt="Partner" src="/partners/partner-1.png" />
                  <img alt="Partner" src="/partners/partner-2.png" />
                  <img alt="Partner" src="/partners/partner-3.png" />
                  <img alt="Partner" src="/partners/partner-4.png" />
                  <img alt="Partner" src="/partners/partner-5.png" />
                  <img alt="Partner" src="/partners/partner-6.png" />
                  <img alt="Partner" src="/partners/partner-7.png" />
                  <img alt="Partner" src="/partners/partner-8.png" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Highlights Section */}
        <section className="highlights-section">
          <div className="container">
            <div className="section-header">
              <div className="badge">
                <div className="badge-dot"></div>
                Highlights
              </div>
              <div className="section-title-group">
                <h2 className="section-title">The complete platform for AI-powered lead generation</h2>
                <p className="section-subtitle">
                  Enrich is designed to find, verify and deliver prospects that match your exact ICP, in real-time.
                </p>
              </div>
            </div>
            <div className="highlights-grid">
              <div className="highlight-card">
                <video
                  src="/aretheyanyleads.mp4"
                  className="card-image highlight-video"
                  autoPlay
                  loop
                  muted
                  playsInline
                />
                <div className="card-content">
                  <h3 className="card-title">Neural-powered search</h3>
                  <p className="card-description">
                    Find companies based on meaning, not keywords. Describe your ideal customer and let AI do the rest.
                  </p>
                </div>
              </div>
              <div className="highlight-card">
                <Lottie
                  animationData={meterAnimation}
                  loop={true}
                  className="card-image"
                />
                <div className="card-content">
                  <h3 className="card-title">Live web verification</h3>
                  <p className="card-description">
                    Our agent visits every website in real-time to verify activity, detect tech stack, and validate relevance.
                  </p>
                </div>
              </div>
              <div className="highlight-card">
                <Lottie
                  animationData={analyticsAnimation}
                  loop={true}
                  className="card-image"
                />
                <div className="card-content">
                  <h3 className="card-title">Instant enrichment</h3>
                  <p className="card-description">
                    Get emails, social profiles, and technology stack without manual research or expensive data providers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How it Works Section */}
        <section className="how-it-works-section">
          <div className="container">
            <div className="section-header">
              <div className="badge">
                <div className="badge-dot"></div>
                How it works
              </div>
              <div className="section-title-group">
                <h2 className="section-title">An end-to-end solution for lead generation</h2>
                <p className="section-subtitle">
                  With Enrich, you describe your ideal customer once and get verified, enriched leads ready for outreach.
                </p>
              </div>
            </div>
            <div className="how-it-works-grid">
              <div className="steps-list">
                <div className="step-wrapper">
                  <button className="step-card active">
                    <div className="step-header">
                      <span className="step-number gradient-text">01 .</span>
                      <div className="step-content">
                        <h3 className="step-title">Describe your ICP</h3>
                        <p className="step-description">
                          Tell the agent who you're looking for in plain language: "Find SaaS startups in Berlin that use Stripe and are hiring salespeople."
                        </p>
                      </div>
                    </div>
                  </button>
                </div>
                <div className="step-wrapper">
                  <button className="step-card">
                    <div className="step-header">
                      <span className="step-number">02 .</span>
                      <div className="step-content">
                        <h3 className="step-title">Agent hunts the web</h3>
                      </div>
                    </div>
                  </button>
                </div>
                <div className="step-wrapper">
                  <button className="step-card">
                    <div className="step-header">
                      <span className="step-number">03 .</span>
                      <div className="step-content">
                        <h3 className="step-title">Review & refine</h3>
                      </div>
                    </div>
                  </button>
                </div>
                <div className="step-wrapper">
                  <button className="step-card">
                    <div className="step-header">
                      <span className="step-number">04 .</span>
                      <div className="step-content">
                        <h3 className="step-title">Export qualified leads</h3>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
              <div className="demo-visual">
                <video
                  src="https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F78bf02844a5bf2acab9621a7135ea5a79c21d3cf.png?generation=1768049314438075&alt=media"
                  className="demo-video"
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="features-section">
          <div className="container">
            <div className="section-header">
              <div className="badge">
                <div className="badge-dot"></div>
                Features
              </div>
              <h2 className="section-title">Build the perfect B2B prospecting agent</h2>
              <p className="section-subtitle-wide">
                Enrich gives you all the tools to find leads that actually convert.
              </p>
            </div>

            <div className="features-grid">
              {/* Large Features */}
              <div className="feature-grid-large">
                <div className="feature-card">
                  <div className="feature-image-wrapper">
                    <img
                      alt="Search by meaning, not keywords"
                      src="https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2Fbf5ac21cc4ccb152ed3eda944dbf79b82a663e10.png&w=1920&q=75?generation=1768049314381089&alt=media"
                      className="feature-image"
                    />
                  </div>
                  <div className="feature-content">
                    <h3 className="feature-title">Search by meaning, not keywords</h3>
                    <p className="feature-description">
                      Powered by Exa.ai, find companies that match your criteria semantically. "Ethical e-commerce brands" works better than "sustainable shop online."
                    </p>
                  </div>
                </div>
                <div className="feature-card">
                  <div className="feature-image-wrapper">
                    <img
                      alt="Know their tools before you reach out"
                      src="https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2Fa630fe8c802f6ac92e20ab06f95bd3c760012768.png&w=1920&q=75?generation=1768049314384083&alt=media"
                      className="feature-image"
                    />
                  </div>
                  <div className="feature-content">
                    <h3 className="feature-title">Know their tools before you reach out</h3>
                    <p className="feature-description">
                      Automatically detect what technologies a company uses. Target Stripe users, Shopify stores, or companies running WordPress.
                    </p>
                  </div>
                </div>
              </div>

              {/* Small Features */}
              <div className="feature-grid-small">
                <div className="feature-card-small">
                  <div className="feature-image-wrapper">
                    <img
                      alt="Find lookalikes"
                      src="https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F78575412ef5a6c1d13598393d2eef6dfdd1a2a7a.png&w=828&q=75?generation=1768049314526372&alt=media"
                      className="feature-image"
                    />
                  </div>
                  <div className="feature-content">
                    <h3 className="feature-title-small">Find lookalikes</h3>
                    <p className="feature-description-small">
                      Give us one company you love, we'll find 50 more like it.
                    </p>
                  </div>
                </div>
                <div className="feature-card-small">
                  <div className="feature-image-wrapper">
                    <img
                      alt="Get contact info"
                      src="https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F4f83dc5ee70d570dc560e25fa1c0c81a657270cd.png&w=828&q=75?generation=1768049314510943&alt=media"
                      className="feature-image"
                    />
                  </div>
                  <div className="feature-content">
                    <h3 className="feature-title-small">Get contact info</h3>
                    <p className="feature-description-small">
                      Extract public emails and social profiles from company websites.
                    </p>
                  </div>
                </div>
                <div className="feature-card-small">
                  <div className="feature-image-wrapper">
                    <img
                      alt="Relevance scoring"
                      src="https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2Fb79cc77558955095de6bf1e094cf8d93150e6bae.png&w=828&q=75?generation=1768049314511002&alt=media"
                      className="feature-image"
                    />
                  </div>
                  <div className="feature-content">
                    <h3 className="feature-title-small">Relevance scoring</h3>
                    <p className="feature-description-small">
                      Every lead gets a match score based on your criteria.
                    </p>
                  </div>
                </div>
              </div>

              {/* Integrations */}
              <div className="integrations-card">
                <div className="integrations-content">
                  <div className="integrations-text">
                    <h3 className="feature-title">Works with your stack</h3>
                    <p className="feature-description">
                      Export to your favorite tools
                    </p>
                  </div>
                  <div className="integrations-logos">
                    <div className="logo-row">
                      <div className="integration-badge">
                        <div className="integration-icon">
                          <img alt="Salesforce" src="https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F55e7aea3494d543a643261f87c89e41360660dc7.png?generation=1768049314557390&alt=media" />
                        </div>
                        <div className="integration-name">Salesforce</div>
                      </div>
                      <div className="integration-badge">
                        <div className="integration-icon">
                          <img alt="Notion" src="https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F04f536264824e6d2b2f1c741b8ee9ad19f315b40.png?generation=1768049314528882&alt=media" />
                        </div>
                        <div className="integration-name">Notion</div>
                      </div>
                      <div className="integration-badge">
                        <div className="integration-icon">
                          <img alt="Zapier" src="https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F9e27b9d62b2bbe9db52a33cf5cdd092a04bb807b.png?generation=1768049314706864&alt=media" />
                        </div>
                        <div className="integration-name">Zapier</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Feature List */}
              <div className="feature-list-grid">
                <div className="feature-list-item">
                  <div className="feature-icon">
                    <img src="https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F7efde21af98045e90a8df6e006f33231eaeb62eb.svg?generation=1768049314707449&alt=media" alt="" />
                  </div>
                  <div>
                    <h3 className="feature-list-title">API Access</h3>
                    <p className="feature-list-description">
                      Integrate lead generation directly into your product
                    </p>
                  </div>
                </div>
                <div className="feature-list-item">
                  <div className="feature-icon">
                    <img src="https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2Fd463bdd534e7a2272c733eb31864f6fdbf776cbe.svg?generation=1768049314698745&alt=media" alt="" />
                  </div>
                  <div>
                    <h3 className="feature-list-title">Webhook Support</h3>
                    <p className="feature-list-description">
                      Get notified when new leads match your criteria
                    </p>
                  </div>
                </div>
                <div className="feature-list-item">
                  <div className="feature-icon">
                    <img src="https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F0ced621be76dbb92984e6623bb2dcf89e620d03d.svg?generation=1768049314752678&alt=media" alt="" />
                  </div>
                  <div>
                    <h3 className="feature-list-title">Learning Loop</h3>
                    <p className="feature-list-description">
                      Agent improves with every search based on your feedback
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="faq-section">
          <div className="container">
            <div className="faq-header">
              <div className="badge">
                <div className="badge-dot"></div>
                FAQ
              </div>
              <h2 className="section-title">Frequently Asked Questions</h2>
              <p className="section-subtitle-wide">
                Everything you need to know about Enrich and how it works.
              </p>
            </div>

            <div className="faq-list">
              <div className="faq-item">
                <button
                  className={`faq-question ${openFaq === 0 ? 'active' : ''}`}
                  onClick={() => setOpenFaq(openFaq === 0 ? null : 0)}
                >
                  <span>How does Enrich find companies?</span>
                  <div className="faq-icon">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path
                        d={openFaq === 0 ? "M5 10h10" : "M10 5v10M5 10h10"}
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                </button>
                {openFaq === 0 && (
                  <div className="faq-answer">
                    <p>
                      Enrich uses Exa.ai's neural search to find companies based on semantic meaning, not just keywords.
                      Describe your ideal customer in plain language, and our AI agent searches the web to find matching companies.
                      Then, Lightpanda visits each website to verify they're active and extract relevant data.
                    </p>
                  </div>
                )}
              </div>

              <div className="faq-item">
                <button
                  className={`faq-question ${openFaq === 1 ? 'active' : ''}`}
                  onClick={() => setOpenFaq(openFaq === 1 ? null : 1)}
                >
                  <span>What data can Enrich extract?</span>
                  <div className="faq-icon">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path
                        d={openFaq === 1 ? "M5 10h10" : "M10 5v10M5 10h10"}
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                </button>
                {openFaq === 1 && (
                  <div className="faq-answer">
                    <p>
                      For each company, Enrich can extract: company name, website URL, description,
                      industry, location, email addresses (public), social media profiles (LinkedIn, Twitter),
                      technology stack (detected from website), company size indicators, and hiring signals.
                      All data is sourced from publicly available information.
                    </p>
                  </div>
                )}
              </div>

              <div className="faq-item">
                <button
                  className={`faq-question ${openFaq === 2 ? 'active' : ''}`}
                  onClick={() => setOpenFaq(openFaq === 2 ? null : 2)}
                >
                  <span>How is this different from buying lead databases?</span>
                  <div className="faq-icon">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path
                        d={openFaq === 2 ? "M5 10h10" : "M10 5v10M5 10h10"}
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                </button>
                {openFaq === 2 && (
                  <div className="faq-answer">
                    <p>
                      Traditional lead databases are static and outdated. Enrich generates leads in real-time
                      by actively searching and verifying websites. Every lead is fresh, verified, and matched to your
                      exact criteria. Plus, you're not competing with thousands of other companies using the same stale database.
                    </p>
                  </div>
                )}
              </div>

              <div className="faq-item">
                <button
                  className={`faq-question ${openFaq === 3 ? 'active' : ''}`}
                  onClick={() => setOpenFaq(openFaq === 3 ? null : 3)}
                >
                  <span>What export formats are supported?</span>
                  <div className="faq-icon">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path
                        d={openFaq === 3 ? "M5 10h10" : "M10 5v10M5 10h10"}
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                </button>
                {openFaq === 3 && (
                  <div className="faq-answer">
                    <p>
                      You can export your leads as CSV (for Excel/Google Sheets), JSON (for custom integrations),
                      or directly push to your CRM via our integrations with Salesforce, HubSpot, and Airtable.
                      We also support webhooks and API access for custom workflows.
                    </p>
                  </div>
                )}
              </div>

              <div className="faq-item">
                <button
                  className={`faq-question ${openFaq === 4 ? 'active' : ''}`}
                  onClick={() => setOpenFaq(openFaq === 4 ? null : 4)}
                >
                  <span>How accurate is the technology stack detection?</span>
                  <div className="faq-icon">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path
                        d={openFaq === 4 ? "M5 10h10" : "M10 5v10M5 10h10"}
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                </button>
                {openFaq === 4 && (
                  <div className="faq-answer">
                    <p>
                      Our tech stack detection is highly accurate as it analyzes the actual website code, JavaScript libraries,
                      HTTP headers, and third-party scripts. We can detect 1000+ technologies including payment processors
                      (Stripe, PayPal), CMS platforms (WordPress, Shopify), analytics tools, and more.
                    </p>
                  </div>
                )}
              </div>

              <div className="faq-item">
                <button
                  className={`faq-question ${openFaq === 5 ? 'active' : ''}`}
                  onClick={() => setOpenFaq(openFaq === 5 ? null : 5)}
                >
                  <span>Do you have a free trial?</span>
                  <div className="faq-icon">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path
                        d={openFaq === 5 ? "M5 10h10" : "M10 5v10M5 10h10"}
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                </button>
                {openFaq === 5 && (
                  <div className="faq-answer">
                    <p>
                      Yes! Our Free plan includes 50 message credits per month with no credit card required.
                      This lets you test the platform and generate your first leads before committing to a paid plan.
                      You can upgrade anytime as your needs grow.
                    </p>
                  </div>
                )}
              </div>

              <div className="faq-item">
                <button
                  className={`faq-question ${openFaq === 6 ? 'active' : ''}`}
                  onClick={() => setOpenFaq(openFaq === 6 ? null : 6)}
                >
                  <span>Can I target specific geographic regions?</span>
                  <div className="faq-icon">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path
                        d={openFaq === 6 ? "M5 10h10" : "M10 5v10M5 10h10"}
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                </button>
                {openFaq === 6 && (
                  <div className="faq-answer">
                    <p>
                      Absolutely! You can specify locations in your search query, like "Find e-commerce companies in Berlin"
                      or "SaaS startups in the San Francisco Bay Area." Our AI understands geographic context and filters
                      results accordingly.
                    </p>
                  </div>
                )}
              </div>

              <div className="faq-item">
                <button
                  className={`faq-question ${openFaq === 7 ? 'active' : ''}`}
                  onClick={() => setOpenFaq(openFaq === 7 ? null : 7)}
                >
                  <span>Is the data GDPR compliant?</span>
                  <div className="faq-icon">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path
                        d={openFaq === 7 ? "M5 10h10" : "M10 5v10M5 10h10"}
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                </button>
                {openFaq === 7 && (
                  <div className="faq-answer">
                    <p>
                      Yes. Enrich only collects publicly available business information from company websites
                      and public sources. We do not scrape personal data or use any information that requires consent
                      under GDPR. All data collected is for B2B business purposes and complies with data protection regulations.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="faq-cta">
              <p>Still have questions?</p>
              <a href="/contact" className="faq-contact-link">Contact our team</a>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="final-cta-section">
          <div className="container">
            <div className="cta-content">
              <div className="badge">
                <div className="badge-dot"></div>
                Get Started
              </div>
              <h2 className="cta-title">Ready to stop buying stale leads?</h2>
              <p className="cta-subtitle">
                Join 500+ sales teams already using Enrich to find their next customers.
              </p>
              <a href="/dashboard" className="cta-button-final">
                <div className="button-glow"></div>
                <button className="gradient-button-large">Start Building Leads for Free</button>
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
