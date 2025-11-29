// src/pages/CoachesPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header"; // 

// Coach images – replace with your actual file names
const coaches = [
  {
    id: "michael-rodriguez",
    name: "Michael Rodriguez",
    role: "Advanced Technique",
    image: "/images/coach-michael.png",
  },
  {
    id: "james-wilson",
    name: "James Wilson",
    role: "Serve Specialist",
    image: "/images/coach-james.png",
  },
  {
    id: "mark-leo",
    name: "Mark Leo",
    role: "Junior Development",
    image: "/images/coach-mark.png",
  },
  {
    id: "kristin-russell",
    name: "Kristin Russell",
    role: "Junior Development",
    image: "/images/coach-kristin.png",
  },
];

function CoachCard({ coach, onViewProfile }) {
  return (
    <div className="flex flex-col items-center">
      {/* Photo */}
      <div className="w-[280px] h-[240px] rounded-[24px] overflow-hidden mb-4 shadow-sm">
        <img
          src={coach.image}
          alt={coach.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Name + role */}
      <div className="text-center mb-3">
        <p className="text-[14px] underline font-medium">{coach.name}</p>
        <p className="text-[12px] text-gray-600 mt-1">{coach.role}</p>
      </div>

      {/* Social icons (simple placeholders – you can replace with real icons) */}
      <div className="flex gap-3 text-[12px] text-gray-600 mb-4">
        {["in", "x", "ig", "f"].map((label) => (
          <span
            key={label}
            className="w-7 h-7 border border-gray-300 rounded-full flex items-center justify-center"
          >
            {label}
          </span>
        ))}
      </div>

      {/* View profile button */}
      <button
        onClick={onViewProfile}
        className="border border-[#2f68ff] text-[#2f68ff] text-[12px] px-6 py-2 rounded-[4px] hover:bg-[#2f68ff] hover:text-white transition"
      >
        View Profile
      </button>
    </div>
  );
}

function NewsletterAndFooter() {
  return (
    <section className="bg-white mt-20 border-t border-gray-200">
      {/* Newsletter + columns */}
      <div className="max-w-6xl mx-auto py-12 px-4 md:px-0">
        <div className="grid grid-cols-1 md:grid-cols-[1.6fr_0.1fr_1.6fr] gap-10">
          {/* Newsletter left side */}
          <div>
            {/* small yellow logo */}
            <div className="mb-4">
              <div className="w-10 h-7 bg-yellow-400 rounded-md shadow" />
            </div>
            <h3 className="text-[20px] md:text-[22px] font-semibold mb-2">
              Join Our Newsletter
            </h3>
            <p className="text-[12px] text-gray-600 mb-6 max-w-md">
              Subscribe to our newsletter to be the first to know about new
              sessions, competitions and events.
            </p>

            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex flex-col sm:flex-row gap-4 max-w-md"
            >
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 border border-gray-400 px-4 py-2 text-[12px] outline-none"
              />
              <button
                type="submit"
                className="bg-black text-white text-[12px] px-6 py-2 rounded-full"
              >
                Subscribe
              </button>
            </form>
          </div>

          {/* vertical line */}
          <div className="hidden md:block">
            <div className="h-full w-px bg-gray-300 mx-auto" />
          </div>

          {/* About / Community / Contact */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-[12px]">
            <div>
              <h4 className="font-semibold mb-3">About</h4>
              <ul className="space-y-1 text-gray-600">
                <li>Why Choose Us?</li>
                <li>Featured</li>
                <li>Partnership</li>
                <li>Our Team</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Community</h4>
              <ul className="space-y-1 text-gray-600">
                <li>Events</li>
                <li>Blog</li>
                <li>Podcast</li>
                <li>Invite a friend</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Contact Us</h4>
              <ul className="space-y-1 text-gray-600">
                <li>ajhsports.com.au</li>
                <li>+61 0412345678</li>
                <li>123 Ave, Sydney, NSW</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom footer bar */}
      <div className="border-t border-gray-200">
        <div className="max-w-6xl mx-auto py-4 px-4 md:px-0 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-gray-500">
          <div>AJH Sports ©2025 AJH Sports. All rights reserved</div>

          {/* Social icons (footer) */}
          <div className="flex items-center gap-3">
            {["f", "x", "ig"].map((label) => (
              <span
                key={label}
                className="w-7 h-7 border border-gray-300 rounded-full flex items-center justify-center"
              >
                {label}
              </span>
            ))}
          </div>

          <div className="flex gap-4">
            <span>Privacy &amp; Policy</span>
            <span>Terms &amp; Condition</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function CoachesPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f5f7fb] flex flex-col">
      {/* Header from previous code */}
      <Header />

      {/* Main content */}
      <main className="flex-1 max-w-6xl mx-auto pt-16 pb-12 px-4 md:px-0">
        <h1 className="text-[28px] md:text-[32px] font-semibold text-center mb-12">
          Our tennis Coaches
        </h1>

        {/* 2x2 coach grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
          {coaches.map((coach) => (
            <CoachCard
              key={coach.id}
              coach={coach}
              onViewProfile={() => navigate(`/coaches/${coach.id}`)}
            />
          ))}
        </div>
      </main>

      {/* Newsletter + footer */}
      <NewsletterAndFooter />
    </div>
  );
}
