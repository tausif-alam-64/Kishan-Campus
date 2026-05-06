// import { createClient } from "@supabase/supabase-js";
import { useState, useEffect, useRef, useCallback, createContext, useContext } from "react";

// // ─── MOCK SUPABASE CLIENT ───────────────────────────────────────────────────
//  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
const supabase = {
  auth: {
    getUser: async () => ({ data: { user: { id: "u1", email: "aryan.sharma@school.in" } } }),
    signOut: async () => {},
  },
  from: (table) => ({
    select: (cols) => ({ eq: () => ({ order: () => ({ data: [], error: null }) }), order: () => ({ data: [], error: null }), data: [], error: null }),
    insert: (data) => ({ select: () => ({ data: [data], error: null }) }),
    update: (data) => ({ eq: () => ({ data, error: null }) }),
    delete: () => ({ eq: () => ({ data: null, error: null }) }),
    upsert: (data) => ({ data, error: null }),
  }),
  storage: { from: () => ({ upload: async () => ({ data: {}, error: null }), getPublicUrl: () => ({ data: { publicUrl: "#" } }) }) },
  channel: () => ({ on: () => ({ subscribe: () => {} }) }),
};

// ─── UTILITIES ────────────────────────────────────────────────────────────────
function timeAgo(date) {
  const now = new Date();
  const d = new Date(date);
  const diff = Math.floor((now - d) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 172800) return "Yesterday";
  return `${Math.floor(diff / 86400)}d ago`;
}

function currentAcademicYear() {
  const now = new Date();
  const y = now.getFullYear();
  return now.getMonth() >= 3 ? `${y}-${String(y + 1).slice(2)}` : `${y - 1}-${String(y).slice(2)}`;
}

function useDebounce(value, delay = 300) {
  const [deb, setDeb] = useState(value);
  useEffect(() => { const t = setTimeout(() => setDeb(value), delay); return () => clearTimeout(t); }, [value, delay]);
  return deb;
}

function gradeFromPercent(p) {
  if (p >= 90) return "A1";
  if (p >= 80) return "A2";
  if (p >= 70) return "B1";
  if (p >= 60) return "B2";
  if (p >= 50) return "C";
  if (p >= 33) return "D";
  return "F";
}

function gradeColor(g) {
  const map = { A1: "#16a34a", A2: "#22c55e", B1: "#3b82f6", B2: "#60a5fa", C: "#f59e0b", D: "#f97316", F: "#ef4444" };
  return map[g] || "#6b7280";
}

// ─── TOAST SYSTEM ─────────────────────────────────────────────────────────────
const ToastCtx = createContext(null);
function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const add = useCallback((msg, type = "info") => {
    const id = Date.now();
    setToasts(p => [...p, { id, msg, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 4000);
  }, []);
  const remove = (id) => setToasts(p => p.filter(t => t.id !== id));
  return (
    <ToastCtx.Provider value={add}>
      {children}
      <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 9999, display: "flex", flexDirection: "column", gap: 8, maxWidth: 360 }}>
        {toasts.map(t => (
          <div key={t.id} onClick={() => remove(t.id)} style={{
            padding: "12px 16px", borderRadius: 10, cursor: "pointer", fontSize: 14, fontWeight: 500,
            display: "flex", alignItems: "center", gap: 10, animation: "slideIn 0.25s ease",
            background: t.type === "success" ? "#dcfce7" : t.type === "error" ? "#fee2e2" : t.type === "warning" ? "#fef3c7" : "#dbeafe",
            color: t.type === "success" ? "#166534" : t.type === "error" ? "#991b1b" : t.type === "warning" ? "#92400e" : "#1e40af",
            border: `1px solid ${t.type === "success" ? "#86efac" : t.type === "error" ? "#fca5a5" : t.type === "warning" ? "#fcd34d" : "#93c5fd"}`,
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
          }}>
            <span style={{ fontSize: 18 }}>{t.type === "success" ? "✓" : t.type === "error" ? "✕" : t.type === "warning" ? "⚠" : "ℹ"}</span>
            {t.msg}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}
const useToast = () => useContext(ToastCtx);

// ─── AUTH CONTEXT ─────────────────────────────────────────────────────────────
const AuthCtx = createContext(null);
function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      // Mock profile — replace with real Supabase fetch
      setProfile({
        id: "u1", name: "Aryan Sharma", role: "student", class_name: "10", section: "A",
        roll_number: "15", subject: "Mathematics", employee_id: null, avatar_url: null,
        email: "aryan.sharma@school.in", phone: "9876543210"
      });
      setLoading(false);
    });
  }, []);
  return <AuthCtx.Provider value={{ user, profile, loading }}>{children}</AuthCtx.Provider>;
}
const useAuth = () => useContext(AuthCtx);

// ─── SKELETON ─────────────────────────────────────────────────────────────────
function Skeleton({ w = "100%", h = 20, r = 6 }) {
  return <div style={{ width: w, height: h, borderRadius: r, background: "linear-gradient(90deg,#f0f0f0 25%,#e0e0e0 50%,#f0f0f0 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.5s infinite" }} />;
}

function SkeletonCard() {
  return (
    <div style={{ padding: 20, border: "1px solid #e5e7eb", borderRadius: 12, display: "flex", flexDirection: "column", gap: 10 }}>
      <Skeleton h={16} w="60%" /><Skeleton h={28} w="40%" /><Skeleton h={12} w="80%" />
    </div>
  );
}

// ─── STAT CARD ────────────────────────────────────────────────────────────────
function StatCard({ label, value, icon, color, sub }) {
  return (
    <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 14, padding: "18px 20px", display: "flex", alignItems: "flex-start", gap: 14, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
      <div style={{ width: 44, height: 44, borderRadius: 10, background: color + "20", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{icon}</div>
      <div>
        <div style={{ fontSize: 12, color: "#6b7280", fontWeight: 500, marginBottom: 4 }}>{label}</div>
        <div style={{ fontSize: 24, fontWeight: 700, color: "#111827" }}>{value}</div>
        {sub && <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 2 }}>{sub}</div>}
      </div>
    </div>
  );
}

// ─── MODAL ───────────────────────────────────────────────────────────────────
function Modal({ open, onClose, title, children, width = 520 }) {
  if (!open) return null;
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: 16, width: "100%", maxWidth: width, maxHeight: "90vh", overflow: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
        <div style={{ padding: "20px 24px 16px", borderBottom: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>{title}</h3>
          <button onClick={onClose} style={{ border: "none", background: "none", cursor: "pointer", fontSize: 22, color: "#9ca3af", lineHeight: 1 }}>×</button>
        </div>
        <div style={{ padding: 24 }}>{children}</div>
      </div>
    </div>
  );
}

// ─── BADGE ───────────────────────────────────────────────────────────────────
function Badge({ label, color = "#3b82f6", bg }) {
  return <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 20, background: bg || color + "18", color, letterSpacing: "0.3px", whiteSpace: "nowrap" }}>{label}</span>;
}

// ─── BUTTON ──────────────────────────────────────────────────────────────────
function Btn({ children, onClick, variant = "primary", size = "md", disabled, style: s }) {
  const base = { border: "none", borderRadius: 9, cursor: disabled ? "not-allowed" : "pointer", fontWeight: 600, transition: "all 0.15s", opacity: disabled ? 0.5 : 1, fontFamily: "inherit" };
  const sizes = { sm: { padding: "6px 12px", fontSize: 13 }, md: { padding: "9px 18px", fontSize: 14 }, lg: { padding: "12px 24px", fontSize: 15 } };
  const variants = {
    primary: { background: "#4f46e5", color: "#fff" },
    secondary: { background: "#f3f4f6", color: "#374151" },
    danger: { background: "#fee2e2", color: "#dc2626" },
    ghost: { background: "transparent", color: "#4f46e5", border: "1px solid #e0e7ff" },
    success: { background: "#dcfce7", color: "#16a34a" },
  };
  return <button onClick={disabled ? undefined : onClick} style={{ ...base, ...sizes[size], ...variants[variant], ...s }}>{children}</button>;
}

// ─── INPUT ───────────────────────────────────────────────────────────────────
function Input({ label, value, onChange, type = "text", placeholder, required, min, max, style: s }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {label && <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>{label}{required && <span style={{ color: "#ef4444" }}> *</span>}</label>}
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} min={min} max={max}
        style={{ padding: "10px 12px", border: "1.5px solid #e5e7eb", borderRadius: 9, fontSize: 14, fontFamily: "inherit", outline: "none", transition: "border 0.15s", ...s }}
        onFocus={e => e.target.style.borderColor = "#4f46e5"} onBlur={e => e.target.style.borderColor = "#e5e7eb"} />
    </div>
  );
}

function Select({ label, value, onChange, options, required, style: s }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {label && <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>{label}{required && <span style={{ color: "#ef4444" }}> *</span>}</label>}
      <select value={value} onChange={e => onChange(e.target.value)}
        style={{ padding: "10px 12px", border: "1.5px solid #e5e7eb", borderRadius: 9, fontSize: 14, fontFamily: "inherit", outline: "none", background: "#fff", cursor: "pointer", ...s }}>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

function Textarea({ label, value, onChange, placeholder, rows = 4 }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {label && <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>{label}</label>}
      <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows}
        style={{ padding: "10px 12px", border: "1.5px solid #e5e7eb", borderRadius: 9, fontSize: 14, fontFamily: "inherit", resize: "vertical", outline: "none" }}
        onFocus={e => e.target.style.borderColor = "#4f46e5"} onBlur={e => e.target.style.borderColor = "#e5e7eb"} />
    </div>
  );
}

// ─── PROGRESS BAR ────────────────────────────────────────────────────────────
function ProgressBar({ value, max = 100, color = "#4f46e5", height = 8, showLabel = false }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ flex: 1, height, background: "#f3f4f6", borderRadius: height }}>
        <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: height, transition: "width 0.5s ease" }} />
      </div>
      {showLabel && <span style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", minWidth: 36 }}>{pct}%</span>}
    </div>
  );
}

// ─── DONUT RING ───────────────────────────────────────────────────────────────
function DonutRing({ value, max = 100, size = 120, color = "#4f46e5", label }) {
  const pct = Math.min(100, (value / max) * 100);
  const r = 46, cx = 60, cy = 60, circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
      <svg width={size} height={size} viewBox="0 0 120 120">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f3f4f6" strokeWidth={10} />
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={10}
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" transform="rotate(-90 60 60)" style={{ transition: "stroke-dasharray 0.6s ease" }} />
        <text x={cx} y={cy - 4} textAnchor="middle" dominantBaseline="middle" fontSize={18} fontWeight={700} fill="#111827">{Math.round(pct)}%</text>
        {label && <text x={cx} y={cy + 14} textAnchor="middle" fontSize={9} fill="#9ca3af">{label}</text>}
      </svg>
    </div>
  );
}

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const MOCK_STUDENTS = Array.from({ length: 38 }, (_, i) => ({
  id: `s${i + 1}`, roll: i + 1,
  name: ["Aarav Singh", "Priya Sharma", "Rohan Gupta", "Ananya Patel", "Vikram Rao", "Sneha Joshi", "Arjun Kumar", "Diya Mehta", "Karan Verma", "Pooja Nair",
    "Rahul Mishra", "Anjali Das", "Suresh Yadav", "Neha Srivastava", "Amit Pandey", "Riya Bhatt", "Mohit Tiwari", "Kavya Reddy", "Harsh Agarwal", "Sakshi Gupta",
    "Dev Malhotra", "Shruti Kapoor", "Vivek Bansal", "Pallavi Jain", "Nikhil Chaudhary", "Tanvi Bose", "Shivam Dubey", "Meera Pillai", "Akash Saxena", "Nisha Iyer",
    "Gaurav Sharma", "Isha Rao", "Siddharth Nair", "Aisha Khan", "Pratik Joshi", "Divya Mehta", "Rajat Kulkarni", "Simran Kaur"][i],
  attendance_pct: Math.floor(65 + Math.random() * 35),
  photo: null
}));

const MOCK_SUBJECTS = [
  { id: "sub1", name: "Mathematics", color: "#4f46e5", teacher: "Mr. Rajesh Sharma", icon: "📐" },
  { id: "sub2", name: "Science", color: "#0891b2", teacher: "Mrs. Priya Verma", icon: "🔬" },
  { id: "sub3", name: "English", color: "#7c3aed", teacher: "Mr. Amit Sinha", icon: "📚" },
  { id: "sub4", name: "Hindi", color: "#d97706", teacher: "Mrs. Sunita Rao", icon: "✍️" },
  { id: "sub5", name: "Social Science", color: "#059669", teacher: "Mr. Deepak Jha", icon: "🌍" },
  { id: "sub6", name: "Computer Science", color: "#dc2626", teacher: "Ms. Neha Kapoor", icon: "💻" },
];

const MOCK_TIMETABLE = {
  Monday: [
    { time: "8:00–8:45", subject: "Mathematics", room: "R-101", teacher: "Mr. Sharma" },
    { time: "8:45–9:30", subject: "Science", room: "Lab-1", teacher: "Mrs. Verma" },
    { time: "9:30–10:15", subject: "English", room: "R-101", teacher: "Mr. Sinha" },
    { time: "10:15–10:30", subject: "Break", room: "", teacher: "" },
    { time: "10:30–11:15", subject: "Hindi", room: "R-101", teacher: "Mrs. Rao" },
    { time: "11:15–12:00", subject: "Social Science", room: "R-201", teacher: "Mr. Jha" },
    { time: "12:00–12:45", subject: "Lunch", room: "", teacher: "" },
    { time: "12:45–1:30", subject: "Computer Science", room: "Lab-2", teacher: "Ms. Kapoor" },
    { time: "1:30–2:15", subject: "Free Period", room: "R-101", teacher: "" },
  ],
  Tuesday: [
    { time: "8:00–8:45", subject: "Science", room: "Lab-1", teacher: "Mrs. Verma" },
    { time: "8:45–9:30", subject: "Mathematics", room: "R-101", teacher: "Mr. Sharma" },
    { time: "9:30–10:15", subject: "Social Science", room: "R-201", teacher: "Mr. Jha" },
    { time: "10:15–10:30", subject: "Break", room: "", teacher: "" },
    { time: "10:30–11:15", subject: "Computer Science", room: "Lab-2", teacher: "Ms. Kapoor" },
    { time: "11:15–12:00", subject: "English", room: "R-101", teacher: "Mr. Sinha" },
    { time: "12:00–12:45", subject: "Lunch", room: "", teacher: "" },
    { time: "12:45–1:30", subject: "Hindi", room: "R-101", teacher: "Mrs. Rao" },
    { time: "1:30–2:15", subject: "Mathematics", room: "R-101", teacher: "Mr. Sharma" },
  ],
  Wednesday: [
    { time: "8:00–8:45", subject: "Hindi", room: "R-101", teacher: "Mrs. Rao" },
    { time: "8:45–9:30", subject: "Computer Science", room: "Lab-2", teacher: "Ms. Kapoor" },
    { time: "9:30–10:15", subject: "Mathematics", room: "R-101", teacher: "Mr. Sharma" },
    { time: "10:15–10:30", subject: "Break", room: "", teacher: "" },
    { time: "10:30–11:15", subject: "Science", room: "Lab-1", teacher: "Mrs. Verma" },
    { time: "11:15–12:00", subject: "English", room: "R-101", teacher: "Mr. Sinha" },
    { time: "12:00–12:45", subject: "Lunch", room: "", teacher: "" },
    { time: "12:45–1:30", subject: "Social Science", room: "R-201", teacher: "Mr. Jha" },
    { time: "1:30–2:15", subject: "Free Period", room: "R-101", teacher: "" },
  ],
  Thursday: [
    { time: "8:00–8:45", subject: "English", room: "R-101", teacher: "Mr. Sinha" },
    { time: "8:45–9:30", subject: "Hindi", room: "R-101", teacher: "Mrs. Rao" },
    { time: "9:30–10:15", subject: "Science", room: "Lab-1", teacher: "Mrs. Verma" },
    { time: "10:15–10:30", subject: "Break", room: "", teacher: "" },
    { time: "10:30–11:15", subject: "Mathematics", room: "R-101", teacher: "Mr. Sharma" },
    { time: "11:15–12:00", subject: "Computer Science", room: "Lab-2", teacher: "Ms. Kapoor" },
    { time: "12:00–12:45", subject: "Lunch", room: "", teacher: "" },
    { time: "12:45–1:30", subject: "Social Science", room: "R-201", teacher: "Mr. Jha" },
    { time: "1:30–2:15", subject: "Mathematics", room: "R-101", teacher: "Mr. Sharma" },
  ],
  Friday: [
    { time: "8:00–8:45", subject: "Social Science", room: "R-201", teacher: "Mr. Jha" },
    { time: "8:45–9:30", subject: "English", room: "R-101", teacher: "Mr. Sinha" },
    { time: "9:30–10:15", subject: "Hindi", room: "R-101", teacher: "Mrs. Rao" },
    { time: "10:15–10:30", subject: "Break", room: "", teacher: "" },
    { time: "10:30–11:15", subject: "Mathematics", room: "R-101", teacher: "Mr. Sharma" },
    { time: "11:15–12:00", subject: "Science", room: "Lab-1", teacher: "Mrs. Verma" },
    { time: "12:00–12:45", subject: "Lunch", room: "", teacher: "" },
    { time: "12:45–1:30", subject: "Computer Science", room: "Lab-2", teacher: "Ms. Kapoor" },
    { time: "1:30–2:15", subject: "Free Period", room: "R-101", teacher: "" },
  ],
  Saturday: [
    { time: "8:00–8:45", subject: "Mathematics", room: "R-101", teacher: "Mr. Sharma" },
    { time: "8:45–9:30", subject: "Science", room: "Lab-1", teacher: "Mrs. Verma" },
    { time: "9:30–10:15", subject: "Computer Science", room: "Lab-2", teacher: "Ms. Kapoor" },
    { time: "10:15–10:30", subject: "Break", room: "", teacher: "" },
    { time: "10:30–11:15", subject: "PT / Sports", room: "Ground", teacher: "Mr. Singh" },
    { time: "11:15–12:00", subject: "Library", room: "Library", teacher: "" },
  ],
};

