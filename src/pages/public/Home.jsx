import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Hero from "../../component/common/Hero";
import imgGroup  from "../../assets/about-2.avif";
import imgSingle from "../../assets/about-3.avif";
import booksImg    from "../../assets/books.svg";
import buildingImg from "../../assets/building.svg";
import heartImg    from "../../assets/heart.svg";
import { supabase } from "../../services/supabase/supabaseClient";

/* ─────────────────────────────────────────
   SCROLL REVEAL
───────────────────────────────────────── */
function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const ob = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.style.opacity="1"; el.style.transform="translateY(0)"; ob.disconnect(); }
    }, { threshold: 0.07 });
    ob.observe(el); return () => ob.disconnect();
  }, []);
  return ref;
}
function Up({ children, delay=0, className="" }) {
  const r = useReveal();
  return (
    <div ref={r} className={className}
      style={{ opacity:0, transform:"translateY(22px)", transition:`opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms` }}>
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────
   DIVIDER
───────────────────────────────────────── */
const Divider = () => (
  <div className="h-px bg-gradient-to-r from-transparent via-[#ddd8ce] to-transparent" />
);

/* ─────────────────────────────────────────
   HOME
───────────────────────────────────────── */
const Home = () => {
  const [notices, setNotices] = useState([]);
  const [loadingNotices, setLoadingNotices] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoadingNotices(true);
      const { data } = await supabase
        .from("notices")
        .select("id,title,category,issued_on,is_pinned")
        .eq("is_published", true)
        .order("is_pinned", { ascending: false })
        .order("issued_on", { ascending: false })
        .limit(4);
      setNotices(data || []);
      setLoadingNotices(false);
    };
    load();
  }, []);

  const BADGE_COLORS = {
    Urgent:    "bg-red-100 text-red-700",
    Exam:      "bg-amber-100 text-amber-800",
    Holiday:   "bg-emerald-100 text-emerald-700",
    Event:     "bg-blue-100 text-blue-700",
    Admission: "bg-violet-100 text-violet-700",
    General:   "bg-slate-100 text-slate-600",
  };

  return (
    <>
      {/* ══════════════════════════════════════
          HERO
      ══════════════════════════════════════ */}
      <Hero />

      {/* ══════════════════════════════════════
          QUICK INFO STRIP
      ══════════════════════════════════════ */}
      <div className="bg-[#eef3f8] border-b border-[#e6edf4]">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-4 flex flex-wrap items-center gap-6 md:gap-10">
          {[
            { icon: "📍", label: "Sakhopar, Padarauna, Kushinagar, UP" },
            { icon: "📧", label: "kisansakhopar@gmail.com" },
            { icon: "🕐", label: "Mon–Sat · 9 AM – 3 PM" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <span className="text-sm">{item.icon}</span>
              <span className="text-xs text-ternary font-medium">{item.label}</span>
            </div>
          ))}
          <Link
            to="/admissions"
            className="ml-auto hidden md:inline-flex items-center gap-2 bg-primary text-white text-xs font-semibold px-5 py-2.5 hover:bg-secondary transition-colors duration-150"
          >
            Admissions Open 2026–27 →
          </Link>
        </div>
      </div>

      {/* ══════════════════════════════════════
          ABOUT SECTION
      ══════════════════════════════════════ */}
      <section className="bg-white py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="grid md:grid-cols-2 gap-16 items-center">

            {/* left — images */}
            <Up>
              <div className="relative">
                <img
                  src={imgGroup}
                  alt="Students at Kisan Inter College"
                  className="w-full h-72 md:h-96 object-cover"
                />
                <img
                  src={imgSingle}
                  alt="Student portrait"
                  className="hidden md:block absolute -bottom-8 -right-8 w-48 h-60 object-cover border-4 border-white shadow-xl"
                />
                {/* year badge */}
                <div className="absolute top-5 left-5 bg-primary text-white px-4 py-3 text-center">
                  <p className="text-2xl font-bold" style={{ fontFamily: "var(--font-heading)" }}>1948</p>
                  <p className="text-white/60 text-xs tracking-widest uppercase">Est.</p>
                </div>
              </div>
            </Up>

            {/* right — text */}
            <div className="md:pl-8">
              <Up>
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-6 h-px bg-primary" />
                  <span className="text-xs font-semibold tracking-widest uppercase text-ternary">
                    About the College
                  </span>
                </div>
                <h2
                  className="text-primary mb-6"
                  style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 700, lineHeight: 1.15 }}
                >
                  Unleashing Student
                  <br />
                  <span className="text-secondary">Possibilities Since 1948</span>
                </h2>
              </Up>

              <Up delay={80}>
                <div className="space-y-4 text-ternary text-sm leading-relaxed mb-8">
                  <p>
                    Founded in 1948, Kisan Inter College, Sakhopar has been a cornerstone of rural education
                    in Kushinagar. The name <strong className="text-primary">"Kisan"</strong> — meaning farmer —
                    reflects our deep roots in serving the local community.
                  </p>
                  <p>
                    We offer Classes VI to XII under the UP State Board with Arts and Science streams,
                    in a disciplined, inclusive environment focused on academic excellence and character development.
                  </p>
                </div>
              </Up>

              <Up delay={160}>
                <div className="grid grid-cols-3 divide-x divide-[#e6edf4] border border-[#e6edf4] mb-8">
                  {[["75+","Years"],["50,000+","Alumni"],["VI–XII","Classes"]].map(([val, lbl]) => (
                    <div key={lbl} className="px-4 py-4 text-center">
                      <p className="font-bold text-primary" style={{ fontFamily: "var(--font-heading)", fontSize: "1.4rem" }}>{val}</p>
                      <p className="text-ternary text-xs tracking-widest uppercase mt-0.5">{lbl}</p>
                    </div>
                  ))}
                </div>
              </Up>

              <Up delay={200}>
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 bg-primary hover:bg-secondary text-white font-semibold px-7 py-3.5 text-sm transition-colors duration-150"
                >
                  Learn More About Us
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </Link>
              </Up>
            </div>

          </div>
        </div>
      </section>

      <Divider />

      {/* ══════════════════════════════════════
          WHY US — 3 PILLARS
      ══════════════════════════════════════ */}
      <section className="bg-[#f5f7fa] py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6 md:px-10">

          <Up>
            <div className="text-center mb-14">
              <div className="flex items-center justify-center gap-3 mb-4">
                <span className="w-6 h-px bg-primary" />
                <span className="text-xs font-semibold tracking-widest uppercase text-ternary">Why Choose Us</span>
                <span className="w-6 h-px bg-primary" />
              </div>
              <h2
                className="text-primary"
                style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 700 }}
              >
                Built on Three Pillars
              </h2>
            </div>
          </Up>

          <div className="grid md:grid-cols-3 gap-px bg-[#e6edf4] border border-[#e6edf4]">
            {[
              {
                img: booksImg, alt: "Books",
                title: "Academic Excellence",
                body: "A rigorous UP Board curriculum that prepares students thoroughly for examinations and life beyond the classroom.",
              },
              {
                img: buildingImg, alt: "Faculty",
                title: "Experienced Faculty",
                body: "Dedicated teachers with years of experience in Hindi and English medium instruction across Arts and Science streams.",
              },
              {
                img: heartImg, alt: "Community",
                title: "Supportive Community",
                body: "A warm, inclusive campus environment rooted in Kushinagar's rural fabric — where every student feels they belong.",
              },
            ].map((p, i) => (
              <Up key={p.title} delay={i * 80}>
                <div className="bg-third p-8 md:p-10 h-full hover:bg-white transition-colors duration-150 group">
                  <div className="w-12 h-12 bg-third group-hover:bg-white flex items-center justify-center mb-4 md:mb-6 transition-colors duration-150">
                    <img src={p.img} alt={p.alt} className="w-15 h-15 object-contain" />
                  </div>
                  <h3 className="text-primary font-bold mb-3" style={{ fontFamily: "var(--font-heading)", fontSize: "1.15rem" }}>
                    {p.title}
                  </h3>
                  <p className="text-ternary text-sm leading-relaxed">{p.body}</p>
                </div>
              </Up>
            ))}
          </div>

        </div>
      </section>

      <Divider />

      {/* ══════════════════════════════════════
          NOTICES PREVIEW
      ══════════════════════════════════════ */}
      {/* <section className="bg-white py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6 md:px-10">

          <Up>
            <div className="flex items-start md:items-center justify-between gap-4 mb-12 flex-col md:flex-row">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="w-6 h-px bg-primary" />
                  <span className="text-xs font-semibold tracking-widest uppercase text-ternary">Latest Updates</span>
                </div>
                <h2 className="text-primary" style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 700 }}>
                  Notices &amp; Announcements
                </h2>
              </div>
              <Link
                to="/results"
                className="inline-flex items-center gap-2 border border-[#e6edf4] hover:border-primary text-primary text-sm font-semibold px-5 py-2.5 transition-colors duration-150 shrink-0"
              >
                View All Notices →
              </Link>
            </div>
          </Up>

          {loadingNotices ? (
            <div className="grid md:grid-cols-2 gap-4">
              {Array(4).fill(0).map((_,i) => (
                <div key={i} className="h-20 bg-[#f5f7fa] animate-pulse" />
              ))}
            </div>
          ) : notices.length === 0 ? (
            <Up>
              <div className="text-center py-16 bg-[#f5f7fa] border border-[#e6edf4]">
                <p className="text-4xl mb-3">📋</p>
                <p className="text-ternary text-sm">No notices posted yet. Check back soon.</p>
              </div>
            </Up>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {notices.map((n, i) => (
                <Up key={n.id} delay={i * 60}>
                  <div className={`flex items-start gap-4 p-5 border transition-colors duration-150 hover:bg-[#f5f7fa] ${n.is_pinned ? "border-l-4 border-l-primary border-[#e6edf4]" : "border-[#e6edf4]"}`}>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`text-xs font-semibold px-2.5 py-0.5 ${BADGE_COLORS[n.category] || "bg-slate-100 text-slate-600"}`}>
                          {n.category}
                        </span>
                        {n.is_pinned && <span className="text-xs text-primary font-semibold">📌 Pinned</span>}
                      </div>
                      <p className="text-primary font-semibold text-sm leading-snug"
                        style={{ fontFamily: "var(--font-heading)" }}>
                        {n.title}
                      </p>
                      <p className="text-ternary text-xs mt-1.5">
                        {new Date(n.issued_on).toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" })}
                      </p>
                    </div>
                    <svg className="text-ternary opacity-40 shrink-0 mt-0.5" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </div>
                </Up>
              ))}
            </div>
          )}

        </div>
      </section> */}

      <Divider />

      {/* ══════════════════════════════════════
          IMPACT STATS
      ══════════════════════════════════════ */}
      <section className="bg-primary py-20 md:py-24 relative overflow-hidden">
        {/* background texture */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{ backgroundImage:"linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)", backgroundSize:"48px 48px" }} />

        <div className="relative max-w-7xl mx-auto px-6 md:px-10">
          <Up>
            <p className="text-white/50 text-xs tracking-widest uppercase text-center mb-12">
              Our legacy in numbers
            </p>
          </Up>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0">
            {[
              ["75+",     "Years of Education"],
              ["50,000+", "Students Passed Out"],
              ["30+",     "Experienced Faculty"],
              ["1948",    "Year Established"],
            ].map(([val, lbl], i) => (
              <Up key={lbl} delay={i * 70}>
                <div className={`text-center py-8 px-4 ${i > 0 ? "border-l border-white/10" : ""}`}>
                  <p
                    className="text-white font-bold leading-none mb-2"
                    style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(2rem, 4vw, 3rem)" }}
                  >
                    {val}
                  </p>
                  <p className="text-white/50 text-xs tracking-widest uppercase">{lbl}</p>
                </div>
              </Up>
            ))}
          </div>
        </div>
      </section>

      <Divider />

      {/* ══════════════════════════════════════
          PRINCIPAL'S MESSAGE
      ══════════════════════════════════════ */}
      <section className="bg-[#f5f7fa] py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="grid md:grid-cols-2 gap-16 items-center">

            {/* dark card */}
            <Up>
              <div className="bg-primary p-10 rounded">
                <div className="w-16 h-16 rounded-full bg-amber-400/20 border border-amber-400/30  flex items-center justify-center mb-6 text-3xl">
                  👤
                </div>
                <p
                  className="text-white font-bold mb-1"
                  style={{ fontFamily: "var(--font-heading)", fontSize: "1.15rem" }}
                >
                  Shri Akhilesh Singh
                </p>
                <p className="text-amber-400 text-xs tracking-widest uppercase mb-6">Principal</p>
                <div className="border-l-2 border-amber-400 pl-4">
                  <p className="text-white/70 text-sm leading-relaxed italic">
                    "Education builds character, discipline, and confidence. Our goal is to prepare
                    students not only for examinations but for meaningful, responsible lives."
                  </p>
                </div>
              </div>
            </Up>

            {/* message text */}
            <div>
              <Up>
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-6 h-px bg-primary" />
                  <span className="text-xs font-semibold tracking-widest uppercase text-ternary">Message</span>
                </div>
                <h2
                  className="text-primary mb-6"
                  style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 700, lineHeight: 1.15 }}
                >
                  From the <span className="italic">Principal's Desk</span>
                </h2>
              </Up>
              <Up delay={80}>
                <div className="space-y-4 text-ternary text-sm leading-relaxed mb-8">
                  <p>
                    Welcome to Kisan Inter College, Sakhopar. For over seven decades, this institution
                    has been more than a school — it has been the foundation on which thousands of
                    students from Kushinagar's rural heartland have built their futures.
                  </p>
                  <p>
                    We strive to develop students who are academically strong, morally grounded, and
                    socially responsible. I invite every family to experience our campus and join the KIC family.
                  </p>
                </div>
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 border border-primary hover:scale-105 text-primary text-sm font-semibold px-6 py-3 transition-colors duration-150"
                >
                  Read Full Message →
                </Link>
              </Up>
            </div>
          </div>
        </div>
      </section>

      <Divider />

      {/* ══════════════════════════════════════
          QUICK LINKS GRID
      ══════════════════════════════════════ */}
      <section className="bg-white py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6 md:px-10">

          <Up>
            <div className="text-center mb-14">
              <div className="flex items-center justify-center gap-3 mb-4">
                <span className="w-6 h-px bg-primary" />
                <span className="text-xs font-semibold tracking-widest uppercase text-ternary">Explore</span>
                <span className="w-6 h-px bg-primary" />
              </div>
              <h2 className="text-primary" style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 700 }}>
                Everything You Need
              </h2>
            </div>
          </Up>

          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-px bg-[#e6edf4] border border-[#e6edf4]">
            {[
              { icon: "🎓", title: "Admissions",       sub: "Apply for 2026–27",         to: "/admissions" },
              { icon: "📊", title: "Results & Notices", sub: "Latest exam results",       to: "/results" },
              { icon: "📖", title: "About Us",          sub: "History & faculty",         to: "/about" },
              { icon: "📍", title: "Contact & Map",    sub: "Find us, reach us",          to: "/contact" },
            ].map((item, i) => (
              <Up key={item.title} delay={i * 60}>
                <Link
                  to={item.to}
                  className="bg-white hover:bg-[#f5f7fa] transition-colors duration-150 p-8 flex flex-col items-start gap-4 group h-full"
                >
                  <span className="text-3xl">{item.icon}</span>
                  <div>
                    <p className="text-primary font-bold text-sm mb-1" style={{ fontFamily: "var(--font-heading)" }}>
                      {item.title}
                    </p>
                    <p className="text-ternary text-xs">{item.sub}</p>
                  </div>
                  <svg className="text-ternary group-hover:text-primary transition-colors mt-auto" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </Link>
              </Up>
            ))}
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════
          BOTTOM CTA
      ══════════════════════════════════════ */}
      <section className="bg-second border-t border-gray-200/20 py-14">
        <div className="max-w-7xl mx-auto px-6 md:px-10 text-center">
          <Up>
            <h2
              className="text-primary mb-4 text-3xl md:text-4xl"
            >
              Admissions Are Open for <span className="italic text-secondary">2026 – 27</span>
            </h2>
            <p className="text-ternary text-sm mb-8 max-w-md mx-auto leading-relaxed">
              Visit the school office Monday to Saturday, 9 AM to 3 PM. No appointment needed.
              Classes VI to XII — All streams available.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/admissions"
                className="inline-flex items-center gap-2 bg-primary hover:scale-105 text-white/80 px-8 py-3.5 text-sm transition-colors duration-150"
              >
                Apply for Admission
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 border border-primary hover:scale-105 text-white/80 hover:text-secondary font-medium px-8 py-3.5 text-sm transition-colors duration-150"
              >
                Get Directions
              </Link>
            </div>
          </Up>
        </div>
      </section>

    </>
  );
};

export default Home;