import React, { useState } from 'react'
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
    const [data , setData] = useState({
        email: ""
    })
    const valideValue = Object.values(data).every((el) => el);
  return (
    <section className="w-full container mx-auto px-2">
      <div className="bg-white my-4 w-full max-w-lg mx-auto rounded p-8">
        <p className="font-semibold text-lg ">Forgot Password</p>
        <form action="" className="grid gap-3 py-4">
          <div className="grid gap-1">
            <label htmlFor="email">Email :</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              className="w-full px-4 py-3 border rounded-lg"
              name="email"
            />
          </div>
          <button
            disabled={!valideValue}
            className={`${
              valideValue ? "bg-green-800 hover:bg-green-700" : "bg-gray-500"
            } text-white py-2 rounded font-semibold my-3 tracking-wide`}
          >
            Send Otp
          </button>
        </form>
        <p>
          Already have account ?{" "}
          <Link
            to={"/login"}
            className="font-semibold text-green-700 hover:text-green-800"
          >
            Login
          </Link>
        </p>
      </div>
    </section>
  )
}

export default ForgotPassword
