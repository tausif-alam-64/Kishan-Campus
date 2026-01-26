import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../../services/supabase/supabaseClient';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';

const ResetPassword = () => {
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const isValid = password.length >= 6 && password === confirmPassword;
    
    const handleSubmit = async(e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if(!supabase){
            setError("Supabase is not configured.");
            return;
        }
        if(!isValid){
            setError("Password do not match or are too short.");
            return;
        }

        try {
            setLoading(true)
            const {error} = await supabase.auth.updateUser({
                password,
            })

            if(error){
                setError(error.message);
            }else{
                setSuccess("Password updated successfully.");
                setTimeout(() => {
                    navigate("/login");
                }, 2000)
            }
        } catch (error) {
            setError("Somthing went wrong.Try again.");
        } finally {
            setLoading(false);
        }
    };
  return (
    <section className="w-full container mx-auto px-2">
      <div className="bg-white my-4 w-full max-w-lg mx-auto rounded-xl shadow-2xl p-8">
        <p className="font-semibold text-lg">Reset Password</p>

        <form onSubmit={handleSubmit} className="grid gap-3 py-4">
          {error && (
            <p className="text-red-600 text-sm bg-red-100 p-2 rounded">
              {error}
            </p>
          )}

          {success && (
            <p className="text-green-700 text-sm bg-green-100 p-2 rounded">
              {success}
            </p>
          )}

          <div className="grid gap-1">
            <label>New Password</label>
            <div className='px-4 py-3 rounded-lg border flex items-center
                focus-within:border-secondary
                focus-within:ring-2
                focus-within:ring-secondary'>
              <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter new password"
              className="w-full outline-none bg-transparent rounded-lg"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div onClick={() => setShowPassword((prev) => !prev)}>
                {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
            </div>  
            </div>
            
          </div>

          <div className="grid gap-1 relative">
            <label>Confirm Password</label>
            <div className='px-4 py-3 rounded-lg border flex items-center
                focus-within:border-secondary
                focus-within:ring-2
                focus-within:ring-secondary'>
<input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm new password"
              className="w-full outline-none bg-transparent rounded-lg"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <div onClick={() => setShowConfirmPassword((prev) => !prev)}>
                {showConfirmPassword ? <FaRegEye /> : <FaRegEyeSlash />}
            </div>
            </div>
            
          </div>

          <button
            disabled={!isValid || loading}
            className={`${
              isValid
                ? "bg-green-800 hover:bg-green-700"
                : "bg-gray-500"
            } text-white py-2 rounded font-semibold my-3 tracking-wide`}
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>

        <p className="text-sm">
          Remembered your password?{" "}
          <Link
            to="/login"
            className="font-semibold text-green-700 hover:text-green-800"
          >
            Login
          </Link>
        </p>
      </div>
    </section>
  )
}

export default ResetPassword
