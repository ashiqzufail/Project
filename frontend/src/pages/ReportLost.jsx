import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Camera, Upload, X, MapPin, Calendar, Clock, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ReportLost() {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    // Form State
    const [images, setImages] = useState([]);
    const [formData, setFormData] = useState({
        category: '',
        name: '',
        description: '',
        color: '',
        brand: '',
        serial: '',
        date: '',
        time: '',
        location: '',
        landmark: '',
        ownerName: '',
        email: '',
        phone: ''
    });

    const categories = ['Electronics', 'Documents', 'Jewelry', 'Clothing', 'Keys', 'Wallet/Purse', 'Other'];
    const colors = ['Black', 'White', 'Blue', 'Red', 'Green', 'Yellow', 'Silver', 'Gold', 'Other'];

    // Handlers
    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        if (files.length + images.length > 5) {
            alert('Maximum 5 images allowed');
            return;
        }

        const newImages = files.map(file => ({
            file,
            preview: URL.createObjectURL(file)
        }));

        setImages([...images, ...newImages]);
    };

    const removeImage = (index) => {
        const newImages = [...images];
        if (newImages[index].preview) {
            URL.revokeObjectURL(newImages[index].preview);
        }
        newImages.splice(index, 1);
        setImages(newImages);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const toBase64 = file => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Convert images to Base64
            const imagePromises = images.map(img => toBase64(img.file));
            const base64Images = await Promise.all(imagePromises);

            const token = localStorage.getItem('token');
            if (!token) {
                alert("You must be logged in to report an item.");
                navigate('/login');
                return;
            }

            const response = await fetch('http://127.0.0.1:5000/api/items/lost', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...formData,
                    images: base64Images // Send Base64 strings instead of filenames
                }),
            });

            const data = await response.json();

            if (response.ok) {
                alert('Report submitted successfully!');
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
        <div className="min-h-screen bg-background pb-24 md:pb-10">
            {/* Header */}
            <div className="bg-surface/50 border-b border-white/10 sticky top-0 z-20 backdrop-blur-md">
                <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/5 rounded-full text-text-muted hover:text-text transition-colors">
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <h1 className="text-xl font-bold text-text">Report Lost Item</h1>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="max-w-3xl mx-auto p-4 space-y-8">

                {/* 1. Image Upload Section */}
                <section className="space-y-4">
                    <h2 className="text-lg font-semibold text-text flex items-center gap-2">
                        <Camera className="w-5 h-5 text-primary" />
                        Item Images <span className="text-secondary text-sm font-normal">(Required)</span>
                    </h2>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {/* Upload Button */}
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="aspect-square rounded-xl border-2 border-dashed border-white/20 bg-white/5 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all group"
                        >
                            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mb-2 group-hover:bg-primary/20 transition-colors">
                                <Upload className="w-5 h-5 text-text-muted group-hover:text-primary" />
                            </div>
                            <span className="text-sm text-text-muted font-medium">Add Photo</span>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                multiple
                                onChange={handleImageUpload}
                            />
                        </div>

                        {/* Image Previews */}
                        {images.map((img, idx) => (
                            <div key={idx} className="aspect-square rounded-xl relative group overflow-hidden border border-white/10">
                                <img src={img.preview} alt="Preview" className="w-full h-full object-cover" />
                                <button
                                    type="button"
                                    onClick={() => removeImage(idx)}
                                    className="absolute top-2 right-2 p-1.5 bg-black/50 rounded-full text-white hover:bg-red-500/80 transition-colors backdrop-blur-sm"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                                {idx === 0 && (
                                    <div className="absolute bottom-0 inset-x-0 bg-black/60 p-1 text-center text-xs font-medium text-white backdrop-blur-sm">
                                        Cover
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    <p className="text-sm text-text-muted flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        Clear photos significantly increase chances of recovery.
                    </p>
                </section>

                <div className="h-px bg-white/10" />

                {/* 2. Item Details */}
                <section className="space-y-4">
                    <h2 className="text-lg font-semibold text-text">Item Details</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-text-muted">Item Name *</label>
                            <input
                                type="text"
                                name="name"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="e.g. Blue Backpack"
                                className="input-field"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-text-muted">Category *</label>
                            <select
                                name="category"
                                required
                                value={formData.category}
                                onChange={handleChange}
                                className="input-field"
                            >
                                <option value="">Select Category</option>
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
                                <option value="">Select Color</option>
                                {colors.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-text-muted">Brand (Optional)</label>
                            <input
                                type="text"
                                name="brand"
                                value={formData.brand}
                                onChange={handleChange}
                                placeholder="e.g. Nike, Apple"
                                className="input-field"
                            />
                        </div>

                        <div className="col-span-1 md:col-span-2 space-y-2">
                            <label className="text-sm font-medium text-text-muted">Description (Optional)</label>
                            <textarea
                                name="description"
                                rows="3"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Distinguishing features, scratches, stickers..."
                                className="input-field resize-none"
                            />
                        </div>
                    </div>
                </section>

                <div className="h-px bg-white/10" />

                {/* 3. Lost Information */}
                <section className="space-y-4">
                    <h2 className="text-lg font-semibold text-text flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-secondary" />
                        When & Where
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-text-muted">Date Lost *</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                                <input
                                    type="date"
                                    name="date"
                                    required
                                    value={formData.date}
                                    onChange={handleChange}
                                    className="input-field pl-10"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-text-muted">Time (Approx)</label>
                            <div className="relative">
                                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                                <input
                                    type="time"
                                    name="time"
                                    value={formData.time}
                                    onChange={handleChange}
                                    className="input-field pl-10"
                                />
                            </div>
                        </div>

                        <div className="col-span-1 md:col-span-2 space-y-2">
                            <label className="text-sm font-medium text-text-muted">Location *</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                                <input
                                    type="text"
                                    name="location"
                                    required
                                    value={formData.location}
                                    onChange={handleChange}
                                    placeholder="e.g. Central Park near the fountain"
                                    className="input-field pl-10"
                                />
                            </div>
                            {/* Map Placeholder */}
                            <div className="mt-2 h-40 bg-surface/30 rounded-lg border border-white/10 flex flex-col items-center justify-center text-text-muted border-dashed border-2">
                                <MapPin className="w-8 h-8 mb-2 opacity-50" />
                                <span className="text-sm">Map View (Coming Soon)</span>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="h-px bg-white/10" />

                {/* 4. Contact Info */}
                <section className="space-y-4">
                    <h2 className="text-lg font-semibold text-text">Your Contact Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-text-muted">Full Name *</label>
                            <input
                                type="text"
                                name="ownerName"
                                required
                                value={formData.ownerName}
                                onChange={handleChange}
                                placeholder="Your Name"
                                className="input-field"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-text-muted">Email Address *</label>
                            <input
                                type="email"
                                name="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="john@example.com"
                                className="input-field"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-text-muted">Phone Number *</label>
                            <input
                                type="tel"
                                name="phone"
                                required
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="+1 (555) 000-0000"
                                className="input-field"
                            />
                        </div>
                    </div>
                </section>

                {/* Sticky Action Footer */}
                <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-lg border-t border-white/10 md:static md:bg-transparent md:border-none md:p-0">
                    <div className="max-w-3xl mx-auto flex flex-col md:flex-row gap-3">
                        <button type="submit" className="btn-primary w-full md:flex-1 shadow-lg shadow-primary/20">
                            Submit Report
                        </button>
                        <div className="grid grid-cols-2 gap-3 md:flex-none">
                            <button type="button" className="px-6 py-3 rounded-lg border border-white/10 hover:bg-white/5 text-text-muted font-medium transition-colors text-center">
                                Save Draft
                            </button>
                            <button type="button" onClick={() => navigate(-1)} className="px-6 py-3 rounded-lg text-red-400 hover:bg-red-500/10 font-medium transition-colors text-center">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
