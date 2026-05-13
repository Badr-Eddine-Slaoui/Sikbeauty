"use client";
import { useState } from "react";
import { EyeOff, Eye } from "lucide-react";
import { Link, useNavigate } from "@/utils/react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import LoginImage from "../../assets/Images/login-image.png";
import Logo from "../../assets/Logo/SI-K-Beauty-logo.png";

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
    // Password validation
    if (formData.password.length < 8) {
      return "Le mot de passe doit contenir au moins 8 caractères";
    }
    if (formData.password.length > 32) {
      return "Le mot de passe ne doit pas dépasser 32 caractères";
    }
    if (!/[A-Z]/.test(formData.password)) {
      return "Le mot de passe doit contenir au moins une majuscule";
    }
    if (!/[a-z]/.test(formData.password)) {
      return "Le mot de passe doit contenir au moins une minuscule";
    }
    if (!/[0-9]/.test(formData.password)) {
      return "Le mot de passe doit contenir au moins un chiffre";
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) {
      return "Le mot de passe doit contenir au moins un caractère spécial (!@#$%^&*(),.?\":{}|<>)";
    }
    
    // Password match validation
    if (formData.password !== formData.confirmPassword) {
      return "Les mots de passe ne correspondent pas";
    }

    // Phone validation
    if (!/^\+\d{1,4}$/.test(formData.phoneCountryCode.trim())) {
      return "Indicatif téléphonique invalide. Exemple: +212";
    }

    if (!/^\d{6,15}$/.test(formData.phoneNumber.replace(/\s/g, ''))) {
      return "Numéro de téléphone invalide";
    }

    // Full name validation
    if (!/^[A-Za-zÀ-ÿ]+(?: [A-Za-zÀ-ÿ'-]+)*$/.test(formData.fullName)) {
      return "Format de nom invalide. Utilisez uniquement des lettres";
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Client-side validation
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
      console.error('Registration error:', error.response?.data);
      
      if (error.response?.data?.errors) {
        // Handle validation errors from backend
        const validationErrors = error.response.data.errors;
        const errorMessages = Object.values(validationErrors).flat();
        setError(errorMessages[0] || "Erreur de validation");
      } else if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error.response?.status === 400) {
        setError("Requête invalide. Veuillez vérifier vos informations.");
      } else if (error.response?.status === 409) {
        setError("Cet email est déjà utilisé. Veuillez vous connecter.");
      } else if (!error.response) {
        setError("Erreur de connexion. Vérifiez votre connexion internet.");
      } else {
        setError("Échec de l'inscription. Veuillez réessayer.");
      }
      
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
        <img 
          src={LoginImage?.src || LoginImage} 
          alt="Cosmetologist" 
          className="h-full w-full object-cover"
        />
      </div>

      {/* Form Section */}
      <div className="w-full lg:w-[50%] flex flex-col justify-start lg:justify-center items-center px-4 sm:px-8 lg:px-16 py-8 lg:py-0 bg-[#FAFAFA]">
        
        {/* Logo */}
        <Link to='/' className="mb-5">
          <img 
            src={Logo?.src || Logo} 
            alt="SI K-Beauty Logo" 
            className="mx-auto w-20 h-20 sm:w-[108px] sm:h-[108px] object-contain"
          />
        </Link>
        
        {/* Heading */}
        <h1 
          className="font-playfair text-center text-3xl sm:text-4xl lg:text-5xl mt-2 sm:mt-5 mb-6 sm:mb-10 text-brandRed font-bold uppercase"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Inscrivez-vous
        </h1>

        {/* Error Message */}
        {error && (
          <div className="w-full max-w-xl mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Form */}
        <form className="w-full max-w-xl" onSubmit={handleSubmit}>
          {/* Full Name */}
          <div className="mb-3">
            <input 
              type="text" 
              name="fullName"
              placeholder="NOM ET PRENOM" 
              value={formData.fullName}
              onChange={handleInputChange}
              className="font-playfair placeholder:opacity-50 w-full p-3 border border-black focus:border-brandRed focus:outline-none transition-colors bg-white"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
              required
            />
          </div>

          {/* Email */}
          <div className="mb-3">
            <input 
              type="email" 
              name="email"
              placeholder="EMAIL" 
              value={formData.email}
              onChange={handleInputChange}
              className="font-playfair placeholder:opacity-50 w-full p-3 border border-black focus:border-brandRed focus:outline-none transition-colors bg-white"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
              required
            />
          </div>

          {/* Phone */}
          <div className="mb-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <input 
                type="text" 
                name="phoneCountryCode"
                placeholder="+212"
                value={formData.phoneCountryCode}
                onChange={handleInputChange}
                className="font-playfair placeholder:opacity-50 w-full sm:w-[35%] p-3 border border-black focus:border-brandRed focus:outline-none transition-colors bg-white"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
                required
              />
              <input 
                type="tel" 
                name="phoneNumber"
                placeholder="TÉLÉPHONE" 
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className="font-playfair placeholder:opacity-50 w-full sm:w-[65%] p-3 border border-black focus:border-brandRed focus:outline-none transition-colors bg-white"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
                required
              />
            </div>
          </div>

          {/* Password Fields */}
          <div className="flex flex-col sm:flex-row gap-3 mb-3">
            {/* Password */}
            <div className="relative flex-1">
              <input
                type={showPassword ? 'text' : 'password'} 
                name="password"
                placeholder="MOT DE PASSE"
                value={formData.password}
                onChange={handleInputChange}
                className="font-playfair w-full p-3 border placeholder:opacity-50 border-black focus:border-brandRed focus:outline-none transition-colors pr-10 bg-white"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 transition-colors"
                aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="relative flex-1">
              <input
                type={showConfirmPassword ? 'text' : 'password'} 
                name="confirmPassword"
                placeholder="CONFIRMER MOT DE PASSE"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="font-playfair placeholder:opacity-50 w-full p-3 border border-black focus:border-brandRed focus:outline-none transition-colors pr-10 bg-white"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 transition-colors"
                aria-label={showConfirmPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Country */}
          <div className="mb-3">
            <div className="relative">
              <select 
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                className="font-playfair appearance-none w-full p-3 border border-black focus:border-brandRed focus:outline-none transition-colors bg-white"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                <option value="Morocco">Maroc</option>
                <option value="France">France</option>
                <option value="Spain">Espagne</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-black">
                <svg 
                  className="h-4 w-4 fill-current" 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Register Button */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-0 mt-5 sm:mt-7 mb-6 w-full">
            <div className="hidden sm:block grow border-t-2 border-brandRed"></div>
            <button 
              type="submit"
              disabled={loading}
              className="px-6 py-2 sm:mx-4 text-lg sm:text-[22px] font-playfair text-white bg-brandRed hover:bg-brandBrown disabled:bg-gray-400 disabled:cursor-not-allowed cursor-pointer shadow-md transition-colors duration-300 whitespace-nowrap w-full max-w-[360px]"
              style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: '400' }}
            >
              {loading ? "Création en cours..." : "Créer un compte"}
            </button>
            <div className="hidden sm:block grow border-t-2 border-brandRed"></div>
          </div>

          {/* Login Link */}
          <div className="text-center">
            <p 
              className="text-gray-700"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              Vous avez déjà un compte ?{" "}
              <Link 
                to="/login" 
                className="text-brandRed hover:text-brandRed transition-colors duration-300"
              >
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