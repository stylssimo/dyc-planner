// src/components/Navbar.tsx
import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight, Info, Globe, User, LogIn, LayoutDashboard, Package, Handshake, Menu, Calendar, DollarSign } from 'lucide-react';
import { useCurrency } from '../contexts/CurrencyContext';

interface NavbarProps {
    isLoggedIn: boolean;
    loggedInUser: any;
    onLoginClick: () => void;
    onLogout: () => void;
    isSidebarCollapsed: boolean;
    setIsSidebarCollapsed: (collapsed: boolean) => void;
}

const Navbar: React.FC<NavbarProps> = ({
    isLoggedIn,
    loggedInUser,
    onLoginClick,
    onLogout,
    isSidebarCollapsed,
    setIsSidebarCollapsed,
}) => {
    const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);

    const { currency, toggleCurrency } = useCurrency();

    const { i18n, t } = useTranslation();
    const [showLangMenu, setShowLangMenu] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const langMenuRef = useRef<HTMLDivElement>(null);
    const profileMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
                setShowLangMenu(false);
            }
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
                setShowProfileMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
        setShowLangMenu(false);
    };

    const menuItems = [
        { label: t('nav.dashboard'), icon: <LayoutDashboard size={20} />, href: '/admin/dashboard' },
        { label: t('nav.consultations'), icon: <Info size={20} />, href: '/admin/consultations' },
        { label: t('nav.trips'), icon: <Package size={20} />, href: '/admin/trips' },
        { label: t('nav.jobs'), icon: <Handshake size={20} />, href: '/admin/jobs' },
        { label: t('nav.cv'), icon: <Handshake size={20} />, href: '/admin/cv' },
        { label: t('nav.calendar'), icon: <Calendar size={20} />, href: '/admin/calendar' },
        { label: 'User Screen', icon: <User size={20} />, href: '/' },
    ];

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="fixed top-0 left-0 h-full bg-white shadow-md z-50 hidden md:flex flex-col justify-between transition-all duration-300"
                style={{ width: isSidebarCollapsed ? '80px' : '250px' }}>
                <div>
                    <div className="flex items-center justify-between p-4 border-b">
                        <span className="font-bold text-blue-700 text-lg flex items-center gap-2">
                            <img src="/logo.png" alt="DYC" className="w-6 h-6" />
                            {!isSidebarCollapsed && 'DYC'}
                        </span>
                        <button onClick={toggleSidebar} className="text-gray-500 transition-transform duration-200 hover:scale-110">
                            {isSidebarCollapsed ? <ChevronRight /> : <ChevronLeft />}
                        </button>
                    </div>

                    <nav className="flex flex-col gap-2 p-4">
                        {menuItems.map((item, idx) => {
                            // if (item.auth && !isLoggedIn) return null;
                            // if (item.admin && loggedInUser?.role !== 'admin') return null;
                            return (
                                <a
                                    key={idx}
                                    href={item.href}
                                    className="flex items-center gap-2 text-gray-700 hover:bg-gray-100 px-2 py-2 rounded-md transition-colors duration-200"
                                >
                                    {item.icon}
                                    {!isSidebarCollapsed && <span className="transition-opacity duration-300">{item.label}</span>}
                                </a>
                            );
                        })}
                    </nav>
                </div>

                <div className="flex flex-col gap-2 p-4 border-t">
                    {isLoggedIn && loggedInUser?.picture && (
                        <div className="relative" ref={profileMenuRef}>
                            <button onClick={() => setShowProfileMenu(prev => !prev)} className="flex items-center gap-2 transition-colors duration-200 hover:bg-gray-100 px-2 py-2 rounded-md">
                                <img src={loggedInUser.picture} alt="Profile" className="w-8 h-8 rounded-full object-cover" />
                                {!isSidebarCollapsed && (
                                    <span className="text-sm text-gray-700 truncate transition-opacity duration-300">{loggedInUser.name}</span>
                                )}
                            </button>
                            {showProfileMenu && (
                                <div className="absolute bottom-12 left-0 bg-white border rounded shadow text-sm px-2 py-1 z-50 min-w-[120px] animate-fadeIn">
                                    <button
                                        onClick={onLogout}
                                        className="block w-full text-left px-2 py-1 hover:bg-gray-100 text-red-600 transition-colors duration-150"
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    <button
                        onClick={() => {
                            toggleCurrency();
                        }}
                        className="flex items-center gap-2 text-gray-700 hover:bg-gray-100 px-2 py-2 rounded-md transition-colors duration-200">
                        <DollarSign size={20} />
                        {currency === 'USD' ? 'USD' : 'MNT'}
                    </button>

                    {!isLoggedIn && (
                        <button onClick={onLoginClick} className="flex items-center gap-2 text-gray-700 hover:bg-gray-100 px-2 py-2 rounded-md transition-colors duration-200">
                            <User size={20} />
                            {!isSidebarCollapsed && <span className="transition-opacity duration-300">{t('loginModal.loginButton')}</span>}
                        </button>
                    )}

                    <div className="relative" ref={langMenuRef}>
                        <button
                            onClick={() => setShowLangMenu(prev => !prev)}
                            className="flex items-center gap-2 text-gray-700 hover:bg-gray-100 px-2 py-2 rounded-md transition-colors duration-200"
                        >
                            <Globe size={20} />
                            {!isSidebarCollapsed && <span className="transition-opacity duration-300">{t('nav.language') || 'Language'}</span>}
                        </button>
                        {showLangMenu && (
                            <div className="absolute bottom-12 left-0 bg-white border rounded shadow text-sm px-2 py-1 z-50 min-w-[120px] animate-fadeIn">
                                <button
                                    onClick={() => changeLanguage('en')}
                                    className={`block w-full text-left px-2 py-1 hover:bg-gray-100 transition-colors duration-150 ${i18n.language === 'en' ? 'font-bold text-blue-700' : ''}`}
                                >
                                    English
                                </button>
                                <button
                                    onClick={() => changeLanguage('mn')}
                                    className={`block w-full text-left px-2 py-1 hover:bg-gray-100 transition-colors duration-150 ${i18n.language === 'mn' ? 'font-bold text-blue-700' : ''}`}
                                >
                                    Монгол
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </aside>

            {/* Mobile Topbar */}
            <div className="md:hidden fixed top-0 left-0 right-0 bg-white shadow z-40 flex justify-between items-center px-4 py-2">
                <button 
                    onClick={toggleSidebar}
                    className="transition-transform duration-200 hover:scale-110 active:scale-95"
                >
                    {isSidebarCollapsed ? <Menu /> : <ChevronLeft />}
                </button>
                <span className="text-lg font-semibold text-blue-700 flex items-center gap-2">
                    <img src="/logo.png" alt="DYC" className="w-6 h-6" />
                    {'DYC'}
                </span>
                {isLoggedIn && loggedInUser?.picture ? (
                    <button 
                        onClick={() => setShowProfileMenu(prev => !prev)}
                        className="transition-transform duration-200 hover:scale-110 active:scale-95"
                    >
                        <img src={loggedInUser.picture} alt="Profile" className="w-8 h-8 rounded-full" />
                    </button>
                ) : (
                    <button 
                        onClick={onLoginClick}
                        className="transition-transform duration-200 hover:scale-110 active:scale-95"
                    >
                        <LogIn size={24} />
                    </button>
                )}
            </div>

            {/* Mobile Sidebar Overlay */}
            <div 
                className={`fixed inset-0 z-30 bg-black transition-opacity duration-300 md:hidden ${
                    !isSidebarCollapsed ? 'bg-opacity-40 opacity-100' : 'bg-opacity-0 opacity-0 pointer-events-none'
                }`}
                onClick={toggleSidebar}
            >
                <div 
                    className={`bg-white h-full w-64 shadow-xl transform transition-transform duration-300 ease-in-out ${
                        !isSidebarCollapsed ? 'translate-x-0' : '-translate-x-full'
                    }`}
                    onClick={e => e.stopPropagation()}
                >
                    <div className="p-4 border-b flex justify-between items-center">
                        <span className="font-bold text-blue-700 text-lg flex items-center gap-2">
                            <img src="/logo.png" alt="DYC" className="w-6 h-6" />
                            <span className="animate-slideInRight">DYC</span>
                        </span>
                        <button 
                            onClick={toggleSidebar} 
                            className="text-gray-500 transition-transform duration-200 hover:scale-110 hover:rotate-90"
                        >
                            ✖
                        </button>
                    </div>
                    <nav className="flex flex-col gap-2 p-4">
                        {menuItems.map((item, idx) => {
                            // if (item.auth && !isLoggedIn) return null;
                            // if (item.admin && loggedInUser?.role !== 'admin') return null;
                            return (
                                <a 
                                    key={idx} 
                                    href={item.href} 
                                    className="flex items-center gap-2 text-gray-700 hover:bg-gray-100 px-2 py-2 rounded-md transition-all duration-200 hover:translate-x-1 hover:shadow-sm"
                                    style={{
                                        animationDelay: `${idx * 50}ms`,
                                        animation: !isSidebarCollapsed ? 'slideInFromLeft 0.3s ease-out forwards' : ''
                                    }}
                                >
                                    <span className="transition-transform duration-200 group-hover:scale-110">{item.icon}</span>
                                    <span>{item.label}</span>
                                </a>
                            );
                        })}
                        <div 
                            className="mt-4 border-t pt-4"
                            style={{
                                animationDelay: `${menuItems.length * 50 + 100}ms`,
                                animation: !isSidebarCollapsed ? 'slideInFromLeft 0.3s ease-out forwards' : ''
                            }}
                        >
                            {isLoggedIn ? (
                                <button 
                                    onClick={onLogout} 
                                    className="flex items-center gap-2 text-red-600 hover:bg-red-50 px-2 py-2 rounded-md transition-all duration-200 hover:translate-x-1 w-full"
                                >
                                    <span className="transition-transform duration-200 group-hover:scale-110">🚪</span>
                                    Logout
                                </button>
                            ) : (
                                <button 
                                    onClick={onLoginClick} 
                                    className="flex items-center gap-2 text-gray-700 hover:bg-gray-100 px-2 py-2 rounded-md transition-all duration-200 hover:translate-x-1 w-full"
                                >
                                    <LogIn size={20} className="transition-transform duration-200 group-hover:scale-110" />
                                    <span>{t('loginModal.loginButton')}</span>
                                </button>
                            )}
                        </div>
                    </nav>
                </div>
            </div>
        </>
    );
};

export default Navbar;