/**
 * AboutPage.jsx — Kisan Inter College, Sakhopar (Redesigned)
 *
 * Design Language : "Prestigious Rural Academy"
 *   Palette : Deep Emerald · Warm Amber · Stone Cream
 *   Fonts   : Playfair Display (headings) · DM Sans (body)
 *   Motion  : IntersectionObserver fade + slide-up on scroll
 *
 * FILE MAP (top → bottom):
 *   1. Imports
 *   2. Font helpers          ← F.display / F.body shorthand objects
 *   3. School Data           ← EDIT ALL CONTENT HERE
 *   4. useScrollReveal hook
 *   5. Shared primitives     ← Reveal, Eyebrow, Section, HoverCard …
 *   6. Page sections         ← one component per section
 *   7. AboutPage root        ← default export
 */

import { useState, useEffect, useRef } from "react";
import aboutHero from "../../assets/aboutImg-1.avif";
import {
  Activity, Award, Bell, BookOpen, Building2,
  Calculator, CheckCircle, Clock, Cpu, Droplets,
  Eye, FileText, FlaskConical, Globe, GraduationCap,
  Heart, Info, Mail, MapPin, Monitor,
  Shield, Star, Target, TrendingUp, User, Users,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// 1. FONT HELPERS
//    Inline style objects for Playfair Display and DM Sans.
//    Applied where Tailwind's font-serif / font-sans would be insufficient.
// ─────────────────────────────────────────────────────────────────────────────

const GOOGLE_FONTS_URL =
  "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,700&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap";

/** Reusable font-family shorthands — use as style={F.display} or style={F.body} */
const F = {
  display: { fontFamily: "'Playfair Display', serif" },
  body:    { fontFamily: "'DM Sans', sans-serif"     },
};

// ─────────────────────────────────────────────────────────────────────────────
// 2. SCHOOL DATA  ←  EDIT ALL TEXT / CONTENT HERE
// ─────────────────────────────────────────────────────────────────────────────

const SCHOOL = {
  name:     "Kisan Inter College, Sakhopar",
  founded:  "1948",
  board:    "UP State Board",
  type:     "Govt.-Aided Sr. Secondary",
  medium:   "Hindi & English",
  classes:  "VI to XII",
  location: "Sakhopar, Kushinagar",
  udise:    "09590100202",
  email:    "kisansakhopar@gmail.com",
  address:  "Sakhopar, Padarauna, Kushinagar, UP – 274402",
  hours:    "Mon–Sat · 9:00 AM – 3:00 PM",
};

const HERO_STATS = [
  { value: "76+",   label: "Years of Service"  },
  { value: "1000+", label: "Students Enrolled" },
  { value: "30+",   label: "Faculty Members"   },
  { value: "3",     label: "Streams Offered"   },
];

const GLANCE_ROWS = [
  { label: "School Name", value: SCHOOL.name     },
  { label: "Founded",     value: SCHOOL.founded  },
  { label: "Board",       value: SCHOOL.board    },
  { label: "Type",        value: SCHOOL.type     },
  { label: "Medium",      value: SCHOOL.medium   },
  { label: "Classes",     value: SCHOOL.classes  },
  { label: "Location",    value: SCHOOL.location },
  { label: "UDISE",       value: SCHOOL.udise    },
];

const HISTORY_PARAGRAPHS = [
  `Founded in 1948 in post-independence India, Kisan Inter College was
   established to serve the farming communities of Kushinagar. The name
   "Kisan" — meaning farmer — reflects the school's enduring mission to
   uplift rural communities through education.`,
  `Over the decades, the school grew from a small local institution into a
   government-aided senior secondary school, now affiliated with the UP
   State Board and offering Classes VI through XII across Arts and Science
   streams.`,
  `Today, the college continues its founding mission: providing quality
   education in Hindi and English medium to students from Sakhopar,
   Padarauna, and the surrounding villages of Kushinagar district.`,
];

const HISTORY_STATS = [
  { value: "1948",     label: "Year Founded" },
  { value: "UP Board", label: "Affiliation"  },
  { value: "VI–XII",   label: "Classes"      },
];

const TIMELINE = [
  { year: "1948",    desc: "School founded to serve Kushinagar's farming communities — a vision born in newly independent India." },
  { year: "1950s",   desc: "First batches graduate. The school earns a reputation for rigorous, caring education across the region." },
  { year: "1970s",   desc: "Government-aided status formally granted by UP State. Faculty and facilities expand significantly." },
  { year: "2000s",   desc: "Science stream (PCM & PCB) introduced at XI–XII, opening new pathways for students." },
  { year: "Present", desc: "Serving 1000+ students across Classes VI–XII, supported by 30+ dedicated faculty members." },
];

const VALUES = [
  { icon: Star,       iconColor: "text-amber-500",  bgColor: "bg-amber-50",  title: "Excellence",  desc: "We hold every student and teacher to the highest standards of academic and personal excellence." },
  { icon: Users,      iconColor: "text-sky-600",    bgColor: "bg-sky-50",    title: "Inclusivity", desc: "Education is a right, not a privilege. We welcome students from all backgrounds and communities." },
  { icon: Shield,     iconColor: "text-emerald-600",bgColor: "bg-emerald-50",title: "Integrity",   desc: "Honesty, transparency, and strong moral character form the foundation of our institution." },
  { icon: Heart,      iconColor: "text-rose-500",   bgColor: "bg-rose-50",   title: "Community",   desc: "We are deeply rooted in Kushinagar's rural fabric and serve the families who depend on us." },
  { icon: TrendingUp, iconColor: "text-violet-600", bgColor: "bg-violet-50", title: "Growth",      desc: "Every student has unlimited potential. We create the environment to help them discover and reach it." },
  { icon: BookOpen,   iconColor: "text-emerald-900",bgColor: "bg-emerald-50",title: "Discipline",  desc: "A structured environment helps students develop focus, responsibility, and resilience." },
];

const PRINCIPAL = {
  name:              "Shri Akhilesh Singh",
  title:             "Principal",
  yearsAtSchool:     "20+ Years",
  qualification:     "M.A., B.Ed.",
  specialisation:    "Education",
  quote:             "Every child who walks through our gates carries the potential to transform their family and community.",
  messageParagraphs: [
    `Welcome to Kisan Inter College, Sakhopar. For over seven decades, this
     institution has been more than a school — it has been the foundation on
     which thousands of students have built their futures.`,
    `We believe that education's true purpose goes beyond passing examinations.
     At KIC, we strive to develop students who are academically strong, morally
     grounded, and socially responsible.`,
    `I invite every aspiring student and their family to visit us, experience our
     campus, and join the KIC family. Together, we will build a brighter tomorrow
     for Kushinagar and beyond.`,
  ],
};

const FACULTY_STATS = [
  { value: "30+",          label: "Total Faculty"       },
  { value: "15+",          label: "Yrs Avg. Experience" },
  { value: "100%",         label: "UP Board Qualified"  },
  { value: "Hindi & Eng.", label: "Teaching Medium"     },
];

const DEPARTMENTS = [
  { icon: BookOpen,     iconColor: "text-amber-500",  bgColor: "bg-amber-50",  name: "Languages Dept.",     subjects: "Hindi · English · Sanskrit"        },
  { icon: Calculator,   iconColor: "text-sky-600",    bgColor: "bg-sky-50",    name: "Mathematics Dept.",   subjects: "Mathematics"                       },
  { icon: FlaskConical, iconColor: "text-emerald-600",bgColor: "bg-emerald-50",name: "Science Dept.",       subjects: "Physics · Chemistry · Biology"     },
  { icon: Globe,        iconColor: "text-violet-600", bgColor: "bg-violet-50", name: "Social Studies Dept.",subjects: "History · Geography · Civics"      },
  { icon: Activity,     iconColor: "text-rose-500",   bgColor: "bg-rose-50",   name: "Physical Education",  subjects: "Sports & Fitness Activities"       },
  { icon: Building2,    iconColor: "text-slate-600",  bgColor: "bg-slate-50",  name: "Administration",      subjects: "Office · Accounts · Support Staff" },
];

const FACILITIES = [
  { icon: Monitor,      iconColor: "text-emerald-900",bgColor: "bg-emerald-50",name: "Classrooms",           desc: "Spacious, well-ventilated classrooms with natural lighting for effective teaching and focused learning." },
  { icon: FlaskConical, iconColor: "text-emerald-600",bgColor: "bg-emerald-50",name: "Science Laboratories", desc: "Physics, Chemistry and Biology labs fully equipped as per UP Board curriculum standards." },
  { icon: BookOpen,     iconColor: "text-amber-500",  bgColor: "bg-amber-50",  name: "Library",              desc: "Well-stocked with textbooks, reference books, newspapers and resources in Hindi and English." },
  { icon: Activity,     iconColor: "text-rose-500",   bgColor: "bg-rose-50",   name: "Playground & Sports",  desc: "Large outdoor ground for cricket, football, kabaddi and athletics. Annual sports day held every year." },
  { icon: Cpu,          iconColor: "text-sky-600",    bgColor: "bg-sky-50",    name: "Computer Room",        desc: "Dedicated computer room providing students basic digital education and IT literacy skills." },
  { icon: Building2,    iconColor: "text-violet-600", bgColor: "bg-violet-50", name: "Administrative Block", desc: "Principal's office, staff room, accounts office and examination cell — all in one block." },
  { icon: Droplets,     iconColor: "text-teal-600",   bgColor: "bg-teal-50",   name: "Drinking Water",       desc: "Clean drinking water facilities available across campus for all students and staff." },
  { icon: Users,        iconColor: "text-pink-600",   bgColor: "bg-pink-50",   name: "Girls' Common Room",   desc: "A dedicated, safe and comfortable space for female students on campus." },
  { icon: Bell,         iconColor: "text-orange-500", bgColor: "bg-orange-50", name: "Notice Boards",        desc: "Central notice boards at key campus locations for announcements, results and dates." },
];

const ACHIEVEMENTS = [
  "Government-aided status recognised by the UP State Government",
  "Consistently producing UP Board toppers from rural Kushinagar",
  "100% pass rate in UP Board Class X and XII examinations (multiple sessions)",
  "Active participation in district-level science exhibitions and sports meets",
  "Strong alumni network in education, agriculture, administration & public service",
  "Recognised as a trusted institution by families across Sakhopar and Padarauna",
];

const RECOGNITION_STATS = [
  { value: "5000+",      label: "Alumni"        },
  { value: "76+",        label: "Years"         },
  { value: "Kushinagar", label: "Region Served" },
];

const AFFILIATION_CARDS = [
  {
    icon:     GraduationCap,
    iconColor:"text-amber-500",
    title:    "UP State Board",
    subtitle: "Uttar Pradesh Madhyamik Shiksha Parishad",
    desc:     "All Class X and XII examinations conducted by the UP Board under the state education framework.",
  },
  {
    icon:     Building2,
    iconColor:"text-emerald-600",
    title:    "Government-Aided",
    subtitle: "State Government Recognised",
    desc:     "Kisan Inter College is government-aided. Fees are regulated and kept minimal per state norms.",
  },
  {
    icon:     FileText,
    iconColor:"text-sky-600",
    title:    "UDISE Registered",
    subtitle: `UDISE Code: ${SCHOOL.udise}`,
    desc:     "Registered with the Unified District Information System — part of the national school data framework.",
  },
];

const CONTACT_CHIPS = [
  { icon: MapPin, text: SCHOOL.address },
  { icon: Mail,   text: SCHOOL.email   },
  { icon: Clock,  text: SCHOOL.hours   },
];

// ─────────────────────────────────────────────────────────────────────────────
// 3. useScrollReveal HOOK
//    Returns [ref, isVisible]. Fires once when element enters viewport.
// ─────────────────────────────────────────────────────────────────────────────

function useScrollReveal(threshold = 0.08) {
  const ref             = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, visible];
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. SHARED PRIMITIVES
// ─────────────────────────────────────────────────────────────────────────────

/** Fade + slide-up wrapper. Triggers once on scroll entry. */
function Reveal({ children, delay = 0, className = "" }) {
  const [ref, visible] = useScrollReveal();
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/** Small uppercase label with a leading gold rule. */
function Eyebrow({ text, light = false }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="w-7 h-px bg-amber-500 flex-shrink-0" />
      <span
        className={`text-[0.62rem] font-semibold tracking-[0.2em] uppercase ${
          light ? "text-amber-400" : "text-amber-500"
        }`}
        style={F.body}
      >
        {text}
      </span>
    </div>
  );
}

/** Consistent page section with max-width container. */
function Section({ bg = "bg-white", children }) {
  return (
    <section className={`${bg} py-24`}>
      <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-14">
        {children}
      </div>
    </section>
  );
}

/** Section heading group: Eyebrow + H2 + optional subtitle. */
function SectionHeader({ eyebrow, heading, subtitle, light = false, center = false }) {
  return (
    <div className={`mb-12 ${center ? "text-center" : ""}`}>
      <Reveal>
        <Eyebrow text={eyebrow} light={light} />
      </Reveal>
      <Reveal delay={80}>
        <h2
          className={`text-4xl md:text-5xl font-bold leading-[1.1] mb-3 ${
            light ? "text-white" : "text-emerald-900"
          }`}
          style={F.display}
        >
          {heading}
        </h2>
      </Reveal>
      {subtitle && (
        <Reveal delay={150}>
          <p
            className={`text-sm leading-[1.9] max-w-xl ${
              center ? "mx-auto" : ""
            } ${light ? "text-white/50" : "text-slate-500"}`}
            style={F.body}
          >
            {subtitle}
          </p>
        </Reveal>
      )}
    </div>
  );
}

/** Stat display: large value + small label. */
function StatBlock({ value, label, light = false }) {
  return (
    <div>
      <div
        className={`text-[2rem] font-bold leading-none ${
          light ? "text-amber-400" : "text-emerald-900"
        }`}
        style={F.display}
      >
        {value}
      </div>
      <div
        className={`text-[0.6rem] uppercase tracking-[0.1em] mt-1 ${
          light ? "text-white/40" : "text-slate-400"
        }`}
        style={F.body}
      >
        {label}
      </div>
    </div>
  );
}

/** Card that lifts + gold-borders on hover. */
function HoverCard({ children, bg = "bg-white", padding = "p-6" }) {
  return (
    <div
      className={`${bg} ${padding} border border-stone-200 shadow-sm
        hover:border-amber-400 hover:shadow-md hover:-translate-y-1
        transition-all duration-200 cursor-default h-full`}
    >
      {children}
    </div>
  );
}

/** 2px amber gradient bar — top-accent on dark cards. */
function GoldBar() {
  return (
    <div className="h-0.5 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-300" />
  );
}

/** Horizontal gradient rule between sections. */
function SectionDivider() {
  return (
    <div className="h-px bg-gradient-to-r from-transparent via-stone-300 to-transparent" />
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. PAGE SECTIONS
// ─────────────────────────────────────────────────────────────────────────────

// ── §1  HERO ──────────────────────────────────────────────────────────────────
function HeroSection() {
  return (
    <section
      className="relative min-h-[620px] overflow-hidden"
      style={{
        backgroundImage:    `url(${aboutHero})`,
        backgroundSize:     "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-primary" />

      {/* Top gold accent bar */}
      <div className="relative z-10">
        <GoldBar />
      </div>

      {/* Decorative rings */}
      {[{ size: "w-[640px] h-[640px]", pos: "-top-36 -right-36", opacity: "border-amber-500/8" },
        { size: "w-[400px] h-[400px]", pos: "-top-16 -right-16", opacity: "border-amber-500/12" }
      ].map((ring, i) => (
        <div
          key={i}
          aria-hidden="true"
          className={`absolute ${ring.pos} ${ring.size} rounded-full border ${ring.opacity} pointer-events-none`}
        />
      ))}

      {/* Angled clip — seamless transition to next section */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 right-0 h-16 bg-stone-50 pointer-events-none"
        style={{ clipPath: "polygon(0 100%, 100% 100%, 100% 0)" }}
      />

      {/* Main content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 lg:px-14 py-24 grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">

        {/* Left: headline + CTA + stats */}
        <div>
          <div style={{ opacity: 0, animation: "kicFadeUp 0.8s 0.08s forwards" }}>
            <Eyebrow text="Our Story · Since 1948" light />
          </div>

          <div style={{ opacity: 0, animation: "kicFadeUp 0.8s 0.20s forwards" }}>
            <h1
              className="text-[clamp(2.8rem,7vw,5.2rem)] font-bold text-white leading-[1.04] mb-6"
              style={F.display}
            >
              About
              <br />
              <em className="text-amber-400 not-italic">
                Kisan Inter
                <br />
                College
              </em>
            </h1>
          </div>

          <div style={{ opacity: 0, animation: "kicFadeUp 0.8s 0.32s forwards" }}>
            <p
              className="text-white/55 text-sm leading-[1.9] max-w-[460px] mb-8"
              style={F.body}
            >
              Rooted in the heart of Kushinagar, Kisan Inter College has stood
              as a beacon of rural education for over seven decades — making
              quality learning accessible to every student, regardless of background.
            </p>
          </div>

          <div
            style={{ opacity: 0, animation: "kicFadeUp 0.8s 0.42s forwards" }}
            className="flex gap-3 flex-wrap mb-10"
          >
            <button
              className="bg-amber-500 hover:bg-amber-400 text-emerald-950 text-sm font-bold px-6 py-3 transition-colors duration-200"
              style={F.body}
            >
              Explore Campus
            </button>
            <button
              className="border border-white/25 hover:border-white/55 text-white text-sm font-bold px-6 py-3 bg-transparent transition-colors duration-200"
              style={F.body}
            >
              Contact Us
            </button>
          </div>

          <div
            style={{ opacity: 0, animation: "kicFadeUp 0.8s 0.54s forwards" }}
            className="flex gap-8 flex-wrap pt-6 border-t border-white/10"
          >
            {HERO_STATS.map(({ value, label }) => (
              <StatBlock key={label} value={value} label={label} light />
            ))}
          </div>
        </div>

        {/* Right: At a Glance card */}
        <div style={{ opacity: 0, animation: "kicFadeUp 0.8s 0.36s forwards" }}>
          <div className="border border-white/10 overflow-hidden" style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(18px)" }}>
            {/* Card header */}
            <div
              className="px-5 py-3 flex items-center gap-2 border-b border-amber-500/20"
              style={{ background: "rgba(245,158,11,0.08)" }}
            >
              <Building2 size={12} className="text-amber-400" />
              <span
                className="text-[0.6rem] font-semibold tracking-[0.2em] uppercase text-amber-400"
                style={F.body}
              >
                At a Glance
              </span>
            </div>

            {/* Data rows */}
            {GLANCE_ROWS.map(({ label, value }, i) => (
              <div
                key={label}
                className={`flex justify-between items-center px-5 py-2.5 ${
                  i < GLANCE_ROWS.length - 1 ? "border-b border-white/[0.05]" : ""
                }`}
              >
                <span className="text-[0.74rem] text-white/35" style={F.body}>
                  {label}
                </span>
                <span
                  className="text-[0.82rem] font-semibold text-white text-right max-w-[58%]"
                  style={F.body}
                >
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Hero keyframes — fires on page load, not scroll */}
      <style>{`
        @keyframes kicFadeUp {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
      `}</style>
    </section>
  );
}

// ── §2  HISTORY ───────────────────────────────────────────────────────────────
function HistorySection() {
  return (
    <Section bg="bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-[55%_45%] gap-16 items-start">

        {/* Left: narrative */}
        <div>
          <SectionHeader
            eyebrow="Our Heritage"
            heading={
              <>
                A Legacy Rooted in
                <br />
                <em className="text-amber-500">Kushinagar's Fields</em>
              </>
            }
          />
          {HISTORY_PARAGRAPHS.map((text, i) => (
            <Reveal key={i} delay={140 + i * 60}>
              <p className="text-slate-500 text-sm leading-[1.9] mb-4" style={F.body}>
                {text}
              </p>
            </Reveal>
          ))}
          <Reveal delay={330}>
            <div className="flex gap-10 flex-wrap mt-8 pt-6 border-t border-stone-200">
              {HISTORY_STATS.map(({ value, label }) => (
                <StatBlock key={label} value={value} label={label} />
              ))}
            </div>
          </Reveal>
        </div>

        {/* Right: vertical timeline */}
        <div className="pt-1">
          <div className="relative pl-8">
            {/* Vertical gradient line */}
            <div
              aria-hidden="true"
              className="absolute left-0 top-2 bottom-0 w-px pointer-events-none"
              style={{ background: "linear-gradient(to bottom, #F59E0B, rgba(245,158,11,0.04))" }}
            />

            {TIMELINE.map(({ year, desc }, i) => (
              <Reveal key={year} delay={i * 80}>
                <div className="relative mb-8 last:mb-0">
                  {/* Diamond marker */}
                  <div
                    aria-hidden="true"
                    className="absolute -left-[2.2rem] top-1.5 w-2.5 h-2.5 bg-white border-2 border-amber-500 rotate-45"
                  />
                  <div className="text-[1.05rem] font-bold text-amber-500 mb-1" style={F.display}>
                    {year}
                  </div>
                  <div className="text-slate-500 text-sm leading-[1.82]" style={F.body}>
                    {desc}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}

// ── §3  VISION, MISSION & VALUES ──────────────────────────────────────────────
function VisionMissionSection() {
  return (
    <Section bg="bg-stone-50">
      <SectionHeader
        eyebrow="Our Purpose"
        heading={
          <>
            Vision, Mission{" "}
            <em className="text-amber-500">&amp; Values</em>
          </>
        }
        subtitle="The principles and values that have guided Kisan Inter College through more than seven decades of service."
      />

      {/* Vision + Mission — intentional light/dark contrast */}
      <Reveal>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">

          {/* Vision — light */}
          <div className="bg-white border border-stone-200 p-8 shadow-sm flex flex-col">
            <div className="flex items-center gap-3 mb-5">
              <div className="bg-amber-50 border border-amber-200 p-2.5 flex-shrink-0">
                <Eye size={18} className="text-amber-500" />
              </div>
              <span className="text-xl font-bold text-emerald-900" style={F.display}>
                Our Vision
              </span>
            </div>
            <p className="text-slate-500 text-sm leading-[1.9] flex-1" style={F.body}>
              To be the leading institution of rural education in Kushinagar —
              empowering every student with knowledge, character, and opportunity,
              regardless of economic background.
            </p>
            <div className="h-0.5 bg-gradient-to-r from-amber-500 to-transparent mt-7" />
          </div>

          {/* Mission — dark */}
          <div className="bg-emerald-900 p-8 shadow-md flex flex-col">
            <div className="flex items-center gap-3 mb-5">
              <div
                className="border border-amber-500/25 p-2.5 flex-shrink-0"
                style={{ background: "rgba(245,158,11,0.12)" }}
              >
                <Target size={18} className="text-amber-400" />
              </div>
              <span className="text-xl font-bold text-white" style={F.display}>
                Our Mission
              </span>
            </div>
            <p className="text-white/55 text-sm leading-[1.9] flex-1" style={F.body}>
              To deliver quality, inclusive education through dedicated teaching,
              strong academics, and holistic development — preparing students for
              higher education and life beyond the classroom.
            </p>
            <div className="h-0.5 bg-gradient-to-r from-amber-500 to-transparent mt-7" />
          </div>
        </div>
      </Reveal>

      {/* Values — 3-column grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {VALUES.map(({ icon: Icon, iconColor, bgColor, title, desc }, i) => (
          <Reveal key={title} delay={i * 55}>
            <HoverCard>
              <div className={`inline-flex p-2 ${bgColor} mb-4`}>
                <Icon size={16} className={iconColor} />
              </div>
              <div className="text-[1.05rem] font-bold text-emerald-900 mb-2" style={F.display}>
                {title}
              </div>
              <div className="text-slate-500 text-sm leading-[1.78]" style={F.body}>
                {desc}
              </div>
            </HoverCard>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

// ── §4  PRINCIPAL'S MESSAGE ───────────────────────────────────────────────────
function PrincipalSection() {
  const details = [
    { label: "Years at School", value: PRINCIPAL.yearsAtSchool },
    { label: "Qualification",   value: PRINCIPAL.qualification },
    { label: "Specialisation",  value: PRINCIPAL.specialisation },
  ];

  return (
    <Section bg="bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-14 items-start">

        {/* Left: profile card */}
        <Reveal>
          <div className="bg-emerald-900 shadow-xl overflow-hidden">
            <GoldBar />
            <div className="p-8">
              {/* Avatar */}
              <div className="flex flex-col items-center text-center mb-7">
                <div
                  className="w-20 h-20 rounded-full border-2 border-amber-500/30 flex items-center justify-center mb-4"
                  style={{ background: "rgba(245,158,11,0.12)" }}
                >
                  <User size={32} className="text-amber-400" />
                </div>
                <div className="text-xl font-bold text-white mb-1" style={F.display}>
                  {PRINCIPAL.name}
                </div>
                <div
                  className="text-[0.6rem] font-semibold tracking-[0.18em] uppercase text-amber-400"
                  style={F.body}
                >
                  {PRINCIPAL.title}
                </div>
              </div>

              <div className="h-px bg-white/10 mb-5" />

              {details.map(({ label, value }) => (
                <div key={label} className="flex justify-between mb-3.5 last:mb-0">
                  <span className="text-xs text-white/35" style={F.body}>{label}</span>
                  <span className="text-sm font-semibold text-white" style={F.body}>{value}</span>
                </div>
              ))}

              {/* Quote */}
              <div className="border-l-4 border-amber-500 pl-4 mt-7">
                <p className="text-sm italic text-white/50 leading-[1.82]" style={F.display}>
                  "{PRINCIPAL.quote}"
                </p>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Right: message */}
        <div>
          <SectionHeader
            eyebrow="Leadership"
            heading={
              <>
                Principal's{" "}
                <em className="text-amber-500">Message</em>
              </>
            }
          />
          {PRINCIPAL.messageParagraphs.map((text, i) => (
            <Reveal key={i} delay={140 + i * 80}>
              <p className="text-slate-500 text-sm leading-[1.9] mb-5" style={F.body}>
                {text}
              </p>
            </Reveal>
          ))}
          <Reveal delay={380}>
            <div className="text-amber-500 text-lg italic mt-2" style={F.display}>
              — Principal, Kisan Inter College
            </div>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}

// ── §5  FACULTY & STAFF ───────────────────────────────────────────────────────
function FacultySection() {
  return (
    <Section bg="bg-stone-50">
      <SectionHeader
        eyebrow="Our Team"
        heading={
          <>
            Faculty <em className="text-amber-500">&amp; Staff</em>
          </>
        }
        subtitle="Our team of dedicated educators brings decades of combined experience to the classroom, committed to academic excellence and the holistic growth of every student."
      />

      {/* Stats strip */}
      <Reveal delay={120}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {FACULTY_STATS.map(({ value, label }) => (
            <div
              key={label}
              className="bg-white border border-stone-200 p-5 shadow-sm"
            >
              <div className="text-[1.8rem] font-bold text-emerald-900 leading-none" style={F.display}>
                {value}
              </div>
              <div
                className="text-[0.6rem] uppercase tracking-[0.09em] text-slate-400 mt-1.5"
                style={F.body}
              >
                {label}
              </div>
            </div>
          ))}
        </div>
      </Reveal>

      {/* Department cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {DEPARTMENTS.map(({ icon: Icon, iconColor, bgColor, name, subjects }, i) => (
          <Reveal key={name} delay={i * 55}>
            <HoverCard>
              <div className={`inline-flex p-2 ${bgColor} mb-4`}>
                <Icon size={16} className={iconColor} />
              </div>
              <div className="text-base font-bold text-emerald-900 mb-1.5" style={F.display}>
                {name}
              </div>
              <div className="text-slate-500 text-sm" style={F.body}>
                {subjects}
              </div>
            </HoverCard>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

// ── §6  INFRASTRUCTURE & FACILITIES ──────────────────────────────────────────
function FacilitiesSection() {
  return (
    <Section bg="bg-white">
      <SectionHeader
        eyebrow="Campus"
        heading={
          <>
            Infrastructure{" "}
            <em className="text-amber-500">&amp; Facilities</em>
          </>
        }
        subtitle="Our campus in Sakhopar provides a safe, stimulating learning environment — from well-equipped classrooms to dedicated science labs."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {FACILITIES.map(({ icon: Icon, iconColor, name, desc }, i) => (
          <Reveal key={name} delay={i * 45}>
            <HoverCard bg="bg-stone-50">
              {/* Icon box with white background, coloured border */}
              <div className="inline-flex p-2.5 bg-white border border-stone-200 mb-4">
                <Icon size={16} className={iconColor} />
              </div>
              <div className="text-[1.04rem] font-bold text-emerald-900 mb-2" style={F.display}>
                {name}
              </div>
              <div className="text-slate-500 text-sm leading-[1.78]" style={F.body}>
                {desc}
              </div>
            </HoverCard>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

// ── §7  ACHIEVEMENTS & RECOGNITION ───────────────────────────────────────────
function AchievementsSection() {
  return (
    <Section bg="bg-stone-50">
      <SectionHeader
        eyebrow="Milestones"
        heading={
          <>
            Achievements{" "}
            <em className="text-amber-500">&amp; Recognition</em>
          </>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

        {/* Achievement checklist */}
        <div>
          {ACHIEVEMENTS.map((item, i) => (
            <Reveal key={i} delay={i * 60}>
              <div className="flex gap-3 items-start p-4 bg-white border border-stone-200 shadow-sm mb-3 last:mb-0">
                <CheckCircle
                  size={15}
                  className="text-amber-500 flex-shrink-0 mt-0.5"
                />
                <span className="text-slate-500 text-sm leading-[1.78]" style={F.body}>
                  {item}
                </span>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Dark recognition card */}
        <Reveal delay={80}>
          <div className="bg-emerald-900 shadow-xl overflow-hidden">
            <GoldBar />
            <div className="p-10">
              <Award size={36} className="text-amber-500 mb-5" />
              <h3
                className="text-4xl font-bold text-white mb-4 leading-tight"
                style={F.display}
              >
                76+ Years
                <br />
                of Trust
              </h3>
              <p
                className="text-white/50 text-sm leading-[1.9] mb-8"
                style={F.body}
              >
                Generations of families in Kushinagar have chosen Kisan Inter
                College as the foundation of their children's education. Our legacy
                is built not on awards, but on the success of every student who has
                passed through our gates.
              </p>
              <div className="flex gap-8 flex-wrap pt-6 border-t border-white/10">
                {RECOGNITION_STATS.map(({ value, label }) => (
                  <StatBlock key={label} value={value} label={label} light />
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

// ── §8  AFFILIATION & ACCREDITATION ──────────────────────────────────────────
function AffiliationSection() {
  return (
    <Section bg="bg-white">
      <SectionHeader
        eyebrow="Official Status"
        heading={
          <>
            Affiliation{" "}
            <em className="text-amber-500">&amp; Accreditation</em>
          </>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
        {AFFILIATION_CARDS.map(({ icon: Icon, iconColor, title, subtitle, desc }, i) => (
          <Reveal key={title} delay={i * 80}>
            <div className="bg-stone-50 border border-stone-200 p-7 shadow-sm hover:border-amber-400 hover:shadow-md transition-all duration-200 h-full">
              <Icon size={22} className={`${iconColor} mb-4`} />
              <div className="text-xl font-bold text-emerald-900 mb-1" style={F.display}>
                {title}
              </div>
              <div
                className="text-[0.62rem] uppercase tracking-[0.12em] text-amber-500 font-semibold mb-4"
                style={F.body}
              >
                {subtitle}
              </div>
              <div className="text-slate-500 text-sm leading-[1.82]" style={F.body}>
                {desc}
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      {/* Info notice */}
      <Reveal delay={200}>
        <div className="bg-amber-50 border border-amber-200 px-5 py-4 flex gap-3 items-start">
          <Info size={15} className="text-amber-700 flex-shrink-0 mt-0.5" />
          <span className="text-amber-800 text-sm leading-[1.78]" style={F.body}>
            For affiliation queries or official document verification, please contact
            the school office during working hours —{" "}
            <strong>Monday to Saturday, 9:00 AM to 3:00 PM</strong>.
          </span>
        </div>
      </Reveal>
    </Section>
  );
}

// ── §9  CONTACT CTA ───────────────────────────────────────────────────────────
function ContactSection() {
  return (
    <section className="bg-emerald-900 py-20 relative overflow-hidden">
      <GoldBar />

      {/* Decorative rings */}
      <div
        aria-hidden="true"
        className="absolute -top-40 -right-40 w-[520px] h-[520px] rounded-full border border-amber-500/8 pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full border border-amber-500/8 pointer-events-none"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 lg:px-14 text-center">

        <Reveal>
          <h2
            className="text-4xl md:text-5xl font-bold text-white mb-3"
            style={F.display}
          >
            Come Visit Us{" "}
            <em className="text-amber-400">in Person</em>
          </h2>
        </Reveal>

        <Reveal delay={80}>
          <p
            className="text-white/50 text-sm leading-[1.88] mb-8 max-w-md mx-auto"
            style={F.body}
          >
            Our gates are open Monday to Saturday, 9 AM to 3 PM.
            <br />
            No appointment needed — all are welcome.
          </p>
        </Reveal>

        <Reveal delay={160}>
          <div className="flex gap-3 justify-center flex-wrap mb-10">
            <button
              className="bg-amber-500 hover:bg-amber-400 text-emerald-950 text-sm font-bold px-6 py-3 transition-colors duration-200"
              style={F.body}
            >
              Get Directions
            </button>
            <button
              className="border border-white/25 hover:border-white/55 text-white text-sm font-bold px-6 py-3 bg-transparent transition-colors duration-200"
              style={F.body}
            >
              Email Us
            </button>
          </div>
        </Reveal>

        <Reveal delay={240}>
          <div className="flex gap-3 justify-center flex-wrap">
            {CONTACT_CHIPS.map(({ icon: Icon, text }) => (
              <div
                key={text}
                className="px-4 py-2.5 flex items-center gap-2 border border-white/10"
                style={{ background: "rgba(255,255,255,0.05)" }}
              >
                <Icon size={13} className="text-amber-400 flex-shrink-0" />
                <span className="text-white/60 text-xs" style={F.body}>
                  {text}
                </span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. PAGE ROOT
// ─────────────────────────────────────────────────────────────────────────────

export default function AboutPage() {
  // Inject Google Fonts once on mount
  useEffect(() => {
    const link = document.createElement("link");
    link.rel  = "stylesheet";
    link.href = GOOGLE_FONTS_URL;
    document.head.appendChild(link);
    return () => { document.head.removeChild(link); };
  }, []);

  return (
    <div
      className="text-slate-800 overflow-x-hidden bg-stone-50"
      style={F.body}
    >
      <HeroSection />
      <SectionDivider />
      <HistorySection />
      <SectionDivider />
      <VisionMissionSection />
      <SectionDivider />
      <PrincipalSection />
      <SectionDivider />
      <FacultySection />
      <SectionDivider />
      <FacilitiesSection />
      <SectionDivider />
      <AchievementsSection />
      <SectionDivider />
      <AffiliationSection />
      <SectionDivider />
      <ContactSection />
    </div>
  );
}