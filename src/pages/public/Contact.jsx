import React, { useState } from "react";
import { submitWeb3Form } from "../../services/api/web3Forms";

const Contact = () => {
  const [status, setStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    const result = await submitWeb3Form(formData);
    if (result.success) {
      setStatus("success");
      e.target.reset();
    } else {
      setStatus("error");
    }
  };
  return (
    <section className="w-full min-h-screen bg-gray-50 pt-28 pb-20">
      <div className="max-w-4xl mx-auto px-6 max-sm:px-4">
        <h1 className="text-4xl font-bold text-(--primary) text-center">
          Contact Us
        </h1>
        <p className="text-(--ternary) text-center mt-3 max-w-xl mx-auto">
          Have questions about admissions, results, or support? Send us a
          message and we will respond soon.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-10 bg-white shadow-md rounded-xl p-8 grid gap-6 max-sm:gap-5"
        >
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

          <div>
            <label className="block mb-1 font-semibold text-(--secondary)">
              Full Name
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 border rounded-lg focus:ring focus:ring-blue-200 focus:outline-none"
              required
              name="name"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block mb-1 font-semibold text-(--secondary)"
            >
              Email
            </label>
            <input
              className="w-full px-4 py-3 border rounded-lg focus:ring focus:ring-blue-200 focus:outline-none"
              type="email"
              name="email"
              required
              placeholder="example@gmail.com"
            />
          </div>

          <div>
            <label
              htmlFor="message"
              className="block mb-1 font-semibold text-(--secondary)"
            >
              Message
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 border rounded-lg focus:ring focus:ring-blue-200 focus:outline-none"
              name="message"
              placeholder="Write your message here..."
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-(--secondary) hover:bg-(--primary) text-white py-3 rounded-lg font-semibold"
          >
            Send Message
          </button>
        </form>
      </div>
    </section>
  );
};

export default Contact;
