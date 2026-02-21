import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Lock, ArrowRight } from 'lucide-react';

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const data = await import('../lib/api').then(m => m.register(name, email, password));
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
                <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px]" />
                <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-secondary/10 rounded-full blur-[120px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="glass-panel p-8 rounded-2xl">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-white to-text-muted">
                            Create Account
                        </h1>
                        <p className="text-text-muted mt-2">Join the intelligent Lost & Found network</p>
                    </div>

                    <form onSubmit={handleRegister} className="space-y-5">
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-sm p-3 rounded-lg text-center">
                                {error}
                            </div>
                        )}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-text-muted ml-1">Full Name</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="John Doe"
                                    className="input-field pl-11"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                                <User className="absolute left-3 top-3.5 h-5 w-5 text-text-muted" />
                            </div>
                        </div>

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
                                    placeholder="Create a strong password"
                                    className="input-field pl-11"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <Lock className="absolute left-3 top-3.5 h-5 w-5 text-text-muted" />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full btn-primary flex items-center justify-center group mt-4"
                        >
                            <span>Get Started</span>
                            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </form>

                    <div className="mt-8 text-center text-sm text-text-muted">
                        Already have an account?{' '}
                        <Link to="/login" className="text-primary hover:text-primary-hover font-medium transition-colors">
                            Sign In
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
