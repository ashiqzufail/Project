import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, FileQuestion, Plus, MapPin, ArrowRight, Camera, Clock, CheckCircle, Play, ShieldCheck, Calendar, Download, Info, FileText } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import CCTVRequestModal from '../components/CCTVRequestModal';

export default function Home() {
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    const [isCCTVModalOpen, setIsCCTVModalOpen] = React.useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userJson = localStorage.getItem('user');
        if (userJson) {
            try {
                setUser(JSON.parse(userJson));
            } catch (e) {
                console.error("Error parsing user", e);
            }
        }
    }, []);

    return (
        <div className="min-h-screen relative p-6 pb-20 md:p-10">
            {/* Background Ambience */}
            <div className="absolute inset-0 bg-background z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/20 rounded-full blur-[120px]" />
            </div>

            <div className="relative z-10 max-w-6xl mx-auto space-y-12">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                            Lost & Found
                        </h1>
                        <p className="text-text-muted mt-2">Report lost items or help others find theirs.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        {user?.role === 'admin' && (
                            <Link
                                to="/admin/dashboard"
                                className="flex items-center gap-2 bg-blue-600/20 text-blue-400 border border-blue-500/30 px-4 py-2 rounded-xl hover:bg-blue-600/30 transition-all font-medium"
                            >
                                <ShieldCheck size={18} />
                                Admin Dashboard
                            </Link>
                        )}
                        <div className="w-10 h-10 rounded-full bg-surface border border-white/10 flex items-center justify-center text-primary">
                            <span className="font-bold">{user?.username?.[0]?.toUpperCase() || 'U'}</span>
                        </div>
                    </div>
                </div>

                {/* Main Actions */}
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                    {/* Lost Item Card */}
                    <motion.div variants={item} className="group">
                        <Link to="/report-lost" className="block h-full">
                            <div className="glass-panel p-8 h-full rounded-2xl border border-white/10 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:bg-primary/10" />

                                <div className="relative z-10">
                                    <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                        <FileQuestion className="w-7 h-7 text-primary" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-text mb-3">I Lost Something</h2>
                                    <p className="text-text-muted mb-6">
                                        Report a lost item to the community. AI matching will help locate it.
                                    </p>
                                    <span className="inline-flex items-center text-primary font-medium group-hover:translate-x-1 transition-transform">
                                        Report Item <ArrowRight className="ml-2 w-4 h-4" />
                                    </span>
                                </div>
                            </div>
                        </Link>
                    </motion.div>

                    {/* Found Item Card */}
                    <motion.div variants={item} className="group">
                        <Link to="/report-found" className="block h-full">
                            <div className="glass-panel p-8 h-full rounded-2xl border border-white/10 hover:border-secondary/50 transition-all duration-300 hover:shadow-lg hover:shadow-secondary/10 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-32 bg-secondary/5 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:bg-secondary/10" />

                                <div className="relative z-10">
                                    <div className="w-14 h-14 rounded-xl bg-secondary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                        <Search className="w-7 h-7 text-secondary" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-text mb-3">I Found Something</h2>
                                    <p className="text-text-muted mb-6">
                                        Report an item you found or browse lost item reports.
                                    </p>
                                    <span className="inline-flex items-center text-secondary font-medium group-hover:translate-x-1 transition-transform">
                                        Report Found <ArrowRight className="ml-2 w-4 h-4" />
                                    </span>
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                </motion.div>

                {/* CCTV Actions & Status Area */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* CCTV Request Card */}
                    <motion.div
                        variants={item}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                        className="group cursor-pointer lg:col-span-1"
                        onClick={() => setIsCCTVModalOpen(true)}
                    >
                        <div className="glass-panel p-8 h-full rounded-2xl border border-white/10 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 relative overflow-hidden flex flex-col justify-center">
                            <div className="absolute top-0 right-0 p-32 bg-blue-500/5 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:bg-blue-500/10" />

                            <div className="relative z-10">
                                <div className="w-16 h-16 rounded-xl bg-blue-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <Camera className="w-8 h-8 text-blue-500" />
                                </div>
                                <h2 className="text-2xl font-bold text-text mb-2">Request CCTV</h2>
                                <p className="text-text-muted mb-6">
                                    Request footage for a specific location and time.
                                </p>
                                <span className="inline-flex items-center text-blue-500 font-medium group-hover:translate-x-1 transition-transform">
                                    Request Footage <ArrowRight className="ml-2 w-4 h-4" />
                                </span>
                            </div>
                        </div>
                    </motion.div>

                    {/* CCTV Request History */}
                    <motion.div
                        variants={item}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                        className="lg:col-span-2 glass-panel rounded-2xl p-6 border border-white/10"
                    >
                        <h3 className="text-lg font-semibold text-text mb-6">CCTV Requests</h3>
                        <CCTVRequestStatus />
                    </motion.div>
                </div>

                {/* Notifications Area */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="glass-panel rounded-2xl p-6 border border-white/10"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-text">Item Match Notifications</h3>
                        <div className="flex gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        </div>
                    </div>

                    <UserNotifications />
                </motion.div>
            </div>

            <CCTVRequestModal
                isOpen={isCCTVModalOpen}
                onClose={() => setIsCCTVModalOpen(false)}
            />
        </div>
    );
}

