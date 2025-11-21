import React from "react";

export default function SupportSection(){
  return (
    <div className="flex items-center gap-6 bg-white py-12">
      <div className="mx-auto flex items-center gap-4">
        <div className="w-14 h-14 rounded-full flex items-center justify-center border-2 border-ajh-yellow">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M12 2v6M5 7v6a7 7 0 0 0 14 0V7" stroke="#D8C337" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        <div className="text-ajh-yellow text-xl font-medium">Looking for support?</div>
      </div>
    </div>
  );
}
