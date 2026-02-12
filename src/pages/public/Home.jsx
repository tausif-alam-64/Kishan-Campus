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

      <section className="bg-white py-12 sm:py-16 md:pt-60">
        <div className="max-w-7xl mx-auto px-4 md:px-6 relative">
          <div className="grid grid-cols-1 lg:grid-cols-[70%_30%] md:gap-20 items-centre">
            {/* ================= LEFT: IMAGES + TITLE ================= */}
            <div className="relative">
              {/* Title Card */}
              <div
                className="bg-primary text-white
                     px-6 py-6 mb-6
                     md:absolute md:-top-28 md:left-0 md:z-30
                     md:px-26 md:py-14 md:mb-0"
              >
                <p className="text-xs tracking-[0.2em] uppercase mb-4 md:text-sm md:tracking-[0.3em] md:mb-6">
                  About
                </p>
                <h2 className="text-2xl font-serif leading-tight md:text-3xl md:text-5xl">
                  Unleash students
                  <br />
                  possibilities with us
                </h2>
              </div>

              {/* Images */}
              <div className="relative md:pt-0 overflow-hidden">
                {/* Back image */}
                <img
                  src={imgGroup}
                  alt="Student portrait"
                  className="w-full h-64 object-cover mb-4
                             md:w-[48%] md:h-full md:my-6 md:py-2 md:ml-auto md:mb-0"
                />

                {/* Front image */}
                <img
                  src={imgSingle}
                  alt="Students walking together"
                  className="w-full h-64 object-cover object-top
                             md:w-[40%] md:-mt-78 md:ml-20 md:h-full"
                />
              </div>
            </div>

            {/*RIGHT: CONTENT */}
            <div className="relative pt-8 md:pt-0">
              <img
                src={design}
                alt=""
                className="hidden md:block -mt-37 ml-12 scale-110"
              />
              <p className="text-base leading-relaxed text-[#4b647a] max-w-md md:text-xl md:mt-8">
                Empowering students through quality education, discipline, and
                innovation, we create a supportive learning environment that
                helps young minds grow, explore opportunities, and build a
                strong foundation for the future.
              </p>

              <Link
                to="/about"
                className="inline-flex items-center text-base tracking-wide gap-2 mt-6
                     font-semibold text-primary
                     border-b-2 border-primary pb-1
                     hover:opacity-80 transition
                     md:text-lg md:tracking-widest md:gap-3 md:mt-8 md:mt-10"
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

      <section className="bg-[#eef3f8] py-12 px-4 md:py-15 md:px-4">
        <div className="flex flex-col gap-8 md:flex-row md:gap-10 md:gap-12 md:px-20 md:py-10">
          <div className="flex flex-col gap-5">
            <div className="w-16 h-16 md:w-auto md:h-auto">
              <img src={booksImg} className="w-full h-full object-contain md:w-auto md:h-auto" />
            </div>
            <div className="flex flex-col gap-2">
              <h2 className="text-xl font-semibold text-primary md:text-3xl">
                Academic Excellence
              </h2>
              <p className="tracking-wide text-[#4b647a] text-sm md:text-base">
                Our rigorous curriculum ensures students are well-prepared for
                college and life beyond.
              </p>
            </div>
          </div>
          
          <div className="flex flex-col gap-5">
            <div className="w-16 h-16 md:w-auto md:h-auto">
              <img src={buildingImg} alt="" className="w-full h-full object-contain md:w-auto md:h-auto" />
            </div>
            <div className="flex flex-col gap-2">
              <h2 className="text-xl font-semibold text-primary md:text-3xl">
                Experienced Faculty
              </h2>
              <p className="tracking-wide text-[#4b647a] text-sm md:text-base">
                Our dedicated teachers are passionate about education and
                student success.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <div className="w-16 h-16 md:w-auto md:h-auto">
              <img src={heartImg} alt="" className="w-full h-full object-contain md:w-auto md:h-auto" />
            </div>
            <div className="flex flex-col gap-2">
              <h2 className="text-xl font-semibold text-primary md:text-3xl">
                Supportive Community
              </h2>
              <p className="tracking-wide text-[#4b647a] text-sm md:text-base">
                We foster a strong sense of community and belonging for all
                students on board.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="bg-white py-10 px-4 text-center">
        <h2 className="text-xl font-bold text-primary md:text-2xl">
          Notices & Announcements
        </h2>
        <p className="mt-2 text-sm text-gray-500 md:text-base">Coming Soon...</p>
      </div>
    </>
  );
};

export default Home;