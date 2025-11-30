import React from "react";
import { useNavigate } from "react-router-dom";
import "./Coachesname.css";
import "./CoachesPage.css"; // reuse footer styling

const imgAjhSportsLogoNoOutline11 = "/images/e8dadc63068e8cb8da040a6443512ba36cbcfb97.png";

const coaches = [
  {
    name: "Michael Rodriguez",
    role: "Advanced Technique",
    image: "/images/michael.png",
    link: "/coaches/michael",
  },
  {
    name: "James Wilson",
    role: "Serve Specialist",
    image: "/images/james.png",
  },
  {
    name: "Mark Leo",
    role: "Junior Development",
    image: "/images/mark.png",
  },
  {
    name: "Kristin Russell",
    role: "Junior Development",
    image: "/images/kristin.png",
  },
];

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

const CoachCard = ({ coach, onView }) => (
  <div className="coach-card">
    <img src={coach.image} alt={coach.name} className="coach-photo" />
    <div className="coach-name">{coach.name}</div>
    <div className="coach-role">{coach.role}</div>
    <div className="coach-socials">
      <span aria-label="LinkedIn" className="social-dot">in</span>
      <span aria-label="Twitter" className="social-dot">tw</span>
      <span aria-label="Facebook" className="social-dot">fb</span>
      <span aria-label="Instagram" className="social-dot">ig</span>
    </div>
    <button className="profile-btn" onClick={onView} disabled={!onView}>
      View Profile
    </button>
  </div>
);

export default function Coachesname() {
  const navigate = useNavigate();

  return (
    <div className="coachesname-page">
      <CoachesHeader navigate={navigate} />

      <main className="coachesname-main">
        <h1 className="page-title">Our tennis Coaches</h1>
        <div className="coach-grid">
          {coaches.map((coach) => (
            <CoachCard
              key={coach.name}
              coach={coach}
              onView={coach.link ? () => navigate(coach.link) : undefined}
            />
          ))}
        </div>
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
