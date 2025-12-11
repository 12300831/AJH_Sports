import React from "react";

const LOGO_SRC = "/images/e8dadc63068e8cb8da040a6443512ba36cbcfb97.png";

export function HomeHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <header className="relative bg-black text-white h-auto min-h-[124.5px] w-full pb-4 md:pb-0 md:h-[124.5px]" data-name="Homepage-Header">
      {/* Logo */}
      <div
        className="absolute h-[53px] left-[20px] md:left-[39px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] top-[20px] md:top-[43px] w-[80px]"
        aria-label="AJH Sports"
      >
        <img
          src={LOGO_SRC}
          alt="AJH Sports"
          className="absolute inset-0 max-w-none object-cover pointer-events-none size-full"
        />
      </div>

      {/* Desktop navigation */}
      <div className="hidden lg:block">
        <button className="absolute block cursor-pointer font-['Inter:Medium',sans-serif] font-medium h-[24px] leading-[normal] left-[190px] not-italic text-[16px] text-white top-[56px] w-[62px] hover:text-[#e0cb23] transition-colors">
          <p className="leading-[normal]">Home</p>
        </button>
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium h-[24px] leading-[normal] left-[309px] not-italic text-[16px] text-white top-[56px] w-[72px] cursor-pointer hover:text-[#e0cb23] transition-colors">
          Events
        </p>
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium h-[24px] leading-[normal] left-[427px] not-italic text-[16px] text-white top-[54px] w-[71px] cursor-pointer hover:text-[#e0cb23] transition-colors">
          Clubs
        </p>
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium h-[24px] leading-[normal] left-[544px] not-italic text-[16px] text-[#e0cb23] top-[54px] w-[92px] cursor-pointer hover:text-white transition-colors">
          Coaches
        </p>
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium h-[24px] leading-[normal] left-[667px] not-italic text-[16px] text-white top-[54px] w-[88px] cursor-pointer hover:text-[#e0cb23] transition-colors">
          Contact Us
        </p>
      </div>

      {/* Tablet navigation */}
      <div className="hidden md:flex lg:hidden absolute left-[120px] top-[56px] gap-4 md:gap-6">
        <button className="font-['Inter:Medium',sans-serif] font-medium text-sm text-white cursor-pointer hover:text-[#e0cb23] transition-colors">
          <p>Home</p>
        </button>
        <p className="font-['Inter:Medium',sans-serif] font-medium text-sm text-white cursor-pointer hover:text-[#e0cb23] transition-colors">
          Events
        </p>
        <p className="font-['Inter:Medium',sans-serif] font-medium text-sm text-white cursor-pointer hover:text-[#e0cb23] transition-colors">
          Clubs
        </p>
        <p className="font-['Inter:Medium',sans-serif] font-medium text-sm text-[#e0cb23] cursor-pointer hover:text-white transition-colors">
          Coaches
        </p>
        <p className="font-['Inter:Medium',sans-serif] font-medium text-sm text-white cursor-pointer hover:text-[#e0cb23] transition-colors">
          Contact
        </p>
      </div>

      {/* Sign Up Button - Desktop */}
      <div className="absolute bg-[#878787] h-[50px] left-[1327.25px] lg:left-[1327.25px] rounded-[6px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] top-[46px] w-[64px] cursor-pointer hover:bg-[#6d6d6d] transition-colors hidden lg:block" />
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[19px] leading-[normal] left-[1336px] lg:left-[1336px] not-italic text-[12px] text-white top-[65px] w-[46px] cursor-pointer hidden lg:block">
        Sign Up
      </p>

      {/* Log In - Desktop */}
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold h-[19px] leading-[normal] left-[1267px] lg:left-[1267px] not-italic text-[12px] text-white top-[63px] w-[36px] cursor-pointer hover:text-[#e0cb23] transition-colors hidden lg:block">
        Log In
      </p>

      {/* Tablet/Mobile Auth Buttons */}
      <div className="hidden md:flex lg:hidden absolute right-4 top-[46px] items-center gap-3">
        <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-xs text-white cursor-pointer hover:text-[#e0cb23] transition-colors">Log In</p>
        <div className="bg-[#878787] h-[40px] rounded-[6px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] flex items-center justify-center px-3 cursor-pointer hover:bg-[#6d6d6d] transition-colors">
          <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-xs text-white">Sign Up</p>
        </div>
      </div>

      {/* Mobile Menu Button and Auth */}
      <div className="md:hidden absolute right-4 top-[20px] flex items-center gap-3">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="flex flex-col gap-1.5 w-6 h-6 justify-center items-center"
          aria-label="Toggle menu"
        >
          <span className={`block w-6 h-0.5 bg-white transition-all ${isMobileMenuOpen ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`block w-6 h-0.5 bg-white transition-all ${isMobileMenuOpen ? "opacity-0" : ""}`} />
          <span className={`block w-6 h-0.5 bg-white transition-all ${isMobileMenuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
        <p className="font-semibold text-xs text-white cursor-pointer">Log In</p>
        <div className="bg-[#878787] h-[40px] rounded-[6px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] flex items-center justify-center px-3 cursor-pointer hover:bg-[#6d6d6d] transition-colors">
          <p className="font-semibold text-xs text-white">Sign Up</p>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-black border-t border-gray-800 z-50">
          <div className="flex flex-col py-4">
            <button className="font-['Inter:Medium',sans-serif] font-medium text-base text-white px-6 py-3 text-left hover:bg-gray-900 hover:text-[#e0cb23] transition-colors">
              Home
            </button>
            <p className="font-['Inter:Medium',sans-serif] font-medium text-base text-white px-6 py-3 cursor-pointer hover:bg-gray-900 hover:text-[#e0cb23] transition-colors">
              Events
            </p>
            <p className="font-['Inter:Medium',sans-serif] font-medium text-base text-white px-6 py-3 cursor-pointer hover:bg-gray-900 hover:text-[#e0cb23] transition-colors">
              Clubs
            </p>
            <p className="font-['Inter:Medium',sans-serif] font-medium text-base text-[#e0cb23] px-6 py-3 cursor-pointer hover:bg-gray-900 hover:text-white transition-colors">
              Coaches
            </p>
            <p className="font-['Inter:Medium',sans-serif] font-medium text-base text-white px-6 py-3 cursor-pointer hover:bg-gray-900 hover:text-[#e0cb23] transition-colors">
              Contact Us
            </p>
          </div>
        </div>
      )}
    </header>
  );
}
