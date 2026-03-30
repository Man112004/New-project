import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Complaint App</h1>
          <p className="hero-subtitle">
            Empowering citizens and municipal corporations to build better cities together through technology and transparency.
          </p>
          <div className="hero-buttons">
            <Link to="/raise-complaint" className="primary-btn">Report an Issue</Link>
            <Link to="/login" className="secondary-btn">Track Status</Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats">
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-number">12,450+</div>
            <div className="stat-label">TOTAL REPORTS</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">10,230+</div>
            <div className="stat-label">ISSUES RESOLVED</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">3</div>
            <div className="stat-label">AVG. DAYS TO FIX</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">45,000+</div>
            <div className="stat-label">ACTIVE CITIZENS</div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <h2>How It Works</h2>
        <p>A simple, transparent process to ensure your voice is heard and issues are resolved by the right department.</p>
        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Capture & Report</h3>
            <p>Take a photo of the issue (pothole, garbage, etc.), tag the location, and submit a brief description.</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>Track Progress</h3>
            <p>The complaint is automatically routed to the correct department. Track its status in real-time.</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Get Resolved</h3>
            <p>Officials update the status once fixed. You receive a notification and can verify the resolution.</p>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="quick-links">
        <h2>Quick Links</h2>
        <div className="links-grid">
          <Link to="/login" className="link-card">
            <h3>Citizen Login</h3>
            <p>Access your account to track complaints</p>
          </Link>
          <Link to="/register" className="link-card">
            <h3>Register Account</h3>
            <p>Create a new citizen account</p>
          </Link>
          <Link to="/admin/login" className="link-card">
            <h3>Official Portal</h3>
            <p>Login for municipal officials</p>
          </Link>
        </div>
      </section>

      {/* Contact & Support */}
      <section className="contact-support">
        <h2>Contact & Support</h2>
        <div className="contact-info">
          <div className="contact-item">
            <strong>Toll Free:</strong> 1800-11-2233
          </div>
          <div className="contact-item">
            <strong>Email:</strong> support@smartcivic.gov.in
          </div>
          <div className="contact-item">
            <strong>Working Hours:</strong> Mon-Sat, 9AM to 6PM
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>© 2026 Complaint App. A Government of India Initiative.</p>
        <p>Digital India Initiative</p>
      </footer>
    </div>
  );
}
