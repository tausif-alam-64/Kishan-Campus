import { useState, useEffect, useRef } from "react";
import {
  AlertTriangle, MapPin, Mail, Clock, FileText, CreditCard,
  User, Camera, Award, Calendar, CheckCircle, Building2,
  GraduationCap, Microscope, Palette, ExternalLink, Info,
  ChevronDown, ArrowRight, BookOpen, Atom, PenLine,FlaskConical,Landmark
} from "lucide-react";
import { NavLink } from "react-router-dom";

/* ────────────────────────────────────────────
   INJECT STYLES  (animations + fonts)
──────────────────────────────────────────── */
function injectStyles() {
  if (document.getElementById("adm-s")) return;

  const el = document.createElement("style");
  el.id = "adm-s";

  el.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,700;0,800;1,600&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');

    :root{
      --primary: rgb(21,40,61);
      --secondary: #213b5b;
    }

    .adm-root{
      font-family: 'Plus Jakarta Sans', sans-serif;
    }

    .adm-serif{
      font-family: 'Playfair Display', serif;
    }

    /* reveal animation */

    .adm-reveal{
      opacity:0;
      transform:translateY(28px);
      transition:
        opacity .6s cubic-bezier(.22,1,.36,1),
        transform .6s cubic-bezier(.22,1,.36,1);
    }

    .adm-reveal.in{
      opacity:1;
      transform:translateY(0);
    }

    /* hover lift */

    .adm-lift{
      transition:transform .22s ease, box-shadow .22s ease;
    }

    .adm-lift:hover{
      transform:translateY(-4px);
      box-shadow:0 16px 40px rgba(21,40,61,.13) !important;
    }

    /* step cards */

    .adm-step{
      transition:border-color .2s, box-shadow .2s;
    }

    .adm-step:hover{
      box-shadow:0 6px 22px rgba(21,40,61,.09);
    }

    .adm-step-icon{
      transition:background .25s;
    }

    .adm-chevron{
      transition:transform .25s cubic-bezier(.22,1,.36,1);
    }

    /* button behaviour only (no forced color) */

    .adm-btn{
      transition:transform .15s ease, filter .15s ease;
    }

    .adm-btn:hover{
      transform:translateY(-2px);
      filter:brightness(1.05);
    }

    /* GREEN LIVE DOT PULSE */

    @keyframes adm-dot-pulse{
  0%,100%{
    box-shadow:0 0 0 0 rgba(34,197,94,.6);
  }
  60%{
    box-shadow:0 0 0 7px rgba(34,197,94,0);
  }
}

    .adm-dot{
      animation:adm-dot-pulse 2s ease infinite;
    }

    /* gradient border card */

    .adm-gb{
      position:relative;
      border-radius:16px;
      background:#fff;
    }

    .adm-gb::before{
      content:'';
      position:absolute;
      inset:0;
      border-radius:16px;
      padding:1.5px;

      background:linear-gradient(
        135deg,
        rgba(33,59,91,.25),
        rgba(21,40,61,.35)
      );

      -webkit-mask:
        linear-gradient(#fff 0 0) content-box,
        linear-gradient(#fff 0 0);

      -webkit-mask-composite:xor;
      mask-composite:exclude;

      pointer-events:none;
    }

    /* live badge */

    .adm-live-badge{
      display:inline-flex;
      align-items:center;
      gap:8px;
      padding:4px 12px;
      border-radius:999px;

      background:rgba(33,59,91,.10);
      border:1px solid rgba(33,59,91,.25);

      color:var(--primary);
      font-weight:600;
      font-size:13px;
    }
  `;

  document.head.appendChild(el);
}

/* ────────────────────────────────────────────
   SCROLL REVEAL HOOK
──────────────────────────────────────────── */
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
  const r = useReveal();
  return (
    <div ref={r} className={`adm-reveal ${className} tracking-wide`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

/* ────────────────────────────────────────────
   DATA
──────────────────────────────────────────── */
const STREAMS = [
  {
    id: "middle",
    icon: BookOpen,
    label: "General",
    full: "Middle School Education",
    subjects: ["Hindi", "English", "Mathematics", "Science", "Social Science", "Sanskrit"],
    accent: "#7c3aed",
    light: "#faf5ff",
    border: "#ddd6fe",
    tag: "Class VI – VIII",
  },
  {
    id: "secondary-arts",
    icon: PenLine,
    label: "Arts",
    full: "Secondary — Arts",
    subjects: ["Hindi", "English", "Mathematics", "Social Science", "Sanskrit", "Science"],
    accent: "#b45309",
    light: "#fffbeb",
    border: "#fde68a",
    tag: "Class IX – X",
  },
  {
    id: "secondary-science",
    icon: FlaskConical,
    label: "Science",
    full: "Secondary — Science",
    subjects: ["Hindi", "English", "Mathematics", "Science", "Social Science"],
    accent: "#0369a1",
    light: "#f0f9ff",
    border: "#bae6fd",
    tag: "Class IX – X",
  },
  {
    id: "arts",
    icon: Landmark,
    label: "Arts",
    full: "Senior Secondary — Arts & Humanities",
    subjects: ["History", "Geography", "Civics", "Hindi", "English", "Sanskrit"],
    accent: "#b45309",
    light: "#fffbeb",
    border: "#fde68a",
    tag: "Class XI – XII",
  },
  {
    id: "pcm",
    icon: Atom,
    label: "Science (PCM)",
    full: "Senior Secondary — Math Stream",
    subjects: ["Physics", "Chemistry", "Mathematics", "English", "Hindi"],
    accent: "#0369a1",
    light: "#f0f9ff",
    border: "#bae6fd",
    tag: "Class XI – XII",
  },
  {
    id: "pcb",
    icon: Microscope,
    label: "Science (PCB)",
    full: "Senior Secondary — Biology Stream",
    subjects: ["Physics", "Chemistry", "Biology", "English", "Hindi"],
    accent: "#047857",
    light: "#f0fdf4",
    border: "#a7f3d0",
    tag: "Class XI – XII",
  },
]

const STEPS = [
  {
    n: "01",
    title: "Visit the School Office",
    body: "Come to the admission counter in person — Monday to Saturday, 9:00 AM to 3:00 PM. No prior appointment is needed. Our staff will assist you.",
  },
  {
    n: "02",
    title: "Collect the Admission Form",
    body: "Pick up the official admission form from the counter free of cost. Read all instructions before filling.",
  },
  {
    n: "03",
    title: "Fill & Submit with Documents",
    body: "Fill every field carefully. Attach photocopies of all required documents. Originals must be brought for on-spot verification.",
  },
  {
    n: "04",
    title: "Document Verification",
    body: "School staff will cross-verify your submitted documents. A brief informal interaction may be conducted if required.",
  },
  {
    n: "05",
    title: "Confirm Admission & Pay Fees",
    body: "Once approved, pay the applicable fees as per UP Board and institutional norms to confirm your seat.",
  },
];

const DOCS = [
  { icon: FileText,   label: "Previous Class Marksheet",  sub: "Original + photocopy" },
  { icon: Award,      label: "Transfer Certificate (TC)", sub: "From previous school" },
  { icon: User,       label: "Aadhaar Card",              sub: "Student's Aadhaar copy" },
  { icon: Camera,     label: "Passport Size Photos",      sub: "2–4 recent photographs" },
];

const DATES = [
  { icon: BookOpen,      label: "Form Availability",    note: "Session 2025–26" },
  { icon: Calendar,      label: "Last Submission Date", note: "Check notice board" },
  { icon: GraduationCap, label: "Classes Commence",     note: "Per UP Board calendar" },
];

/* ────────────────────────────────────────────
   SMALL SHARED COMPONENTS
──────────────────────────────────────────── */
function Eyebrow({ children }) {
  return (
    <p className="flex items-center gap-2 mb-2.5 uppercase tracking-widest text-gray-500 font-bold text-xs">
      <span className="inline-block w-5 h-0.5 bg-gray-500 rounded-sm shrink-0" />
      {children}
    </p>
  );
}

function SectionTitle({ eyebrow, title }) {
  return (
    <div className="mb-10">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2
        className="adm-serif font-bold text-primary "
        style={{ fontSize: "clamp(1.75rem,3.5vw,2.4rem)", lineHeight: 1.18 }}
      >
        {title}
      </h2>
    </div>
  );
}

/* ════════════════════════════════════════════
   MAIN PAGE
════════════════════════════════════════════ */
export default function AdmissionsPage() {
  const [openStep, setOpenStep] = useState(null);
  useEffect(() => { injectStyles(); }, []);

  return (
    <div className="adm-root" style={{ background: "#f5f7fa", color: "var(--primary)" }}>

      {/* ══════════════ HERO ══════════════ */}
      <section
        className="relative overflow-hidden flex items-center min-h-135 bg-[#e6ecf1]"
        
      >

        {/* ── geometric background shapes ── */}
        <div aria-hidden className="absolute inset-0 pointer-events-none">
          {/* amber top rule */}
          <div
            className="absolute top-0 left-0 right-0 h-0.75 bg-[linear-gradient(90deg,#d97706,#fbbf24 50%,#d97706)]"
          />
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
          <svg className="absolute bottom-0 left-0" style={{ opacity: 0.07 }} width="300" height="200" viewBox="0 0 300 200">
            {Array.from({ length: 10 }, (_, row) =>
              Array.from({ length: 15 }, (_, col) => (
                <circle key={`${row}-${col}`} cx={col * 20 + 10} cy={row * 20 + 10} r="1.5" fill="#fbbf24" />
              ))
            )}
          </svg>
          {/* diagonal slice */}
          <div
            className="absolute left-0 right-0"
            style={{ bottom: "-1px", height: "80px", background: "#f5f7fa", clipPath: "polygon(0 100%,100% 100%,100% 40%,0 100%)" }}
          />
        </div>

        <div className="max-w-6xl mx-auto w-full px-6 md:px-12 py-20 md:py-28 relative">
          <div className="grid md:grid-cols-2 gap-14 items-center">

            {/* left — headline */}
            <div>
              {/* live badge */}
              <div
                className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-6 bg-[rgba(34,197,94,0.18)] border border-[rgba(34,197,94,0.45)]"
              >
                <span className="adm-dot inline-block w-3 h-3 rounded-full bg-green-500" />
                <span className="text-green-600 font-bold uppercase tracking-wider" style={{ fontSize: ".71rem" }}>
                  ADMISSIONS OPEN · 2025–26
                </span>
              </div>

              <h1
                className="adm-serif font-extrabold md:text-7xl text-secondary leading-tight mb-5"
                style={{ fontSize: "clamp(2.6rem,5.5vw,4rem)", lineHeight: 1.06 }}
              >
                Your Future<br />
                <span className="md:text-7xl text-primary leading-tight">Begins Here</span>
              </h1>

              <p className="text-base mb-8 text-ternary">
                Kisan Inter College, Sakhopar has been nurturing students from Kushinagar's rural heartland since{" "}
                <strong className="text-ternary">1948</strong>. Join us for Class XI & XII — UP Board affiliated.
              </p>

              <div className="flex flex-wrap gap-2.5">
                <a
                  href="#process"
                  className="adm-btn inline-flex items-center gap-2 bg-primary text-white px-10 py-3 font-bold text-sm no-underline"
                >
                  How to Apply <ArrowRight size={15} />
                </a>
                <a
                  href="#contact"
                  className="adm-btn inline-flex items-center gap-2 text-primary px-6 py-3 font-semibold  text-sm no-underline shadow-2xl bg-[#f2f4f6] border border-secondary"
                >
                  <MapPin size={15} /> Get Directions
                </a>
              </div>
            </div>

            {/* right — info glass card */}
            <div>
              <div
                className="rounded-2xl overflow-hidden shadow-2xl"
                style={{
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
                  <span
                    className="uppercase tracking-wider font-bold font-[.68rem] text-secondary"
                  >
                    SCHOOL AT A GLANCE
                  </span>
                </div>
                {[
                  ["Board",    "UP State Board"],
                  ["Category", "Government-Aided"],
                  ["Medium",   "Hindi & English"],
                  ["Classes",  "XI & XII"],
                  ["Streams",  "Arts · Sci (PCM) · Sci (PCB)"],
                  ["Location", "Sakhopar, Kushinagar"],
                  ["UDISE",    "09590100202"],
                  ["Est.",     "1948"],
                ].map(([k, v], i) => (
                  <div
                    key={k}
                    className="flex justify-between items-center gap-3 px-6 py-3"
                    style={{ borderBottom: i < 7 ? "1px solid rgba(255,255,255,.05)" : "none" }}
                  >
                    <span className="text-xs text-secondary">{k}</span>
                    <span className="text-primary font-semibold text-right" style={{ fontSize: ".82rem" }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════ OFFLINE NOTICE ══════════════ */}
      <div className="max-w-6xl mx-auto px-6 md:px-12 -mt-2 relative z-10">
        <Reveal>
          <div
            className="bg-amber-50 border border-amber-300 rounded-2xl px-6 py-5 flex gap-3.5 items-start"
            style={{ boxShadow: "0 4px 20px rgba(217,119,6,.12)" }}
          >
            <div className="bg-amber-600 rounded-xl p-2.5 shrink-0">
              <AlertTriangle size={18} color="#fff" />
            </div>
            <div>
              <p className="font-bold text-amber-800 text-sm mb-1">
                Offline Admissions Only — No Online Registration Available
              </p>
              <p className="text-amber-900 text-sm leading-7">
                All admissions are processed <strong>in person at the school office</strong>. Students must visit during working hours (Mon–Sat, 9 AM–3 PM) with all original documents. No walk-in appointment is required.
              </p>
            </div>
          </div>
        </Reveal>
      </div>

      {/* ══════════════ MAIN CONTENT ══════════════ */}
      <main className="max-w-6xl mx-auto px-6 md:px-12 py-16 flex flex-col gap-20">

        {/* ── STREAMS ── */}
        <section>
          <Reveal>
            <SectionTitle eyebrow="Courses Offered" title="Choose Your Stream" />
          </Reveal>

          <div className="grid md:grid-cols-3 gap-5">
            {STREAMS.map((s, i) => (
              <Reveal key={s.id} delay={i * 80}>
                <div
                  className="adm-gb adm-lift overflow-hidden h-full"
                  style={{ boxShadow: "0 4px 16px rgba(21,40,61,.07)" }}
                >
                  <div className="h-1.5" style={{ background: s.accent }} />
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className="rounded-xl flex items-center justify-center shrink-0"
                        style={{ width: "46px", height: "46px", background: s.light, border: `1.5px solid ${s.border}` }}
                      >
                        <s.icon size={20} color={s.accent} />
                      </div>
                      <div>
                        <span
                          className="inline-block rounded-full px-2 py-0.5 mb-1 font-bold uppercase tracking-wider border"
                          style={{ background: s.light, borderColor: s.border, color: s.accent, fontSize: ".65rem" }}
                        >
                          CLASS XI & XII
                        </span>
                        <p
                          className="font-bold leading-tight tracking-wide text-xl text-primary"
                          
                        >
                          {s.full}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {s.subjects.map(sub => (
                        <span
                          key={sub}
                          className="bg-slate-100 font-medium rounded-md px-2.5 py-1 text-xs"
                          style={{ color: "var(--ternary)" }}
                        >
                          {sub}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={260}>
            <div className="mt-4 flex items-start gap-2.5 px-3.5 py-3 bg-white rounded-xl border border-gray-200">
              <Info size={14} color="var(--ternary)" className="mt-0.5 shrink-0" />
              <p className="leading-7" style={{ color: "var(--ternary)", fontSize: ".8rem" }}>
                Stream allocation is subject to seat availability and UP Board norms. Contact the school office to confirm subject combinations for the current session.
              </p>
            </div>
          </Reveal>
        </section>

        {/* divider */}
        <div className="h-px bg-linear-to-r from-transparent via-slate-300 to-transparent" />

        {/* ── PROCESS ── */}
        <section id="process">
          <Reveal>
            <SectionTitle eyebrow="How to Apply" title="Step-by-Step Process" />
          </Reveal>

          <div className="flex flex-col gap-1.5">
            {STEPS.map((step, i) => {
              const isOpen = openStep === i;
              const isDone = openStep !== null && i < openStep;
              return (
                <Reveal key={i} delay={i * 50}>
                  <div className="flex gap-4 items-start">
                    {/* left: number + connector */}
                    <div className="flex flex-col items-center pt-4 shrink-0">
                      <div
                        className="adm-step-icon w-11 h-11 rounded-full flex items-center justify-center cursor-pointer shrink-0"
                        onClick={() => setOpenStep(isOpen ? null : i)}
                        style={{
                          background: isOpen ? "#d97706" : isDone ? "#16a34a" : "var(--primary)",
                          boxShadow: isOpen ? "0 0 0 5px rgba(217,119,6,.18)" : "none",
                        }}
                      >
                        {isDone
                          ? <CheckCircle size={18} color="#fff" />
                          : <span className="text-white font-bold text-xs">{step.n}</span>
                        }
                      </div>
                      {i < STEPS.length - 1 && (
                        <div
                          className="w-0.5 flex-grow mt-1.5"
                          style={{
                            minHeight: "24px",
                            background: isOpen ? "linear-gradient(to bottom,#d97706,transparent)" : "#e2e8f0",
                          }}
                        />
                      )}
                    </div>

                    {/* right: card */}
                    <div
                      className="adm-step flex-1 bg-white rounded-2xl cursor-pointer mb-1.5"
                      onClick={() => setOpenStep(isOpen ? null : i)}
                      style={{
                        border: `1.5px solid ${isOpen ? "#d97706" : "#e5e7eb"}`,
                        padding: "1.05rem 1.35rem",
                        boxShadow: isOpen ? "0 6px 24px rgba(217,119,6,.1)" : "0 1px 4px rgba(0,0,0,.04)",
                      }}
                    >
                      <div className="flex justify-between items-center">
                        <p className="font-semibold text-sm" style={{ color: "var(--primary)" }}>{step.title}</p>
                        <ChevronDown
                          size={16}
                          color={isOpen ? "#d97706" : "#94a3b8"}
                          className="adm-chevron shrink-0"
                          style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0)" }}
                        />
                      </div>
                      {isOpen && (
                        <p
                          className="text-sm leading-7 mt-2.5 pt-2.5 border-t border-slate-100"
                          style={{ color: "var(--ternary)" }}
                        >
                          {step.body}
                        </p>
                      )}
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </section>

        {/* divider */}
        <div className="h-px bg-linear-to-r from-transparent via-slate-300 to-transparent" />

        {/* ── DOCUMENTS ── */}
        <section>
          <Reveal>
            <SectionTitle eyebrow="Checklist" title="Documents Required" />
          </Reveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {DOCS.map((doc, i) => (
              <Reveal key={i} delay={i * 60}>
                <div
                  className="adm-lift adm-gb flex gap-3.5 items-start p-5"
                  style={{ boxShadow: "0 2px 10px rgba(0,0,0,.05)" }}
                >
                  <div className="w-10 h-10 rounded-xl bg-green-50 border border-green-200 flex items-center justify-center shrink-0">
                    <doc.icon size={17} color="#16a34a" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm mb-0.5 text-primary">{doc.label}</p>
                    <p className="text-slate-400 text-xs">{doc.sub}</p>
                  </div>
                </div>
              </Reveal>
            ))}
            {/* tip */}
            <Reveal delay={320}>
              <div className="flex gap-3.5 items-start p-5 bg-blue-50 border border-blue-200 rounded-2xl">
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                  <Info size={17} color="#2563eb" />
                </div>
                <p className="text-blue-800 leading-7" style={{ fontSize: ".82rem" }}>
                  Bring <strong>original documents</strong> along with photocopies. Originals are returned after same-day verification.
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* divider */}
        <div className="h-px bg-linear-to-r from-transparent via-slate-300 to-transparent" />

        {/* ── FEE + DATES (2-col) ── */}
        <div className="grid md:grid-cols-2 gap-10">

          {/* fee */}
          <section>
            <Reveal><SectionTitle eyebrow="Fees" title="Fee Structure" /></Reveal>
            <Reveal delay={60}>
              <div
                className="rounded-2xl p-8 relative overflow-hidden"
                style={{ background: "var(--primary)", boxShadow: "0 8px 32px rgba(21,40,61,.2)" }}
              >
                <div
                  className="absolute rounded-full"
                  style={{ bottom: "-50px", right: "-50px", width: "190px", height: "190px", border: "1px solid rgba(251,191,36,.12)" }}
                />
                <div
                  className="absolute rounded-full"
                  style={{ bottom: "-20px", right: "-20px", width: "120px", height: "120px", background: "rgba(251,191,36,.06)" }}
                />
                <Eyebrow>Government-Aided Institution</Eyebrow>
                <p className="text-sm leading-7 mb-6" style={{ color: "rgba(255,255,255,.72)" }}>
                  Kisan Inter College is a <strong className="text-white">government-aided school</strong>, so fees are minimal and are set as per UP Board and institutional norms. Exact details are displayed on the school notice board and at the office counter.
                </p>
                <a
                  href="mailto:kisansakhopar@gmail.com"
                  className="adm-btn inline-flex items-center gap-2  bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.14)] text-white px-6 py-2.5 rounded-xl font-bold text-sm no-underline"
                >
                  <Mail size={14} /> Enquire via Email
                </a>
              </div>
            </Reveal>
          </section>

          {/* dates */}
          <section>
            <Reveal delay={60}><SectionTitle eyebrow="Timeline" title="Important Dates" /></Reveal>
            <div className="flex flex-col gap-2.5">
              {DATES.map((d, i) => (
                <Reveal key={i} delay={i * 65 + 80}>
                  <div
                    className="adm-lift flex items-center gap-3.5 bg-white border border-gray-200 rounded-2xl p-4"
                    style={{ boxShadow: "0 2px 8px rgba(0,0,0,.04)" }}
                  >
                    <div
                      className="flex items-center justify-center shrink-0 bg-slate-50 border border-gray-200 rounded-xl"
                      style={{ width: "42px", height: "42px" }}
                    >
                      <d.icon size={17} color="var(--secondary)" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm" style={{ color: "var(--primary)" }}>{d.label}</p>
                      <p className="text-slate-400 text-xs">{d.note}</p>
                    </div>
                    <span className="bg-yellow-100 text-yellow-800 rounded-lg px-3 py-1 text-xs font-bold tracking-wide whitespace-nowrap">
                      TBA
                    </span>
                  </div>
                </Reveal>
              ))}
              <Reveal delay={280}>
                <p className="text-slate-400 text-xs pl-1.5 pt-1">
                  * Exact dates are posted on the school notice board each session.
                </p>
              </Reveal>
            </div>
          </section>
        </div>

        {/* divider */}
        <div className="h-px bg-linear-to-r from-transparent via-slate-300 to-transparent" />

        {/* ── CONTACT ── */}
        <section id="contact">
          <Reveal><SectionTitle eyebrow="Visit Us" title="Contact & Directions" /></Reveal>

          <div className="grid md:grid-cols-5 gap-6">

            {/* details — 3 cols */}
            <Reveal delay={60} className="md:col-span-3">
              <div
                className="adm-gb overflow-hidden h-full"
                style={{ boxShadow: "0 4px 18px rgba(21,40,61,.07)" }}
              >
                <div className="px-6 py-4 bg-neutral-50 border-b border-slate-100 flex items-center gap-2.5">
                  <Building2 size={15} color="var(--secondary)" />
                  <p className="font-bold text-sm" style={{ color: "var(--primary)" }}>School Office</p>
                </div>
                <div className="p-6 flex flex-col gap-5">
                  {[
                    { Icon: MapPin, label: "Address",      val: "Kisan Inter College, Sakhopar\nPadarauna, Kushinagar\nUttar Pradesh – 274402" },
                    { Icon: Mail,   label: "Email",        val: "kisansakhopar@gmail.com", href: "mailto:kisansakhopar@gmail.com" },
                    { Icon: Clock,  label: "Office Hours", val: "Monday – Saturday · 9:00 AM – 3:00 PM" },
                  ].map(({ Icon, label, val, href }) => (
                    <div key={label} className="flex gap-3.5">
                      <div
                        className="flex items-center justify-center shrink-0 bg-slate-50 border border-gray-200 rounded-xl"
                        style={{ width: "38px", height: "38px" }}
                      >
                        <Icon size={15} color="var(--secondary)" />
                      </div>
                      <div>
                        <p className="uppercase tracking-wider text-slate-400 font-bold mb-0.5" style={{ fontSize: ".68rem" }}>
                          {label}
                        </p>
                        {href
                          ? <a href={href} className="font-semibold text-sm no-underline" style={{ color: "var(--secondary)" }}>{val}</a>
                          : <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: "var(--primary)" }}>{val}</p>
                        }
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* CTA — 2 cols */}
            <Reveal delay={110} className="md:col-span-2">
              <div className="flex flex-col gap-3 h-full">

                {/* ready card */}
                <div
                  className="rounded-2xl p-7 flex-1 flex flex-col gap-3.5 relative overflow-hidden"
                  style={{ background: "var(--primary)" }}
                >
                  <div
                    className="absolute rounded-full"
                    style={{ top: "-30px", right: "-30px", width: "120px", height: "120px", border: "1px solid rgba(251,191,36,.12)" }}
                  />
                  <div className="flex items-center gap-2.5">
                    <CheckCircle size={20} color="#4ade80" />
                    <p className="adm-serif text-white font-bold text-lg">Ready to Apply?</p>
                  </div>
                  <p className="text-sm leading-7" style={{ color: "rgba(255,255,255,.6)" }}>
                    Admissions for 2025–26 are open. Walk in with your documents — no appointment needed.
                  </p>
                  <a
                    href="https://www.google.com/maps/search/Kisan+Inter+College+Sakhopar+Padarauna+Kushinagar+274402"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="adm-btn flex items-center justify-center gap-2 bg-white text-primary p-3 rounded-xl font-bold text-sm no-underline"
                  >
                    <MapPin size={15} /> Get Directions <ExternalLink size={12} style={{ opacity: .75 }} />
                  </a>
                  <NavLink
                    href="/contact#contact-form"
                    className="adm-btn flex items-center justify-center gap-2 text-white p-3 rounded-xl font-semibold text-sm no-underline"
                    style={{ background: "rgba(255,255,255,.08)", border: "1px solid rgba(255,255,255,.14)" }}
                  >
                    <Mail size={15} /> Email Us
                  </NavLink>
                </div>

                {/* walk-in note */}
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex gap-2.5 items-start">
                  <Info size={14} color="#16a34a" className="shrink-0 mt-0.5" />
                  <p className="text-green-800 leading-7" style={{ fontSize: ".8rem" }}>
                    <strong>No appointment needed.</strong> Walk in during school hours on any working day.
                  </p>
                </div>

              </div>
            </Reveal>

          </div>
        </section>

      </main>

    </div>
  );
}