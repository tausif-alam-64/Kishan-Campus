import React, { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "../../hooks/useAuth";
import { supabase } from "../../lib/supabaseClient";

// ─── UTILS ────────────────────────────────────────────────────────────────────
const timeAgo = (dateStr) => {
  const diff = (Date.now() - new Date(dateStr)) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 172800) return "Yesterday";
  return new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
};

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const TIME_SLOTS = ["8:00", "8:45", "9:30", "10:15", "11:15", "12:00", "12:45", "1:30", "2:15"];

// ─── TOAST ────────────────────────────────────────────────────────────────────
const ToastContext = React.createContext(null);
const useToast = () => React.useContext(ToastContext);

const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const add = useCallback((message, type = "success") => {
    const id = Date.now();
    setToasts((p) => [...p, { id, message, type }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 3500);
  }, []);
  return (
    <ToastContext.Provider value={add}>
      {children}
      <div className="fixed bottom-6 right-6 z-[999] flex flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-sm font-medium text-white transition-all duration-300 ${
              t.type === "error" ? "bg-red-600" : t.type === "info" ? "bg-blue-600" : "bg-secondary"
            }`}
          >
            <span>{t.type === "error" ? "✗" : t.type === "info" ? "ℹ" : "✓"}</span>
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

// ─── SKELETON ─────────────────────────────────────────────────────────────────
const Skeleton = ({ className = "" }) => (
  <div className={`animate-pulse bg-gray-200 rounded-lg ${className}`} />
);

// ─── SLIDE PANEL ──────────────────────────────────────────────────────────────
const SlidePanel = ({ open, onClose, title, children }) => (
  <>
    {open && <div className="fixed inset-0 bg-black/30 z-40 backdrop-blur-sm" onClick={onClose} />}
    <div
      className={`fixed top-0 right-0 h-full w-full sm:w-[480px] bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${
        open ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <h2 className="text-lg font-bold text-secondary">{title}</h2>
        <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500 text-xl">×</button>
      </div>
      <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
    </div>
  </>
);

// ─── SIDEBAR ──────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: "overview", label: "Overview", icon: "⊞" },
  { id: "notices", label: "Notices", icon: "📢" },
  { id: "materials", label: "Study Material", icon: "📚" },
  { id: "attendance", label: "Attendance", icon: "✔" },
  { id: "timetable", label: "Timetable", icon: "📅" },
  { id: "profile", label: "Profile", icon: "👤" },
];

