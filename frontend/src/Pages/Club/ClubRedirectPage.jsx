import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoadingBar from "../../components/Club/LoadingBar.jsx";

export default function ClubRedirectPage(){
  const navigate = useNavigate();

  useEffect(() => {
    const waUrl = "https://wa.me/<1234567890>";
    const timer = setTimeout(() => {
      window.location.href = waUrl;
    }, 3000);

    const fallback = setTimeout(() => navigate("/"), 6000);

    return () => {
      clearTimeout(timer);
      clearTimeout(fallback);
    };
  }, [navigate]);

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-[url('/images/tennis-bg.jpg')] bg-cover bg-center">
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10 text-center text-white px-6">
        <div className="mb-6">
          <img src="/images/logo-yellow.png" alt="logo" className="mx-auto w-36" />
        </div>
        <h2 className="text-3xl italic mb-4">Hold On!!</h2>
        <LoadingBar />
        <p className="mt-6">You&apos;re being redirected to WhatsApp Group!!</p>
        <div className="mt-8">
          <button onClick={() => navigate("/")} className="bg-white rounded-full p-3">
            <span role="img" aria-label="home">🏠</span>
          </button>
        </div>
      </div>
    </div>
  );
}
