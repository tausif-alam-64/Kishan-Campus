import React from "react";
import aboutHeroImg from "../../assets/aboutImg-1.avif";
import Header from "../../component/common/Header";

const About = () => {
  return (
    <main className="bg-white text-ternary">

      <Header
        mainImg={aboutHeroImg}
        heading={"ABOUT"}
        subHeading={"About Our School"}
      />

      {/* ================= INTRO ================= */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-4xl text-secondary font-semibold mb-6">
            Our Legacy of Excellence
          </h2>

          <p className="text-lg leading-relaxed max-w-4xl mx-auto text-ternary">
            Kisan Inter College, Sakhopar is a senior secondary institution
            located in Padarauna Block, Kushinagar District, Uttar Pradesh.
            Affiliated with the Uttar Pradesh State Board and governed by the
            Department of Secondary Education, the college has nurtured
            generations of students with discipline, values, and academic
            commitment since 1948.
          </p>
        </div>
      </section>

      {/* ================= HIGHLIGHT STATS ================= */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-4 gap-8 text-center">
          <div className="bg-white shadow-md p-8 rounded-xl">
            <h3 className="text-3xl font-bold text-secondary">1948</h3>
            <p className="mt-2 text-gray-600">Established</p>
          </div>
          <div className="bg-white shadow-md p-8 rounded-xl">
            <h3 className="text-3xl font-bold text-secondary">VI - XII</h3>
            <p className="mt-2 text-gray-600">Classes Offered</p>
          </div>
          <div className="bg-white shadow-md p-8 rounded-xl">
            <h3 className="text-3xl font-bold text-secondary">UP Board</h3>
            <p className="mt-2 text-gray-600">Affiliation</p>
          </div>
          <div className="bg-white shadow-md p-8 rounded-xl">
            <h3 className="text-3xl font-bold text-secondary">ATL Lab</h3>
            <p className="mt-2 text-gray-600">Innovation Facility</p>
          </div>
        </div>
      </section>

      {/* ================= ACADEMICS ================= */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl text-primary  text-center mb-14">
            Academic Streams
          </h2>

          <div className="grid md:grid-cols-3 gap-10">

            <div className="bg-white border border-gray-200 p-8 rounded-lg shadow-sm hover:shadow-md transition">
              <h3 className="text-2xl text-primary mb-4 ">Arts</h3>
              <p className="text-ternary">
                A comprehensive humanities program focused on social sciences,
                languages, and civic development.
              </p>
            </div>

            <div className="bg-white border border-gray-200 p-8 rounded-lg shadow-sm hover:shadow-md transition">
              <h3 className="text-2xl text-primary mb-4">Science</h3>
              <p className="text-ternary">
                Strong academic foundation in Physics, Chemistry, Biology,
                and Mathematics with practical learning.
              </p>
            </div>

            <div className="bg-white border border-gray-200 p-8 rounded-lg shadow-sm hover:shadow-md transition">
              <h3 className="text-2xl text-primary mb-4">Commerce</h3>
              <p className="text-ternary">
                Focused curriculum in accounting, economics, and business
                principles for future professionals.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ================= FACILITIES & ADMISSION ================= */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16">

          <div>
            <h2 className="text-4xl text-primary  mb-6">
              Facilities & Innovation
            </h2>
            <p className="leading-relaxed mb-6 ">
              The permanent campus includes structured classrooms, essential
              infrastructure, and supportive learning facilities.
            </p>

            <p className="leading-relaxed">
              The establishment of the <strong>Atal Tinkering Lab (ATL)</strong>
              marks a major step in promoting scientific curiosity and hands-on
              innovation among rural students.
            </p>
          </div>

          <div className="bg-secondary text-white p-10 rounded-lg shadow-lg">
            <h3 className="text-2xl mb-6 font-semibold">
              Admission Process
            </h3>

            <p className="mb-6 opacity-90">
              Admissions are conducted offline at the school office following
              Uttar Pradesh State Board guidelines.
            </p>

            <ul className="space-y-3 list-disc list-inside opacity-90">
              <li>Previous Academic Records</li>
              <li>Transfer Certificate</li>
              <li>Date of Birth Proof</li>
              <li>Required Government Documents</li>
            </ul>
          </div>

        </div>
      </section>

    </main>
  );
};

export default About;