const Sidebar = ({ activeTab, setActiveTab, teacher, draftCount, mobileOpen, setMobileOpen }) => {
  const content = (
    <div className="flex flex-col h-full">
      {/* School Brand */}
      <div className="px-6 py-5 border-b border-white/10">
        <p className="text-xs font-semibold uppercase tracking-widest text-white/50 mb-1">Kishan Campus</p>
        <h2 className="text-lg font-bold text-white leading-tight">Teacher Portal</h2>
      </div>

      {/* Teacher Info */}
      <div className="px-6 py-5 border-b border-white/10 flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-primary flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
          {teacher?.full_name?.[0] || "T"}
        </div>
        <div className="min-w-0">
          <p className="text-white font-semibold text-sm truncate">{teacher?.full_name || "Teacher"}</p>
          <p className="text-white/50 text-xs truncate">{teacher?.subject || "Faculty"}</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => { setActiveTab(item.id); setMobileOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 text-left ${
              activeTab === item.id
                ? "bg-white text-secondary shadow-sm"
                : "text-white/70 hover:bg-white/10 hover:text-white"
            }`}
          >
            <span className="text-base w-5 text-center">{item.icon}</span>
            <span>{item.label}</span>
            {item.id === "notices" && draftCount > 0 && (
              <span className="ml-auto bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {draftCount}
              </span>
            )}
          </button>
        ))}
      </nav>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-secondary min-h-screen fixed top-0 left-0 z-30">
        {content}
      </aside>

      {/* Mobile overlay sidebar */}
      {mobileOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setMobileOpen(false)} />
          <aside className="fixed top-0 left-0 h-full w-72 bg-secondary z-50 lg:hidden flex flex-col">
            {content}
          </aside>
        </>
      )}
    </>
  );
};

// ─── OVERVIEW TAB ─────────────────────────────────────────────────────────────
const OverviewTab = ({ userId }) => {
  const [stats, setStats] = useState(null);
  const [activity, setActivity] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);

  const todayName = DAYS[new Date().getDay() - 1] || "Monday";

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [noticesRes, materialsRes, activityRes, scheduleRes] = await Promise.all([
          supabase.from("notices").select("id, is_published").eq("teacher_id", userId),
          supabase.from("study_materials").select("id").eq("teacher_id", userId),
          supabase.from("teacher_activity").select("*").eq("teacher_id", userId).order("created_at", { ascending: false }).limit(5),
          supabase.from("timetable").select("*").eq("teacher_id", userId).eq("day", todayName),
        ]);

        const notices = noticesRes.data || [];
        setStats({
          totalNotices: notices.length,
          drafts: notices.filter((n) => !n.is_published).length,
          materials: (materialsRes.data || []).length,
          todayClasses: (scheduleRes.data || []).length,
        });
        setActivity(activityRes.data || []);
        setSchedule(scheduleRes.data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    if (userId) fetchAll();
  }, [userId]);

  const statCards = [
    { label: "Notices Posted", value: stats?.totalNotices ?? 0, color: "bg-secondary", icon: "📢" },
    { label: "Study Materials", value: stats?.materials ?? 0, color: "bg-primary", icon: "📚" },
    { label: "Today's Classes", value: stats?.todayClasses ?? 0, color: "bg-emerald-600", icon: "📅" },
    { label: "Draft Notices", value: stats?.drafts ?? 0, color: "bg-amber-500", icon: "📝" },
  ];

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {loading
          ? Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-28" />)
          : statCards.map((s) => (
              <div key={s.label} className={`${s.color} rounded-2xl p-5 text-white`}>
                <div className="text-2xl mb-2">{s.icon}</div>
                <p className="text-3xl font-bold">{s.value}</p>
                <p className="text-sm text-white/80 mt-1">{s.label}</p>
              </div>
            ))}
      </div>

      {/* Two feed columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h3 className="font-bold text-secondary mb-4 flex items-center gap-2">
            <span>🕐</span> Recent Activity
          </h3>
          {loading ? (
            <div className="space-y-3">{Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-12" />)}</div>
          ) : activity.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-8">No recent activity yet.</p>
          ) : (
            <div className="space-y-3">
              {activity.map((a) => (
                <div key={a.id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-sm flex-shrink-0">
                    {a.type === "notice" ? "📢" : a.type === "material" ? "📚" : "✔"}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-secondary font-medium truncate">{a.description}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{timeAgo(a.created_at)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Today's Schedule */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h3 className="font-bold text-secondary mb-4 flex items-center gap-2">
            <span>📅</span> Today — <span className="text-primary">{todayName}</span>
          </h3>
          {loading ? (
            <div className="space-y-3">{Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-14" />)}</div>
          ) : schedule.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-8">No classes scheduled today.</p>
          ) : (
            <div className="space-y-3">
              {schedule.map((s, i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-xl border border-gray-100">
                  <div className="text-center min-w-[56px]">
                    <p className="text-xs font-bold text-primary">{s.time_slot}</p>
                  </div>
                  <div className="w-px h-8 bg-gray-200" />
                  <div>
                    <p className="text-sm font-semibold text-secondary">{s.class_name} — {s.section}</p>
                    <p className="text-xs text-gray-400">Room {s.room}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── NOTICES TAB ──────────────────────────────────────────────────────────────
const AUDIENCE_OPTIONS = ["All Students", "Class 9", "Class 10", "Class 11", "Class 12", "Staff"];

const NoticesTab = ({ userId }) => {
  const toast = useToast();
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [panelOpen, setPanelOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ title: "", body: "", audience: "All Students", publish_date: "", is_published: false });

  const fetchNotices = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from("notices").select("*").eq("teacher_id", userId).order("created_at", { ascending: false });
    setNotices(data || []);
    setLoading(false);
  }, [userId]);

  useEffect(() => { if (userId) fetchNotices(); }, [fetchNotices]);

  const openCreate = () => {
    setEditing(null);
    setForm({ title: "", body: "", audience: "All Students", publish_date: new Date().toISOString().split("T")[0], is_published: false });
    setPanelOpen(true);
  };

  const openEdit = (notice) => {
    setEditing(notice);
    setForm({ title: notice.title, body: notice.body, audience: notice.audience, publish_date: notice.publish_date, is_published: notice.is_published });
    setPanelOpen(true);
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.body.trim()) { toast("Title and body are required.", "error"); return; }
    setSaving(true);
    try {
      if (editing) {
        await supabase.from("notices").update({ ...form }).eq("id", editing.id);
        toast("Notice updated successfully.");
      } else {
        await supabase.from("notices").insert({ ...form, teacher_id: userId });
        await supabase.from("teacher_activity").insert({ teacher_id: userId, type: "notice", description: `Posted notice: "${form.title}"` });
        toast("Notice created successfully.");
      }
      setPanelOpen(false);
      fetchNotices();
    } catch { toast("Something went wrong.", "error"); }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    await supabase.from("notices").delete().eq("id", id);
    setConfirmDelete(null);
    toast("Notice deleted.", "info");
    fetchNotices();
  };

  const togglePublish = async (notice) => {
    await supabase.from("notices").update({ is_published: !notice.is_published }).eq("id", notice.id);
    toast(notice.is_published ? "Notice unpublished." : "Notice published.");
    fetchNotices();
  };

  return (
    <>
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-secondary">Notices</h2>
            <p className="text-sm text-gray-500 mt-0.5">Create and manage announcements for students.</p>
          </div>
          <button onClick={openCreate} className="bg-secondary text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary transition flex items-center gap-2">
            <span>+</span> New Notice
          </button>
        </div>

        {loading ? (
          <div className="space-y-3">{Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-16" />)}</div>
        ) : notices.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-4xl mb-3">📢</p>
            <p className="font-medium">No notices yet. Create your first one.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-5 py-3.5 font-semibold text-gray-600">Title</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-gray-600 hidden sm:table-cell">Audience</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-gray-600 hidden md:table-cell">Date</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-gray-600">Status</th>
                  <th className="text-right px-5 py-3.5 font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {notices.map((n) => (
                  <tr key={n.id} className="hover:bg-gray-50/60 transition">
                    <td className="px-5 py-4">
                      <p className="font-medium text-secondary truncate max-w-[180px]">{n.title}</p>
                      <p className="text-xs text-gray-400 mt-0.5 truncate max-w-[180px]">{n.body}</p>
                    </td>
                    <td className="px-5 py-4 hidden sm:table-cell">
                      <span className="px-2.5 py-1 bg-primary/10 text-primary rounded-lg text-xs font-medium">{n.audience}</span>
                    </td>
                    <td className="px-5 py-4 text-gray-500 hidden md:table-cell">{n.publish_date}</td>
                    <td className="px-5 py-4">
                      <button onClick={() => togglePublish(n)} className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${n.is_published ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200" : "bg-amber-100 text-amber-700 hover:bg-amber-200"}`}>
                        {n.is_published ? "Published" : "Draft"}
                      </button>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEdit(n)} className="px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-100 transition">Edit</button>
                        {confirmDelete === n.id ? (
                          <div className="flex items-center gap-1">
                            <button onClick={() => handleDelete(n.id)} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-600 text-white hover:bg-red-700 transition">Confirm</button>
                            <button onClick={() => setConfirmDelete(null)} className="px-3 py-1.5 rounded-lg text-xs font-medium text-gray-500 hover:bg-gray-100 transition">Cancel</button>
                          </div>
                        ) : (
                          <button onClick={() => setConfirmDelete(n.id)} className="px-3 py-1.5 rounded-lg text-xs font-medium text-red-500 hover:bg-red-50 transition">Delete</button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Notice Form Panel */}
      <SlidePanel open={panelOpen} onClose={() => setPanelOpen(false)} title={editing ? "Edit Notice" : "Create Notice"}>
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-secondary mb-1.5">Title *</label>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition" placeholder="Notice title..." />
          </div>
          <div>
            <label className="block text-sm font-semibold text-secondary mb-1.5">Body *</label>
            <textarea value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} rows={5} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition resize-none" placeholder="Write notice content..." />
          </div>
          <div>
            <label className="block text-sm font-semibold text-secondary mb-1.5">Target Audience</label>
            <select value={form.audience} onChange={(e) => setForm({ ...form, audience: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition bg-white">
              {AUDIENCE_OPTIONS.map((o) => <option key={o}>{o}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-secondary mb-1.5">Publish Date</label>
            <input type="date" value={form.publish_date} onChange={(e) => setForm({ ...form, publish_date: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition" />
          </div>
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
            <button onClick={() => setForm({ ...form, is_published: !form.is_published })} className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${form.is_published ? "bg-emerald-500" : "bg-gray-300"}`}>
              <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${form.is_published ? "translate-x-5" : "translate-x-0"}`} />
            </button>
            <span className="text-sm font-medium text-secondary">{form.is_published ? "Publish immediately" : "Save as draft"}</span>
          </div>
          <button onClick={handleSave} disabled={saving} className="w-full bg-secondary text-white py-3 rounded-xl font-semibold text-sm hover:bg-primary transition disabled:opacity-60">
            {saving ? "Saving..." : editing ? "Update Notice" : "Create Notice"}
          </button>
        </div>
      </SlidePanel>
    </>
  );
};

// ─── STUDY MATERIAL TAB ───────────────────────────────────────────────────────
const MaterialsTab = ({ userId, teacherProfile }) => {
  const toast = useToast();
  const fileRef = useRef();
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [filterSubject, setFilterSubject] = useState("All");
  const [filterClass, setFilterClass] = useState("All");
  const [form, setForm] = useState({ title: "", subject: "", class: "", description: "" });
  const [file, setFile] = useState(null);

  const CLASS_OPTIONS = ["Class 9", "Class 10", "Class 11", "Class 12"];

  const fetchMaterials = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from("study_materials").select("*").eq("teacher_id", userId).order("created_at", { ascending: false });
    setMaterials(data || []);
    setLoading(false);
  }, [userId]);

  useEffect(() => { if (userId) fetchMaterials(); }, [fetchMaterials]);

  const handleUpload = async () => {
    if (!form.title || !form.subject || !form.class || !file) { toast("Please fill all fields and select a file.", "error"); return; }
    if (file.size > 10 * 1024 * 1024) { toast("File must be under 10MB.", "error"); return; }
    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `${userId}/${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage.from("study-materials").upload(path, file);
      if (uploadError) throw uploadError;
      const { data: urlData } = supabase.storage.from("study-materials").getPublicUrl(path);
      await supabase.from("study_materials").insert({ ...form, teacher_id: userId, file_url: urlData.publicUrl, file_type: ext });
      await supabase.from("teacher_activity").insert({ teacher_id: userId, type: "material", description: `Uploaded: "${form.title}"` });
      toast("File uploaded successfully.");
      setForm({ title: "", subject: "", class: "", description: "" });
      setFile(null);
      if (fileRef.current) fileRef.current.value = "";
      fetchMaterials();
    } catch { toast("Upload failed. Try again.", "error"); }
    setUploading(false);
  };

  const handleDelete = async (mat) => {
    const path = mat.file_url.split("/study-materials/")[1];
    await supabase.storage.from("study-materials").remove([path]);
    await supabase.from("study_materials").delete().eq("id", mat.id);
    toast("Material deleted.", "info");
    fetchMaterials();
  };

  const copyLink = (url) => { navigator.clipboard.writeText(url); toast("Link copied to clipboard."); };

  const fileIcon = (type) => ({ pdf: "📄", doc: "📝", docx: "📝", png: "🖼", jpg: "🖼", jpeg: "🖼" }[type?.toLowerCase()] || "📁");

  const filtered = materials.filter((m) => (filterSubject === "All" || m.subject === filterSubject) && (filterClass === "All" || m.class === filterClass));
  const subjects = ["All", ...new Set(materials.map((m) => m.subject).filter(Boolean))];

  return (
    <div className="space-y-6">
      {/* Upload Form */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <h3 className="font-bold text-secondary mb-4 flex items-center gap-2"><span>📤</span> Upload New Material</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Title *</label>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition" placeholder="e.g. Chapter 3 Notes" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Subject *</label>
            <input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition" placeholder="e.g. Physics" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Class *</label>
            <select value={form.class} onChange={(e) => setForm({ ...form, class: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition bg-white">
              <option value="">Select class...</option>
              {CLASS_OPTIONS.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Description</label>
            <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition" placeholder="Optional description..." />
          </div>
        </div>
        <div
          className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center cursor-pointer hover:border-primary transition mb-4"
          onClick={() => fileRef.current?.click()}
        >
          <input ref={fileRef} type="file" accept=".pdf,.doc,.docx,.png,.jpg,.jpeg" className="hidden" onChange={(e) => setFile(e.target.files[0])} />
          {file ? (
            <p className="text-sm font-medium text-secondary">{fileIcon(file.name.split(".").pop())} {file.name}</p>
          ) : (
            <>
              <p className="text-2xl mb-2">📁</p>
              <p className="text-sm text-gray-500">Click to select file <span className="text-gray-400">(PDF, DOC, DOCX, PNG, JPG — max 10MB)</span></p>
            </>
          )}
        </div>
        <button onClick={handleUpload} disabled={uploading} className="w-full bg-secondary text-white py-3 rounded-xl font-semibold text-sm hover:bg-primary transition disabled:opacity-60 flex items-center justify-center gap-2">
          {uploading ? (<><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Uploading...</>) : "Upload Material"}
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-3 flex-wrap">
        <select value={filterSubject} onChange={(e) => setFilterSubject(e.target.value)} className="border border-gray-200 rounded-xl px-4 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/30">
          {subjects.map((s) => <option key={s}>{s}</option>)}
        </select>
        <select value={filterClass} onChange={(e) => setFilterClass(e.target.value)} className="border border-gray-200 rounded-xl px-4 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/30">
          {["All", ...CLASS_OPTIONS].map((c) => <option key={c}>{c}</option>)}
        </select>
        <span className="text-sm text-gray-400">{filtered.length} item{filtered.length !== 1 ? "s" : ""}</span>
      </div>

      {/* Materials Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array(6).fill(0).map((_, i) => <Skeleton key={i} className="h-40" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400"><p className="text-4xl mb-3">📚</p><p>No materials found.</p></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((m) => (
            <div key={m.id} className="bg-white rounded-2xl border border-gray-100 p-4 hover:shadow-md transition group">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-lg flex-shrink-0">{fileIcon(m.file_type)}</div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-secondary text-sm truncate">{m.title}</p>
                  {m.description && <p className="text-xs text-gray-400 mt-0.5 truncate">{m.description}</p>}
                </div>
              </div>
              <div className="flex gap-2 mb-3">
                <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-md text-xs font-medium">{m.subject}</span>
                <span className="px-2 py-0.5 bg-secondary/10 text-secondary rounded-md text-xs font-medium">{m.class}</span>
              </div>
              <p className="text-xs text-gray-400 mb-3">{timeAgo(m.created_at)}</p>
              <div className="flex gap-2">
                <button onClick={() => copyLink(m.file_url)} className="flex-1 py-1.5 text-xs font-semibold text-secondary border border-gray-200 rounded-lg hover:bg-gray-50 transition">Copy Link</button>
                <button onClick={() => handleDelete(m)} className="flex-1 py-1.5 text-xs font-semibold text-red-500 border border-red-100 rounded-lg hover:bg-red-50 transition">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── ATTENDANCE TAB ───────────────────────────────────────────────────────────
const AttendanceTab = ({ userId }) => {
  const toast = useToast();
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchClasses = async () => {
      const { data } = await supabase.from("timetable").select("class_name, section").eq("teacher_id", userId);
      const unique = [...new Map((data || []).map((d) => [`${d.class_name}-${d.section}`, d])).values()];
      setClasses(unique);
      if (unique.length > 0) setSelectedClass(`${unique[0].class_name}-${unique[0].section}`);
    };
    if (userId) fetchClasses();
  }, [userId]);

  useEffect(() => {
    if (!selectedClass || !date) return;
    const [className, section] = selectedClass.split("-");
    const fetchStudents = async () => {
      setLoadingStudents(true);
      const { data: studentData } = await supabase.from("students").select("id, full_name, roll_number").eq("class_name", className).eq("section", section).order("roll_number");
      const { data: attData } = await supabase.from("attendance").select("student_id, status").eq("class_name", className).eq("section", section).eq("date", date);
      const map = {};
      (attData || []).forEach((a) => { map[a.student_id] = a.status; });
      setStudents(studentData || []);
      const init = {};
      (studentData || []).forEach((s) => { init[s.id] = map[s.id] || "Present"; });
      setAttendance(init);
      setLoadingStudents(false);
    };
    fetchStudents();
  }, [selectedClass, date]);

  const toggle = (id) => setAttendance((p) => ({ ...p, [id]: p[id] === "Present" ? "Absent" : "Present" }));

  const handleSubmit = async () => {
    if (students.length === 0) return;
    const [className, section] = selectedClass.split("-");
    setSaving(true);
    try {
      await supabase.from("attendance").delete().eq("class_name", className).eq("section", section).eq("date", date);
      const records = students.map((s) => ({ student_id: s.id, class_name: className, section, date, status: attendance[s.id] || "Present", marked_by: userId }));
      await supabase.from("attendance").insert(records);
      await supabase.from("teacher_activity").insert({ teacher_id: userId, type: "attendance", description: `Marked attendance for ${className} ${section} on ${date}` });
      toast("Attendance saved successfully.");
    } catch { toast("Failed to save attendance.", "error"); }
    setSaving(false);
  };

  const presentCount = Object.values(attendance).filter((v) => v === "Present").length;
  const absentCount = students.length - presentCount;

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-secondary">Attendance</h2>
        <p className="text-sm text-gray-500 mt-0.5">Mark and manage daily student attendance.</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Select Class</label>
            <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition bg-white">
              {classes.map((c) => <option key={`${c.class_name}-${c.section}`} value={`${c.class_name}-${c.section}`}>{c.class_name} — Section {c.section}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} max={new Date().toISOString().split("T")[0]} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition" />
          </div>
        </div>

        {students.length > 0 && (
          <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl mb-5 text-sm font-medium">
            <span className="text-emerald-600">✔ {presentCount} Present</span>
            <span className="text-gray-300">·</span>
            <span className="text-red-500">✗ {absentCount} Absent</span>
            <span className="text-gray-300">·</span>
            <span className="text-gray-500">{students.length} Total</span>
          </div>
        )}

        {loadingStudents ? (
          <div className="space-y-3">{Array(8).fill(0).map((_, i) => <Skeleton key={i} className="h-14" />)}</div>
        ) : students.length === 0 ? (
          <div className="text-center py-12 text-gray-400"><p className="text-3xl mb-2">📋</p><p>No students found for this class.</p></div>
        ) : (
          <>
            <div className="space-y-2 mb-5">
              {students.map((s) => {
                const isPresent = attendance[s.id] === "Present";
                return (
                  <div key={s.id} className={`flex items-center justify-between p-3.5 rounded-xl border transition ${isPresent ? "border-emerald-100 bg-emerald-50/50" : "border-red-100 bg-red-50/50"}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${isPresent ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"}`}>
                        {s.roll_number}
                      </div>
                      <span className="text-sm font-medium text-secondary">{s.full_name}</span>
                    </div>
                    <button onClick={() => toggle(s.id)} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${isPresent ? "bg-emerald-500 text-white hover:bg-emerald-600" : "bg-red-500 text-white hover:bg-red-600"}`}>
                      {isPresent ? "Present" : "Absent"}
                    </button>
                  </div>
                );
              })}
            </div>
            <button onClick={handleSubmit} disabled={saving} className="w-full bg-secondary text-white py-3 rounded-xl font-semibold text-sm hover:bg-primary transition disabled:opacity-60">
              {saving ? "Saving..." : "Submit Attendance"}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

// ─── TIMETABLE TAB ────────────────────────────────────────────────────────────
const TimetableTab = ({ userId }) => {
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(true);
  const todayName = DAYS[new Date().getDay() - 1];

  useEffect(() => {
    const fetchTimetable = async () => {
      setLoading(true);
      const { data } = await supabase.from("timetable").select("*").eq("teacher_id", userId);
      setTimetable(data || []);
      setLoading(false);
    };
    if (userId) fetchTimetable();
  }, [userId]);

  const getCell = (day, slot) => timetable.find((t) => t.day === day && t.time_slot === slot);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-secondary">My Timetable</h2>
        <p className="text-sm text-gray-500 mt-0.5">Your weekly class schedule. Managed by admin.</p>
      </div>
      {loading ? (
        <Skeleton className="h-96" />
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-x-auto">
          <table className="w-full text-xs min-w-[640px]">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left text-gray-500 font-semibold w-20">Time</th>
                {DAYS.map((d) => (
                  <th key={d} className={`px-3 py-3 text-center font-semibold ${d === todayName ? "text-primary bg-primary/5" : "text-gray-500"}`}>
                    {d.slice(0, 3)}
                    {d === todayName && <span className="ml-1 text-primary">•</span>}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {TIME_SLOTS.map((slot) => (
                <tr key={slot} className="hover:bg-gray-50/50">
                  <td className="px-4 py-3 text-gray-400 font-mono font-medium whitespace-nowrap">{slot}</td>
                  {DAYS.map((day) => {
                    const cell = getCell(day, slot);
                    return (
                      <td key={day} className={`px-2 py-2 text-center ${day === todayName ? "bg-primary/5" : ""}`}>
                        {cell ? (
                          <div className="bg-secondary/10 rounded-lg px-2 py-1.5">
                            <p className="font-semibold text-secondary text-[11px]">{cell.class_name}</p>
                            <p className="text-gray-500 text-[10px]">Sec {cell.section}</p>
                            {cell.room && <p className="text-primary text-[10px]">Room {cell.room}</p>}
                          </div>
                        ) : (
                          <span className="text-gray-200">—</span>
                        )}
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

// ─── PROFILE TAB ──────────────────────────────────────────────────────────────
const ProfileTab = ({ userId, user, onProfileUpdate }) => {
  const toast = useToast();
  const photoRef = useRef();
  const [form, setForm] = useState({ full_name: "", phone: "", bio: "", avatar_url: "" });
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data } = await supabase.from("teacher_profiles").select("*").eq("user_id", userId).single();
      if (data) { setForm({ full_name: data.full_name || "", phone: data.phone || "", bio: data.bio || "", avatar_url: data.avatar_url || "" }); setSubject(data.subject || ""); }
      setEmail(user?.email || "");
    };
    if (userId) fetchProfile();
  }, [userId]);

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingPhoto(true);
    try {
      const path = `avatars/${userId}.${file.name.split(".").pop()}`;
      await supabase.storage.from("avatars").upload(path, file, { upsert: true });
      const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(path);
      setForm((p) => ({ ...p, avatar_url: urlData.publicUrl }));
      toast("Photo updated.");
    } catch { toast("Photo upload failed.", "error"); }
    setUploadingPhoto(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await supabase.from("teacher_profiles").upsert({ user_id: userId, ...form, subject });
      toast("Profile saved successfully.");
      if (onProfileUpdate) onProfileUpdate({ ...form, subject });
    } catch { toast("Failed to save profile.", "error"); }
    setSaving(false);
  };

  return (
    <div className="space-y-5 max-w-2xl">
      <div>
        <h2 className="text-xl font-bold text-secondary">My Profile</h2>
        <p className="text-sm text-gray-500 mt-0.5">Update your personal information and photo.</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
        {/* Avatar */}
        <div className="flex items-center gap-5">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-secondary flex items-center justify-center text-white text-2xl font-bold overflow-hidden">
              {form.avatar_url ? <img src={form.avatar_url} alt="avatar" className="w-full h-full object-cover" /> : (form.full_name?.[0] || "T")}
            </div>
            <button onClick={() => photoRef.current?.click()} className="absolute -bottom-1 -right-1 w-7 h-7 bg-primary rounded-lg flex items-center justify-center text-white text-xs shadow hover:bg-secondary transition">
              {uploadingPhoto ? "…" : "✎"}
            </button>
            <input ref={photoRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
          </div>
          <div>
            <p className="font-bold text-secondary text-lg">{form.full_name || "Your Name"}</p>
            <p className="text-sm text-gray-400">{subject || "Subject not set"}</p>
            <p className="text-xs text-gray-400 mt-0.5">{email}</p>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Full Name</label>
            <input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition" placeholder="Your full name" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Phone Number</label>
            <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition" placeholder="10-digit mobile number" maxLength={10} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Email <span className="text-gray-300 normal-case">(from account)</span></label>
            <input value={email} readOnly className="w-full border border-gray-100 bg-gray-50 rounded-xl px-4 py-2.5 text-sm text-gray-400 cursor-not-allowed" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Subject <span className="text-gray-300 normal-case">(set by admin)</span></label>
            <input value={subject} readOnly className="w-full border border-gray-100 bg-gray-50 rounded-xl px-4 py-2.5 text-sm text-gray-400 cursor-not-allowed" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Bio</label>
            <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={3} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition resize-none" placeholder="Short bio (optional)" />
          </div>
        </div>

        <button onClick={handleSave} disabled={saving} className="w-full bg-secondary text-white py-3 rounded-xl font-semibold text-sm hover:bg-primary transition disabled:opacity-60">
          {saving ? "Saving..." : "Save Profile"}
        </button>
      </div>
    </div>
  );
};

// ─── MAIN DASHBOARD ───────────────────────────────────────────────────────────
const TeacherDashboardInner = () => {
  const { user } = useAuth();
  const userId = user?.id;
  const [activeTab, setActiveTab] = useState("overview");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [teacher, setTeacher] = useState(null);
  const [draftCount, setDraftCount] = useState(0);

  useEffect(() => {
    const fetchTeacher = async () => {
      const { data } = await supabase.from("teacher_profiles").select("*").eq("user_id", userId).single();
      if (data) setTeacher(data);
    };
    const fetchDrafts = async () => {
      const { count } = await supabase.from("notices").select("id", { count: "exact", head: true }).eq("teacher_id", userId).eq("is_published", false);
      setDraftCount(count || 0);
    };
    if (userId) { fetchTeacher(); fetchDrafts(); }
  }, [userId]);

  const tabTitle = NAV_ITEMS.find((n) => n.id === activeTab)?.label || "Dashboard";

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} teacher={teacher} draftCount={draftCount} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        {/* Top Bar */}
        <header className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-gray-100 px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 text-secondary transition" onClick={() => setMobileOpen(true)}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
            <div>
              <h1 className="text-base font-bold text-secondary">{tabTitle}</h1>
              <p className="text-xs text-gray-400 hidden sm:block">
                {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-white text-sm font-bold">
              {teacher?.full_name?.[0] || user?.email?.[0]?.toUpperCase() || "T"}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="px-5 py-6 sm:px-8 sm:py-8">
          {activeTab === "overview" && <OverviewTab userId={userId} />}
          {activeTab === "notices" && <NoticesTab userId={userId} />}
          {activeTab === "materials" && <MaterialsTab userId={userId} teacherProfile={teacher} />}
          {activeTab === "attendance" && <AttendanceTab userId={userId} />}
          {activeTab === "timetable" && <TimetableTab userId={userId} />}
          {activeTab === "profile" && <ProfileTab userId={userId} user={user} onProfileUpdate={(data) => setTeacher(data)} />}
        </main>
      </div>
    </div>
  );
};

// ─── EXPORT ───────────────────────────────────────────────────────────────────
const TeacherDashboard = () => (
  <ToastProvider>
    <TeacherDashboardInner />
  </ToastProvider>
);

export default TeacherDashboard;
