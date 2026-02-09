import Hero from "../../component/common/Hero";
import imgGroup from "../../assets/about-2.avif";
import imgSingle from "../../assets/about-3.avif";
import design from "../../assets/design.png";
import { Link } from "react-router-dom";
import { FaArrowRight, FaArrowUp } from "react-icons/fa";
import { MdOutlineArrowOutward } from "react-icons/md";
import booksImg from "../../assets/books.svg";
import buildingImg from "../../assets/building.svg";
import heartImg from "../../assets/heart.svg";

const Home = () => {
  return (
    <>
      <Hero />

      {/* Placeholder sections - will fill later */}
      {/* <section className="py-16 text-center text-ternary">
        <h2 className="text-2xl font-bold text-primary">About Our School</h2>
        <p className="max-w-2xl mx-auto mt-4 font-text">
          Kishan Campus Intermediate College is committed to providing quality education
          & empowering rural students through technology & modern learning systems.
        </p>
      </section> */}
      <section className="bg-white py-20 md:pt-60">
        <div className="max-w-7xl mx-auto px-4 md:px-6 relative">
          <div className="grid grid-cols-1 lg:grid-cols-[70%_30%]  md:gap-20 items-centre">
            {/* ================= LEFT: IMAGES + TITLE ================= */}
            <div className="relative">
              {/* Title Card */}
              <div
                className="absolute md:-top-28 md:left-0 z-30
                     bg-primary text-white
                     px-8 md:px-26 py-8 md:py-14"
              >
                <p className="text-sm tracking-[0.3em] uppercase mb-6">About</p>
                <h2 className="text-3xl md:text-5xl font-serif leading-tight">
                  Unleash students
                  <br />
                  possibilities with us
                </h2>
              </div>

              {/* Images */}
              <div className="relative pt-55 md:pt-0 overflow-hidden">
                {/* Back image */}
                <img
                  src={imgGroup}
                  alt="Student portrait"
                  className="md:w-[48%] w-full h-65 md:h-full py-6 md:py-2 ml-auto object-cover "
                />

                {/* Front image */}
                <img
                  src={imgSingle}
                  alt="Students walking together"
                  className="md:w-[40%] w-full md:-mt-78 md:ml-20 h-55 md:h-full object-cover"
                />
              </div>
            </div>

            {/*RIGHT: CONTENT */}
            <div className="relative pt-8 md:pt-0">
              <img
                src={design}
                alt=""
                className="hidden md:block -mt-37  ml-12 scale-110"
              />
              <p className="text-xl md:mt-8 leading-relaxed text-[#4b647a] max-w-md ">
                Empowering students through quality education, discipline, and
                innovation, we create a supportive learning environment that
                helps young minds grow, explore opportunities, and build a
                strong foundation for the future.
              </p>

              <Link
                to="/about"
                className="inline-flex items-center text-lg tracking-widest gap-2 md:gap-3 mt-8 md:mt-10
                     font-semibold text-primary
                     border-b-2 border-primary pb-1
                     hover:opacity-80 transition "
              >
                Learn More
                <span className="">
                  <MdOutlineArrowOutward size={20} />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#eef3f8] py-15 px-4">
        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-5">
            <div className="">
              <img src={booksImg} className="" />
            </div>
            <div className="flex flex-col gap-2">
              <h2 className="text-3xl font-semibold text-primary">Academic Excellence</h2>
              <p className="tracking-wide text-[#4b647a]">
                Our rigorous curriculum ensures students are well-prepared for
                college and life beyond.
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-5">
            <div>
              <img src={buildingImg} alt="" />
            </div>
            <div className="flex flex-col gap-2">
              <h2 className="text-3xl font-semibold text-primary">Experienced Faculty</h2>
              <p className="tracking-wide text-[#4b647a]">
                Our dedicated teachers are passionate about education and
                student success.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <div>
              <img src={heartImg} alt="" />
            </div>
            <div className="flex flex-col gap-2">
              <h2 className="text-3xl font-semibold text-primary">Supportive Community</h2>
              <p className="tracking-wide text-[#4b647a]">
                We foster a strong sense of community and belonging for all
                students on board.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="bg-white py-10 text-center">
        <h2 className="text-2xl font-bold text-primary">
          Notices & Announcements
        </h2>
        <p className="mt-2 text-gray-500">Coming Soon...</p>
      </div>
    </>
  );
};

export default Home;
