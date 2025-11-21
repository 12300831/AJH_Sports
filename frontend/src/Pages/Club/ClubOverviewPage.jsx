import React from "react";
import ClubSection from "../../components/Club/ClubSection.jsx";
import SupportSection from "../../components/Club/SupportSection.jsx";

export default function ClubOverviewPage(){

  return (
    <div className="min-h-screen">
      <header className="bg-gray-200 py-4 px-6">
        <nav className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="text-2xl font-bold text-ajh-yellow">ajh</div>
            <ul className="flex gap-6 text-sm">
              <li>Home</li>
              <li>Events</li>
              <li className="bg-gray-400 px-3 py-1 rounded">Clubs</li>
              <li>Coaches</li>
              <li>Contact Us</li>
            </ul>
          </div>
          <div className="text-sm">
            <button className="mr-3">Log In</button>
            <button className="px-3 py-1 bg-gray-300 rounded shadow">Sign Up</button>
          </div>
        </nav>
      </header>

      <main className="max-w-6xl mx-auto py-12 px-6">
        <ClubSection
          title="Be part of our Youth Club"
          description="We love what we do and we do it with passion. We value the experimentation of the message and smart incentives."
          image="/images/youth.jpg"
          align="right"
        />

        <div className="h-24" />

        <ClubSection
          title="Be part of our Adult Club"
          description="We love what we do and we do it with passion. We value the experimentation of the message and smart incentives."
          image="/images/adult.jpg"
          align="left"
        />

        <div className="mt-20">
          <SupportSection />
        </div>
      </main>
    </div>
  );
}
