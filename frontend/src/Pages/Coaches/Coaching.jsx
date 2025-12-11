import React from "react";
import "./Coaches.css";
import { HomeHeader } from "../../components/HomeHeader";

const lessons = [
  {
    id: "junior-tennis",
    title: "Junior Tennis Lessons",
    copy: "AJH Sports specialises in child sport development. Guided by Andrew Hill’s program, our coaches help young players become confident and consistent. Sessions run before and after school for convenience and can be an alternative to school care.",
    image: "/images/TennisOpen.png",
    pricing: [
      { label: "Private", single: "$80", pack: "$700*" },
      { label: "Group", single: "$15", pack: "$120*" },
    ],
    cta: "Register Now!",
    imageLeft: false,
  },
  {
    id: "adult-tennis",
    title: "Adult Tennis Lessons",
    copy: "Adult Tennis lessons are available throughout the term. All lessons focus on gameplay and are perfect for players of any skill level. Our lessons follow a lesson plan designed by Andrew Hill, with each week focusing on a different aspect of tennis. Sessions are offered throughout the week and are a great social activity for friends.",
    image: "/images/mytennis.png",
    pricing: [
      { label: "Private", single: "$80", pack: "$700*" },
      { label: "Group", single: "$20", pack: "$160*" },
    ],
    cta: "Register Now!",
    imageLeft: false,
  },
  {
    id: "junior-tt",
    title: "Junior Table Tennis Lessons",
    copy: "Junior Table Tennis lessons are available throughout the term. Lessons focus on gameplay and suit all skill levels. Under Andrew Hill’s plan, each week highlights a new skill to help young players grow. Sessions are offered across the week and make for a fun social activity.",
    image: "/images/TTCup.png",
    pricing: [
      { label: "Private", single: "$80", pack: "$700*" },
      { label: "Group", single: "$15", pack: "$120*" },
    ],
    cta: "Register Now!",
    imageLeft: true,
  },
  {
    id: "adult-tt",
    title: "Adult Table Tennis Lessons",
    copy: "Adult Table Tennis lessons are available throughout the term. Each session follows Andrew Hill’s lesson plan with a weekly focus on a new aspect of the game. Sessions run throughout the week and are a great way to stay active with friends.",
    image: "/images/OneonOneCoaching.png",
    pricing: [
      { label: "Private", single: "$80", pack: "$700*" },
      { label: "Group", single: "$20", pack: "$160*" },
    ],
    cta: "Register Now!",
    imageLeft: true,
  },
  {
    id: "modified-sport",
    title: "Modified Sport Sessions",
    copy: "AJH uses the STARS Program for hour-long sessions with school kids. We provide a wide selection of sports and equipment, letting kids shape the session. These are perfect before/after school options and include an indoor wet-weather program.",
    image: "/images/KidsSports.png",
    pricing: [{ label: "Group", single: "$15", pack: "$120*" }],
    cta: "Register Now!",
    imageLeft: false,
  },
];

const PricingTable = ({ rows }) => {
  return (
    <div className="lesson-pricing">
      <div className="lesson-pricing-header">
        <span>Single Lesson</span>
        <span>10 Lesson Pack</span>
      </div>
      {rows.map((row) => (
        <div key={row.label} className="lesson-pricing-row">
          <span className="lesson-pricing-label">{row.label}</span>
          <span>{row.single}</span>
          <span>{row.pack}</span>
        </div>
      ))}
      <p className="lesson-pricing-note">*pricing includes 10 lessons</p>
    </div>
  );
};

const Coaching = ({ onBack }) => {
  return (
    <div className="coaches-page">
      <HomeHeader />
      <main className="coaches-main">
        <div className="lesson-intro">
          <button
            type="button"
            onClick={() => onBack?.()}
            className="lesson-back"
          >
            ← Back
          </button>
          <p className="lesson-topcopy">
            AJH Sports offers coaching packages for all ages and skill levels. Choose the
            package that suits you best each includes group, semi-private, and private
            options to fit your needs. Every 10-week package includes reduced social session
            entry and catchup group sessions for wet weather.
          </p>
        </div>

        <div className="lessons-stack">
          {lessons.map((lesson, index) => {
            const imageFirst = lesson.imageLeft;
            return (
              <section
                key={lesson.id}
                className={`lesson-block ${imageFirst ? "image-left" : "image-right"}`}
              >
                <div className="lesson-image-wrapper">
                  <img src={lesson.image} alt={lesson.title} className="lesson-image" />
                </div>
                <div className="lesson-content">
                  <h2>{lesson.title}</h2>
                  <p className="lesson-copy">{lesson.copy}</p>
                  <PricingTable rows={lesson.pricing} />
                  <button type="button" className="lesson-cta">
                    {lesson.cta}
                  </button>
                </div>
              </section>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default Coaching;
