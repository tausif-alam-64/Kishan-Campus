import React from 'react'

const About = () => {
  return (
    <div className='min-h-screen bg-white px-6 pt-24 pb-16'>
      <div className='max-w-5xl mx-auto'>

        {/* Page Header */}
        <div className='mb-10 text-center'>
          <h1 className='text-4xl font-bold font-heading text-primary'>
            About Kisan Intermediate Collage
          </h1>
          <p className='mt-3 text-ternary font-text'>
            Sakhopar, Kushinagar, uttar Pradesh
          </p>
        </div>

        {/* Overview Section */}
        <section className='mb-12'>
          <h2 className='text-2xl font-semibold font-text text-primary mb-4'>
            Overview
          </h2>
          <p className='text-ternary font-text leading-relaxed'>
            Kisan Inter College is a senior secondary educational institution
            located in Sakhopar village of Padarauna block, Kushinagar district,
            Uttar Pradesh. The college serves students from classes 6 to 12 and
            follows the curriculum prescribed by the Uttar Pradesh State Board.
          </p>
          <p className='mt-4 text-ternary leading-relaxed'>
            The institution is committed to providing inclusive and quality
            education to students from the surrounding rural and semi-urban
            areas, with a focus on academic learning as well as practical
            exposure.
          </p>
        </section>

        {/* Key Facts */}
        <section className='mb-12'>
          <h2 className='text-2xl font-semibold font-text text-primary mb-4'>
            Key Facts
          </h2>

          <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
            <div className='border rounded-lg p-5'>
              <p className='font-medium text-primary'>
                School Type
              </p>
              <p className='text-ternary mt-1'>
                Senior Secondary (Classes 6-12), Co-educational
              </p>
            </div>

            <div className='border rounded-lg p-5'>
              <p className='font-medium text-primary'>
                Affiliation
              </p>
              <p className='text-ternary mt-1'>
                Department of Secondary Education,
                Government of Uttar Pradesh
              </p>
            </div>

            <div className='border rounded-lg p-5'>
              <p className='font-medium text-primary'>
                UDISE Code
              </p>
              <p className='text-ternary mt-1'>
                09590100202
              </p>
            </div>
            <div className="border rounded-lg p-5">
              <p className="font-medium text-gray-900">Address</p>
              <p className="text-gray-600 mt-1">
                Sakhopar, Padarauna Block,
                Kushinagar, Uttar Pradesh – 274402
              </p>
            </div>
          </div>
        </section>

        {/* History */}
        <section className='mb-12'>
          <h2 className='text-2xl font-semibold text-primary mb-4'>
            History
          </h2>
          <p className='text-ternary leading-relaxed'>
            Kisan Inter College was established in the mid-20th century.
            the official founding year will be updated after confirmation
            from school records.
          </p>
          <p className='mt-4 text-ternary leading-relaxed'>
            Over the decades, the college has played an important role in
            promoting education in the Padarauna–Sakhopar region and has
            contributed to the academic development of thousands of students.
          </p>
        </section>

        {/* Facilities */}
        <section className='mb-12'>
          <h2 className='text-2xl font-semibold text-primary mb-4'>
            Facilities & Initiatives
          </h2>

          <ul className='list-disc pl-6 text-gray-700 space-y-2'>
            <li>Atal Tinkering Lab (ATL) for innovation and STEM learning</li>
            <li>Library and subject-specific laboratories</li>
            <li>Sports and physical education facilities</li>
            <li>Active participation in academic and cultural events</li>
          </ul>
        </section>

        {/* Media & Activities */}
        <section className=''>
          <h2 className='text-2xl font-semibold text-primary mb-4'>
            Media & Activities
          </h2>
          <p className='text-ternary leading-relaxed'>
            The college maintains an active presence on digital platforms,
            including YouTube, where various school events, activities,
            and student projects are showcased. These platforms help in
            sharing the institution’s academic and co-curricular journey
            with the wider community.
          </p>
        </section>
      </div>
    </div>
  )
}

export default About
