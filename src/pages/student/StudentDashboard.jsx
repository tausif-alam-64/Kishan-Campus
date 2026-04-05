// import React from 'react'
// import { useAuth } from '../../hooks/useAuth'

// const StudentDashboard = () => {

//     const {user} = useAuth();
//   return (
//     <div className='p-6'>
//       <h1 className='text-3xl font-bold'>
//         Welcome, {user?.user_metadata?.full_name || "Student"}
//       </h1>
//       <p className='mt-2 text-gray-600'>
//         This is your student Dashboard.
//       </p>
//     </div>
//   )
// }

// export default StudentDashboard


import React, {
  useState, useEffect, useCallback, useRef, createContext, useContext,
} from "react";
import { useAuth } from "../../hooks/useAuth";
import { supabase } from "../../services/supabase/supabaseClient";

/* ═══════════════════════════════════════════
   CONSTANTS
═══════════════════════════════════════════ */
const DAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const TIME_SLOTS = ["8:00","8:45","9:30","10:15","11:00","11:45","12:30","1:15","2:00","2:45"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

/* ═══════════════════════════════════════════
   UTILITIES
═══════════════════════════════════════════ */
const timeAgo = (d) => {
  if (!d) return "";
  const s = (Date.now() - new Date(d)) / 1000;
  if (s < 60) return "Just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  if (s < 172800) return "Yesterday";
  return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
};

const getGrade = (pct) => {
  if (pct >= 90) return { g: "A1", cls: "text-emerald-700 bg-emerald-50 border-emerald-200" };
  if (pct >= 80) return { g: "A2", cls: "text-emerald-600 bg-emerald-50 border-emerald-200" };
  if (pct >= 70) return { g: "B1", cls: "text-blue-700 bg-blue-50 border-blue-200" };
  if (pct >= 60) return { g: "B2", cls: "text-blue-600 bg-blue-50 border-blue-200" };
  if (pct >= 50) return { g: "C",  cls: "text-amber-700 bg-amber-50 border-amber-200" };
  if (pct >= 33) return { g: "D",  cls: "text-orange-600 bg-orange-50 border-orange-200" };
  return { g: "F", cls: "text-red-700 bg-red-50 border-red-200" };
};

const todayStr = () => new Date().toISOString().split("T")[0];
const todayDay = () => {
  const d = new Date().getDay();
  return DAYS[d === 0 ? 6 : d - 1];
};
const isPastDue = (d) => d && new Date(d) < new Date(todayStr());

/* ═══════════════════════════════════════════
   TOAST
═══════════════════════════════════════════ */
const ToastCtx = createContext(null);
const useToast = () => useContext(ToastCtx);

const ToastProvider = ({ children }) => {
  const [list, setList] = useState([]);
  const push = useCallback((msg, type = "success") => {
    const id = Date.now() + Math.random();
    setList(p => [...p, { id, msg, type }]);
    setTimeout(() => setList(p => p.filter(t => t.id !== id)), 3800);
  }, []);
  const COLORS = { success: "bg-emerald-600", error: "bg-red-600", info: "bg-secondary", warn: "bg-amber-500" };
  const ICONS  = { success: "✓", error: "✕", info: "ℹ", warn: "⚠" };
  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div className="fixed bottom-5 right-4 z-[9999] flex flex-col gap-2 pointer-events-none w-[280px]">
        {list.map(t => (
          <div key={t.id} className={`${COLORS[t.type]} text-white text-sm font-medium px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3`}>
            <span className="w-5 h-5 rounded-full bg-white/25 flex items-center justify-center text-xs font-bold flex-shrink-0">{ICONS[t.type]}</span>
            {t.msg}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
};

/* ═══════════════════════════════════════════
   SKELETON
═══════════════════════════════════════════ */
const Sk = ({ className = "" }) => (
  <div className={`animate-pulse bg-gray-100 rounded-xl ${className}`} />
);

/* ═══════════════════════════════════════════
   SHARED FORM ATOMS
═══════════════════════════════════════════ */
const Label = ({ c, note }) => (
  <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">
    {c}{note && <span className="normal-case font-normal ml-1 text-gray-300 text-xs">{note}</span>}
  </label>
);
const Inp = ({ className = "", ...p }) => (
  <input className={`w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition ${className}`} {...p} />
);
const Sel = ({ children, className = "", ...p }) => (
  <select className={`w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition bg-white ${className}`} {...p}>{children}</select>
);
const Txt = ({ className = "", ...p }) => (
  <textarea className={`w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition resize-none ${className}`} {...p} />
);
const PrimaryBtn = ({ children, loading, className = "", ...p }) => (
  <button className={`flex items-center justify-center gap-2 bg-secondary text-white rounded-xl font-semibold text-sm px-5 py-2.5 hover:bg-primary transition disabled:opacity-50 ${className}`} disabled={loading || p.disabled} {...p}>
    {loading && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
    {children}
  </button>
);

/* ═══════════════════════════════════════════
   SIDEBAR
═══════════════════════════════════════════ */
const NAV = [
  { id: "overview",   icon: "⊞",  label: "Overview" },
  { id: "attendance", icon: "✔",  label: "My Attendance" },
  { id: "homework",   icon: "📝", label: "Homework" },
  { id: "results",    icon: "📊", label: "My Results" },
  { id: "notices",    icon: "📢", label: "Notices" },
  { id: "materials",  icon: "📚", label: "Study Material" },
  { id: "timetable",  icon: "📅", label: "Timetable" },
  { id: "profile",    icon: "👤", label: "Profile" },
];

const SidebarContent = ({ active, setActive, student, newNoticeCount, closeMobile }) => (
  <div className="flex flex-col h-full bg-secondary">
    <div className="px-5 pt-6 pb-4 border-b border-white/10 flex-shrink-0">
      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/40 mb-0.5">Kishan Campus</p>
      <h1 className="text-white font-bold text-[17px] leading-tight">Student Portal</h1>
    </div>
    <div className="mx-3 mt-3 mb-2 bg-white/10 rounded-2xl p-3.5 flex items-center gap-3 flex-shrink-0">
      <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white font-bold text-base flex-shrink-0 overflow-hidden">
        {student?.avatar_url
          ? <img src={student.avatar_url} alt="" className="w-full h-full object-cover" />
          : (student?.full_name?.[0]?.toUpperCase() || "S")}
      </div>
      <div className="min-w-0">
        <p className="text-white font-semibold text-sm truncate">{student?.full_name || "Student"}</p>
        <p className="text-white/50 text-xs truncate">
          {student?.class_name ? `${student.class_name}${student.section ? " — Sec " + student.section : ""}` : "Class not set"}
        </p>
      </div>
    </div>
    <nav className="flex-1 px-2 py-2 overflow-y-auto space-y-0.5">
      {NAV.map(n => (
        <button key={n.id}
          onClick={() => { setActive(n.id); closeMobile?.(); }}
          className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${
            active === n.id ? "bg-white text-secondary shadow-sm" : "text-white/60 hover:bg-white/10 hover:text-white"
          }`}>
          <span className="w-5 text-center text-base leading-none">{n.icon}</span>
          <span className="flex-1">{n.label}</span>
          {n.id === "notices" && newNoticeCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">{newNoticeCount}</span>
          )}
        </button>
      ))}
    </nav>
  </div>
);

/* ═══════════════════════════════════════════
   TAB: OVERVIEW
═══════════════════════════════════════════ */
const OverviewTab = ({ userId, student, setActiveTab }) => {
  const [stats, setStats]       = useState(null);
  const [schedule, setSchedule] = useState([]);
  const [notices, setNotices]   = useState([]);
  const [recentMarks, setRecentMarks] = useState([]);
  const [loading, setLoading]   = useState(true);
  const day = todayDay();

  useEffect(() => {
    if (!userId || !student?.class_name) return;
    const load = async () => {
      setLoading(true);
      try {
        const [attR, hwR, notR, ttR, mkR] = await Promise.all([
          // Attendance this month
          supabase.from("attendance")
            .select("status,date")
            .eq("student_id", userId)
            .gte("date", `${new Date().getFullYear()}-${String(new Date().getMonth()+1).padStart(2,"0")}-01`),
          // Homework due today or upcoming (3 days)
          supabase.from("homework")
            .select("id,subject,description,due_date,class_name")
            .eq("class_name", student.class_name)
            .eq("section", student.section || "")
            .gte("due_date", todayStr())
            .order("due_date").limit(5),
          // Latest 3 notices
          supabase.from("notices")
            .select("id,title,priority,issued_on,audience")
            .eq("is_published", true)
            .or(`audience.eq.All Students,audience.eq.${student.class_name}`)
            .order("issued_on", { ascending: false }).limit(3),
          // Today's timetable
          supabase.from("timetable")
            .select("*")
            .eq("class_name", student.class_name)
            .eq("section", student.section || "")
            .eq("day", day)
            .order("time_slot"),
          // Recent exam marks
          supabase.from("marks")
            .select("marks_obtained, exams(name,subject,max_marks,exam_date)")
            .eq("student_id", userId)
            .order("created_at", { ascending: false }).limit(4),
        ]);

        const att = attR.data || [];
        const totalDays = att.length;
        const presentDays = att.filter(a => a.status === "Present").length + att.filter(a => a.status === "Late").length * 0.5;
        const attPct = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 100;

        setStats({
          attPct,
          hwDue: (hwR.data || []).length,
          newNotices: (notR.data || []).length,
          totalDays,
        });
        setSchedule(ttR.data || []);
        setNotices(notR.data || []);
        setRecentMarks(mkR.data || []);
      } finally { setLoading(false); }
    };
    load();
  }, [userId, student, day]);

  const CARDS = stats ? [
    { label: "Attendance This Month", val: `${stats.attPct}%`, icon: "✔",  bg: stats.attPct < 75 ? "bg-red-500" : "bg-emerald-600", tab: "attendance" },
    { label: "Homework Due",          val: stats.hwDue,        icon: "📝", bg: "bg-amber-500",  tab: "homework" },
    { label: "New Notices",           val: stats.newNotices,   icon: "📢", bg: "bg-primary",    tab: "notices" },
    { label: "School Days (Month)",   val: stats.totalDays,    icon: "📅", bg: "bg-secondary",  tab: "attendance" },
  ] : [];

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
          {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
        </p>
        <h2 className="text-2xl font-bold text-secondary mt-1">Good morning 👋</h2>
        <p className="text-sm text-gray-500 mt-0.5">
          {student?.class_name ? `${student.class_name}${student.section ? " — Section " + student.section : ""}` : "Welcome back"}
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {loading
          ? Array(4).fill(0).map((_,i) => <Sk key={i} className="h-[100px]" />)
          : CARDS.map(c => (
            <button key={c.label} onClick={() => setActiveTab(c.tab)}
              className={`${c.bg} rounded-2xl p-4 text-left text-white hover:opacity-90 transition active:scale-95 focus:outline-none`}>
              <span className="text-2xl block mb-3 leading-none">{c.icon}</span>
              <p className="text-3xl font-bold leading-none">{c.val}</p>
              <p className="text-xs text-white/70 mt-1.5 leading-snug">{c.label}</p>
            </button>
          ))}
      </div>

      {/* Low attendance warning */}
      {stats && stats.attPct < 75 && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3">
          <span className="text-xl flex-shrink-0">⚠</span>
          <div>
            <p className="font-bold text-red-700 text-sm">Attendance Below 75%</p>
            <p className="text-red-600 text-xs mt-0.5">Your attendance is {stats.attPct}% this month. Students below 75% may be restricted from exams. Please attend regularly.</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Today's Schedule */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-4">
            Today's Classes <span className="text-primary normal-case font-normal">({day})</span>
          </p>
          {loading
            ? Array(3).fill(0).map((_,i) => <Sk key={i} className="h-14 mb-2" />)
            : schedule.length === 0
              ? <p className="text-sm text-gray-400 text-center py-8">No classes today.</p>
              : <div className="space-y-2">
                {schedule.map((s, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition">
                    <p className="text-xs font-bold text-primary min-w-[48px]">{s.time_slot}</p>
                    <div className="w-px h-7 bg-gray-100" />
                    <div>
                      <p className="text-xs font-semibold text-secondary">{s.subject || "Period"}</p>
                      {s.room && <p className="text-[11px] text-gray-400">Room {s.room}</p>}
                    </div>
                  </div>
                ))}
              </div>}
        </div>

        {/* Upcoming Homework */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400">Upcoming Homework</p>
            <button onClick={() => setActiveTab("homework")} className="text-xs text-primary font-bold hover:underline">View all →</button>
          </div>
          {loading
            ? Array(3).fill(0).map((_,i) => <Sk key={i} className="h-14 mb-2" />)
            : recentMarks.length === 0 && notices.length === 0
              ? <p className="text-sm text-gray-400 text-center py-8">No homework due.</p>
              : <div className="space-y-2">
                {/* We show notices here as placeholder since homework state is in OverviewTab — redirect to homework tab */}
                <p className="text-sm text-gray-400 text-center py-8">
                  <button onClick={() => setActiveTab("homework")} className="text-primary font-semibold hover:underline">See Homework tab →</button>
                </p>
              </div>}
        </div>

        {/* Recent Notices */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400">Recent Notices</p>
            <button onClick={() => setActiveTab("notices")} className="text-xs text-primary font-bold hover:underline">View all →</button>
          </div>
          {loading
            ? Array(3).fill(0).map((_,i) => <Sk key={i} className="h-11 mb-2" />)
            : notices.length === 0
              ? <p className="text-sm text-gray-400 text-center py-8">No notices yet.</p>
              : <div className="space-y-2">
                {notices.map(n => (
                  <div key={n.id} className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition">
                    <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${n.priority === "Urgent" ? "bg-red-500" : "bg-primary"}`} />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-secondary truncate">{n.title}</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">{timeAgo(n.issued_on)}</p>
                    </div>
                  </div>
                ))}
              </div>}
        </div>

      </div>

      {/* Recent Marks */}
      {recentMarks.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400">Recent Results</p>
            <button onClick={() => setActiveTab("results")} className="text-xs text-primary font-bold hover:underline">View all →</button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {recentMarks.map((m, i) => {
              const pct = m.exams ? Math.round((m.marks_obtained / m.exams.max_marks) * 100) : 0;
              const gr = getGrade(pct);
              return (
                <div key={i} className="border border-gray-100 rounded-2xl p-4 text-center hover:bg-gray-50 transition">
                  <p className="text-xs text-gray-400 truncate">{m.exams?.subject || "—"}</p>
                  <p className="text-2xl font-bold text-secondary mt-1">{m.marks_obtained}</p>
                  <p className="text-[11px] text-gray-400">/ {m.exams?.max_marks}</p>
                  <span className={`mt-2 inline-block px-2 py-0.5 rounded-lg text-xs font-bold border ${gr.cls}`}>{gr.g}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════
   TAB: MY ATTENDANCE
═══════════════════════════════════════════ */
const AttendanceTab = ({ userId }) => {
  const [sub, setSub] = useState("monthly");
  const [month, setMonth] = useState(new Date().getMonth());
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) return;
    const load = async () => {
      setLoading(true);
      const yr = new Date().getFullYear();
      const s0 = `${yr}-${String(month+1).padStart(2,"0")}-01`;
      const s1 = new Date(yr, month+1, 0).toISOString().split("T")[0];
      const { data } = await supabase.from("attendance")
        .select("date,status")
        .eq("student_id", userId)
        .gte("date", s0).lte("date", s1)
        .order("date");
      setRecords(data || []);
      setLoading(false);
    };
    load();
  }, [userId, month]);

  const present = records.filter(r => r.status === "Present").length;
  const absent  = records.filter(r => r.status === "Absent").length;
  const late    = records.filter(r => r.status === "Late").length;
  const total   = records.length;
  const pct     = total > 0 ? Math.round(((present + late * 0.5) / total) * 100) : 0;

  const STATUS_COLOR = {
    Present: "bg-emerald-500 text-white",
    Absent:  "bg-red-500 text-white",
    Late:    "bg-amber-400 text-white",
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-secondary">My Attendance</h2>
          <p className="text-xs text-gray-400 mt-0.5">Track your daily presence and monthly summary.</p>
        </div>
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl text-xs font-semibold">
          {[["monthly","📊 Monthly"],["calendar","📅 Calendar"]].map(([id,lbl]) => (
            <button key={id} onClick={() => setSub(id)}
              className={`px-3 py-1.5 rounded-lg transition ${sub===id?"bg-white text-secondary shadow-sm":"text-gray-500 hover:text-secondary"}`}>
              {lbl}
            </button>
          ))}
        </div>
      </div>

      {/* Month selector */}
      <div className="w-48">
        <Label c="Month" />
        <Sel value={month} onChange={e => setMonth(Number(e.target.value))}>
          {MONTHS.map((m,i) => <option key={m} value={i}>{m}</option>)}
        </Sel>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Present",     val: present, bg: "bg-emerald-600" },
          { label: "Absent",      val: absent,  bg: "bg-red-500" },
          { label: "Late",        val: late,    bg: "bg-amber-500" },
          { label: "Attendance%", val: `${pct}%`, bg: pct < 75 ? "bg-red-600" : "bg-secondary" },
        ].map(c => (
          <div key={c.label} className={`${c.bg} rounded-2xl p-4 text-white`}>
            <p className="text-2xl font-bold">{c.val}</p>
            <p className="text-xs text-white/70 mt-1">{c.label}</p>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <div className="flex justify-between text-sm font-semibold text-secondary mb-2">
          <span>Monthly Attendance</span>
          <span className={pct < 75 ? "text-red-600" : "text-emerald-600"}>{pct}%</span>
        </div>
        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all duration-700 ${pct >= 75 ? "bg-emerald-500" : "bg-red-500"}`} style={{ width: `${pct}%` }} />
        </div>
        {pct < 75 && (
          <p className="text-xs text-red-500 font-semibold mt-3">
            ⚠ Your attendance is below 75%. Minimum 75% required to sit in exams.
          </p>
        )}
      </div>

      {/* Daily records */}
      {sub === "monthly" && (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-5 py-3 bg-gray-50 border-b border-gray-100 grid grid-cols-[1fr_80px_1fr] text-[11px] font-bold uppercase tracking-wide text-gray-400">
            <span>Date</span><span className="text-center">Status</span><span className="text-right">Day</span>
          </div>
          {loading
            ? Array(8).fill(0).map((_,i) => <Sk key={i} className="h-12 m-3" />)
            : records.length === 0
              ? <p className="text-center text-gray-400 py-12 text-sm">No records for {MONTHS[month]}.</p>
              : <div className="divide-y divide-gray-50">
                {records.map((r, i) => {
                  const d = new Date(r.date);
                  return (
                    <div key={i} className="grid grid-cols-[1fr_80px_1fr] items-center px-5 py-3 hover:bg-gray-50 transition">
                      <span className="text-sm font-medium text-secondary">
                        {d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                      </span>
                      <span className={`text-center text-xs font-bold px-2 py-0.5 rounded-xl ${STATUS_COLOR[r.status] || "bg-gray-100 text-gray-500"}`}>
                        {r.status}
                      </span>
                      <span className="text-right text-xs text-gray-400">
                        {d.toLocaleDateString("en-IN", { weekday: "long" })}
                      </span>
                    </div>
                  );
                })}
              </div>}
        </div>
      )}

      {/* Calendar view */}
      {sub === "calendar" && (
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <p className="font-bold text-secondary mb-4">{MONTHS[month]} {new Date().getFullYear()}</p>
          {loading
            ? <Sk className="h-48" />
            : (() => {
              const yr = new Date().getFullYear();
              const daysInMonth = new Date(yr, month+1, 0).getDate();
              const firstDay = new Date(yr, month, 1).getDay();
              const recordMap = {};
              records.forEach(r => { recordMap[r.date] = r.status; });
              const cells = [];
              for (let i = 0; i < (firstDay === 0 ? 6 : firstDay - 1); i++) cells.push(null);
              for (let d = 1; d <= daysInMonth; d++) cells.push(d);

              return (
                <div>
                  <div className="grid grid-cols-7 mb-2">
                    {["Mo","Tu","We","Th","Fr","Sa","Su"].map(d => (
                      <div key={d} className="text-center text-[11px] font-bold text-gray-400 py-1">{d}</div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {cells.map((d, i) => {
                      if (!d) return <div key={i} />;
                      const key = `${yr}-${String(month+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
                      const st = recordMap[key];
                      return (
                        <div key={i} className={`aspect-square flex items-center justify-center rounded-xl text-xs font-semibold ${
                          st === "Present" ? "bg-emerald-100 text-emerald-700" :
                          st === "Absent"  ? "bg-red-100 text-red-700" :
                          st === "Late"    ? "bg-amber-100 text-amber-700" :
                          "text-gray-300"
                        }`}>
                          {d}
                        </div>
                      );
                    })()}
                  </div>
                  <div className="flex items-center gap-4 mt-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-md bg-emerald-100" />Present</span>
                    <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-md bg-red-100" />Absent</span>
                    <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-md bg-amber-100" />Late</span>
                  </div>
                </div>
              );
            })()}
        </div>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════
   TAB: HOMEWORK
═══════════════════════════════════════════ */
const HomeworkTab = ({ student }) => {
  const [homeworks, setHomeworks]   = useState([]);
  const [loading, setLoading]       = useState(true);
  const [filter, setFilter]         = useState("All");
  const [doneIds, setDoneIds]       = useState(() => {
    try { return JSON.parse(localStorage.getItem("hw_done") || "[]"); } catch { return []; }
  });

  const fetchHW = useCallback(async () => {
    if (!student?.class_name) return;
    setLoading(true);
    const { data } = await supabase.from("homework")
      .select("*")
      .eq("class_name", student.class_name)
      .eq("section", student.section || "")
      .eq("status", "active")
      .order("due_date");
    setHomeworks(data || []);
    setLoading(false);
  }, [student]);

  useEffect(() => { fetchHW(); }, [fetchHW]);

  const toggleDone = (id) => {
    setDoneIds(prev => {
      const updated = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      localStorage.setItem("hw_done", JSON.stringify(updated));
      return updated;
    });
  };

  const subjects = ["All", ...new Set(homeworks.map(h => h.subject).filter(Boolean))];
  const filtered = filter === "All" ? homeworks : homeworks.filter(h => h.subject === filter);
  const pending  = filtered.filter(h => !doneIds.includes(h.id));
  const done     = filtered.filter(h => doneIds.includes(h.id));

  const HWCard = ({ hw }) => {
    const isDone   = doneIds.includes(hw.id);
    const overdue  = isPastDue(hw.due_date);
    return (
      <div className={`bg-white rounded-2xl border p-4 hover:shadow-md transition flex flex-col ${isDone ? "border-emerald-200 opacity-70" : overdue ? "border-red-200" : "border-gray-100"}`}>
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex gap-1.5 flex-wrap">
            <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-lg text-[11px] font-bold">{hw.subject}</span>
            <span className="px-2 py-0.5 bg-secondary/10 text-secondary rounded-lg text-[11px] font-bold">{hw.class_name}</span>
          </div>
          {overdue && !isDone && <span className="px-2 py-0.5 bg-red-50 text-red-600 rounded-lg text-[11px] font-bold flex-shrink-0">Overdue</span>}
          {isDone && <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-lg text-[11px] font-bold flex-shrink-0">✓ Done</span>}
        </div>
        <p className="text-sm text-secondary font-medium leading-snug flex-1 mb-3">{hw.description}</p>
        <div className="flex items-center justify-between text-[11px] text-gray-400 mb-3">
          <span>Assigned: {hw.assigned_date}</span>
          <span className={overdue && !isDone ? "text-red-500 font-semibold" : ""}>Due: {hw.due_date}</span>
        </div>
        {hw.file_url && (
          <a href={hw.file_url} target="_blank" rel="noreferrer" className="text-xs text-primary font-semibold hover:underline mb-3 flex items-center gap-1">
            📎 View Attachment
          </a>
        )}
        <div className="flex gap-2 pt-2 border-t border-gray-50">
          <button onClick={() => toggleDone(hw.id)}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-xl border transition ${
              isDone
                ? "text-gray-500 border-gray-200 hover:bg-gray-50"
                : "text-emerald-600 border-emerald-200 hover:bg-emerald-50"
            }`}>
            {isDone ? "Mark Pending" : "Mark as Done ✓"}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-secondary">Homework & Assignments</h2>
        <p className="text-xs text-gray-400 mt-0.5">All homework assigned to your class.</p>
      </div>

      {/* Subject filter */}
      <div className="flex gap-2 flex-wrap">
        {subjects.map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition ${filter===s ? "bg-secondary text-white border-secondary" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
            {s}
          </button>
        ))}
      </div>

      {loading
        ? <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{Array(4).fill(0).map((_,i) => <Sk key={i} className="h-44" />)}</div>
        : filtered.length === 0
          ? <div className="text-center py-20 text-gray-400"><p className="text-4xl mb-2">🎉</p><p>No homework right now.</p></div>
          : <>
            {/* Pending */}
            {pending.length > 0 && (
              <>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400">{pending.length} Pending</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {pending.map(hw => <HWCard key={hw.id} hw={hw} />)}
                </div>
              </>
            )}
            {/* Done */}
            {done.length > 0 && (
              <>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mt-4">{done.length} Completed</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {done.map(hw => <HWCard key={hw.id} hw={hw} />)}
                </div>
              </>
            )}
          </>}
    </div>
  );
};

/* ═══════════════════════════════════════════
   TAB: MY RESULTS
═══════════════════════════════════════════ */
const ResultsTab = ({ userId }) => {
  const [exams, setExams]         = useState([]);
  const [selExam, setSelExam]     = useState(null);
  const [myMark, setMyMark]       = useState(null);
  const [classMarks, setClassMarks] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [filterType, setFilterType] = useState("All");

  useEffect(() => {
    if (!userId) return;
    const load = async () => {
      setLoading(true);
      const { data } = await supabase.from("marks")
        .select("marks_obtained, exams(id,name,subject,max_marks,exam_date,class_name,section)")
        .eq("student_id", userId)
        .order("created_at", { ascending: false });
      setExams(data || []);
      setLoading(false);
    };
    load();
  }, [userId]);

  const openDetail = async (entry) => {
    setSelExam(entry);
    setLoadingDetail(true);
    const { data } = await supabase.from("marks")
      .select("marks_obtained, students(full_name,roll_number)")
      .eq("exam_id", entry.exams.id)
      .order("marks_obtained", { ascending: false });
    setClassMarks(data || []);
    const me = (data || []).find(d => {
      const pct = Math.round((d.marks_obtained / entry.exams.max_marks) * 100);
      return Math.round((entry.marks_obtained / entry.exams.max_marks) * 100) === pct;
    });
    setMyMark(me);
    setLoadingDetail(false);
  };

  const EXAM_TYPES = ["All", "Board", "Half-Yearly", "Annual", "Unit Test", "Practical"];
  const filtered = filterType === "All" ? exams : exams.filter(e => e.exams?.name === filterType);

  const allPct = exams.length > 0
    ? Math.round(exams.reduce((s, e) => s + Math.round((e.marks_obtained / e.exams?.max_marks) * 100), 0) / exams.length)
    : 0;

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-secondary">My Results</h2>
        <p className="text-xs text-gray-400 mt-0.5">All your exam marks and grades in one place.</p>
      </div>

      {/* Overall summary */}
      {exams.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Exams Taken",   val: exams.length,                                  bg: "bg-secondary" },
            { label: "Average Score", val: `${allPct}%`,                                   bg: allPct >= 75 ? "bg-emerald-600" : "bg-amber-500" },
            { label: "Passed",        val: exams.filter(e => Math.round((e.marks_obtained/e.exams?.max_marks)*100) >= 33).length, bg: "bg-primary" },
            { label: "Best Grade",    val: (() => { const best = Math.max(...exams.map(e => Math.round((e.marks_obtained/e.exams?.max_marks)*100))); return getGrade(best).g; })(), bg: "bg-emerald-700" },
          ].map(c => (
            <div key={c.label} className={`${c.bg} rounded-2xl p-4 text-white`}>
              <p className="text-2xl font-bold">{c.val}</p>
              <p className="text-xs text-white/70 mt-1">{c.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Filter */}
      <div className="flex gap-2 flex-wrap">
        {EXAM_TYPES.map(t => (
          <button key={t} onClick={() => setFilterType(t)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition ${filterType===t ? "bg-secondary text-white border-secondary" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
            {t}
          </button>
        ))}
      </div>

      {/* Results list */}
      {loading
        ? <div className="space-y-3">{Array(5).fill(0).map((_,i) => <Sk key={i} className="h-20" />)}</div>
        : filtered.length === 0
          ? <div className="text-center py-20 text-gray-400"><p className="text-4xl mb-2">📊</p><p>No results yet.</p></div>
          : <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-5 py-3 font-semibold text-gray-500">Exam</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-500 hidden sm:table-cell">Subject</th>
                  <th className="text-center px-5 py-3 font-semibold text-gray-500">Marks</th>
                  <th className="text-center px-5 py-3 font-semibold text-gray-500 hidden sm:table-cell">%</th>
                  <th className="text-center px-5 py-3 font-semibold text-gray-500">Grade</th>
                  <th className="text-right px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((entry, i) => {
                  const pct = Math.round((entry.marks_obtained / entry.exams?.max_marks) * 100);
                  const gr  = getGrade(pct);
                  const pass = pct >= 33;
                  return (
                    <tr key={i} className={`hover:bg-gray-50/50 transition ${!pass ? "bg-red-50/30" : ""}`}>
                      <td className="px-5 py-4 font-semibold text-secondary">{entry.exams?.name}</td>
                      <td className="px-5 py-4 text-gray-600 hidden sm:table-cell">{entry.exams?.subject}</td>
                      <td className="px-5 py-4 text-center font-bold text-secondary">{entry.marks_obtained}/{entry.exams?.max_marks}</td>
                      <td className="px-5 py-4 text-center text-gray-600 hidden sm:table-cell">{pct}%</td>
                      <td className="px-5 py-4 text-center">
                        <span className={`px-2 py-0.5 rounded-lg text-xs font-bold border ${gr.cls}`}>{gr.g}</span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button onClick={() => openDetail(entry)} className="px-3 py-1.5 text-xs font-semibold bg-secondary text-white rounded-xl hover:bg-primary transition">
                          Detail →
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>}

      {/* Detail panel */}
      {selExam && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" onClick={() => setSelExam(null)} />
      )}
      {selExam && (
        <div className="fixed top-0 right-0 h-full w-full sm:w-[500px] bg-white z-50 shadow-2xl flex flex-col">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
            <h2 className="text-base font-bold text-secondary">{selExam.exams?.name} — {selExam.exams?.subject}</h2>
            <button onClick={() => setSelExam(null)} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 text-xl">×</button>
          </div>
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
            {loadingDetail
              ? Array(5).fill(0).map((_,i) => <Sk key={i} className="h-12" />)
              : <>
                {/* My result */}
                <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5 text-center">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Your Score</p>
                  <p className="text-4xl font-bold text-secondary">{selExam.marks_obtained}<span className="text-xl text-gray-400">/{selExam.exams?.max_marks}</span></p>
                  <p className="text-sm text-gray-500 mt-1">{Math.round((selExam.marks_obtained/selExam.exams?.max_marks)*100)}% — {getGrade(Math.round((selExam.marks_obtained/selExam.exams?.max_marks)*100)).g}</p>
                  <p className="mt-2 text-xs font-semibold">{Math.round((selExam.marks_obtained/selExam.exams?.max_marks)*100) >= 33 ? "✅ PASSED" : "❌ FAILED"}</p>
                </div>

                {/* Class rank */}
                {classMarks.length > 0 && (() => {
                  const rank = classMarks.findIndex(m => m.marks_obtained <= selExam.marks_obtained) + 1;
                  const top  = classMarks[0];
                  const avg  = Math.round(classMarks.reduce((s,m) => s+m.marks_obtained, 0) / classMarks.length);
                  return (
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { label: "Your Rank", val: `#${rank}`, bg: "bg-secondary" },
                        { label: "Class Avg", val: avg, bg: "bg-primary" },
                        { label: "Topper",    val: top?.marks_obtained, bg: "bg-emerald-600" },
                      ].map(c => (
                        <div key={c.label} className={`${c.bg} rounded-2xl p-4 text-white text-center`}>
                          <p className="text-2xl font-bold">{c.val}</p>
                          <p className="text-xs text-white/70 mt-1">{c.label}</p>
                        </div>
                      ))}
                    </div>
                  );
                })()}

                {/* Class scoreboard */}
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-3">Class Scoreboard</p>
                  <div className="space-y-2">
                    {classMarks.map((m, i) => {
                      const pct = Math.round((m.marks_obtained / selExam.exams?.max_marks) * 100);
                      const gr = getGrade(pct);
                      const isMe = m.marks_obtained === selExam.marks_obtained;
                      return (
                        <div key={i} className={`flex items-center gap-3 px-4 py-2.5 rounded-xl ${isMe ? "bg-primary/10 border border-primary/20" : "border border-gray-100 hover:bg-gray-50"} transition`}>
                          <span className="text-xs font-bold text-gray-400 w-6 text-center">{i+1}</span>
                          <p className="flex-1 text-sm font-medium text-secondary truncate">{isMe ? "You" : m.students?.full_name}</p>
                          <span className="text-sm font-bold text-secondary">{m.marks_obtained}</span>
                          <span className={`px-1.5 py-0.5 rounded-lg text-xs font-bold border ${gr.cls}`}>{gr.g}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>}
          </div>
        </div>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════
   TAB: NOTICES
═══════════════════════════════════════════ */
const NoticesTab = ({ student }) => {
  const [notices, setNotices]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState("");
  const [category, setCategory]   = useState("All");

  useEffect(() => {
    if (!student?.class_name) return;
    const load = async () => {
      setLoading(true);
      const { data } = await supabase.from("notices")
        .select("*")
        .eq("is_published", true)
        .or(`audience.eq.All Students,audience.eq.${student.class_name},audience.eq.Staff Only`)
        .order("is_pinned", { ascending: false })
        .order("issued_on", { ascending: false });
      setNotices(data || []);
      setLoading(false);
    };
    load();
  }, [student]);

  const CATS = ["All","Urgent","Exam","Holiday","Event","Admission","General"];
  const BADGE = {
    Urgent: "bg-red-100 text-red-700", Exam: "bg-amber-100 text-amber-800",
    Holiday: "bg-emerald-100 text-emerald-700", Event: "bg-blue-100 text-blue-700",
    Admission: "bg-violet-100 text-violet-700", General: "bg-slate-100 text-slate-600",
  };

  const filtered = notices.filter(n => {
    const q = search.toLowerCase().trim();
    const matchCat = category === "All" || n.category === category;
    const matchQ = !q || n.title.toLowerCase().includes(q) || n.body?.toLowerCase().includes(q);
    return matchCat && matchQ;
  });

  const isExpired = (n) => n.expiry_date && new Date(n.expiry_date) < new Date(todayStr());

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-secondary">School Notices</h2>
        <p className="text-xs text-gray-400 mt-0.5">Official announcements from your school and teachers.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        {/* Search */}
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
          <input
            type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search notices..."
            className="bg-gray-100 border border-transparent text-sm pl-9 pr-4 py-2 w-64 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary focus:bg-white transition"
          />
        </div>
        {/* Category filter */}
        <div className="flex gap-2 flex-wrap">
          {CATS.map(c => (
            <button key={c} onClick={() => setCategory(c)}
              className={`px-3 py-1.5 text-xs font-semibold border rounded-xl transition ${
                category === c
                  ? c === "Urgent" ? "bg-red-600 text-white border-red-600" : "bg-secondary text-white border-secondary"
                  : "border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {loading
        ? <div className="space-y-3">{Array(5).fill(0).map((_,i) => <Sk key={i} className="h-24" />)}</div>
        : filtered.length === 0
          ? <div className="text-center py-16 text-gray-400"><p className="text-4xl mb-2">📭</p><p>No notices found.</p></div>
          : <div className="flex flex-col gap-3">
            {filtered.map(n => (
              <div key={n.id}
                className={`bg-white border rounded-2xl p-5 transition ${
                  n.is_pinned ? "border-l-4 border-primary shadow-sm" :
                  isExpired(n) ? "border-gray-100 opacity-60" :
                  "border-gray-100 hover:shadow-sm"
                }`}>
                <div className="flex items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-lg ${BADGE[n.category] || BADGE.General}`}>{n.category}</span>
                      {n.is_pinned && <span className="text-xs text-primary font-bold">📌 Pinned</span>}
                      {n.priority === "Urgent" && !n.is_pinned && <span className="text-xs text-red-600 font-bold">🔴 Urgent</span>}
                      {isExpired(n) && <span className="text-xs text-gray-400">Expired</span>}
                    </div>
                    <h3 className="font-bold text-secondary text-sm mb-1">{n.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{n.body}</p>
                    <div className="flex items-center gap-4 mt-3 text-[11px] text-gray-400 flex-wrap">
                      <span>📅 {new Date(n.issued_on || n.publish_date).toLocaleDateString("en-IN", { day:"2-digit",month:"short",year:"numeric" })}</span>
                      {n.valid_until && <span>⏱ Valid until: {new Date(n.valid_until).toLocaleDateString("en-IN",{day:"2-digit",month:"short"})}</span>}
                      <span>For: {n.audience}</span>
                    </div>
                  </div>
                  {n.attachment_url && (
                    <a href={n.attachment_url} target="_blank" rel="noreferrer"
                      className="flex-shrink-0 flex items-center gap-1.5 bg-primary text-white text-xs font-semibold px-3 py-2 rounded-xl hover:bg-secondary transition">
                      📎 Download
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>}
    </div>
  );
};

/* ═══════════════════════════════════════════
   TAB: STUDY MATERIAL
═══════════════════════════════════════════ */
const MaterialsTab = ({ student }) => {
  const toast = useToast();
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [fSub, setFSub]           = useState("All");
  const [search, setSearch]       = useState("");

  useEffect(() => {
    if (!student?.class_name) return;
    const load = async () => {
      setLoading(true);
      const { data } = await supabase.from("study_materials")
        .select("*")
        .eq("class_name", student.class_name)
        .eq("section", student.section || "")
        .order("created_at", { ascending: false });
      setMaterials(data || []);
      setLoading(false);
    };
    load();
  }, [student]);

  const FICON = { pdf:"📄",doc:"📝",docx:"📝",png:"🖼",jpg:"🖼",jpeg:"🖼",ppt:"📊",pptx:"📊" };
  const ficon = (t) => FICON[t?.toLowerCase()] || "📁";

  const allSubs = ["All", ...new Set(materials.map(m => m.subject).filter(Boolean))];
  const filtered = materials.filter(m => {
    const matchSub  = fSub === "All" || m.subject === fSub;
    const q = search.toLowerCase().trim();
    const matchQ = !q || m.title.toLowerCase().includes(q) || m.subject?.toLowerCase().includes(q) || m.chapter?.toLowerCase().includes(q);
    return matchSub && matchQ;
  });

  const copyLink = (url) => { navigator.clipboard.writeText(url); toast("Link copied!"); };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-secondary">Study Material</h2>
        <p className="text-xs text-gray-400 mt-0.5">Notes, PDFs, and resources shared by your teachers.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search notes..." className="bg-gray-100 border border-transparent text-sm pl-9 pr-4 py-2 w-56 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/25 focus:bg-white focus:border-primary transition" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {allSubs.map(s => (
            <button key={s} onClick={() => setFSub(s)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition ${fSub===s ? "bg-secondary text-white border-secondary" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {loading
        ? <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">{Array(6).fill(0).map((_,i) => <Sk key={i} className="h-40" />)}</div>
        : filtered.length === 0
          ? <div className="text-center py-16 text-gray-400"><p className="text-4xl mb-2">📚</p><p>No materials found.</p></div>
          : <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(m => (
              <div key={m.id} className="bg-white rounded-2xl border border-gray-100 p-4 hover:shadow-md transition">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-xl flex-shrink-0">
                    {ficon(m.file_type)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-secondary text-sm truncate">{m.title}</p>
                    {m.description && <p className="text-xs text-gray-400 truncate mt-0.5">{m.description}</p>}
                  </div>
                </div>
                <div className="flex gap-1.5 flex-wrap mb-2">
                  <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-md text-[11px] font-bold">{m.subject}</span>
                  {m.chapter && <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-md text-[11px]">{m.chapter}</span>}
                </div>
                <p className="text-[11px] text-gray-400 mb-3">{timeAgo(m.created_at)}</p>
                <div className="flex gap-2">
                  <button onClick={() => copyLink(m.file_url)}
                    className="flex-1 py-1.5 text-xs font-semibold text-secondary border border-gray-200 rounded-xl hover:bg-gray-50 transition">
                    Copy Link
                  </button>
                  <a href={m.file_url} target="_blank" rel="noreferrer"
                    className="flex-1 py-1.5 text-xs font-semibold text-primary border border-primary/20 rounded-xl hover:bg-primary/5 transition text-center">
                    Open 📂
                  </a>
                </div>
              </div>
            ))}
          </div>}
    </div>
  );
};

/* ═══════════════════════════════════════════
   TAB: TIMETABLE
═══════════════════════════════════════════ */
const TimetableTab = ({ student }) => {
  const [data, setData]     = useState([]);
  const [loading, setLoading] = useState(true);
  const today = todayDay();

  useEffect(() => {
    if (!student?.class_name) return;
    const load = async () => {
      setLoading(true);
      const { data: rows } = await supabase.from("timetable")
        .select("*")
        .eq("class_name", student.class_name)
        .eq("section", student.section || "");
      setData(rows || []);
      setLoading(false);
    };
    load();
  }, [student]);

  const cell = (day, slot) => data.find(r => r.day === day && r.time_slot === slot);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-secondary">Class Timetable</h2>
        <p className="text-xs text-gray-400 mt-0.5">
          {student?.class_name ? `${student.class_name}${student.section ? " — Section " + student.section : ""}` : ""}
        </p>
      </div>
      {loading ? <Sk className="h-96" /> : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-x-auto">
          <table className="w-full text-xs min-w-[640px]">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-4 py-3 text-left text-gray-400 font-semibold w-16 bg-gray-50">Time</th>
                {DAYS.map(d => (
                  <th key={d} className={`px-2 py-3 font-semibold text-center ${d === today ? "text-primary bg-primary/5" : "text-gray-500 bg-gray-50"}`}>
                    <span>{d.slice(0,3)}</span>
                    {d === today && <span className="ml-1 w-1.5 h-1.5 rounded-full bg-primary inline-block" />}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {TIME_SLOTS.map(slot => (
                <tr key={slot} className="hover:bg-gray-50/50 transition">
                  <td className="px-4 py-3 text-gray-400 font-mono text-[11px] font-semibold whitespace-nowrap bg-gray-50/50">{slot}</td>
                  {DAYS.map(d => {
                    const c = cell(d, slot);
                    return (
                      <td key={d} className={`px-2 py-2 text-center ${d === today ? "bg-primary/5" : ""}`}>
                        {c ? (
                          <div className="bg-secondary/8 border border-secondary/15 rounded-xl px-2 py-1.5">
                            <p className="font-bold text-secondary text-[11px] leading-tight">{c.subject || "—"}</p>
                            {c.room && <p className="text-primary text-[10px] font-semibold">Rm {c.room}</p>}
                          </div>
                        ) : <span className="text-gray-200 text-base">—</span>}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════
   TAB: PROFILE
═══════════════════════════════════════════ */
const ProfileTab = ({ userId, user, onUpdate }) => {
  const toast = useToast();
  const photoRef = useRef();
  const [form, setForm]             = useState({ full_name: "", phone: "", bio: "", avatar_url: "" });
  const [readOnly, setReadOnly]     = useState({ class_name: "", section: "", roll_number: "", father_name: "", dob: "" });
  const [saving, setSaving]         = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from("student_profiles").select("*").eq("user_id", userId).single();
      if (data) {
        setForm({ full_name: data.full_name||"", phone: data.phone||"", bio: data.bio||"", avatar_url: data.avatar_url||"" });
        setReadOnly({ class_name: data.class_name||"", section: data.section||"", roll_number: data.roll_number||"", father_name: data.father_name||"", dob: data.dob||"" });
      }
    };
    if (userId) load();
  }, [userId]);

  const uploadPhoto = async (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setUploadingPhoto(true);
    try {
      const ext = f.name.split(".").pop();
      const path = `avatars/${userId}.${ext}`;
      await supabase.storage.from("avatars").upload(path, f, { upsert: true });
      const { data: ud } = supabase.storage.from("avatars").getPublicUrl(path);
      setForm(p => ({ ...p, avatar_url: ud.publicUrl }));
      toast("Photo updated.");
    } catch { toast("Photo upload failed.", "error"); }
    setUploadingPhoto(false);
  };

  const save = async () => {
    setSaving(true);
    try {
      await supabase.from("student_profiles").upsert({ user_id: userId, ...form, ...readOnly });
      toast("Profile saved.");
      onUpdate?.({ ...form, ...readOnly });
    } catch { toast("Failed to save.", "error"); }
    setSaving(false);
  };

  return (
    <div className="max-w-2xl space-y-5">
      <div>
        <h2 className="text-xl font-bold text-secondary">My Profile</h2>
        <p className="text-xs text-gray-400 mt-0.5">Update your contact info and photo. Class details are set by admin.</p>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
        {/* Avatar */}
        <div className="flex items-center gap-5">
          <div className="relative flex-shrink-0">
            <div className="w-20 h-20 rounded-2xl bg-secondary flex items-center justify-center text-white text-2xl font-bold overflow-hidden">
              {form.avatar_url ? <img src={form.avatar_url} alt="" className="w-full h-full object-cover" /> : (form.full_name?.[0]?.toUpperCase() || "S")}
            </div>
            <button onClick={() => photoRef.current?.click()}
              className="absolute -bottom-1 -right-1 w-7 h-7 bg-primary rounded-lg flex items-center justify-center text-white text-xs shadow hover:bg-secondary transition">
              {uploadingPhoto ? "…" : "✎"}
            </button>
            <input ref={photoRef} type="file" accept="image/*" className="hidden" onChange={uploadPhoto} />
          </div>
          <div>
            <p className="font-bold text-secondary text-lg">{form.full_name || "Your Name"}</p>
            <p className="text-sm text-gray-400">
              {readOnly.class_name ? `${readOnly.class_name}${readOnly.section ? " — Sec " + readOnly.section : ""}` : "Class not set"}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">{user?.email}</p>
            {readOnly.roll_number && <p className="text-xs text-gray-400">Roll No: {readOnly.roll_number}</p>}
          </div>
        </div>

        <div className="border-t border-gray-100 pt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div><Label c="Full Name" /><Inp value={form.full_name} onChange={e => setForm({...form, full_name: e.target.value})} placeholder="Your full name" /></div>
          <div><Label c="Phone" /><Inp value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="10-digit number" maxLength={10} /></div>
          <div><Label c="Email" note="(from account)" /><Inp value={user?.email||""} readOnly className="bg-gray-50 text-gray-400 cursor-not-allowed" /></div>
          <div><Label c="Class" note="(set by admin)" /><Inp value={readOnly.class_name} readOnly className="bg-gray-50 text-gray-400 cursor-not-allowed" /></div>
          <div><Label c="Section" note="(set by admin)" /><Inp value={readOnly.section} readOnly className="bg-gray-50 text-gray-400 cursor-not-allowed" /></div>
          <div><Label c="Roll Number" note="(set by admin)" /><Inp value={readOnly.roll_number} readOnly className="bg-gray-50 text-gray-400 cursor-not-allowed" /></div>
          <div><Label c="Father's Name" note="(set by admin)" /><Inp value={readOnly.father_name} readOnly className="bg-gray-50 text-gray-400 cursor-not-allowed" /></div>
          <div><Label c="Date of Birth" note="(set by admin)" /><Inp type="date" value={readOnly.dob} readOnly className="bg-gray-50 text-gray-400 cursor-not-allowed" /></div>
          <div className="sm:col-span-2">
            <Label c="Bio" note="optional" />
            <Txt rows={3} value={form.bio} onChange={e => setForm({...form, bio: e.target.value})} placeholder="A short note about yourself..." />
          </div>
        </div>
        <PrimaryBtn loading={saving} onClick={save} className="w-full py-3">Save Profile</PrimaryBtn>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════
   MAIN DASHBOARD
═══════════════════════════════════════════ */
const DashboardInner = () => {
  const { user } = useAuth();
  const userId = user?.id;
  const [activeTab, setActiveTab]   = useState("overview");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [student, setStudent]       = useState(null);
  const [newNoticeCount, setNewNoticeCount] = useState(0);

  useEffect(() => {
    if (!userId) return;
    const load = async () => {
      const [{ data: sp }, { count }] = await Promise.all([
        supabase.from("student_profiles").select("*").eq("user_id", userId).single(),
        supabase.from("notices")
          .select("id", { count: "exact", head: true })
          .eq("is_published", true)
          .gte("issued_on", new Date(Date.now() - 7*86400000).toISOString().split("T")[0]),
      ]);
      if (sp) setStudent(sp);
      setNewNoticeCount(count || 0);
    };
    load();
  }, [userId]);

  const tabLabel = NAV.find(n => n.id === activeTab)?.label || "Dashboard";

  const renderTab = () => {
    switch (activeTab) {
      case "overview":   return <OverviewTab   userId={userId} student={student} setActiveTab={setActiveTab} />;
      case "attendance": return <AttendanceTab userId={userId} />;
      case "homework":   return <HomeworkTab   student={student} />;
      case "results":    return <ResultsTab    userId={userId} />;
      case "notices":    return <NoticesTab    student={student} />;
      case "materials":  return <MaterialsTab  student={student} />;
      case "timetable":  return <TimetableTab  student={student} />;
      case "profile":    return <ProfileTab    userId={userId} user={user} onUpdate={d => setStudent(prev => ({...prev,...d}))} />;
      default:           return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-60 flex-shrink-0 fixed top-0 left-0 h-full z-30">
        <SidebarContent active={activeTab} setActive={setActiveTab} student={student} newNoticeCount={newNoticeCount} />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setMobileOpen(false)} />
          <aside className="fixed top-0 left-0 h-full w-64 z-50 lg:hidden">
            <SidebarContent active={activeTab} setActive={setActiveTab} student={student} newNoticeCount={newNoticeCount} closeMobile={() => setMobileOpen(false)} />
          </aside>
        </>
      )}

      {/* Main */}
      <div className="flex-1 lg:ml-60 flex flex-col min-h-screen">

        {/* Top Bar */}
        <header className="sticky top-0 z-20 bg-white/95 backdrop-blur border-b border-gray-100 px-4 sm:px-6 py-3.5 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileOpen(true)}
              className="lg:hidden w-9 h-9 rounded-xl hover:bg-gray-100 flex items-center justify-center transition">
              <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div>
              <h1 className="text-base font-bold text-secondary leading-tight">{tabLabel}</h1>
              <p className="text-[11px] text-gray-400 hidden sm:block">
                {new Date().toLocaleDateString("en-IN", { weekday:"short", day:"numeric", month:"short", year:"numeric" })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 hidden sm:block truncate max-w-[140px]">
              {student?.full_name || user?.email}
            </span>
            <div className="w-8 h-8 rounded-xl bg-secondary flex items-center justify-center text-white text-sm font-bold overflow-hidden">
              {student?.avatar_url
                ? <img src={student.avatar_url} alt="" className="w-full h-full object-cover" />
                : (student?.full_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "S")}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {renderTab()}
        </main>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          .print\\:hidden { display: none !important; }
          aside, header { display: none !important; }
          main { margin: 0 !important; padding: 0 !important; }
          body { background: white !important; }
        }
      `}</style>
    </div>
  );
};

const StudentDashboard = () => (
  <ToastProvider>
    <DashboardInner />
  </ToastProvider>
);

export default StudentDashboard;