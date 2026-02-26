import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Camera, Upload, X, MapPin, Calendar, ClipboardCheck, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ReportFound() {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    // Form State
    const [image, setImage] = useState(null);
    const [formData, setFormData] = useState({
        category: '',
        description: '',
        color: '',
        dateFound: '',
        locationFound: '',
        custody: 'with_me',
        finderName: '',
        contact: '', // Phone or Email
        consent: false
    });

    const categories = ['Electronics', 'Documents', 'Jewelry', 'Clothing', 'Keys', 'Wallet/Purse', 'Other'];
    const colors = ['Black', 'White', 'Blue', 'Red', 'Green', 'Yellow', 'Silver', 'Gold', 'Other'];

    // Handlers
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage({
                file,
                preview: URL.createObjectURL(file)
            });
        }
    };

    const removeImage = () => {
        if (image?.preview) {
            URL.revokeObjectURL(image.preview);
        }
        setImage(null);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const toBase64 = file => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!image) {
            alert('Please upload an image of the found item.');
            return;
        }

        try {
            const base64Image = await toBase64(image.file);
            const imageList = [base64Image];

            const token = localStorage.getItem('token');
            if (!token) {
                alert("You must be logged in to report an item.");
                navigate('/login');
                return;
            }

            const response = await fetch('/api/items/found', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...formData,
                    images: imageList
                }),
            });

            const data = await response.json();

            if (response.ok) {
                alert('Thank you! Report submitted successfully.');
                navigate('/home');
            } else if (response.status === 401 || response.status === 422) {
                alert("Session expired. Please login again.");
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/login');
            } else {
                alert(`Error: ${data.msg}`);
            }
        } catch (error) {
            console.error('Submission error:', error);
            alert('Failed to submit report. Please check your connection.');
        }
    };

    return (
        <div className="min-h-screen bg-background pb-20 md:pb-10">
            {/* Header */}
            <div className="bg-surface/50 border-b border-white/10 sticky top-0 z-20 backdrop-blur-md">
                <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/5 rounded-full text-text-muted hover:text-text transition-colors">
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <h1 className="text-xl font-bold text-text">Report Found Item</h1>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="max-w-3xl mx-auto p-4 space-y-8">

                {/* 1. Essential Image Upload */}
                <section>
                    <div
                        className={`aspect-video rounded-xl border-2 border-dashed ${image ? 'border-primary/50' : 'border-white/20'} bg-surface/30 flex flex-col items-center justify-center relative overflow-hidden group transition-all`}
                    >
                        {image ? (
                            <>
                                <img src={image.preview} alt="Found Item" className="w-full h-full object-contain" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 backdrop-blur-sm">
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="btn-primary py-2 px-4 shadow-none"
                                    >
                                        Replace
                                    </button>
                                    <button
                                        type="button"
                                        onClick={removeImage}
                                        className="bg-red-500/20 text-red-400 hover:bg-red-500/30 px-4 py-2 rounded-lg font-medium transition-colors"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="text-center p-6 cursor-pointer w-full h-full flex flex-col items-center justify-center hover:bg-white/5 transition-colors"
                            >
                                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                                    <Camera className="w-7 h-7 text-primary" />
                                </div>
                                <h3 className="font-medium text-text">Upload Photo (Required)</h3>
                                <p className="text-sm text-text-muted mt-1">Tap to capture or upload</p>
                            </div>
                        )}
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleImageUpload}
                        />
                    </div>
                </section>

                <div className="h-px bg-white/10" />

                {/* 2. Essential Details */}
                <section className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-text-muted">Category *</label>
                            <select
                                name="category"
                                required
                                value={formData.category}
                                onChange={handleChange}
                                className="input-field"
                            >
                                <option value="">Select...</option>
                                {categories.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-text-muted">Color *</label>
                            <select
                                name="color"
                                required
                                value={formData.color}
                                onChange={handleChange}
                                className="input-field"
                            >
                                <option value="">Select...</option>
                                {colors.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-text-muted">Short Description *</label>
                        <input
                            type="text"
                            name="description"
                            required
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="e.g. Black leather wallet with keys"
                            className="input-field"
                        />
                    </div>
                </section>

                <div className="h-px bg-white/10" />

                {/* 3. Context & Custody */}
                <section className="space-y-4 bg-surface/30 p-4 rounded-xl border border-white/5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-text-muted">Date Found *</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                                <input
                                    type="date"
                                    name="dateFound"
                                    required
                                    value={formData.dateFound}
                                    onChange={handleChange}
                                    className="input-field pl-10"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-text-muted">Location Found *</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                                <input
                                    type="text"
                                    name="locationFound"
                                    required
                                    value={formData.locationFound}
                                    onChange={handleChange}
                                    placeholder="e.g. Library, Table 4"
                                    className="input-field pl-10"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2 pt-2">
                        <label className="text-sm font-medium text-text-muted">Item Custody *</label>
                        <div className="grid grid-cols-2 gap-3">
                            <label className={`cursor-pointer border rounded-lg p-3 text-center transition-all ${formData.custody === 'with_me' ? 'bg-primary/20 border-primary text-primary' : 'border-white/10 hover:bg-white/5'}`}>
                                <input
                                    type="radio"
                                    name="custody"
                                    value="with_me"
                                    checked={formData.custody === 'with_me'}
                                    onChange={handleChange}
                                    className="hidden"
                                />
                                <span className="text-sm font-medium">I have it</span>
                            </label>
                            <label className={`cursor-pointer border rounded-lg p-3 text-center transition-all ${formData.custody === 'authority' ? 'bg-primary/20 border-primary text-primary' : 'border-white/10 hover:bg-white/5'}`}>
                                <input
                                    type="radio"
                                    name="custody"
                                    value="authority"
                                    checked={formData.custody === 'authority'}
                                    onChange={handleChange}
                                    className="hidden"
                                />
                                <span className="text-sm font-medium">Handed over</span>
                            </label>
                        </div>
                    </div>
                </section>

                <div className="h-px bg-white/10" />

                {/* 4. Finder Contact */}
                <section className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-text-muted">Your Name/Alias *</label>
                            <input
                                type="text"
                                name="finderName"
                                required
                                value={formData.finderName}
                                onChange={handleChange}
                                className="input-field"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-text-muted">Contact (Phone/Email) *</label>
                            <input
                                type="text"
                                name="contact"
                                required
                                value={formData.contact}
                                onChange={handleChange}
                                placeholder="For verification only"
                                className="input-field"
                            />
                        </div>
                    </div>
                </section>

                {/* 5. Consent */}
                <section className="pt-2">
                    <label className="flex items-start gap-3 cursor-pointer group">
                        <div className={`mt-0.5 w-5 h-5 rounded border border-white/20 flex items-center justify-center flex-none transition-colors ${formData.consent ? 'bg-primary border-primary' : 'group-hover:border-primary/50'}`}>
                            {formData.consent && <Shield className="w-3 h-3 text-white" />}
                        </div>
                        <input
                            type="checkbox"
                            name="consent"
                            required
                            checked={formData.consent}
                            onChange={handleChange}
                            className="hidden"
                        />
                        <span className="text-xs text-text-muted leading-relaxed">
                            I verify that I have found this item and will ensure its safe return to the owner or a designated authority. I understand that false reports may lead to account suspension.
                        </span>
                    </label>
                </section>

                {/* Actions */}
                <div className="pt-4 flex flex-col gap-3">
                    <button type="submit" className="btn-primary w-full shadow-lg shadow-primary/20 flex items-center justify-center gap-2">
                        <ClipboardCheck className="w-5 h-5" />
                        Submit Found Report
                    </button>
                    <button type="button" onClick={() => navigate(-1)} className="text-sm text-text-muted hover:text-text py-2 transition-colors">
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}
