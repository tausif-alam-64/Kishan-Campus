import { useState, useEffect, useRef } from "react";
import {
  AlertTriangle, MapPin, Mail, Clock, FileText, CreditCard,
  User, Camera, Award, Calendar, CheckCircle, Building2,
  GraduationCap, Microscope, Palette, ExternalLink, Info,
  ChevronDown, ArrowRight, BookOpen, Atom, PenLine,
} from "lucide-react";

/* ────────────────────────────────────────────
   INJECT STYLES  (animations + fonts)
──────────────────────────────────────────── */
function injectStyles() {
  if (document.getElementById("adm-s")) return;
  const el = document.createElement("style");
  el.id = "adm-s";
  el.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,700;0,800;1,600&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');

    /* ── base ── */
    .adm-root  { font-family: 'Plus Jakarta Sans', sans-serif; }
    .adm-serif { font-family: 'Playfair Display', serif; }

    /* ── reveal ── */
    .adm-reveal {
      opacity: 0;
      transform: translateY(28px);
      transition: opacity .6s cubic-bezier(.22,1,.36,1),
                  transform .6s cubic-bezier(.22,1,.36,1);
    }
    .adm-reveal.in { opacity: 1; transform: translateY(0); }

    /* ── card hover ── */
    .adm-lift {
      transition: transform .22s ease, box-shadow .22s ease;
    }
    .adm-lift:hover {
      transform: translateY(-4px);
      box-shadow: 0 16px 40px rgba(21,40,61,.13) !important;
    }

    /* ── step accordion ── */
    .adm-step { transition: border-color .2s, box-shadow .2s; }
    .adm-step:hover { box-shadow: 0 6px 22px rgba(21,40,61,.09); }
    .adm-step-icon { transition: background .25s; }
    .adm-chevron { transition: transform .25s cubic-bezier(.22,1,.36,1); }

    /* ── btn ── */
    .adm-btn { transition: transform .15s ease, filter .15s ease; }
    .adm-btn:hover { transform: translateY(-2px); filter: brightness(1.06); }

    /* ── pulse dot ── */
    @keyframes adm-pulse {
      0%,100% { box-shadow: 0 0 0 0 rgba(251,191,36,.55); }
      60%      { box-shadow: 0 0 0 7px rgba(251,191,36,0); }
    }
    .adm-dot { animation: adm-pulse 2s ease infinite; }

    /* ── gradient border card ── */
    .adm-gb {
      position: relative;
      border-radius: 16px;
      background: #fff;
    }
    .adm-gb::before {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: 16px;
      padding: 1.5px;
      background: linear-gradient(135deg, rgba(33,59,91,.25), rgba(217,119,6,.35));
      -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor;
      mask-composite: exclude;
      pointer-events: none;
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
    <div ref={r} className={`adm-reveal ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

/* ────────────────────────────────────────────
   DATA
──────────────────────────────────────────── */
const STREAMS = [
  {
    id: "arts",
    icon: PenLine,
    label: "Arts",
    full: "Arts & Humanities",
    subjects: ["History", "Geography", "Civics", "Hindi", "English", "Sanskrit"],
    accent: "#b45309",
    light: "#fffbeb",
    border: "#fde68a",
    tag: "Class XI & XII",
  },
  {
    id: "pcm",
    icon: Atom,
    label: "Science (PCM)",
    full: "Science — Math Trade",
    subjects: ["Physics", "Chemistry", "Mathematics", "English", "Hindi"],
    accent: "#0369a1",
    light: "#f0f9ff",
    border: "#bae6fd",
    tag: "Class XI & XII",
  },
  {
    id: "pcb",
    icon: Microscope,
    label: "Science (PCB)",
    full: "Science — Biology Trade",
    subjects: ["Physics", "Chemistry", "Biology", "English", "Hindi"],
    accent: "#047857",
    light: "#f0fdf4",
    border: "#a7f3d0",
    tag: "Class XI & XII",
  },
];

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
  { icon: CreditCard, label: "Date of Birth Certificate", sub: "Birth cert. or Aadhaar" },
  { icon: User,       label: "Aadhaar Card",              sub: "Student's Aadhaar copy" },
  { icon: Camera,     label: "Passport Size Photos",      sub: "2–4 recent photographs" },
];

const DATES = [
  { icon: BookOpen,     label: "Form Availability",       note: "Session 2025–26" },
  { icon: Calendar,     label: "Last Submission Date",    note: "Check notice board" },
  { icon: GraduationCap,label: "Classes Commence",        note: "Per UP Board calendar" },
];

/* ────────────────────────────────────────────
   SMALL SHARED COMPONENTS
──────────────────────────────────────────── */
function Eyebrow({ children }) {
  return (
    <p style={{
      fontSize: ".68rem", fontWeight: 700, letterSpacing: ".14em",
      color: "#d97706", textTransform: "uppercase",
      display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px",
    }}>
      <span style={{ display: "inline-block", width: "22px", height: "2px", background: "#d97706", borderRadius: "2px" }} />
      {children}
    </p>
  );
}

function SectionTitle({ eyebrow, title }) {
  return (
    <div className="mb-10">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="adm-serif" style={{ fontSize: "clamp(1.75rem,3.5vw,2.4rem)", fontWeight: 700, color: "var(--primary)", lineHeight: 1.18 }}>
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
      <section style={{
        background: "var(--primary)",
        position: "relative",
        overflow: "hidden",
        minHeight: "540px",
        display: "flex",
        alignItems: "center",
      }}>

        {/* ── geometric background shapes ── */}
        <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          {/* amber top rule */}
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: "linear-gradient(90deg,#d97706,#fbbf24 50%,#d97706)" }} />
          {/* large circle top-right */}
          <div style={{ position: "absolute", top: "-180px", right: "-180px", width: "560px", height: "560px", borderRadius: "50%", border: "1px solid rgba(251,191,36,.1)" }} />
          <div style={{ position: "absolute", top: "-90px", right: "-90px", width: "340px", height: "340px", borderRadius: "50%", border: "1px solid rgba(251,191,36,.07)" }} />
          {/* grid dot pattern */}
          <svg style={{ position: "absolute", bottom: 0, left: 0, opacity: .07 }} width="300" height="200" viewBox="0 0 300 200">
            {Array.from({ length: 10 }, (_, row) =>
              Array.from({ length: 15 }, (_, col) => (
                <circle key={`${row}-${col}`} cx={col * 20 + 10} cy={row * 20 + 10} r="1.5" fill="#fbbf24" />
              ))
            )}
          </svg>
          {/* diagonal slice bottom */}
          <div style={{ position: "absolute", bottom: "-1px", left: 0, right: 0, height: "80px", background: "#f5f7fa", clipPath: "polygon(0 100%,100% 100%,100% 40%,0 100%)" }} />
        </div>

        <div className="max-w-6xl mx-auto w-full px-6 md:px-12 py-20 md:py-28 relative">
          <div className="grid md:grid-cols-2 gap-14 items-center">

            {/* left — headline */}
            <div>
              {/* live badge */}
              <div style={{ display: "inline-flex", alignItems: "center", gap: "9px", background: "rgba(217,119,6,.18)", border: "1px solid rgba(217,119,6,.35)", borderRadius: "100px", padding: "6px 16px", marginBottom: "24px" }}>
                <span className="adm-dot" style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#fbbf24", display: "inline-block" }} />
                <span style={{ color: "#fbbf24", fontSize: ".71rem", fontWeight: 700, letterSpacing: ".1em" }}>ADMISSIONS OPEN · 2025–26</span>
              </div>

              <h1 className="adm-serif" style={{ fontSize: "clamp(2.6rem,5.5vw,4rem)", fontWeight: 800, color: "#fff", lineHeight: 1.06, marginBottom: "20px" }}>
                Your Future<br />
                <span style={{ color: "#fbbf24", fontStyle: "italic" }}>Begins Here.</span>
              </h1>

              <p style={{ color: "rgba(255,255,255,.62)", fontSize: "1.02rem", lineHeight: 1.82, maxWidth: "430px", marginBottom: "32px" }}>
                Kisan Inter College, Sakhopar has been nurturing students from Kushinagar's rural heartland since <strong style={{ color: "rgba(255,255,255,.85)" }}>1948</strong>. Join us for Class XI & XII — UP Board affiliated.
              </p>

              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                <a href="#process" className="adm-btn" style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "#d97706", color: "#fff", padding: "13px 24px", borderRadius: "10px", fontWeight: 700, fontSize: ".88rem", textDecoration: "none" }}>
                  How to Apply <ArrowRight size={15} />
                </a>
                <a href="#contact" className="adm-btn" style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(255,255,255,.08)", border: "1px solid rgba(255,255,255,.15)", color: "#fff", padding: "13px 24px", borderRadius: "10px", fontWeight: 600, fontSize: ".88rem", textDecoration: "none" }}>
                  <MapPin size={15} /> Get Directions
                </a>
              </div>
            </div>

            {/* right — info glass card */}
            <div>
              <div style={{ background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.11)", borderRadius: "20px", backdropFilter: "blur(14px)", overflow: "hidden" }}>
                <div style={{ padding: "1.1rem 1.5rem", borderBottom: "1px solid rgba(255,255,255,.08)", display: "flex", alignItems: "center", gap: "9px" }}>
                  <Building2 size={15} color="#fbbf24" />
                  <span style={{ color: "rgba(255,255,255,.45)", fontSize: ".68rem", letterSpacing: ".1em", fontWeight: 700 }}>SCHOOL AT A GLANCE</span>
                </div>
                {[
                  ["Board",      "UP State Board"],
                  ["Category",   "Government-Aided"],
                  ["Medium",     "Hindi & English"],
                  ["Classes",    "XI & XII"],
                  ["Streams",    "Arts · Sci (PCM) · Sci (PCB)"],
                  ["Location",   "Sakhopar, Kushinagar"],
                  ["UDISE",      "09590100202"],
                  ["Est.",       "1948"],
                ].map(([k, v], i) => (
                  <div key={k} style={{ padding: ".78rem 1.5rem", borderBottom: i < 7 ? "1px solid rgba(255,255,255,.05)" : "none", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px" }}>
                    <span style={{ color: "rgba(255,255,255,.38)", fontSize: ".78rem" }}>{k}</span>
                    <span style={{ color: "#fff", fontWeight: 600, fontSize: ".82rem", textAlign: "right" }}>{v}</span>
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
          <div style={{ background: "#fffbeb", border: "1.5px solid #fcd34d", borderRadius: "14px", padding: "1.2rem 1.5rem", display: "flex", gap: "14px", alignItems: "flex-start", boxShadow: "0 4px 20px rgba(217,119,6,.12)" }}>
            <div style={{ background: "#d97706", borderRadius: "10px", padding: "10px", flexShrink: 0 }}>
              <AlertTriangle size={18} color="#fff" />
            </div>
            <div>
              <p style={{ fontWeight: 700, color: "#92400e", fontSize: ".93rem", marginBottom: "4px" }}>
                Offline Admissions Only — No Online Registration Available
              </p>
              <p style={{ color: "#78350f", fontSize: ".875rem", lineHeight: 1.75 }}>
                All admissions are processed <strong>in person at the school office</strong>. Students must visit during working hours (Mon–Sat, 9 AM–3 PM) with all original documents. No walk-in appointment is required.
              </p>
            </div>
          </div>
        </Reveal>
      </div>

      {/* ══════════════ MAIN CONTENT ══════════════ */}
      <main className="max-w-6xl mx-auto px-6 md:px-12 py-16" style={{ display: "flex", flexDirection: "column", gap: "80px" }}>

        {/* ── STREAMS ── */}
        <section>
          <Reveal>
            <SectionTitle eyebrow="Courses Offered" title="Choose Your Stream" />
          </Reveal>

          {/* big stream cards */}
          <div className="grid md:grid-cols-3 gap-5">
            {STREAMS.map((s, i) => (
              <Reveal key={s.id} delay={i * 80}>
                <div className="adm-gb adm-lift" style={{ overflow: "hidden", boxShadow: "0 4px 16px rgba(21,40,61,.07)", height: "100%" }}>
                  {/* coloured top band */}
                  <div style={{ height: "6px", background: s.accent }} />
                  <div style={{ padding: "1.6rem" }}>
                    {/* icon + label */}
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                      <div style={{ width: "46px", height: "46px", borderRadius: "12px", background: s.light, border: `1.5px solid ${s.border}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <s.icon size={20} color={s.accent} />
                      </div>
                      <div>
                        <span style={{ display: "inline-block", background: s.light, border: `1px solid ${s.border}`, color: s.accent, fontSize: ".65rem", fontWeight: 700, letterSpacing: ".09em", borderRadius: "100px", padding: "2px 9px", marginBottom: "3px" }}>CLASS XI & XII</span>
                        <p className="adm-serif" style={{ fontWeight: 700, fontSize: "1.1rem", color: "var(--primary)", lineHeight: 1.2 }}>{s.full}</p>
                      </div>
                    </div>

                    {/* subjects */}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                      {s.subjects.map(sub => (
                        <span key={sub} style={{ background: "#f1f5f9", color: "var(--ternary)", fontSize: ".75rem", fontWeight: 500, borderRadius: "6px", padding: "4px 10px" }}>
                          {sub}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* note below */}
          <Reveal delay={260}>
            <div style={{ marginTop: "16px", display: "flex", alignItems: "flex-start", gap: "9px", padding: "12px 14px", background: "#fff", borderRadius: "10px", border: "1px solid #e5e7eb" }}>
              <Info size={14} color="var(--ternary)" style={{ marginTop: "2px", flexShrink: 0 }} />
              <p style={{ color: "var(--ternary)", fontSize: ".8rem", lineHeight: 1.7 }}>
                Stream allocation is subject to seat availability and UP Board norms. Contact the school office to confirm subject combinations for the current session.
              </p>
            </div>
          </Reveal>
        </section>

        {/* divider */}
        <div style={{ height: "1px", background: "linear-gradient(to right, transparent, #cbd5e1, transparent)" }} />

        {/* ── PROCESS ── */}
        <section id="process">
          <Reveal>
            <SectionTitle eyebrow="How to Apply" title="Step-by-Step Process" />
          </Reveal>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {STEPS.map((step, i) => {
              const isOpen = openStep === i;
              const isDone = openStep !== null && i < openStep;
              return (
                <Reveal key={i} delay={i * 50}>
                  <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                    {/* left: number + connector */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: "16px", flexShrink: 0 }}>
                      <div
                        className="adm-step-icon"
                        onClick={() => setOpenStep(isOpen ? null : i)}
                        style={{
                          width: "44px", height: "44px", borderRadius: "50%",
                          background: isOpen ? "#d97706" : isDone ? "#16a34a" : "var(--primary)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          cursor: "pointer", flexShrink: 0,
                          boxShadow: isOpen ? "0 0 0 5px rgba(217,119,6,.18)" : "none",
                        }}
                      >
                        {isDone
                          ? <CheckCircle size={18} color="#fff" />
                          : <span style={{ color: "#fff", fontWeight: 700, fontSize: ".75rem" }}>{step.n}</span>
                        }
                      </div>
                      {i < STEPS.length - 1 && (
                        <div style={{ width: "2px", flexGrow: 1, minHeight: "24px", background: isOpen ? "linear-gradient(to bottom,#d97706,transparent)" : "#e2e8f0", marginTop: "6px" }} />
                      )}
                    </div>

                    {/* right: card */}
                    <div
                      className="adm-step"
                      onClick={() => setOpenStep(isOpen ? null : i)}
                      style={{
                        flex: 1,
                        background: "#fff",
                        border: `1.5px solid ${isOpen ? "#d97706" : "#e5e7eb"}`,
                        borderRadius: "14px",
                        padding: "1.05rem 1.35rem",
                        cursor: "pointer",
                        marginBottom: "6px",
                        boxShadow: isOpen ? "0 6px 24px rgba(217,119,6,.1)" : "0 1px 4px rgba(0,0,0,.04)",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <p style={{ fontWeight: 600, fontSize: ".93rem", color: "var(--primary)" }}>{step.title}</p>
                        <ChevronDown
                          size={16}
                          color={isOpen ? "#d97706" : "#94a3b8"}
                          className="adm-chevron"
                          style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0)", flexShrink: 0 }}
                        />
                      </div>
                      {isOpen && (
                        <p style={{ color: "var(--ternary)", fontSize: ".875rem", lineHeight: 1.78, marginTop: "10px", paddingTop: "10px", borderTop: "1px solid #f1f5f9" }}>
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
        <div style={{ height: "1px", background: "linear-gradient(to right, transparent, #cbd5e1, transparent)" }} />

        {/* ── DOCUMENTS ── */}
        <section>
          <Reveal>
            <SectionTitle eyebrow="Checklist" title="Documents Required" />
          </Reveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {DOCS.map((doc, i) => (
              <Reveal key={i} delay={i * 60}>
                <div className="adm-lift adm-gb" style={{ padding: "1.3rem 1.4rem", display: "flex", gap: "14px", alignItems: "flex-start", boxShadow: "0 2px 10px rgba(0,0,0,.05)" }}>
                  <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "#f0fdf4", border: "1px solid #bbf7d0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <doc.icon size={17} color="#16a34a" />
                  </div>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: ".875rem", color: "var(--primary)", marginBottom: "3px" }}>{doc.label}</p>
                    <p style={{ color: "#94a3b8", fontSize: ".77rem" }}>{doc.sub}</p>
                  </div>
                </div>
              </Reveal>
            ))}
            {/* tip */}
            <Reveal delay={320}>
              <div style={{ padding: "1.3rem 1.4rem", display: "flex", gap: "14px", alignItems: "flex-start", background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: "14px" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "#dbeafe", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Info size={17} color="#2563eb" />
                </div>
                <p style={{ color: "#1e40af", fontSize: ".82rem", lineHeight: 1.75 }}>
                  Bring <strong>original documents</strong> along with photocopies. Originals are returned after same-day verification.
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* divider */}
        <div style={{ height: "1px", background: "linear-gradient(to right, transparent, #cbd5e1, transparent)" }} />

        {/* ── FEE + DATES (2-col) ── */}
        <div className="grid md:grid-cols-2 gap-10">

          {/* fee */}
          <section>
            <Reveal><SectionTitle eyebrow="Fees" title="Fee Structure" /></Reveal>
            <Reveal delay={60}>
              <div style={{ background: "var(--primary)", borderRadius: "18px", padding: "2rem", position: "relative", overflow: "hidden", boxShadow: "0 8px 32px rgba(21,40,61,.2)" }}>
                {/* bg circle */}
                <div style={{ position: "absolute", bottom: "-50px", right: "-50px", width: "190px", height: "190px", borderRadius: "50%", border: "1px solid rgba(251,191,36,.12)" }} />
                <div style={{ position: "absolute", bottom: "-20px", right: "-20px", width: "120px", height: "120px", borderRadius: "50%", background: "rgba(251,191,36,.06)" }} />

                <Eyebrow>Government-Aided Institution</Eyebrow>
                <p style={{ color: "rgba(255,255,255,.72)", fontSize: ".92rem", lineHeight: 1.82, marginBottom: "1.4rem" }}>
                  Kisan Inter College is a <strong style={{ color: "#fff" }}>government-aided school</strong>, so fees are minimal and are set as per UP Board and institutional norms. Exact details are displayed on the school notice board and at the office counter.
                </p>
                <a href="mailto:kisansakhopar@gmail.com" className="adm-btn" style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "#d97706", color: "#fff", padding: "11px 22px", borderRadius: "9px", fontWeight: 700, fontSize: ".85rem", textDecoration: "none" }}>
                  <Mail size={14} /> Enquire via Email
                </a>
              </div>
            </Reveal>
          </section>

          {/* dates */}
          <section>
            <Reveal delay={60}><SectionTitle eyebrow="Timeline" title="Important Dates" /></Reveal>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {DATES.map((d, i) => (
                <Reveal key={i} delay={i * 65 + 80}>
                  <div className="adm-lift" style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "13px", padding: "1rem 1.3rem", display: "flex", alignItems: "center", gap: "14px", boxShadow: "0 2px 8px rgba(0,0,0,.04)" }}>
                    <div style={{ width: "42px", height: "42px", borderRadius: "11px", background: "#f8fafc", border: "1px solid #e5e7eb", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <d.icon size={17} color="var(--secondary)" />
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: 600, fontSize: ".875rem", color: "var(--primary)" }}>{d.label}</p>
                      <p style={{ color: "#94a3b8", fontSize: ".75rem" }}>{d.note}</p>
                    </div>
                    <span style={{ background: "#fef9c3", color: "#854d0e", borderRadius: "7px", padding: "4px 11px", fontSize: ".7rem", fontWeight: 700, letterSpacing: ".04em", whiteSpace: "nowrap" }}>
                      TBA
                    </span>
                  </div>
                </Reveal>
              ))}
              <Reveal delay={280}>
                <p style={{ color: "#94a3b8", fontSize: ".78rem", paddingLeft: "6px", paddingTop: "4px" }}>
                  * Exact dates are posted on the school notice board each session.
                </p>
              </Reveal>
            </div>
          </section>
        </div>

        {/* divider */}
        <div style={{ height: "1px", background: "linear-gradient(to right, transparent, #cbd5e1, transparent)" }} />

        {/* ── CONTACT ── */}
        <section id="contact">
          <Reveal><SectionTitle eyebrow="Visit Us" title="Contact & Directions" /></Reveal>

          <div className="grid md:grid-cols-5 gap-6">

            {/* details — 3 cols */}
            <Reveal delay={60} className="md:col-span-3">
              <div className="adm-gb" style={{ overflow: "hidden", boxShadow: "0 4px 18px rgba(21,40,61,.07)", height: "100%" }}>
                {/* header */}
                <div style={{ padding: "1.1rem 1.5rem", background: "#fafafa", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", gap: "9px" }}>
                  <Building2 size={15} color="var(--secondary)" />
                  <p style={{ fontWeight: 700, fontSize: ".85rem", color: "var(--primary)" }}>School Office</p>
                </div>
                {/* rows */}
                <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.3rem" }}>
                  {[
                    { Icon: MapPin, label: "Address",      val: "Kisan Inter College, Sakhopar\nPadarauna, Kushinagar\nUttar Pradesh – 274402" },
                    { Icon: Mail,   label: "Email",        val: "kisansakhopar@gmail.com", href: "mailto:kisansakhopar@gmail.com" },
                    { Icon: Clock,  label: "Office Hours", val: "Monday – Saturday · 9:00 AM – 3:00 PM" },
                  ].map(({ Icon, label, val, href }) => (
                    <div key={label} style={{ display: "flex", gap: "13px" }}>
                      <div style={{ width: "38px", height: "38px", borderRadius: "10px", background: "#f8fafc", border: "1px solid #e5e7eb", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <Icon size={15} color="var(--secondary)" />
                      </div>
                      <div>
                        <p style={{ fontSize: ".68rem", letterSpacing: ".08em", color: "#94a3b8", fontWeight: 700, marginBottom: "3px" }}>{label.toUpperCase()}</p>
                        {href
                          ? <a href={href} style={{ color: "var(--secondary)", fontWeight: 600, fontSize: ".875rem", textDecoration: "none" }}>{val}</a>
                          : <p style={{ color: "var(--primary)", fontSize: ".875rem", lineHeight: 1.65, whiteSpace: "pre-line" }}>{val}</p>
                        }
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* CTA — 2 cols */}
            <Reveal delay={110} className="md:col-span-2">
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", height: "100%" }}>

                {/* ready card */}
                <div style={{ background: "var(--primary)", borderRadius: "16px", padding: "1.7rem", flex: 1, display: "flex", flexDirection: "column", gap: "14px", position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", top: "-30px", right: "-30px", width: "120px", height: "120px", borderRadius: "50%", border: "1px solid rgba(251,191,36,.12)" }} />
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <CheckCircle size={20} color="#4ade80" />
                    <p className="adm-serif" style={{ color: "#fff", fontWeight: 700, fontSize: "1.1rem" }}>Ready to Apply?</p>
                  </div>
                  <p style={{ color: "rgba(255,255,255,.6)", fontSize: ".875rem", lineHeight: 1.78 }}>
                    Admissions for 2025–26 are open. Walk in with your documents — no appointment needed.
                  </p>
                  <a
                    href="https://www.google.com/maps/search/Kisan+Inter+College+Sakhopar+Padarauna+Kushinagar+274402"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="adm-btn"
                    style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", background: "#d97706", color: "#fff", padding: "12px", borderRadius: "10px", fontWeight: 700, fontSize: ".875rem", textDecoration: "none" }}
                  >
                    <MapPin size={15} /> Get Directions <ExternalLink size={12} style={{ opacity: .75 }} />
                  </a>
                  <a
                    href="mailto:kisansakhopar@gmail.com"
                    className="adm-btn"
                    style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", background: "rgba(255,255,255,.08)", border: "1px solid rgba(255,255,255,.14)", color: "#fff", padding: "12px", borderRadius: "10px", fontWeight: 600, fontSize: ".875rem", textDecoration: "none" }}
                  >
                    <Mail size={15} /> Email Us
                  </a>
                </div>

                {/* walk-in note */}
                <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "12px", padding: "1rem 1.2rem", display: "flex", gap: "10px", alignItems: "flex-start" }}>
                  <Info size={14} color="#16a34a" style={{ flexShrink: 0, marginTop: "2px" }} />
                  <p style={{ color: "#166534", fontSize: ".8rem", lineHeight: 1.72 }}>
                    <strong>No appointment needed.</strong> Walk in during school hours on any working day.
                  </p>
                </div>

              </div>
            </Reveal>

          </div>
        </section>

      </main>

      {/* ══════════════ FOOTER BAND ══════════════ */}
      <div style={{ background: "var(--primary)", borderTop: "3px solid #d97706" }}>
        <div className="max-w-6xl mx-auto px-6 md:px-12 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p style={{ color: "rgba(255,255,255,.65)", fontSize: ".88rem" }}>
            Have questions? Reach us at the school office or via email.
          </p>
          <a
            href="mailto:kisansakhopar@gmail.com"
            className="adm-btn"
            style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "#d97706", color: "#fff", padding: "9px 20px", borderRadius: "8px", fontWeight: 700, fontSize: ".84rem", textDecoration: "none", whiteSpace: "nowrap" }}
          >
            <Mail size={13} /> kisansakhopar@gmail.com
          </a>
        </div>
      </div>

    </div>
  );
}