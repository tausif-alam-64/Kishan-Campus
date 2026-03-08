import React from "react";
import { Link } from "react-router-dom";

const SectionHeading = ({ children }) => (
  <div>
    <h4 className="text-xs font-bold tracking-widest uppercase text-amber-300">
      {children}
    </h4>
    <div className="mt-1.5 h-0.5 w-8 rounded-full bg-gradient-to-r from-amber-400 to-transparent" />
  </div>
);

const ContactItem = ({ icon, children }) => (
  <div className="flex items-start gap-2.5">
    <span className="mt-0.5 shrink-0 text-amber-400">{icon}</span>
    <span className="text-sm leading-relaxed text-green-100/60">{children}</span>
  </div>
);

const SocialBtn = ({ label, children }) => (
  <button
    aria-label={label}
    className="flex h-8 w-8 items-center justify-center rounded-full border border-amber-400/30 bg-amber-400/10 text-amber-400 transition-all duration-200 hover:border-amber-400 hover:bg-amber-400/20"
  >
    {children}
  </button>
);

const Footer = () => {
  return (
    <footer className="relative overflow-hidden bg-primary font-serif">

      {/* Gold top border */}
      <div className="h-1 w-full bg-gradient-to-r from-amber-600 via-amber-300 to-amber-600" />

      <div className="relative mx-auto max-w-7xl px-6">

        {/* ── School Banner Strip ── */}
        <div className="flex flex-wrap items-center gap-4 border-b border-amber-400/20 py-6">

          {/* Crest */}
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-amber-400/50 bg-amber-400/10">
            <svg width="30" height="30" viewBox="0 0 32 32" fill="none">
              <path d="M16 4 L28 10 L28 18 C28 24 22 28 16 30 C10 28 4 24 4 18 L4 10 Z"
                fill="rgba(201,168,76,0.15)" stroke="#c9a84c" strokeWidth="1.5" />
              <path d="M16 8 L24 12 L24 18 C24 22 20 25 16 26.5 C12 25 8 22 8 18 L8 12 Z"
                fill="rgba(201,168,76,0.1)" stroke="#c9a84c" strokeWidth="1" />
              <text x="16" y="20" textAnchor="middle" fill="#c9a84c" fontSize="9" fontWeight="bold" fontFamily="Georgia">KIC</text>
            </svg>
          </div>

          {/* Name & tagline */}
          <div>
            <h2 className="text-xl font-bold tracking-wide text-amber-300">
              Kisan Inter College
            </h2>
            <p className="mt-0.5 text-xs uppercase tracking-widest text-green-100/50">
              Sakhopar, Kushinagar · Govt. of Uttar Pradesh
            </p>
          </div>

          {/* UDISE badge */}
          <div className="ml-auto rounded-md border border-amber-400/25 bg-amber-400/5 px-4 py-2 text-center">
            <p className="text-[10px] uppercase tracking-widest text-green-100/40">UDISE Code</p>
            <p className="mt-0.5 font-mono text-sm font-bold tracking-widest text-amber-400">
              09590100202
            </p>
          </div>
        </div>

        {/* ── Main Grid ── */}
        <div className="grid grid-cols-1 gap-10 py-10 sm:grid-cols-2 lg:grid-cols-4">

          {/* About */}
          <div>
            <SectionHeading>About Us</SectionHeading>
            <p className="mt-4 text-sm leading-relaxed text-green-100/60">
              A Senior Secondary School offering Classes 6–12, affiliated with the
              Department of Secondary Education, Government of Uttar Pradesh. Nurturing
              young minds for a brighter tomorrow.
            </p>
            <div className="mt-4 flex gap-2.5">
              <SocialBtn label="Facebook">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </SocialBtn>
              <SocialBtn label="YouTube">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
                  <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="currentColor" stroke="none" />
                </svg>
              </SocialBtn>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <SectionHeading>Quick Links</SectionHeading>
            <ul className="mt-4 space-y-2.5">
              {[
                { label: "Home", to: "/" },
                { label: "About School", to: "/about" },
                { label: "Academics", to: "/academics" },
                { label: "Admissions", to: "/admissions" },
                { label: "Gallery", to: "/gallery" },
                { label: "Contact Us", to: "/contact" },
              ].map(({ label, to }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="flex items-center gap-2 text-sm text-green-100/60 transition-colors duration-200 hover:text-amber-300"
                  >
                    <span className="text-[9px] text-amber-500">▸</span>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Facilities */}
          <div>
            <SectionHeading>Our Facilities</SectionHeading>
            <ul className="mt-4 space-y-2.5">
              {[
                { icon: "🔬", text: "Science Laboratories" },
                { icon: "💻", text: "Computer Labs" },
                { icon: "🤖", text: "Atal Tinkering Lab (ATL)" },
                { icon: "📚", text: "Library & Reading Room" },
                { icon: "🏃", text: "Sports & Playground" },
                { icon: "🎭", text: "Co-curricular Activities" },
              ].map(({ icon, text }) => (
                <li key={text} className="flex items-center gap-2.5 text-sm text-green-100/60">
                  <span>{icon}</span>
                  {text}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <SectionHeading>Contact Us</SectionHeading>
            <div className="mt-4 flex flex-col gap-4">

              <ContactItem
                icon={
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                }
              >
                Sakhopar, Padarauna Block<br />
                Kushinagar District<br />
                Uttar Pradesh – 274402
              </ContactItem>

              <ContactItem
                icon={
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                }
              >
                <a
                  href="mailto:kisansakhopar@gmail.com"
                  className="text-green-100/60 transition-colors duration-200 hover:text-amber-300"
                >
                  kisansakhopar@gmail.com
                </a>
              </ContactItem>

              <ContactItem
                icon={
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="3" width="20" height="14" rx="2" />
                    <line x1="8" y1="21" x2="16" y2="21" />
                    <line x1="12" y1="17" x2="12" y2="21" />
                  </svg>
                }
              >
                Classes VI – XII<br />
                <span className="text-xs text-green-100/40">Science · Maths · Arts</span>
              </ContactItem>

            </div>
          </div>
        </div>

        {/* ── Bottom Bar ── */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-amber-400/15 py-5">
          <p className="text-xs text-green-100/35">
            © {new Date().getFullYear()} Kisan Inter College, Sakhopar. All rights reserved.
          </p>
          <p className="text-xs text-green-100/35">
            Built with <span className="text-amber-400">♥</span> by students & contributors
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;