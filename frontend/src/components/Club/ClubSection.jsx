import React from "react";
import { useNavigate } from "react-router-dom";

export default function ClubSection({ title, description, image, align = "left" }){
  const navigate = useNavigate();
  const isLeft = align === "left";

  return (
    <section className="flex flex-col md:flex-row items-center gap-8 my-12">
      {isLeft && (
        <div className="md:w-1/2">
          <img src={image} alt={title} className="w-full h-64 object-cover rounded-[60px]" />
        </div>
      )}

      <div className="md:w-1/2">
        <h2 className="text-3xl font-bold mb-4">{title}</h2>
        <p className="text-gray-600 mb-6 max-w-md">{description}</p>

        <div className="flex items-center gap-6">
          <button
            onClick={() => navigate("/clubs/join")}
            className="bg-ajh-yellow px-6 py-3 rounded text-white font-semibold shadow"
          >
            Join Us
          </button>

          <button
            onClick={() => navigate("/contact")}
            className="text-ajh-yellow font-medium flex items-center gap-2"
          >
            Contact Us <span className="text-2xl">→</span>
          </button>
        </div>
      </div>

      {!isLeft && (
        <div className="md:w-1/2">
          <img src={image} alt={title} className="w-full h-64 object-cover rounded-[60px]" />
        </div>
      )}
    </section>
  );
}
