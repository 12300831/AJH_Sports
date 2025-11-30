import React from "react";
import { useNavigate } from "react-router-dom";
import "./CoachesPage.css"; // header/footer styles
import "./michael.css";

const imgAjhSportsLogoNoOutline11 = "/images/e8dadc63068e8cb8da040a6443512ba36cbcfb97.png";

const CoachesHeader = ({ navigate }) => (
  <header className="relative bg-[#d9d9d9] h-[124.5px] w-full">
    <div className="absolute h-[53px] left-[39px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] top-[43px] w-[80px]" data-name="AJHSports-Logo-no-outline-1 1">
      <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgAjhSportsLogoNoOutline11} />
    </div>
    <button onClick={() => navigate("/")} className="absolute block cursor-pointer font-['Inter:Medium',sans-serif] font-medium h-[24px] leading-[0] left-[190px] not-italic text-[16px] text-black top-[56px] w-[62px]">
      <p className="leading-[normal]">Home</p>
    </button>
    <button onClick={() => navigate("/events")} className="absolute block cursor-pointer font-['Inter:Medium',sans-serif] font-medium h-[24px] leading-[normal] left-[309px] not-italic text-[16px] text-black top-[56px] w-[72px]">Events</button>
    <button onClick={() => navigate("/clubs")} className="absolute block cursor-pointer font-['Inter:Medium',sans-serif] font-medium h-[24px] leading-[normal] left-[427px] not-italic text-[16px] text-black top-[54px] w-[71px]">Clubs</button>
    <button onClick={() => navigate("/coaches")} className="absolute block cursor-pointer font-['Inter:Medium',sans-serif] font-medium h-[24px] leading-[normal] left-[544px] not-italic text-[16px] text-black top-[54px] w-[92px]">Coaches</button>
    <button onClick={() => navigate("/contact")} className="absolute block cursor-pointer font-['Inter:Medium',sans-serif] font-medium h-[24px] leading-[normal] left-[667px] not-italic text-[16px] text-black top-[54px] w-[88px]">Contact Us</button>
    <div className="absolute bg-[#878787] h-[50px] left-[1327.25px] rounded-[6px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] top-[46px] w-[64px]" />
    <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[19px] leading-[normal] left-[1336px] not-italic text-[12px] text-black top-[65px] w-[46px]">Sign Up</p>
    <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[19px] leading-[normal] left-[1267px] not-italic text-[12px] text-black top-[63px] w-[36px]">Log In</p>
  </header>
);

const CoachProfileCard = () => (
  <section className="coach-profile-card">
    <div className="coach-avatar-wrapper">
      <div className="coach-avatar-ring" aria-hidden="true" />
      <img
        className="coach-avatar"
        src="/images/michael.png"
        alt="Michael Rodriguez"
        onError={(e) => {
          e.currentTarget.style.display = "none";
        }}
      />
    </div>

    <h1 className="coach-name">Michael Rodriguez</h1>
    <div className="coach-role">Advanced Techniques</div>

    <p className="coach-text">Creds: 15+ yrs, Coached state champions & adult-league winners, TA Club Professional</p>
    <p className="coach-text">Programs: Advanced stroke refinement, Tournament prep & match strategy, Fitness & footwork blocks, High-intensity sparring</p>
    <p className="coach-text">Best for: Intermediate–Advanced</p>
    <p className="coach-text">Availability: Mon–Fri 5:00–9:00 pm, Sat 8:00 am–12:00 pm</p>
    <p className="coach-text">Location: Denistone courts and Rate: $75/hr</p>
    <p className="coach-text">Language: English</p>

    <div className="coach-social-row" aria-label="social links">
      <span>in</span>
      <span>tw</span>
      <span>fb</span>
      <span>ig</span>
    </div>

    <div className="coach-cta-row">
      <button className="coach-btn primary">Book Now!</button>
      <button className="coach-btn secondary">Learn More</button>
    </div>
  </section>
);

export default function MichaelPage() {
  const navigate = useNavigate();

  return (
    <div className="coach-profile-page">
      <CoachesHeader navigate={navigate} />

      <main className="coach-profile-main">
        <CoachProfileCard />
      </main>

      <footer className="coaches-footer">
        <div className="footer-top">
          <div className="newsletter">
            <h3>Join Our Newsletter</h3>
            <p>
              Subscribe to our newsletter to be the first to know about new
              sessions, competitions and events.
            </p>
            <div className="newsletter-form">
              <input type="email" placeholder="Your email" />
              <button>Subscribe</button>
            </div>
          </div>

          <div className="footer-columns">
            <div className="footer-column">
              <h4>About</h4>
              <a href="#why">Why Choose Us?</a>
              <a href="#featured">Featured</a>
              <a href="#partnership">Partnership</a>
              <a href="#team">Our Team</a>
            </div>

            <div className="footer-column">
              <h4>Community</h4>
              <a href="#events">Events</a>
              <a href="#blog">Blog</a>
              <a href="#podcast">Podcast</a>
              <a href="#invite">Invite a friend</a>
            </div>

            <div className="footer-column">
              <h4>Contact Us</h4>
              <p>ajhsports.com.au</p>
              <p>+61 0412345678</p>
              <p>123 Ave, Sydney, NSW</p>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span>©2025 Company Name. All rights reserved</span>
          <div className="footer-links">
            <a href="#privacy">Privacy & Policy</a>
            <a href="#terms">Terms & Condition</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
