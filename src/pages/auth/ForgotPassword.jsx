import React, { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../services/supabase/supabaseClient";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const valideValue = email.trim() !== "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!supabase) {
      setError("Supabase is not configured.");
      return;
    }

    try {
      setLoading(true);

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        setError(error.message);
      } else {
        setMessage("Password reset link sent to your email.");
      }
    } catch (error) {
      setError("Somthing went wrong. Try again.");
    } finally {
      setLoading(fasle);
    }
  };
  return (
    <section className="w-full container mx-auto px-2">
      <div className="bg-white my-4 w-full max-w-lg mx-auto rounded-xl shadow-2xl p-8">
        <p className="font-semibold text-lg ">Forgot Password</p>
        <form onSubmit={handleSubmit} className="grid gap-3 py-4">
          {error && (
            <p className="text-red-600 text-sm bg-red-100 p-2 rounded">
              {error}
            </p>
          )}
          {message && (
            <p className="text-green-700 text-sm bg-green-100 p-2 rounded">
              {message}
            </p>
          )}
          <div className="grid gap-1">
            <label htmlFor="email">Email :</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              className="w-full px-4 py-3 border rounded-lg"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button
            disabled={!valideValue || loading}
            className={`${
              valideValue ? "bg-green-800 hover:bg-green-700" : "bg-gray-500"
            } text-white py-2 rounded font-semibold my-3 tracking-wide`}
          >
            Send Reset Link
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
  );
};

export default ForgotPassword;
