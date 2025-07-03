import { Link } from 'react-router-dom';
import { FaFacebookF, FaLinkedinIn, FaInstagram } from 'react-icons/fa';
import { PiXLogoBold } from 'react-icons/pi';

export default function Footer() {
    return (
        <footer className="bg-green-200 text-gray-700">
            <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">

                {/* Logo / About */}
                <div>
                    <h2 className="text-2xl font-bold text-green-700 mb-2">
                        <img
                            src="/src/assets/Logo/logo.svg" // <- Ensure this file is in your /public directory
                            alt="Xcellytics Logo"
                            className="h-10 w-auto"
                        />
                    </h2>
                    <p className="text-sm">
                        Upload Excel files, generate charts, and gain insights with ease.
                    </p>
                </div>

                {/* Navigation Links */}
                <div>
                    <h3 className="font-semibold text-lg mb-2">Quick Links</h3>
                    <ul className="space-y-2 text-sm">
                        <li><Link to="/" className="hover:text-green-600 transition">Home</Link></li>
                        <li><Link to="/features" className="hover:text-green-600 transition">Features</Link></li>
                        <li><Link to="/about" className="hover:text-green-600 transition">About Us</Link></li>
                        <li><Link to="/contact" className="hover:text-green-600 transition">Contact</Link></li>
                        <li><Link to="/register" className="hover:text-green-600 transition">Register</Link></li>
                    </ul>
                </div>

                {/* Social Icons */}
                <div>
                    <h3 className="font-semibold text-lg mb-2">Follow Us</h3>
                    <div className="flex gap-4 text-xl text-green-700">
                        <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" className="hover:text-green-500 transition"><FaFacebookF /></a>
                        <a href="https://x.com/" target="_blank" rel="noopener noreferrer" className="hover:text-green-500 transition"><PiXLogoBold /></a>
                        <a href="https://linkedin.com/" target="_blank" rel="noopener noreferrer" className="hover:text-green-500 transition"><FaLinkedinIn /></a>
                        <a href="https://instagram.com/" target="_blank" rel="noopener noreferrer" className="hover:text-green-500 transition"><FaInstagram /></a>
                    </div>

                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-gray-200 py-4 text-center text-sm text-gray-500">
                © {new Date().getFullYear()} ExcelAnalytics. All rights reserved.
            </div>
        </footer>
    );
}
