import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="footer-logo">
              <img src="https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F5273e94a0b6245720771e45a2ea4e196c7533cb4.svg?generation=1768049314359814&alt=media" alt="LeadSwap" />
            </div>
            <p className="footer-tagline">Don't buy leads. Build them.</p>
          </div>
          
          <div className="footer-column">
            <h3 className="footer-heading">Product</h3>
            <ul className="footer-links">
              <li><Link to="/">Features</Link></li>
              <li><Link to="/pricing">Pricing</Link></li>
              <li><a href="/docs">API Docs</a></li>
              <li><a href="/changelog">Changelog</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h3 className="footer-heading">Resources</h3>
            <ul className="footer-links">
              <li><a href="/blog">Blog</a></li>
              <li><a href="/guide/icp">Guide: ICP Definition</a></li>
              <li><a href="/guide/b2b">Guide: B2B Prospecting</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h3 className="footer-heading">Company</h3>
            <ul className="footer-links">
              <li><a href="/about">About</a></li>
              <li><a href="/contact">Contact</a></li>
              <li><a href="https://twitter.com/leadswap" target="_blank" rel="noopener noreferrer">Twitter</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-credits">
            <p>Built for the Generative AI Hackathon</p>
            <p className="footer-powered">
              Powered by <strong>Dust</strong> · <strong>Exa.ai</strong> · <strong>Lightpanda</strong>
            </p>
          </div>
          <div className="footer-copyright">
            © 2025 LeadSwap
          </div>
        </div>
      </div>
    </footer>
  );
}
