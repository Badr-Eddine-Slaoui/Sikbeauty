"use client";
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "@/utils/react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { API_ENDPOINTS, api } from "../../config/api";
import { getDashboardPath } from "../../utils/auth";
import Logo from "../../assets/Logo/SI-K-Beauty-logo.png";
import LoginImage from "../../assets/Images/login-image.png";
import Image from "next/image";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (location.state?.message) {
      setSuccess(location.state.message);
      setTimeout(() => {
        setSuccess("");
      }, 5000);
    }
    
    if (isAuthenticated() && user?.role) {
      const destination = location.state?.from?.pathname || getDashboardPath(user.role);
      navigate(destination, { replace: true });
    }
  }, [location.state, isAuthenticated, navigate, location.state?.from?.pathname, user?.role]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, {
        email,
        password,
      });
      
      login(response.data.user, response.data.accessToken);
      const dashboardPath = getDashboardPath(response.data.user.role);
      navigate(dashboardPath);
    } catch (error) {
      setError(error.response?.data?.message || "Échec de la connexion. Veuillez réessayer.");
      setTimeout(() => {
        setError("");
      }, 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row w-full min-h-screen lg:h-screen overflow-y-auto lg:overflow-hidden">
      {/* Image Section */}
      <div className="hidden lg:block lg:w-[50%] relative overflow-hidden">
        <Image 
          src={LoginImage} 
          alt="Cosmetologist" 
          fill
          className="object-cover"
          priority
          sizes="50vw"
        />
      </div>

      {/* Form Section */}
      <div className="w-full lg:w-[50%] flex flex-col justify-start lg:justify-center items-center px-4 sm:px-8 py-8 lg:py-0 bg-[#FAFAFA]">
        {/* Logo */}
        <Link to='/' className="mb-5 relative w-20 h-20 sm:w-[108px] sm:h-[108px]">
          <Image 
            src={Logo} 
            alt="SI K-Beauty Logo" 
            fill
            className="object-contain"
          />
        </Link>

        {/* Heading */}
        <h1 
          className="text-center text-3xl sm:text-4xl lg:text-5xl mb-6 lg:mb-[57px] text-brandRed font-bold"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Content de te revoir !
        </h1>

        {success && (
          <div className="w-full max-w-md mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            {success}
          </div>
        )}

        {error && (
          <div className="w-full max-w-md mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Form */}
        <form className="w-full max-w-md" onSubmit={handleSubmit}>
          <div className="mb-4">
            <input 
              type="email" 
              placeholder="EMAIL" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="placeholder:opacity-50 w-full p-3 border border-black focus:border-brandRed focus:outline-none transition-colors bg-white"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
              required
            />
          </div>

          <div className="mb-8 lg:mb-[67px]">
            <input 
              type="password" 
              placeholder="MOT DE PASSE" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="placeholder:opacity-50 w-full p-3 border border-black focus:border-brandRed focus:outline-none transition-colors bg-white"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
              required
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-0 mb-3 w-full">
            <div className="hidden sm:block grow border-t-2 border-brandRed"></div>
            <button 
              type="submit"
              disabled={loading}
              className="px-6 uppercase py-2 sm:mx-4 text-base sm:text-lg text-white bg-brandRed hover:bg-brandBrown disabled:bg-gray-400 disabled:cursor-not-allowed cursor-pointer shadow-md transition-colors duration-300 whitespace-nowrap w-full max-w-[360px]"
              style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: '400' }}
            >
              {loading ? "Connexion..." : "Se connecter"}
            </button>
            <div className="hidden sm:block grow border-t-2 border-brandRed"></div>
          </div>

          <div className="text-center">
            <p 
              className="text-gray-700"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              Vous n'avez pas de compte ?{" "}
              <Link 
                to="/signup" 
                className="text-brandRed hover:text-brandRed transition-colors duration-300 font-semibold"
              >
                Inscrivez-vous
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;