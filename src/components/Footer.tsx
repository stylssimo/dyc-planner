// src/components/Footer.tsx
import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-gray-200 py-10 mt-12">
            <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-3 gap-8">
                <div>
                    <h3 className="text-xl font-semibold mb-3">DYC</h3>
                    <p className="text-sm">
                        Explore the world with us. Turning travel dreams into unforgettable adventures.
                    </p>
                </div>
                <div>
                    <h4 className="text-lg font-medium mb-2">Quick Links</h4>
                    <ul className="text-sm space-y-1">
                        <li><a href="#" className="hover:underline">About Us</a></li>
                        <li><a href="#" className="hover:underline">Packages</a></li>
                        <li><a href="#" className="hover:underline">Partners</a></li>
                        <li><a href="#" className="hover:underline">Contact</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="text-lg font-medium mb-2">Follow Us</h4>
                    <div className="flex gap-4 text-2xl">
                        <a href="#" className="hover:text-blue-400">🌐</a>
                        <a href="#" className="hover:text-blue-400">🐦</a>
                        <a href="#" className="hover:text-blue-400">📸</a>
                    </div>
                </div>
            </div>
            <div className="text-center text-sm text-gray-500 mt-8">
                © {new Date().getFullYear()} Travel Treasures. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;
