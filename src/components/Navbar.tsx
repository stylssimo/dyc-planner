// src/components/Navbar.tsx
import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight, Home, Info, Globe, LogIn, LayoutDashboard, User, ShieldCheck, Package, Settings, Handshake, Menu } from 'lucide-react';

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
        { label: t('nav.home'), icon: <Home size={20} />, href: '/' },
        { label: t('nav.about'), icon: <Info size={20} />, href: '/about' },
        { label: t('nav.packages'), icon: <Package size={20} />, href: '/packages' },
        { label: t('nav.services'), icon: <Settings size={20} />, href: '/services' },
        { label: t('nav.partners'), icon: <Handshake size={20} />, href: '/partners' },
        { label: t('nav.dashboard'), icon: <LayoutDashboard size={20} />, href: '/dashboard', auth: true },
        { label: t('nav.admin'), icon: <ShieldCheck size={20} />, href: '/admin', admin: true },
    ];

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="fixed top-0 left-0 h-full bg-white shadow-md z-50 hidden md:flex flex-col justify-between transition-all duration-300"
                style={{ width: isSidebarCollapsed ? '80px' : '250px' }}>
                <div>
                    <div className="flex items-center justify-between p-4 border-b">
                        <span className="font-bold text-blue-700 text-lg">{!isSidebarCollapsed && 'DYC'}</span>
                        <button onClick={toggleSidebar} className="text-gray-500">
                            {isSidebarCollapsed ? <ChevronRight /> : <ChevronLeft />}
                        </button>
                    </div>

                    <nav className="flex flex-col gap-2 p-4">
                        {menuItems.map((item, idx) => {
                            if (item.auth && !isLoggedIn) return null;
                            if (item.admin && loggedInUser?.role !== 'admin') return null;
                            return (
                                <a
                                    key={idx}
                                    href={item.href}
                                    className="flex items-center gap-2 text-gray-700 hover:bg-gray-100 px-2 py-2 rounded-md"
                                >
                                    {item.icon}
                                    {!isSidebarCollapsed && <span>{item.label}</span>}
                                </a>
                            );
                        })}
                    </nav>
                </div>

                <div className="flex flex-col gap-2 p-4 border-t">
                    {isLoggedIn && loggedInUser?.picture && (
                        <div className="relative" ref={profileMenuRef}>
                            <button onClick={() => setShowProfileMenu(prev => !prev)} className="flex items-center gap-2">
                                <img src={loggedInUser.picture} alt="Profile" className="w-8 h-8 rounded-full object-cover" />
                                {!isSidebarCollapsed && (
                                    <span className="text-sm text-gray-700 truncate">{loggedInUser.name}</span>
                                )}
                            </button>
                            {showProfileMenu && (
                                <div className="absolute bottom-12 left-0 bg-white border rounded shadow text-sm px-2 py-1 z-50 min-w-[120px]">
                                    <button
                                        onClick={onLogout}
                                        className="block w-full text-left px-2 py-1 hover:bg-gray-100 text-red-600"
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {!isLoggedIn && (
                        <button onClick={onLoginClick} className="flex items-center gap-2 text-gray-700 hover:bg-gray-100 px-2 py-2 rounded-md">
                            <LogIn size={20} />
                            {!isSidebarCollapsed && <span>{t('loginModal.loginButton')}</span>}
                        </button>
                    )}

                    <div className="relative" ref={langMenuRef}>
                        <button
                            onClick={() => setShowLangMenu(prev => !prev)}
                            className="flex items-center gap-2 text-gray-700 hover:bg-gray-100 px-2 py-2 rounded-md"
                        >
                            <Globe size={20} />
                            {!isSidebarCollapsed && <span>{t('nav.language') || 'Language'}</span>}
                        </button>
                        {showLangMenu && (
                            <div className="absolute bottom-12 left-0 bg-white border rounded shadow text-sm px-2 py-1 z-50 min-w-[120px]">
                                <button
                                    onClick={() => changeLanguage('en')}
                                    className={`block w-full text-left px-2 py-1 hover:bg-gray-100 ${i18n.language === 'en' ? 'font-bold text-blue-700' : ''}`}
                                >
                                    English
                                </button>
                                <button
                                    onClick={() => changeLanguage('mn')}
                                    className={`block w-full text-left px-2 py-1 hover:bg-gray-100 ${i18n.language === 'mn' ? 'font-bold text-blue-700' : ''}`}
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
                <button onClick={toggleSidebar}>
                    {isSidebarCollapsed ? <Menu /> : <ChevronLeft />}
                </button>
                <span className="text-lg font-semibold text-blue-700">DYC</span>
                {isLoggedIn && loggedInUser?.picture ? (
                    <button onClick={() => setShowProfileMenu(prev => !prev)}>
                        <img src={loggedInUser.picture} alt="Profile" className="w-8 h-8 rounded-full" />
                    </button>
                ) : (
                    <button onClick={onLoginClick}>
                        <LogIn size={24} />
                    </button>
                )}
            </div>

            {/* Mobile Sidebar Overlay */}
            {!isSidebarCollapsed && (
                <div className="fixed inset-0 z-30 bg-black bg-opacity-40 md:hidden" onClick={toggleSidebar}>
                    <div className="bg-white h-full w-64 shadow-md" onClick={e => e.stopPropagation()}>
                        <div className="p-4 border-b flex justify-between items-center">
                            <span className="font-bold text-blue-700 text-lg">DYC</span>
                            <button onClick={toggleSidebar} className="text-gray-500">
                                ✖
                            </button>
                        </div>
                        <nav className="flex flex-col gap-2 p-4">
                            {menuItems.map((item, idx) => {
                                if (item.auth && !isLoggedIn) return null;
                                if (item.admin && loggedInUser?.role !== 'admin') return null;
                                return (
                                    <a key={idx} href={item.href} className="flex items-center gap-2 text-gray-700 hover:bg-gray-100 px-2 py-2 rounded-md">
                                        {item.icon}
                                        <span>{item.label}</span>
                                    </a>
                                );
                            })}
                            <div className="mt-4 border-t pt-4">
                                {isLoggedIn ? (
                                    <button onClick={onLogout} className="flex items-center gap-2 text-red-600 hover:bg-red-50 px-2 py-2 rounded-md">
                                        Logout
                                    </button>
                                ) : (
                                    <button onClick={onLoginClick} className="flex items-center gap-2 text-gray-700 hover:bg-gray-100 px-2 py-2 rounded-md">
                                        <LogIn size={20} />
                                        <span>{t('loginModal.loginButton')}</span>
                                    </button>
                                )}
                            </div>
                        </nav>
                    </div>
                </div>
            )}
        </>
    );
};

export default Navbar;