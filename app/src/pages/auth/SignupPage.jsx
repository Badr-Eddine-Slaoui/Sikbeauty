"use client";
import { useState } from "react";
import { EyeOff, Eye } from "lucide-react";
import { Link, useNavigate } from "@/utils/react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import LoginImage from "../../assets/Images/login-image.png";
import Logo from "../../assets/Logo/SI-K-Beauty-logo.png";
import Image from "next/image";
import { COUNTRY_PHONE_CODES, validatePhoneForCode } from "../../utils/countryCodes";

function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneCountryCode: "+33",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    role: "Individual",
    country: "Morocco",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (formData.password.length < 8) return "Le mot de passe doit contenir au moins 8 caractères";
    if (formData.password !== formData.confirmPassword) return "Les mots de passe ne correspondent pas";
    if (!/^[A-Za-zÀ-ÿ]+(?: [A-Za-zÀ-ÿ'-]+)*$/.test(formData.fullName)) return "Format de nom invalide";
    
    // Validateur de numéro de téléphone
    if (!validatePhoneForCode(formData.phoneCountryCode, formData.phoneNumber)) {
      return "Numéro de téléphone invalide pour ce code de pays";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      setLoading(false);
      return;
    }

    try {
      const payload = {
        fullName: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        phoneCountryCode: formData.phoneCountryCode.trim(),
        phoneNumber: formData.phoneNumber.replace(/\s/g, ''),
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        role: formData.role,
        country: formData.country,
      };

      await registerUser(payload);
      navigate("/client/products");
    } catch (error) {
      setError(error.response?.data?.message || "Échec de l'inscription. Veuillez réessayer.");
      setTimeout(() => setError(""), 5000);
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
      <div className="w-full lg:w-[50%] flex flex-col justify-start lg:justify-center items-center px-4 sm:px-8 lg:px-16 py-8 lg:py-0 bg-[#FAFAFA]">
        
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
          className="text-center text-3xl sm:text-4xl lg:text-5xl mt-2 sm:mt-5 mb-6 sm:mb-10 text-brandRed font-bold uppercase"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Inscrivez-vous
        </h1>

        {error && (
          <div className="w-full max-w-xl mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Form */}
        <form className="w-full max-w-xl" onSubmit={handleSubmit}>
          <div className="mb-3">
            <input 
              type="text" 
              name="fullName"
              placeholder="NOM ET PRENOM" 
              value={formData.fullName}
              onChange={handleInputChange}
              className="placeholder:opacity-50 w-full p-3 border border-black focus:border-brandRed focus:outline-none transition-colors bg-white"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
              required
            />
          </div>

          <div className="mb-3">
            <input 
              type="email" 
              name="email"
              placeholder="EMAIL" 
              value={formData.email}
              onChange={handleInputChange}
              className="placeholder:opacity-50 w-full p-3 border border-black focus:border-brandRed focus:outline-none transition-colors bg-white"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
              required
            />
          </div>

          <div className="mb-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <select 
                name="phoneCountryCode"
                value={formData.phoneCountryCode}
                onChange={handleInputChange}
                className="w-full sm:w-[40%] p-3 border border-black focus:border-brandRed focus:outline-none transition-colors bg-white cursor-pointer"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
                required
              >
                {COUNTRY_PHONE_CODES.map((c) => (
                  <option key={`${c.country}-${c.code}`} value={c.code}>
                    {c.name}
                  </option>
                ))}
              </select>
              <input 
                type="tel" 
                name="phoneNumber"
                placeholder="TÉLÉPHONE" 
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className="placeholder:opacity-50 w-full sm:w-[60%] p-3 border border-black focus:border-brandRed focus:outline-none transition-colors bg-white"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
                required
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mb-3">
            <div className="relative flex-1">
              <input
                type={showPassword ? 'text' : 'password'} 
                name="password"
                placeholder="MOT DE PASSE"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full p-3 border placeholder:opacity-50 border-black focus:border-brandRed focus:outline-none transition-colors pr-10 bg-white"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <div className="relative flex-1">
              <input
                type={showConfirmPassword ? 'text' : 'password'} 
                name="confirmPassword"
                placeholder="CONFIRMER"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="placeholder:opacity-50 w-full p-3 border border-black focus:border-brandRed focus:outline-none transition-colors pr-10 bg-white"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="mb-3">
            <select 
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              className="appearance-none w-full p-3 border border-black focus:border-brandRed focus:outline-none transition-colors bg-white"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              <option value="Morocco">Maroc</option>
              <option value="France">France</option>
              <option value="Spain">Espagne</option>
            </select>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-0 mt-5 sm:mt-7 mb-6 w-full">
            <div className="hidden sm:block grow border-t-2 border-brandRed"></div>
            <button 
              type="submit"
              disabled={loading}
              className="px-6 py-2 sm:mx-4 text-lg text-white bg-brandRed hover:bg-brandBrown disabled:bg-gray-400 disabled:cursor-not-allowed cursor-pointer shadow-md transition-colors duration-300 whitespace-nowrap w-full max-w-[360px]"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              {loading ? "Création en cours..." : "Créer un compte"}
            </button>
            <div className="hidden sm:block grow border-t-2 border-brandRed"></div>
          </div>

          <div className="text-center">
            <p className="text-gray-700" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              Vous avez déjà un compte ?{" "}
              <Link to="/login" className="text-brandRed hover:text-brandRed transition-colors duration-300 font-semibold">
                Se connecter
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;