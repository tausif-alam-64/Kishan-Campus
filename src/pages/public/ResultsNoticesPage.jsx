import { useState, useEffect, useRef, useMemo } from "react";
import {
  BookOpen, Bell, Calendar, ClipboardList, CalendarDays,
  Download, Clock, Pin, Search, SearchX, Mail, ChevronRight,
} from "lucide-react";

// ─── Scroll Reveal ────────────────────────────────────────────────────────────
function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const ob = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
        ob.disconnect();
      }
    }, { threshold: 0.07 });
    ob.observe(el);
    return () => ob.disconnect();
  }, []);
  return ref;
}

function Up({ children, delay = 0, className = "" }) {
  const r = useReveal();
  return (
    <div ref={r} className={className}
      style={{
        opacity: 0,
        transform: "translateY(20px)",
        transition: `opacity 0.55s ease ${delay}ms, transform 0.55s ease ${delay}ms`,
      }}>
      {children}
    </div>
  );
}

// ─── Eyebrow Tag ──────────────────────────────────────────────────────────────
function Tag({ children, light = false }) {
  return (
    <span
      className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase mb-4"
      style={{ color: light ? "rgba(255,255,255,0.55)" : "var(--ternary)" }}
    >
      <span className={`w-5 h-px ${light ? "bg-white/40" : "bg-primary"}`} />
      {children}
    </span>
  );
}

