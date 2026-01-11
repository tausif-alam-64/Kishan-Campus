import React, { useState } from "react";
import { FaRegEyeSlash } from "react-icons/fa";
import { FaRegEye } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { signIn } from "../../services/supabase/authService";
import { useAuth } from "../../hooks/useAuth";
import redirectByRole from "../../utils/redirectByRole";

const Login = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const {userRole} = useAuth();

  const handleChange = (e) => {
    const {name, value} = e.target;
    setData((prev) => ({
      ...prev,
      [name] : value,
    }))
  }

  const handleOnSubmit =async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    const {error} = await signIn(data.email, data.password);
    setLoading(false);

    if(error) setError(error.message);
    else navigate(redirectByRole(userRole))
  }
  const valideValue = Object.values(data).every((el) => el) 
  return (
    <section className="w-full container mx-auto px-2">
      <div className="bg-white my-4 w-full max-w-lg mx-auto rounded-xl p-8 shadow-2xl">
        <form onSubmit={handleOnSubmit} className="grid gap-3 py-4">
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <div className="grid gap-1">
            <label htmlFor="email" className="block mb-1 font-semibold text-(--secondary)">Email :</label>
            <input
              type="email"
              id="email"
              required
              placeholder="Enter your email"
              className="w-full px-4 py-3 border rounded-lg"
              name="email"
              value={data.email}
              onChange={handleChange}
            />
          </div>
          <div className="grid gap-1">
            <label htmlFor="password" className="block mb-1 font-semibold text-(--secondary)">Password :</label>
            <div className=" px-4 py-3 rounded-lg  border flex items-center focus-within:border-(--secondary)">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                required
                placeholder="Enter your password"
                className="w-full outline-none"
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
            <Link
              to={"/forgot-password"}
              className="block ml-auto text-sm hover:text-green-600"
            >
              Forgot Password ?
            </Link>
          </div>
          <button
            disabled={!valideValue || loading}
            className={`${
              valideValue ? "bg-green-800 hover:bg-green-700" : "bg-gray-500"
            } text-white py-2 rounded font-semibold my-3 tracking-wide`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p>
          Don't have account ?{" "}
          <Link
            to={"/register"}
            className="font-semibold text-green-700 hover:text-green-800"
          >
            Register
          </Link>
        </p>
      </div>
    </section>
  );
};

export default Login;
