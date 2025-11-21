import React from "react";
import { useNavigate } from "react-router-dom";

export default function ClubJoinMainPage(){
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-start">
      <header className="bg-gray-200 w-full py-4" />
      <main className="flex-1 w-full max-w-4xl mx-auto px-6 py-24 text-center">
        <h1 className="text-4xl font-bold mb-4">JOIN OUR CLUB</h1>
        <p className="text-gray-600 max-w-xl mx-auto mb-8">
          We love what we do and we do it with passion. We value the experimentation of the message and smart incentives.
        </p>

        <button
          onClick={() => navigate("/clubs/redirect")}
          className="bg-ajh-yellow px-10 py-4 rounded shadow font-semibold text-white hover:brightness-95"
        >
          Let's Play!
        </button>

        <div className="mt-12 grid grid-cols-3 gap-8 items-center">
          <div className="flex justify-center"><img src="/images/avatar1.png" alt="avatar" className="w-24 h-24" /></div>
          <div className="flex justify-center"><img src="/images/avatar2.png" alt="avatar" className="w-24 h-24" /></div>
          <div className="flex justify-center"><img src="/images/avatar3.png" alt="avatar" className="w-24 h-24" /></div>
        </div>
      </main>
    </div>
  );
}