// ─── Date Helpers ─────────────────────────────────────────────────────────────
function formatDate(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function shortDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

function daysAgo(iso) {
  const now = new Date();
  const issued = new Date(iso);
  const diff = Math.floor((now - issued) / (1000 * 60 * 60 * 24));
  return diff;
}

function getMonthYear(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-IN", { month: "long", year: "numeric" });
}

function getDayNum(iso) {
  return new Date(iso).getDate();
}

function getMonthShort(iso) {
  return new Date(iso).toLocaleDateString("en-IN", { month: "short" }).toUpperCase();
}

// ─── Data ─────────────────────────────────────────────────────────────────────

// TODO: replace with Supabase query — table: results
const RESULTS_DATA = [
  {
    id: 1,
    title: "UP Board Class X Result 2024–25",
    class: "X",
    exam_type: "Board",
    session: "2024–25",
    pass_percentage: 94,
    toppers: [
      { name: "Priya Singh",   marks: 485, out_of: 500, stream: null },
      { name: "Rahul Verma",   marks: 472, out_of: 500, stream: null },
      { name: "Anita Yadav",   marks: 461, out_of: 500, stream: null },
    ],
    pdf_url: null,
    declared_on: "2025-06-15",
    status: "declared",
  },
  {
    id: 2,
    title: "UP Board Class XII Arts Result 2024–25",
    class: "XII",
    exam_type: "Board",
    session: "2024–25",
    pass_percentage: 91,
    toppers: [
      { name: "Sunita Kumari",  marks: 478, out_of: 500, stream: "Arts" },
      { name: "Deepak Pandey",  marks: 463, out_of: 500, stream: "Arts" },
      { name: "Rekha Gupta",    marks: 451, out_of: 500, stream: "Arts" },
    ],
    pdf_url: null,
    declared_on: "2025-06-20",
    status: "declared",
  },
  {
    id: 3,
    title: "UP Board Class XII Science Result 2024–25",
    class: "XII",
    exam_type: "Board",
    session: "2024–25",
    pass_percentage: 88,
    toppers: [
      { name: "Amit Tiwari",    marks: 492, out_of: 500, stream: "Science" },
      { name: "Pooja Mishra",   marks: 474, out_of: 500, stream: "Science" },
      { name: "Vikram Singh",   marks: 459, out_of: 500, stream: "Science" },
    ],
    pdf_url: null,
    declared_on: "2025-06-22",
    status: "declared",
  },
  {
    id: 4,
    title: "Half-Yearly Examination Class IX 2024–25",
    class: "IX",
    exam_type: "Half-Yearly",
    session: "2024–25",
    pass_percentage: 87,
    toppers: [
      { name: "Neha Chauhan",   marks: 462, out_of: 500, stream: null },
      { name: "Ravi Kumar",     marks: 449, out_of: 500, stream: null },
      { name: "Seema Yadav",    marks: 438, out_of: 500, stream: null },
    ],
    pdf_url: null,
    declared_on: "2024-10-18",
    status: "declared",
  },
  {
    id: 5,
    title: "Annual Examination Class VIII 2024–25",
    class: "VIII",
    exam_type: "Annual",
    session: "2024–25",
    pass_percentage: 96,
    toppers: [
      { name: "Khushi Verma",   marks: 471, out_of: 500, stream: null },
      { name: "Mohit Dubey",    marks: 458, out_of: 500, stream: null },
      { name: "Kavya Singh",    marks: 444, out_of: 500, stream: null },
    ],
    pdf_url: null,
    declared_on: "2025-04-10",
    status: "declared",
  },
  {
    id: 6,
    title: "UP Board Class X Result 2025–26",
    class: "X",
    exam_type: "Board",
    session: "2025–26",
    pass_percentage: null,
    toppers: [],
    pdf_url: null,
    declared_on: null,
    status: "upcoming",
  },
];

// TODO: replace with Supabase query — table: notices
const NOTICES_DATA = [
  {
    id: 1,
    title: "Winter Vacation — School Closed Dec 25 to Jan 5",
    category: "Urgent",
    body: "Kisan Inter College, Sakhopar will remain closed from December 25, 2025 to January 5, 2026 on account of winter vacations. All students and staff are informed accordingly. School will reopen on January 6, 2026 with regular timing.",
    issued_on: "2025-12-18",
    valid_until: "2026-01-05",
    is_pinned: true,
    attachment_url: null,
  },
  {
    id: 2,
    title: "Half-Yearly Examination Schedule Released — Download Timetable",
    category: "Exam",
    body: "The official timetable for the Half-Yearly Examinations has been released for all classes (VI–XII). Examinations will be held from September 15 to September 25, 2025. Students are advised to download the timetable and prepare accordingly. No re-schedule requests will be entertained.",
    issued_on: "2025-09-01",
    valid_until: "2025-09-25",
    is_pinned: true,
    attachment_url: null,
  },
  {
    id: 3,
    title: "Admissions Open for Session 2025–26 — Class VI",
    category: "Admission",
    body: "Kisan Inter College, Sakhopar is pleased to announce that admissions for the academic session 2025–26 are now open for Class VI. Interested students may collect admission forms from the school office. Last date for submission of forms is March 31, 2025.",
    issued_on: "2025-02-15",
    valid_until: "2025-03-31",
    is_pinned: false,
    attachment_url: null,
  },
  {
    id: 4,
    title: "Annual Sports Day 2025 — Registration Now Open",
    category: "Event",
    body: "The Annual Sports Day will be held on February 12, 2026. All students wishing to participate in track events, field events, or team sports must register their names with their class teacher by February 5, 2026. Participation certificates will be awarded to all registered students.",
    issued_on: "2026-01-20",
    valid_until: "2026-02-05",
    is_pinned: false,
    attachment_url: null,
  },
  {
    id: 5,
    title: "Diwali Holiday — School Closed on Oct 31 & Nov 1",
    category: "Holiday",
    body: "On account of Diwali celebrations, the school will remain closed on October 31 and November 1, 2025. Classes will resume normally from November 3, 2025 (Monday). All co-curricular activities scheduled for this period stand rescheduled.",
    issued_on: "2025-10-28",
    valid_until: "2025-11-01",
    is_pinned: false,
    attachment_url: null,
  },
  {
    id: 6,
    title: "Parent-Teacher Meeting Scheduled for Saturday, November 8",
    category: "General",
    body: "A Parent-Teacher Meeting (PTM) is scheduled for Saturday, November 8, 2025 from 10:00 AM to 1:00 PM. All parents and guardians are requested to attend and discuss their ward's academic progress with class teachers. Entry will be through Gate No. 1 only.",
    issued_on: "2025-11-01",
    valid_until: "2025-11-08",
    is_pinned: false,
    attachment_url: null,
  },
  {
    id: 7,
    title: "UP Board Practical Exam Dates Announced for Class XII",
    category: "Exam",
    body: "The UPMSP has officially announced the schedule for Class XII practical examinations for session 2024–25. Practicals for Science, Arts, and Commerce streams will be held from January 10 to January 25, 2026. All concerned students must report with their admit cards.",
    issued_on: "2025-12-28",
    valid_until: "2026-01-25",
    is_pinned: false,
    attachment_url: null,
  },
  {
    id: 8,
    title: "School Fee Submission — Last Date Reminder",
    category: "General",
    body: "This is a reminder to all students that the last date for submission of school fees for the second quarter (October–December 2025) is November 15, 2025. Late fee charges will apply thereafter. Parents are requested to ensure timely payment at the school cashier's office.",
    issued_on: "2025-11-05",
    valid_until: "2025-11-15",
    is_pinned: false,
    attachment_url: null,
  },
  {
    id: 9,
    title: "Annual Science Exhibition — Students Encouraged to Participate",
    category: "Event",
    body: "The Annual Science Exhibition will be organized at school premises on December 10, 2025. Students of Classes VIII to XII are encouraged to submit their project proposals to the Science Department by November 25, 2025. Best projects will be displayed at the district-level exhibition.",
    issued_on: "2025-11-12",
    valid_until: "2025-12-10",
    is_pinned: false,
    attachment_url: null,
  },
  {
    id: 10,
    title: "New Textbooks Distributed for Academic Session 2025–26",
    category: "General",
    body: "All new textbooks prescribed by UPMSP for the academic session 2025–26 have been distributed to students of all classes. Students who have not yet collected their books should visit the school library with their admission receipts before July 15, 2025.",
    issued_on: "2025-07-08",
    valid_until: null,
    is_pinned: false,
    attachment_url: null,
  },
];

// TODO: replace with Supabase query — table: calendar_events
const CALENDAR_DATA = [
  {
    id: 1,
    label: "School Reopens After Summer Vacation",
    date_from: "2025-07-01",
    date_to: "2025-07-01",
    type: "Event",
  },
  {
    id: 2,
    label: "Independence Day Celebration",
    date_from: "2025-08-15",
    date_to: "2025-08-15",
    type: "Holiday",
  },
  {
    id: 3,
    label: "Half-Yearly Examinations",
    date_from: "2025-09-15",
    date_to: "2025-09-25",
    type: "Exam",
  },
  {
    id: 4,
    label: "Gandhi Jayanti — National Holiday",
    date_from: "2025-10-02",
    date_to: "2025-10-02",
    type: "Holiday",
  },
  {
    id: 5,
    label: "Diwali Holiday",
    date_from: "2025-10-31",
    date_to: "2025-11-01",
    type: "Holiday",
  },
  {
    id: 6,
    label: "Parent-Teacher Meeting (PTM)",
    date_from: "2025-11-08",
    date_to: "2025-11-08",
    type: "PTM",
  },
  {
    id: 7,
    label: "Annual Science Exhibition",
    date_from: "2025-12-10",
    date_to: "2025-12-10",
    type: "Event",
  },
  {
    id: 8,
    label: "Winter Vacation",
    date_from: "2025-12-25",
    date_to: "2026-01-05",
    type: "Vacation",
  },
  {
    id: 9,
    label: "Republic Day Celebration",
    date_from: "2026-01-26",
    date_to: "2026-01-26",
    type: "Holiday",
  },
  {
    id: 10,
    label: "Annual Sports Day",
    date_from: "2026-02-12",
    date_to: "2026-02-12",
    type: "Event",
  },
  {
    id: 11,
    label: "UP Board Class X & XII Examinations",
    date_from: "2026-02-20",
    date_to: "2026-03-15",
    type: "Exam",
  },
  {
    id: 12,
    label: "Annual Examinations (Class VI–IX)",
    date_from: "2026-03-01",
    date_to: "2026-03-20",
    type: "Exam",
  },
  {
    id: 13,
    label: "UP Board Result Declaration",
    date_from: "2026-06-15",
    date_to: "2026-06-15",
    type: "Event",
  },
];

// ─── Category Badge ───────────────────────────────────────────────────────────
const NOTICE_BADGE_CLASSES = {
  Urgent:    "bg-red-100 text-red-700",
  Exam:      "bg-amber-100 text-amber-800",
  Holiday:   "bg-emerald-100 text-emerald-700",
  Event:     "bg-blue-100 text-blue-700",
  Admission: "bg-violet-100 text-violet-700",
  General:   "bg-slate-100 text-slate-600",
};

const CALENDAR_DOT_CLASSES = {
  Holiday:  "bg-emerald-500",
  Exam:     "bg-amber-500",
  Event:    "bg-blue-500",
  PTM:      "bg-violet-500",
  Vacation: "bg-slate-400",
};

const CALENDAR_BADGE_CLASSES = {
  Holiday:  "bg-emerald-100 text-emerald-700",
  Exam:     "bg-amber-100 text-amber-800",
  Event:    "bg-blue-100 text-blue-700",
  PTM:      "bg-violet-100 text-violet-700",
  Vacation: "bg-slate-100 text-slate-600",
};

const MEDAL = ["🥇", "🥈", "🥉"];

// ─── Component ────────────────────────────────────────────────────────────────
export default function ResultsNoticesPage() {
  const [activeTab, setActiveTab] = useState("results");

  // Results filters
  const [examFilter, setExamFilter]   = useState("All");
  const [classFilter, setClassFilter] = useState("All");

  // Notices filters
  const [noticeSearch, setNoticeSearch]   = useState("");
  const [noticeCategory, setNoticeCategory] = useState("All");

  // ── Filtered Results ───────────────────────────────────────────────────────
  const filteredResults = useMemo(() => {
    return RESULTS_DATA.filter((r) => {
      const matchExam =
        examFilter === "All" ||
        (examFilter === "Board Exams" && r.exam_type === "Board") ||
        r.exam_type === examFilter;
      const matchClass =
        classFilter === "All" || r.class === classFilter.replace("Class ", "");
      return matchExam && matchClass;
    });
  }, [examFilter, classFilter]);

  // ── Filtered Notices ───────────────────────────────────────────────────────
  const filteredNotices = useMemo(() => {
    const q = noticeSearch.toLowerCase().trim();
    return NOTICES_DATA
      .filter((n) => {
        const matchCat = noticeCategory === "All" || n.category === noticeCategory;
        const matchQ   = !q || n.title.toLowerCase().includes(q) || n.body.toLowerCase().includes(q);
        return matchCat && matchQ;
      })
      .sort((a, b) => {
        if (a.is_pinned && !b.is_pinned) return -1;
        if (!a.is_pinned && b.is_pinned) return 1;
        return new Date(b.issued_on) - new Date(a.issued_on);
      });
  }, [noticeSearch, noticeCategory]);

  // ── Grouped Calendar ───────────────────────────────────────────────────────
  const groupedCalendar = useMemo(() => {
    const map = new Map();
    const sorted = [...CALENDAR_DATA].sort(
      (a, b) => new Date(a.date_from) - new Date(b.date_from)
    );
    sorted.forEach((ev) => {
      const key = getMonthYear(ev.date_from);
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(ev);
    });
    return map;
  }, []);

  const upcomingEvents = useMemo(() => {
    const today = new Date();
    return CALENDAR_DATA
      .filter((ev) => new Date(ev.date_from) >= today)
      .sort((a, b) => new Date(a.date_from) - new Date(b.date_from))
      .slice(0, 4);
  }, []);

  // ── Exam filter pills ──────────────────────────────────────────────────────
  const examFilters = ["All", "Board Exams", "Half-Yearly", "Annual", "Unit Test"];
  const classOptions = ["All Classes", "Class VI", "Class VII", "Class VIII", "Class IX", "Class X", "Class XI", "Class XII"];
  const noticeCategories = ["All", "Urgent", "Exam", "Holiday", "Event", "Admission", "General"];

  return (
    <div className="bg-first min-h-screen" style={{ fontFamily: "var(--font-text)" }}>

      {/* ═══ SECTION 1 — PAGE HEADER ═══════════════════════════════════════════ */}
      <header className="bg-primary py-12 md:py-16 overflow-hidden relative">
        {/* Subtle texture overlay */}
        <div
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.15) 0%, transparent 60%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.08) 0%, transparent 50%)",
          }}
        />
        <div className="max-w-7xl mx-auto px-4 md:px-10 relative z-10">
          <div className="ab-hero">
            <Up delay={0}>
              <Tag light>Academic Information · Kisan Inter College</Tag>
            </Up>
            <Up delay={80}>
              <h1
                className="text-white text-4xl md:text-5xl font-bold leading-tight"
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "clamp(2rem, 5vw, 3.2rem)",
                }}
              >
                Results &amp; <span className="italic">Notices</span>
              </h1>
            </Up>
            <Up delay={160}>
              <p className="text-white/60 text-sm max-w-lg mt-3 leading-relaxed">
                Find UP Board results, school examination outcomes, official notices, and the academic calendar — all in one place.
              </p>
            </Up>
            <Up delay={240}>
              <div className="flex flex-wrap gap-3 mt-6">
                {[
                  { icon: <BookOpen size={14} />, label: "UP Board Results" },
                  { icon: <Bell size={14} />, label: "Latest Notices" },
                  { icon: <Calendar size={14} />, label: "Academic Calendar" },
                ].map((chip) => (
                  <div
                    key={chip.label}
                    className="flex items-center gap-2 px-4 py-2 border"
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      borderColor: "rgba(255,255,255,0.14)",
                    }}
                  >
                    <span className="text-white/60">{chip.icon}</span>
                    <span className="text-white/70 text-xs font-medium tracking-wide">
                      {chip.label}
                    </span>
                  </div>
                ))}
              </div>
            </Up>
          </div>
        </div>
      </header>

      {/* ═══ SECTION 2 — TAB NAVIGATION ════════════════════════════════════════ */}
      <nav className="sticky top-0 z-30 bg-first border-b shadow-sm" style={{ borderColor: "var(--bg-third)" }}>
        <div className="max-w-7xl mx-auto px-4 md:px-10 flex items-center justify-between">
          {/* Tabs — horizontally scrollable on mobile */}
          <div className="flex overflow-x-auto scrollbar-hide -mb-px">
            {[
              { key: "results",  label: "Results",  icon: <ClipboardList size={15} /> },
              { key: "notices",  label: "Notices",  icon: <Bell size={15} /> },
              { key: "calendar", label: "Calendar", icon: <CalendarDays size={15} /> },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-5 py-4 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors duration-150 ${
                  activeTab === tab.key
                    ? "border-primary text-primary"
                    : "border-transparent text-ternary hover:text-primary"
                }`}
                style={{ fontFamily: "var(--font-text)" }}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
          {/* Count badges — desktop only */}
          <div className="hidden md:flex items-center gap-4">
            <span className="text-xs text-ternary">{RESULTS_DATA.length} Results</span>
            <span className="w-px h-4 bg-third" />
            <span className="text-xs text-ternary">{NOTICES_DATA.length} Notices</span>
            <span className="w-px h-4 bg-third" />
            <span className="text-xs text-ternary">{CALENDAR_DATA.length} Events</span>
          </div>
        </div>
      </nav>

      {/* ═══ SECTION 3 — RESULTS TAB ════════════════════════════════════════════ */}
      {activeTab === "results" && (
        <section className="max-w-7xl mx-auto px-4 md:px-10 py-10 md:py-14">
          <Up delay={0}>
            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-3 mb-8 items-start sm:items-center justify-between">
              {/* Exam type pills */}
              <div className="flex flex-wrap gap-2">
                {examFilters.map((f) => (
                  <button
                    key={f}
                    onClick={() => setExamFilter(f)}
                    className={`px-4 py-1.5 text-xs font-semibold border transition-colors duration-150 ${
                      examFilter === f
                        ? "bg-primary text-white border-primary"
                        : "bg-second text-ternary hover:bg-third"
                    }`}
                    style={{ borderColor: examFilter === f ? undefined : "var(--bg-third)" }}
                  >
                    {f}
                  </button>
                ))}
              </div>
              {/* Class filter */}
              <select
                value={classFilter === "All" ? "All Classes" : `Class ${classFilter}`}
                onChange={(e) => {
                  const v = e.target.value;
                  setClassFilter(v === "All Classes" ? "All" : v.replace("Class ", ""));
                }}
                className="bg-second text-ternary text-sm px-3 py-2 border focus:outline-none focus:border-primary"
                style={{
                  borderColor: "var(--bg-third)",
                  fontFamily: "var(--font-text)",
                }}
              >
                {classOptions.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </div>
          </Up>

          {/* Results Grid */}
          <div className="grid md:grid-cols-2 gap-4">
            {filteredResults.map((result, i) => (
              <Up key={result.id} delay={i * 80}>
                <ResultCard result={result} />
              </Up>
            ))}
            {filteredResults.length === 0 && (
              <Up delay={0} className="md:col-span-2">
                <div className="flex flex-col items-center justify-center py-20 bg-second">
                  <SearchX size={40} className="text-ternary opacity-30 mb-3" />
                  <p className="text-sm text-ternary">No results match this filter</p>
                  <p className="text-xs text-ternary opacity-60 mt-1">Try selecting "All" or a different class</p>
                </div>
              </Up>
            )}
          </div>
        </section>
      )}

      {/* ═══ SECTION 4 — NOTICES TAB ════════════════════════════════════════════ */}
      {activeTab === "notices" && (
        <section className="max-w-7xl mx-auto px-4 md:px-10 py-10 md:py-14">
          <Up delay={0}>
            {/* Search + Category Filter */}
            <div className="flex flex-col sm:flex-row gap-3 mb-8 items-start sm:items-center justify-between">
              {/* Search */}
              <div className="relative">
                <Search
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-ternary pointer-events-none"
                />
                <input
                  type="text"
                  value={noticeSearch}
                  onChange={(e) => setNoticeSearch(e.target.value)}
                  placeholder="Search notices..."
                  className="bg-second border text-sm pl-9 pr-4 py-2 w-64 focus:outline-none focus:border-primary text-ternary placeholder-ternary/50"
                  style={{
                    borderColor: "var(--bg-third)",
                    fontFamily: "var(--font-text)",
                  }}
                />
              </div>
              {/* Category pills */}
              <div className="flex flex-wrap gap-2">
                {noticeCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setNoticeCategory(cat)}
                    className={`px-4 py-1.5 text-xs font-semibold border transition-colors duration-150 ${
                      noticeCategory === cat
                        ? cat === "Urgent"
                          ? "bg-red-600 text-white border-red-600"
                          : "bg-primary text-white border-primary"
                        : "bg-second text-ternary hover:bg-third"
                    }`}
                    style={{
                      borderColor:
                        noticeCategory === cat ? undefined : "var(--bg-third)",
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </Up>

          {/* Notices List */}
          {filteredNotices.length > 0 ? (
            <div className="flex flex-col gap-3">
              {filteredNotices.map((notice, i) => (
                <Up key={notice.id} delay={i * 60}>
                  <NoticeCard notice={notice} />
                </Up>
              ))}
            </div>
          ) : (
            <Up delay={0}>
              <div className="flex flex-col items-center justify-center py-16 bg-second">
                <SearchX size={40} className="text-ternary opacity-30 mb-3" />
                <p className="text-sm text-ternary">No notices found</p>
                <p className="text-xs text-ternary opacity-60 mt-1">
                  Try adjusting your search or filter
                </p>
              </div>
            </Up>
          )}
        </section>
      )}

      {/* ═══ SECTION 5 — CALENDAR TAB ═══════════════════════════════════════════ */}
      {activeTab === "calendar" && (
        <section className="max-w-7xl mx-auto px-4 md:px-10 py-10 md:py-14">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Left — event list */}
            <div className="md:col-span-2">
              {[...groupedCalendar.entries()].map(([month, events], mi) => (
                <Up key={month} delay={mi * 80}>
                  {/* Month header */}
                  <div className={`flex items-center gap-3 mb-4 ${mi === 0 ? "mt-0" : "mt-10"}`}>
                    <h3
                      className="text-primary font-bold text-lg"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      {month}
                    </h3>
                    <span
                      className="bg-second text-ternary text-xs px-2 py-0.5"
                      style={{ fontFamily: "var(--font-text)" }}
                    >
                      {events.length} event{events.length !== 1 ? "s" : ""}
                    </span>
                  </div>

                  {/* Events */}
                  <div className="flex flex-col">
                    {events.map((ev) => {
                      const isMultiDay = ev.date_from !== ev.date_to;
                      return (
                        <div
                          key={ev.id}
                          className="flex items-start gap-4 py-3.5 border-b last:border-0"
                          style={{ borderColor: "var(--bg-third)" }}
                        >
                          {/* Date block */}
                          <div className="shrink-0 text-center w-12">
                            <div
                              className="text-primary font-bold text-lg leading-none"
                              style={{ fontFamily: "var(--font-heading)" }}
                            >
                              {getDayNum(ev.date_from)}
                            </div>
                            <div className="text-ternary text-xs tracking-widest uppercase mt-0.5">
                              {getMonthShort(ev.date_from)}
                            </div>
                          </div>
                          {/* Content */}
                          <div className="flex-1">
                            <span
                              className={`inline-block text-xs font-semibold px-2.5 py-0.5 ${CALENDAR_BADGE_CLASSES[ev.type] || "bg-slate-100 text-slate-600"}`}
                            >
                              {ev.type}
                            </span>
                            <p
                              className="text-primary font-medium text-sm mt-1"
                              style={{ fontFamily: "var(--font-text)" }}
                            >
                              {ev.label}
                            </p>
                            {isMultiDay && (
                              <p className="text-xs text-ternary mt-0.5">
                                {shortDate(ev.date_from)} – {shortDate(ev.date_to)}
                              </p>
                            )}
                          </div>
                          {/* Calendar icon */}
                          <Calendar size={14} className="text-ternary opacity-50 mt-1 shrink-0" />
                        </div>
                      );
                    })}
                  </div>
                </Up>
              ))}
            </div>

            {/* Right — sticky sidebar */}
            <div className="md:col-span-1">
              <div className="sticky top-20 flex flex-col gap-4">
                {/* Upcoming events */}
                <Up delay={0}>
                  <div className="bg-second p-5">
                    <h4
                      className="text-primary font-semibold text-sm mb-4"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      Coming Up Next
                    </h4>
                    <div className="flex flex-col">
                      {upcomingEvents.map((ev) => (
                        <div
                          key={ev.id}
                          className="flex items-center gap-3 py-2.5 border-b last:border-0"
                          style={{ borderColor: "var(--bg-third)" }}
                        >
                          <span
                            className={`w-2 h-2 rounded-full shrink-0 ${CALENDAR_DOT_CLASSES[ev.type] || "bg-slate-400"}`}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-primary font-medium leading-snug truncate">
                              {ev.label}
                            </p>
                          </div>
                          <span className="text-xs text-ternary shrink-0">
                            {shortDate(ev.date_from)}
                          </span>
                        </div>
                      ))}
                      {upcomingEvents.length === 0 && (
                        <p className="text-xs text-ternary italic">No upcoming events</p>
                      )}
                    </div>
                  </div>
                </Up>

                {/* Legend */}
                <Up delay={80}>
                  <div className="bg-second p-5">
                    <h4
                      className="text-primary font-semibold text-sm mb-4"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      Legend
                    </h4>
                    <div className="flex flex-col">
                      {Object.entries(CALENDAR_DOT_CLASSES).map(([type, dotClass]) => (
                        <div
                          key={type}
                          className="flex items-center gap-2 py-1.5 text-xs text-ternary"
                        >
                          <span className={`w-2 h-2 rounded-full ${dotClass}`} />
                          {type}
                        </div>
                      ))}
                    </div>
                  </div>
                </Up>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ═══ SECTION 6 — BOTTOM INFO STRIP ══════════════════════════════════════ */}
      <footer
        className="bg-second border-t py-8"
        style={{ borderColor: "var(--bg-third)" }}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Left */}
          <div>
            <p className="text-sm text-ternary">
              For official UP Board results, visit the UPMSP official portal
            </p>
            <a
              href="https://upmsp.edu.in"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary font-semibold text-sm underline underline-offset-2 inline-flex items-center gap-1 mt-1 hover:text-secondary transition-colors"
            >
              upmsp.edu.in
              <ChevronRight size={13} />
            </a>
          </div>
          {/* Right */}
          <div>
            <p className="text-sm text-ternary">Need help? Contact the school office</p>
            <div className="flex items-center gap-4 mt-1 flex-wrap">
              <span className="flex items-center gap-1.5 text-sm text-primary font-medium">
                <Mail size={14} className="text-ternary" />
                kisansakhopar@gmail.com
              </span>
              <span className="flex items-center gap-1.5 text-xs text-ternary">
                <Clock size={12} />
                Mon–Sat, 9 AM–3 PM
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ─── Result Card ──────────────────────────────────────────────────────────────
function ResultCard({ result }) {
  return (
    <div className="bg-second hover:bg-third transition-colors duration-150 p-6 h-full">
      {/* Top row */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="bg-primary text-white text-xs font-bold px-2.5 py-1 tracking-wider">
            CLASS {result.class}
          </span>
          <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-2 py-0.5">
            {result.exam_type}
          </span>
        </div>
        <StatusBadge status={result.status} />
      </div>

      {/* Title */}
      <h3
        className="text-primary font-semibold text-sm mt-3 mb-1"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        {result.title}
      </h3>

      {/* Meta */}
      <div className="flex items-center gap-4 text-xs text-ternary mt-1 mb-4 flex-wrap">
        <span className="flex items-center gap-1.5">
          <Calendar size={12} />
          {result.declared_on ? formatDate(result.declared_on) : "—"}
        </span>
        <span className="flex items-center gap-1.5">
          <BookOpen size={12} />
          {result.session}
        </span>
      </div>

      {/* Declared content */}
      {result.status === "declared" && (
        <>
          {/* Pass rate bar */}
          <div>
            <div className="flex justify-between text-xs text-ternary mb-1.5">
              <span>Pass Rate</span>
              <span className="font-bold text-primary">{result.pass_percentage}%</span>
            </div>
            <div className="w-full h-2 bg-third">
              <div
                className="h-full bg-primary transition-all duration-700"
                style={{ width: `${result.pass_percentage}%` }}
              />
            </div>
          </div>

          {/* Toppers */}
          {result.toppers.length > 0 && (
            <div className="mt-4">
              <p className="text-xs font-semibold text-ternary uppercase tracking-widest mb-2">
                Top Performers
              </p>
              <div className="flex flex-col">
                {result.toppers.map((t, idx) => (
                  <div
                    key={t.name}
                    className="flex items-center justify-between py-1.5 border-b last:border-0"
                    style={{ borderColor: "var(--bg-third)" }}
                  >
                    <span className="text-sm text-primary font-medium flex items-center gap-2">
                      <span>{MEDAL[idx]}</span>
                      {t.name}
                      {t.stream && (
                        <span className="text-xs text-ternary font-normal">({t.stream})</span>
                      )}
                    </span>
                    <span className="text-sm font-bold text-primary">
                      {t.marks}/{t.out_of}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Upcoming placeholder */}
      {result.status === "upcoming" && (
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <Clock size={28} className="text-ternary opacity-50 mb-2" />
          <p className="text-sm text-ternary">Result not yet declared</p>
          <p className="text-xs text-ternary opacity-70 mt-1">
            Check back after the examination period
          </p>
        </div>
      )}

      {/* Bottom row */}
      <div
        className="flex items-center justify-between mt-4 pt-4 border-t"
        style={{ borderColor: "var(--bg-third)" }}
      >
        {result.pdf_url ? (
          <a
            href={result.pdf_url}
            className="text-xs font-semibold text-primary flex items-center gap-1 hover:underline"
          >
            <Download size={12} /> Download PDF
          </a>
        ) : (
          <span className="text-xs text-ternary italic">PDF not available</span>
        )}
        <span className="text-xs text-ternary">Session {result.session}</span>
      </div>
    </div>
  );
}

// ─── Status Badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const classes = {
    declared:   "bg-emerald-100 text-emerald-700",
    upcoming:   "bg-blue-100 text-blue-700",
    processing: "bg-amber-100 text-amber-700",
  };
  const labels = {
    declared:   "Declared",
    upcoming:   "Upcoming",
    processing: "Processing",
  };
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 ${classes[status] || classes.processing}`}>
      {labels[status] || status}
    </span>
  );
}