const MOCK_HOMEWORK = [
  { id: "hw1", subject: "Mathematics", class_name: "10", section: "A", description: "Complete Exercise 5.3 (Q1–Q10) from NCERT. Also solve the 3 additional problems from the worksheet.", assigned_date: new Date(Date.now() - 2 * 86400000).toISOString(), due_date: new Date(Date.now() + 1 * 86400000).toISOString(), teacher: "Mr. Sharma", status: "active", submitted: false },
  { id: "hw2", subject: "Science", class_name: "10", section: "A", description: "Read Chapter 12 — Electricity. Answer short questions 1–8 from the chapter end. Make a circuit diagram.", assigned_date: new Date(Date.now() - 3 * 86400000).toISOString(), due_date: new Date(Date.now() + 2 * 86400000).toISOString(), teacher: "Mrs. Verma", status: "active", submitted: true },
  { id: "hw3", subject: "English", class_name: "10", section: "A", description: "Write a letter to the editor about increasing plastic pollution in your city. Word limit: 150 words.", assigned_date: new Date(Date.now() - 1 * 86400000).toISOString(), due_date: new Date(Date.now()).toISOString(), teacher: "Mr. Sinha", status: "active", submitted: false },
  { id: "hw4", subject: "Hindi", class_name: "10", section: "A", description: "अपनी पाठ्यपुस्तक के पाठ 7 का सारांश लिखें। अधिकतम 200 शब्द।", assigned_date: new Date(Date.now() - 5 * 86400000).toISOString(), due_date: new Date(Date.now() - 2 * 86400000).toISOString(), teacher: "Mrs. Rao", status: "reviewed", submitted: true },
  { id: "hw5", subject: "Social Science", class_name: "10", section: "A", description: "Draw and label the map of India showing major river systems. Use pencil and color pencils.", assigned_date: new Date(Date.now() - 4 * 86400000).toISOString(), due_date: new Date(Date.now() + 3 * 86400000).toISOString(), teacher: "Mr. Jha", status: "active", submitted: false },
];

const MOCK_EXAMS = [
  { id: "e1", name: "Unit Test 1", subject: "Mathematics", exam_date: new Date(Date.now() + 5 * 86400000).toISOString(), max_marks: 25, topics: "Ch 1: Real Numbers, Ch 2: Polynomials", status: "upcoming" },
  { id: "e2", name: "Unit Test 1", subject: "Science", exam_date: new Date(Date.now() + 8 * 86400000).toISOString(), max_marks: 25, topics: "Ch 10: Light, Ch 11: Human Eye", status: "upcoming" },
  { id: "e3", name: "Half Yearly", subject: "All Subjects", exam_date: new Date(Date.now() + 25 * 86400000).toISOString(), max_marks: 100, topics: "Ch 1–6 all subjects", status: "upcoming" },
  { id: "e4", name: "Unit Test 1", subject: "English", exam_date: new Date(Date.now() - 10 * 86400000).toISOString(), max_marks: 25, topics: "First Flight Ch 1–3, Grammar: Tenses", status: "completed", marks: 21 },
  { id: "e5", name: "Unit Test 1", subject: "Hindi", exam_date: new Date(Date.now() - 12 * 86400000).toISOString(), max_marks: 25, topics: "Sparsh Ch 1–3, Sanchayan Ch 1", status: "completed", marks: 18 },
];

const MOCK_RESULTS = [
  { exam: "UT1", subject: "Mathematics", marks: 22, max: 25, date: "Sep 2024" },
  { exam: "UT1", subject: "Science", marks: 19, max: 25, date: "Sep 2024" },
  { exam: "UT1", subject: "English", marks: 21, max: 25, date: "Sep 2024" },
  { exam: "UT1", subject: "Hindi", marks: 18, max: 25, date: "Sep 2024" },
  { exam: "UT1", subject: "Social Science", marks: 20, max: 25, date: "Sep 2024" },
  { exam: "UT2", subject: "Mathematics", marks: 24, max: 25, date: "Nov 2024" },
  { exam: "UT2", subject: "Science", marks: 21, max: 25, date: "Nov 2024" },
  { exam: "UT2", subject: "English", marks: 23, max: 25, date: "Nov 2024" },
  { exam: "UT2", subject: "Hindi", marks: 20, max: 25, date: "Nov 2024" },
  { exam: "UT2", subject: "Social Science", marks: 22, max: 25, date: "Nov 2024" },
];

const MOCK_NOTICES = [
  { id: "n1", title: "Half Yearly Exam Schedule Released", body: "The Half Yearly Examinations will commence from 15th January 2025. All students are advised to collect their admit cards from the school office. Detailed schedule is attached below.", priority: "urgent", audience: "All Students", published_at: new Date(Date.now() - 2 * 3600000).toISOString(), teacher: "Principal", is_read: false },
  { id: "n2", title: "Annual Sports Day — Participation Notice", body: "Annual Sports Day will be held on 20th December 2024. Students interested in participating should register with their PE teacher by 10th December.", priority: "normal", audience: "All Students", published_at: new Date(Date.now() - 1 * 86400000).toISOString(), teacher: "Mr. Singh", is_read: true },
  { id: "n3", title: "Science Exhibition Project Submission", body: "Class 10 students must submit their Science Exhibition projects by 5th December. Projects will be evaluated by a panel of judges on 8th December.", priority: "normal", audience: "Class 10A", published_at: new Date(Date.now() - 2 * 86400000).toISOString(), teacher: "Mrs. Verma", is_read: false },
  { id: "n4", title: "Winter Break Dates Announced", body: "School will remain closed from 25th December 2024 to 1st January 2025 for Winter Break. Classes will resume on 2nd January 2025.", priority: "normal", audience: "All Students", published_at: new Date(Date.now() - 3 * 86400000).toISOString(), teacher: "Principal", is_read: true },
];

const MOCK_MATERIALS = [
  { id: "m1", title: "NCERT Solutions — Chapter 5 Arithmetic Progressions", subject: "Mathematics", chapter: "Ch 5: AP", type: "PDF", size: "2.4 MB", teacher: "Mr. Sharma", date: new Date(Date.now() - 1 * 86400000).toISOString(), is_new: true, downloads: 34 },
  { id: "m2", title: "Electricity — Full Chapter Notes with Diagrams", subject: "Science", chapter: "Ch 12: Electricity", type: "PDF", size: "3.8 MB", teacher: "Mrs. Verma", date: new Date(Date.now() - 2 * 86400000).toISOString(), is_new: true, downloads: 29 },
  { id: "m3", title: "Letter Writing Formats and Samples", subject: "English", chapter: "Writing Skills", type: "DOC", size: "1.2 MB", teacher: "Mr. Sinha", date: new Date(Date.now() - 4 * 86400000).toISOString(), is_new: false, downloads: 41 },
  { id: "m4", title: "India — Map Practice Sheets (Printable)", subject: "Social Science", chapter: "Ch 3: Water Resources", type: "PDF", size: "5.1 MB", teacher: "Mr. Jha", date: new Date(Date.now() - 6 * 86400000).toISOString(), is_new: false, downloads: 52 },
  { id: "m5", title: "Python Programming — Loops & Functions", subject: "Computer Science", chapter: "Ch 4: Programming", type: "PDF", size: "1.9 MB", teacher: "Ms. Kapoor", date: new Date(Date.now() - 7 * 86400000).toISOString(), is_new: false, downloads: 27 },
  { id: "m6", title: "Trigonometry Formula Sheet", subject: "Mathematics", chapter: "Ch 8: Trigonometry", type: "PDF", size: "0.8 MB", teacher: "Mr. Sharma", date: new Date(Date.now() - 9 * 86400000).toISOString(), is_new: false, downloads: 63 },
];

const MOCK_DISCUSSIONS = [
  { id: "d1", subject: "Mathematics", title: "How to solve quadratic equations by completing the square?", body: "I'm confused about step 3 where we divide both sides. Can someone explain?", author: "Priya Sharma", reactions: 8, replies: 5, is_resolved: true, chapter: "Ch 4: Quadratics", time: new Date(Date.now() - 3600000).toISOString(), anonymous: false },
  { id: "d2", subject: "Science", title: "Difference between resistance and resistivity", body: "The textbook explanation is confusing. What's the actual practical difference?", author: "Rohan Gupta", reactions: 12, replies: 3, is_resolved: false, chapter: "Ch 12: Electricity", time: new Date(Date.now() - 7200000).toISOString(), anonymous: false },
  { id: "d3", subject: "English", title: "What is the central theme of 'A Letter to God'?", body: "For the exam, what should be the main points to write about the central theme?", author: "Anonymous", reactions: 15, replies: 7, is_resolved: true, chapter: "First Flight Ch 1", time: new Date(Date.now() - 86400000).toISOString(), anonymous: true },
  { id: "d4", subject: "Mathematics", title: "Practice problems for Arithmetic Progressions?", body: "Can someone share good practice problems with solutions for AP chapter?", author: "Dev Malhotra", reactions: 6, replies: 2, is_resolved: false, chapter: "Ch 5: AP", time: new Date(Date.now() - 2 * 86400000).toISOString(), anonymous: false },
];

const MOCK_SYLLABUS = [
  { id: "ch1", subject: "Mathematics", chapter: "Real Numbers", total_topics: 8, completed: 8, sessions: 6, est_sessions: 6, status: "completed" },
  { id: "ch2", subject: "Mathematics", chapter: "Polynomials", total_topics: 6, completed: 6, sessions: 5, est_sessions: 5, status: "completed" },
  { id: "ch3", subject: "Mathematics", chapter: "Pair of Linear Equations", total_topics: 10, completed: 7, sessions: 8, est_sessions: 8, status: "in_progress" },
  { id: "ch4", subject: "Mathematics", chapter: "Quadratic Equations", total_topics: 8, completed: 3, sessions: 3, est_sessions: 7, status: "in_progress" },
  { id: "ch5", subject: "Mathematics", chapter: "Arithmetic Progressions", total_topics: 7, completed: 0, sessions: 0, est_sessions: 6, status: "not_started" },
  { id: "ch6", subject: "Mathematics", chapter: "Triangles", total_topics: 9, completed: 0, sessions: 0, est_sessions: 8, status: "not_started" },
  { id: "ch7", subject: "Mathematics", chapter: "Coordinate Geometry", total_topics: 6, completed: 0, sessions: 0, est_sessions: 5, status: "not_started" },
  { id: "ch8", subject: "Mathematics", chapter: "Trigonometry", total_topics: 10, completed: 0, sessions: 0, est_sessions: 9, status: "not_started" },
];

const MOCK_NOTIFICATIONS = [
  { id: "no1", type: "homework", title: "New Homework Posted", body: "Mr. Sharma posted Maths homework due tomorrow", deep_link_tab: "homework", is_read: false, created_at: new Date(Date.now() - 1800000).toISOString() },
  { id: "no2", type: "notice", title: "Urgent Notice", body: "Half Yearly Exam Schedule Released — check notice board", deep_link_tab: "notices", is_read: false, created_at: new Date(Date.now() - 7200000).toISOString() },
  { id: "no3", type: "result", title: "Result Published", body: "Your UT1 English result is now available", deep_link_tab: "results", is_read: true, created_at: new Date(Date.now() - 86400000).toISOString() },
  { id: "no4", type: "material", title: "New Study Material", body: "Mrs. Verma uploaded Electricity Chapter Notes", deep_link_tab: "materials", is_read: true, created_at: new Date(Date.now() - 2 * 86400000).toISOString() },
  { id: "no5", type: "attendance", title: "Attendance Marked", body: "Your attendance for today (Mathematics period) has been recorded", deep_link_tab: "attendance", is_read: true, created_at: new Date(Date.now() - 2 * 86400000).toISOString() },
];

