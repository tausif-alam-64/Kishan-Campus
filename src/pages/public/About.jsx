import React from 'react'
import aboutHeroImg from "../../assets/aboutImg-1.avif"
import Header from '../../component/common/Header';

const About = () => {
  return (
    <main className="bg-white">

      <Header mainImg={aboutHeroImg} heading={"ABOUT"} subHeading={"About our school"}/>

      {/* ================= MAIN CONTENT ================= */}
      <section className="pt-24 pb-32">
        <div className="max-w-5xl mx-auto px-6">

          <div className="space-y-8 text-lg leading-relaxed text-[#4b647a]">

            <p>
              <strong>Kisan Inter College, Sakhopar</strong> is a long-established
              senior secondary educational institution located in the rural
              region of Padarauna block, Kushinagar district, Uttar Pradesh.
              Operating under the Uttar Pradesh State Board and affiliated with
              the Department of Secondary Education, Government of Uttar Pradesh,
              the institution has been serving generations of students through
              quality secondary and senior secondary education.
            </p>

            <p>
              Established in <strong>1948</strong> (year to be officially
              confirmed from school records), the college has grown from a
              modest rural school into a respected inter college offering
              education from <strong>Class VI to Class XII</strong>. Over the
              decades, the institution has remained committed to academic
              discipline, character building, and inclusive education for
              students from diverse backgrounds.
            </p>

            <p>
              Kisan Inter College follows the <strong>UP Board curriculum</strong>
              and offers senior secondary education in streams such as
              <strong> Arts, Science, and Commerce</strong> (subject combinations
              to be confirmed). The medium of instruction generally includes
              both Hindi and English, aligning with state education norms.
            </p>

            <p>
              The school operates on a permanent campus equipped with classrooms,
              basic infrastructure, and learning facilities. A major milestone
              in the institution’s academic journey is the establishment of an
              <strong> Atal Tinkering Lab (ATL)</strong>, which encourages
              innovation, hands-on learning, and scientific curiosity among
              students, especially in rural areas.
            </p>

            <p>
              Admissions are currently conducted through offline mode at the
              school office, following Uttar Pradesh State Board guidelines.
              Required documentation typically includes previous academic
              records, transfer certificate, date of birth proof, and other
              government-mandated documents.
            </p>

            <p>
              With its strong foundation, government affiliation, and emphasis
              on innovation through ATL initiatives, Kisan Inter College,
              Sakhopar continues to play a vital role in empowering rural
              education in the Kushinagar region.
            </p>

          </div>

        </div>
      </section>
       
    </main>
    
  );
};

export default About;