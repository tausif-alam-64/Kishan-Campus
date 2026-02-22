import React, {
  useState, useEffect, useCallback, useRef, createContext, useContext,
} from "react";
import { useAuth } from "../../hooks/useAuth"
import { supabase } from "../../services/supabase/supabaseClient"

/* ═══════════════════════════════════════════
   CONSTANTS
═══════════════════════════════════════════ */
const DAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const TIME_SLOTS = ["8:00","8:45","9:30","10:15","11:00","11:45","12:30","1:15","2:00","2:45"];
const CLASS_OPTIONS = ["Class 6","Class 7","Class 8","Class 9","Class 10","Class 11","Class 12"];
const EXAM_TYPES = ["Unit Test 1","Unit Test 2","Unit Test 3","Half Yearly","Pre-Annual","Annual","Practical","Assignment"];
const AUDIENCE_OPTIONS = ["All Students","Class 6","Class 7","Class 8","Class 9","Class 10","Class 11","Class 12","Staff Only"];
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
const logActivity = (teacher_id, type, description) =>
  supabase.from("teacher_activity").insert({ teacher_id, type, description });

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
   SLIDE PANEL
═══════════════════════════════════════════ */
const SlidePanel = ({ open, onClose, title, children, wide = false }) => (
  <>
    {open && <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" onClick={onClose} />}
    <div className={`fixed top-0 right-0 h-full ${wide ? "w-full sm:w-[620px]" : "w-full sm:w-[480px]"} bg-white z-50 shadow-2xl flex flex-col transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}>
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
        <h2 className="text-base font-bold text-secondary">{title}</h2>
        <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 text-xl transition">×</button>
      </div>
      <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
    </div>
  </>
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
const GhostBtn = ({ children, className = "", ...p }) => (
  <button className={`flex items-center justify-center gap-2 bg-gray-100 text-secondary rounded-xl font-semibold text-sm px-4 py-2 hover:bg-gray-200 transition ${className}`} {...p}>{children}</button>
);
const DangerBtn = ({ children, className = "", ...p }) => (
  <button className={`flex items-center justify-center gap-2 text-red-600 bg-red-50 rounded-xl font-semibold text-sm px-4 py-2 hover:bg-red-100 transition ${className}`} {...p}>{children}</button>
);

/* ═══════════════════════════════════════════
   SIDEBAR
═══════════════════════════════════════════ */
const NAV = [
  { id:"overview",   icon:"⊞",  label:"Overview" },
  { id:"attendance", icon:"✔",  label:"Attendance" },
  { id:"homework",   icon:"📝", label:"Homework" },
  { id:"marks",      icon:"📊", label:"Marks & Results" },
  { id:"notices",    icon:"📢", label:"Notices" },
  { id:"materials",  icon:"📚", label:"Study Material" },
  { id:"syllabus",   icon:"📋", label:"Syllabus Tracker" },
  { id:"timetable",  icon:"📅", label:"Timetable" },
  { id:"profile",    icon:"👤", label:"Profile" },
];

const SidebarContent = ({ active, setActive, teacher, draftCount, closeMobile }) => (
  <div className="flex flex-col h-full bg-secondary">
    <div className="px-5 pt-6 pb-4 border-b border-white/10 flex-shrink-0">
      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/40 mb-0.5">Kishan Campus</p>
      <h1 className="text-white font-bold text-[17px] leading-tight">Teacher Portal</h1>
    </div>
    <div className="mx-3 mt-3 mb-2 bg-white/10 rounded-2xl p-3.5 flex items-center gap-3 flex-shrink-0">
      <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white font-bold text-base flex-shrink-0 overflow-hidden">
        {teacher?.avatar_url
          ? <img src={teacher.avatar_url} alt="" className="w-full h-full object-cover" />
          : (teacher?.full_name?.[0]?.toUpperCase() || "T")}
      </div>
      <div className="min-w-0">
        <p className="text-white font-semibold text-sm truncate">{teacher?.full_name || "Teacher"}</p>
        <p className="text-white/50 text-xs truncate">{teacher?.subject || "Faculty"}</p>
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
          {n.id === "notices" && draftCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">{draftCount}</span>
          )}
        </button>
      ))}
    </nav>
  </div>
);

/* ═══════════════════════════════════════════
   TAB: OVERVIEW
═══════════════════════════════════════════ */
const OverviewTab = ({ userId, setActiveTab }) => {
  const [stats, setStats] = useState(null);
  const [schedule, setSchedule] = useState([]);
  const [activity, setActivity] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const day = todayDay();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [nR, mR, aR, sR, attR, hwR] = await Promise.all([
          supabase.from("notices").select("id,is_published").eq("teacher_id", userId),
          supabase.from("study_materials").select("id").eq("teacher_id", userId),
          supabase.from("teacher_activity").select("*").eq("teacher_id", userId).order("created_at",{ascending:false}).limit(5),
          supabase.from("timetable").select("*").eq("teacher_id", userId).eq("day", day).order("time_slot"),
          supabase.from("attendance").select("class_name,section").eq("marked_by", userId).eq("date", todayStr()),
          supabase.from("homework").select("id,class_name,due_date").eq("teacher_id", userId).eq("due_date", todayStr()),
        ]);
        const notices = nR.data || [];
        const sched   = sR.data || [];
        const attDone = new Set((attR.data||[]).map(a=>`${a.class_name}||${a.section}`));
        const uniqCls = [...new Map(sched.map(s=>[`${s.class_name}||${s.section}`,s])).values()];
        setStats({
          classes: sched.length,
          attPending: uniqCls.filter(c=>!attDone.has(`${c.class_name}||${c.section}`)).length,
          hwDue: (hwR.data||[]).length,
          drafts: notices.filter(n=>!n.is_published).length,
        });
        setSchedule(sched);
        setActivity(aR.data||[]);
        setTasks(uniqCls.map(c=>({
          label:`Attendance — ${c.class_name} Sec ${c.section}`,
          done: attDone.has(`${c.class_name}||${c.section}`),
          tab:"attendance",
        })));
      } finally { setLoading(false); }
    };
    if (userId) load();
  }, [userId, day]);

  const CARDS = stats ? [
    { label:"Today's Classes",    val:stats.classes,    icon:"📅", bg:"bg-secondary",      tab:"timetable"  },
    { label:"Attendance Pending", val:stats.attPending, icon:"⚠",  bg:stats.attPending>0?"bg-red-500":"bg-emerald-600", tab:"attendance" },
    { label:"Homework Due Today", val:stats.hwDue,      icon:"📝", bg:"bg-amber-500",      tab:"homework"   },
    { label:"Draft Notices",      val:stats.drafts,     icon:"📢", bg:"bg-primary",        tab:"notices"    },
  ] : [];

  const ACT_ICON = { notice:"📢", material:"📚", homework:"📝", marks:"📊", attendance:"✔" };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
          {new Date().toLocaleDateString("en-IN",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}
        </p>
        <h2 className="text-2xl font-bold text-secondary mt-1">Good morning 👋</h2>
        <p className="text-sm text-gray-500 mt-0.5">Here's what needs your attention today.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {loading
          ? Array(4).fill(0).map((_,i)=><Sk key={i} className="h-[100px]"/>)
          : CARDS.map(c=>(
            <button key={c.label} onClick={()=>setActiveTab(c.tab)}
              className={`${c.bg} rounded-2xl p-4 text-left text-white hover:opacity-90 transition active:scale-95 focus:outline-none`}>
              <span className="text-2xl block mb-3 leading-none">{c.icon}</span>
              <p className="text-3xl font-bold leading-none">{c.val}</p>
              <p className="text-xs text-white/70 mt-1.5 leading-snug">{c.label}</p>
            </button>
          ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4">
        <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-3">Quick Actions</p>
        <div className="flex gap-2 flex-wrap">
          {[
            {label:"Mark Attendance",tab:"attendance",bg:"bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200",icon:"✔"},
            {label:"Post Homework",  tab:"homework",  bg:"bg-amber-50 text-amber-700 hover:bg-amber-100 border-amber-200",    icon:"📝"},
            {label:"Post Notice",    tab:"notices",   bg:"bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200",         icon:"📢"},
            {label:"Upload Material",tab:"materials", bg:"bg-purple-50 text-purple-700 hover:bg-purple-100 border-purple-200", icon:"📚"},
            {label:"Enter Marks",    tab:"marks",     bg:"bg-rose-50 text-rose-700 hover:bg-rose-100 border-rose-200",         icon:"📊"},
          ].map(a=>(
            <button key={a.tab} onClick={()=>setActiveTab(a.tab)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-semibold transition ${a.bg}`}>
              <span>{a.icon}</span>{a.label}
            </button>
          ))}
        </div>
      </div>

      {/* Three panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Tasks */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-4">Today's Tasks</p>
          {loading
            ? Array(3).fill(0).map((_,i)=><Sk key={i} className="h-11 mb-2"/>)
            : tasks.length===0
              ? <p className="text-sm text-gray-400 text-center py-8">No classes scheduled today 🎉</p>
              : <div className="space-y-2">
                {tasks.map((t,i)=>(
                  <div key={i} className={`flex items-center gap-3 p-3 rounded-xl ${t.done?"bg-emerald-50":"bg-red-50"}`}>
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${t.done?"bg-emerald-500 text-white":"bg-red-400 text-white"}`}>
                      {t.done?"✓":"!"}
                    </div>
                    <span className="flex-1 text-xs font-medium text-secondary">{t.label}</span>
                    {!t.done && <button onClick={()=>setActiveTab(t.tab)} className="text-xs text-primary font-bold hover:underline whitespace-nowrap">Do →</button>}
                  </div>
                ))}
              </div>}
        </div>

        {/* Today's Schedule */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-4">Today's Schedule <span className="text-primary normal-case font-normal">({day})</span></p>
          {loading
            ? Array(3).fill(0).map((_,i)=><Sk key={i} className="h-14 mb-2"/>)
            : schedule.length===0
              ? <p className="text-sm text-gray-400 text-center py-8">No classes today.</p>
              : <div className="space-y-2">
                {schedule.map((s,i)=>(
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition">
                    <p className="text-xs font-bold text-primary min-w-[48px]">{s.time_slot}</p>
                    <div className="w-px h-7 bg-gray-100"/>
                    <div>
                      <p className="text-xs font-semibold text-secondary">{s.class_name} — Sec {s.section}</p>
                      {s.room && <p className="text-[11px] text-gray-400">Room {s.room}</p>}
                    </div>
                  </div>
                ))}
              </div>}
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-4">Recent Activity</p>
          {loading
            ? Array(4).fill(0).map((_,i)=><Sk key={i} className="h-11 mb-2"/>)
            : activity.length===0
              ? <p className="text-sm text-gray-400 text-center py-8">No activity yet.</p>
              : <div className="space-y-1.5">
                {activity.map(a=>(
                  <div key={a.id} className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition">
                    <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center text-xs flex-shrink-0">
                      {ACT_ICON[a.type] || "📌"}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-secondary truncate">{a.description}</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">{timeAgo(a.created_at)}</p>
                    </div>
                  </div>
                ))}
              </div>}
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════
   TAB: ATTENDANCE
═══════════════════════════════════════════ */
const ST_STYLE = {
  Present: "bg-emerald-500 text-white",
  Absent:  "bg-red-500 text-white",
  Late:    "bg-amber-400 text-white",
};
const ST_ROW = {
  Present: "border-emerald-100 bg-emerald-50/40",
  Absent:  "border-red-100 bg-red-50/40",
  Late:    "border-amber-100 bg-amber-50/40",
};

const AttendanceTab = ({ userId }) => {
  const toast = useToast();
  const [sub, setSub] = useState("mark");
  const [classes, setClasses] = useState([]);
  const [selCls, setSelCls] = useState("");
  const [selDate, setSelDate] = useState(todayStr());
  const [students, setStudents] = useState([]);
  const [att, setAtt] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [editMode, setEditMode] = useState(false);
  // Summary
  const [sumMonth, setSumMonth] = useState(new Date().getMonth());
  const [sumData, setSumData] = useState([]);
  const [loadingSum, setLoadingSum] = useState(false);

  useEffect(() => {
    const f = async () => {
      const { data } = await supabase.from("timetable").select("class_name,section").eq("teacher_id", userId);
      const uniq = [...new Map((data||[]).map(d=>[`${d.class_name}||${d.section}`,d])).values()];
      setClasses(uniq);
      if (uniq.length) setSelCls(`${uniq[0].class_name}||${uniq[0].section}`);
    };
    if (userId) f();
  }, [userId]);

  useEffect(() => {
    if (!selCls) return;
    const [cn,sec] = selCls.split("||");
    const f = async () => {
      setLoading(true);
      const [{ data:sts },{ data:attd }] = await Promise.all([
        supabase.from("students").select("id,full_name,roll_number").eq("class_name",cn).eq("section",sec).order("roll_number"),
        supabase.from("attendance").select("student_id,status").eq("class_name",cn).eq("section",sec).eq("date",selDate),
      ]);
      const isSaved = attd && attd.length > 0;
      setSaved(isSaved); setEditMode(false);
      const map = {}; (attd||[]).forEach(a=>{ map[a.student_id]=a.status; });
      const init = {}; (sts||[]).forEach(s=>{ init[s.id]=map[s.id]||"Present"; });
      setStudents(sts||[]); setAtt(init);
      setLoading(false);
    };
    f();
  }, [selCls, selDate]);

  const cycle = id => {
    if (saved && !editMode) return;
    setAtt(p => ({ ...p, [id]: p[id]==="Present"?"Absent":p[id]==="Absent"?"Late":"Present" }));
  };
  const markAll = s => {
    if (saved && !editMode) return;
    const u = {}; students.forEach(st=>{ u[st.id]=s; }); setAtt(u);
  };

  const submit = async () => {
    if (!students.length) return;
    const [cn,sec] = selCls.split("||");
    setSaving(true);
    try {
      await supabase.from("attendance").delete().eq("class_name",cn).eq("section",sec).eq("date",selDate);
      await supabase.from("attendance").insert(students.map(s=>({ student_id:s.id,class_name:cn,section:sec,date:selDate,status:att[s.id]||"Present",marked_by:userId })));
      await logActivity(userId,"attendance",`Attendance marked — ${cn} Sec ${sec} on ${selDate}`);
      toast(`Attendance saved — ${cn} Sec ${sec}`);
      setSaved(true); setEditMode(false);
    } catch { toast("Failed to save attendance.","error"); }
    setSaving(false);
  };

  // Counts
  const pCount = Object.values(att).filter(v=>v==="Present").length;
  const aCount = Object.values(att).filter(v=>v==="Absent").length;
  const lCount = Object.values(att).filter(v=>v==="Late").length;

  // Summary
  useEffect(() => {
    if (sub!=="summary" && sub!=="defaulters") return;
    if (!selCls) return;
    const [cn,sec] = selCls.split("||");
    const f = async () => {
      setLoadingSum(true);
      const yr = new Date().getFullYear();
      const s0 = `${yr}-${String(sumMonth+1).padStart(2,"0")}-01`;
      const s1 = new Date(yr,sumMonth+1,0).toISOString().split("T")[0];
      const [{ data:sts },{ data:attd }] = await Promise.all([
        supabase.from("students").select("id,full_name,roll_number").eq("class_name",cn).eq("section",sec).order("roll_number"),
        supabase.from("attendance").select("student_id,status,date").eq("class_name",cn).eq("section",sec).gte("date",s0).lte("date",s1),
      ]);
      const wDays = new Set((attd||[]).map(a=>a.date)).size;
      setSumData((sts||[]).map(s=>{
        const mine = (attd||[]).filter(a=>a.student_id===s.id);
        const p = mine.filter(a=>a.status==="Present").length;
        const l = mine.filter(a=>a.status==="Late").length;
        const pct = wDays>0 ? Math.round(((p+l*0.5)/wDays)*100) : 0;
        return { ...s, p, l, absent:wDays-p-l, pct, wDays };
      }));
      setLoadingSum(false);
    };
    f();
  }, [sub, selCls, sumMonth]);

  const defaulters = sumData.filter(s=>s.pct<75);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-secondary">Attendance Register</h2>
          <p className="text-xs text-gray-400 mt-0.5">Permanent digital record — replaces the paper register.</p>
        </div>
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl text-xs font-semibold">
          {[["mark","📋 Mark"],["summary","📊 Summary"],["defaulters","⚠ Defaulters"]].map(([id,lbl])=>(
            <button key={id} onClick={()=>setSub(id)}
              className={`px-3 py-1.5 rounded-lg transition ${sub===id?"bg-white text-secondary shadow-sm":"text-gray-500 hover:text-secondary"}`}>
              {lbl}
            </button>
          ))}
        </div>
      </div>

      {/* Class + Date selectors always visible */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label c="Class"/>
          <Sel value={selCls} onChange={e=>setSelCls(e.target.value)}>
            {classes.map(c=>(
              <option key={`${c.class_name}||${c.section}`} value={`${c.class_name}||${c.section}`}>
                {c.class_name} — Sec {c.section}
              </option>
            ))}
          </Sel>
        </div>
        {sub==="summary"||sub==="defaulters"
          ? <div><Label c="Month"/><Sel value={sumMonth} onChange={e=>setSumMonth(Number(e.target.value))}>{MONTHS.map((m,i)=><option key={m} value={i}>{m}</option>)}</Sel></div>
          : <div><Label c="Date"/><Inp type="date" value={selDate} max={todayStr()} onChange={e=>setSelDate(e.target.value)}/></div>
        }
      </div>

      {/* MARK sub-tab */}
      {sub==="mark" && (
        <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
          {saved && !editMode && (
            <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
              <p className="text-sm text-emerald-700 font-semibold">✓ Attendance already submitted.</p>
              <button onClick={()=>setEditMode(true)} className="text-xs text-emerald-700 font-bold border border-emerald-300 px-3 py-1 rounded-lg hover:bg-emerald-100 transition">Edit</button>
            </div>
          )}
          {students.length>0 && (
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex gap-4 text-sm font-semibold">
                <span className="text-emerald-600">✔ {pCount} Present</span>
                <span className="text-red-500">✕ {aCount} Absent</span>
                <span className="text-amber-500">⏱ {lCount} Late</span>
              </div>
              {(!saved||editMode) && (
                <div className="flex gap-1.5">
                  {["Present","Absent","Late"].map(s=>(
                    <button key={s} onClick={()=>markAll(s)} className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition">
                      All {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
          {loading
            ? Array(6).fill(0).map((_,i)=><Sk key={i} className="h-[52px]"/>)
            : students.length===0
              ? <p className="text-center text-gray-400 py-12 text-sm">No students found for this class.</p>
              : <div className="space-y-2">
                {students.map(s=>{
                  const st = att[s.id]||"Present";
                  const locked = saved && !editMode;
                  return (
                    <div key={s.id} className={`flex items-center gap-4 px-4 py-3 rounded-xl border transition ${ST_ROW[st]}`}>
                      <div className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-xs font-bold text-gray-500 flex-shrink-0">{s.roll_number}</div>
                      <span className="flex-1 text-sm font-medium text-secondary">{s.full_name}</span>
                      <button onClick={()=>cycle(s.id)} disabled={locked}
                        className={`px-4 py-1.5 rounded-xl text-xs font-bold transition ${ST_STYLE[st]} ${locked?"opacity-60 cursor-not-allowed":"hover:opacity-90 active:scale-95"}`}>
                        {st}
                      </button>
                    </div>
                  );
                })}
              </div>}
          {students.length>0 && (!saved||editMode) && (
            <PrimaryBtn loading={saving} onClick={submit} className="w-full py-3">
              {saved?"Update Attendance":"Submit Attendance"}
            </PrimaryBtn>
          )}
        </div>
      )}

      {/* SUMMARY / DEFAULTERS sub-tabs */}
      {(sub==="summary"||sub==="defaulters") && (
        <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
          {sub==="defaulters" && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-red-50 flex items-center justify-center text-red-600 font-bold">{defaulters.length}</div>
                <p className="text-sm font-semibold text-secondary">Students below 75% attendance</p>
              </div>
              <button onClick={()=>window.print()} className="text-xs text-primary font-bold hover:underline print:hidden">🖨 Print</button>
            </div>
          )}
          {loadingSum
            ? Array(5).fill(0).map((_,i)=><Sk key={i} className="h-14"/>)
            : (sub==="defaulters"?defaulters:sumData).length===0
              ? <p className="text-center text-gray-400 py-10 text-sm">{sub==="defaulters"?"No defaulters this month 🎉":"No data yet."}</p>
              : <div className="space-y-2">
                {(sub==="defaulters"?defaulters:sumData).map(s=>(
                  <div key={s.id} className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${s.pct<75?"border-red-200 bg-red-50/30":"border-gray-100"}`}>
                    <span className="text-xs font-bold text-gray-400 w-7 flex-shrink-0">{s.roll_number}</span>
                    <span className="flex-1 text-sm font-medium text-secondary">{s.full_name}</span>
                    <div className="hidden sm:flex items-center gap-2 text-xs text-gray-400">
                      <span className="text-emerald-600">{s.p}P</span>
                      <span className="text-red-500">{s.absent}A</span>
                      <span className="text-amber-500">{s.l}L</span>
                    </div>
                    <div className="w-20 hidden sm:block">
                      <div className="h-1.5 bg-gray-100 rounded-full"><div className={`h-1.5 rounded-full ${s.pct>=75?"bg-emerald-500":"bg-red-500"}`} style={{width:`${Math.min(s.pct,100)}%`}}/></div>
                    </div>
                    <span className={`text-sm font-bold w-11 text-right ${s.pct>=75?"text-emerald-600":"text-red-600"}`}>{s.pct}%</span>
                  </div>
                ))}
              </div>}
        </div>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════
   TAB: HOMEWORK
