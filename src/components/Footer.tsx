import { Facebook, Instagram } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-gray-200 py-10 mt-12">
            <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-3 gap-8">
                {/* Company Info */}
                <div>
                    <h3 className="text-xl font-semibold mb-3">DYC</h3>
                    <p className="text-sm">
                        Explore the world with us. Turning travel dreams into unforgettable adventures.
                    </p>
                </div>

                {/* Quick Links */}
                <div>
                    <h4 className="text-lg font-medium mb-2">Quick Links</h4>
                    <ul className="text-sm space-y-1">
                        <li><a href="/about-us" className="hover:underline">About Us</a></li>
                        <li><a href="/faq" className="hover:underline">FAQ</a></li>
                        <li><a href="#" className="hover:underline">Partners</a></li>
                        <li><a href="#" className="hover:underline">Contact</a></li>
                    </ul>
                </div>

                {/* Social Links */}
                <div>
                    <h4 className="text-lg font-medium mb-2">Follow Us</h4>
                    <div className="flex gap-4">
                        <a
                            href="https://www.facebook.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-blue-400"
                        >
                            <Facebook className="w-6 h-6" />
                        </a>
                        <a
                            href="https://www.instagram.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-pink-400"
                        >
                            <Instagram className="w-6 h-6" />
                        </a>
                    </div>
                </div>
            </div>

            <div className="text-center text-sm text-gray-500 mt-8">
                © {new Date().getFullYear()} DYC. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;
