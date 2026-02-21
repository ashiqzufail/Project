import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, ArrowRight } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const data = await import('../lib/api').then(m => m.login(email, password));
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            navigate('/home');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute inset-0 bg-background z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/20 rounded-full blur-[120px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="glass-panel p-8 rounded-2xl">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                            Welcome Back
                        </h1>
                        <p className="text-text-muted mt-2">Sign in to recover lost items</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-sm p-3 rounded-lg text-center">
                                {error}
                            </div>
                        )}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-text-muted ml-1">Email Address</label>
                            <div className="relative">
                                <input
                                    type="email"
                                    placeholder="you@example.com"
                                    className="input-field pl-11"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                <Mail className="absolute left-3 top-3.5 h-5 w-5 text-text-muted" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-text-muted ml-1">Password</label>
                            <div className="relative">
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    className="input-field pl-11"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <Lock className="absolute left-3 top-3.5 h-5 w-5 text-text-muted" />
                            </div>
                        </div>

                        <div className="flex items-center justify-end">
                            <a href="#" className="text-sm text-primary hover:text-primary-hover transition-colors">
                                Forgot password?
                            </a>
                        </div>

                        <button
                            type="submit"
                            className="w-full btn-primary flex items-center justify-center group"
                        >
                            <span>Sign In</span>
                            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </form>

                    <div className="mt-8 text-center text-sm text-text-muted">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-primary hover:text-primary-hover font-medium transition-colors">
                            Create Account
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