function CCTVRequestStatus() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('/api/cctv/my-requests', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    setRequests(data);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchRequests();
    }, []);

    if (loading) return <div className="text-white/40">Loading...</div>;
    if (requests.length === 0) return <div className="text-white/40 text-sm">No requests found.</div>;

    return (
        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {requests.map((req) => (
                <div key={req.id} className="p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all">
                    <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                        <div className="flex-1 min-w-[200px]">
                            <div className="flex items-center gap-2 mb-2">
                                <MapPin size={16} className="text-blue-400" />
                                <span className="font-bold text-text">{req.location}</span>
                            </div>
                            <div className="flex flex-wrap items-center gap-4 text-xs text-text-muted">
                                <span className="flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded-md">
                                    <Calendar size={12} /> {req.date_request}
                                </span>
                                <span className="flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded-md">
                                    <Clock size={12} /> {req.start_time} - {req.end_time}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <span className={`px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider ${req.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' :
                                req.status === 'resolved' ? 'bg-green-500/10 text-green-500' :
                                    req.status === 'in_progress' ? 'bg-blue-500/10 text-blue-500' : 'bg-red-500/10 text-red-500'
                                }`}>
                                {req.status}
                            </span>
                        </div>
                    </div>

                    {/* Admin Notes & Footages */}
                    {(req.admin_notes || req.footages?.length > 0) && (
                        <div className="mt-4 pt-4 border-t border-white/5 space-y-3">
                            {req.admin_notes && (
                                <div className="bg-blue-500/5 border border-blue-500/10 p-3 rounded-xl">
                                    <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase tracking-widest mb-1">
                                        <Info size={12} /> Admin Notes
                                    </div>
                                    <p className="text-sm text-text-muted leading-relaxed italic">
                                        "{req.admin_notes}"
                                    </p>
                                </div>
                            )}

                            {req.footages?.length > 0 && (
                                <div className="space-y-2">
                                    <div className="text-[10px] text-text-muted font-bold uppercase tracking-widest px-1">Attached Footage</div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        {req.footages.map((footage, fIdx) => (
                                            <div key={footage.id} className="flex items-center justify-between bg-white/5 p-3 rounded-xl border border-white/5 group hover:bg-white/10 transition-colors">
                                                <div className="flex items-center gap-3 truncate">
                                                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                                                        <Play size={14} fill="currentColor" />
                                                    </div>
                                                    <span className="text-xs text-text-muted truncate">Footage #{fIdx + 1}</span>
                                                </div>
                                                <div className="flex gap-2">
                                                    <a
                                                        href={footage.file_path}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="p-2 hover:text-primary transition-colors"
                                                        title="View"
                                                    >
                                                        <Search size={14} />
                                                    </a>
                                                    <a
                                                        href={footage.file_path}
                                                        download
                                                        className="p-2 hover:text-green-400 transition-colors"
                                                        title="Download"
                                                    >
                                                        <Download size={14} />
                                                    </a>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* User Supporting Doc */}
                    {req.supporting_document && (
                        <div className="mt-3 flex justify-end">
                            <a
                                href={req.supporting_document}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[10px] text-blue-400 hover:underline flex items-center gap-1"
                            >
                                <FileText size={10} /> My attached document
                            </a>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

function UserNotifications() {
    const [notifications, setNotifications] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    const navigate = useNavigate();

    React.useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setLoading(false);
                    return;
                }

                const response = await fetch('/api/items/notifications', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setNotifications(data);
                } else if (response.status === 401 || response.status === 422) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    window.location.href = '/login';
                } else {
                    console.error("Failed to fetch notifications");
                }
            } catch (err) {
                console.error("Error fetching notifications", err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchNotifications();
    }, []);

    if (loading) return <div className="text-text-muted text-center py-4">Checking for matches...</div>;

    if (notifications.length === 0) {
        return (
            <div className="text-center py-8 text-text-muted">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl">✨</span>
                </div>
                <p>No new matches found yet.</p>
                <p className="text-sm opacity-60 mt-1">We'll notify you if any found items match your lost reports.</p>
            </div>
        );
    }

    const handleNotificationClick = (notification) => {
        navigate('/match-details', { state: { notification } });
    };

    return (
        <div className="space-y-4">
            {notifications.map((notif, idx) => (
                <div
                    key={idx}
                    onClick={() => handleNotificationClick(notif)}
                    className="p-4 rounded-xl bg-primary/10 border border-primary/20 hover:bg-primary/20 transition-all cursor-pointer hover:shadow-lg hover:border-primary/40 group"
                >
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                            <span className="text-xl">🔔</span>
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <h4 className="font-semibold text-text group-hover:text-primary transition-colors">Potential Match Found!</h4>
                                {notif.vector_score && (
                                    <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full font-mono">
                                        {Math.round(notif.vector_score * 100)}% Match
                                    </span>
                                )}
                            </div>
                            <p className="text-sm text-text-muted mt-1">
                                A found item <strong>"{notif.found_item.category}"</strong> matches your lost <strong>"{notif.lost_item.name}"</strong>.
                            </p>
                            <div className="flex gap-4 mt-3 text-sm">
                                <div className="bg-white/5 px-2 py-1 rounded">
                                    <span className="opacity-60">Color:</span> {notif.found_item.color}
                                </div>
                                <div className="bg-white/5 px-2 py-1 rounded">
                                    <span className="opacity-60">Found at:</span> {notif.found_item.location_found}
                                </div>
                            </div>
                            <div className="mt-3 flex justify-between items-center">
                                <span className="text-xs font-mono bg-white/10 px-2 py-1 rounded text-primary">
                                    Click to view details
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
