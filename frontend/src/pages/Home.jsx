import React from 'react';
import { motion } from 'framer-motion';
import { Search, FileQuestion, Plus, MapPin, ArrowRight, Camera } from 'lucide-react';
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
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-surface border border-white/10 flex items-center justify-center text-primary">
                            <span className="font-bold">U</span>
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

                {/* CCTV Request Card */}
                <motion.div
                    variants={item}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="group cursor-pointer"
                    onClick={() => setIsCCTVModalOpen(true)}
                >
                    <div className="glass-panel p-8 rounded-2xl border border-white/10 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-32 bg-blue-500/5 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:bg-blue-500/10" />

                        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
                            <div className="w-16 h-16 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                                <Camera className="w-8 h-8 text-blue-500" />
                            </div>
                            <div className="flex-1">
                                <h2 className="text-2xl font-bold text-text mb-2">Request CCTV Footage</h2>
                                <p className="text-text-muted">
                                    Can't find your item? Request CCTV footage for a specific location and time.
                                </p>
                            </div>
                            <span className="inline-flex items-center text-blue-500 font-medium group-hover:translate-x-1 transition-transform whitespace-nowrap">
                                Request Footage <ArrowRight className="ml-2 w-4 h-4" />
                            </span>
                        </div>
                    </div>
                </motion.div>

                {/* Notifications Area */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="glass-panel rounded-2xl p-6 border border-white/10"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-text">Notifications</h3>
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

                const response = await fetch('http://127.0.0.1:5000/api/items/notifications', {
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
                    // Optional: navigate('/login') if we had access to navigate
                    // For now, just stop loading and maybe show message or force reload
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
