import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Camera, Calendar, Clock, MapPin, User, Upload, CheckCircle, XCircle, Play, Info, Save, FileText, ChevronRight, ChevronDown } from 'lucide-react';

export default function AdminDashboard() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [uploading, setUploading] = useState(null);
    const [expandedRequest, setExpandedRequest] = useState(null); // ID of request being edited
    const [adminNotes, setAdminNotes] = useState('');
    const [requestStatus, setRequestStatus] = useState('');

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/cctv/admin/requests', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) throw new Error('Failed to fetch requests');
            const data = await response.json();
            setRequests(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async (requestId, files) => {
        if (!files || files.length === 0) return;
        setUploading(requestId);
        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            formData.append('files', files[i]);
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/cctv/admin/upload/${requestId}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (!response.ok) throw new Error('Upload failed');

            fetchRequests();
        } catch (err) {
            alert(err.message);
        } finally {
            setUploading(null);
        }
    };

    const handleUpdateStatus = async (requestId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/cctv/admin/update-status/${requestId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    status: requestStatus,
                    admin_notes: adminNotes
                })
            });

            if (!response.ok) throw new Error('Update failed');

            setExpandedRequest(null);
            fetchRequests();
        } catch (err) {
            alert(err.message);
        }
    };

    const toggleExpand = (req) => {
        if (expandedRequest === req.id) {
            setExpandedRequest(null);
        } else {
            setExpandedRequest(req.id);
            setAdminNotes(req.admin_notes || '');
            setRequestStatus(req.status || 'pending');
        }
    };

    if (loading) return <div className="min-h-screen bg-[#0f0f1a] flex items-center justify-center text-white">Loading Admin Dashboard...</div>;

    return (
        <div className="min-h-screen bg-[#0f0f1a] text-white p-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
                            CCTV Request Management
                        </h1>
                        <p className="text-white/40 mt-2">Manage and fulfill CCTV footage requests from users.</p>
                    </div>
                </div>

                {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 mb-8">
                        {error}
                    </div>
                )}

                <div className="grid gap-6">
                    {requests.length === 0 ? (
                        <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10">
                            <Camera className="w-12 h-12 text-white/20 mx-auto mb-4" />
                            <p className="text-white/40">No CCTV requests found.</p>
                        </div>
                    ) : (
                        requests.map((request) => (
                            <motion.div
                                key={request.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-[#1a1b2e] border border-white/10 rounded-2xl shadow-xl overflow-hidden"
                            >
                                <div className="p-6 cursor-pointer hover:bg-white/5 transition-colors" onClick={() => toggleExpand(request)}>
                                    <div className="flex flex-wrap justify-between items-start gap-4">
                                        <div className="space-y-4 flex-1 min-w-[300px]">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                                                    <User size={20} />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-lg">{request.requester}</h3>
                                                    <p className="text-sm text-white/40">ID: {request.user_id}</p>
                                                </div>
                                                <span className={`px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider ${request.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' :
                                                    request.status === 'resolved' ? 'bg-green-500/10 text-green-500' :
                                                        request.status === 'in_progress' ? 'bg-blue-500/10 text-blue-500' : 'bg-red-500/10 text-red-500'
                                                    }`}>
                                                    {request.status}
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                                <div className="flex items-center gap-2 text-white/60">
                                                    <MapPin size={16} className="text-blue-400" />
                                                    <span className="text-sm">{request.location}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-white/60">
                                                    <Calendar size={16} className="text-blue-400" />
                                                    <span className="text-sm">{request.date_request}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-white/60">
                                                    <Clock size={16} className="text-blue-400" />
                                                    <span className="text-sm">{request.start_time} - {request.end_time}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                                {expandedRequest === request.id ? <ChevronDown /> : <ChevronRight />}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {expandedRequest === request.id && (
                                    <div className="bg-black/20 p-6 border-t border-white/5 space-y-6 animate-in slide-in-from-top-2 duration-300">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            {/* Left side: Request Details and Notes */}
                                            <div className="space-y-6">
                                                <div>
                                                    <h4 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-3 flex items-center gap-2">
                                                        <FileText size={14} /> Incident Description
                                                    </h4>
                                                    <p className="text-sm text-white/80 leading-relaxed bg-white/5 p-4 rounded-xl italic">
                                                        {request.description || "No description provided."}
                                                    </p>
                                                    {request.supporting_document && (
                                                        <a href={request.supporting_document} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-xs text-blue-400 hover:text-blue-300 mt-2">
                                                            <Upload size={12} /> View Supporting Document
                                                        </a>
                                                    )}
                                                </div>

                                                <div className="space-y-3">
                                                    <h4 className="text-xs font-bold uppercase tracking-widest text-white/40 flex items-center gap-2">
                                                        <Info size={14} /> Manage Request
                                                    </h4>
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] text-white/30 uppercase font-bold ml-1">Status</label>
                                                        <select
                                                            className="w-full bg-[#1a1b2e] border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500/50"
                                                            value={requestStatus}
                                                            onChange={(e) => setRequestStatus(e.target.value)}
                                                        >
                                                            <option value="pending">Pending</option>
                                                            <option value="in_progress">In Progress</option>
                                                            <option value="resolved">Resolved</option>
                                                        </select>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] text-white/30 uppercase font-bold ml-1">Admin Notes</label>
                                                        <textarea
                                                            className="w-full bg-[#1a1b2e] border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500/50 resize-none h-24"
                                                            placeholder="Add internal notes or update for user..."
                                                            value={adminNotes}
                                                            onChange={(e) => setAdminNotes(e.target.value)}
                                                        />
                                                    </div>
                                                    <button
                                                        onClick={() => handleUpdateStatus(request.id)}
                                                        className="w-full bg-white/5 hover:bg-white/10 text-white font-bold py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 border border-white/10"
                                                    >
                                                        <Save size={16} /> Save Status & Notes
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Right side: Video Upload and List */}
                                            <div className="space-y-6">
                                                <div className="space-y-4">
                                                    <div className="flex justify-between items-center">
                                                        <h4 className="text-xs font-bold uppercase tracking-widest text-white/40 flex items-center gap-2">
                                                            <Camera size={14} /> Footage Files
                                                        </h4>
                                                        <label
                                                            htmlFor={`upload-${request.id}`}
                                                            className="text-xs bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg cursor-pointer transition-all flex items-center gap-1.5 shadow-lg shadow-blue-500/20"
                                                        >
                                                            <Upload size={14} /> Add Files
                                                        </label>
                                                        <input
                                                            type="file"
                                                            id={`upload-${request.id}`}
                                                            className="hidden"
                                                            multiple
                                                            onChange={(e) => handleUpload(request.id, e.target.files)}
                                                            accept="video/*"
                                                        />
                                                    </div>

                                                    <div className="space-y-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                                                        {request.footages && request.footages.length > 0 ? (
                                                            request.footages.map((footage, idx) => (
                                                                <div key={footage.id} className="flex items-center justify-between bg-white/5 p-3 rounded-xl border border-white/5 hover:bg-white/10 transition-colors group">
                                                                    <div className="flex items-center gap-3">
                                                                        <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                                                                            <Play size={14} fill="currentColor" />
                                                                        </div>
                                                                        <div>
                                                                            <p className="text-xs font-medium text-white/80">Footage #{idx + 1}</p>
                                                                            <p className="text-[10px] text-white/30 truncate max-w-[150px]">{footage.file_path.split('/').pop()}</p>
                                                                        </div>
                                                                    </div>
                                                                    <a
                                                                        href={footage.file_path}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="p-2 hover:text-blue-400 transition-colors"
                                                                    >
                                                                        <Play size={16} />
                                                                    </a>
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <div className="flex flex-col items-center justify-center py-10 bg-white/5 rounded-xl border border-dashed border-white/10 text-white/20">
                                                                <Camera size={32} strokeWidth={1} className="mb-2" />
                                                                <p className="text-xs uppercase tracking-widest font-bold">No footage yet</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
