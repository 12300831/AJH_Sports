import { FormEvent } from 'react';

type Page = 'home' | 'clubs' | 'clubsList' | 'account' | 'events' | 'coaches' | 'contact' | 'signin' | 'signup';

interface ContactWrapperProps {
  onNavigate: (page: Page) => void;
}

const navItems: Array<{ label: string; page: Page }> = [
  { label: 'Home', page: 'home' },
  { label: 'Events', page: 'events' },
  { label: 'Clubs', page: 'clubs' },
  { label: 'Coaches', page: 'coaches' },
  { label: 'Contact Us', page: 'contact' },
];

export function ContactWrapper({ onNavigate }: ContactWrapperProps) {
  const handleNavClick = (page: Page) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    onNavigate(page);
  };

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = formData.get('name');
    // eslint-disable-next-line no-alert
    alert(`Thanks for reaching out${name ? `, ${name}` : ''}! We'll be in touch soon.`);
    event.currentTarget.reset();
  };

  return (
    <div className="min-h-screen bg-[#f7f7f7]" data-name="Contact Page">
      {/* Shared-style header (aligned with main site navigation) */}
      <header className="bg-black shadow">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-10 text-[16px] font-medium text-white">
            <div className="flex items-center gap-3">
              <div className="h-[40px] w-[60px]">
                <img
                  src="/images/e8dadc63068e8cb8da040a6443512ba36cbcfb97.png"
                  alt="AJH Sports logo"
                  className="h-full w-full object-contain"
                />
              </div>
            </div>
            {navItems.map(({ label, page }) => (
              <button
                key={label}
                type="button"
                onClick={() => handleNavClick(page)}
                className="transition-opacity hover:opacity-70"
              >
                {label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-6 text-sm font-semibold text-white">
            <button
              type="button"
              className="transition-opacity hover:opacity-70"
              onClick={() => handleNavClick('signin')}
            >
              Log In
            </button>
            <button
              type="button"
              className="rounded-md bg-[#878787] px-4 py-2 text-white transition hover:bg-[#6d6d6d]"
              onClick={() => handleNavClick('signup')}
            >
              Sign Up
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-6xl flex-col gap-12 px-6 py-16">
        <section className="grid gap-10 md:grid-cols-2">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-[#e0cb23]">Get in touch</p>
            <h1 className="mt-4 text-4xl font-bold text-black">We’re here to help your club grow</h1>
            <p className="mt-6 text-lg text-[#555]">
              Whether you&apos;re building your first roster or scaling multiple teams, our support staff is on
              standby. Reach out for scheduling, training, and membership questions anytime.
            </p>
            <dl className="mt-8 grid gap-6 text-[#222] md:grid-cols-2">
              <div>
                <dt className="text-sm font-semibold text-[#7a7a7a]">Phone</dt>
                <dd className="text-xl font-bold">0447827788</dd>
              </div>
              <div>
                <dt className="text-sm font-semibold text-[#7a7a7a]">Email</dt>
                <dd className="text-xl font-bold">info@starstv.com.au</dd>
              </div>
            </dl>
          </div>
          <div className="rounded-3xl bg-white p-8 shadow-lg">
            <h2 className="text-2xl font-semibold text-black">Quick message</h2>
            <p className="mt-2 text-sm text-[#5c5c5c]">Send us a note and we&apos;ll reply in under 24 hours.</p>
            <form className="mt-6 flex flex-col gap-4" onSubmit={handleFormSubmit}>
              <input
                name="name"
                className="rounded-xl border border-black/10 px-4 py-3 text-base outline-none transition focus:border-[#e0cb23]"
                placeholder="Full name"
                required
              />
              <input
                name="email"
                type="email"
                className="rounded-xl border border-black/10 px-4 py-3 text-base outline-none transition focus:border-[#e0cb23]"
                placeholder="Email address"
                required
              />
              <textarea
                name="message"
                className="min-h-32 rounded-xl border border-black/10 px-4 py-3 text-base outline-none transition focus:border-[#e0cb23]"
                placeholder="How can we help?"
                required
              />
              <button
                type="submit"
                className="rounded-xl bg-[#e0cb23] px-4 py-3 text-base font-semibold text-black transition hover:bg-[#cdb720]"
              >
                Send message
              </button>
            </form>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          {[
            {
              title: 'Join our Youth Club',
              copy: 'Train with elite coaches, access performance analytics, and grow with a supportive community.',
            },
            {
              title: 'Join our Adult Club',
              copy: 'Stay competitive, find new teammates, and keep your passion for sport thriving all year.',
            },
            ].map(({ title, copy }) => (
            <div key={title} className="rounded-3xl bg-white p-8 shadow-lg">
          
              <h3 className="mt-3 text-2xl font-semibold text-black">{title}</h3>
              <p className="mt-4 text-base text-[#555]">{copy}</p>
              <div className="mt-6 flex items-center gap-4">
      
                <button
                  type="button"
                 className="rounded-xl bg-[#e0cb23] px-6 py-3 text-base font-semibold text-black transition hover:bg-[#cdb720]"
                  onClick={() => handleNavClick('account')}
                >
                  Join Us
                </button>
                <button
                  type="button"
                  className="text-base font-semibold text-[#e0cb23] transition hover:text-[#cdb720]"
                  onClick={() => handleNavClick('clubs')}
                >
                  Explore clubs
                </button>
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}