// ──────────────────────────────────────────────────────────────────────────────
// TAB 1: DASHBOARD
// ──────────────────────────────────────────────────────────────────────────────
function TabDashboard({ onNavigate }) {
  const { profile } = useAuth();
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const today = days[new Date().getDay()];
  const todaySchedule = (MOCK_TIMETABLE[today] || MOCK_TIMETABLE.Monday).filter(p => p.subject !== "Break" && p.subject !== "Lunch");
  const pendingHW = MOCK_HOMEWORK.filter(h => !h.submitted && new Date(h.due_date) >= new Date()).length;
  const upcomingExams = MOCK_EXAMS.filter(e => e.status === "upcoming").length;
  const unreadNotices = MOCK_NOTICES.filter(n => !n.is_read).length;
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const subjectColors = {
    Mathematics: "#4f46e5", Science: "#0891b2", English: "#7c3aed", Hindi: "#d97706",
    "Social Science": "#059669", "Computer Science": "#dc2626", "Free Period": "#9ca3af",
    "PT / Sports": "#16a34a", Library: "#6b7280"
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Greeting */}
      <div style={{ background: "linear-gradient(135deg,#4f46e5,#7c3aed)", borderRadius: 16, padding: "24px 28px", color: "#fff" }}>
        <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>{greeting}, {profile?.name?.split(" ")[0]} 👋</div>
        <div style={{ fontSize: 14, opacity: 0.85 }}>Class 10-A · Roll No. {profile?.roll_number} · {currentAcademicYear()}</div>
        <div style={{ marginTop: 16, display: "flex", gap: 24, flexWrap: "wrap" }}>
          <div><div style={{ fontSize: 28, fontWeight: 800 }}>{todaySchedule.length}</div><div style={{ fontSize: 12, opacity: 0.8 }}>Classes Today</div></div>
          <div><div style={{ fontSize: 28, fontWeight: 800, color: pendingHW > 0 ? "#fbbf24" : "#a3e635" }}>{pendingHW}</div><div style={{ fontSize: 12, opacity: 0.8 }}>Homework Pending</div></div>
          <div><div style={{ fontSize: 28, fontWeight: 800 }}>{upcomingExams}</div><div style={{ fontSize: 12, opacity: 0.8 }}>Upcoming Exams</div></div>
          <div><div style={{ fontSize: 28, fontWeight: 800, color: unreadNotices > 0 ? "#fbbf24" : "#a3e635" }}>{unreadNotices}</div><div style={{ fontSize: 12, opacity: 0.8 }}>Unread Notices</div></div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#6b7280", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.5px" }}>Quick Actions</div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {[
            { label: "📋 Attendance", tab: "attendance", color: "#4f46e5" },
            { label: "📚 Homework", tab: "homework", color: "#0891b2" },
            { label: "📝 Exams", tab: "exams", color: "#7c3aed" },
            { label: "📂 Materials", tab: "materials", color: "#059669" },
            { label: "💬 Discussions", tab: "discussions", color: "#d97706" },
          ].map(a => (
            <button key={a.tab} onClick={() => onNavigate(a.tab)} style={{ padding: "10px 16px", borderRadius: 10, border: `1.5px solid ${a.color}30`, background: `${a.color}08`, color: a.color, fontWeight: 600, fontSize: 13, cursor: "pointer", transition: "all 0.15s" }}
              onMouseEnter={e => { e.target.style.background = a.color + "15"; }} onMouseLeave={e => { e.target.style.background = a.color + "08"; }}>
              {a.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 20 }}>
        {/* Today's Schedule */}
        <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 14, padding: 20 }}>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>📅 Today's Schedule <Badge label={today} color="#4f46e5" /></div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {todaySchedule.map((p, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 10px", borderRadius: 8, background: "#f9fafb" }}>
                <div style={{ width: 4, height: 36, borderRadius: 4, background: subjectColors[p.subject] || "#9ca3af", flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{p.subject}</div>
                  <div style={{ fontSize: 11, color: "#9ca3af" }}>{p.time} · {p.room || "—"}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Tasks */}
        <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 14, padding: 20 }}>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 14 }}>⚡ Pending Tasks</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {MOCK_HOMEWORK.filter(h => !h.submitted).map(h => {
              const overdue = new Date(h.due_date) < new Date();
              const dueToday = new Date(h.due_date).toDateString() === new Date().toDateString();
              return (
                <div key={h.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 8, border: `1px solid ${overdue ? "#fee2e2" : dueToday ? "#fef3c7" : "#f3f4f6"}`, background: overdue ? "#fff5f5" : dueToday ? "#fffbeb" : "#f9fafb" }}>
                  <div style={{ fontSize: 16 }}>📝</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{h.subject}</div>
                    <div style={{ fontSize: 11, color: overdue ? "#dc2626" : "#9ca3af" }}>Due: {overdue ? "Overdue" : dueToday ? "Today" : new Date(h.due_date).toLocaleDateString("en-IN")}</div>
                  </div>
                  <Badge label={overdue ? "Overdue" : dueToday ? "Due Today" : "Pending"} color={overdue ? "#dc2626" : dueToday ? "#d97706" : "#6b7280"} />
                </div>
              );
            })}
            {MOCK_EXAMS.filter(e => e.status === "upcoming").slice(0, 2).map(e => (
              <div key={e.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 8, border: "1px solid #e0e7ff", background: "#f5f3ff" }}>
                <div style={{ fontSize: 16 }}>🎯</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{e.name} — {e.subject}</div>
                  <div style={{ fontSize: 11, color: "#7c3aed" }}>In {Math.ceil((new Date(e.exam_date) - new Date()) / 86400000)} days</div>
                </div>
                <Badge label="Exam" color="#7c3aed" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Attendance Streak + Recent Notices */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 20 }}>
        <div style={{ background: "linear-gradient(135deg,#ecfdf5,#d1fae5)", border: "1px solid #a7f3d0", borderRadius: 14, padding: 20 }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: "#065f46", marginBottom: 8 }}>🔥 Attendance Streak</div>
          <div style={{ fontSize: 36, fontWeight: 800, color: "#059669" }}>12 Days</div>
          <div style={{ fontSize: 13, color: "#065f46", marginTop: 4 }}>You've attended 12 consecutive school days!</div>
          <ProgressBar value={78} max={100} color="#059669" height={10} showLabel />
          <div style={{ fontSize: 12, color: "#6b7280", marginTop: 6 }}>78% overall this month</div>
        </div>

        <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 14, padding: 20 }}>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 14 }}>📢 Recent Notices</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {MOCK_NOTICES.slice(0, 3).map(n => (
              <div key={n.id} style={{ display: "flex", gap: 10, padding: "8px 0", borderBottom: "1px solid #f3f4f6" }}>
                {n.priority === "urgent" && <span style={{ fontSize: 10, padding: "2px 6px", background: "#fee2e2", color: "#dc2626", borderRadius: 20, fontWeight: 700, alignSelf: "flex-start", whiteSpace: "nowrap" }}>URGENT</span>}
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{n.title}</div>
                  <div style={{ fontSize: 11, color: "#9ca3af" }}>{timeAgo(n.published_at)}</div>
                </div>
                {!n.is_read && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#4f46e5", flexShrink: 0, marginTop: 4 }} />}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Subjects Performance Overview */}
      <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 14, padding: 20 }}>
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>📊 Subject Performance Overview</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(160px,1fr))", gap: 12 }}>
          {MOCK_SUBJECTS.map(sub => {
            const subResults = MOCK_RESULTS.filter(r => r.subject === sub.name);
            const avg = subResults.length > 0 ? Math.round(subResults.reduce((a, r) => a + (r.marks / r.max) * 100, 0) / subResults.length) : 0;
            return (
              <div key={sub.id} style={{ padding: "14px 16px", borderRadius: 10, border: `1.5px solid ${sub.color}25`, background: sub.color + "06" }}>
                <div style={{ fontSize: 20, marginBottom: 6 }}>{sub.icon}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{sub.name}</div>
                <div style={{ fontSize: 11, color: "#9ca3af", marginBottom: 8 }}>{subResults.length} tests</div>
                <ProgressBar value={avg} max={100} color={sub.color} height={6} showLabel />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// TAB 2: ATTENDANCE
// ──────────────────────────────────────────────────────────────────────────────
function TabAttendance() {
  const { profile } = useAuth();
  const toast = useToast();
  const isTeacher = profile?.role === "teacher";
  const [view, setView] = useState(isTeacher ? "mark" : "student");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [selectedClass, setSelectedClass] = useState("10");
  const [selectedSection, setSelectedSection] = useState("A");
  const [attendance, setAttendance] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [showDefaulters, setShowDefaulters] = useState(false);
  const [subView, setSubView] = useState("calendar");

  const toggleStatus = (sid) => {
    setAttendance(prev => {
      const cur = prev[sid] || "Present";
      const next = cur === "Present" ? "Absent" : cur === "Absent" ? "Late" : "Present";
      return { ...prev, [sid]: next };
    });
  };

  const markAll = (status) => {
    const all = {};
    MOCK_STUDENTS.forEach(s => { all[s.id] = status; });
    setAttendance(all);
    toast(`All students marked ${status}`, "success");
  };

  const submit = async () => {
    toast("Attendance submitted successfully!", "success");
    setEditMode(false);
  };

  const counts = MOCK_STUDENTS.reduce((a, s) => {
    const st = attendance[s.id] || "Present";
    a[st] = (a[st] || 0) + 1;
    return a;
  }, {});

  const defaulters = MOCK_STUDENTS.filter(s => s.attendance_pct < 75);

  // Calendar heatmap mock data
  const calDays = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - 29 + i);
    const day = d.getDay();
    if (day === 0) return { date: d, status: "sunday" };
    const r = Math.random();
    return { date: d, status: r > 0.85 ? "absent" : r > 0.75 ? "late" : "present" };
  });

  const attPct = Math.round((calDays.filter(d => d.status === "present").length / calDays.filter(d => d.status !== "sunday").length) * 100);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Role tabs */}
      {isTeacher && (
        <div style={{ display: "flex", gap: 8, background: "#f3f4f6", padding: 4, borderRadius: 10, width: "fit-content" }}>
          {["mark", "summary"].map(v => (
            <button key={v} onClick={() => setView(v)} style={{ padding: "8px 18px", borderRadius: 7, border: "none", fontWeight: 600, fontSize: 13, cursor: "pointer", background: view === v ? "#fff" : "transparent", color: view === v ? "#4f46e5" : "#6b7280", boxShadow: view === v ? "0 1px 3px rgba(0,0,0,0.1)" : "none", fontFamily: "inherit" }}>
              {v === "mark" ? "Mark Attendance" : "Monthly Summary"}
            </button>
          ))}
        </div>
      )}

      {/* Student view */}
      {!isTeacher && (
        <div>
          <div style={{ display: "flex", gap: 8, background: "#f3f4f6", padding: 4, borderRadius: 10, width: "fit-content", marginBottom: 20 }}>
            {["calendar", "subjects", "calculator"].map(v => (
              <button key={v} onClick={() => setSubView(v)} style={{ padding: "8px 16px", borderRadius: 7, border: "none", fontWeight: 600, fontSize: 13, cursor: "pointer", background: subView === v ? "#fff" : "transparent", color: subView === v ? "#4f46e5" : "#6b7280", fontFamily: "inherit" }}>
                {v === "calendar" ? "Calendar" : v === "subjects" ? "By Subject" : "Calculator"}
              </button>
            ))}
          </div>

          {subView === "calendar" && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 20 }}>
              <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 14, padding: 20 }}>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>Last 30 Days</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 5 }}>
                  {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => <div key={i} style={{ textAlign: "center", fontSize: 11, color: "#9ca3af", fontWeight: 600, paddingBottom: 4 }}>{d}</div>)}
                  {calDays.map((d, i) => (
                    <div key={i} title={d.date.toLocaleDateString()} style={{ width: "100%", paddingTop: "100%", position: "relative" }}>
                      <div style={{ position: "absolute", inset: 0, borderRadius: 5, background: d.status === "present" ? "#dcfce7" : d.status === "absent" ? "#fee2e2" : d.status === "late" ? "#fef3c7" : "#f3f4f6", border: d.status === "present" ? "1px solid #86efac" : d.status === "absent" ? "1px solid #fca5a5" : d.status === "late" ? "1px solid #fcd34d" : "none", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 600, color: d.status === "present" ? "#16a34a" : d.status === "absent" ? "#dc2626" : d.status === "late" ? "#d97706" : "#9ca3af" }}>
                        {d.date.getDate()}
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", gap: 12, marginTop: 12, flexWrap: "wrap" }}>
                  {[["#dcfce7", "#16a34a", "Present"], ["#fee2e2", "#dc2626", "Absent"], ["#fef3c7", "#d97706", "Late"]].map(([bg, c, l]) => (
                    <div key={l} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12 }}>
                      <div style={{ width: 12, height: 12, borderRadius: 3, background: bg, border: `1px solid ${c}60` }} /><span style={{ color: "#6b7280" }}>{l}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div style={{ background: "#fff", border: `2px solid ${attPct >= 85 ? "#86efac" : attPct >= 75 ? "#fcd34d" : "#fca5a5"}`, borderRadius: 14, padding: 20, textAlign: "center" }}>
                  <DonutRing value={attPct} max={100} size={120} color={attPct >= 85 ? "#16a34a" : attPct >= 75 ? "#d97706" : "#dc2626"} label="Attendance" />
                  <div style={{ fontWeight: 700, fontSize: 15, marginTop: 8 }}>{attPct}% Overall</div>
                  {attPct < 75 && <div style={{ fontSize: 12, color: "#dc2626", marginTop: 4 }}>⚠️ Below 75% — at risk!</div>}
                  {attPct >= 75 && attPct < 85 && <div style={{ fontSize: 12, color: "#d97706", marginTop: 4 }}>Maintain above 85% for safety</div>}
                  {attPct >= 85 && <div style={{ fontSize: 12, color: "#16a34a", marginTop: 4 }}>✓ Excellent attendance</div>}
                </div>
                {attPct < 80 && (
                  <div style={{ background: "#fff5f5", border: "1px solid #fca5a5", borderRadius: 14, padding: 16 }}>
                    <div style={{ fontWeight: 700, fontSize: 13, color: "#dc2626", marginBottom: 6 }}>⚠️ Attendance Warning</div>
                    <div style={{ fontSize: 12, color: "#7f1d1d" }}>
                      You need to attend {Math.ceil((0.75 * 30 - calDays.filter(d => d.status === "present").length) / 0.25)} more consecutive days to reach 75%.
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {subView === "subjects" && (
            <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 14, overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead><tr style={{ background: "#f9fafb" }}>
                  {["Subject", "Teacher", "Held", "Present", "Percentage"].map(h => <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 12, fontWeight: 700, color: "#6b7280", borderBottom: "1px solid #e5e7eb" }}>{h}</th>)}
                </tr></thead>
                <tbody>
                  {MOCK_SUBJECTS.map((s, i) => {
                    const held = Math.floor(20 + Math.random() * 10);
                    const present = Math.floor(held * (0.65 + Math.random() * 0.35));
                    const pct = Math.round((present / held) * 100);
                    return (
                      <tr key={s.id} style={{ borderBottom: "1px solid #f3f4f6", background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                        <td style={{ padding: "12px 16px", fontWeight: 600, fontSize: 14 }}><span style={{ marginRight: 6 }}>{s.icon}</span>{s.name}</td>
                        <td style={{ padding: "12px 16px", fontSize: 13, color: "#6b7280" }}>{s.teacher}</td>
                        <td style={{ padding: "12px 16px", fontSize: 13 }}>{held}</td>
                        <td style={{ padding: "12px 16px", fontSize: 13 }}>{present}</td>
                        <td style={{ padding: "12px 16px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <ProgressBar value={pct} max={100} color={pct < 75 ? "#dc2626" : pct < 85 ? "#d97706" : "#16a34a"} height={6} />
                            <span style={{ fontSize: 12, fontWeight: 700, color: pct < 75 ? "#dc2626" : "#16a34a", minWidth: 36 }}>{pct}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {subView === "calculator" && (
            <AttendanceCalculator attPct={attPct} />
          )}
        </div>
      )}

      {/* Teacher: Mark Attendance */}
      {isTeacher && view === "mark" && (
        <div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 16 }}>
            <Input label="Date" type="date" value={selectedDate} onChange={setSelectedDate} style={{ width: 160 }} />
            <Select label="Class" value={selectedClass} onChange={setSelectedClass} options={[{ value: "10", label: "Class 10" }, { value: "9", label: "Class 9" }]} />
            <Select label="Section" value={selectedSection} onChange={setSelectedSection} options={[{ value: "A", label: "Section A" }, { value: "B", label: "Section B" }]} />
          </div>

          {/* Counter */}
          <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
            {[["Present", "#16a34a", "#dcfce7"], ["Absent", "#dc2626", "#fee2e2"], ["Late", "#d97706", "#fef3c7"]].map(([st, c, bg]) => (
              <div key={st} style={{ padding: "10px 20px", borderRadius: 10, background: bg, border: `1.5px solid ${c}40` }}>
                <span style={{ fontWeight: 700, fontSize: 20, color: c }}>{counts[st] || 0}</span>
                <span style={{ fontSize: 13, color: c, marginLeft: 8, fontWeight: 600 }}>{st}</span>
              </div>
            ))}
          </div>

          {/* Bulk actions */}
          <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
            <Btn onClick={() => markAll("Present")} variant="success" size="sm">✓ Mark All Present</Btn>
            <Btn onClick={() => markAll("Absent")} variant="danger" size="sm">✕ Mark All Absent</Btn>
            <Btn onClick={() => setAttendance({})} variant="secondary" size="sm">↺ Reset</Btn>
          </div>

          {/* Student list */}
          <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 14, overflow: "hidden" }}>
            <div style={{ display: "grid", gridTemplateColumns: "50px 1fr auto", padding: "12px 16px", background: "#f9fafb", borderBottom: "1px solid #e5e7eb", fontSize: 12, fontWeight: 700, color: "#6b7280" }}>
              <div>Roll</div><div>Name</div><div>Status</div>
            </div>
            <div style={{ maxHeight: 480, overflowY: "auto" }}>
              {MOCK_STUDENTS.map(s => {
                const status = attendance[s.id] || "Present";
                const colors = { Present: ["#16a34a", "#dcfce7"], Absent: ["#dc2626", "#fee2e2"], Late: ["#d97706", "#fef3c7"] };
                const [c, bg] = colors[status];
                return (
                  <div key={s.id} style={{ display: "grid", gridTemplateColumns: "50px 1fr auto", padding: "10px 16px", borderBottom: "1px solid #f9fafb", alignItems: "center" }}>
                    <div style={{ fontSize: 13, color: "#9ca3af", fontWeight: 600 }}>#{s.roll}</div>
                    <div style={{ fontSize: 14, fontWeight: 500 }}>{s.name}</div>
                    <button onClick={() => toggleStatus(s.id)} style={{ padding: "6px 16px", borderRadius: 20, border: `1.5px solid ${c}40`, background: bg, color: c, fontWeight: 700, fontSize: 12, cursor: "pointer", minWidth: 90, fontFamily: "inherit" }}>
                      {status}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ marginTop: 16, display: "flex", gap: 12 }}>
            <Btn onClick={submit} variant="primary">Save Attendance</Btn>
            <Btn onClick={() => setShowDefaulters(true)} variant="ghost">View Defaulters</Btn>
          </div>
        </div>
      )}

      {/* Teacher: Monthly Summary */}
      {isTeacher && view === "summary" && (
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <div style={{ fontWeight: 700, fontSize: 16 }}>Attendance Defaulters ({defaulters.length} students)</div>
            <Btn onClick={() => window.print()} variant="ghost" size="sm">🖨️ Print List</Btn>
          </div>
          <div style={{ background: "#fff5f5", border: "1px solid #fca5a5", borderRadius: 10, padding: "10px 16px", marginBottom: 16, fontSize: 13, color: "#7f1d1d" }}>
            ⚠️ The following students have attendance below 75% this month. Please notify parents.
          </div>
          <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 14, overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead><tr style={{ background: "#f9fafb" }}>
                {["Roll", "Name", "Attendance %", "Status"].map(h => <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 12, fontWeight: 700, color: "#6b7280", borderBottom: "1px solid #e5e7eb" }}>{h}</th>)}
              </tr></thead>
              <tbody>
                {defaulters.map((s, i) => (
                  <tr key={s.id} style={{ borderBottom: "1px solid #f3f4f6", background: "#fff5f5" }}>
                    <td style={{ padding: "10px 16px", fontSize: 13, color: "#9ca3af" }}>#{s.roll}</td>
                    <td style={{ padding: "10px 16px", fontWeight: 600, fontSize: 14 }}>{s.name}</td>
                    <td style={{ padding: "10px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <ProgressBar value={s.attendance_pct} max={100} color="#dc2626" height={6} />
                        <span style={{ fontWeight: 700, color: "#dc2626", fontSize: 12, minWidth: 36 }}>{s.attendance_pct}%</span>
                      </div>
                    </td>
                    <td style={{ padding: "10px 16px" }}><Badge label="Defaulter" color="#dc2626" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function AttendanceCalculator({ attPct }) {
  const [missMore, setMissMore] = useState(0);
  const total = 30, present = Math.round((attPct / 100) * total);
  const projected = Math.round(((present) / (total + missMore)) * 100);
  return (
    <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 14, padding: 20 }}>
      <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>📊 Attendance Projection Calculator</div>
      <div style={{ marginBottom: 16 }}>
        <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 8 }}>If I miss {missMore} more days...</label>
        <input type="range" min={0} max={15} value={missMore} onChange={e => setMissMore(Number(e.target.value))} style={{ width: "100%" }} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div style={{ padding: 16, background: "#f0fdf4", borderRadius: 10, textAlign: "center" }}>
          <div style={{ fontSize: 12, color: "#6b7280" }}>Current</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: "#16a34a" }}>{attPct}%</div>
        </div>
        <div style={{ padding: 16, background: projected < 75 ? "#fff5f5" : "#f0fdf4", borderRadius: 10, textAlign: "center" }}>
          <div style={{ fontSize: 12, color: "#6b7280" }}>Projected</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: projected < 75 ? "#dc2626" : "#16a34a" }}>{projected}%</div>
        </div>
      </div>
      {projected < 75 && <div style={{ marginTop: 12, padding: "10px 14px", background: "#fee2e2", borderRadius: 8, fontSize: 13, color: "#7f1d1d" }}>⚠️ Missing {missMore} more days will drop you below 75%. You may be barred from exams.</div>}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// TAB 3: HOMEWORK
// ──────────────────────────────────────────────────────────────────────────────
function TabHomework() {
  const { profile } = useAuth();
  const toast = useToast();
  const isTeacher = profile?.role === "teacher";
  const [homework, setHomework] = useState(MOCK_HOMEWORK);
  const [filter, setFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ subject: "Mathematics", class_name: "10", section: "A", description: "", assigned_date: new Date().toISOString().split("T")[0], due_date: "" });
  const [submitting, setSubmitting] = useState({});
  const [submitText, setSubmitText] = useState({});

  const filtered = homework.filter(h => {
    if (filter === "pending") return !h.submitted;
    if (filter === "submitted") return h.submitted;
    if (filter === "overdue") return !h.submitted && new Date(h.due_date) < new Date();
    return true;
  });

  const submitHW = (id) => {
    setSubmitting(p => ({ ...p, [id]: true }));
    setTimeout(() => {
      setHomework(p => p.map(h => h.id === id ? { ...h, submitted: true } : h));
      setSubmitting(p => ({ ...p, [id]: false }));
      toast("Homework submitted!", "success");
    }, 800);
  };

  const postHW = () => {
    if (!form.description || !form.due_date) { toast("Please fill all required fields", "error"); return; }
    const newHW = { ...form, id: Date.now().toString(), teacher: profile?.name, submitted: false, status: "active" };
    setHomework(p => [newHW, ...p]);
    setForm({ subject: "Mathematics", class_name: "10", section: "A", description: "", assigned_date: new Date().toISOString().split("T")[0], due_date: "" });
    setShowForm(false);
    toast("Homework posted!", "success");
  };

  const deleteHW = (id) => {
    setHomework(p => p.filter(h => h.id !== id));
    toast("Homework deleted", "info");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", gap: 8 }}>
          {["all", "pending", "submitted", "overdue"].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{ padding: "7px 14px", borderRadius: 20, border: "1.5px solid #e5e7eb", background: filter === f ? "#4f46e5" : "#fff", color: filter === f ? "#fff" : "#6b7280", fontWeight: 600, fontSize: 12, cursor: "pointer", fontFamily: "inherit", textTransform: "capitalize" }}>
              {f}
            </button>
          ))}
        </div>
        {isTeacher && <Btn onClick={() => setShowForm(!showForm)} variant="primary" size="sm">+ Post Homework</Btn>}
      </div>

      {isTeacher && showForm && (
        <div style={{ background: "#f8fafc", border: "1.5px solid #e0e7ff", borderRadius: 14, padding: 20 }}>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16, color: "#4f46e5" }}>📝 Post New Homework</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 14 }}>
            <Select label="Subject*" value={form.subject} onChange={v => setForm(p => ({ ...p, subject: v }))} options={MOCK_SUBJECTS.map(s => ({ value: s.name, label: s.name }))} />
            <Select label="Class*" value={form.class_name} onChange={v => setForm(p => ({ ...p, class_name: v }))} options={[{ value: "10", label: "Class 10" }, { value: "9", label: "Class 9" }]} />
            <Select label="Section*" value={form.section} onChange={v => setForm(p => ({ ...p, section: v }))} options={[{ value: "A", label: "A" }, { value: "B", label: "B" }]} />
            <Input label="Assigned Date" type="date" value={form.assigned_date} onChange={v => setForm(p => ({ ...p, assigned_date: v }))} />
            <Input label="Due Date*" type="date" value={form.due_date} onChange={v => setForm(p => ({ ...p, due_date: v }))} />
          </div>
          <div style={{ marginTop: 14 }}><Textarea label="Description*" value={form.description} onChange={v => setForm(p => ({ ...p, description: v }))} placeholder="What should students do?" rows={3} /></div>
          <div style={{ marginTop: 14, display: "flex", gap: 10 }}>
            <Btn onClick={postHW} variant="primary">Post Homework</Btn>
            <Btn onClick={() => setShowForm(false)} variant="secondary">Cancel</Btn>
          </div>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {filtered.map(h => {
          const overdue = !h.submitted && new Date(h.due_date) < new Date();
          const dueToday = new Date(h.due_date).toDateString() === new Date().toDateString();
          const sub = MOCK_SUBJECTS.find(s => s.name === h.subject);
          const daysLeft = Math.ceil((new Date(h.due_date) - new Date()) / 86400000);
          return (
            <div key={h.id} style={{ background: "#fff", border: `1.5px solid ${overdue ? "#fca5a5" : dueToday ? "#fcd34d" : "#e5e7eb"}`, borderRadius: 14, padding: 20, transition: "box-shadow 0.15s" }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)"} onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
                    <Badge label={h.subject} color={sub?.color || "#4f46e5"} />
                    <span style={{ fontSize: 12, color: "#9ca3af" }}>Class {h.class_name}-{h.section}</span>
                    {overdue && <Badge label="Overdue" color="#dc2626" />}
                    {dueToday && !h.submitted && <Badge label="Due Today" color="#d97706" />}
                    {h.submitted && <Badge label="✓ Submitted" color="#16a34a" />}
                    {h.status === "reviewed" && <Badge label="Reviewed" color="#7c3aed" />}
                  </div>
                  <p style={{ margin: "0 0 8px", fontSize: 14, color: "#374151", lineHeight: 1.6 }}>{h.description}</p>
                  <div style={{ display: "flex", gap: 16, fontSize: 12, color: "#9ca3af", flexWrap: "wrap" }}>
                    <span>📅 Assigned: {new Date(h.assigned_date).toLocaleDateString("en-IN")}</span>
                    <span>⏰ Due: {new Date(h.due_date).toLocaleDateString("en-IN")}</span>
                    <span>👤 {h.teacher}</span>
                    {!h.submitted && daysLeft > 0 && <span style={{ color: daysLeft <= 1 ? "#dc2626" : "#d97706" }}>⏱ {daysLeft}d left</span>}
                  </div>
                </div>
                {isTeacher ? (
                  <div style={{ display: "flex", gap: 6 }}>
                    <Btn size="sm" variant="ghost">Edit</Btn>
                    <Btn size="sm" variant="danger" onClick={() => deleteHW(h.id)}>Delete</Btn>
                  </div>
                ) : !h.submitted && (
                  <Btn size="sm" variant="primary" onClick={() => submitHW(h.id)} disabled={submitting[h.id]}>
                    {submitting[h.id] ? "Uploading..." : "Submit"}
                  </Btn>
                )}
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "48px 20px", color: "#9ca3af" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
            <div style={{ fontSize: 15, fontWeight: 600 }}>No homework found</div>
          </div>
        )}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// TAB 4: EXAMS & RESULTS
// ──────────────────────────────────────────────────────────────────────────────
function TabExams() {
  const { profile } = useAuth();
  const toast = useToast();
  const isTeacher = profile?.role === "teacher";
  const [view, setView] = useState("upcoming");
  const [selectedExam, setSelectedExam] = useState(null);
  const [marks, setMarks] = useState({});
  const [maxMarks, setMaxMarks] = useState(25);
  const [entryMarks, setEntryMarks] = useState({});

  // Inline marks entry for teacher
  const enterMarks = (examId) => {
    const initMarks = {};
    MOCK_STUDENTS.forEach(s => { initMarks[s.id] = ""; });
    setEntryMarks(initMarks);
    setSelectedExam(examId);
  };

  const saveMarks = () => {
    setMarks(prev => ({ ...prev, [selectedExam]: { ...entryMarks, max: maxMarks } }));
    setSelectedExam(null);
    toast("Marks saved successfully!", "success");
  };

  // Results computation
  const subjects = [...new Set(MOCK_RESULTS.map(r => r.subject))];
  const exams = [...new Set(MOCK_RESULTS.map(r => r.exam))];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", gap: 8, background: "#f3f4f6", padding: 4, borderRadius: 10, width: "fit-content" }}>
        {["upcoming", "results", "gradcard"].map(v => (
          <button key={v} onClick={() => setView(v)} style={{ padding: "8px 18px", borderRadius: 7, border: "none", fontWeight: 600, fontSize: 13, cursor: "pointer", background: view === v ? "#fff" : "transparent", color: view === v ? "#4f46e5" : "#6b7280", boxShadow: view === v ? "0 1px 3px rgba(0,0,0,0.1)" : "none", fontFamily: "inherit" }}>
            {v === "upcoming" ? "Upcoming Exams" : v === "results" ? "My Results" : "Grade Card"}
          </button>
        ))}
      </div>

      {view === "upcoming" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {MOCK_EXAMS.filter(e => e.status === "upcoming").map(e => {
            const daysLeft = Math.ceil((new Date(e.exam_date) - new Date()) / 86400000);
            const sub = MOCK_SUBJECTS.find(s => s.name === e.subject);
            return (
              <div key={e.id} style={{ background: "#fff", border: "1.5px solid #e0e7ff", borderRadius: 14, padding: 20, display: "flex", gap: 20, alignItems: "center" }}>
                <div style={{ width: 60, height: 60, borderRadius: 12, background: "#f0f0ff", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <div style={{ fontSize: 18, fontWeight: 800, color: "#4f46e5" }}>{new Date(e.exam_date).getDate()}</div>
                  <div style={{ fontSize: 10, color: "#7c3aed", fontWeight: 600 }}>{new Date(e.exam_date).toLocaleString("en-IN", { month: "short" }).toUpperCase()}</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: "#111827" }}>{e.name} — {e.subject}</div>
                  <div style={{ fontSize: 13, color: "#6b7280", marginTop: 4 }}>Max Marks: {e.max_marks} · {e.topics}</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 24, fontWeight: 800, color: daysLeft <= 3 ? "#dc2626" : daysLeft <= 7 ? "#d97706" : "#4f46e5" }}>{daysLeft}</div>
                  <div style={{ fontSize: 11, color: "#9ca3af" }}>days left</div>
                </div>
              </div>
            );
          })}
          {MOCK_EXAMS.filter(e => e.status === "completed").map(e => (
            <div key={e.id} style={{ background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 14, padding: 20, display: "flex", gap: 16, alignItems: "center" }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>✓</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{e.name} — {e.subject}</div>
                <div style={{ fontSize: 12, color: "#9ca3af" }}>{new Date(e.exam_date).toLocaleDateString("en-IN")}</div>
              </div>
              {e.marks && (
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontWeight: 800, fontSize: 18, color: "#16a34a" }}>{e.marks}/{e.max_marks}</div>
                  <div style={{ fontSize: 11, color: "#6b7280" }}>{gradeFromPercent((e.marks / e.max_marks) * 100)}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {view === "results" && (
        <div>
          {/* Performance trend SVG */}
          <ResultsTrendChart results={MOCK_RESULTS} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))", gap: 12, marginTop: 20 }}>
            {subjects.map(sub => {
              const subResults = MOCK_RESULTS.filter(r => r.subject === sub);
              const avg = Math.round(subResults.reduce((a, r) => a + (r.marks / r.max) * 100, 0) / subResults.length);
              const grade = gradeFromPercent(avg);
              const s = MOCK_SUBJECTS.find(s => s.name === sub);
              return (
                <div key={sub} style={{ background: "#fff", border: "1.5px solid #e5e7eb", borderRadius: 12, padding: 16, textAlign: "center" }}>
                  <div style={{ fontSize: 24, marginBottom: 6 }}>{s?.icon || "📚"}</div>
                  <div style={{ fontWeight: 700, fontSize: 13 }}>{sub}</div>
                  <div style={{ fontSize: 28, fontWeight: 800, color: gradeColor(grade), marginTop: 4 }}>{grade}</div>
                  <div style={{ fontSize: 12, color: "#9ca3af" }}>{avg}% avg</div>
                  <ProgressBar value={avg} max={100} color={gradeColor(grade)} height={5} />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {view === "gradcard" && (
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <div style={{ fontWeight: 700, fontSize: 16 }}>Grade Card — {currentAcademicYear()}</div>
            <Btn onClick={() => window.print()} variant="ghost" size="sm">🖨️ Print</Btn>
          </div>
          <div style={{ background: "#fff", border: "1.5px solid #e5e7eb", borderRadius: 14, overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#4f46e5" }}>
                  <th style={{ padding: "12px 16px", textAlign: "left", fontSize: 13, fontWeight: 700, color: "#fff" }}>Subject</th>
                  {exams.map(e => <th key={e} style={{ padding: "12px 16px", textAlign: "center", fontSize: 13, fontWeight: 700, color: "#fff" }}>{e}</th>)}
                  <th style={{ padding: "12px 16px", textAlign: "center", fontSize: 13, fontWeight: 700, color: "#fff" }}>Grade</th>
                </tr>
              </thead>
              <tbody>
                {subjects.map((sub, i) => {
                  const subResults = {};
                  MOCK_RESULTS.filter(r => r.subject === sub).forEach(r => { subResults[r.exam] = r; });
                  const allMarks = exams.map(e => subResults[e] ? (subResults[e].marks / subResults[e].max) * 100 : null).filter(Boolean);
                  const avg = allMarks.length > 0 ? Math.round(allMarks.reduce((a, b) => a + b, 0) / allMarks.length) : 0;
                  const grade = gradeFromPercent(avg);
                  return (
                    <tr key={sub} style={{ borderBottom: "1px solid #f3f4f6", background: i % 2 === 0 ? "#fff" : "#f9fafb" }}>
                      <td style={{ padding: "12px 16px", fontWeight: 600, fontSize: 14 }}>{sub}</td>
                      {exams.map(e => {
                        const r = subResults[e];
                        return (
                          <td key={e} style={{ padding: "12px 16px", textAlign: "center" }}>
                            {r ? <span style={{ fontWeight: 600, color: gradeColor(gradeFromPercent((r.marks / r.max) * 100)) }}>{r.marks}/{r.max}</span> : <span style={{ color: "#d1d5db" }}>—</span>}
                          </td>
                        );
                      })}
                      <td style={{ padding: "12px 16px", textAlign: "center" }}>
                        <span style={{ fontWeight: 800, fontSize: 16, color: gradeColor(grade) }}>{grade}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function ResultsTrendChart({ results }) {
  const subjects = [...new Set(results.map(r => r.subject))];
  const exams = [...new Set(results.map(r => r.exam))];
  const colors = ["#4f46e5", "#0891b2", "#7c3aed", "#d97706", "#059669"];
  const W = 580, H = 200, PAD = { t: 20, b: 30, l: 40, r: 20 };
  const w = W - PAD.l - PAD.r, h = H - PAD.t - PAD.b;
  const xStep = w / (exams.length - 1 || 1);

  return (
    <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 14, padding: 20 }}>
      <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 12 }}>Performance Trend</div>
      <div style={{ overflowX: "auto" }}>
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", maxWidth: W }}>
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map(v => (
            <g key={v}>
              <line x1={PAD.l} y1={PAD.t + h - (v / 100) * h} x2={PAD.l + w} y2={PAD.t + h - (v / 100) * h} stroke="#f3f4f6" strokeWidth={1} />
              <text x={PAD.l - 6} y={PAD.t + h - (v / 100) * h + 4} textAnchor="end" fontSize={10} fill="#9ca3af">{v}%</text>
            </g>
          ))}
          {/* X axis labels */}
          {exams.map((e, i) => <text key={e} x={PAD.l + i * xStep} y={H - 6} textAnchor="middle" fontSize={11} fill="#6b7280">{e}</text>)}
          {/* Subject lines */}
          {subjects.map((sub, si) => {
            const pts = exams.map((ex, i) => {
              const r = results.find(r => r.subject === sub && r.exam === ex);
              if (!r) return null;
              const pct = (r.marks / r.max) * 100;
              return { x: PAD.l + i * xStep, y: PAD.t + h - (pct / 100) * h };
            });
            const validPts = pts.filter(Boolean);
            const pathD = validPts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
            return (
              <g key={sub}>
                <path d={pathD} fill="none" stroke={colors[si % colors.length]} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
                {validPts.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r={4} fill={colors[si % colors.length]} />)}
              </g>
            );
          })}
        </svg>
      </div>
      {/* Legend */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 8 }}>
        {subjects.map((s, i) => <div key={s} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11 }}><div style={{ width: 20, height: 3, borderRadius: 2, background: colors[i % colors.length] }} /><span style={{ color: "#6b7280" }}>{s}</span></div>)}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// TAB 5: NOTICES
// ──────────────────────────────────────────────────────────────────────────────
function TabNotices() {
  const { profile } = useAuth();
  const toast = useToast();
  const isTeacher = profile?.role === "teacher";
  const [notices, setNotices] = useState(MOCK_NOTICES);
  const [filter, setFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", body: "", priority: "normal", audience: "All Students", publish_date: new Date().toISOString().split("T")[0], expiry_date: "" });
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const filtered = notices.filter(n => {
    if (filter === "urgent") return n.priority === "urgent";
    if (filter === "unread") return !n.is_read;
    return true;
  });

  const postNotice = () => {
    if (!form.title || !form.body) { toast("Title and body are required", "error"); return; }
    const n = { ...form, id: Date.now().toString(), teacher: profile?.name, published_at: new Date().toISOString(), is_read: false };
    setNotices(p => [n, ...p]);
    setForm({ title: "", body: "", priority: "normal", audience: "All Students", publish_date: new Date().toISOString().split("T")[0], expiry_date: "" });
    setShowForm(false);
    toast("Notice published!", "success");
  };

  const markRead = (id) => setNotices(p => p.map(n => n.id === id ? { ...n, is_read: true } : n));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", gap: 8 }}>
          {["all", "urgent", "unread"].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{ padding: "7px 14px", borderRadius: 20, border: "1.5px solid #e5e7eb", background: filter === f ? "#4f46e5" : "#fff", color: filter === f ? "#fff" : "#6b7280", fontWeight: 600, fontSize: 12, cursor: "pointer", fontFamily: "inherit", textTransform: "capitalize" }}>
              {f} {f === "unread" && notices.filter(n => !n.is_read).length > 0 && <span style={{ marginLeft: 4, background: filter === "unread" ? "rgba(255,255,255,0.3)" : "#fee2e2", color: filter === "unread" ? "#fff" : "#dc2626", borderRadius: 20, padding: "1px 6px", fontSize: 11, fontWeight: 700 }}>{notices.filter(n => !n.is_read).length}</span>}
            </button>
          ))}
        </div>
        {isTeacher && <Btn onClick={() => setShowForm(!showForm)} variant="primary" size="sm">+ Post Notice</Btn>}
      </div>

      {isTeacher && showForm && (
        <div style={{ background: "#f8fafc", border: "1.5px solid #e0e7ff", borderRadius: 14, padding: 20 }}>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16, color: "#4f46e5" }}>📢 Post New Notice</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <Input label="Title*" value={form.title} onChange={v => setForm(p => ({ ...p, title: v }))} placeholder="Notice title" />
            <Textarea label="Body*" value={form.body} onChange={v => setForm(p => ({ ...p, body: v }))} placeholder="Notice content..." rows={4} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 12 }}>
              <Select label="Priority" value={form.priority} onChange={v => setForm(p => ({ ...p, priority: v }))} options={[{ value: "normal", label: "Normal" }, { value: "urgent", label: "Urgent" }]} />
              <Select label="Audience" value={form.audience} onChange={v => setForm(p => ({ ...p, audience: v }))} options={[{ value: "All Students", label: "All Students" }, { value: "Class 10A", label: "Class 10A" }, { value: "Staff Only", label: "Staff Only" }, { value: "Parents", label: "Parents" }]} />
              <Input label="Publish Date" type="date" value={form.publish_date} onChange={v => setForm(p => ({ ...p, publish_date: v }))} />
              <Input label="Expiry Date" type="date" value={form.expiry_date} onChange={v => setForm(p => ({ ...p, expiry_date: v }))} />
            </div>
          </div>
          <div style={{ marginTop: 14, display: "flex", gap: 10 }}>
            <Btn onClick={postNotice} variant="primary">Publish Notice</Btn>
            <Btn onClick={() => setShowForm(false)} variant="secondary">Cancel</Btn>
          </div>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {filtered.map(n => (
          <div key={n.id} onClick={() => markRead(n.id)} style={{ background: "#fff", border: `1.5px solid ${n.priority === "urgent" ? "#fca5a5" : n.is_read ? "#e5e7eb" : "#c7d2fe"}`, borderLeft: `4px solid ${n.priority === "urgent" ? "#dc2626" : "#4f46e5"}`, borderRadius: 12, padding: 20, cursor: "pointer", transition: "box-shadow 0.15s", opacity: n.is_read ? 0.85 : 1 }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)"} onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, flexWrap: "wrap" }}>
                  {n.priority === "urgent" && <Badge label="URGENT" color="#dc2626" />}
                  <span style={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>{n.title}</span>
                  {!n.is_read && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#4f46e5", flexShrink: 0 }} />}
                </div>
                <p style={{ margin: "0 0 10px", fontSize: 14, color: "#6b7280", lineHeight: 1.6 }}>{n.body}</p>
                <div style={{ display: "flex", gap: 12, fontSize: 12, color: "#9ca3af", flexWrap: "wrap" }}>
                  <span>👤 {n.teacher}</span>
                  <span>🎯 {n.audience}</span>
                  <span>🕐 {timeAgo(n.published_at)}</span>
                </div>
              </div>
              {isTeacher && deleteConfirm !== n.id && (
                <Btn size="sm" variant="danger" onClick={e => { e.stopPropagation(); setDeleteConfirm(n.id); }}>Delete</Btn>
              )}
              {deleteConfirm === n.id && (
                <div style={{ display: "flex", gap: 6 }}>
                  <Btn size="sm" variant="danger" onClick={e => { e.stopPropagation(); setNotices(p => p.filter(x => x.id !== n.id)); setDeleteConfirm(null); toast("Notice deleted", "info"); }}>Confirm</Btn>
                  <Btn size="sm" variant="secondary" onClick={e => { e.stopPropagation(); setDeleteConfirm(null); }}>Cancel</Btn>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// TAB 6: STUDY MATERIALS
// ──────────────────────────────────────────────────────────────────────────────
function TabMaterials() {
  const { profile } = useAuth();
  const toast = useToast();
  const isTeacher = profile?.role === "teacher";
  const [materials, setMaterials] = useState(MOCK_MATERIALS);
  const [search, setSearch] = useState("");
  const [filterSub, setFilterSub] = useState("all");
  const [bookmarks, setBookmarks] = useState(new Set());
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", subject: "Mathematics", chapter: "", description: "" });
  const debSearch = useDebounce(search);

  const typeIcons = { PDF: { icon: "📄", color: "#dc2626" }, DOC: { icon: "📝", color: "#2563eb" }, Image: { icon: "🖼️", color: "#16a34a" }, Video: { icon: "🎬", color: "#7c3aed" } };

  const filtered = materials.filter(m => {
    const matchSearch = !debSearch || m.title.toLowerCase().includes(debSearch.toLowerCase()) || m.chapter.toLowerCase().includes(debSearch.toLowerCase()) || m.subject.toLowerCase().includes(debSearch.toLowerCase());
    const matchSub = filterSub === "all" || m.subject === filterSub;
    return matchSearch && matchSub;
  });

  const postMaterial = () => {
    if (!form.title) { toast("Title is required", "error"); return; }
    const m = { ...form, id: Date.now().toString(), type: "PDF", size: "—", teacher: profile?.name, date: new Date().toISOString(), is_new: true, downloads: 0 };
    setMaterials(p => [m, ...p]);
    setForm({ title: "", subject: "Mathematics", chapter: "", description: "" });
    setShowForm(false);
    toast("Material uploaded!", "success");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-end" }}>
        <div style={{ flex: 1, minWidth: 200 }}>
          <Input label="" value={search} onChange={setSearch} placeholder="🔍 Search materials, chapters, subjects..." />
        </div>
        <select value={filterSub} onChange={e => setFilterSub(e.target.value)} style={{ padding: "10px 12px", border: "1.5px solid #e5e7eb", borderRadius: 9, fontSize: 14, fontFamily: "inherit", background: "#fff", cursor: "pointer" }}>
          <option value="all">All Subjects</option>
          {MOCK_SUBJECTS.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
        </select>
        {isTeacher && <Btn onClick={() => setShowForm(!showForm)} variant="primary" size="sm">+ Upload Material</Btn>}
      </div>

      {isTeacher && showForm && (
        <div style={{ background: "#f8fafc", border: "1.5px solid #e0e7ff", borderRadius: 14, padding: 20 }}>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16, color: "#4f46e5" }}>📂 Upload Study Material</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 14 }}>
            <Input label="Title*" value={form.title} onChange={v => setForm(p => ({ ...p, title: v }))} placeholder="Material title" />
            <Select label="Subject" value={form.subject} onChange={v => setForm(p => ({ ...p, subject: v }))} options={MOCK_SUBJECTS.map(s => ({ value: s.name, label: s.name }))} />
            <Input label="Chapter/Topic" value={form.chapter} onChange={v => setForm(p => ({ ...p, chapter: v }))} placeholder="e.g. Ch 5: Quadratics" />
          </div>
          <div style={{ marginTop: 14 }}><Textarea label="Description" value={form.description} onChange={v => setForm(p => ({ ...p, description: v }))} rows={2} /></div>
          <div style={{ marginTop: 14, border: "2px dashed #c7d2fe", borderRadius: 10, padding: "24px 20px", textAlign: "center", cursor: "pointer", color: "#6b7280", fontSize: 14 }}>
            📁 Click to choose file or drag & drop here<br /><span style={{ fontSize: 12 }}>PDF, DOC, Image — Max 50MB</span>
          </div>
          <div style={{ marginTop: 14, display: "flex", gap: 10 }}>
            <Btn onClick={postMaterial} variant="primary">Upload</Btn>
            <Btn onClick={() => setShowForm(false)} variant="secondary">Cancel</Btn>
          </div>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 14 }}>
        {filtered.map(m => {
          const { icon, color } = typeIcons[m.type] || { icon: "📄", color: "#6b7280" };
          const sub = MOCK_SUBJECTS.find(s => s.name === m.subject);
          const bk = bookmarks.has(m.id);
          return (
            <div key={m.id} style={{ background: "#fff", border: "1.5px solid #e5e7eb", borderRadius: 14, padding: 18, position: "relative", transition: "box-shadow 0.15s" }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)"} onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}>
              {m.is_new && <div style={{ position: "absolute", top: 12, right: 12, background: "#4f46e5", color: "#fff", fontSize: 10, padding: "2px 7px", borderRadius: 20, fontWeight: 700 }}>NEW</div>}
              <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 12 }}>
                <div style={{ fontSize: 28, lineHeight: 1 }}>{icon}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 13, color: "#111827", marginBottom: 4, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{m.title}</div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    <Badge label={m.subject} color={sub?.color || "#4f46e5"} />
                    {m.chapter && <Badge label={m.chapter} color="#6b7280" />}
                  </div>
                </div>
              </div>
              <div style={{ fontSize: 11, color: "#9ca3af", marginBottom: 12 }}>
                {m.type} · {m.size} · by {m.teacher} · {timeAgo(m.date)} · ⬇️ {m.downloads}
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <Btn size="sm" variant="primary" style={{ flex: 1 }} onClick={() => toast("Download started!", "success")}>⬇️ Download</Btn>
                <button onClick={() => { setBookmarks(p => { const n = new Set(p); bk ? n.delete(m.id) : n.add(m.id); return n; }); toast(bk ? "Removed from saved" : "Saved!", "info"); }}
                  style={{ padding: "6px 10px", borderRadius: 9, border: "1.5px solid #e5e7eb", background: bk ? "#fef3c7" : "#fff", cursor: "pointer", fontSize: 16 }} title="Bookmark">
                  {bk ? "🔖" : "🔖"}
                </button>
                {isTeacher && <Btn size="sm" variant="danger" onClick={() => { setMaterials(p => p.filter(x => x.id !== m.id)); toast("Deleted", "info"); }}>✕</Btn>}
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "48px 20px", color: "#9ca3af" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
            <div style={{ fontSize: 15, fontWeight: 600 }}>No materials found</div>
          </div>
        )}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// TAB 7: SYLLABUS TRACKER
// ──────────────────────────────────────────────────────────────────────────────
function TabSyllabus() {
  const { profile } = useAuth();
  const [chapters, setChapters] = useState(MOCK_SYLLABUS);
  const [expanded, setExpanded] = useState(null);
  const toast = useToast();

  const total = chapters.reduce((a, c) => a + c.total_topics, 0);
  const done = chapters.reduce((a, c) => a + c.completed, 0);
  const overallPct = Math.round((done / total) * 100);

  const statusColors = { completed: "#16a34a", in_progress: "#4f46e5", not_started: "#9ca3af" };
  const statusLabels = { completed: "Completed", in_progress: "In Progress", not_started: "Not Started" };

  const markTopic = (chId, increment) => {
    setChapters(p => p.map(c => {
      if (c.id !== chId) return c;
      const newCompleted = Math.max(0, Math.min(c.total_topics, c.completed + increment));
      const status = newCompleted === c.total_topics ? "completed" : newCompleted > 0 ? "in_progress" : "not_started";
      return { ...c, completed: newCompleted, status };
    }));
    if (increment > 0) toast("Topic marked as taught!", "success");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Overview ring */}
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
        <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 14, padding: 24, display: "flex", alignItems: "center", gap: 24, flex: "1 1 280px" }}>
          <DonutRing value={done} max={total} size={120} color={overallPct >= 80 ? "#16a34a" : overallPct >= 50 ? "#4f46e5" : "#d97706"} label="Syllabus" />
          <div>
            <div style={{ fontSize: 13, color: "#6b7280" }}>Overall Progress</div>
            <div style={{ fontSize: 32, fontWeight: 800, color: "#111827" }}>{overallPct}%</div>
            <div style={{ fontSize: 13, color: "#6b7280", marginTop: 4 }}>{done} of {total} topics taught</div>
            {overallPct < 50 && <div style={{ marginTop: 8, fontSize: 12, color: "#d97706", background: "#fef3c7", padding: "4px 10px", borderRadius: 20 }}>⚠️ Behind schedule</div>}
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, flex: "1 1 280px" }}>
          {Object.entries(statusLabels).map(([k, v]) => (
            <div key={k} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 14, textAlign: "center" }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: statusColors[k] }}>{chapters.filter(c => c.status === k).length}</div>
              <div style={{ fontSize: 11, color: "#6b7280", marginTop: 4 }}>{v}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Chapters */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {chapters.map(c => (
          <div key={c.id} style={{ background: "#fff", border: "1.5px solid #e5e7eb", borderRadius: 12, overflow: "hidden" }}>
            <div onClick={() => setExpanded(expanded === c.id ? null : c.id)} style={{ padding: "16px 20px", cursor: "pointer", display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: statusColors[c.status], flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 6, display: "flex", alignItems: "center", gap: 8 }}>
                  {c.chapter}
                  <Badge label={statusLabels[c.status]} color={statusColors[c.status]} />
                </div>
                <ProgressBar value={c.completed} max={c.total_topics} color={statusColors[c.status]} height={6} showLabel />
                <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 4 }}>{c.completed}/{c.total_topics} topics · {c.sessions} sessions taken</div>
              </div>
              <div style={{ fontSize: 18, color: "#9ca3af", transform: expanded === c.id ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>▼</div>
            </div>
            {expanded === c.id && (
              <div style={{ borderTop: "1px solid #f3f4f6", padding: "16px 20px", background: "#f9fafb" }}>
                <div style={{ marginBottom: 12, fontSize: 13, color: "#6b7280" }}>Topics progress: {c.completed}/{c.total_topics}</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(40px,1fr))", gap: 6, marginBottom: 16 }}>
                  {Array.from({ length: c.total_topics }, (_, i) => (
                    <div key={i} style={{ height: 36, borderRadius: 8, background: i < c.completed ? statusColors[c.status] + "25" : "#f3f4f6", border: `1.5px solid ${i < c.completed ? statusColors[c.status] : "#e5e7eb"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 600, color: i < c.completed ? statusColors[c.status] : "#9ca3af" }}>
                      {i + 1}
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <Btn size="sm" variant="success" onClick={() => markTopic(c.id, 1)} disabled={c.completed >= c.total_topics}>+ Mark Topic Taught</Btn>
                  <Btn size="sm" variant="danger" onClick={() => markTopic(c.id, -1)} disabled={c.completed === 0}>− Undo</Btn>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// TAB 8: TIMETABLE
// ──────────────────────────────────────────────────────────────────────────────
function TabTimetable() {
  const today = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][new Date().getDay()];
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const subColors = { Mathematics: "#4f46e5", Science: "#0891b2", English: "#7c3aed", Hindi: "#d97706", "Social Science": "#059669", "Computer Science": "#dc2626", "Free Period": "#e5e7eb", "PT / Sports": "#16a34a", Library: "#9ca3af", Break: "#fef3c7", Lunch: "#fef3c7" };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ fontWeight: 700, fontSize: 16 }}>Weekly Timetable — Class 10-A</div>
        <Badge label={`Today: ${today}`} color="#4f46e5" />
      </div>

      {/* Mobile: stacked by day */}
      <div className="timetable-grid" style={{ display: "grid", gridTemplateColumns: "80px repeat(6,1fr)", gap: 2, minWidth: 700, overflowX: "auto" }}>
        {/* Header */}
        <div style={{ padding: "10px 8px", fontSize: 12, fontWeight: 700, color: "#9ca3af" }}>Time</div>
        {days.map(d => (
          <div key={d} style={{ padding: "10px 8px", textAlign: "center", fontWeight: 700, fontSize: 13, color: d === today ? "#4f46e5" : "#374151", background: d === today ? "#f0f0ff" : "transparent", borderRadius: "8px 8px 0 0", borderBottom: d === today ? "3px solid #4f46e5" : "none" }}>{d.slice(0, 3)}</div>
        ))}
        {/* Rows */}
        {(MOCK_TIMETABLE.Monday || []).map((_, pi) => {
          const period = MOCK_TIMETABLE.Monday[pi];
          return [
            <div key={`t${pi}`} style={{ padding: "8px", fontSize: 11, color: "#9ca3af", display: "flex", alignItems: "center", borderTop: "1px solid #f3f4f6" }}>{period.time.split("–")[0]}</div>,
            ...days.map(d => {
              const p = (MOCK_TIMETABLE[d] || [])[pi] || {};
              const isBreak = p.subject === "Break" || p.subject === "Lunch";
              const isFree = p.subject === "Free Period";
              const color = subColors[p.subject] || "#9ca3af";
              return (
                <div key={`${d}${pi}`} style={{ padding: "6px 8px", margin: 2, borderRadius: 8, background: isBreak ? "#fef9c3" : isFree ? "#f9fafb" : color + "15", border: `1.5px solid ${isBreak ? "#fde68a" : isFree ? "#e5e7eb" : color + "40"}`, borderTop: d === today ? `2px solid ${color}` : undefined, minHeight: 52, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: isBreak || isFree ? "#9ca3af" : color }}>{p.subject || "—"}</div>
                  {p.room && <div style={{ fontSize: 10, color: "#9ca3af" }}>{p.room}</div>}
                </div>
              );
            })
          ];
        })}
      </div>

      {/* Legend */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        {MOCK_SUBJECTS.map(s => (
          <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12 }}>
            <div style={{ width: 12, height: 12, borderRadius: 3, background: s.color + "25", border: `1.5px solid ${s.color}60` }} />
            <span style={{ color: "#6b7280" }}>{s.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// TAB 9: DISCUSSIONS
// ──────────────────────────────────────────────────────────────────────────────
function TabDiscussions() {
  const { profile } = useAuth();
  const toast = useToast();
  const [discussions, setDiscussions] = useState(MOCK_DISCUSSIONS);
  const [selectedSub, setSelectedSub] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", body: "", subject: "Mathematics", chapter: "", anonymous: false });
  const [expandedPost, setExpandedPost] = useState(null);
  const [reply, setReply] = useState("");

  const filtered = discussions.filter(d => selectedSub === "all" || d.subject === selectedSub);

  const postDiscussion = () => {
    if (!form.title || !form.body) { toast("Title and body required", "error"); return; }
    const d = { ...form, id: Date.now().toString(), author: form.anonymous ? "Anonymous" : profile?.name, reactions: 0, replies: 0, is_resolved: false, time: new Date().toISOString() };
    setDiscussions(p => [d, ...p]);
    setForm({ title: "", body: "", subject: "Mathematics", chapter: "", anonymous: false });
    setShowForm(false);
    toast("Question posted!", "success");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {["all", ...MOCK_SUBJECTS.map(s => s.name)].map(s => {
            const count = s === "all" ? 0 : discussions.filter(d => d.subject === s && !d.is_resolved).length;
            return (
              <button key={s} onClick={() => setSelectedSub(s)} style={{ padding: "7px 12px", borderRadius: 20, border: "1.5px solid #e5e7eb", background: selectedSub === s ? "#4f46e5" : "#fff", color: selectedSub === s ? "#fff" : "#6b7280", fontWeight: 600, fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>
                {s === "all" ? "All" : s.split(" ")[0]}{count > 0 && <span style={{ marginLeft: 4, fontSize: 10, background: selectedSub === s ? "rgba(255,255,255,0.3)" : "#fee2e2", color: selectedSub === s ? "#fff" : "#dc2626", borderRadius: 20, padding: "1px 5px", fontWeight: 700 }}>{count}</span>}
              </button>
            );
          })}
        </div>
        <Btn onClick={() => setShowForm(!showForm)} variant="primary" size="sm">+ Ask a Doubt</Btn>
      </div>

      {showForm && (
        <div style={{ background: "#f8fafc", border: "1.5px solid #e0e7ff", borderRadius: 14, padding: 20 }}>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16, color: "#4f46e5" }}>❓ Ask a Doubt</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Select label="Subject" value={form.subject} onChange={v => setForm(p => ({ ...p, subject: v }))} options={MOCK_SUBJECTS.map(s => ({ value: s.name, label: s.name }))} />
              <Input label="Chapter/Topic" value={form.chapter} onChange={v => setForm(p => ({ ...p, chapter: v }))} placeholder="e.g. Ch 4: Quadratics" />
            </div>
            <Input label="Your Question" value={form.title} onChange={v => setForm(p => ({ ...p, title: v }))} placeholder="Short question title" />
            <Textarea label="Details" value={form.body} onChange={v => setForm(p => ({ ...p, body: v }))} placeholder="Describe your doubt in detail..." rows={3} />
            <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, cursor: "pointer" }}>
              <input type="checkbox" checked={form.anonymous} onChange={e => setForm(p => ({ ...p, anonymous: e.target.checked }))} />
              Post anonymously
            </label>
          </div>
          <div style={{ marginTop: 14, display: "flex", gap: 10 }}>
            <Btn onClick={postDiscussion} variant="primary">Post Doubt</Btn>
            <Btn onClick={() => setShowForm(false)} variant="secondary">Cancel</Btn>
          </div>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {filtered.map(d => {
          const sub = MOCK_SUBJECTS.find(s => s.name === d.subject);
          return (
            <div key={d.id} style={{ background: "#fff", border: `1.5px solid ${d.is_resolved ? "#a7f3d0" : "#e5e7eb"}`, borderRadius: 14, overflow: "hidden" }}>
              <div onClick={() => setExpandedPost(expandedPost === d.id ? null : d.id)} style={{ padding: 20, cursor: "pointer" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", gap: 8, marginBottom: 8, flexWrap: "wrap", alignItems: "center" }}>
                      <Badge label={d.subject} color={sub?.color || "#4f46e5"} />
                      {d.chapter && <Badge label={d.chapter} color="#6b7280" />}
                      {d.is_resolved && <Badge label="✓ Resolved" color="#16a34a" />}
                    </div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: "#111827", marginBottom: 6 }}>{d.title}</div>
                    <p style={{ margin: "0 0 8px", fontSize: 13, color: "#6b7280", lineHeight: 1.6 }}>{d.body}</p>
                    <div style={{ display: "flex", gap: 16, fontSize: 12, color: "#9ca3af" }}>
                      <span>👤 {d.author}</span>
                      <span>🕐 {timeAgo(d.time)}</span>
                      <span>💬 {d.replies} replies</span>
                      <span>👍 {d.reactions}</span>
                    </div>
                  </div>
                </div>
              </div>
              {expandedPost === d.id && (
                <div style={{ borderTop: "1px solid #f3f4f6", padding: 20, background: "#f9fafb" }}>
                  <div style={{ marginBottom: 14, display: "flex", gap: 8 }}>
                    <Btn size="sm" variant="secondary" onClick={() => { setDiscussions(p => p.map(x => x.id === d.id ? { ...x, reactions: x.reactions + 1 } : x)); }}>👍 Helpful ({d.reactions})</Btn>
                    {(profile?.role === "teacher" || profile?.role === "admin") && !d.is_resolved && (
                      <Btn size="sm" variant="success" onClick={() => { setDiscussions(p => p.map(x => x.id === d.id ? { ...x, is_resolved: true } : x)); toast("Marked as resolved!", "success"); }}>✓ Mark Resolved</Btn>
                    )}
                  </div>
                  <div style={{ display: "flex", gap: 10 }}>
                    <input value={reply} onChange={e => setReply(e.target.value)} placeholder="Write a reply..." style={{ flex: 1, padding: "9px 12px", border: "1.5px solid #e5e7eb", borderRadius: 9, fontSize: 14, fontFamily: "inherit", outline: "none" }} onKeyDown={e => { if (e.key === "Enter" && reply.trim()) { setDiscussions(p => p.map(x => x.id === d.id ? { ...x, replies: x.replies + 1 } : x)); setReply(""); toast("Reply posted!", "success"); } }} />
                    <Btn size="sm" variant="primary" onClick={() => { if (reply.trim()) { setDiscussions(p => p.map(x => x.id === d.id ? { ...x, replies: x.replies + 1 } : x)); setReply(""); toast("Reply posted!", "success"); } }}>Reply</Btn>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// TAB 10: ONLINE TESTS
// ──────────────────────────────────────────────────────────────────────────────
function TabTests() {
  const { profile } = useAuth();
  const toast = useToast();
  const isTeacher = profile?.role === "teacher";
  const [view, setView] = useState("list");
  const [activeTest, setActiveTest] = useState(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [flagged, setFlagged] = useState(new Set());
  const [timeLeft, setTimeLeft] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const MOCK_TESTS = [
    { id: "t1", title: "Mathematics Quiz — Polynomials", subject: "Mathematics", duration: 20, questions: 10, start_at: new Date(Date.now() - 3600000).toISOString(), end_at: new Date(Date.now() + 7200000).toISOString(), total_marks: 20, status: "active" },
    { id: "t2", title: "Science MCQ — Electricity Chapter", subject: "Science", duration: 30, questions: 15, start_at: new Date(Date.now() + 86400000).toISOString(), end_at: new Date(Date.now() + 93600000).toISOString(), total_marks: 30, status: "upcoming" },
    { id: "t3", title: "English Grammar Test", subject: "English", duration: 25, questions: 12, start_at: new Date(Date.now() - 2 * 86400000).toISOString(), end_at: new Date(Date.now() - 86400000).toISOString(), total_marks: 24, score: 19, status: "completed" },
  ];

  const SAMPLE_QUESTIONS = [
    { id: "q1", text: "Which of the following is a polynomial of degree 2?", type: "mcq", options: ["x³ + x + 1", "x² + 3x + 2", "x⁻¹ + 3", "√x + 1"], correct: 1, marks: 2 },
    { id: "q2", text: "The zeroes of the polynomial x² – 3x + 2 are:", type: "mcq", options: ["1 and 2", "–1 and 2", "1 and –2", "–1 and –2"], correct: 0, marks: 2 },
    { id: "q3", text: "If p(x) = x² – x – 6, find p(3).", type: "mcq", options: ["6", "0", "–6", "3"], correct: 1, marks: 2 },
    { id: "q4", text: "A polynomial of degree 3 is called a cubic polynomial.", type: "truefalse", options: ["True", "False"], correct: 0, marks: 1 },
    { id: "q5", text: "The sum of zeroes of ax² + bx + c is equal to:", type: "mcq", options: ["b/a", "–b/a", "c/a", "–c/a"], correct: 1, marks: 2 },
  ];

  useEffect(() => {
    if (activeTest && !submitted) {
      if (timeLeft === null) setTimeLeft(activeTest.duration * 60);
      const t = setTimeout(() => setTimeLeft(p => {
        if (p <= 1) { submitTest(); return 0; }
        return p - 1;
      }), 1000);
      return () => clearTimeout(t);
    }
  }, [activeTest, timeLeft, submitted]);

  const startTest = (test) => { setActiveTest(test); setCurrentQ(0); setAnswers({}); setFlagged(new Set()); setSubmitted(false); setTimeLeft(test.duration * 60); setView("taking"); };
  const submitTest = () => { setSubmitted(true); toast("Test submitted!", "success"); };

  const score = Object.entries(answers).reduce((a, [qid, ans]) => {
    const q = SAMPLE_QUESTIONS.find(q => q.id === qid);
    return a + (q && q.correct === ans ? q.marks : 0);
  }, 0);

  if (view === "taking" && activeTest) {
    const q = SAMPLE_QUESTIONS[currentQ];
    const mins = Math.floor((timeLeft || 0) / 60), secs = (timeLeft || 0) % 60;
    const isRed = (timeLeft || 0) < 300;
    return (
      <div>
        {/* Test header */}
        {!submitted && (
          <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 14, padding: "16px 20px", marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15 }}>{activeTest.title}</div>
              <div style={{ fontSize: 12, color: "#9ca3af" }}>Q {currentQ + 1} of {SAMPLE_QUESTIONS.length}</div>
            </div>
            <div style={{ fontSize: 24, fontWeight: 800, color: isRed ? "#dc2626" : "#4f46e5", fontVariantNumeric: "tabular-nums" }}>{String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}</div>
          </div>
        )}

        {!submitted ? (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 220px", gap: 16, alignItems: "start" }}>
            <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 14, padding: 24 }}>
              <div style={{ fontSize: 12, color: "#9ca3af", marginBottom: 8 }}>Question {currentQ + 1} · {q.marks} mark{q.marks > 1 ? "s" : ""}</div>
              <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 20, lineHeight: 1.6 }}>{q.text}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {q.options.map((opt, i) => (
                  <button key={i} onClick={() => setAnswers(p => ({ ...p, [q.id]: i }))} style={{ padding: "12px 16px", borderRadius: 10, border: `2px solid ${answers[q.id] === i ? "#4f46e5" : "#e5e7eb"}`, background: answers[q.id] === i ? "#f0f0ff" : "#fff", textAlign: "left", cursor: "pointer", fontSize: 14, fontFamily: "inherit", color: answers[q.id] === i ? "#4f46e5" : "#374151", fontWeight: answers[q.id] === i ? 600 : 400, transition: "all 0.15s" }}>
                    <span style={{ fontWeight: 700, marginRight: 10 }}>{["A", "B", "C", "D"][i]}.</span>{opt}
                  </button>
                ))}
              </div>
              <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
                <Btn onClick={() => setCurrentQ(Math.max(0, currentQ - 1))} variant="secondary" disabled={currentQ === 0}>← Previous</Btn>
                <button onClick={() => setFlagged(p => { const n = new Set(p); flagged.has(q.id) ? n.delete(q.id) : n.add(q.id); return n; })} style={{ padding: "9px 14px", borderRadius: 9, border: `1.5px solid ${flagged.has(q.id) ? "#fcd34d" : "#e5e7eb"}`, background: flagged.has(q.id) ? "#fef3c7" : "#fff", cursor: "pointer", fontSize: 14, fontFamily: "inherit" }}>🚩 Flag</button>
                {currentQ < SAMPLE_QUESTIONS.length - 1 ? <Btn onClick={() => setCurrentQ(currentQ + 1)} variant="primary">Next →</Btn> : <Btn onClick={() => { if (window.confirm?.("Submit test?") ?? true) submitTest(); }} variant="success">Submit Test</Btn>}
              </div>
            </div>
            {/* Question palette */}
            <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 14, padding: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12 }}>Question Palette</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 6, marginBottom: 12 }}>
                {SAMPLE_QUESTIONS.map((q2, i) => (
                  <button key={i} onClick={() => setCurrentQ(i)} style={{ height: 36, borderRadius: 6, border: "none", cursor: "pointer", fontWeight: 700, fontSize: 12, fontFamily: "inherit", background: i === currentQ ? "#4f46e5" : answers[q2.id] !== undefined ? "#dcfce7" : flagged.has(q2.id) ? "#fef3c7" : "#f3f4f6", color: i === currentQ ? "#fff" : answers[q2.id] !== undefined ? "#16a34a" : "#6b7280" }}>
                    {i + 1}
                  </button>
                ))}
              </div>
              <div style={{ fontSize: 11, color: "#9ca3af" }}>
                <div style={{ display: "flex", gap: 6, marginBottom: 4 }}><span style={{ width: 12, height: 12, background: "#dcfce7", border: "1px solid #86efac", borderRadius: 3, display: "inline-block" }} />Answered</div>
                <div style={{ display: "flex", gap: 6, marginBottom: 4 }}><span style={{ width: 12, height: 12, background: "#fef3c7", border: "1px solid #fcd34d", borderRadius: 3, display: "inline-block" }} />Flagged</div>
                <div style={{ display: "flex", gap: 6 }}><span style={{ width: 12, height: 12, background: "#f3f4f6", borderRadius: 3, display: "inline-block" }} />Not visited</div>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16, padding: 32, textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🎉</div>
            <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>Test Submitted!</div>
            <div style={{ fontSize: 36, fontWeight: 800, color: "#4f46e5", marginBottom: 4 }}>{score}/{SAMPLE_QUESTIONS.reduce((a, q) => a + q.marks, 0)}</div>
            <div style={{ fontSize: 14, color: "#6b7280", marginBottom: 24 }}>Grade: {gradeFromPercent((score / SAMPLE_QUESTIONS.reduce((a, q) => a + q.marks, 0)) * 100)}</div>
            <Btn onClick={() => { setView("list"); setActiveTest(null); }} variant="primary">Back to Tests</Btn>
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ fontWeight: 700, fontSize: 16 }}>Online Tests & Quizzes</div>
      {MOCK_TESTS.map(t => {
        const isActive = t.status === "active";
        const isUpcoming = t.status === "upcoming";
        const isCompleted = t.status === "completed";
        return (
          <div key={t.id} style={{ background: "#fff", border: `1.5px solid ${isActive ? "#a5b4fc" : isCompleted ? "#a7f3d0" : "#e5e7eb"}`, borderRadius: 14, padding: 20, display: "flex", gap: 16, alignItems: "center" }}>
            <div style={{ width: 50, height: 50, borderRadius: 12, background: isActive ? "#eef2ff" : isCompleted ? "#ecfdf5" : "#f9fafb", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>
              {isActive ? "🎯" : isCompleted ? "✅" : "⏰"}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{t.title}</div>
              <div style={{ fontSize: 12, color: "#6b7280" }}>{t.questions} questions · {t.duration} minutes · {t.total_marks} marks</div>
              <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 2 }}>
                {isCompleted ? `Completed · Score: ${t.score}/${t.total_marks}` : isActive ? `Open until ${new Date(t.end_at).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}` : `Starts ${new Date(t.start_at).toLocaleDateString("en-IN")}`}
              </div>
            </div>
            <div>
              {isActive && !isTeacher && <Btn onClick={() => startTest(t)} variant="primary">Start Test</Btn>}
              {isUpcoming && <Badge label="Upcoming" color="#d97706" />}
              {isCompleted && <div style={{ textAlign: "center" }}><div style={{ fontSize: 20, fontWeight: 800, color: "#16a34a" }}>{t.score}/{t.total_marks}</div><div style={{ fontSize: 11, color: "#6b7280" }}>{gradeFromPercent((t.score / t.total_marks) * 100)}</div></div>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// TAB 11: LEAVE MANAGEMENT
// ──────────────────────────────────────────────────────────────────────────────
function TabLeave() {
  const { profile } = useAuth();
  const toast = useToast();
  const isTeacher = profile?.role === "teacher";
  const [applications, setApplications] = useState([
    { id: "l1", type: "Sick", from: "2024-12-10", to: "2024-12-11", reason: "Fever and cold", status: "approved", reviewer: "Class Teacher", created_at: new Date(Date.now() - 5 * 86400000).toISOString() },
    { id: "l2", type: "Personal", from: "2024-12-20", to: "2024-12-20", reason: "Family function", status: "pending", reviewer: null, created_at: new Date(Date.now() - 1 * 86400000).toISOString() },
    { id: "l3", type: "Sick", from: "2024-11-15", to: "2024-11-15", reason: "Medical appointment", status: "rejected", reviewer: "Class Teacher", reviewer_comment: "Insufficient notice", created_at: new Date(Date.now() - 20 * 86400000).toISOString() },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ type: "Sick", from_date: "", to_date: "", reason: "" });

  const submitLeave = () => {
    if (!form.from_date || !form.to_date || !form.reason) { toast("Please fill all fields", "error"); return; }
    const app = { ...form, id: Date.now().toString(), status: "pending", reviewer: null, created_at: new Date().toISOString() };
    setApplications(p => [app, ...p]);
    setForm({ type: "Sick", from_date: "", to_date: "", reason: "" });
    setShowForm(false);
    toast("Leave application submitted!", "success");
  };

  const statusColors = { pending: "#d97706", approved: "#16a34a", rejected: "#dc2626" };
  const statusBg = { pending: "#fef3c7", approved: "#dcfce7", rejected: "#fee2e2" };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        {[["Total Sick Leaves", "4/8"], ["Total Casual Leaves", "2/4"], ["Pending Applications", `${applications.filter(a => a.status === "pending").length}`]].map(([l, v]) => (
          <div key={l} style={{ flex: 1, minWidth: 160, background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: "14px 18px" }}>
            <div style={{ fontSize: 12, color: "#6b7280" }}>{l}</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: "#111827", marginTop: 4 }}>{v}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Btn onClick={() => setShowForm(!showForm)} variant="primary">+ Apply for Leave</Btn>
      </div>

      {showForm && (
        <div style={{ background: "#f8fafc", border: "1.5px solid #e0e7ff", borderRadius: 14, padding: 20 }}>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16, color: "#4f46e5" }}>📋 Leave Application</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 12 }}>
            <Select label="Leave Type" value={form.type} onChange={v => setForm(p => ({ ...p, type: v }))} options={[{ value: "Sick", label: "Sick Leave" }, { value: "Personal", label: "Personal Leave" }, { value: "Family Emergency", label: "Family Emergency" }, { value: "Event", label: "Event/Ceremony" }]} />
            <Input label="From Date" type="date" value={form.from_date} onChange={v => setForm(p => ({ ...p, from_date: v }))} />
            <Input label="To Date" type="date" value={form.to_date} onChange={v => setForm(p => ({ ...p, to_date: v }))} />
          </div>
          <div style={{ marginTop: 12 }}><Textarea label="Reason" value={form.reason} onChange={v => setForm(p => ({ ...p, reason: v }))} rows={3} /></div>
          <div style={{ marginTop: 14, display: "flex", gap: 10 }}>
            <Btn onClick={submitLeave} variant="primary">Submit Application</Btn>
            <Btn onClick={() => setShowForm(false)} variant="secondary">Cancel</Btn>
          </div>
        </div>
      )}

      <div>
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 12 }}>Leave History</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {applications.map(a => (
            <div key={a.id} style={{ background: "#fff", border: "1.5px solid #e5e7eb", borderRadius: 12, padding: 18 }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <span style={{ fontWeight: 700, fontSize: 14 }}>{a.type} Leave</span>
                    <span style={{ fontSize: 11, padding: "3px 8px", borderRadius: 20, background: statusBg[a.status], color: statusColors[a.status], fontWeight: 700 }}>{a.status.toUpperCase()}</span>
                  </div>
                  <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 4 }}>📅 {a.from} → {a.to}</div>
                  <div style={{ fontSize: 13, color: "#374151" }}>{a.reason}</div>
                  {a.reviewer_comment && <div style={{ fontSize: 12, color: "#dc2626", marginTop: 4 }}>Rejected: {a.reviewer_comment}</div>}
                </div>
                <div style={{ fontSize: 12, color: "#9ca3af" }}>{timeAgo(a.created_at)}</div>
              </div>
              {a.status === "pending" && (
                <div style={{ marginTop: 12, padding: "8px 12px", background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 8, fontSize: 12, color: "#92400e" }}>
                  ⏳ Pending approval from class teacher
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// TAB 12: NOTIFICATIONS
// ──────────────────────────────────────────────────────────────────────────────
function TabNotifications({ onNavigate }) {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [filter, setFilter] = useState("all");

  const typeIcons = { homework: "📝", notice: "📢", result: "🎯", material: "📂", attendance: "✓", test: "🎯", leave: "📋" };
  const typeColors = { homework: "#4f46e5", notice: "#dc2626", result: "#16a34a", material: "#0891b2", attendance: "#d97706", test: "#7c3aed", leave: "#059669" };

  const markAllRead = () => setNotifications(p => p.map(n => ({ ...n, is_read: true })));
  const filtered = notifications.filter(n => filter === "all" || !n.is_read);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", gap: 8 }}>
          {["all", "unread"].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{ padding: "7px 14px", borderRadius: 20, border: "1.5px solid #e5e7eb", background: filter === f ? "#4f46e5" : "#fff", color: filter === f ? "#fff" : "#6b7280", fontWeight: 600, fontSize: 12, cursor: "pointer", fontFamily: "inherit", textTransform: "capitalize" }}>
              {f} {f === "unread" && notifications.filter(n => !n.is_read).length > 0 && `(${notifications.filter(n => !n.is_read).length})`}
            </button>
          ))}
        </div>
        <Btn onClick={markAllRead} variant="ghost" size="sm">✓ Mark All Read</Btn>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {filtered.map(n => (
          <div key={n.id} onClick={() => { setNotifications(p => p.map(x => x.id === n.id ? { ...x, is_read: true } : x)); if (onNavigate && n.deep_link_tab) onNavigate(n.deep_link_tab); }}
            style={{ background: n.is_read ? "#fff" : "#f5f3ff", border: `1px solid ${n.is_read ? "#e5e7eb" : "#c7d2fe"}`, borderRadius: 12, padding: "14px 18px", cursor: "pointer", display: "flex", gap: 14, alignItems: "center", transition: "box-shadow 0.15s" }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)"} onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: typeColors[n.type] + "20", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>
              {typeIcons[n.type] || "🔔"}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: n.is_read ? 500 : 700, fontSize: 14, color: "#111827", marginBottom: 2 }}>{n.title}</div>
              <div style={{ fontSize: 13, color: "#6b7280" }}>{n.body}</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
              <div style={{ fontSize: 11, color: "#9ca3af" }}>{timeAgo(n.created_at)}</div>
              {!n.is_read && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#4f46e5" }} />}
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "48px 20px", color: "#9ca3af" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🔕</div>
            <div style={{ fontSize: 15, fontWeight: 600 }}>All caught up!</div>
          </div>
        )}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// TAB 13: PROFILE & SETTINGS
// ──────────────────────────────────────────────────────────────────────────────
function TabProfile() {
  const { profile } = useAuth();
  const toast = useToast();
  const [tab, setTab] = useState("profile");
  const [form, setForm] = useState({ name: profile?.name || "", phone: profile?.phone || "", bio: "" });
  const [notifPrefs, setNotifPrefs] = useState({ homework: true, notices: true, results: true, attendance: true, tests: true, leave: true });
  const [theme, setTheme] = useState("light");
  const [fontSize, setFontSize] = useState("normal");
  const [pwForm, setPwForm] = useState({ current: "", newPw: "", confirm: "" });

  const pwStrength = (pw) => {
    if (!pw) return 0;
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^a-zA-Z0-9]/.test(pw)) score++;
    return score;
  };
  const strength = pwStrength(pwForm.newPw);
  const strengthColors = ["#dc2626", "#d97706", "#d97706", "#16a34a", "#16a34a"];
  const strengthLabels = ["", "Weak", "Fair", "Good", "Strong"];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {["profile", "notifications", "appearance", "security", "data"].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ padding: "8px 16px", borderRadius: 20, border: "1.5px solid #e5e7eb", background: tab === t ? "#4f46e5" : "#fff", color: tab === t ? "#fff" : "#6b7280", fontWeight: 600, fontSize: 12, cursor: "pointer", fontFamily: "inherit", textTransform: "capitalize" }}>
            {t}
          </button>
        ))}
      </div>

      {tab === "profile" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Avatar */}
          <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 14, padding: 24, display: "flex", gap: 20, alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ width: 80, height: 80, borderRadius: "50%", background: "#4f46e520", border: "3px solid #4f46e540", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, flexShrink: 0, cursor: "pointer" }} onClick={() => toast("Avatar upload coming soon!", "info")}>
              {profile?.name?.[0] || "U"}
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 20, color: "#111827" }}>{profile?.name}</div>
              <div style={{ fontSize: 14, color: "#6b7280" }}>{profile?.role} · Class {profile?.class_name}-{profile?.section}</div>
              <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 2 }}>Roll No. {profile?.roll_number} · {profile?.email}</div>
            </div>
          </div>

          {/* Academic summary */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(140px,1fr))", gap: 12 }}>
            {[["Overall %", "82%", "#4f46e5"], ["Attendance", "78%", "#0891b2"], ["Best Subject", "Maths", "#16a34a"], ["Needs Work", "Hindi", "#d97706"]].map(([l, v, c]) => (
              <div key={l} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 14, textAlign: "center" }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: c }}>{v}</div>
                <div style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>{l}</div>
              </div>
            ))}
          </div>

          {/* Edit form */}
          <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 14, padding: 20 }}>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>Edit Profile</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 14 }}>
              <Input label="Full Name" value={form.name} onChange={v => setForm(p => ({ ...p, name: v }))} />
              <Input label="Phone" value={form.phone} onChange={v => setForm(p => ({ ...p, phone: v }))} />
            </div>
            <div style={{ marginTop: 14 }}><Textarea label="Bio" value={form.bio} onChange={v => setForm(p => ({ ...p, bio: v }))} placeholder="A short bio..." rows={3} /></div>
            <div style={{ marginTop: 14 }}><Btn onClick={() => toast("Profile saved!", "success")} variant="primary">Save Changes</Btn></div>
          </div>
        </div>
      )}

      {tab === "notifications" && (
        <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 14, padding: 20 }}>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>Notification Preferences</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {Object.entries(notifPrefs).map(([key, val]) => (
              <div key={key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid #f3f4f6" }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, textTransform: "capitalize" }}>{key}</div>
                  <div style={{ fontSize: 12, color: "#9ca3af" }}>Get notified for {key} updates</div>
                </div>
                <div onClick={() => setNotifPrefs(p => ({ ...p, [key]: !val }))} style={{ width: 44, height: 24, borderRadius: 12, background: val ? "#4f46e5" : "#e5e7eb", cursor: "pointer", position: "relative", transition: "background 0.2s" }}>
                  <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#fff", position: "absolute", top: 3, left: val ? 23 : 3, transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "appearance" && (
        <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 14, padding: 20 }}>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 20 }}>Appearance Settings</div>
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>Theme</div>
            <div style={{ display: "flex", gap: 10 }}>
              {["light", "dark", "system"].map(t => (
                <button key={t} onClick={() => setTheme(t)} style={{ padding: "10px 20px", borderRadius: 10, border: `2px solid ${theme === t ? "#4f46e5" : "#e5e7eb"}`, background: theme === t ? "#f0f0ff" : "#fff", color: theme === t ? "#4f46e5" : "#6b7280", fontWeight: 600, fontSize: 13, cursor: "pointer", fontFamily: "inherit", textTransform: "capitalize" }}>
                  {t === "light" ? "☀️ Light" : t === "dark" ? "🌙 Dark" : "🖥 System"}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>Font Size</div>
            <div style={{ display: "flex", gap: 10 }}>
              {["normal", "large", "xl"].map(f => (
                <button key={f} onClick={() => setFontSize(f)} style={{ padding: "10px 20px", borderRadius: 10, border: `2px solid ${fontSize === f ? "#4f46e5" : "#e5e7eb"}`, background: fontSize === f ? "#f0f0ff" : "#fff", color: fontSize === f ? "#4f46e5" : "#6b7280", fontWeight: 600, fontSize: f === "xl" ? 16 : f === "large" ? 15 : 13, cursor: "pointer", fontFamily: "inherit" }}>
                  {f === "xl" ? "Extra Large" : f === "large" ? "Large" : "Normal"}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === "security" && (
        <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 14, padding: 20 }}>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>Change Password</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14, maxWidth: 400 }}>
            <Input label="Current Password" type="password" value={pwForm.current} onChange={v => setPwForm(p => ({ ...p, current: v }))} />
            <Input label="New Password" type="password" value={pwForm.newPw} onChange={v => setPwForm(p => ({ ...p, newPw: v }))} />
            {pwForm.newPw && (
              <div>
                <div style={{ display: "flex", gap: 4, marginBottom: 4 }}>
                  {[1, 2, 3, 4].map(i => <div key={i} style={{ flex: 1, height: 4, borderRadius: 4, background: i <= strength ? strengthColors[strength] : "#e5e7eb" }} />)}
                </div>
                <div style={{ fontSize: 12, color: strengthColors[strength] }}>{strengthLabels[strength]}</div>
              </div>
            )}
            <Input label="Confirm New Password" type="password" value={pwForm.confirm} onChange={v => setPwForm(p => ({ ...p, confirm: v }))} />
            {pwForm.confirm && pwForm.newPw !== pwForm.confirm && <div style={{ fontSize: 12, color: "#dc2626" }}>Passwords do not match</div>}
            <Btn onClick={() => toast("Password changed!", "success")} variant="primary" disabled={!pwForm.current || !pwForm.newPw || pwForm.newPw !== pwForm.confirm || strength < 2}>Update Password</Btn>
          </div>
        </div>
      )}

      {tab === "data" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 14, padding: 20 }}>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 8 }}>Download My Data</div>
            <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 14 }}>Download a copy of all your data including attendance, marks, submissions, and profile information.</div>
            <Btn onClick={() => toast("Your data is being prepared for download...", "info")} variant="ghost">⬇️ Download My Data (JSON)</Btn>
          </div>
          <div style={{ background: "#fff5f5", border: "1px solid #fca5a5", borderRadius: 14, padding: 20 }}>
            <div style={{ fontWeight: 700, fontSize: 15, color: "#dc2626", marginBottom: 8 }}>Delete Account</div>
            <div style={{ fontSize: 13, color: "#7f1d1d", marginBottom: 14 }}>This action is permanent and cannot be undone. Your data will be sent to the admin for review before deletion.</div>
            <Btn onClick={() => toast("Deletion request sent to admin", "warning")} variant="danger">Request Account Deletion</Btn>
          </div>
        </div>
      )}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// COURSES TAB (Tab 2 of sidebar)
// ──────────────────────────────────────────────────────────────────────────────
function TabCourses({ onNavigate }) {
  const [selected, setSelected] = useState(null);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {selected ? (
        <div>
          <button onClick={() => setSelected(null)} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", color: "#4f46e5", fontWeight: 600, fontSize: 14, marginBottom: 20, fontFamily: "inherit", padding: 0 }}>← Back to Courses</button>
          <SubjectDrawer subject={selected} onNavigate={onNavigate} />
        </div>
      ) : (
        <div>
          <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 16 }}>My Subjects — Class 10-A</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 16 }}>
            {MOCK_SUBJECTS.map(sub => {
              const subResults = MOCK_RESULTS.filter(r => r.subject === sub.name);
              const avg = subResults.length > 0 ? Math.round(subResults.reduce((a, r) => a + (r.marks / r.max) * 100, 0) / subResults.length) : 0;
              const chapDone = MOCK_SYLLABUS.filter(c => c.subject === sub.name && c.status === "completed").length;
              const chapTotal = MOCK_SYLLABUS.filter(c => c.subject === sub.name).length;
              return (
                <div key={sub.id} onClick={() => setSelected(sub)} style={{ background: "#fff", border: `2px solid ${sub.color}30`, borderRadius: 16, padding: 20, cursor: "pointer", transition: "all 0.15s" }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 8px 24px ${sub.color}20`; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                    <div style={{ width: 48, height: 48, borderRadius: 12, background: sub.color + "15", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>{sub.icon}</div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 15, color: "#111827" }}>{sub.name}</div>
                      <div style={{ fontSize: 12, color: "#9ca3af" }}>{sub.teacher}</div>
                    </div>
                  </div>
                  <div style={{ marginBottom: 8 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#6b7280", marginBottom: 4 }}>
                      <span>Syllabus</span><span>{chapDone}/{chapTotal || "—"} chapters</span>
                    </div>
                    <ProgressBar value={chapDone} max={chapTotal || 1} color={sub.color} height={6} />
                  </div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <Badge label={`${avg}% avg`} color={sub.color} />
                    <Badge label={`${MOCK_HOMEWORK.filter(h => h.subject === sub.name).length} homework`} color="#6b7280" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function SubjectDrawer({ subject, onNavigate }) {
  const chapDone = MOCK_SYLLABUS.filter(c => c.subject === subject.name && c.status === "completed").length;
  const chapTotal = MOCK_SYLLABUS.filter(c => c.subject === subject.name).length || 1;
  const subHW = MOCK_HOMEWORK.filter(h => h.subject === subject.name);
  const subResults = MOCK_RESULTS.filter(r => r.subject === subject.name);
  const subMaterials = MOCK_MATERIALS.filter(m => m.subject === subject.name);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ background: `linear-gradient(135deg, ${subject.color}, ${subject.color}cc)`, borderRadius: 16, padding: 24, color: "#fff", display: "flex", gap: 16, alignItems: "center" }}>
        <div style={{ fontSize: 48 }}>{subject.icon}</div>
        <div>
          <div style={{ fontSize: 24, fontWeight: 800 }}>{subject.name}</div>
          <div style={{ opacity: 0.85 }}>{subject.teacher}</div>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: 12 }}>
        <StatCard label="Syllabus Done" value={`${Math.round((chapDone / chapTotal) * 100)}%`} icon="📈" color={subject.color} />
        <StatCard label="Homework" value={subHW.length} icon="📝" color="#4f46e5" />
        <StatCard label="Study Materials" value={subMaterials.length} icon="📂" color="#0891b2" />
        <StatCard label="Tests Taken" value={subResults.length} icon="🎯" color="#16a34a" />
      </div>
      <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 14, padding: 20 }}>
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 12 }}>Chapter Progress</div>
        {MOCK_SYLLABUS.filter(c => c.subject === subject.name).map(c => (
          <div key={c.id} style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, fontWeight: 600, marginBottom: 4 }}>
              <span>{c.chapter}</span>
              <Badge label={c.status === "completed" ? "Done" : c.status === "in_progress" ? "In Progress" : "Not Started"} color={c.status === "completed" ? "#16a34a" : c.status === "in_progress" ? "#4f46e5" : "#9ca3af"} />
            </div>
            <ProgressBar value={c.completed} max={c.total_topics} color={c.status === "completed" ? "#16a34a" : subject.color} height={6} showLabel />
          </div>
        ))}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// MAIN APP
// ──────────────────────────────────────────────────────────────────────────────
const TABS = [
  { id: "dashboard", label: "Dashboard", icon: "🏠" },
  { id: "courses", label: "Courses", icon: "📚" },
  { id: "attendance", label: "Attendance", icon: "✅" },
  { id: "homework", label: "Homework", icon: "📝" },
  { id: "exams", label: "Exams & Results", icon: "🎯" },
  { id: "notices", label: "Notices", icon: "📢" },
  { id: "materials", label: "Study Materials", icon: "📂" },
  { id: "syllabus", label: "Syllabus", icon: "📈" },
  { id: "timetable", label: "Timetable", icon: "🗓" },
  { id: "discussions", label: "Discussions", icon: "💬" },
  { id: "tests", label: "Online Tests", icon: "💻" },
  { id: "leave", label: "Leave", icon: "🏥" },
  { id: "notifications", label: "Notifications", icon: "🔔" },
  { id: "profile", label: "Profile & Settings", icon: "👤" },
];

function AppContent() {
  const { profile, loading } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const unreadNotifs = MOCK_NOTIFICATIONS.filter(n => !n.is_read).length;

  const renderTab = () => {
    const props = { onNavigate: setActiveTab };
    switch (activeTab) {
      case "dashboard": return <TabDashboard {...props} />;
      case "courses": return <TabCourses {...props} />;
      case "attendance": return <TabAttendance />;
      case "homework": return <TabHomework />;
      case "exams": return <TabExams />;
      case "notices": return <TabNotices />;
      case "materials": return <TabMaterials />;
      case "syllabus": return <TabSyllabus />;
      case "timetable": return <TabTimetable />;
      case "discussions": return <TabDiscussions />;
      case "tests": return <TabTests />;
      case "leave": return <TabLeave />;
      case "notifications": return <TabNotifications {...props} />;
      case "profile": return <TabProfile />;
      default: return <TabDashboard {...props} />;
    }
  };

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: "#f9fafb" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🎓</div>
        <div style={{ fontSize: 20, fontWeight: 700, color: "#4f46e5" }}>EduPortal LMS</div>
        <div style={{ fontSize: 14, color: "#9ca3af", marginTop: 8 }}>Loading your dashboard...</div>
      </div>
    </div>
  );

  const activeTabData = TABS.find(t => t.id === activeTab);

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8fafc", fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif" }}>
      <style>{`
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        @keyframes slideIn { from{transform:translateX(100%);opacity:0} to{transform:translateX(0);opacity:1} }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: #f1f5f9; } ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; }
        @media print {
          .no-print { display: none !important; }
          .print-only { display: block !important; }
        }
        @media (max-width: 768px) {
          .desktop-sidebar { display: none !important; }
          .mobile-header { display: flex !important; }
        }
        @media (min-width: 769px) {
          .mobile-header { display: none !important; }
          .mobile-bottom-nav { display: none !important; }
        }
      `}</style>

      {/* Desktop Sidebar */}
      <aside className="desktop-sidebar no-print" style={{ width: 260, background: "#fff", borderRight: "1px solid #e5e7eb", display: "flex", flexDirection: "column", position: "sticky", top: 0, height: "100vh", overflowY: "auto", flexShrink: 0 }}>
        {/* Brand */}
        <div style={{ padding: "20px 20px 16px", borderBottom: "1px solid #f3f4f6" }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: "#4f46e5" }}>🎓 </div>
          <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>Learning Management System</div>
        </div>

        {/* User */}
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #f3f4f6", display: "flex", gap: 12, alignItems: "center" }}>
          <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#4f46e520", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0, fontWeight: 700, color: "#4f46e5" }}>{profile?.name?.[0]}</div>
          <div style={{ overflow: "hidden" }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: "#111827", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{profile?.name}</div>
            <div style={{ fontSize: 12, color: "#9ca3af" }}>Class {profile?.class_name}-{profile?.section} · Roll #{profile?.roll_number}</div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "8px 10px", overflowY: "auto" }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 10, border: "none", background: activeTab === t.id ? "#4f46e510" : "transparent", color: activeTab === t.id ? "#4f46e5" : "#6b7280", fontWeight: activeTab === t.id ? 700 : 500, fontSize: 13.5, cursor: "pointer", textAlign: "left", fontFamily: "inherit", marginBottom: 2, transition: "all 0.12s", position: "relative" }}
              onMouseEnter={e => { if (activeTab !== t.id) e.currentTarget.style.background = "#f9fafb"; }}
              onMouseLeave={e => { if (activeTab !== t.id) e.currentTarget.style.background = "transparent"; }}>
              <span style={{ fontSize: 16, lineHeight: 1 }}>{t.icon}</span>
              <span>{t.label}</span>
              {t.id === "notifications" && unreadNotifs > 0 && <span style={{ marginLeft: "auto", background: "#dc2626", color: "#fff", borderRadius: 20, fontSize: 10, fontWeight: 700, padding: "2px 6px" }}>{unreadNotifs}</span>}
              {t.id === "homework" && MOCK_HOMEWORK.filter(h => !h.submitted).length > 0 && <span style={{ marginLeft: "auto", background: "#d97706", color: "#fff", borderRadius: 20, fontSize: 10, fontWeight: 700, padding: "2px 6px" }}>{MOCK_HOMEWORK.filter(h => !h.submitted).length}</span>}
            </button>
          ))}
        </nav>

        {/* Signout */}
        <div style={{ padding: "12px 20px", borderTop: "1px solid #f3f4f6" }}>
          <button onClick={() => supabase.auth.signOut()} style={{ width: "100%", padding: "9px 0", borderRadius: 9, border: "1.5px solid #fee2e2", background: "#fff5f5", color: "#dc2626", fontWeight: 600, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>Sign Out</button>
        </div>
      </aside>

      {/* Mobile: header + bottom nav */}
      <div className="mobile-header" style={{ display: "none", position: "fixed", top: 0, left: 0, right: 0, height: 56, background: "#fff", borderBottom: "1px solid #e5e7eb", alignItems: "center", justifyContent: "space-between", padding: "0 16px", zIndex: 100 }}>
        <div style={{ fontSize: 16, fontWeight: 800, color: "#4f46e5" }}>🎓 EduPortal</div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {unreadNotifs > 0 && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#dc2626" }} />}
          <button onClick={() => setSidebarOpen(true)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 22 }}>☰</button>
        </div>
      </div>

      {/* Mobile drawer overlay */}
      {sidebarOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200 }}>
          <div onClick={() => setSidebarOpen(false)} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)" }} />
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 280, background: "#fff", overflowY: "auto", display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "20px 20px 12px", borderBottom: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between" }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: "#4f46e5" }}>🎓 EduPortal</div>
              <button onClick={() => setSidebarOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 22, color: "#9ca3af" }}>×</button>
            </div>
            <nav style={{ padding: "8px 10px", flex: 1 }}>
              {TABS.map(t => (
                <button key={t.id} onClick={() => { setActiveTab(t.id); setSidebarOpen(false); }} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", borderRadius: 10, border: "none", background: activeTab === t.id ? "#4f46e510" : "transparent", color: activeTab === t.id ? "#4f46e5" : "#6b7280", fontWeight: activeTab === t.id ? 700 : 500, fontSize: 14, cursor: "pointer", textAlign: "left", fontFamily: "inherit", marginBottom: 2 }}>
                  <span style={{ fontSize: 18 }}>{t.icon}</span>{t.label}
                </button>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Main content */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {/* Topbar */}
        <div className="no-print" style={{ background: "#fff", borderBottom: "1px solid #e5e7eb", padding: "14px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50 }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: 18, color: "#111827" }}>{activeTabData?.icon} {activeTabData?.label}</div>
            <div style={{ fontSize: 12, color: "#9ca3af" }}>{new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button onClick={() => setActiveTab("notifications")} style={{ position: "relative", background: "none", border: "none", cursor: "pointer", fontSize: 20 }}>
              🔔{unreadNotifs > 0 && <span style={{ position: "absolute", top: -4, right: -4, width: 14, height: 14, borderRadius: "50%", background: "#dc2626", border: "2px solid #fff", fontSize: 8, fontWeight: 700, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>{unreadNotifs}</span>}
            </button>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#4f46e520", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "#4f46e5", cursor: "pointer" }} onClick={() => setActiveTab("profile")}>{profile?.name?.[0]}</div>
          </div>
        </div>

        {/* Tab content */}
        <div style={{ flex: 1, padding: "24px 28px", maxWidth: 1280, width: "100%" }}>
          {renderTab()}
        </div>
      </main>

      {/* Mobile bottom nav (5 primary tabs) */}
      <nav className="mobile-bottom-nav no-print" style={{ display: "none", position: "fixed", bottom: 0, left: 0, right: 0, height: 60, background: "#fff", borderTop: "1px solid #e5e7eb", zIndex: 100, justifyContent: "space-around", alignItems: "center" }}>
        {[TABS[0], TABS[2], TABS[3], TABS[12], TABS[13]].map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, background: "none", border: "none", cursor: "pointer", color: activeTab === t.id ? "#4f46e5" : "#9ca3af", fontFamily: "inherit" }}>
            <span style={{ fontSize: 22 }}>{t.icon}</span>
            <span style={{ fontSize: 9, fontWeight: 600 }}>{t.label.split(" ")[0]}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// ROOT EXPORT
// ──────────────────────────────────────────────────────────────────────────────
export default function LMSDashboard() {
  return (
    <AuthProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </AuthProvider>
  );
}

/*
=== SERVICE WORKER REGISTRATION (extract to public/register-sw.js) ===

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').then(reg => {
    console.log('SW registered', reg);
  });
}

async function subscribePush() {
  const reg = await navigator.serviceWorker.ready;
  const sub = await reg.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: 'YOUR_VAPID_PUBLIC_KEY'
  });
  // Send sub to your Supabase Edge Function for storage
  await supabase.functions.invoke('save-push-subscription', { body: sub });
}

=== SERVICE WORKER (extract to public/sw.js) ===

self.addEventListener('push', event => {
  const data = event.data.json();
  self.registration.showNotification(data.title, {
    body: data.body,
    icon: '/logo192.png',
    badge: '/badge.png',
    data: { url: data.url }
  });
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  clients.openWindow(event.notification.data.url || '/');
});
*/