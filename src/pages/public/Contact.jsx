import React, { useState } from "react";
import { submitWeb3Form } from "../../services/api/web3Forms";
import Header from "../../component/common/Header";
import contactImg from "../../assets/contact.avif";
import { TfiEmail } from "react-icons/tfi";
import { FiPhone } from "react-icons/fi";

const Contact = () => {
  const [status, setStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    const result = await submitWeb3Form(formData);
    console.log(result)
    if (result?.success) {
      setStatus("success");
      e.target.reset();
    } else {
      setStatus("error");
    }
  };
  return (
    <main>
      {/* Header */}
      <section>
        <Header
          mainImg={contactImg}
          heading={"contact"}
          subHeading={"Keep in touch with us"}
        />
      </section>
      
      <section className="bg-white pt-18 md:pt-28 pb-32">
        <div className="max-w-7xl mx-auto max-sm:px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-1 items-start">
            {/* Left : Contect Form */}
            <div className="pb-10">
              <h1 className="text-3xl md:text-5xl text-primary tracking-wide font-semibold">
                Send Us A Message
              </h1>
              <form onSubmit={handleSubmit} className="mt-16 space-y-10">
                {status === "success" && (
                  <p className="p-3 bg-green-100 text-green-700 rounded-lg text-center">
                    Message Sent Successfully!
                  </p>
                )}

                {status === "error" && (
                  <p className="p-3 bg-red-100 text-red-700 rounded-lg text-center">
                    Somthing went wrong. Try again.
                  </p>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <input
                  type="text"
                  className="w-full border-b border-primary pb-3 text-lg placeholder:text-ternary focus:outline-none focus:border-black"
                  required
                  name="name"
                  placeholder="Enter your name"
                />

                <input
                  type="tel"
                  name="number"
                  placeholder="Enter your phone number"
                  className="w-full border-b border-primary pb-3 text-lg placeholder:text-ternary focus:outline-none focus:border-black"
                />
                </div>

                <input
                  type="email"
                  className="w-full border-b border-primary pb-3 text-lg placeholder:text-ternary focus:outline-none focus:border-black"
                  name="email"
                  placeholder="Enter your email"
                  required
                />
                <textarea name="message" rows="5" required placeholder="Write your message" className="w-full border-b border-primary pb-3 text-lg placeholder:text-ternary focus:outline-none focus:border-black"></textarea>

                <button type="submit" className="bg-primary text-white px-14 py-4 font-semibold tracking-wide hover:opacity-90 transition">
                  Send Message
                </button>
              </form>
            </div>
            {/* Right : Information Card */}
            <aside className=" md:p-18 md:ml-8">
              <div className="p-6 md:p-10 bg-[#eef3f8]">
                <h2 className="text-4xl font-semibold text-primary">Our Information</h2>

              <div className="mt-8 space-y-5 text-lg text-[#4b647a]">
                <p className="tracking-wider ">
                  Kisan Inter College
                  Sakhopar, Kushinagar
                  Uttar Pradesh 274402
                  India
                </p>
                <p className="flex items-center gap-3 tracking-wide md:tracking-widest ">
                  <TfiEmail className="text-primary max-sm:hidden inline" size={20}/>
                  kisansakhopar@gmail.com
                </p>
                <p className="flex items-center gap-3 tracking-widest">
                <FiPhone className="text-primary max-sm:hidden inline " size={20}/>
                  To be confirmed
              </p>
              </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Contact;
