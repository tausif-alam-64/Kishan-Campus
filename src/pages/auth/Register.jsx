import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { signUp } from "../../services/supabase/authService";

const Register = () => {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (data.password !== data.confirmPassword) {
      setError("Passwords do not match with confirm password");
      return;
    }
    try {
      const { error } = await signUp(data.email, data.password, {
        full_name: data.name,
        role: "student",
      });

      if (error) setError(error.message);
      else {
        navigate("/login");
        alert("Please check your email to confirm your account before login.");
      }
    } catch (error) {
      setError("Somthing went worng. Try again");
    }
  };

  const valideValue =
    Object.values(data).every((el) => el) &&
    data.password === data.confirmPassword;
  return (
    <section className="w-full container mx-auto px-2">
      <div className="bg-white my-4 w-full max-w-lg mx-auto rounded-xl shadow-2xl p-8">
        <p>Welcom to Kishan Intermediate Collage</p>
        <form onSubmit={handleSubmit} className="grid gap-3 mt-6">
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <div className="grid gap-1">
            <label htmlFor="name">Name :</label>
            <input
              type="text"
              id="name"
              placeholder="Enter your name"
              autoFocus
              className="w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-secondary focus:border-secondary"
              name="name"
              value={data.name}
              onChange={handleChange}
            />
          </div>
          <div className="grid gap-1">
            <label htmlFor="email">Email :</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              className="w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-secondary focus:border-secondary"
              name="email"
              value={data.email}
              onChange={handleChange}
            />
          </div>
          <div className="grid gap-1">
            <label htmlFor="password">Password :</label>
            <div
              className="px-4 py-3 rounded-lg border flex items-center
                focus-within:border-secondary
                focus-within:ring-2
                focus-within:ring-secondary"
            >
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Enter your password"
                className="w-full outline-none bg-transparent"
                name="password"
                value={data.password}
                onChange={handleChange}
              />
              <div
                onClick={() => setShowPassword((prev) => !prev)}
                className="cursor-pointer"
              >
                {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
              </div>
            </div>
          </div>
          <div className="grid gap-1">
            <label htmlFor="confirmPassword">Confirm Password :</label>
            <div
              className="px-4 py-3 rounded-lg border flex items-center
                focus-within:border-secondary
                focus-within:ring-2
                focus-within:ring-secondary"
            >
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                placeholder="Enter your confirm password"
                className="w-full outline-none bg-transparent"
                name="confirmPassword"
                value={data.confirmPassword}
                onChange={handleChange}
              />
              <div
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="cursor-pointer"
              >
                {showConfirmPassword ? <FaRegEye /> : <FaRegEyeSlash />}
              </div>
            </div>
          </div>
          <button
            disabled={!valideValue}
            className={`${
              valideValue ? "bg-green-800 hover:bg-green-700" : "bg-gray-500"
            } text-white py-2 rounded font-semibold my-3 tracking-wide`}
          >
            Register
          </button>
        </form>
        <p>
          Already have Account ?{" "}
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

export default Register;