═══════════════════════════════════════════ */
const HomeworkTab = ({ userId, teacher }) => {
  const toast = useToast();
  const fileRef = useRef();
  const [homeworks, setHomeworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [panelOpen, setPanelOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [filterCls, setFilterCls] = useState("All");
  const [confirmDel, setConfirmDel] = useState(null);
  const [file, setFile] = useState(null);
  const [form, setForm] = useState({ class_name:"", section:"", subject:"", description:"", assigned_date:todayStr(), due_date:"", file_url:"" });

  const fetchHW = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from("homework").select("*").eq("teacher_id", userId).order("assigned_date",{ascending:false});
    setHomeworks(data||[]);
    setLoading(false);
  }, [userId]);

  useEffect(() => { if (userId) fetchHW(); }, [fetchHW]);

  const openCreate = () => {
    setEditing(null);
    setForm({ class_name:"", section:"", subject:teacher?.subject||"", description:"", assigned_date:todayStr(), due_date:"", file_url:"" });
    setFile(null);
    setPanelOpen(true);
  };
  const openEdit = (hw) => {
    setEditing(hw);
    setForm({ class_name:hw.class_name, section:hw.section||"", subject:hw.subject, description:hw.description, assigned_date:hw.assigned_date, due_date:hw.due_date, file_url:hw.file_url||"" });
    setFile(null);
    setPanelOpen(true);
  };

  const handleSave = async () => {
    if (!form.class_name||!form.subject||!form.description||!form.due_date) { toast("Fill all required fields.","error"); return; }
    setSaving(true);
    try {
      let fileUrl = form.file_url;
      if (file) {
        const path = `${userId}/hw-${Date.now()}.${file.name.split(".").pop()}`;
        const { error: ue } = await supabase.storage.from("homework-files").upload(path, file);
        if (!ue) { const { data:ud } = supabase.storage.from("homework-files").getPublicUrl(path); fileUrl = ud.publicUrl; }
      }
      if (editing) {
        await supabase.from("homework").update({ ...form, file_url:fileUrl }).eq("id",editing.id);
        toast("Homework updated.");
      } else {
        await supabase.from("homework").insert({ ...form, file_url:fileUrl, teacher_id:userId, status:"active" });
        await logActivity(userId,"homework",`Homework posted — ${form.subject} for ${form.class_name}`);
        toast("Homework posted.");
      }
      setPanelOpen(false); fetchHW();
    } catch { toast("Failed to save.","error"); }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    await supabase.from("homework").delete().eq("id",id);
    setConfirmDel(null); toast("Deleted.","info"); fetchHW();
  };

  const copyToClass = async (hw) => {
    const cn = window.prompt("Copy to which class? (e.g. Class 10)");
    if (!cn) return;
    await supabase.from("homework").insert({ ...hw, id:undefined, class_name:cn, teacher_id:userId, created_at:undefined });
    toast(`Copied to ${cn}`); fetchHW();
  };

  const toggleStatus = async (hw) => {
    const ns = hw.status==="active"?"reviewed":"active";
    await supabase.from("homework").update({ status:ns }).eq("id",hw.id);
    toast(ns==="reviewed"?"Marked as Reviewed ✓":"Marked Active"); fetchHW();
  };

  const classes = [...new Set(homeworks.map(h=>h.class_name))];
  const filtered = filterCls==="All" ? homeworks : homeworks.filter(h=>h.class_name===filterCls);
  const isPastDue = (d) => d && new Date(d) < new Date(todayStr());

  return (
    <>
      <div className="space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="text-xl font-bold text-secondary">Homework & Assignments</h2>
            <p className="text-xs text-gray-400 mt-0.5">Students and parents can view this on their side.</p>
          </div>
          <PrimaryBtn onClick={openCreate}>+ Post Homework</PrimaryBtn>
        </div>

        {/* Filter */}
        <div className="flex gap-2 flex-wrap">
          {["All",...classes].map(c=>(
            <button key={c} onClick={()=>setFilterCls(c)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition ${filterCls===c?"bg-secondary text-white border-secondary":"border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
              {c}
            </button>
          ))}
        </div>

        {loading
          ? <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{Array(4).fill(0).map((_,i)=><Sk key={i} className="h-44"/>)}</div>
          : filtered.length===0
            ? <div className="text-center py-20 text-gray-400"><p className="text-4xl mb-2">📝</p><p>No homework posted yet.</p></div>
            : <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map(hw=>(
                <div key={hw.id} className={`bg-white rounded-2xl border p-4 hover:shadow-md transition flex flex-col ${hw.status==="reviewed"?"border-emerald-200":"border-gray-100"}`}>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex gap-1.5 flex-wrap">
                      <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-lg text-[11px] font-bold">{hw.subject}</span>
                      <span className="px-2 py-0.5 bg-secondary/10 text-secondary rounded-lg text-[11px] font-bold">{hw.class_name}{hw.section?" "+hw.section:""}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded-lg text-[11px] font-bold flex-shrink-0 ${hw.status==="reviewed"?"bg-emerald-50 text-emerald-700":"bg-amber-50 text-amber-700"}`}>
                      {hw.status==="reviewed"?"Reviewed":"Active"}
                    </span>
                  </div>
                  <p className="text-sm text-secondary font-medium leading-snug flex-1 mb-3">{hw.description}</p>
                  <div className="flex items-center justify-between text-[11px] text-gray-400 mb-3">
                    <span>Assigned: {hw.assigned_date}</span>
                    <span className={isPastDue(hw.due_date)&&hw.status==="active"?"text-red-500 font-semibold":""}>
                      Due: {hw.due_date}
                    </span>
                  </div>
                  {hw.file_url && (
                    <a href={hw.file_url} target="_blank" rel="noreferrer" className="text-xs text-primary font-semibold hover:underline mb-3 flex items-center gap-1">
                      📎 Attachment
                    </a>
                  )}
                  <div className="flex gap-1.5 pt-2 border-t border-gray-50">
                    <button onClick={()=>openEdit(hw)} className="flex-1 py-1.5 text-xs font-semibold text-secondary border border-gray-200 rounded-xl hover:bg-gray-50 transition">Edit</button>
                    <button onClick={()=>toggleStatus(hw)} className="flex-1 py-1.5 text-xs font-semibold text-emerald-600 border border-emerald-200 rounded-xl hover:bg-emerald-50 transition">
                      {hw.status==="reviewed"?"Re-open":"Review ✓"}
                    </button>
                    <button onClick={()=>copyToClass(hw)} className="py-1.5 px-2 text-xs font-semibold text-purple-600 border border-purple-200 rounded-xl hover:bg-purple-50 transition">Copy</button>
                    {confirmDel===hw.id
                      ? <div className="flex gap-1">
                          <button onClick={()=>handleDelete(hw.id)} className="py-1.5 px-2 text-xs font-bold text-white bg-red-500 rounded-xl hover:bg-red-600 transition">Yes</button>
                          <button onClick={()=>setConfirmDel(null)} className="py-1.5 px-2 text-xs font-bold text-gray-500 border border-gray-200 rounded-xl hover:bg-gray-50 transition">No</button>
                        </div>
                      : <button onClick={()=>setConfirmDel(hw.id)} className="py-1.5 px-2 text-xs font-semibold text-red-500 border border-red-100 rounded-xl hover:bg-red-50 transition">Del</button>
                    }
                  </div>
                </div>
              ))}
            </div>}
      </div>

      <SlidePanel open={panelOpen} onClose={()=>setPanelOpen(false)} title={editing?"Edit Homework":"Post Homework"}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label c="Class *"/>
              <Sel value={form.class_name} onChange={e=>setForm({...form,class_name:e.target.value})}>
                <option value="">Select...</option>
                {CLASS_OPTIONS.map(c=><option key={c}>{c}</option>)}
              </Sel>
            </div>
            <div>
              <Label c="Section"/>
              <Inp placeholder="e.g. A" value={form.section} onChange={e=>setForm({...form,section:e.target.value})}/>
            </div>
          </div>
          <div>
            <Label c="Subject *"/>
            <Inp value={form.subject} onChange={e=>setForm({...form,subject:e.target.value})} placeholder="e.g. Physics"/>
          </div>
          <div>
            <Label c="What to do (Description) *"/>
            <Txt rows={4} value={form.description} onChange={e=>setForm({...form,description:e.target.value})} placeholder="Describe the homework clearly..."/>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label c="Assigned Date"/>
              <Inp type="date" value={form.assigned_date} onChange={e=>setForm({...form,assigned_date:e.target.value})}/>
            </div>
            <div>
              <Label c="Due Date *"/>
              <Inp type="date" value={form.due_date} onChange={e=>setForm({...form,due_date:e.target.value})}/>
            </div>
          </div>
          <div>
            <Label c="Attach File" note="(optional — PDF/Image, max 10MB)"/>
            <div onClick={()=>fileRef.current?.click()} className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center cursor-pointer hover:border-primary transition">
              <input ref={fileRef} type="file" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" className="hidden" onChange={e=>setFile(e.target.files[0])}/>
              {file ? <p className="text-xs font-medium text-secondary">📎 {file.name}</p>
                    : <p className="text-xs text-gray-400">Click to upload file</p>}
            </div>
          </div>
          <PrimaryBtn loading={saving||uploading} onClick={handleSave} className="w-full py-3">
            {editing?"Update Homework":"Post Homework"}
          </PrimaryBtn>
        </div>
      </SlidePanel>
    </>
  );
};

/* ═══════════════════════════════════════════
   TAB: MARKS & RESULTS
═══════════════════════════════════════════ */
const MarksTab = ({ userId, teacher }) => {
  const toast = useToast();
  const [step, setStep] = useState("setup"); // setup | entry | results
  const [exams, setExams] = useState([]);
  const [selExam, setSelExam] = useState(null);
  const [students, setStudents] = useState([]);
  const [marks, setMarks] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [sortBy, setSortBy] = useState("roll");
  const [examForm, setExamForm] = useState({ name:EXAM_TYPES[0], class_name:"", section:"", subject:"", max_marks:"100", exam_date:todayStr() });
  const [showCreate, setShowCreate] = useState(false);
  const [creatingExam, setCreatingExam] = useState(false);

  const fetchExams = useCallback(async () => {
    const { data } = await supabase.from("exams").select("*").eq("teacher_id",userId).order("created_at",{ascending:false});
    setExams(data||[]);
  },[userId]);

  useEffect(() => { if (userId) fetchExams(); },[fetchExams]);

  const createExam = async () => {
    if (!examForm.class_name||!examForm.subject||!examForm.max_marks) { toast("Fill all fields.","error"); return; }
    setCreatingExam(true);
    try {
      const { data,error } = await supabase.from("exams").insert({ ...examForm, teacher_id:userId, max_marks:Number(examForm.max_marks) }).select().single();
      if (error) throw error;
      toast("Exam created. Now enter marks.");
      await fetchExams();
      openExam(data);
      setShowCreate(false);
    } catch { toast("Failed to create exam.","error"); }
    setCreatingExam(false);
  };

  const openExam = async (exam) => {
    setSelExam(exam);
    setLoading(true);
    const [{ data:sts },{ data:mks }] = await Promise.all([
      supabase.from("students").select("id,full_name,roll_number").eq("class_name",exam.class_name).eq("section",exam.section||"").order("roll_number"),
      supabase.from("marks").select("student_id,marks_obtained").eq("exam_id",exam.id),
    ]);
    const map = {}; (mks||[]).forEach(m=>{ map[m.student_id]=String(m.marks_obtained); });
    setStudents(sts||[]);
    const init = {}; (sts||[]).forEach(s=>{ init[s.id]=map[s.id]||""; });
    setMarks(init);
    setStep("entry");
    setLoading(false);
  };

  const saveMarks = async () => {
    setSaving(true);
    try {
      await supabase.from("marks").delete().eq("exam_id",selExam.id);
      const rows = students.filter(s=>marks[s.id]!=="").map(s=>({ exam_id:selExam.id, student_id:s.id, marks_obtained:parseFloat(marks[s.id])||0 }));
      if (rows.length) await supabase.from("marks").insert(rows);
      await logActivity(userId,"marks",`Marks entered — ${selExam.name} ${selExam.class_name}`);
      toast("Marks saved.");
      setStep("results");
    } catch { toast("Failed to save marks.","error"); }
    setSaving(false);
  };

  // Results computation
  const results = students.map((s,i)=>{
    const m = parseFloat(marks[s.id])||0;
    const pct = selExam ? Math.round((m/selExam.max_marks)*100) : 0;
    const gr = getGrade(pct);
    return { ...s, marks:m, pct, gr, pass:pct>=33 };
  }).sort((a,b)=>{
    if(sortBy==="marks") return b.marks-a.marks;
    if(sortBy==="pct") return b.pct-a.pct;
    return a.roll_number-b.roll_number;
  });

  const ranked = results.map((r,i)=>({ ...r, rank:i+1 }));
  const topper = [...results].sort((a,b)=>b.marks-a.marks)[0];
  const passed = results.filter(r=>r.pass).length;
  const avg = results.length ? Math.round(results.reduce((s,r)=>s+r.pct,0)/results.length) : 0;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-secondary">Marks & Results</h2>
          <p className="text-xs text-gray-400 mt-0.5">Centralised marks entry — no more scattered Excel files.</p>
        </div>
        <div className="flex gap-2">
          {step!=="setup" && <GhostBtn onClick={()=>{setStep("setup");setSelExam(null);}}>← Back</GhostBtn>}
          <PrimaryBtn onClick={()=>setShowCreate(true)}>+ New Exam</PrimaryBtn>
        </div>
      </div>

      {/* Create Exam Panel */}
      <SlidePanel open={showCreate} onClose={()=>setShowCreate(false)} title="Create New Exam">
        <div className="space-y-4">
          <div>
            <Label c="Exam Type *"/>
            <Sel value={examForm.name} onChange={e=>setExamForm({...examForm,name:e.target.value})}>
              {EXAM_TYPES.map(t=><option key={t}>{t}</option>)}
            </Sel>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><Label c="Class *"/><Sel value={examForm.class_name} onChange={e=>setExamForm({...examForm,class_name:e.target.value})}><option value="">Select...</option>{CLASS_OPTIONS.map(c=><option key={c}>{c}</option>)}</Sel></div>
            <div><Label c="Section"/><Inp placeholder="e.g. A" value={examForm.section} onChange={e=>setExamForm({...examForm,section:e.target.value})}/></div>
          </div>
          <div><Label c="Subject *"/><Inp value={examForm.subject} onChange={e=>setExamForm({...examForm,subject:e.target.value})} placeholder="e.g. Physics"/></div>
          <div className="grid grid-cols-2 gap-4">
            <div><Label c="Max Marks *"/><Inp type="number" value={examForm.max_marks} onChange={e=>setExamForm({...examForm,max_marks:e.target.value})} min="1"/></div>
            <div><Label c="Exam Date"/><Inp type="date" value={examForm.exam_date} onChange={e=>setExamForm({...examForm,exam_date:e.target.value})}/></div>
          </div>
          <PrimaryBtn loading={creatingExam} onClick={createExam} className="w-full py-3">Create & Enter Marks</PrimaryBtn>
        </div>
      </SlidePanel>

      {/* Step: Setup — list of exams */}
      {step==="setup" && (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          {exams.length===0
            ? <div className="text-center py-20 text-gray-400"><p className="text-4xl mb-2">📊</p><p>No exams yet. Create one above.</p></div>
            : <table className="w-full text-sm">
              <thead><tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-5 py-3 font-semibold text-gray-500">Exam</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-500 hidden sm:table-cell">Class</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-500 hidden md:table-cell">Subject</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-500 hidden sm:table-cell">Max</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-500">Date</th>
                <th className="text-right px-5 py-3"/>
              </tr></thead>
              <tbody className="divide-y divide-gray-50">
                {exams.map(e=>(
                  <tr key={e.id} className="hover:bg-gray-50/50 transition">
                    <td className="px-5 py-3.5 font-semibold text-secondary">{e.name}</td>
                    <td className="px-5 py-3.5 text-gray-600 hidden sm:table-cell">{e.class_name}{e.section?" "+e.section:""}</td>
                    <td className="px-5 py-3.5 text-gray-600 hidden md:table-cell">{e.subject}</td>
                    <td className="px-5 py-3.5 text-gray-600 hidden sm:table-cell">{e.max_marks}</td>
                    <td className="px-5 py-3.5 text-gray-500 text-xs">{e.exam_date}</td>
                    <td className="px-5 py-3.5 text-right">
                      <button onClick={()=>openExam(e)} className="px-3 py-1.5 text-xs font-semibold bg-secondary text-white rounded-xl hover:bg-primary transition">Open →</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>}
        </div>
      )}

      {/* Step: Entry */}
      {step==="entry" && selExam && (
        <div className="space-y-4">
          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 flex items-center gap-4 flex-wrap">
            <div><p className="text-xs text-gray-500">Exam</p><p className="font-bold text-secondary">{selExam.name}</p></div>
            <div><p className="text-xs text-gray-500">Class</p><p className="font-bold text-secondary">{selExam.class_name} {selExam.section}</p></div>
            <div><p className="text-xs text-gray-500">Subject</p><p className="font-bold text-secondary">{selExam.subject}</p></div>
            <div><p className="text-xs text-gray-500">Max Marks</p><p className="font-bold text-primary">{selExam.max_marks}</p></div>
          </div>
          {loading
            ? Array(8).fill(0).map((_,i)=><Sk key={i} className="h-[52px]"/>)
            : students.length===0
              ? <p className="text-center text-gray-400 py-12">No students found for {selExam.class_name} {selExam.section}.</p>
              : <>
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                  <div className="px-5 py-3 bg-gray-50 border-b border-gray-100 text-xs font-bold uppercase tracking-wide text-gray-400 grid grid-cols-[40px_1fr_140px]">
                    <span>Roll</span><span>Student Name</span><span className="text-right">Marks (/{selExam.max_marks})</span>
                  </div>
                  {students.map((s,i)=>(
                    <div key={s.id} className="grid grid-cols-[40px_1fr_140px] items-center px-5 py-3 border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                      <span className="text-xs font-bold text-gray-400">{s.roll_number}</span>
                      <span className="text-sm font-medium text-secondary">{s.full_name}</span>
                      <div className="flex justify-end">
                        <input
                          type="number" min="0" max={selExam.max_marks} step="0.5"
                          value={marks[s.id]||""} placeholder="—"
                          onChange={e=>{
                            const v = e.target.value;
                            if(v===""||parseFloat(v)<=selExam.max_marks) setMarks(p=>({...p,[s.id]:v}));
                          }}
                          onKeyDown={e=>{ if(e.key==="Enter"||e.key==="Tab"){ e.preventDefault(); const next=students[i+1]; if(next) document.getElementById(`m-${next.id}`)?.focus(); }}}
                          id={`m-${s.id}`}
                          className="w-24 border border-gray-200 rounded-xl px-3 py-1.5 text-sm text-center focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition"
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-3">
                  <PrimaryBtn loading={saving} onClick={saveMarks} className="flex-1 py-3">Save & View Results</PrimaryBtn>
                </div>
              </>}
        </div>
      )}

      {/* Step: Results */}
      {step==="results" && selExam && (
        <div className="space-y-5">
          {/* Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              {label:"Students",val:students.length,color:"bg-secondary"},
              {label:"Passed",  val:passed,          color:"bg-emerald-600"},
              {label:"Failed",  val:students.length-passed,color:"bg-red-500"},
              {label:"Avg Score",val:`${avg}%`,       color:"bg-primary"},
            ].map(c=>(
              <div key={c.label} className={`${c.color} rounded-2xl p-4 text-white`}>
                <p className="text-2xl font-bold">{c.val}</p>
                <p className="text-xs text-white/70 mt-1">{c.label}</p>
              </div>
            ))}
          </div>
          {topper && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-3">
              <span className="text-2xl">⭐</span>
              <div>
                <p className="text-xs font-bold text-amber-600 uppercase tracking-wide">Class Topper</p>
                <p className="font-bold text-secondary">{topper.full_name} — {topper.marks}/{selExam.max_marks} ({topper.pct}%)</p>
              </div>
            </div>
          )}
          <div className="flex items-center gap-2 justify-between">
            <div className="flex gap-1.5 bg-gray-100 p-1 rounded-xl text-xs font-semibold">
              {[["roll","Roll No"],["marks","Marks"],["pct","Percentage"]].map(([id,lbl])=>(
                <button key={id} onClick={()=>setSortBy(id)}
                  className={`px-3 py-1.5 rounded-lg transition ${sortBy===id?"bg-white text-secondary shadow-sm":"text-gray-500"}`}>{lbl}</button>
              ))}
            </div>
            <button onClick={()=>window.print()} className="text-xs text-primary font-bold hover:underline print:hidden">🖨 Print Result Sheet</button>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden print-results">
            <table className="w-full text-sm">
              <thead><tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-center px-4 py-3 font-semibold text-gray-500 w-10">Rank</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-500 w-12">Roll</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-500">Name</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-500">Marks</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-500 hidden sm:table-cell">%</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-500">Grade</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-500 hidden sm:table-cell">Result</th>
              </tr></thead>
              <tbody className="divide-y divide-gray-50">
                {ranked.map(r=>(
                  <tr key={r.id} className={`hover:bg-gray-50/50 transition ${!r.pass?"bg-red-50/30":""}`}>
                    <td className="text-center px-4 py-3 text-sm font-bold text-gray-400">{r.rank}</td>
                    <td className="text-center px-4 py-3 text-sm text-gray-500">{r.roll_number}</td>
                    <td className="px-4 py-3 font-medium text-secondary">{r.full_name}</td>
                    <td className="text-center px-4 py-3 font-bold text-secondary">{r.marks}</td>
                    <td className="text-center px-4 py-3 text-gray-600 hidden sm:table-cell">{r.pct}%</td>
                    <td className="text-center px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-lg text-xs font-bold border ${r.gr.cls}`}>{r.gr.g}</span>
                    </td>
                    <td className="text-center px-4 py-3 hidden sm:table-cell">
                      <span className={`text-xs font-bold ${r.pass?"text-emerald-600":"text-red-600"}`}>{r.pass?"PASS":"FAIL"}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════
   TAB: NOTICES
═══════════════════════════════════════════ */
const NoticesTab = ({ userId }) => {
  const toast = useToast();
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [panelOpen, setPanelOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [confirmDel, setConfirmDel] = useState(null);
  const EMPTY = { title:"", body:"", audience:"All Students", priority:"Normal", publish_date:todayStr(), expiry_date:"", is_published:false };
  const [form, setForm] = useState(EMPTY);

  const fetch = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from("notices").select("*").eq("teacher_id",userId).order("created_at",{ascending:false});
    setNotices(data||[]);
    setLoading(false);
  },[userId]);

  useEffect(() => { if(userId) fetch(); },[fetch]);

  const openCreate = () => { setEditing(null); setForm(EMPTY); setPanelOpen(true); };
  const openEdit   = (n)  => { setEditing(n); setForm({ title:n.title,body:n.body,audience:n.audience,priority:n.priority,publish_date:n.publish_date,expiry_date:n.expiry_date||"",is_published:n.is_published }); setPanelOpen(true); };

  const save = async () => {
    if (!form.title.trim()||!form.body.trim()) { toast("Title and body required.","error"); return; }
    setSaving(true);
    try {
      if (editing) {
        await supabase.from("notices").update(form).eq("id",editing.id);
        toast("Notice updated.");
      } else {
        await supabase.from("notices").insert({ ...form, teacher_id:userId });
        await logActivity(userId,"notice",`Notice posted: "${form.title}"`);
        toast("Notice created.");
      }
      setPanelOpen(false); fetch();
    } catch { toast("Failed.","error"); }
    setSaving(false);
  };

  const del = async (id) => {
    await supabase.from("notices").delete().eq("id",id);
    setConfirmDel(null); toast("Deleted.","info"); fetch();
  };

  const togglePublish = async (n) => {
    await supabase.from("notices").update({ is_published:!n.is_published }).eq("id",n.id);
    toast(n.is_published?"Unpublished.":"Published ✓");
    fetch();
  };

  const isExpired = (n) => n.expiry_date && new Date(n.expiry_date) < new Date(todayStr());
  const statusLabel = (n) => isExpired(n) ? "Expired" : n.is_published ? "Published" : "Draft";
  const statusCls = (n) => isExpired(n)
    ? "bg-gray-100 text-gray-500"
    : n.is_published ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700";

  return (
    <>
      <div className="space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="text-xl font-bold text-secondary">Notices Board</h2>
            <p className="text-xs text-gray-400 mt-0.5">Students see published notices on their dashboard.</p>
          </div>
          <PrimaryBtn onClick={openCreate}>+ New Notice</PrimaryBtn>
        </div>

        {loading
          ? <div className="space-y-3">{Array(4).fill(0).map((_,i)=><Sk key={i} className="h-16"/>)}</div>
          : notices.length===0
            ? <div className="text-center py-20 text-gray-400"><p className="text-4xl mb-2">📢</p><p>No notices yet. Create your first.</p></div>
            : <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <table className="w-full text-sm">
                <thead><tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-5 py-3 font-semibold text-gray-500">Notice</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-500 hidden sm:table-cell">Audience</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-500 hidden md:table-cell">Date</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-500">Status</th>
                  <th className="text-right px-5 py-3"/>
                </tr></thead>
                <tbody className="divide-y divide-gray-50">
                  {notices.map(n=>(
                    <tr key={n.id} className="hover:bg-gray-50/50 transition">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          {n.priority==="Urgent" && <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0"/>}
                          <div>
                            <p className="font-semibold text-secondary truncate max-w-[200px]">{n.title}</p>
                            <p className="text-xs text-gray-400 truncate max-w-[200px] mt-0.5">{n.body}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 hidden sm:table-cell">
                        <span className="px-2.5 py-1 bg-primary/10 text-primary rounded-lg text-xs font-semibold">{n.audience}</span>
                      </td>
                      <td className="px-5 py-4 text-xs text-gray-400 hidden md:table-cell">{n.publish_date}</td>
                      <td className="px-5 py-4">
                        <button onClick={()=>!isExpired(n)&&togglePublish(n)} disabled={isExpired(n)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${statusCls(n)} ${!isExpired(n)?"hover:opacity-80":""}`}>
                          {statusLabel(n)}
                        </button>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={()=>openEdit(n)} className="px-3 py-1.5 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100 transition">Edit</button>
                          {confirmDel===n.id
                            ? <>
                                <button onClick={()=>del(n.id)} className="px-3 py-1.5 rounded-xl text-xs font-bold bg-red-600 text-white hover:bg-red-700 transition">Confirm</button>
                                <button onClick={()=>setConfirmDel(null)} className="px-3 py-1.5 rounded-xl text-xs text-gray-500 hover:bg-gray-100 transition">Cancel</button>
                              </>
                            : <button onClick={()=>setConfirmDel(n.id)} className="px-3 py-1.5 rounded-xl text-xs font-semibold text-red-500 hover:bg-red-50 transition">Delete</button>}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>}
      </div>

      <SlidePanel open={panelOpen} onClose={()=>setPanelOpen(false)} title={editing?"Edit Notice":"Create Notice"}>
        <div className="space-y-4">
          <div><Label c="Title *"/><Inp value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="Notice title..."/></div>
          <div><Label c="Body *"/><Txt rows={5} value={form.body} onChange={e=>setForm({...form,body:e.target.value})} placeholder="Write notice content..."/></div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label c="Target Audience"/>
              <Sel value={form.audience} onChange={e=>setForm({...form,audience:e.target.value})}>
                {AUDIENCE_OPTIONS.map(o=><option key={o}>{o}</option>)}
              </Sel>
            </div>
            <div>
              <Label c="Priority"/>
              <Sel value={form.priority} onChange={e=>setForm({...form,priority:e.target.value})}>
                <option>Normal</option><option>Urgent</option>
              </Sel>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><Label c="Publish Date"/><Inp type="date" value={form.publish_date} onChange={e=>setForm({...form,publish_date:e.target.value})}/></div>
            <div><Label c="Expiry Date" note="optional"/><Inp type="date" value={form.expiry_date} onChange={e=>setForm({...form,expiry_date:e.target.value})}/></div>
          </div>
          <div className="flex items-center gap-3 p-3.5 bg-gray-50 rounded-xl">
            <button onClick={()=>setForm({...form,is_published:!form.is_published})}
              className={`relative w-10 h-5 rounded-full transition-colors duration-200 flex-shrink-0 ${form.is_published?"bg-emerald-500":"bg-gray-300"}`}>
              <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${form.is_published?"translate-x-5":"translate-x-0"}`}/>
            </button>
            <span className="text-sm font-medium text-secondary">{form.is_published?"Publish immediately":"Save as draft"}</span>
          </div>
          <PrimaryBtn loading={saving} onClick={save} className="w-full py-3">
            {editing?"Update Notice":"Create Notice"}
          </PrimaryBtn>
        </div>
      </SlidePanel>
    </>
  );
};

/* ═══════════════════════════════════════════
   TAB: STUDY MATERIAL
═══════════════════════════════════════════ */
const MaterialsTab = ({ userId, teacher }) => {
  const toast = useToast();
  const fileRef = useRef();
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [fSub, setFSub] = useState("All");
  const [fCls, setFCls] = useState("All");
  const [file, setFile] = useState(null);
  const [form, setForm] = useState({ title:"", subject:"", class_name:"", section:"", chapter:"", description:"" });

  const fetchMats = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from("study_materials").select("*").eq("teacher_id",userId).order("created_at",{ascending:false});
    setMaterials(data||[]);
    setLoading(false);
  },[userId]);

  useEffect(() => { if(userId) fetchMats(); },[fetchMats]);

  const upload = async () => {
    if (!form.title||!form.subject||!form.class_name||!file) { toast("Fill all fields and select a file.","error"); return; }
    if (file.size>10*1024*1024) { toast("File must be under 10MB.","error"); return; }
    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `${userId}/${Date.now()}.${ext}`;
      const { error:ue } = await supabase.storage.from("study-materials").upload(path, file);
      if (ue) throw ue;
      const { data:ud } = supabase.storage.from("study-materials").getPublicUrl(path);
      await supabase.from("study_materials").insert({ ...form, teacher_id:userId, file_url:ud.publicUrl, file_type:ext });
      await logActivity(userId,"material",`Uploaded: "${form.title}"`);
      toast("File uploaded successfully.");
      setForm({ title:"",subject:"",class_name:"",section:"",chapter:"",description:"" });
      setFile(null);
      if (fileRef.current) fileRef.current.value="";
      fetchMats();
    } catch { toast("Upload failed.","error"); }
    setUploading(false);
  };

  const del = async (m) => {
    try {
      const path = m.file_url.split("/study-materials/")[1];
      if (path) await supabase.storage.from("study-materials").remove([path]);
    } catch {}
    await supabase.from("study_materials").delete().eq("id",m.id);
    toast("Deleted.","info"); fetchMats();
  };

  const copyLink = (url) => { navigator.clipboard.writeText(url); toast("Link copied!"); };

  const FICON = { pdf:"📄",doc:"📝",docx:"📝",png:"🖼",jpg:"🖼",jpeg:"🖼",ppt:"📊",pptx:"📊" };
  const ficon = (t) => FICON[t?.toLowerCase()]||"📁";

  const allSubs = ["All",...new Set(materials.map(m=>m.subject).filter(Boolean))];
  const allCls  = ["All",...new Set(materials.map(m=>m.class_name).filter(Boolean))];
  const filtered = materials.filter(m=>(fSub==="All"||m.subject===fSub)&&(fCls==="All"||m.class_name===fCls));

  return (
    <div className="space-y-6">
      {/* Upload Form */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-4">📤 Upload New Material</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div><Label c="Title *"/><Inp value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="e.g. Chapter 3 Notes"/></div>
          <div><Label c="Subject *"/><Inp value={form.subject} onChange={e=>setForm({...form,subject:e.target.value})} placeholder="e.g. Physics"/></div>
          <div>
            <Label c="Class *"/>
            <Sel value={form.class_name} onChange={e=>setForm({...form,class_name:e.target.value})}>
              <option value="">Select class...</option>
              {CLASS_OPTIONS.map(c=><option key={c}>{c}</option>)}
            </Sel>
          </div>
          <div><Label c="Section"/><Inp value={form.section} onChange={e=>setForm({...form,section:e.target.value})} placeholder="e.g. A"/></div>
          <div><Label c="Chapter / Topic"/><Inp value={form.chapter} onChange={e=>setForm({...form,chapter:e.target.value})} placeholder="e.g. Gravitation"/></div>
          <div><Label c="Description" note="optional"/><Inp value={form.description} onChange={e=>setForm({...form,description:e.target.value})} placeholder="Short description..."/></div>
        </div>
        <div onClick={()=>fileRef.current?.click()} className="border-2 border-dashed border-gray-200 rounded-xl p-5 text-center cursor-pointer hover:border-primary transition mb-4">
          <input ref={fileRef} type="file" accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.ppt,.pptx" className="hidden" onChange={e=>setFile(e.target.files[0])}/>
          {file
            ? <p className="text-sm font-semibold text-secondary">{ficon(file.name.split(".").pop())} {file.name}</p>
            : <><p className="text-2xl mb-1">📁</p><p className="text-xs text-gray-400">Click to select file — PDF, DOC, PPT, Image (max 10MB)</p></>}
        </div>
        <PrimaryBtn loading={uploading} onClick={upload} className="w-full py-3">Upload Material</PrimaryBtn>
      </div>

      {/* Filter + Grid */}
      <div className="flex items-center gap-2 flex-wrap">
        <Sel value={fSub} onChange={e=>setFSub(e.target.value)} className="w-auto">{allSubs.map(s=><option key={s}>{s}</option>)}</Sel>
        <Sel value={fCls} onChange={e=>setFCls(e.target.value)} className="w-auto">{allCls.map(c=><option key={c}>{c}</option>)}</Sel>
        <span className="text-xs text-gray-400 ml-1">{filtered.length} file{filtered.length!==1?"s":""}</span>
      </div>

      {loading
        ? <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">{Array(6).fill(0).map((_,i)=><Sk key={i} className="h-40"/>)}</div>
        : filtered.length===0
          ? <div className="text-center py-16 text-gray-400"><p className="text-4xl mb-2">📚</p><p>No materials found.</p></div>
          : <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(m=>(
              <div key={m.id} className="bg-white rounded-2xl border border-gray-100 p-4 hover:shadow-md transition">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-xl flex-shrink-0">{ficon(m.file_type)}</div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-secondary text-sm truncate">{m.title}</p>
                    {m.description&&<p className="text-xs text-gray-400 truncate mt-0.5">{m.description}</p>}
                  </div>
                </div>
                <div className="flex gap-1.5 flex-wrap mb-2">
                  <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-md text-[11px] font-bold">{m.subject}</span>
                  <span className="px-2 py-0.5 bg-secondary/10 text-secondary rounded-md text-[11px] font-bold">{m.class_name}{m.section?" "+m.section:""}</span>
                  {m.chapter&&<span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-md text-[11px]">{m.chapter}</span>}
                </div>
                <p className="text-[11px] text-gray-400 mb-3">{timeAgo(m.created_at)}</p>
                <div className="flex gap-2">
                  <button onClick={()=>copyLink(m.file_url)} className="flex-1 py-1.5 text-xs font-semibold text-secondary border border-gray-200 rounded-xl hover:bg-gray-50 transition">Copy Link</button>
                  <a href={m.file_url} target="_blank" rel="noreferrer" className="flex-1 py-1.5 text-xs font-semibold text-primary border border-primary/20 rounded-xl hover:bg-primary/5 transition text-center">Open</a>
                  <button onClick={()=>del(m)} className="py-1.5 px-3 text-xs font-semibold text-red-500 border border-red-100 rounded-xl hover:bg-red-50 transition">Del</button>
                </div>
              </div>
            ))}
          </div>}
    </div>
  );
};

/* ═══════════════════════════════════════════
   TAB: SYLLABUS TRACKER
═══════════════════════════════════════════ */
const SyllabusTab = ({ userId, teacher }) => {
  const toast = useToast();
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [panelOpen, setPanelOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [filterCls, setFilterCls] = useState("All");
  const [form, setForm] = useState({ class_name:"", subject:"", chapter_name:"", total_topics:0, estimated_sessions:0 });

  const fetchChapters = useCallback(async () => {
    setLoading(true);
    const { data:chaps } = await supabase.from("syllabus_chapters").select("*").eq("teacher_id",userId).order("created_at");
    if (!chaps?.length) { setChapters([]); setLoading(false); return; }
    const { data:prog } = await supabase.from("syllabus_progress").select("*").in("chapter_id", chaps.map(c=>c.id));
    const progMap = {}; (prog||[]).forEach(p=>{ progMap[p.chapter_id]=p; });
    setChapters(chaps.map(c=>({ ...c, progress:progMap[c.id]||{ topics_completed:0, sessions_taken:0 } })));
    setLoading(false);
  },[userId]);

  useEffect(() => { if(userId) fetchChapters(); },[fetchChapters]);

  const addChapter = async () => {
    if (!form.class_name||!form.subject||!form.chapter_name||!form.total_topics) { toast("Fill all required fields.","error"); return; }
    setSaving(true);
    try {
      const { data,error } = await supabase.from("syllabus_chapters").insert({ ...form, teacher_id:userId, total_topics:Number(form.total_topics), estimated_sessions:Number(form.estimated_sessions) }).select().single();
      if (error) throw error;
      await supabase.from("syllabus_progress").insert({ chapter_id:data.id, topics_completed:0, sessions_taken:0 });
      toast("Chapter added."); setPanelOpen(false); fetchChapters();
    } catch { toast("Failed.","error"); }
    setSaving(false);
  };

  const updateProgress = async (chap, field, delta) => {
    const prog = chap.progress;
    const newVal = Math.max(0, Math.min(field==="topics_completed"?chap.total_topics:999, (prog[field]||0)+delta));
    const updated = { ...prog, [field]:newVal };
    setChapters(p=>p.map(c=>c.id===chap.id?{...c,progress:updated}:c));
    await supabase.from("syllabus_progress").upsert({ chapter_id:chap.id, ...updated, updated_at:new Date().toISOString() });
  };

  const delChapter = async (id) => {
    await supabase.from("syllabus_progress").delete().eq("chapter_id",id);
    await supabase.from("syllabus_chapters").delete().eq("id",id);
    toast("Chapter removed.","info"); fetchChapters();
  };

  const allCls = ["All",...new Set(chapters.map(c=>c.class_name))];
  const filtered = filterCls==="All" ? chapters : chapters.filter(c=>c.class_name===filterCls);

  // Group by class+subject
  const groups = {};
  filtered.forEach(c=>{
    const key=`${c.class_name} — ${c.subject}`;
    if (!groups[key]) groups[key]=[];
    groups[key].push(c);
  });

  // Overall completion
  const totalTopics = chapters.reduce((s,c)=>s+c.total_topics,0);
  const doneTopics  = chapters.reduce((s,c)=>s+(c.progress.topics_completed||0),0);
  const overallPct  = totalTopics>0 ? Math.round((doneTopics/totalTopics)*100) : 0;

  return (
    <>
      <div className="space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="text-xl font-bold text-secondary">Syllabus Tracker</h2>
            <p className="text-xs text-gray-400 mt-0.5">Principal can see completion progress across all teachers.</p>
          </div>
          <PrimaryBtn onClick={()=>setPanelOpen(true)}>+ Add Chapter</PrimaryBtn>
        </div>

        {/* Overall progress */}
        {chapters.length>0 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-5 flex-wrap">
            <div className="relative w-20 h-20 flex-shrink-0">
              <svg viewBox="0 0 36 36" className="w-20 h-20 -rotate-90">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f0f0f0" strokeWidth="3"/>
                <circle cx="18" cy="18" r="15.9" fill="none" stroke={overallPct>=75?"#16a34a":overallPct>=50?"#d97706":"#dc2626"}
                  strokeWidth="3" strokeDasharray={`${overallPct} 100`} strokeLinecap="round"/>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-base font-bold text-secondary">{overallPct}%</span>
              </div>
            </div>
            <div>
              <p className="text-lg font-bold text-secondary">Overall Syllabus Completion</p>
              <p className="text-sm text-gray-500 mt-0.5">{doneTopics} of {totalTopics} topics taught across all classes</p>
              {overallPct<50 && <p className="text-xs text-red-500 font-semibold mt-1">⚠ Behind schedule — pick up pace</p>}
            </div>
          </div>
        )}

        {/* Filter */}
        <div className="flex gap-2 flex-wrap">
          {allCls.map(c=>(
            <button key={c} onClick={()=>setFilterCls(c)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition ${filterCls===c?"bg-secondary text-white border-secondary":"border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
              {c}
            </button>
          ))}
        </div>

        {loading
          ? Array(3).fill(0).map((_,i)=><Sk key={i} className="h-32"/>)
          : Object.keys(groups).length===0
            ? <div className="text-center py-20 text-gray-400"><p className="text-4xl mb-2">📋</p><p>No chapters added yet. Add your syllabus.</p></div>
            : Object.entries(groups).map(([grpKey, chaps])=>{
                const gTotal = chaps.reduce((s,c)=>s+c.total_topics,0);
                const gDone  = chaps.reduce((s,c)=>s+(c.progress.topics_completed||0),0);
                const gPct   = gTotal>0?Math.round((gDone/gTotal)*100):0;
                return (
                  <div key={grpKey} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                    <div className="px-5 py-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-secondary">{grpKey}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{gDone}/{gTotal} topics — {gPct}% complete</p>
                      </div>
                      <div className="w-24">
                        <div className="h-2 bg-gray-200 rounded-full">
                          <div className={`h-2 rounded-full transition-all ${gPct>=75?"bg-emerald-500":gPct>=50?"bg-amber-500":"bg-red-500"}`} style={{width:`${gPct}%`}}/>
                        </div>
                      </div>
                    </div>
                    <div className="divide-y divide-gray-50">
                      {chaps.map(c=>{
                        const prog = c.progress;
                        const pct = c.total_topics>0?Math.round(((prog.topics_completed||0)/c.total_topics)*100):0;
                        const behind = prog.sessions_taken > c.estimated_sessions;
                        return (
                          <div key={c.id} className="px-5 py-4">
                            <div className="flex items-start justify-between gap-3 mb-3">
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-secondary text-sm">{c.chapter_name}</p>
                                <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                                  <span className={pct===100?"text-emerald-600 font-semibold":""}>
                                    {prog.topics_completed||0}/{c.total_topics} topics
                                  </span>
                                  <span className={behind?"text-red-500 font-semibold":""}>
                                    {prog.sessions_taken||0}/{c.estimated_sessions} sessions {behind?"⚠":""}
                                  </span>
                                </div>
                              </div>
                              <button onClick={()=>delChapter(c.id)} className="text-xs text-red-400 hover:text-red-600 flex-shrink-0">✕</button>
                            </div>
                            {/* Progress bar */}
                            <div className="h-1.5 bg-gray-100 rounded-full mb-3">
                              <div className={`h-1.5 rounded-full transition-all duration-300 ${pct===100?"bg-emerald-500":pct>=50?"bg-primary":"bg-amber-400"}`} style={{width:`${pct}%`}}/>
                            </div>
                            {/* Controls */}
                            <div className="flex items-center gap-4 flex-wrap">
                              <div className="flex items-center gap-2 text-xs font-medium text-gray-600">
                                <span>Topics:</span>
                                <button onClick={()=>updateProgress(c,"topics_completed",-1)} className="w-6 h-6 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center font-bold text-gray-600 transition">−</button>
                                <span className="font-bold text-secondary w-5 text-center">{prog.topics_completed||0}</span>
                                <button onClick={()=>updateProgress(c,"topics_completed",1)} disabled={prog.topics_completed>=c.total_topics} className="w-6 h-6 rounded-lg bg-primary/10 hover:bg-primary/20 flex items-center justify-center font-bold text-primary transition disabled:opacity-40">+</button>
                              </div>
                              <div className="flex items-center gap-2 text-xs font-medium text-gray-600">
                                <span>Sessions:</span>
                                <button onClick={()=>updateProgress(c,"sessions_taken",-1)} className="w-6 h-6 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center font-bold text-gray-600 transition">−</button>
                                <span className="font-bold text-secondary w-5 text-center">{prog.sessions_taken||0}</span>
                                <button onClick={()=>updateProgress(c,"sessions_taken",1)} className="w-6 h-6 rounded-lg bg-primary/10 hover:bg-primary/20 flex items-center justify-center font-bold text-primary transition">+</button>
                              </div>
                              {pct===100 && <span className="text-xs font-bold text-emerald-600">✓ Complete</span>}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
      </div>

      <SlidePanel open={panelOpen} onClose={()=>setPanelOpen(false)} title="Add Chapter">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label c="Class *"/>
              <Sel value={form.class_name} onChange={e=>setForm({...form,class_name:e.target.value})}>
                <option value="">Select...</option>
                {CLASS_OPTIONS.map(c=><option key={c}>{c}</option>)}
              </Sel>
            </div>
            <div><Label c="Subject *"/><Inp value={form.subject} onChange={e=>setForm({...form,subject:e.target.value})} placeholder="e.g. Physics"/></div>
          </div>
          <div><Label c="Chapter Name *"/><Inp value={form.chapter_name} onChange={e=>setForm({...form,chapter_name:e.target.value})} placeholder="e.g. Chapter 5: Gravitation"/></div>
          <div className="grid grid-cols-2 gap-4">
            <div><Label c="Total Topics *"/><Inp type="number" min="1" value={form.total_topics} onChange={e=>setForm({...form,total_topics:e.target.value})}/></div>
            <div><Label c="Est. Sessions"/><Inp type="number" min="1" value={form.estimated_sessions} onChange={e=>setForm({...form,estimated_sessions:e.target.value})}/></div>
          </div>
          <PrimaryBtn loading={saving} onClick={addChapter} className="w-full py-3">Add Chapter</PrimaryBtn>
        </div>
      </SlidePanel>
    </>
  );
};

/* ═══════════════════════════════════════════
   TAB: TIMETABLE
═══════════════════════════════════════════ */
const TimetableTab = ({ userId }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const today = todayDay();

  useEffect(() => {
    const f = async () => {
      setLoading(true);
      const { data:rows } = await supabase.from("timetable").select("*").eq("teacher_id",userId);
      setData(rows||[]);
      setLoading(false);
    };
    if(userId) f();
  },[userId]);

  const cell = (day,slot) => data.find(r=>r.day===day&&r.time_slot===slot);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-secondary">My Timetable</h2>
        <p className="text-xs text-gray-400 mt-0.5">Read-only. Contact admin to make changes.</p>
      </div>
      {loading ? <Sk className="h-96"/> : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-x-auto">
          <table className="w-full text-xs min-w-[640px]">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-4 py-3 text-left text-gray-400 font-semibold w-16 bg-gray-50">Time</th>
                {DAYS.map(d=>(
                  <th key={d} className={`px-2 py-3 font-semibold text-center ${d===today?"text-primary bg-primary/5":"text-gray-500 bg-gray-50"}`}>
                    <span>{d.slice(0,3)}</span>
                    {d===today&&<span className="ml-1 w-1.5 h-1.5 rounded-full bg-primary inline-block"/>}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {TIME_SLOTS.map(slot=>(
                <tr key={slot} className="hover:bg-gray-50/50 transition">
                  <td className="px-4 py-3 text-gray-400 font-mono text-[11px] font-semibold whitespace-nowrap bg-gray-50/50">{slot}</td>
                  {DAYS.map(d=>{
                    const c = cell(d,slot);
                    return (
                      <td key={d} className={`px-2 py-2 text-center ${d===today?"bg-primary/5":""}`}>
                        {c ? (
                          <div className="bg-secondary/8 border border-secondary/15 rounded-xl px-2 py-1.5">
                            <p className="font-bold text-secondary text-[11px] leading-tight">{c.class_name}</p>
                            {c.section&&<p className="text-gray-500 text-[10px]">Sec {c.section}</p>}
                            {c.room&&<p className="text-primary text-[10px] font-semibold">Rm {c.room}</p>}
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
  const [form, setForm] = useState({ full_name:"", phone:"", bio:"", avatar_url:"" });
  const [subject, setSubject] = useState("");
  const [empId, setEmpId] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  useEffect(() => {
    const f = async () => {
      const { data } = await supabase.from("teacher_profiles").select("*").eq("user_id",userId).single();
      if (data) {
        setForm({ full_name:data.full_name||"", phone:data.phone||"", bio:data.bio||"", avatar_url:data.avatar_url||"" });
        setSubject(data.subject||""); setEmpId(data.employee_id||"");
      }
    };
    if(userId) f();
  },[userId]);

  const uploadPhoto = async (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setUploadingPhoto(true);
    try {
      const ext = f.name.split(".").pop();
      const path = `avatars/${userId}.${ext}`;
      await supabase.storage.from("avatars").upload(path, f, { upsert:true });
      const { data:ud } = supabase.storage.from("avatars").getPublicUrl(path);
      setForm(p=>({...p,avatar_url:ud.publicUrl}));
      toast("Photo updated.");
    } catch { toast("Photo upload failed.","error"); }
    setUploadingPhoto(false);
  };

  const save = async () => {
    setSaving(true);
    try {
      await supabase.from("teacher_profiles").upsert({ user_id:userId, ...form, subject, employee_id:empId });
      toast("Profile saved.");
      onUpdate?.({ ...form, subject });
    } catch { toast("Failed to save.","error"); }
    setSaving(false);
  };

  return (
    <div className="max-w-2xl space-y-5">
      <div>
        <h2 className="text-xl font-bold text-secondary">My Profile</h2>
        <p className="text-xs text-gray-400 mt-0.5">Update your information and photo.</p>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
        {/* Avatar */}
        <div className="flex items-center gap-5">
          <div className="relative flex-shrink-0">
            <div className="w-20 h-20 rounded-2xl bg-secondary flex items-center justify-center text-white text-2xl font-bold overflow-hidden">
              {form.avatar_url ? <img src={form.avatar_url} alt="" className="w-full h-full object-cover"/> : (form.full_name?.[0]?.toUpperCase()||"T")}
            </div>
            <button onClick={()=>photoRef.current?.click()}
              className="absolute -bottom-1 -right-1 w-7 h-7 bg-primary rounded-lg flex items-center justify-center text-white text-xs shadow hover:bg-secondary transition">
              {uploadingPhoto?"…":"✎"}
            </button>
            <input ref={photoRef} type="file" accept="image/*" className="hidden" onChange={uploadPhoto}/>
          </div>
          <div>
            <p className="font-bold text-secondary text-lg">{form.full_name||"Your Name"}</p>
            <p className="text-sm text-gray-400">{subject||"Subject not set"}</p>
            <p className="text-xs text-gray-400 mt-0.5">{user?.email}</p>
            {empId&&<p className="text-xs text-gray-400">ID: {empId}</p>}
          </div>
        </div>
        <div className="border-t border-gray-100 pt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div><Label c="Full Name"/><Inp value={form.full_name} onChange={e=>setForm({...form,full_name:e.target.value})} placeholder="Your full name"/></div>
          <div><Label c="Phone"/><Inp value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} placeholder="10-digit number" maxLength={10}/></div>
          <div><Label c="Email" note="(from account)"/><Inp value={user?.email||""} readOnly className="bg-gray-50 text-gray-400 cursor-not-allowed"/></div>
          <div><Label c="Subject" note="(set by admin)"/><Inp value={subject} readOnly className="bg-gray-50 text-gray-400 cursor-not-allowed"/></div>
          <div><Label c="Employee ID" note="(set by admin)"/><Inp value={empId} readOnly className="bg-gray-50 text-gray-400 cursor-not-allowed"/></div>
          <div className="sm:col-span-2">
            <Label c="Bio" note="optional"/>
            <Txt rows={3} value={form.bio} onChange={e=>setForm({...form,bio:e.target.value})} placeholder="Short bio — visible to students"/>
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
  const [activeTab, setActiveTab] = useState("overview");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [teacher, setTeacher] = useState(null);
  const [draftCount, setDraftCount] = useState(0);

  useEffect(() => {
    const load = async () => {
      const [{ data:tp },{ count }] = await Promise.all([
        supabase.from("teacher_profiles").select("*").eq("user_id",userId).single(),
        supabase.from("notices").select("id",{count:"exact",head:true}).eq("teacher_id",userId).eq("is_published",false),
      ]);
      if (tp) setTeacher(tp);
      setDraftCount(count||0);
    };
    if (userId) load();
  },[userId]);

  const tabLabel = NAV.find(n=>n.id===activeTab)?.label||"Dashboard";

  const renderTab = () => {
    switch(activeTab) {
      case "overview":   return <OverviewTab   userId={userId} setActiveTab={setActiveTab}/>;
      case "attendance": return <AttendanceTab userId={userId}/>;
      case "homework":   return <HomeworkTab   userId={userId} teacher={teacher}/>;
      case "marks":      return <MarksTab      userId={userId} teacher={teacher}/>;
      case "notices":    return <NoticesTab    userId={userId}/>;
      case "materials":  return <MaterialsTab  userId={userId} teacher={teacher}/>;
      case "syllabus":   return <SyllabusTab   userId={userId} teacher={teacher}/>;
      case "timetable":  return <TimetableTab  userId={userId}/>;
      case "profile":    return <ProfileTab    userId={userId} user={user} onUpdate={d=>setTeacher(d)}/>;
      default:           return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-60 flex-shrink-0 fixed top-0 left-0 h-full z-30">
        <SidebarContent active={activeTab} setActive={setActiveTab} teacher={teacher} draftCount={draftCount} />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={()=>setMobileOpen(false)}/>
          <aside className="fixed top-0 left-0 h-full w-64 z-50 lg:hidden">
            <SidebarContent active={activeTab} setActive={setActiveTab} teacher={teacher} draftCount={draftCount} closeMobile={()=>setMobileOpen(false)}/>
          </aside>
        </>
      )}

      {/* Main */}
      <div className="flex-1 lg:ml-60 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="sticky top-0 z-20 bg-white/95 backdrop-blur border-b border-gray-100 px-4 sm:px-6 py-3.5 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={()=>setMobileOpen(true)}
              className="lg:hidden w-9 h-9 rounded-xl hover:bg-gray-100 flex items-center justify-center transition">
              <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>
              </svg>
            </button>
            <div>
              <h1 className="text-base font-bold text-secondary leading-tight">{tabLabel}</h1>
              <p className="text-[11px] text-gray-400 hidden sm:block">
                {new Date().toLocaleDateString("en-IN",{weekday:"short",day:"numeric",month:"short",year:"numeric"})}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 hidden sm:block truncate max-w-[140px]">{teacher?.full_name||user?.email}</span>
            <div className="w-8 h-8 rounded-xl bg-secondary flex items-center justify-center text-white text-sm font-bold overflow-hidden">
              {teacher?.avatar_url
                ? <img src={teacher.avatar_url} alt="" className="w-full h-full object-cover"/>
                : (teacher?.full_name?.[0]?.toUpperCase()||user?.email?.[0]?.toUpperCase()||"T")}
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
          .print-results table { font-size: 11px; }
        }
      `}</style>
    </div>
  );
};

const TeacherDashboard = () => (
  <ToastProvider>
    <DashboardInner/>
  </ToastProvider>
);

export default TeacherDashboard;