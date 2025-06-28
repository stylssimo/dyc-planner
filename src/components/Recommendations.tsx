// src/components/Recommendations.tsx
import React from 'react';

const packages = [
    {
        title: 'Lake Paradise',
        img: 'https://source.unsplash.com/400x300/?lake,travel',
        tags: ['Adventure', 'Trekking'],
        duration: '4 days & 3 nights',
        rating: 4.5,
        reviews: 60,
    },
    {
        title: 'Mountain Escape',
        img: 'https://source.unsplash.com/400x300/?mountain,tour',
        tags: ['Adventure', 'Trekking'],
        duration: '4 days & 3 nights',
        rating: 4.5,
        reviews: 40,
    },
    {
        title: 'Seaside Bliss',
        img: 'https://source.unsplash.com/400x300/?beach,vacation',
        tags: ['Adventure', 'Trekking'],
        duration: '4 days & 3 nights',
        rating: 4.5,
        reviews: 40,
    },
];

const Recommendations = () => {
    return (
        <section className="py-12 max-w-6xl mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6">Recommended Packages</h2>
            <div className="grid md:grid-cols-3 gap-6">
                {packages.map((pkg, idx) => (
                    <div key={idx} className="bg-white shadow rounded overflow-hidden hover:shadow-lg">
                        <img src={pkg.img} alt={pkg.title} className="w-full h-48 object-cover" />
                        <div className="p-4 space-y-2">
                            <h3 className="font-semibold">{pkg.title}</h3>
                            <div className="flex gap-2 text-sm text-blue-600">
                                {pkg.tags.map((tag, i) => (
                                    <span key={i} className="bg-blue-100 px-2 py-1 rounded">{tag}</span>
                                ))}
                            </div>
                            <p className="text-sm text-gray-600">{pkg.duration}</p>
                            <p className="text-sm text-yellow-600">⭐ {pkg.rating} ({pkg.reviews})</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Recommendations;
