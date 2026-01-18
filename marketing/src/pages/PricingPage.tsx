import { useState } from 'react';
import AnimatedNumber from '../components/AnimatedNumber';
import './PricingPage.css';

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

  // Pricing data based on market research
  const pricing = {
    free: { monthly: 0, yearly: 0, credits: 150 },
    starter: { monthly: 49, yearly: 490, credits: 2000 },
    growth: { monthly: 149, yearly: 1490, credits: 10000 },
    scale: { monthly: 399, yearly: 3990, credits: 50000 },
    pro: { monthly: 499, yearly: 4990, credits: 100000 },
  };

  const getPrice = (plan: keyof typeof pricing) => {
    if (plan === 'free') return 0;
    return billingPeriod === 'monthly' ? pricing[plan].monthly : Math.round(pricing[plan].yearly / 12);
  };

  const getSavings = (plan: keyof typeof pricing) => {
    if (plan === 'free') return 0;
    const monthlyTotal = pricing[plan].monthly * 12;
    const yearlyTotal = pricing[plan].yearly;
    return monthlyTotal - yearlyTotal;
  };

  return (
    <div className="pricing-page">
      <main className="pricing-main">
        <section className="pricing-hero">
          <div className="pricing-container">
            <div className="pricing-content">
              <div className="pricing-header-center">
                {/* Background Grid Lines */}
                <div className="grid-lines-right">
                  {[...Array(4)].map((_, i) => (
                    <div key={`right-${i}`} className="grid-line">
                      <div className="grid-line-inner"></div>
                    </div>
                  ))}
                </div>
                <div className="grid-lines-left">
                  {[...Array(4)].map((_, i) => (
                    <div key={`left-${i}`} className="grid-line">
                      <div className="grid-line-inner"></div>
                    </div>
                  ))}
                </div>

                <h1 className="pricing-title">Predictable pricing, scalable plans</h1>
                <p className="pricing-subtitle">
                  Designed for every stage of your journey. <span className="credit-note">1 credit = 1 lead found and enriched.</span>
                </p>
              </div>

              {/* Billing Toggle */}
              <div className="billing-toggle">
                <button
                  className={`toggle-button ${billingPeriod === 'monthly' ? 'active' : ''}`}
                  onClick={() => setBillingPeriod('monthly')}
                >
                  <span className="toggle-text">Monthly</span>
                  {billingPeriod === 'monthly' && <div className="toggle-active-bg"></div>}
                </button>
                <button
                  className={`toggle-button ${billingPeriod === 'yearly' ? 'active' : ''}`}
                  onClick={() => setBillingPeriod('yearly')}
                >
                  <span className="toggle-text">Yearly</span>
                  <span className="yearly-badge">Save 17%</span>
                  {billingPeriod === 'yearly' && <div className="toggle-active-bg"></div>}
                </button>
              </div>

              {/* Pricing Cards */}
              <div className="pricing-grid six-cards">
                {/* Free Plan */}
                <div className="pricing-card">
                  <div className="card-inner">
                    <div className="card-header">
                      <div className="plan-name">
                        <img alt="Free plan icon" src="https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2Fc5d6f6d5fa3f9c325de1458e6020a89d660002fc.svg?generation=1768673887225487&alt=media" />
                        <p className="plan-title">Free</p>
                      </div>
                    </div>
                    <div className="card-body">
                      <div className="plan-pricing">
                        <div className="price-section">
                          <div className="price">
                            <span className="price-full">$<span className="price-amount">0</span></span>
                          </div>
                          <div className="price-period">per month</div>
                        </div>
                        <a href="/dashboard" className="cta-button outline">
                          <button>Get started</button>
                        </a>
                      </div>
                      <div className="divider"></div>
                      <ul className="features-list">
                        <li className="feature-item">
                          <div className="feature-icon">
                            <img src="https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F336838130c69c9a01f64db66a1c530c7fdbd527d.svg?generation=1768673887270435&alt=media" alt="" />
                          </div>
                          <span>Basic AI models</span>
                        </li>
                        <li className="feature-item">
                          <div className="feature-icon">
                            <img src="https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F336838130c69c9a01f64db66a1c530c7fdbd527d.svg?generation=1768673887270435&alt=media" alt="" />
                          </div>
                          <span>Limited tech stack detection (5/month)</span>
                        </li>
                        <li className="feature-item">
                          <div className="feature-icon">
                            <img src="https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F336838130c69c9a01f64db66a1c530c7fdbd527d.svg?generation=1768673887270435&alt=media" alt="" />
                          </div>
                          <span>CSV export only</span>
                        </li>
                        <li className="feature-item">
                          <div className="feature-icon">
                            <img src="https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F336838130c69c9a01f64db66a1c530c7fdbd527d.svg?generation=1768673887270435&alt=media" alt="" />
                          </div>
                          <span>1 team member</span>
                        </li>
                        <li className="feature-item">
                          <div className="feature-icon">
                            <img src="https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F336838130c69c9a01f64db66a1c530c7fdbd527d.svg?generation=1768673887270435&alt=media" alt="" />
                          </div>
                          <span>Community support</span>
                        </li>
                        <p className="feature-note">Perfect for testing Enrich before committing.</p>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="card-divider"></div>

                {/* Starter Plan (formerly Hobby) */}
                <div className="pricing-card">
                  <div className="card-inner">
                    <div className="card-header">
                      <div className="plan-name">
                        <img alt="Starter plan icon" src="https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2Fa44bd545e57a720067d7bb5333e1d822863fe363.svg?generation=1768673887197185&alt=media" />
                        <p className="plan-title">Starter</p>
                      </div>
                    </div>
                    <div className="card-body">
                      <div className="plan-pricing">
                        <div className="price-section">
                          <div className="price">
                            <span className="price-full">$<span className="price-amount"><AnimatedNumber value={getPrice('starter')} /></span></span>
                          </div>
                          <div className="price-period">per month</div>
                          {billingPeriod === 'yearly' && (
                            <div className="yearly-savings">Save ${getSavings('starter')}/year</div>
                          )}
                        </div>
                        <a href="/dashboard" className="cta-button outline">
                          <button>Subscribe</button>
                        </a>
                      </div>
                      <div className="divider"></div>
                      <ul className="features-list">
                        <span className="features-header">Everything in Free +</span>
                        <li className="feature-item">
                          <div className="feature-icon">
                            <img src="https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F336838130c69c9a01f64db66a1c530c7fdbd527d.svg?generation=1768673887270435&alt=media" alt="" />
                          </div>
                          <span>Advanced AI models (GPT-4, Claude)</span>
                        </li>
                        <li className="feature-item">
                          <div className="feature-icon">
                            <img src="https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F336838130c69c9a01f64db66a1c530c7fdbd527d.svg?generation=1768673887270435&alt=media" alt="" />
                          </div>
                          <span>Limited tech stack detection (25/month)</span>
                        </li>
                        <li className="feature-item">
                          <div className="feature-icon">
                            <img src="https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F336838130c69c9a01f64db66a1c530c7fdbd527d.svg?generation=1768673887270435&alt=media" alt="" />
                          </div>
                          <span>1 CRM integration</span>
                        </li>
                        <li className="feature-item">
                          <div className="feature-icon">
                            <img src="https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F336838130c69c9a01f64db66a1c530c7fdbd527d.svg?generation=1768673887270435&alt=media" alt="" />
                          </div>
                          <span>CSV + JSON export</span>
                        </li>
                        <li className="feature-item">
                          <div className="feature-icon">
                            <img src="https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F336838130c69c9a01f64db66a1c530c7fdbd527d.svg?generation=1768673887270435&alt=media" alt="" />
                          </div>
                          <span>Email support (24h response)</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="card-divider"></div>

                {/* Growth Plan (formerly Standard) - Popular */}
                <div className="pricing-card popular">
                  <div className="card-inner">
                    <div className="card-header">
                      <div className="plan-name">
                        <img alt="Growth plan icon" src="https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F3b92a021416b2db8e8cc04f23eb9e62aa2fea618.svg?generation=1768673887219595&alt=media" />
                        <p className="plan-title">Growth</p>
                        <span className="popular-badge">Most Popular</span>
                      </div>
                    </div>
                    <div className="card-body">
                      <div className="plan-pricing">
                        <div className="price-section">
                          <div className="price">
                            <span className="price-full">$<span className="price-amount"><AnimatedNumber value={getPrice('growth')} /></span></span>
                          </div>
                          <div className="price-period">per month</div>
                          {billingPeriod === 'yearly' && (
                            <div className="yearly-savings">Save ${getSavings('growth')}/year</div>
                          )}
                        </div>
                        <a href="/dashboard" className="cta-button primary">
                          <div className="button-glow"></div>
                          <div className="button-glow-hover"></div>
                          <button>Subscribe</button>
                        </a>
                      </div>
                      <div className="divider"></div>
                      <ul className="features-list">
                        <span className="features-header">Everything in Starter +</span>
                        <li className="feature-item">
                          <div className="feature-icon">
                            <img src="https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F336838130c69c9a01f64db66a1c530c7fdbd527d.svg?generation=1768673887270435&alt=media" alt="" />
                          </div>
                          <span>Full tech stack detection (unlimited)</span>
                        </li>
                        <li className="feature-item">
                          <div className="feature-icon">
                            <img src="https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F336838130c69c9a01f64db66a1c530c7fdbd527d.svg?generation=1768673887270435&alt=media" alt="" />
                          </div>
                          <span>3 CRM integrations (Salesforce, HubSpot, Pipedrive)</span>
                        </li>
                        <li className="feature-item">
                          <div className="feature-icon">
                            <img src="https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F336838130c69c9a01f64db66a1c530c7fdbd527d.svg?generation=1768673887270435&alt=media" alt="" />
                          </div>
                          <span>2-3 team members</span>
                        </li>
                        <li className="feature-item">
                          <div className="feature-icon">
                            <img src="https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F336838130c69c9a01f64db66a1c530c7fdbd527d.svg?generation=1768673887270435&alt=media" alt="" />
                          </div>
                          <span>Auto-retrain lead models</span>
                        </li>
                        <li className="feature-item">
                          <div className="feature-icon">
                            <img src="https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F336838130c69c9a01f64db66a1c530c7fdbd527d.svg?generation=1768673887270435&alt=media" alt="" />
                          </div>
                          <span>Chat support (same-day response)</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="card-divider"></div>

                {/* Scale Plan - NEW */}
                <div className="pricing-card">
                  <div className="card-inner">
                    <div className="card-header">
                      <div className="plan-name">
                        <img alt="Scale plan icon" src="https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2Ffea55e1876480f4bd91d1fdf42d8fc685a5c645f.svg?generation=1768673887240869&alt=media" />
                        <p className="plan-title">Scale</p>
                        <span className="new-badge">New</span>
                      </div>
                    </div>
                    <div className="card-body">
                      <div className="plan-pricing">
                        <div className="price-section">
                          <div className="price">
                            <span className="price-full">$<span className="price-amount"><AnimatedNumber value={getPrice('scale')} /></span></span>
                          </div>
                          <div className="price-period">per month</div>
                          {billingPeriod === 'yearly' && (
                            <div className="yearly-savings">Save ${getSavings('scale')}/year</div>
                          )}
                        </div>
                        <a href="/dashboard" className="cta-button outline">
                          <button>Subscribe</button>
                        </a>
                      </div>
                      <div className="divider"></div>
                      <ul className="features-list">
                        <span className="features-header">Everything in Growth +</span>
                        <li className="feature-item">
                          <div className="feature-icon">
                            <img src="https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F336838130c69c9a01f64db66a1c530c7fdbd527d.svg?generation=1768673887270435&alt=media" alt="" />
                          </div>
                          <span>Unlimited CRM integrations</span>
                        </li>
                        <li className="feature-item">
                          <div className="feature-icon">
                            <img src="https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F336838130c69c9a01f64db66a1c530c7fdbd527d.svg?generation=1768673887270435&alt=media" alt="" />
                          </div>
                          <span>API access + Webhooks</span>
                        </li>
                        <li className="feature-item">
                          <div className="feature-icon">
                            <img src="https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F336838130c69c9a01f64db66a1c530c7fdbd527d.svg?generation=1768673887270435&alt=media" alt="" />
                          </div>
                          <span>5+ team members</span>
                        </li>
                        <li className="feature-item">
                          <div className="feature-icon">
                            <img src="https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F336838130c69c9a01f64db66a1c530c7fdbd527d.svg?generation=1768673887270435&alt=media" alt="" />
                          </div>
                          <span>Advanced analytics dashboard</span>
                        </li>
                        <li className="feature-item">
                          <div className="feature-icon">
                            <img src="https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F336838130c69c9a01f64db66a1c530c7fdbd527d.svg?generation=1768673887270435&alt=media" alt="" />
                          </div>
                          <span>Phone support (2h response)</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="card-divider"></div>

                {/* Pro Plan */}
                <div className="pricing-card">
                  <div className="card-inner">
                    <div className="card-header">
                      <div className="plan-name">
                        <img alt="Pro plan icon" src="https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2Ffea55e1876480f4bd91d1fdf42d8fc685a5c645f.svg?generation=1768673887240869&alt=media" />
                        <p className="plan-title">Pro</p>
                      </div>
                    </div>
                    <div className="card-body">
                      <div className="plan-pricing">
                        <div className="price-section">
                          <div className="price">
                            <span className="price-full">$<span className="price-amount"><AnimatedNumber value={getPrice('pro')} /></span></span>
                          </div>
                          <div className="price-period">per month</div>
                          {billingPeriod === 'yearly' && (
                            <div className="yearly-savings">Save ${getSavings('pro')}/year</div>
                          )}
                        </div>
                        <a href="/dashboard" className="cta-button outline">
                          <button>Subscribe</button>
                        </a>
                      </div>
                      <div className="divider"></div>
                      <ul className="features-list">
                        <span className="features-header">Everything in Scale +</span>
                        <li className="feature-item">
                          <div className="feature-icon">
                            <img src="https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F336838130c69c9a01f64db66a1c530c7fdbd527d.svg?generation=1768673887270435&alt=media" alt="" />
                          </div>
                          <span>Custom AI model training</span>
                        </li>
                        <li className="feature-item">
                          <div className="feature-icon">
                            <img src="https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F336838130c69c9a01f64db66a1c530c7fdbd527d.svg?generation=1768673887270435&alt=media" alt="" />
                          </div>
                          <span>Unlimited team members</span>
                        </li>
                        <li className="feature-item">
                          <div className="feature-icon">
                            <img src="https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F336838130c69c9a01f64db66a1c530c7fdbd527d.svg?generation=1768673887270435&alt=media" alt="" />
                          </div>
                          <span>Sources suggestions</span>
                        </li>
                        <li className="feature-item">
                          <div className="feature-icon">
                            <img src="https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F336838130c69c9a01f64db66a1c530c7fdbd527d.svg?generation=1768673887270435&alt=media" alt="" />
                          </div>
                          <span>Dedicated account manager</span>
                        </li>
                        <li className="feature-item">
                          <div className="feature-icon">
                            <img src="https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F336838130c69c9a01f64db66a1c530c7fdbd527d.svg?generation=1768673887270435&alt=media" alt="" />
                          </div>
                          <span>Premium support SLA</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="card-divider"></div>

                {/* Enterprise Plan */}
                <div className="pricing-card">
                  <div className="card-inner">
                    <div className="card-header">
                      <div className="plan-name">
                        <img alt="Enterprise plan icon" src="https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F41dcc34e45a14ff878e9ad6f855f9570535d6f6f.svg?generation=1768673887221709&alt=media" />
                        <p className="plan-title">Enterprise</p>
                      </div>
                    </div>
                    <div className="card-body">
                      <div className="plan-pricing">
                        <div className="price-section">
                          <div className="price">
                            <span className="price-full"><span className="price-amount">Let's Talk</span></span>
                          </div>
                        </div>
                        <a href="/enterprise#contact" className="cta-button outline">
                          <button>Contact us</button>
                        </a>
                      </div>
                      <div className="divider"></div>
                      <ul className="features-list">
                        <span className="features-header">Everything in Pro +</span>
                        <li className="feature-item">
                          <div className="feature-icon">
                            <img src="https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F336838130c69c9a01f64db66a1c530c7fdbd527d.svg?generation=1768673887270435&alt=media" alt="" />
                          </div>
                          <span>Custom volume pricing</span>
                        </li>
                        <li className="feature-item">
                          <div className="feature-icon">
                            <img src="https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F336838130c69c9a01f64db66a1c530c7fdbd527d.svg?generation=1768673887270435&alt=media" alt="" />
                          </div>
                          <span>White-label options</span>
                        </li>
                        <li className="feature-item">
                          <div className="feature-icon">
                            <img src="https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F336838130c69c9a01f64db66a1c530c7fdbd527d.svg?generation=1768673887270435&alt=media" alt="" />
                          </div>
                          <span>Dedicated CSM</span>
                        </li>
                        <li className="feature-item">
                          <div className="feature-icon">
                            <img src="https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F336838130c69c9a01f64db66a1c530c7fdbd527d.svg?generation=1768673887270435&alt=media" alt="" />
                          </div>
                          <span>99.9% uptime SLA</span>
                        </li>
                        <li className="feature-item">
                          <div className="feature-icon">
                            <img src="https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F336838130c69c9a01f64db66a1c530c7fdbd527d.svg?generation=1768673887270435&alt=media" alt="" />
                          </div>
                          <span>GDPR & SOC 2 compliance</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Trust Bar */}
              <div className="pricing-trust-bar">
                <p className="trust-text">
                  Powered by
                </p>
                <div className="trust-logos">
                  <img alt="Sage" src="https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2Fcb5215d1b9a55e2c85557008baa399dbb59ff080.svg?generation=1768049314218188&alt=media" />
                  <img alt="ChuckECheese" src="https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2Fe21ad37912fe5081c61abb1c4f356749f7d78c33.svg?generation=1768049314230712&alt=media" />
                  <img alt="Miele" src="https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2Fe95a59149925b53284c2796bc254ce814c66f62a.svg?generation=1768049314225551&alt=media" />
                  <img alt="IHG" src="https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F55aeb43ef4c804fd09078c57fc6058e5f16bed2e.svg?generation=1768049314224047&alt=media" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
