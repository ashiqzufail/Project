import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Camera, Calendar, Clock, MapPin, FileUp, Info } from 'lucide-react';

export default function CCTVRequestModal({ isOpen, onClose }) {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [error, setError] = useState(null);
    const [fieldErrors, setFieldErrors] = useState({});

    const [formData, setFormData] = useState({
        location: '',
        date: '',
        startTime: '',
        endTime: '',
        description: ''
    });
    const [file, setFile] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setFieldErrors({});

        // Validation
        const newFieldErrors = {};
        if (!formData.location) newFieldErrors.location = true;
        if (!formData.date) newFieldErrors.date = true;
        if (!formData.startTime) newFieldErrors.startTime = true;
        if (!formData.endTime) newFieldErrors.endTime = true;

        if (Object.keys(newFieldErrors).length > 0) {
            setFieldErrors(newFieldErrors);
            setLoading(false);
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const dataToSubmit = new FormData();
            dataToSubmit.append('location', formData.location);
            dataToSubmit.append('date', formData.date);
            dataToSubmit.append('startTime', formData.startTime);
            dataToSubmit.append('endTime', formData.endTime);
            dataToSubmit.append('description', formData.description);
            if (file) {
                dataToSubmit.append('supporting_document', file);
            }

            const response = await fetch('/api/cctv/request', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: dataToSubmit
            });

            if (!response.ok) {
                throw new Error('Failed to submit request');
            }

            const data = await response.json();

            if (data.hardware_found === false) {
                setSuccessMessage("Request sent successfully, but no CCTV hardware was found or connected for the selected location.");
            } else {
                setSuccessMessage("Request submitted successfully.");
            }

            setSuccess(true);
            setTimeout(() => {
                setSuccess(false);
                setFormData({ location: '', date: '', startTime: '', endTime: '', description: '' });
                setFile(null);
                setSuccessMessage('');
                onClose();
            }, 3000);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-[#1a1b2e] border border-white/10 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl"
                >
                    <div className="p-6 border-b border-white/10 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                                <Camera size={20} />
                            </div>
                            <h2 className="text-xl font-bold text-white">Request CCTV Footage</h2>
                        </div>
                        <button
                            onClick={() => {
                                onClose();
                                setTimeout(() => {
                                    setSuccess(false);
                                    setFormData({ location: '', date: '', startTime: '', endTime: '' });
                                    setSuccessMessage('');
                                }, 300);
                            }}
                            className="p-2 hover:bg-white/5 rounded-full text-white/60 hover:text-white transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <div className="p-6">
                        {success ? (
                            <div className="text-center py-8">
                                <div className={`w-16 h-16 ${successMessage.includes("no CCTV hardware") ? "bg-yellow-500/10 text-yellow-500" : "bg-green-500/10 text-green-500"} rounded-full flex items-center justify-center mx-auto mb-4`}>
                                    <span className="text-3xl">{successMessage.includes("no CCTV hardware") ? "⚠️" : "✓"}</span>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">{successMessage.includes("no CCTV hardware") ? "Request Sent With Warning" : "Request Sent!"}</h3>
                                <p className="text-white/60 px-4">{successMessage}</p>

                                {successMessage.includes("no CCTV hardware") && (
                                    <button
                                        onClick={() => {
                                            setSuccess(false);
                                            setFormData({ location: '', date: '', startTime: '', endTime: '' });
                                            setSuccessMessage('');
                                            onClose();
                                        }}
                                        className="mt-6 bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-lg transition-colors"
                                    >
                                        Close
                                    </button>
                                )}
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {error && (
                                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">
                                        {error}
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-white/80">Specific Location</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                                        <input
                                            type="text"
                                            name="location"
                                            value={formData.location}
                                            onChange={handleChange}
                                            placeholder="e.g. Main Library Entrance"
                                            className={`w-full bg-white/5 border ${fieldErrors.location ? 'border-red-500/50' : 'border-white/10'} rounded-lg py-2.5 pl-10 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:border-blue-500/50 transition-colors`}
                                        />
                                    </div>
                                    {fieldErrors.location && <span className="text-xs text-red-400">Location is required</span>}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-white/80">Date</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                                        <input
                                            type="date"
                                            name="date"
                                            value={formData.date}
                                            onChange={handleChange}
                                            className={`w-full bg-white/5 border ${fieldErrors.date ? 'border-red-500/50' : 'border-white/10'} rounded-lg py-2.5 pl-10 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:border-blue-500/50 transition-colors [color-scheme:dark]`}
                                        />
                                    </div>
                                    {fieldErrors.date && <span className="text-xs text-red-400">Date is required</span>}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-white/80">Start Time</label>
                                        <div className="relative">
                                            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                                            <input
                                                type="time"
                                                name="startTime"
                                                value={formData.startTime}
                                                onChange={handleChange}
                                                className={`w-full bg-white/5 border ${fieldErrors.startTime ? 'border-red-500/50' : 'border-white/10'} rounded-lg py-2.5 pl-10 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:border-blue-500/50 transition-colors [color-scheme:dark]`}
                                            />
                                        </div>
                                        {fieldErrors.startTime && <span className="text-xs text-red-400">Required</span>}
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-white/80">End Time</label>
                                        <div className="relative">
                                            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                                            <input
                                                type="time"
                                                name="endTime"
                                                value={formData.endTime}
                                                onChange={handleChange}
                                                className={`w-full bg-white/5 border ${fieldErrors.endTime ? 'border-red-500/50' : 'border-white/10'} rounded-lg py-2.5 pl-10 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:border-blue-500/50 transition-colors [color-scheme:dark]`}
                                            />
                                        </div>
                                        {fieldErrors.endTime && <span className="text-xs text-red-400">Required</span>}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-white/80">Description</label>
                                    <div className="relative">
                                        <Info className="absolute left-3 top-3 w-4 h-4 text-white/40" />
                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleChange}
                                            placeholder="Briefly describe the incident..."
                                            rows="3"
                                            className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:border-blue-500/50 transition-colors resize-none"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-white/80">Supporting Document (Optional)</label>
                                    <div className="relative">
                                        <input
                                            type="file"
                                            id="supporting_document"
                                            onChange={(e) => setFile(e.target.files[0])}
                                            className="hidden"
                                        />
                                        <label
                                            htmlFor="supporting_document"
                                            className="flex items-center gap-3 w-full bg-white/5 border border-dashed border-white/10 hover:border-blue-500/40 rounded-lg p-4 cursor-pointer transition-all"
                                        >
                                            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                                                <FileUp size={18} />
                                            </div>
                                            <div className="truncate flex-1">
                                                <p className="text-sm font-medium text-white">
                                                    {file ? file.name : "Choose a file"}
                                                </p>
                                                <p className="text-xs text-white/40">PDF, JPG, PNG up to 10MB</p>
                                            </div>
                                        </label>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-2.5 rounded-lg transition-colors mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Sending Request...' : 'Request CCTV'}
                                </button>
                            </form>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
