import React from "react";

const LOGO_SRC = "/images/e8dadc63068e8cb8da040a6443512ba36cbcfb97.png";

export function HomeHeader() {
  return (
    <header className="relative h-[124.5px] w-[1440px] bg-black text-white" data-name="Homepage-Header">
      <div
        className="absolute left-[39px] top-[43px] h-[53px] w-[80px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]"
        aria-label="AJH Sports"
      >
        <img
          src={LOGO_SRC}
          alt="AJH Sports"
          className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full"
        />
      </div>

      <button className="absolute block cursor-pointer font-['Inter:Medium',sans-serif] font-medium h-[24px] leading-[0] left-[190px] not-italic text-[16px] text-white top-[56px] w-[62px]">
        <p className="leading-[normal]">Home</p>
      </button>
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium h-[24px] leading-[normal] left-[309px] not-italic text-[16px] text-white top-[56px] w-[72px]">
        Events
      </p>
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium h-[24px] leading-[normal] left-[427px] not-italic text-[16px] text-white top-[54px] w-[71px]">
        Clubs
      </p>
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium h-[24px] leading-[normal] left-[544px] not-italic text-[16px] text-white top-[54px] w-[92px]">
        Coaches
      </p>
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium h-[24px] leading-[normal] left-[667px] not-italic text-[16px] text-white top-[54px] w-[88px]">
        Contact Us
      </p>

      <div className="absolute bg-[#878787] h-[50px] left-[1327.25px] rounded-[6px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] top-[46px] w-[64px]" />
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[19px] leading-[normal] left-[1336px] not-italic text-[12px] text-white top-[65px] w-[46px]">
        Sign Up
      </p>
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[19px] leading-[normal] left-[1267px] not-italic text-[12px] text-white top-[63px] w-[36px]">
        Log In
      </p>
    </header>
  );
}