// ─── Notice Card ──────────────────────────────────────────────────────────────
function NoticeCard({ notice }) {
  const ago = daysAgo(notice.issued_on);
  const isNew = ago <= 3;

  return (
    <div
      className={`p-5 transition-colors duration-150 ${
        notice.is_pinned
          ? "border-l-4 border-primary bg-second"
          : "bg-second hover:bg-third border"
      }`}
      style={
        notice.is_pinned
          ? undefined
          : { borderColor: "var(--bg-third)" }
      }
    >
      <div className="flex items-start gap-5 flex-col sm:flex-row">
        {/* Main content */}
        <div className="flex-1">
          {/* Category + pin badge */}
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span
              className={`text-xs font-semibold px-2.5 py-0.5 ${
                NOTICE_BADGE_CLASSES[notice.category] || "bg-slate-100 text-slate-600"
              }`}
            >
              {notice.category}
            </span>
            {notice.is_pinned && (
              <span className="flex items-center gap-1 text-xs text-primary font-semibold">
                <Pin size={11} />
                Pinned
              </span>
            )}
          </div>

          {/* Title */}
          <h3
            className="text-primary font-semibold text-sm leading-snug"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {notice.title}
          </h3>

          {/* Body */}
          <p className="text-ternary text-sm leading-relaxed mt-1">
            {notice.body}
          </p>

          {/* Meta */}
          <div className="flex items-center gap-4 text-xs text-ternary mt-3 flex-wrap">
            <span className="flex items-center gap-1.5">
              <Calendar size={11} />
              Issued: {formatDate(notice.issued_on)}
            </span>
            {notice.valid_until && (
              <span className="flex items-center gap-1.5">
                <Clock size={11} />
                Valid until: {formatDate(notice.valid_until)}
              </span>
            )}
          </div>
        </div>

        {/* Action column */}
        <div className="shrink-0 flex flex-row sm:flex-col items-center sm:items-end gap-2">
          {notice.attachment_url && (
            <a
              href={notice.attachment_url}
              className="bg-primary text-white text-xs font-semibold px-4 py-2 hover:bg-secondary transition-colors flex items-center gap-1.5"
            >
              <Download size={12} />
              Download
            </a>
          )}
          {isNew ? (
            <span className="bg-emerald-500 text-white text-xs font-bold px-2 py-0.5">
              New
            </span>
          ) : (
            <span className="text-xs text-ternary whitespace-nowrap">
              {ago}d ago
            </span>
          )}
        </div>
      </div>
    </div>
  );
}