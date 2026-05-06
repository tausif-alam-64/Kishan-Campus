// import { Link } from "react-router-dom";
// import heroimg from "../../assets/heroimg.avif";

// const Hero = () => {
//   return (
//     <section className="relative bg-third overflow-hidden">

//       {/* ── subtle grid texture ── */}
//       <div
//         className="absolute inset-0 pointer-events-none opacity-[0.04]"
//         style={{
//           backgroundImage:
//             "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
//           backgroundSize: "48px 48px",
//         }}
//       />

//       {/* ── top amber rule ── */}
//       <div className="h-[3px] w-full bg-gradient-to-r from-transparent via-[#213b5b] to-transparent" />

//       <div className="max-w-7xl mx-auto px-6 md:px-10">
//         <div className="grid md:grid-cols-2 gap-0 min-h-[92vh] items-center">

//           {/* ─── LEFT ─── */}
//           <div className="py-20 md:py-0 pr-0 md:pr-16 ab-hero" style={{ animationDelay: "0.06s" }}>

//             {/* eyebrow */}
//             <div className="flex items-center gap-3 mb-7">
//               <span className="w-8 h-px bg-primary" />
//               <span
//                 className="text-primary font-semibold tracking-widest uppercase"
//                 style={{ fontSize: "0.68rem" }}
//               >
//                 Government-Aided · UP Board · Est. 1948
//               </span>
//             </div>

//             {/* headline */}
//             <h1
//               className="text-primary leading-[1.06] mb-7"
//               style={{
//                 fontFamily: "var(--font-heading)",
//                 fontSize: "clamp(2.4rem, 6vw, 4.2rem)",
//                 fontWeight: 700,
//               }}
//             >
//               Build Your Future
//               <br />
//               <span
//                 className="text-secondary"
//               >
//                 Right Here.
//               </span>
//             </h1>

//             {/* sub */}
//             <p
//               className="text-ternary leading-relaxed mb-10 max-w-md"
//               style={{ fontSize: "clamp(0.95rem, 2vw, 1.1rem)" }}
//             >
//               Kisan Inter College, Sakhopar — serving Kushinagar's students
//               since 1948. Classes VI to XII, Arts &amp; Science, UP Board affiliated.
//             </p>

//             {/* CTAs */}
//             <div className="flex flex-wrap gap-4 mb-14">
//               <Link
//                 to="/admissions"
//                 className="inline-flex items-center gap-2 bg-primary hover:bg-[#1c3a5f] text-white  px-7 py-3.5  transition-colors duration-150"
//               >
//                 Apply for Admission
//                 <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
//               </Link>
//               <Link
//                 to="/contact"
//                 className="inline-flex items-center gap-2 border border-[#213b5b] hover:border-[#1b416e] text-primary hover:text-secondary font-medium px-7 py-3.5 transition-colors duration-150"
//               >
//                 Contact Us
//               </Link>
//             </div>

//             {/* stats row */}
//             <div className="grid grid-flow-col auto-cols-fr border-t border-white/10 pt-8">
//   {[
//     ["VI–XII", "Classes"],
//     ["2000+", "Students"],
//     ["3", "Streams"],
//   ].map(([val, lbl], i) => (
//     <div
//       key={lbl}
//       className={i > 0 ? "pl-5 border-l border-white/10" : ""}
//     >
//       <p
//         className="font-bold text-primary leading-none mb-3"
//         style={{ fontFamily: "var(--font-heading)", fontSize: "1.55rem" }}
//       >
//         {val}
//       </p>

//       <p
//         className="text-ternary tracking-widest uppercase"
//         style={{ fontSize: "0.6rem" }}
//       >
//         {lbl}
//       </p>
//     </div>
//   ))}
// </div>
//           </div>

//           {/* ─── RIGHT — image ─── */}
//           <div
//             className="hidden md:block h-full min-h-[92vh] relative ab-hero"
//             style={{ animationDelay: "0.18s" }}
//           >
//             {/* vertical rule */}
//             <div className="absolute left-0 top-0 h-full w-px bg-white/8" />

//             <img
//               src={heroimg}
//               alt="Kisan Inter College students"
//               className="w-full h-full object-cover object-center"
//               style={{ filter: "brightness(0.7) saturate(0.85)" }}
//             />

//             {/* overlay gradient */}
//             <div className="absolute inset-0 bg-gradient-to-r from-primary/60 via-transparent to-transparent" />
//             <div className="absolute inset-0 bg-gradient-to-t from-primary/40 via-transparent to-transparent" />

//             {/* school name badge */}
//             <div className="absolute bottom-8 left-8 right-8">
//               <div className="bg-primary/80 backdrop-blur border border-white/10 px-5 py-4 rounded-xl shadow-2xl">
//                 <p className="text-white/80 text-sm tracking-widest uppercase mb-0.5">Official Portal</p>
//                 <p className="text-white font-semibold" style={{ fontFamily: "var(--font-heading)", fontSize: "1rem" }}>
//                   Kisan Inter College, Sakhopar
//                 </p>
//                 <p className="text-white/50 text-xs">Padarauna, Kushinagar, UP – 274402</p>
//               </div>
//             </div>
//           </div>

//         </div>
//       </div>

//       {/* mobile image strip */}
//       <div className="md:hidden h-52 overflow-hidden relative">
//         <img src={heroimg} alt="" className="w-full h-full object-cover" style={{ filter: "brightness(0.65)" }} />
//         <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/40 to-transparent" />
//       </div>

//     </section>
//   );
// };

// export default Hero;



import { Link } from 'react-router-dom';
import heroimg from '../../assets/heroimg.avif';

const Hero = () => {
  return (
    <section className='flex flex-col gap-16'>

      <div className='flex flex-col md:flex-row max-w-7xl gap-10 md:gap-34 mx-auto pt-16 px-6 md:px-1'>

        {/* Left Text - Animation */}
        <div 
          className='flex-1 ab-hero'
          style={{ animationDelay: "0.06s" }}
        >
          <h1 className='text-4xl md:text-7xl text-primary leading-[1.06]'>
             Build Your Future
             <br />
              <span
                className="text-secondary"
                
              >
                Right Here.
              </span>
          </h1>
        </div>

        {/* Right Text + Button - Animation */}
        <div 
          className='flex-1 ab-hero'
          style={{ animationDelay: "0.18s" }}
        >
          <p className='text-base md:text-2xl text-ternary pb-6'>
            Explore top online courses and industry-ready degrees from leading institutions across India.
Learn anytime, anywhere and build real-world skills that shape your future 🚀
          </p>

          <Link 
            to="/courses" 
            className="inline-flex items-center gap-2 px-8 md:px-12 py-3 bg-primary text-white font-semibold transition-colors duration-300 hover:opacity-90"
          >
            Explore Courses
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </Link>
        </div>

      </div>

      {/* Image Section - Animation */}
      <div 
        className='max-md:h-[35vh] overflow-hidden ab-hero'
        style={{ animationDelay: "0.3s" }}
      >
        <img 
          src={heroimg} 
          alt="Kisan Intermediate College Hero" 
          className='w-full h-full object-cover'
        />
      </div>

    </section>
  );
};

export default Hero;