import svgPaths from "./svg-2hbylw5w4i";
import imgIrish83Uy0DwKvAOnkUnsplash1 from "../assets/9d55187a89062294bab1d32e8f7bb52789e4dc7e.png";
import imgDimaKhudorozhkovMCsj0O9Nox4Unsplash1 from "../assets/bffd1d20dfd2b290fca14124096cd60bf33c718f.png";
import imgAjhSportsLogoNoOutline13 from "../assets/e8dadc63068e8cb8da040a6443512ba36cbcfb97.png";

// Removed "Looking for support?" section

export default function OurClubs() {
  return (
    <div className="bg-white relative w-full min-h-screen flex flex-col" data-name="Our Clubs">
      {/* Header - Same as Homepage */}
      <header className="relative bg-black text-white h-auto min-h-[124.5px] w-full pb-4 md:pb-0 md:h-[124.5px]" data-name="Homepage-Header">
        {/* Logo */}
        <div 
          className="absolute h-[53px] left-[20px] md:left-[39px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] top-[20px] md:top-[43px] w-[80px] cursor-pointer z-10"
          data-name="AJHSports-Logo-no-outline-1 1"
          aria-label="AJH Sports"
        >
          <img 
            alt="AJH Sports Logo" 
            className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" 
            src={imgAjhSportsLogoNoOutline13} 
          />
        </div>
        
        {/* Desktop navigation */}
        <div className="hidden lg:block">
          <button 
            className="absolute block cursor-pointer font-['Inter:Medium',sans-serif] font-medium h-[24px] leading-[normal] left-[190px] not-italic text-[16px] text-white top-[56px] w-[62px] hover:text-[#e0cb23] transition-colors"
          >
            <p className="leading-[normal]">Home</p>
          </button>
          <p className="absolute font-['Inter:Medium',sans-serif] font-medium h-[24px] leading-[normal] left-[309px] not-italic text-[16px] text-white top-[56px] w-[72px] cursor-pointer hover:text-[#e0cb23] transition-colors">
            Events
          </p>
          <p className="absolute font-['Inter:Medium',sans-serif] font-medium h-[24px] leading-[normal] left-[427px] not-italic text-[16px] text-[#e0cb23] top-[54px] w-[71px] cursor-pointer hover:text-white transition-colors">
            Clubs
          </p>
          <p className="absolute font-['Inter:Medium',sans-serif] font-medium h-[24px] leading-[normal] left-[544px] not-italic text-[16px] text-white top-[54px] w-[92px] cursor-pointer hover:text-[#e0cb23] transition-colors">
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
          <p className="font-['Inter:Medium',sans-serif] font-medium text-sm text-[#e0cb23] cursor-pointer hover:text-white transition-colors">
            Clubs
          </p>
          <p className="font-['Inter:Medium',sans-serif] font-medium text-sm text-white cursor-pointer hover:text-[#e0cb23] transition-colors">
            Coaches
          </p>
          <p className="font-['Inter:Medium',sans-serif] font-medium text-sm text-white cursor-pointer hover:text-[#e0cb23] transition-colors">
            Contact
          </p>
        </div>

        {/* Desktop Auth Buttons - Right */}
        <div className="hidden lg:flex absolute right-[39px] top-[46px] items-center gap-4">
          <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[12px] text-white cursor-pointer hover:text-[#e0cb23] transition-colors">
            Log In
          </p>
          <div className="bg-[#878787] h-[50px] rounded-[6px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] px-4 cursor-pointer hover:bg-[#6d6d6d] transition-colors flex items-center justify-center">
            <span className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[12px] text-white">
              Sign Up
            </span>
          </div>
        </div>

        {/* Tablet/Mobile Auth Buttons */}
        <div className="hidden md:flex lg:hidden absolute right-4 top-[46px] items-center gap-3">
          <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-xs text-white cursor-pointer hover:text-[#e0cb23] transition-colors">Log In</p>
          <div className="bg-[#878787] h-[40px] rounded-[6px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] flex items-center justify-center px-3 cursor-pointer hover:bg-[#6d6d6d] transition-colors">
            <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-xs text-white">Sign Up</p>
          </div>
        </div>

        {/* Mobile Menu Button and Auth */}
        <div className="md:hidden absolute right-4 top-[20px] flex items-center gap-3">
          <p className="font-semibold text-xs text-white cursor-pointer">Log In</p>
          <div className="bg-[#878787] h-[40px] rounded-[6px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] flex items-center justify-center px-3 cursor-pointer hover:bg-[#6d6d6d] transition-colors">
            <p className="font-semibold text-xs text-white">Sign Up</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex-grow">
        {/* Youth Club Section */}
        <div className="w-full py-12 md:py-16 lg:py-20 px-4 md:px-6 lg:px-8 xl:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
              {/* Image */}
              <div className="w-full lg:w-1/2 h-[300px] md:h-[400px] lg:h-[500px] rounded-2xl lg:rounded-bl-[1px] lg:rounded-br-[240px] lg:rounded-tl-[1px] lg:rounded-tr-[240px] overflow-hidden shadow-xl" data-name="irish83-uy0dwKvAOnk-unsplash 1">
                <img 
                  alt="Youth Club" 
                  className="w-full h-full object-cover" 
                  src={imgIrish83Uy0DwKvAOnkUnsplash1} 
                />
              </div>
              
              {/* Content */}
              <div className="w-full lg:w-1/2 flex flex-col gap-6 md:gap-8">
                <div className="font-['Inter:Bold',sans-serif] font-bold text-3xl md:text-4xl lg:text-5xl xl:text-[48px] text-black leading-tight">
                  <p>Be part of our Youth</p>
                  <p>Club</p>
                </div>
                <div className="font-['Inter:Regular',sans-serif] font-normal text-sm md:text-base lg:text-[14px] text-black leading-relaxed max-w-2xl">
                  <p className="mb-2">We love what we do and we do it with passion.</p>
                  <p className="mb-2">We value the experimentation of the message and</p>
                  <p>smart incentives.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 md:gap-6">
                  <div 
                    className="bg-[#e0cb23] h-[50px] md:h-[60px] lg:h-[71px] rounded-lg shadow-lg flex items-center justify-center px-8 md:px-12 cursor-pointer hover:opacity-90 transition-opacity min-w-[200px] md:min-w-[250px] lg:min-w-[291px]" 
                    data-cta="join-youth"
                  >
                    <p className="font-['Roboto:Bold',sans-serif] font-bold text-lg md:text-xl lg:text-[24px] text-center text-white" data-cta="join-youth">
                      Join Us
                    </p>
                  </div>
                  <div className="flex items-center gap-2 cursor-pointer group" data-cta="contact-youth">
                    <p className="font-['Roboto:Bold',sans-serif] font-bold text-lg md:text-xl lg:text-[24px] text-[#e0cb23] group-hover:opacity-80 transition-opacity" data-cta="contact-youth">
                      Contact Us
                    </p>
                    <div className="w-[24px] h-[24px] md:w-[31px] md:h-[31px]">
                      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 15">
                        <path d={svgPaths.p2b2ff580} fill="var(--stroke-0, #E0CB23)" id="Arrow 1" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Adult Club Section */}
        <div className="w-full py-12 md:py-16 lg:py-20 px-4 md:px-6 lg:px-8 xl:px-12 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row-reverse items-center gap-8 lg:gap-12">
              {/* Image */}
              <div className="w-full lg:w-1/2 h-[300px] md:h-[400px] lg:h-[500px] rounded-2xl lg:rounded-bl-[174px] lg:rounded-tl-[174px] overflow-hidden shadow-xl" data-name="dima-khudorozhkov-mCSJ0o9NOX4-unsplash 1">
                <img 
                  alt="Adult Club" 
                  className="w-full h-full object-cover" 
                  src={imgDimaKhudorozhkovMCsj0O9Nox4Unsplash1} 
                />
              </div>
              
              {/* Content */}
              <div className="w-full lg:w-1/2 flex flex-col gap-6 md:gap-8">
                <div className="font-['Inter:Bold',sans-serif] font-bold text-3xl md:text-4xl lg:text-5xl xl:text-[48px] text-black leading-tight">
                  <p>Be part of our Adult</p>
                  <p>Club</p>
                </div>
                <div className="font-['Inter:Regular',sans-serif] font-normal text-sm md:text-base lg:text-[14px] text-black leading-relaxed max-w-2xl">
                  <p className="mb-2">We love what we do and we do it with passion.</p>
                  <p className="mb-2">We value the experimentation of the message and</p>
                  <p>smart incentives.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 md:gap-6">
                  <div 
                    className="bg-[#e0cb23] h-[50px] md:h-[60px] lg:h-[71px] rounded-lg shadow-lg flex items-center justify-center px-8 md:px-12 cursor-pointer hover:opacity-90 transition-opacity min-w-[200px] md:min-w-[250px] lg:min-w-[291px]" 
                    data-cta="join-adult"
                  >
                    <p className="font-['Roboto:Bold',sans-serif] font-bold text-lg md:text-xl lg:text-[24px] text-center text-white" data-cta="join-adult">
                      Join Us
                    </p>
                  </div>
                  <div className="flex items-center gap-2 cursor-pointer group" data-cta="contact-adult">
                    <p className="font-['Roboto:Bold',sans-serif] font-bold text-lg md:text-xl lg:text-[24px] text-[#e0cb23] group-hover:opacity-80 transition-opacity" data-cta="contact-adult">
                      Contact Us
                    </p>
                    <div className="w-[24px] h-[24px] md:w-[31px] md:h-[31px]">
                      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 15">
                        <path d={svgPaths.p2b2ff580} fill="var(--stroke-0, #E0CB23)" id="Arrow 1" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer - Using same structure as Homepage */}
      <footer className="w-full bg-black flex-shrink-0 mt-auto">
        {/* Desktop Layout */}
        <div className="hidden md:block relative min-h-[364px]">
          {/* Logo */}
          <div 
            className="absolute h-[31px] left-[30px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] top-[30px] w-[47px] cursor-pointer"
          >
            <img 
              alt="AJH Sports Logo" 
              className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" 
              src={imgAjhSportsLogoNoOutline13} 
            />
          </div>
          
          {/* Newsletter Title */}
          <p className="absolute font-['Inter:Bold',sans-serif] font-bold h-[25px] leading-[40px] left-[335.5px] lg:left-[335.5px] text-[24px] text-white text-center top-[57px] tracking-[-0.24px] translate-x-[-50%] w-[407px]">
            Join Our Newsletter
          </p>
          
          {/* Newsletter Description */}
          <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[33px] leading-[20px] left-[327px] lg:left-[327px] text-[14px] text-slate-200 text-center top-[113px] translate-x-[-50%] w-[470px]">
            Subscribe to our newsletter to be the first to know about new sessions, competitions and events.
          </p>
          
          {/* Email Input Form - Desktop */}
          <form className="absolute left-[92px] top-[183px]">
            <input
              type="email"
              name="email"
              placeholder="Your email"
              required
              className="w-[316px] h-[47px] px-[15px] rounded-[4px] bg-white border border-white text-black font-['Rubik',sans-serif] text-[16px] outline-none"
            />
            <button
              type="submit"
              className="absolute left-[358px] top-[-2px] h-[49px] w-[151px] bg-[#191919] rounded-[100px] font-['Inter:Bold',sans-serif] font-bold text-[14px] text-white hover:bg-[#333] transition-colors"
            >
              Subscribe
            </button>
          </form>
          
          {/* Vertical Divider Line - Desktop */}
          <div className="absolute left-[654px] top-[42px] w-[1px] h-[213px] bg-[#807E7E] hidden lg:block" />
          
          {/* About Section - Desktop */}
          <div className="absolute left-[753px] top-[30px] hidden lg:block">
            <p className="font-['Plus_Jakarta_Sans:SemiBold',sans-serif] font-semibold text-[20px] text-white tracking-[-0.4px] mb-[16px]">About</p>
            <div className="font-['Inter:Medium',sans-serif] font-medium text-[16px] text-slate-200 leading-[2.2] tracking-[-0.32px]">
              <p className="cursor-pointer hover:text-[#e0cb23] transition-colors">Why Choose Us?</p>
              <p className="cursor-pointer hover:text-[#e0cb23] transition-colors">Featured</p>
              <p className="cursor-pointer hover:text-[#e0cb23] transition-colors">Partnership</p>
              <p className="cursor-pointer hover:text-[#e0cb23] transition-colors">Our Team</p>
            </div>
          </div>
          
          {/* Community Section - Desktop */}
          <div className="absolute left-[957.29px] top-[30px] hidden lg:block">
            <p className="font-['Plus_Jakarta_Sans:SemiBold',sans-serif] font-semibold text-[20px] text-white tracking-[-0.4px] mb-[16px]">Community</p>
            <div className="font-['Inter:Medium',sans-serif] font-medium text-[16px] text-slate-200 leading-[2.2] tracking-[-0.32px]">
              <p className="cursor-pointer hover:text-[#e0cb23] transition-colors">Events</p>
              <p className="cursor-pointer hover:text-[#e0cb23] transition-colors">Blog</p>
              <p className="cursor-pointer hover:text-[#e0cb23] transition-colors">Podcast</p>
              <p className="cursor-pointer hover:text-[#e0cb23] transition-colors">Invite a friend</p>
            </div>
          </div>
          
          {/* Contact Section - Desktop */}
          <div className="absolute left-[1162px] top-[30px] hidden lg:block">
            <p className="font-['Plus_Jakarta_Sans:SemiBold',sans-serif] font-semibold text-[20px] text-white tracking-[-0.4px] mb-[16px]">Contact Us</p>
            <div className="font-['Inter:Medium',sans-serif] font-medium text-[16px] text-slate-200 leading-[2.2] tracking-[-0.32px]">
              <p>ajhsports.com.au</p>
              <p>+61 0412345678</p>
              <p>123 Ave, Sydney, NSW</p>
              <a 
                href="https://navsports.com/sport-businesses/ajh-sports/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="cursor-pointer hover:text-[#e0cb23] transition-colors block"
              >
                NavSports Profile
              </a>
            </div>
          </div>
          
          {/* Bottom Divider */}
          <div className="absolute left-[77px] top-[297px] w-[calc(100%-154px)] max-w-[1318.17px] h-[1px] bg-[#807E7E]" />
          
          {/* Copyright */}
          <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold left-[30px] text-[11px] text-slate-200 top-[332px] tracking-[-0.22px]">
            ©2025 Company Name. All rights reserved
          </p>
          
          {/* Privacy & Terms - Desktop */}
          <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold text-[11px] text-slate-200 text-right top-[335px] tracking-[-0.22px] cursor-pointer hover:text-[#e0cb23] transition-colors" style={{ left: '1061px' }}>
            Privacy & Policy
          </p>
          <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold text-[11px] text-slate-200 text-right top-[336px] tracking-[-0.22px] cursor-pointer hover:text-[#e0cb23] transition-colors" style={{ left: '1263px' }}>
            Terms & Condition
          </p>
          
          {/* Social Icons */}
          <div className="absolute left-[646px] top-[320px] flex gap-[20px]">
            <div className="w-[22px] h-[22px] bg-[#1A202C] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#e0cb23]/20 transition-colors">
              <span className="text-[10px] text-white">f</span>
            </div>
            <div className="w-[22px] h-[22px] bg-[#1A202C] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#e0cb23]/20 transition-colors">
              <span className="text-[10px] text-white">𝕏</span>
            </div>
            <div className="w-[22px] h-[22px] bg-[#1A202C] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#e0cb23]/20 transition-colors">
              <span className="text-[10px] text-white">in</span>
            </div>
          </div>
        </div>

        {/* Mobile/Tablet Layout */}
        <div className="md:hidden relative py-8 px-4">
          {/* Logo - Centered */}
          <div className="flex justify-center mb-6">
            <div className="h-[31px] w-[47px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] cursor-pointer">
              <img 
                alt="AJH Sports Logo" 
                className="w-full h-full object-cover pointer-events-none" 
                src={imgAjhSportsLogoNoOutline13} 
              />
            </div>
          </div>
          
          {/* Newsletter Title - Centered */}
          <p className="font-['Inter:Bold',sans-serif] font-bold text-xl text-white text-center mb-2">
            Join Our Newsletter
          </p>
          
          {/* Newsletter Description - Centered */}
          <p className="font-['Inter:Regular',sans-serif] font-normal text-xs text-slate-200 text-center mb-6 px-4">
            Subscribe to our newsletter to be the first to know about new sessions, competitions and events.
          </p>
          
          {/* Email Input Form - Mobile - Centered */}
          <form className="mb-8 px-4">
            <div className="flex flex-col gap-3">
              <input
                type="email"
                name="email"
                placeholder="Your email"
                required
                className="w-full h-[47px] px-[15px] rounded-[4px] bg-white border border-white text-black font-['Rubik',sans-serif] text-base outline-none"
              />
              <button
                type="submit"
                className="w-full h-[49px] bg-[#191919] rounded-[100px] font-['Inter:Bold',sans-serif] font-bold text-sm text-white hover:bg-[#333] transition-colors"
              >
                Subscribe
              </button>
            </div>
          </form>
          
          {/* Footer Links - Mobile/Tablet */}
          <div className="mb-6 px-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center sm:text-left">
              <div>
                <p className="font-semibold text-sm text-white mb-3">About</p>
                <div className="font-medium text-xs text-slate-200 space-y-2">
                  <p className="cursor-pointer hover:text-[#e0cb23] transition-colors">Why Choose Us?</p>
                  <p className="cursor-pointer hover:text-[#e0cb23] transition-colors">Featured</p>
                  <p className="cursor-pointer hover:text-[#e0cb23] transition-colors">Partnership</p>
                  <p className="cursor-pointer hover:text-[#e0cb23] transition-colors">Our Team</p>
                </div>
              </div>
              <div>
                <p className="font-semibold text-sm text-white mb-3">Community</p>
                <div className="font-medium text-xs text-slate-200 space-y-2">
                  <p className="cursor-pointer hover:text-[#e0cb23] transition-colors">Events</p>
                  <p className="cursor-pointer hover:text-[#e0cb23] transition-colors">Blog</p>
                  <p className="cursor-pointer hover:text-[#e0cb23] transition-colors">Podcast</p>
                  <p className="cursor-pointer hover:text-[#e0cb23] transition-colors">Invite a friend</p>
                </div>
              </div>
              <div>
                <p className="font-semibold text-sm text-white mb-3">Contact Us</p>
                <div className="font-medium text-xs text-slate-200 space-y-2">
                  <p>ajhsports.com.au</p>
                  <p>+61 0412345678</p>
                  <p>123 Ave, Sydney, NSW</p>
                  <a 
                    href="https://navsports.com/sport-businesses/ajh-sports/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="cursor-pointer hover:text-[#e0cb23] transition-colors block"
                  >
                    NavSports Profile
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          {/* Bottom Divider - Mobile */}
          <div className="mx-4 mb-4 h-[1px] bg-[#807E7E]" />
          
          {/* Social Icons - Mobile */}
          <div className="flex justify-center gap-4 mb-4">
            <div className="w-[22px] h-[22px] bg-[#1A202C] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#e0cb23]/20 transition-colors">
              <span className="text-[10px] text-white">f</span>
            </div>
            <div className="w-[22px] h-[22px] bg-[#1A202C] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#e0cb23]/20 transition-colors">
              <span className="text-[10px] text-white">𝕏</span>
            </div>
            <div className="w-[22px] h-[22px] bg-[#1A202C] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#e0cb23]/20 transition-colors">
              <span className="text-[10px] text-white">in</span>
            </div>
          </div>
          
          {/* Copyright & Privacy - Mobile */}
          <div className="px-4 pb-4">
            <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[10px] text-slate-200 text-center mb-2 tracking-[-0.22px]">
              ©2025 Company Name. All rights reserved
            </p>
            <div className="flex justify-center gap-4">
              <p className="font-semibold text-[10px] text-slate-200 cursor-pointer hover:text-[#e0cb23] transition-colors">Privacy & Policy</p>
              <p className="font-semibold text-[10px] text-slate-200 cursor-pointer hover:text-[#e0cb23] transition-colors">Terms & Condition</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}