import React from "react";

const Footer = () => {
  return (
    <footer className="bg-primary text-gray-300 mt-20 font-text">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <h3 className="text-xl font-semibold text-white">
              Kisan Inter Collage
            </h3>
            <p className="mt-3 text-sm leading-relaxed">
              Senior Secondary School (Classes 6–12) affiliated to the
              Department of Secondary Education, Government of Uttar Pradesh.
            </p>

            <p className="mt-3 text-sm">
              <span className="font-medium text-gray-200">UDISE Code:</span>{" "}
              09590100202
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white"> Quick Links</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <a href="/about" className="hover:text-white">
                  About School
                </a>
              </li>
              <li>
                <a href="/academics" className="hover:text-white">
                  Academics
                </a>
              </li>
              <li>
                <a href="/admissions" className="hover:text-white">
                  Admissions
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:text-white">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Facilities */}
          <div>
            <h4 className="text-lg font-semibold text-white">Facilities</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li>Atal Tinkering Lab (ATL)</li>
              <li>Science & Computer Labs</li>
              <li>Library & Sports Facilities</li>
              <li>Co-curricular Activities</li>
            </ul>
          </div>

          {/* Contact */}

          <div>
            <h4 className="text-lg font-semibold text-white">Contact</h4>

            <p className="mt-4 text-sm leading-relaxed">
              Sakhopar, Padarauna Block
              <br />
              Kushinagar District
              <br />
              Uttar Pradesh – 274402
            </p>

            <p className="mt-3 text-sm">
              <span className="font-medium text-gray-200">Email:</span> <br />
              kisansakhopar@gmail.com
            </p>
          </div>
        </div>

        {/* Devider */}
        <div className="border-t border-gray-700 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-400  text-center md:text-left">
            © {new Date().getFullYear()} Kisan Inter College, Sakhopar.  
            All rights reserved.
          </p>
          <p className="text-sm text-gray-400 text-center">
            Built with ❤️ by students & contributors
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
