import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaGoogle, FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import api from '../../utils/api';
import { AuthContext } from '../../context/AuthContext';

const Login = ({ onLoginSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const { setCurrentUser } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await api.post('/auth/login', { email, password });
            
            if (response.data && response.data.token) {
                const userData = {
                    ...response.data
                };
                
                // This will handle setting state, localStorage, and axios headers
                setCurrentUser(userData);
                
                if (onLoginSuccess) {
                    onLoginSuccess(userData);
                }
                
                // Navigate after state is set
                navigate(userData.role === 'admin' ? '/admin' : '/');
            } else {
                throw new Error("Login response was invalid.");
            }
        } catch (err) {
            console.error("❌ Login error:", err);
            setError(err.response?.data?.error || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    const handleSocialLogin = (provider) => {
        window.location.href = `${import.meta.env.VITE_BACKEND_URL}/api/auth/${provider}`;
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-cream px-4">
            <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
                <div className="text-center mb-8">
                    <img
                        src="https://res.cloudinary.com/dxydsx0kf/image/upload/v1752847316/225844264_gsjo7w.png"
                        alt="SLExplora Logo"
                        className="mx-auto h-16 w-16 rounded-full mb-4 object-cover"
                    />
                    <h2 className="text-3xl font-bold text-charcoal mb-2">Welcome Back</h2>
                    <p className="text-gray-600">Sign in to your account</p>
                </div>

                {/* Social Login Button */}
                <div className="mb-6">
                    <button
                        onClick={() => handleSocialLogin('google')}
                        className="w-full flex items-center justify-center gap-3 py-2.5 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-gold font-medium text-gray-700"
                    >
                        <span className="flex items-center justify-center w-6 h-6">
                            {/* Official Google SVG */}
                            <svg width="24" height="24" viewBox="0 0 48 48">
                                <g>
                                    <path fill="#4285F4" d="M24 9.5c3.54 0 6.36 1.22 8.3 2.97l6.18-6.18C34.82 2.7 29.77 0 24 0 14.82 0 6.88 5.8 2.69 14.09l7.19 5.59C12.09 13.09 17.57 9.5 24 9.5z"/>
                                    <path fill="#34A853" d="M46.1 24.55c0-1.64-.15-3.21-.43-4.73H24v9.01h12.41c-.54 2.9-2.18 5.36-4.66 7.02l7.19 5.59C43.98 37.47 46.1 31.53 46.1 24.55z"/>
                                    <path fill="#FBBC05" d="M10.88 28.68c-1.04-3.09-1.04-6.41 0-9.5l-7.19-5.59C1.13 17.13 0 20.45 0 24c0 3.55 1.13 6.87 3.69 10.41l7.19-5.59z"/>
                                    <path fill="#EA4335" d="M24 48c6.48 0 11.93-2.15 15.9-5.86l-7.19-5.59c-2.01 1.35-4.59 2.15-8.71 2.15-6.43 0-11.91-3.59-14.12-8.68l-7.19 5.59C6.88 42.2 14.82 48 24 48z"/>
                                    <path fill="none" d="M0 0h48v48H0z"/>
                                </g>
                            </svg>
                        </span>
                        <span>
                            Continue with Google
                        </span>
                    </button>
                </div>

                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">Or continue with</span>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaEnvelope className="text-gray-400" />
                            </div>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full pl-10 pr-4 py-3 border border-tan rounded-lg focus:outline-none focus:ring-2 focus:ring-gold bg-cream/50"
                                placeholder="Enter your email"
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-1">
                            <label className="block text-sm font-medium text-gray-700">Password</label>
                            <Link to="/forgot-password" className="text-sm text-tan hover:text-gold">
                                Forgot password?
                            </Link>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaLock className="text-gray-400" />
                            </div>
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full pl-10 pr-12 py-3 border border-tan rounded-lg focus:outline-none focus:ring-2 focus:ring-gold bg-cream/50"
                                placeholder="Enter your password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            >
                                {showPassword ? (
                                    <FaEyeSlash className="text-gray-400 hover:text-gray-600" />
                                ) : (
                                    <FaEye className="text-gray-400 hover:text-gray-600" />
                                )}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full bg-tan text-cream py-3 rounded-lg hover:bg-gold transition duration-300 flex items-center justify-center text-lg font-medium ${
                            loading ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                    >
                        {loading ? (
                            <span className="flex items-center gap-2">
                                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                                </svg>
                                Signing in...
                            </span>
                        ) : 'Sign in'}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-gray-600">
                        Haven't registered yet?{" "}
                        <Link 
                            to="/signup" 
                            className="text-tan hover:text-gold font-medium transition-colors duration-300"
                        >
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
