import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, CheckCircle, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MatchDetail() {
    const location = useLocation();
    const navigate = useNavigate();
    const notification = location.state?.notification;

    if (!notification) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6 text-center">
                <div>
                    <h2 className="text-2xl font-bold mb-4">No Match Data Found</h2>
                    <button onClick={() => navigate('/home')} className="btn-primary">
                        Return Home
                    </button>
                </div>
            </div>
        );
    }

    const { lost_item, found_item, score, vector_score } = notification;

    // Helper to extract image URL (handling list string or simple string)
    const getImageUrl = (imgData) => {
        if (!imgData) return null;
        try {
            // Check if it's a string representation of a list e.g. "['data:image...', '...']"
            if (imgData.startsWith("['") || imgData.startsWith('["')) {
                // 1. Remove the surrounding brackets
                let content = imgData.slice(1, -1);

                // 2. Identify the separator (', ' or ", ") to get the first element
                // We must be careful NOT to split on the comma inside "data:image/...,base64"
                // The list separator is usually quote-comma-space-quote

                let firstImage = content;

                // Try to find the split point between items
                const splitIndexSingle = content.indexOf("', '");
                const splitIndexDouble = content.indexOf('", "');

                if (splitIndexSingle !== -1) {
                    firstImage = content.substring(0, splitIndexSingle + 1); // keep the trailing quote for now to match cleaner logic or just take substring
                    firstImage = content.substring(0, splitIndexSingle + 1);
                    // Actually simpler: just match the first quoted string regex
                } else if (splitIndexDouble !== -1) {
                    firstImage = content.substring(0, splitIndexDouble + 1);
                }

                // Now strip the surrounding quotes from the extracted first item
                // It should start with ' or " and end with ' or "
                if ((firstImage.startsWith("'") && firstImage.endsWith("'")) ||
                    (firstImage.startsWith('"') && firstImage.endsWith('"'))) {
                    return firstImage.slice(1, -1);
                }

                // Fallback for single item list where we just stripped brackets: "'data...'"
                if (firstImage.startsWith("'")) return firstImage.replace(/^'|'$/g, '');
                if (firstImage.startsWith('"')) return firstImage.replace(/^"|"$/g, '');

                return firstImage;
            }
            return imgData;
        } catch (e) {
            console.error("Error parsing image data:", e);
            return null;
        }
    };

    const lostImage = getImageUrl(lost_item.images);
    const foundImage = getImageUrl(found_item.images);

    const handleImageError = (e) => {
        e.target.style.display = 'none';
        e.target.nextSibling.style.display = 'flex';
    };

    return (
        <div className="min-h-screen bg-background pb-10">
            {/* Header */}
            <div className="bg-surface/50 border-b border-white/10 sticky top-0 z-20 backdrop-blur-md">
                <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/5 rounded-full text-text-muted hover:text-text transition-colors">
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <h1 className="text-xl font-bold text-text">Match Details</h1>
                </div>
            </div>

            <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-8">

                {/* Confidence Banner */}
                <div className="glass-panel p-6 rounded-2xl border border-primary/30 bg-primary/5 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                            <CheckCircle className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-text">Potential Match Discovered</h2>
                            <p className="text-text-muted">
                                We found an item that strongly resembles your lost report.
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-col items-center bg-background/50 p-3 rounded-lg border border-white/5 min-w-[120px]">
                        <span className="text-xs text-text-muted uppercase tracking-wider font-medium">Match Score</span>
                        {/* Calculate percentage roughly based on score or vector score */}
                        <span className="text-2xl font-bold text-primary">
                            {vector_score ? Math.round(vector_score * 100) : (score > 3 ? 95 : 80)}%
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* LOST ITEM COLUMN */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-text-muted uppercase tracking-wider pl-1">Your Lost Item</h3>
                        <div className="glass-panel rounded-2xl overflow-hidden border border-white/10 h-full">
                            <div className="aspect-video bg-black/40 relative group">
                                {lostImage ? (
                                    <>
                                        <img
                                            src={lostImage}
                                            alt="Lost Item"
                                            className="w-full h-full object-cover"
                                            onError={handleImageError}
                                        />
                                        <div className="hidden absolute inset-0 flex items-center justify-center bg-surface/80 text-text-muted flex-col gap-2">
                                            <span className="text-2xl">📷</span>
                                            <span className="text-sm">Image Unavailable</span>
                                        </div>
                                    </>
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-text-muted text-sm">No Image Provided</div>
                                )}
                                <div className="absolute top-2 right-2 bg-red-500/20 text-red-200 px-3 py-1 rounded-full text-xs font-bold border border-red-500/30 backdrop-blur-md">
                                    LOST
                                </div>
                            </div>
                            <div className="p-6 space-y-4">
                                <div>
                                    <h2 className="text-2xl font-bold text-text">{lost_item.name}</h2>
                                    <p className="text-primary">{lost_item.category}</p>
                                </div>
                                <p className="text-text-muted leading-relaxed">
                                    {lost_item.description}
                                </p>
                                <div className="pt-4 space-y-2 border-t border-white/5">
                                    <div className="flex items-center gap-3 text-sm text-text-muted">
                                        <MapPin className="w-4 h-4" />
                                        <span>Lost at: <span className="text-text">{lost_item.location}</span></span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-text-muted">
                                        <Calendar className="w-4 h-4" />
                                        <span>Date: <span className="text-text">{lost_item.date_lost}</span></span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-text-muted">
                                        <span className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: lost_item.color?.toLowerCase() }}></span>
                                        <span>Color: <span className="text-text">{lost_item.color}</span></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* FOUND ITEM COLUMN */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-text-muted uppercase tracking-wider pl-1">Matching Found Item</h3>
                        <div className="glass-panel rounded-2xl overflow-hidden border border-green-500/20 hover:border-green-500/40 transition-colors h-full bg-green-500/5">
                            <div className="aspect-video bg-black/40 relative">
                                {foundImage ? (
                                    <>
                                        <img
                                            src={foundImage}
                                            alt="Found Item"
                                            className="w-full h-full object-cover"
                                            onError={handleImageError}
                                        />
                                        <div className="hidden absolute inset-0 flex items-center justify-center bg-surface/80 text-text-muted flex-col gap-2">
                                            <span className="text-2xl">📷</span>
                                            <span className="text-sm">Image Unavailable</span>
                                        </div>
                                    </>
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-text-muted text-sm">No Image Provided</div>
                                )}
                                <div className="absolute top-2 right-2 bg-green-500/20 text-green-200 px-3 py-1 rounded-full text-xs font-bold border border-green-500/30 backdrop-blur-md">
                                    FOUND
                                </div>
                            </div>
                            <div className="p-6 space-y-4">
                                <div>
                                    <h2 className="text-2xl font-bold text-text">{found_item.category}</h2> {/* Finder usually doesn't give a name */}
                                    <p className="text-green-400">Match Candidate</p>
                                </div>
                                <p className="text-text-muted leading-relaxed">
                                    {found_item.description}
                                </p>
                                <div className="pt-4 space-y-2 border-t border-white/5">
                                    <div className="flex items-center gap-3 text-sm text-text-muted">
                                        <MapPin className="w-4 h-4" />
                                        <span>Found at: <span className="text-text">{found_item.location_found}</span></span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-text-muted">
                                        <Calendar className="w-4 h-4" />
                                        <span>Date: <span className="text-text">{found_item.date_found}</span></span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-text-muted">
                                        <span className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: found_item.color?.toLowerCase() }}></span>
                                        <span>Color: <span className="text-text">{found_item.color}</span></span>
                                    </div>
                                </div>

                                {/* Privacy / Contact Section */}
                                <div className="mt-6 bg-surface/50 rounded-xl p-4 border border-white/10">
                                    <h4 className="font-semibold text-text mb-2 flex items-center gap-2">
                                        <Shield className="w-4 h-4 text-primary" />
                                        Finder Contact
                                    </h4>
                                    <div className="space-y-1">
                                        <p className="text-sm">Name: <span className="text-text font-medium">{found_item.finder_name}</span></p>
                                        <div className="bg-black/30 p-2 rounded text-center mt-2 border border-white/5">
                                            <span className="text-lg font-mono text-primary font-bold tracking-wide select-all">
                                                {found_item.contact}
                                            </span>
                                            <p className="text-xs text-text-muted mt-1">Please contact responsibly.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
