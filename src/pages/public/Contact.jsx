import React, { useCallback, useState } from "react";
import { submitWeb3Form } from "../../services/api/web3Forms";
import Header from "../../component/common/Header";
import contactImg from "../../assets/contact.avif";
import qnaImg from "../../assets/qna.avif"
import { TfiEmail } from "react-icons/tfi";
import { FiPhone } from "react-icons/fi";
import { FaArrowUp } from "react-icons/fa";

const FAQS = [
  {
    id: 1,
    question: "What is the enrollment process?",
    answer:
      "Admissions are conducted offline at the school office following UP Board guidelines.",
  },
  {
    id: 2,
    question: "How can I contact teachers directly?",
    answer:
      "Teachers can be contacted through the school office during working hours.",
  },
  {
    id: 3,
    question: "How can I schedule a campus tour?",
    answer:
      "Campus visits can be scheduled by visiting or calling the school office.",
  },
  {
    id: 4,
    question: "What are the school hours?",
    answer: "The school operates approximately six hours per day.",
  },
  {
    id: 5,
    question: "Is there a dress code?",
    answer: "Yes, a prescribed uniform is mandatory for all students.",
  },
];

const Contact = () => {
  const [status, setStatus] = useState(null);
  const [openId, setOpenId] = useState(FAQS[2].id);

  const handleToggle = useCallback((id) => {
    setOpenId((prev) => (prev === id ? null : id));
  }, []);


  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    const result = await submitWeb3Form(formData);
    console.log(result);
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
                <textarea
                  name="message"
                  rows="5"
                  required
                  placeholder="Write your message"
                  className="w-full border-b border-primary pb-3 text-lg placeholder:text-ternary focus:outline-none focus:border-black"
                ></textarea>

                <button
                  type="submit"
                  className="bg-primary text-white px-14 py-4 font-semibold tracking-wide hover:opacity-90 transition"
                >
                  Send Message
                </button>
              </form>
            </div>
            {/* Right : Information Card */}
            <aside className=" md:p-18 md:ml-8">
              <div className="p-6 md:p-10 bg-[#eef3f8]">
                <h2 className="text-4xl font-semibold text-primary">
                  Our Information
                </h2>

                <div className="mt-8 space-y-5 text-lg text-[#4b647a]">
                  <p className="tracking-wider ">
                    Kisan Inter College Sakhopar, Kushinagar Uttar Pradesh
                    274402 India
                  </p>
                  <p className="flex items-center gap-3 tracking-wide md:tracking-widest ">
                    <TfiEmail
                      className="text-primary max-sm:hidden inline"
                      size={20}
                    />
                    kisansakhopar@gmail.com
                  </p>
                  <p className="flex items-center gap-3 tracking-widest">
                    <FiPhone
                      className="text-primary max-sm:hidden inline "
                      size={20}
                    />
                    To be confirmed
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
      <section>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1018.9596366241162!2d83.9257671549005!3d26.808888297344982!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3993ed2a027689af%3A0xdec20d9cc44b1bcc!2sKIC%20Sakhopar%20(NavneetPandeyIPS)!5e1!3m2!1sen!2sin!4v1770394383160!5m2!1sen!2sin"
          className="w-full h-100 md:h-150 border-0"
        ></iframe>
      </section>
       <section className="bg-white py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-2">
        
        {/* LEFT */}
        <div>
          <p className="tracking-widest uppercase text-primary">
            FAQ
          </p>

          <h2 className="mt-4 text-4xl md:text-5xl  text-primary">
            Answers for <br /> your questions
          </h2>

          <div className="mt-10 md:mt-16 bg-[#eef3f8]">
  {FAQS.map(({ id, question, answer }) => {
    const isOpen = id === openId;

    return (
      <button
        key={id}
        type="button"
        onClick={() => handleToggle(id)}
        aria-expanded={isOpen}
        className={`
          group w-full text-left px-7 py-8
          border-b border-[#d5dee7]
          transition-all duration-300
          ${isOpen
            ? "border border-[#15283d] border-l-4 bg-transparent"
            : "hover:bg-[#e6edf4]"
          }
        `}
      >
        <div className="flex items-center justify-between gap-1">
          <h2 className="text-2xl md:text-3xl text-primary">
            {question}
          </h2>

          <span
            aria-hidden
            className={`
              text-xl md:text-3xl text-[#15283d]
              transition-transform duration-300
              ${isOpen ? "rotate-120" : "-rotate-60"}
            `}
          >
            <FaArrowUp />
          </span>
        </div>

        {isOpen && (
          <p className="mt-3 md:mt-5 max-w-xl text-[#4b647a] leading-relaxed">
            {answer}
          </p>
        )}
      </button>
    );
  })}
</div>

        </div>

        {/* RIGHT IMAGE */}
        <div className="hidden lg:block h-full relative">
          <img
            src={qnaImg}
            alt="Teacher assisting student"
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      </div>
    </section>
    </main>
  );
};

export default Contact;
