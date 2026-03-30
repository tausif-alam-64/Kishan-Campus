/**
 * AboutPage.jsx — Kisan Inter College, Sakhopar
 *
 * Design tokens pulled from global.css:
 *   --primary   : rgb(21,40,61)   → text-primary / bg-primary
 *   --secondary : #213b5b         → text-secondary
 *   --ternary   : #4a5565         → text-ternary  (all <p> body copy)
 *   font-heading: Playfair Display (h1, h2 via @layer base)
 *   font-text   : Inter           (p via @layer base)
 *
 * Animation / card patterns mirror AdmissionsPage (ab- prefix to avoid conflicts).
 *
 * FILE MAP (top → bottom)
 *   1. Imports
 *   2. Style injection
 *   3. School data          ← edit all content here
 *   4. useReveal hook
 *   5. Reveal wrapper
 *   6. Shared primitives    ← Eyebrow, SectionTitle, Card, StatBox …
 *   7. Page sections
 *   8. AboutPage root
 */

import { useEffect, useRef } from "react";
import aboutHero from "../../assets/aboutImg-1.avif";
import {
  Activity, Award, Bell, BookOpen, Building2,
  Calculator, CheckCircle, Clock, Cpu, Droplets,
  Eye, FileText, FlaskConical, Globe, GraduationCap,
  Heart, Info, Mail, MapPin, Monitor,
  Shield, Star, Target, TrendingUp, User, Users,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// 1. STYLE INJECTION  (idempotent — safe to hot-reload)
// ─────────────────────────────────────────────────────────────────────────────

function injectStyles() {
  if (document.getElementById("ab-styles")) return;
  const el = document.createElement("style");
  el.id = "ab-styles";
  el.textContent = `
    /* ── scroll reveal ── */
    .ab-reveal {
      opacity: 0;
      transform: translateY(26px);
      transition:
        opacity  .65s cubic-bezier(.22,1,.36,1),
        transform .65s cubic-bezier(.22,1,.36,1);
    }
    .ab-reveal.in {
      opacity: 1;
      transform: translateY(0);
    }

    /* ── hover lift (white cards) ── */
    .ab-lift {
      transition: transform .22s ease, box-shadow .22s ease, border-color .22s ease;
    }
    .ab-lift:hover {
      transform: translateY(-4px);
      box-shadow: 0 16px 40px rgba(21,40,61,.12) !important;
      border-color: #d97706 !important;
    }

    /* ── button micro-interaction ── */
    .ab-btn {
      transition: transform .15s ease, filter .15s ease;
    }
    .ab-btn:hover {
      transform: translateY(-2px);
      filter: brightness(1.06);
    }

    /* ── gradient-border card (mirrors adm-gb) ── */
    .ab-gb {
      position: relative;
      background: #fff;
    }
    .ab-gb::before {
      content: '';
      position: absolute;
      inset: 0;
      padding: 1.5px;
      background: linear-gradient(135deg, rgba(33,59,91,.22), rgba(21,40,61,.32));
      -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor;
      mask-composite: exclude;
      pointer-events: none;
      border-radius: inherit;
    }

    /* ── timeline vertical line ── */
    .ab-tline {
      background: linear-gradient(to bottom, #d97706, rgba(217,119,6,.05));
    }

    /* ── hero load animation ── */
    @keyframes ab-fadeup {
      from { opacity: 0; transform: translateY(22px); }
      to   { opacity: 1; transform: translateY(0);    }
    }
    .ab-hero { animation: ab-fadeup .8s both; }
  `;
  document.head.appendChild(el);
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. SCHOOL DATA  ←  edit all text / content here
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
  address:  "Sakhopar, Padarauna, Kushinagar\nUttar Pradesh – 274402",
  hours:    "Mon–Sat · 9:00 AM – 3:00 PM",
};

const HERO_STATS = [
  { value: "76+",   label: "Years of Service"  },
  { value: "2000+", label: "Students Enrolled" },
  { value: "30+",   label: "Faculty Members"   },
  
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
  `Founded in 1948 in post-independence India, Kisan Inter College was established to serve
   the farming communities of Kushinagar. The name "Kisan" — meaning farmer — reflects
   the school's enduring mission to uplift rural communities through education.`,
  `Over the decades, the school grew from a small local institution into a government-aided
   senior secondary school, now affiliated with the UP State Board and offering Classes VI
   through XII across Arts and Science streams.`,
  `Today, the college continues its founding mission: providing quality education in Hindi
   and English medium to students from Sakhopar, Padarauna, and the surrounding villages
   of Kushinagar district.`,
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
  { icon: Star,       accent: "#d97706", light: "#fffbeb", border: "#fde68a", title: "Excellence",  desc: "We hold every student and teacher to the highest standards of academic and personal excellence." },
  { icon: Users,      accent: "#0369a1", light: "#f0f9ff", border: "#bae6fd", title: "Inclusivity", desc: "Education is a right, not a privilege. We welcome students from all backgrounds and communities." },
  { icon: Shield,     accent: "#047857", light: "#f0fdf4", border: "#a7f3d0", title: "Integrity",   desc: "Honesty, transparency, and strong moral character form the foundation of our institution." },
  { icon: Heart,      accent: "#be123c", light: "#fff1f2", border: "#fecdd3", title: "Community",   desc: "We are deeply rooted in Kushinagar's rural fabric and serve the families who depend on us." },
  { icon: TrendingUp, accent: "#6d28d9", light: "#faf5ff", border: "#ddd6fe", title: "Growth",      desc: "Every student has unlimited potential. We create the environment to help them discover and reach it." },
  { icon: BookOpen,   accent: "#0f766e", light: "#f0fdfa", border: "#99f6e4", title: "Discipline",  desc: "A structured environment helps students develop focus, responsibility, and resilience." },
];

const PRINCIPAL = {
  name:              "Shri Akhilesh Singh",
  title:             "Principal",
  yearsAtSchool:     "20+ Years",
  qualification:     "M.A., B.Ed.",
  specialisation:    "Education",
  quote:             "Every child who walks through our gates carries the potential to transform their family and community.",
  messageParagraphs: [
    `Welcome to Kisan Inter College, Sakhopar. For over seven decades, this institution has been more
     than a school — it has been the foundation on which thousands of students have built their futures.`,
    `We believe that education's true purpose goes beyond passing examinations. At KIC, we strive to
     develop students who are academically strong, morally grounded, and socially responsible.`,
    `I invite every aspiring student and their family to visit us, experience our campus, and join the
     KIC family. Together, we will build a brighter tomorrow for Kushinagar and beyond.`,
  ],
};

const FACULTY_STATS = [
  { value: "30+",          label: "Total Faculty"        },
  { value: "15+",          label: "Yrs Avg. Experience"  },
  { value: "100%",         label: "UP Board Qualified"   },
  { value: "Hindi", label: "Teaching Medium"      },
];

const DEPARTMENTS = [
  { icon: BookOpen,     accent: "#d97706", light: "#fffbeb", border: "#fde68a", name: "Languages Dept.",     subjects: "Hindi · English · Sanskrit"        },
  { icon: Calculator,   accent: "#0369a1", light: "#f0f9ff", border: "#bae6fd", name: "Mathematics Dept.",   subjects: "Mathematics"                       },
  { icon: FlaskConical, accent: "#047857", light: "#f0fdf4", border: "#a7f3d0", name: "Science Dept.",       subjects: "Physics · Chemistry · Biology"     },
  { icon: Globe,        accent: "#6d28d9", light: "#faf5ff", border: "#ddd6fe", name: "Social Studies Dept.",subjects: "History · Geography · Civics"      },
  { icon: Activity,     accent: "#be123c", light: "#fff1f2", border: "#fecdd3", name: "Physical Education",  subjects: "Sports & Fitness Activities"       },
  { icon: Building2,    accent: "#0f766e", light: "#f0fdfa", border: "#99f6e4", name: "Administration",      subjects: "Office · Accounts · Support Staff" },
];

const FACILITIES = [
  { icon: Monitor,      accent: "#213b5b", name: "Classrooms",           desc: "Spacious, well-ventilated classrooms with natural lighting for effective teaching and focused learning." },
  { icon: FlaskConical, accent: "#047857", name: "Science Laboratories", desc: "Physics, Chemistry and Biology labs fully equipped as per UP Board curriculum standards." },
  { icon: BookOpen,     accent: "#d97706", name: "Library",              desc: "Well-stocked with textbooks, reference books, newspapers and resources in Hindi and English." },
  { icon: Activity,     accent: "#be123c", name: "Playground & Sports",  desc: "Large outdoor ground for cricket, football, kabaddi and athletics. Annual sports day held every year." },
  { icon: Cpu,          accent: "#0369a1", name: "Computer Room",        desc: "Dedicated computer room providing students basic digital education and IT literacy skills." },
  { icon: Building2,    accent: "#6d28d9", name: "Administrative Block", desc: "Principal's office, staff room, accounts office and examination cell — all in one block." },
  { icon: Droplets,     accent: "#0f766e", name: "Drinking Water",       desc: "Clean drinking water facilities available across campus for all students and staff." },
  { icon: Users,        accent: "#db2777", name: "Girls' Common Room",   desc: "A dedicated, safe and comfortable space for female students on campus." },
  { icon: Bell,         accent: "#ea580c", name: "Notice Boards",        desc: "Central notice boards at key campus locations for announcements, results and dates." },
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
  { value: "50000+",      label: "Alumni"        },
  { value: "76+",        label: "Years"         },
  { value: "Kushinagar", label: "Region Served" },
];

const AFFILIATION_CARDS = [
  { icon: GraduationCap, accent: "#d97706", light: "#fffbeb", border: "#fde68a", title: "UP State Board",   subtitle: "Uttar Pradesh Madhyamik Shiksha Parishad", desc: "All Class X and XII examinations conducted by the UP Board under the state education framework." },
  { icon: Building2,     accent: "#047857", light: "#f0fdf4", border: "#a7f3d0", title: "Government-Aided", subtitle: "State Government Recognised",              desc: "Fees are regulated and kept minimal as per state government norms for aided institutions." },
  { icon: FileText,      accent: "#0369a1", light: "#f0f9ff", border: "#bae6fd", title: "UDISE Registered", subtitle: `UDISE Code: ${SCHOOL.udise}`,             desc: "Registered with the Unified District Information System — part of the national school data framework." },
];

const CONTACT_INFO = [
  { icon: MapPin, label: "Address",      value: `Kisan Inter College, Sakhopar\nPadarauna, Kushinagar\nUttar Pradesh – 274402`, href: null },
  { icon: Mail,   label: "Email",        value: SCHOOL.email, href: `mailto:${SCHOOL.email}` },
  { icon: Clock,  label: "Office Hours", value: SCHOOL.hours, href: null },
];

// ─────────────────────────────────────────────────────────────────────────────
// 3. SCROLL REVEAL HOOK
// ─────────────────────────────────────────────────────────────────────────────

function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ob = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add("in"); ob.disconnect(); } },
      { threshold: 0.08 }
    );
    ob.observe(el);
    return () => ob.disconnect();
  }, []);
  return ref;
}

