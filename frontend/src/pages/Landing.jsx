// frontend/src/pages/Landing.jsx
import React, { useEffect, useRef ,useState} from 'react'
import { useNavigate } from 'react-router-dom'



// Small 4-point sparkle, reused as a decorative accent near the hero copy.
const Sparkle = ({ className = '', size = 22 }) => (
  <svg
    className={`sparkle ${className}`}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M12 0c.7 4.4 2 8 4 10.5S20.9 15.3 24 16c-4.4.7-8 2-10.5 4S8.7 24.9 8 28c-.7-4.4-2-8-4-10.5S-.9 12.7-4 12c4.4-.7 8-2 10.5-4S15.3-.9 16-4c.3 1.4.7 2.7 1.2 4z" transform="translate(0 -4) scale(0.8)" />
  </svg>
)

const Landing = () => {
  const navigate = useNavigate()
  const heroRef = useRef(null)
  const consoleRef = useRef(null)
  const featuresRef = useRef(null)
  const stepsRef = useRef(null)
  const testimonialsRef = useRef(null)
  const ctaRef = useRef(null)

  const features = [
    {
      icon: <svg 
      xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" 
      fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" 
      class="lucide lucide-bot-icon lucide-bot"><path d="M12 8V4H8"/>
      <rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/>
      <path d="M15 13v2"/><path d="M9 13v2"/></svg>,

      title: 'AI-powered interviews',
      description: 'Practice with realistic interview simulations that adapt to how you answer, not a fixed script.'
    },
    {
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" 
      fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" 
      class="lucide lucide-target-icon lucide-target"><circle cx="12" cy="12" r="10"/><circle cx="12" 
      cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
      title: 'Multiple roles',
      description: 'Frontend, backend, full stack, data analyst, and more — each with its own question set.'
    },
    {
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" 
      stroke="#f0eef2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" 
      class="lucide lucide-message-circle-heart-icon lucide-message-circle-heart">
        <path d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719"/>
        <path d="M7.828 13.07A3 3 0 0 1 12 8.764a3 3 0 0 1 5.004 2.224 3 3 0 0 1-.832 2.083l-3.447 3.62a1 1 0 0 1-1.45-.001z"/></svg>,
      title: 'Instant feedback',
      description: 'Get a breakdown of every answer right after you submit it, not days later.'
    },
    {
      icon:<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f0eef2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-history-icon lucide-history"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/></svg>,
      title: 'Performance history',
      description: 'Every session is logged so you can see your score trend and what to work on next.'
    },
    {
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f0eef2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-messages-square-icon lucide-messages-square"><path d="M16 10a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 14.286V4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/><path d="M20 9a2 2 0 0 1 2 2v10.286a.71.71 0 0 1-1.212.502l-2.202-2.202A2 2 0 0 0 17.172 19H10a2 2 0 0 1-2-2v-1"/></svg>,
      title: 'Real interview questions',
      description: 'Questions modeled on what actually gets asked in technical screens, not generic trivia.'
    },
    {
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f0eef2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-crown-icon lucide-crown"><path d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z"/><path d="M5 21h14"/></svg>,
      title: 'A record of your growth',
      description: 'Build a history of attempts you can point to when you talk about how you prepared.'
    }
  ]

  const testimonials = [
    {
      name: 'Sarah',
      role: 'Frontend Developer',
      image: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-user-icon lucide-circle-user"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="10" r="3"/><path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662"/></svg>,
      text: 'The feedback was specific enough that I could actually tell what to fix before my next real interview.'
    },
    {
      name: 'Ananya Sharma',
      role: 'Full Stack Developer',
      image: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-user-icon lucide-circle-user"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="10" r="3"/><path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662"/></svg>,
      text: 'I ran a session most evenings for two weeks. By the real interview, the format felt routine instead of scary.'
    },
    {
      name: 'Tejas Gill',
      role: 'Data Analyst',
      image: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-user-icon lucide-circle-user"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="10" r="3"/><path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662"/></svg>,
      text: 'Switching careers into data, I had no idea what to expect. This gave me a low-stakes place to find out.'
    }
  ]
  const [showEmail, setShowEmail] = useState(false);
  const [showPhone, setShowPhone] = useState(false);
  return (
    <div className="landing-page">
      {/* Nav */}
      <nav className="landing-nav">
        <div className="nav-container">
          <div className="nav-logo">
            <span className="logo-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ba89ec" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-users-icon lucide-users"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><path d="M16 3.128a4 4 0 0 1 0 7.744"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><circle cx="9" cy="7" r="4"/></svg></span>
            <a className="logo-text" href="#">Nexora</a>
          </div>
          <div className="nav-links">
            <a href="#features">Features</a>
            <a href="#how-it-works">How it works</a>
            <a href="#testimonials">Testimonials</a>
          </div>
          <div className="nav-actions">
            <button className="nav-btn-ghost" onClick={() => navigate('/login')}>Sign in</button>
            <button className="nav-btn-solid" onClick={() => navigate('/login')}>Get started</button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero-section" ref={heroRef}>
        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-badge-row">
              <Sparkle size={18} />
              <span className="live-badge">
                <span className="live-dot" />
                Live · practice right now
              </span>
              <Sparkle size={16} className="sparkle-mint" />
            </div>
            <h1 className="hero-title">
              Practice interviews<br />
              until the <span className="hero-highlight">nerves stop showing</span>
            </h1>
            <p className="hero-description">
              Answer real technical questions, get feedback on the spot, and see
              exactly where to improve before it counts. <strong>No scheduling, no waiting room.</strong>
            </p>
            <div className="hero-buttons">
              <button className="btn-hero-primary" onClick={() => navigate('/signup')}>
                Start free practice
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
              <button className="btn-hero-secondary" onClick={() => navigate('/interview/track')}>
                Try a demo question
              </button>
            </div>
            <div className="hero-proof">
              <div className="avatar-stack">
                <span className="avatar-1">👩‍💻</span>
                <span className="avatar-2">👨‍💻</span>
                <span className="avatar-3">👩‍🔬</span>
                <span className="avatar-4">+1K</span>
              </div>
              <p className="proof-text"><strong>1,000+</strong> developers have practiced this week</p>
            </div>
          </div>

          <div className="hero-visual">
            <div className="console-wrap">
              <div className="floating-chip chip-1">
                <span class="logo-visual-1"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pencil-sparkles-icon lucide-pencil-sparkles"><path d="M10 3H8"/><path d="m15.007 5.008 3.987 3.986"/><path d="M20 15v4"/><path d="M21.174 6.813a2.82 2.82 0 0 0-3.986-3.987L3.842 16.175a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="M22 17h-4"/><path d="M4 5v4"/><path d="M6 7H2"/><path d="M9 2v2"/></svg></span>
                <span>Great answer!</span>
              </div>
              <div className="floating-chip chip-2">
                <span class="logo-visual-2"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chart-no-axes-column-increasing-icon lucide-chart-no-axes-column-increasing"><path d="M5 21v-6"/><path d="M12 21V9"/><path d="M19 21V3"/></svg></span>
                <span>Score: 92%</span>
              </div>
              <div className="floating-chip chip-3">
                <span class="logo-visual-3"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-message-circle-question-mark-icon lucide-message-circle-question-mark"><path d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg></span>
                <span>Q 3 of 5</span>
              </div>
              <div className="console-window" ref={consoleRef}>
                <div className="console-titlebar">
                  <span className="console-dot red" />
                  <span className="console-dot yellow" />
                  <span className="console-dot green" />
                </div>
                <div className="console-body">
                  <div className="console-q">
                    <span className="console-q-label">QUESTION 1</span>
                    <p>What's the difference between props and state?</p>
                  </div>
                  <div className="console-answer">
                    Typing your answer<span className="console-cursor" />
                  </div>
                  <div className="console-feedback">
                    <span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-lightbulb-icon lucide-lightbulb"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg></span>
                    <p>Solid explanation — you covered ownership and re-renders clearly.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features-section" id="features" ref={featuresRef}>
        <div className="section-container">
          <div className="section-header">
            <span className="section-badge">Features</span>
            <h2 className="section-title">Everything you need to <br></br>walk in ready.</h2>
            <p className="section-description">
              Built around the parts of interview prep that are hardest to practice alone.
            </p>
          </div>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="how-it-works" id="how-it-works" ref={stepsRef}>
        <div className="section-container">
          <div className="section-header">
            <span className="section-badge">How it works</span>
            <h2 className="section-title">Three steps, start to finish</h2>
            <p className="section-description">Each session runs in order — pick a role, answer, review.</p>
          </div>
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">01</div>
              <div className="step-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-mouse-pointer-click-icon lucide-mouse-pointer-click"><path d="M14 4.1 12 6"/><path d="m5.1 8-2.9-.8"/><path d="m6 12-1.9 2"/><path d="M7.2 2.2 8 5.1"/><path d="M9.037 9.69a.498.498 0 0 1 .653-.653l11 4.5a.5.5 0 0 1-.074.949l-4.349 1.041a1 1 0 0 0-.74.739l-1.04 4.35a.5.5 0 0 1-.95.074z"/></svg></div>
              <h3>Choose your role</h3>
              <p>Pick from Frontend, Backend, Data Analyst, and more — each with its own question set.</p>
            </div>
            <div className="step-card">
              <div className="step-number">02</div>
              <div className="step-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-message-square-reply-icon lucide-message-square-reply"><path d="M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z"/><path d="m10 8-3 3 3 3"/><path d="M17 14v-1a2 2 0 0 0-2-2H7"/></svg></div>
              <h3>Answer the questions</h3>
              <p>Work through AI-generated questions and get feedback on each answer as you go.</p>
            </div>
            <div className="step-card">
              <div className="step-number">03</div>
              <div className="step-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-fading-arrow-up-icon lucide-circle-fading-arrow-up"><path d="M12 2a10 10 0 0 1 7.38 16.75"/><path d="m16 12-4-4-4 4"/><path d="M12 16V8"/><path d="M2.5 8.875a10 10 0 0 0-.5 3"/><path d="M2.83 16a10 10 0 0 0 2.43 3.4"/><path d="M4.636 5.235a10 10 0 0 1 .891-.857"/><path d="M8.644 21.42a10 10 0 0 0 7.631-.38"/></svg></div>
              <h3>Review and improve</h3>
              <p>Check your score, read the full transcript, and see what to focus on next time.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials-section" id="testimonials" ref={testimonialsRef}>
        <div className="section-container">
          <div className="section-header">
            <span className="section-badge">Testimonials</span>
            <h2 className="section-title">What people say after a few sessions</h2>
          </div>
          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-card">
                <span className="testimonial-quote-mark">"</span>
                <p className="testimonial-text">{testimonial.text}</p>
                <div className="testimonial-author">
                  <span className="testimonial-avatar">{testimonial.image}</span>
                  <div className="testimonial-author-info">
                    <strong>{testimonial.name}</strong>
                    <span>{testimonial.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section" ref={ctaRef}>
        <div className="cta-container">
          <div className="cta-content">
            <h2 className="cta-title">Ready for your next interview?</h2>
            <p className="cta-description">
              Start a free session now — no scheduling, no setup, just questions and feedback.
            </p>
            <div className="cta-buttons">
              <button className="cta-btn-primary" onClick={() => navigate('/login')}>
                Start free practice
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
              <button className="cta-btn-secondary" onClick={() => navigate('/login')}>
                Try a demo question
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-container">
          <div className="footer-brand">
            <span className="footer-logo">Nexora</span>
            <p className="footer-description">
              A practice space for technical interviews — real questions, instant feedback.
            </p>
          </div>
          <div className="footer-links">
            <div className="footer-column">
              <h4>Product</h4>
              <a>Practice</a>
              <a>History</a>
              <a href="#features">Features</a>
            </div>
            <div className="footer-column">
              <h4>Company</h4>
              <a href="#">About</a>
              <a href="#how-it-works">Blog</a>
            </div>
            <div className="footer-column">
              <h4>Contact</h4>

              <div className="support-item">
                <a href="#" onClick={(e) => {
                  e.preventDefault();
                  setShowEmail(!showEmail);}}>

                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-mail-icon lucide-mail"><path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"/><rect x="2" y="4" width="20" height="16" rx="2"/></svg></a>
                
                {showEmail && <span>support@example.com</span>}

              </div>

              <div className="support-item">

                <a href="#" onClick={(e) => {
                  e.preventDefault();
                  setShowPhone(!showPhone);}}>
                    
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-phone-icon lucide-phone"><path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384"/></svg></a>
                
                {showPhone && <span>+91 XXXXX XXXXX</span>}

              </div>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 Nexora. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default Landing