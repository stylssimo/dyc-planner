// src/components/Categories.tsx
import React from 'react';

const categories = [
    { title: 'Seight Seeing', count: 120, img: 'https://source.unsplash.com/400x300/?sightseeing' },
    { title: 'City Tour', count: 200, img: 'https://source.unsplash.com/400x300/?city,tour' },
    { title: 'Train Experience', count: 80, img: 'https://source.unsplash.com/400x300/?train,travel' },
    { title: 'One Day Activities', count: 120, img: 'https://source.unsplash.com/400x300/?activity' },
    { title: 'Family Tour', count: 10, img: 'https://source.unsplash.com/400x300/?family,vacation' },
];

const Categories = () => {
    return (
        <section className="py-12 max-w-6xl mx-auto">
            <div className="flex gap-6 overflow-x-auto scrollbar-hide px-4">
                {categories.map((item, idx) => (
                    <div key={idx} className="min-w-[200px] flex-shrink-0 bg-white rounded shadow hover:shadow-lg">
                        <img src={item.img} alt={item.title} className="w-full h-36 object-cover rounded-t" />
                        <div className="p-4">
                            <h3 className="font-semibold">{item.title}</h3>
                            <p className="text-sm text-gray-500">{item.count} Packages</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Categories;