function Reveal({ children, delay = 0, className = "" }) {
  const ref = useReveal();
  return (
    <div
      ref={ref}
      className={`ab-reveal ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. SHARED PRIMITIVES
// ─────────────────────────────────────────────────────────────────────────────

/** Small uppercase label with a leading rule — mirrors AdmissionsPage Eyebrow */
function Eyebrow({ children, light = false }) {
  return (
    <p
      className={`flex items-center gap-2 mb-2.5 uppercase tracking-widest font-bold text-xs ${
        light ? "text-secondary" : "text-gray-400"
      }`}
    >
      <span className={`inline-block w-5 h-px shrink-0 ${light ? "bg-amber-400" : "bg-gray-400"}`} />
      {children}
    </p>
  );
}

/** Eyebrow + H2 group */
function SectionTitle({ eyebrow, title, light = false }) {
  return (
    <div className="mb-10">
      <Eyebrow light={light}>{eyebrow}</Eyebrow>
      <h2
        className={`font-bold leading-tight ${light ? "text-white" : "text-primary"}`}
        style={{ fontSize: "clamp(1.75rem,3.5vw,2.4rem)", lineHeight: 1.18 }}
      >
        {title}
      </h2>
    </div>
  );
}

/** Stat: large value + small label */
function StatBox({ value, label, light = false }) {
  return (
    <div>
      <p
        className={`font-bold leading-none ${light ? "text-gray-200" : "text-primary"}`}
        style={{ fontSize: "clamp(1.6rem,3vw,2rem)", fontFamily: "var(--font-heading)" }}
      >
        {value}
      </p>
      <p className={`text-[0.6rem] uppercase tracking-[0.1em] mt-3 ${light ? "text-white/40" : "text-gray-500"}`}>
        {label}
      </p>
    </div>
  );
}

/** White gradient-border card with hover lift */
function Card({ children, className = "", style = {} }) {
  return (
    <div
      className={`ab-gb ab-lift h-full ${className}`}
      style={{ boxShadow: "0 4px 16px rgba(21,40,61,.07)", border: "1px solid #e5e7eb", ...style }}
    >
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. PAGE SECTIONS
// ─────────────────────────────────────────────────────────────────────────────

// ── §1  HERO ──────────────────────────────────────────────────────────────────
function HeroSection() {
  return (
    <section className="relative overflow-hidden flex items-center min-h-135 bg-third">

  {/* ── geometric background shapes ── */}
  <div aria-hidden className="absolute inset-0 pointer-events-none">
    {/* circles */}
    <div
      className="absolute rounded-full"
      style={{ top: "-180px", right: "-180px", width: "560px", height: "560px", border: "1px solid rgba(251,191,36,.1)" }}
    />
    <div
      className="absolute rounded-full"
      style={{ top: "-90px", right: "-90px", width: "340px", height: "340px", border: "1px solid rgba(251,191,36,.07)" }}
    />
    {/* dot grid */}
    <svg className="absolute bottom-0 left-0 opacity-[0.07]" width="300" height="200" viewBox="0 0 300 200">
      {Array.from({ length: 10 }, (_, row) =>
        Array.from({ length: 15 }, (_, col) => (
          <circle key={`${row}-${col}`} cx={col * 20 + 10} cy={row * 20 + 10} r="1.5" fill="#fbbf24" />
        ))
      )}
    </svg>
    {/* diagonal slice */}
    <div
      className="absolute left-0 right-0"
      style={{ bottom: "-1px", height: "80px", background: "white", clipPath: "polygon(0 100%,100% 100%,100% 40%,0 100%)" }}
    />
  </div>

  <div className="max-w-6xl mx-auto w-full px-6 md:px-12 py-20 md:py-28 relative z-10">
    <div className="grid md:grid-cols-2 gap-14 items-center">

      {/* left — headline */}
      <div>
        {/* badge — matches Admissions green badge pattern */}
        <div
          className="ab-hero inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-6 bg-#213b5b border border-[rgba(34,37,197,0.45)]"
          style={{ animationDelay: ".06s" }}
        >
          <span className="inline-block w-3 h-3 rounded-full bg-primary" />
          <span className="text-primary font-bold uppercase tracking-wider" style={{ fontSize: ".71rem" }}>
            OUR STORY · SINCE 1948
          </span>
        </div>

        <h1
          className="ab-hero font-extrabold text-secondary leading-tight mb-5"
          style={{ fontSize: "clamp(2.6rem,5.5vw,4rem)", lineHeight: 1.06, animationDelay: ".18s" }}
        >
          About<br />
          <span className="text-primary">Kisan Inter<br />College</span>
        </h1>

        <p
          className="ab-hero text-base text-ternary mb-8"
          style={{ animationDelay: ".30s", lineHeight: 1.85 }}
        >
          Rooted in the heart of Kushinagar, Kisan Inter College has stood as a beacon of rural
          education for over seven decades — making quality learning accessible to every student,
          regardless of background.
        </p>

        <div
          className="ab-hero flex  gap-2.5"
          style={{ animationDelay: ".40s" }}
        >
          <a
            href="#history"
            className="ab-btn inline-block items-center gap-2 bg-primary text-white px-13 py-3 text-sm no-underline"
          >
            Our History
          </a>
          <a
            href="#contact"
            className="ab-btn inline-flex items-center gap-2 text-primary px-6 py-3 font-semibold text-sm no-underline shadow-2xl bg-[#f2f4f6] border border-secondary"
          >
            <MapPin size={15} /> Visit Us
          </a>
        </div>

        {/* stats row */}
        <div
          className="ab-hero flex flex-wrap gap-8 pt-6 mt-8 border-t border-white/10"
          style={{ animationDelay: ".52s" }}
        >
          {HERO_STATS.map(({ value, label }) => (
            <StatBox key={label} value={value} label={label}  />
          ))}
        </div>
      </div>

      {/* right — info glass card */}
      <div
        className="ab-hero rounded-2xl overflow-hidden shadow-2xl"
        style={{
          animationDelay: ".34s",
          background: "rgba(255,255,255,.06)",
          border: "1px solid rgba(255,255,255,.11)",
          backdropFilter: "blur(14px)",
        }}
      >
        <div
          className="px-6 py-4 flex items-center gap-2.5"
          style={{ borderBottom: "1px solid rgba(255,255,255,.08)" }}
        >
          <Building2 size={15} className="text-primary" />
          <span className="uppercase tracking-wider font-bold text-secondary text-xs">
            AT A GLANCE
          </span>
        </div>

        {GLANCE_ROWS.map(({ label, value }, i) => (
          <div
            key={label}
            className="flex justify-between items-center gap-3 px-6 py-3"
            style={{ borderBottom: i < GLANCE_ROWS.length - 1 ? "1px solid rgba(255,255,255,.05)" : "none" }}
          >
            <span className="text-xs text-secondary">{label}</span>
            <span className="text-primary font-semibold text-right" style={{ fontSize: ".82rem" }}>
              {value}
            </span>
          </div>
        ))}
      </div>

    </div>
  </div>
</section>
  );
}

// ── §2  HISTORY ───────────────────────────────────────────────────────────────
function HistorySection() {
  return (
    <section id="history" className="bg-white py-20">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <div className="grid md:grid-cols-[55%_45%] gap-16 items-start">

          {/* Left: narrative */}
          <div>
            <Reveal>
              <SectionTitle eyebrow="Our Heritage" title="A Legacy Rooted in Kushinagar's Fields" />
            </Reveal>

            {HISTORY_PARAGRAPHS.map((text, i) => (
              <Reveal key={i} delay={120 + i * 60}>
                <p className="text-ternary text-sm leading-7 mb-4">{text}</p>
              </Reveal>
            ))}

            <Reveal delay={320}>
              <div className="flex flex-wrap gap-8 mt-8 pt-6 border-t border-gray-200">
                {HISTORY_STATS.map(({ value, label }) => (
                  <StatBox key={label} value={value} label={label} />
                ))}
              </div>
            </Reveal>
          </div>

          {/* Right: timeline */}
          <div className="pt-2">
            <div className="relative pl-8">

              {/* Vertical gradient line */}
              <div
                aria-hidden
                className="ab-tline absolute left-0 top-2 bottom-0"
                style={{ width: "1.5px" }}
              />

              {TIMELINE.map(({ year, desc }, i) => (
                <Reveal key={year} delay={i * 80}>
                  <div className="relative mb-8 last:mb-0">
                    {/* Diamond marker */}
                    <div
                      aria-hidden
                      className="absolute bg-white border-2 border-amber-500 rotate-45"
                      style={{ left: "-2.15rem", top: "6px", width: "10px", height: "10px" }}
                    />
                    <p
                      className="font-bold mb-1 text-amber-600"
                      style={{ fontSize: "1.05rem", fontFamily: "var(--font-heading)" }}
                    >
                      {year}
                    </p>
                    <p className="text-ternary text-sm leading-7">{desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

// ── §3  VISION, MISSION & VALUES ──────────────────────────────────────────────
function VisionMissionSection() {
  return (
    <section className="py-20" style={{ background: "#f5f7fa" }}>
      <div className="max-w-6xl mx-auto px-6 md:px-12">

        <Reveal>
          <SectionTitle eyebrow="Our Purpose" title="Vision, Mission & Values" />
        </Reveal>
        <Reveal delay={60}>
          <p className="text-ternary text-sm leading-7 max-w-xl mb-10 -mt-6">
            The principles and values that have guided Kisan Inter College through more than seven decades of service.
          </p>
        </Reveal>

        {/* Vision + Mission */}
        <Reveal>
          <div className="grid md:grid-cols-2 gap-4 mb-4">

            {/* Vision — white */}
            <div
              className="bg-white border rounded-2xl  border-gray-200 p-8 flex flex-col"
              style={{ boxShadow: "0 2px 10px rgba(21,40,61,.06)" }}
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0">
                  <Eye size={18} style={{ color: "#d97706" }} />
                </div>
                <h3 className="font-bold text-primary text-xl">Our Vision</h3>
              </div>
              <p className="text-ternary text-sm leading-7 flex-1">
                To be the leading institution of rural education in Kushinagar — empowering every student
                with knowledge, character, and opportunity, regardless of economic background.
              </p>
              <div className="h-0.5 bg-gradient-to-r from-amber-500 to-transparent mt-6" />
            </div>

            {/* Mission — dark navy */}
            <div
              className="bg-primary rounded-2xl p-8 flex flex-col"
              style={{ boxShadow: "0 8px 32px rgba(21,40,61,.22)" }}
            >
              <div className="flex items-center gap-3 mb-5">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: "rgba(217,119,6,.14)", border: "1px solid rgba(217,119,6,.28)" }}
                >
                  <Target size={18} style={{ color: "#fbbf24" }} />
                </div>
                <h3 className="font-bold text-white text-xl">Our Mission</h3>
              </div>
              <p className="text-sm leading-7 flex-1" style={{ color: "rgba(255,255,255,.58)" }}>
                To deliver quality, inclusive education through dedicated teaching, strong academics, and
                holistic development — preparing students for higher education and life beyond the classroom.
              </p>
              <div className="h-0.5 bg-gradient-to-r from-amber-500 to-transparent mt-6" />
            </div>
          </div>
        </Reveal>

        {/* Values grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {VALUES.map(({ icon: Icon, accent, light, border, title, desc }, i) => (
            <Reveal key={title} delay={i * 55}>
              <Card className="p-6 rounded-xl">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 shrink-0"
                  style={{ background: light, border: `1.5px solid ${border}` }}
                >
                  <Icon size={17} style={{ color: accent }} />
                </div>
                <p
                  className="font-semibold text-primary mb-1.5"
                  style={{ fontSize: "1rem", fontFamily: "var(--font-heading)" }}
                >
                  {title}
                </p>
                <p className="text-ternary text-sm leading-7">{desc}</p>
              </Card>
            </Reveal>
          ))}
        </div>

      </div>
    </section>
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
    <section className="bg-white py-20">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <div className="grid md:grid-cols-[2fr_3fr] gap-14 items-start">

          {/* Left: profile card */}
          <Reveal>
            <div
              className="bg-primary overflow-hidden rounded-xl"
              style={{ boxShadow: "0 8px 32px rgba(21,40,61,.22)" }}
            >
              <div className="h-1 bg-linear-to-r from-green-600 via-green-400 to-green-600" />
              <div className="p-8">

                {/* Avatar */}
                <div className="flex flex-col items-center text-center mb-7">
                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center mb-4 border-2 border-white/50"
                    
                  >
                    <User size={32} className="text-white/80" />
                  </div>
                  <p
                    className="font-bold text-white/80 text-xl mb-1"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {PRINCIPAL.name}
                  </p>
                  <p className="text-white/70 uppercase tracking-widest font-bold text-xs">
                    {PRINCIPAL.title}
                  </p>
                </div>

                <div className="h-px mb-5" style={{ background: "rgba(255,255,255,.09)" }} />

                {details.map(({ label, value }) => (
                  <div key={label} className="flex justify-between mb-3.5 last:mb-0">
                    <span className="text-xs" style={{ color: "rgba(255,255,255,.35)" }}>{label}</span>
                    <span className="text-sm font-semibold text-white">{value}</span>
                  </div>
                ))}

                {/* Quote */}
                <div className="mt-7 pl-4" style={{ borderLeft: "3px solid gray" }}>
                  <p
                    className="text-sm italic leading-7"
                    style={{ color: "rgba(255,255,255,.52)", fontFamily: "var(--font-heading)" }}
                  >
                    "{PRINCIPAL.quote}"
                  </p>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Right: message */}
          <div>
            <Reveal>
              <SectionTitle eyebrow="Leadership" title="Principal's Message" />
            </Reveal>
            {PRINCIPAL.messageParagraphs.map((text, i) => (
              <Reveal key={i} delay={120 + i * 80}>
                <p className="text-ternary text-sm leading-7 mb-5">{text}</p>
              </Reveal>
            ))}
            <Reveal delay={380}>
              <p
                className="text-secondary italic text-lg mt-2"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                — Principal, Kisan Inter College
              </p>
            </Reveal>
          </div>

        </div>
      </div>
    </section>
  );
}

// ── §5  FACULTY & STAFF ───────────────────────────────────────────────────────
function FacultySection() {
  return (
    <section className="py-20" style={{ background: "#f5f7fa" }}>
      <div className="max-w-6xl mx-auto px-6 md:px-12">

        <Reveal>
          <SectionTitle eyebrow="Our Team" title="Faculty & Staff" />
        </Reveal>
        <Reveal delay={60}>
          <p className="text-ternary text-sm leading-7 max-w-xl mb-10 -mt-6">
            Our team of dedicated educators brings decades of combined experience to the classroom,
            committed to academic excellence and the holistic growth of every student.
          </p>
        </Reveal>

        {/* Stats strip */}
        <Reveal delay={100}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {FACULTY_STATS.map(({ value, label }) => (
              <div
                key={label}
                className="bg-white border border-gray-200 p-5"
                style={{ boxShadow: "0 2px 8px rgba(21,40,61,.05)" }}
              >
                <p
                  className="font-bold text-primary leading-none"
                  style={{ fontSize: "1.8rem", fontFamily: "var(--font-heading)" }}
                >
                  {value}
                </p>
                <p className="text-xs uppercase tracking-wider text-gray-400 mt-1.5">{label}</p>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Department cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {DEPARTMENTS.map(({ icon: Icon, accent, light, border, name, subjects }, i) => (
            <Reveal key={name} delay={i * 55}>
              <Card className="p-6">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 shrink-0"
                  style={{ background: light, border: `1.5px solid ${border}` }}
                >
                  <Icon size={17} style={{ color: accent }} />
                </div>
                <p
                  className="font-semibold text-primary mb-1.5"
                  style={{ fontSize: "1rem", fontFamily: "var(--font-heading)" }}
                >
                  {name}
                </p>
                <p className="text-ternary text-sm">{subjects}</p>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── §6  INFRASTRUCTURE & FACILITIES ──────────────────────────────────────────
function FacilitiesSection() {
  return (
    <section className="bg-white py-20">
      <div className="max-w-6xl mx-auto px-6 md:px-12">

        <Reveal>
          <SectionTitle eyebrow="Campus" title="Infrastructure & Facilities" />
        </Reveal>
        <Reveal delay={60}>
          <p className="text-ternary text-sm leading-7 max-w-xl mb-10 -mt-6">
            Our campus in Sakhopar provides a safe, stimulating learning environment — from
            well-equipped classrooms to dedicated science labs.
          </p>
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FACILITIES.map(({ icon: Icon, accent, name, desc }, i) => (
            <Reveal key={name} delay={i * 45}>
              {/* Use slightly off-white bg — mirrors adm-gb card layout */}
              <Card className="p-6" style={{ background: "#f9fafb" }}>
                <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center mb-4 shrink-0">
                  <Icon size={16} style={{ color: accent }} />
                </div>
                <p
                  className="font-semibold text-primary mb-2"
                  style={{ fontFamily: "var(--font-heading)", fontSize: "1rem" }}
                >
                  {name}
                </p>
                <p className="text-ternary text-sm leading-7">{desc}</p>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── §7  ACHIEVEMENTS & RECOGNITION ───────────────────────────────────────────
function AchievementsSection() {
  return (
    <section className="py-20" style={{ background: "#f5f7fa" }}>
      <div className="max-w-6xl mx-auto px-6 md:px-12">

        <Reveal>
          <SectionTitle eyebrow="Milestones" title="Achievements & Recognition" />
        </Reveal>

        <div className="grid md:grid-cols-2 gap-12 items-start">

          {/* Checklist */}
          <div className="flex flex-col gap-2.5">
            {ACHIEVEMENTS.map((item, i) => (
              <Reveal key={i} delay={i * 60}>
                <div
                  className="ab-lift flex gap-3 items-start bg-white border border-gray-200 p-4"
                  style={{ boxShadow: "0 2px 8px rgba(21,40,61,.04)" }}
                >
                  <CheckCircle size={15} className="shrink-0 mt-0.5" style={{ color: "#d97706" }} />
                  <p className="text-ternary text-sm leading-7">{item}</p>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Dark recognition card */}
          <Reveal delay={80}>
            <div
              className="bg-primary overflow-hidden"
              style={{ boxShadow: "0 8px 32px rgba(21,40,61,.22)" }}
            >
              <div className="h-0.5 bg-gradient-to-r from-amber-700 via-amber-400 to-amber-700" />
              <div className="p-10">
                <Award size={36} className="mb-5" style={{ color: "#d97706" }} />
                <h3
                  className="font-bold text-white mb-4 leading-tight"
                  style={{ fontSize: "clamp(1.8rem,3vw,2.4rem)", fontFamily: "var(--font-heading)" }}
                >
                  76+ Years<br />of Trust
                </h3>
                <p
                  className="text-sm leading-7 mb-8"
                  style={{ color: "rgba(255,255,255,.52)" }}
                >
                  Generations of families in Kushinagar have chosen Kisan Inter College as
                  the foundation of their children's education. Our legacy is built not on
                  awards, but on the success of every student who has passed through our gates.
                </p>
                <div
                  className="flex flex-wrap gap-8 pt-6"
                  style={{ borderTop: "1px solid rgba(255,255,255,.09)" }}
                >
                  {RECOGNITION_STATS.map(({ value, label }) => (
                    <StatBox key={label} value={value} label={label} light />
                  ))}
                </div>
              </div>
            </div>
          </Reveal>

        </div>
      </div>
    </section>
  );
}

// ── §8  AFFILIATION & ACCREDITATION ──────────────────────────────────────────
function AffiliationSection() {
  return (
    <section className="bg-white py-20">
      <div className="max-w-6xl mx-auto px-6 md:px-12">

        <Reveal>
          <SectionTitle eyebrow="Official Status" title="Affiliation & Accreditation" />
        </Reveal>

        <div className="grid sm:grid-cols-3 gap-5 mb-5">
          {AFFILIATION_CARDS.map(({ icon: Icon, accent, light, border, title, subtitle, desc }, i) => (
            <Reveal key={title} delay={i * 80}>
              <Card className="p-7">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 shrink-0"
                  style={{ background: light, border: `1.5px solid ${border}` }}
                >
                  <Icon size={20} style={{ color: accent }} />
                </div>
                <h3
                  className="font-bold text-primary mb-1"
                  style={{ fontSize: "1.15rem", fontFamily: "var(--font-heading)" }}
                >
                  {title}
                </h3>
                <p className="uppercase tracking-wider font-bold text-amber-600 mb-3" style={{ fontSize: ".62rem" }}>
                  {subtitle}
                </p>
                <p className="text-ternary text-sm leading-7">{desc}</p>
              </Card>
            </Reveal>
          ))}
        </div>

        {/* Info notice — same amber style as AdmissionsPage */}
        <Reveal delay={200}>
          <div
            className="bg-amber-50 border border-amber-200 px-5 py-4 flex gap-3 items-start"
            style={{ borderRadius: "0.75rem" }}
          >
            <Info size={15} className="shrink-0 mt-0.5" style={{ color: "#92400e" }} />
            <p className="text-sm leading-7" style={{ color: "#78350f" }}>
              For affiliation queries or official document verification, please contact the school office
              during working hours —{" "}
              <strong>Monday to Saturday, 9:00 AM to 3:00 PM</strong>.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ── §9  CONTACT CTA ───────────────────────────────────────────────────────────
function ContactSection() {
  return (
    <section id="contact" className="bg-primary py-20 relative overflow-hidden">

      {/* Amber top bar */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-700 via-amber-400 to-amber-700" />

      {/* Rings */}
      <div aria-hidden className="absolute pointer-events-none" style={{ top: "-120px", right: "-120px", width: "440px", height: "440px", borderRadius: "50%", border: "1px solid rgba(251,191,36,.07)" }} />
      <div aria-hidden className="absolute pointer-events-none" style={{ bottom: "-80px", left: "-80px", width: "320px", height: "320px", borderRadius: "50%", border: "1px solid rgba(251,191,36,.06)" }} />

      <div className="max-w-6xl mx-auto px-6 md:px-12 relative z-10">
        <div className="grid md:grid-cols-5 gap-8">

          {/* Contact details — 3 cols, mirrors adm-gb contact card */}
          <Reveal delay={60} className="md:col-span-3">
            <div
              className="overflow-hidden h-full"
              style={{
                background: "rgba(255,255,255,.04)",
                border: "1px solid rgba(255,255,255,.09)",
                backdropFilter: "blur(12px)",
                borderRadius: "1rem",
              }}
            >
              <div
                className="px-6 py-4 flex items-center gap-2.5"
                style={{ borderBottom: "1px solid rgba(255,255,255,.07)" }}
              >
                <Building2 size={14} style={{ color: "#fbbf24" }} />
                <span className="text-amber-400 uppercase tracking-widest font-bold text-xs">
                  School Office
                </span>
              </div>
              <div className="p-6 flex flex-col gap-6">
                {CONTACT_INFO.map(({ icon: Icon, label, value, href }) => (
                  <div key={label} className="flex gap-4">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: "rgba(217,119,6,.12)", border: "1px solid rgba(217,119,6,.22)" }}
                    >
                      <Icon size={15} style={{ color: "#fbbf24" }} />
                    </div>
                    <div>
                      <p
                        className="uppercase tracking-widest font-bold text-xs mb-1"
                        style={{ color: "rgba(255,255,255,.35)" }}
                      >
                        {label}
                      </p>
                      {href ? (
                        <a href={href} className="text-sm font-semibold no-underline" style={{ color: "#fbbf24" }}>
                          {value}
                        </a>
                      ) : (
                        <p className="text-sm leading-6 whitespace-pre-line text-white">{value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* CTA — 2 cols */}
          <Reveal delay={120} className="md:col-span-2">
            <div className="flex flex-col gap-3 h-full">

              {/* Visit card */}
              <div
                className="flex-1 p-7 relative overflow-hidden"
                style={{
                  background: "rgba(255,255,255,.06)",
                  border: "1px solid rgba(255,255,255,.10)",
                  borderRadius: "1rem",
                }}
              >
                <div aria-hidden className="absolute pointer-events-none" style={{ top: "-24px", right: "-24px", width: "110px", height: "110px", borderRadius: "50%", border: "1px solid rgba(251,191,36,.12)" }} />
                <div className="flex items-center gap-2.5 mb-3">
                  <CheckCircle size={20} style={{ color: "#4ade80" }} />
                  <h3
                    className="text-white font-bold text-xl"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    Come Visit Us
                  </h3>
                </div>
                <p className="text-sm leading-7 mb-5" style={{ color: "rgba(255,255,255,.55)" }}>
                  Our gates are open Monday to Saturday, 9 AM to 3 PM. No appointment needed — all are welcome.
                </p>
                <a
                  href="https://www.google.com/maps/search/Kisan+Inter+College+Sakhopar+Padarauna+Kushinagar+274402"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ab-btn flex items-center justify-center gap-2 bg-amber-500 text-primary font-bold text-sm py-3 no-underline"
                  style={{ borderRadius: "0.75rem" }}
                >
                  <MapPin size={15} /> Get Directions
                </a>
              </div>

              {/* Walk-in note */}
              <div
                className="flex gap-2.5 items-start p-4"
                style={{ background: "rgba(74,222,128,.08)", border: "1px solid rgba(74,222,128,.22)", borderRadius: "0.75rem" }}
              >
                <Info size={14} className="shrink-0 mt-0.5" style={{ color: "#4ade80" }} />
                <p className="text-sm leading-7" style={{ color: "rgba(255,255,255,.60)" }}>
                  <strong className="text-white">No appointment needed.</strong> Walk in during school hours on any working day.
                </p>
              </div>

            </div>
          </Reveal>

        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. PAGE ROOT
// ─────────────────────────────────────────────────────────────────────────────

export default function AboutPage() {
  useEffect(() => { injectStyles(); }, []);

  return (
    <div style={{ background: "#f5f7fa", color: "var(--primary)" }}>
      <HeroSection />
      <div className="h-px" />
      <HistorySection />
      <div className="h-px bg-linear-to-r from-transparent via-slate-300 to-transparent" />
      <VisionMissionSection />
      <div className="h-px bg-linear-to-r from-transparent via-slate-300 to-transparent" />
      <PrincipalSection />
      <div className="h-px bg-linear-to-r from-transparent via-slate-300 to-transparent" />
      <FacultySection />
      <div className="h-px bg-linear-to-r from-transparent via-slate-300 to-transparent" />
      <FacilitiesSection />
      <div className="h-px bg-linear-to-r from-transparent via-slate-300 to-transparent" />
      <AchievementsSection />
      <div className="h-px bg-linear-to-r from-transparent via-slate-300 to-transparent" />
      <AffiliationSection />
      <div className="h-px bg-linear-to-r from-transparent via-slate-300 to-transparent" />
      <ContactSection />
    </div>
  );
}