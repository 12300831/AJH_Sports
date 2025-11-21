import React from "react";

export default function LoadingBar(){
  return (
    <div className="w-80 mx-auto">
      <div className="h-3 bg-white/40 rounded-full overflow-hidden">
        <div className="h-3 bg-ajh-yellow rounded-full animate-loading" style={{ width: "70%" }} />
      </div>

      <style>{`
        @keyframes loading {
          0% { transform: translateX(-30%); }
          50% { transform: translateX(0%); }
          100% { transform: translateX(30%); }
        }
        .animate-loading {
          animation: loading 1.6s infinite linear;
        }
      `}</style>
    </div>
  );
}
