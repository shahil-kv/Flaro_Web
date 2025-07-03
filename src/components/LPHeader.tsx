import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Sun, Moon, Menu, X, Sparkles, ChevronRight, Home } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const LPHeader = () => {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        setMounted(true);

        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Add styles for mobile menu animations
    useEffect(() => {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideInFromRight {
                from {
                    opacity: 0;
                    transform: translateX(30px);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
            
            @keyframes fadeIn {
                from {
                    opacity: 0;
                }
                to {
                    opacity: 1;
                }
            }
            
            @keyframes slideDown {
                from {
                    opacity: 0;
                    transform: translateY(-10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            .mobile-menu-enter {
                animation: slideDown 0.3s ease-out;
            }
            
            .mobile-menu-backdrop {
                animation: fadeIn 0.3s ease-out;
            }
        `;
        document.head.appendChild(style);
        return () => {
            if (document.head.contains(style)) {
                document.head.removeChild(style);
            }
        };
    }, []);

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMobileMenuOpen]);

    if (!mounted) return null;

    const navItems = [
        { name: 'Features', href: '#features', icon: '✨' },
        { name: 'How it Works', href: '#how-it-works', icon: '⚡' },
        { name: 'Pricing', href: '#pricing', icon: '💰' },
        { name: 'Contact', href: '#contact', icon: '📞' }
    ];

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    return (
        <header
            className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled
                ? 'md:glass-card shadow-lg py-2'
                : 'bg-transparent py-4'
                }`}
        >
            <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center space-x-2 cursor-pointer">
                    <div className="w-10 h-10 rounded flex items-center justify-center shadow-sm bg-orange-600">
                        <Image src="/images/flaro-logo-white.svg" alt="Flaro Logo" width={32} height={32} />
                    </div>
                    <span className="text-4xl font-bold text-orange-600 dark:text-white">
                        flaro
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center space-x-8">
                    {navItems.map((item) => (
                        <a
                            key={item.name}
                            href={item.href}
                            className="text-gray-600 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 transition-all duration-300 relative group font-medium"
                            onClick={(e) => {
                                e.preventDefault();
                                const element = document.querySelector(item.href);
                                if (element) {
                                    element.scrollIntoView({ behavior: 'smooth' });
                                }
                            }}
                        >
                            {item.name}
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-600 transition-all duration-300 group-hover:w-full"></span>
                        </a>
                    ))}
                </nav>

                {/* Right Side Actions */}
                <div className="flex items-center space-x-4">
                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-xl glass-effect hover:bg-white/20 dark:hover:bg-gray-800/20 transition-all duration-300 relative overflow-hidden"
                        aria-label="Toggle theme"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-500/10 to-transparent" />
                        <div className="relative z-10">
                            {theme === 'dark' ? (
                                <Sun className="h-5 w-5 text-orange-500" />
                            ) : (
                                <Moon className="h-5 w-5 text-gray-600" />
                            )}
                        </div>
                    </button>

                    {/* Desktop Buttons */}
                    <div className="hidden md:flex items-center space-x-3">
                        <Link href="/login">
                            <Button variant="ghost" className="font-semibold text-gray-700 dark:text-gray-300 hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors px-5 py-2 rounded-lg">
                                Sign In
                            </Button>
                        </Link>
                        <Link href="/register">
                            <Button className="bg-orange-600 dark:bg-orange-600 hover:bg-orange-700 font-medium shadow-lg relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                                <span className="relative z-10 flex items-center">
                                    <Sparkles className="mr-2 h-4 w-4" />
                                    Get Started
                                </span>
                            </Button>
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 rounded-lg glass-effect transition-all duration-300 hover:scale-110"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label="Toggle mobile menu"
                    >
                        {isMobileMenuOpen ? (
                            <X className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                        ) : (
                            <Menu className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/60 z-40 mobile-menu-backdrop"
                        onClick={closeMobileMenu}
                    />

                    {/* Mobile Menu Content */}
                    <div className="fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-l border-gray-200/50 dark:border-gray-700/50 shadow-2xl z-50 mobile-menu-enter">
                        {/* Menu Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-200/80 dark:border-gray-700/80 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm">
                            <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 rounded bg-orange-600 flex items-center justify-center">
                                    <Image src="/images/flaro-logo-white.svg" alt="Flaro Logo" width={24} height={24} />
                                </div>
                                <span className="text-xl font-bold text-orange-600 dark:text-white">
                                    flaro
                                </span>
                            </div>
                            <button
                                onClick={closeMobileMenu}
                                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                aria-label="Close menu"
                            >
                                <X className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                            </button>
                        </div>

                        {/* Menu Content */}
                        <div className="flex flex-col h-max bg-white  dark:bg-gray-900">
                            {/* Navigation Links */}
                            <nav className="flex-1 px-6 py-6 space-y-2">
                                {/* Home Link */}
                                <Link href="/" onClick={closeMobileMenu}>
                                    <div className="flex items-center justify-between p-4 rounded-xl hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all duration-300 group">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                                                <Home className="h-4 w-4 text-orange-600" />
                                            </div>
                                            <span className="text-gray-700 dark:text-gray-200 font-medium">Home</span>
                                        </div>
                                        <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-orange-600 transition-colors" />
                                    </div>
                                </Link>

                                {navItems.map((item, index) => (
                                    <a
                                        key={item.name}
                                        href={item.href}
                                        className="block"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            closeMobileMenu();
                                            setTimeout(() => {
                                                const element = document.querySelector(item.href);
                                                if (element) {
                                                    element.scrollIntoView({ behavior: 'smooth' });
                                                }
                                            }, 300);
                                        }}
                                        style={{
                                            animationDelay: `${index * 0.1}s`,
                                            animation: 'slideInFromRight 0.4s ease-out forwards'
                                        }}
                                    >
                                        <div className="flex items-center justify-between p-4 rounded-xl hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all duration-300 group">
                                            <div className="flex items-center space-x-4">
                                                <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                                                    <span className="text-sm">{item.icon}</span>
                                                </div>
                                                <span className="text-gray-700 dark:text-gray-200 font-medium">{item.name}</span>
                                            </div>
                                            <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-orange-600 transition-colors" />
                                        </div>
                                    </a>
                                ))}
                            </nav>

                            {/* Theme Toggle */}
                            <div className="px-6 py-4 border-t border-gray-200/80 dark:border-gray-700/80 bg-white dark:bg-gray-900">
                                <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-800">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                                            {theme === 'dark' ? (
                                                <Moon className="h-4 w-4 text-orange-600" />
                                            ) : (
                                                <Sun className="h-4 w-4 text-orange-600" />
                                            )}
                                        </div>
                                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                            {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                                        </span>
                                    </div>
                                    <button
                                        onClick={toggleTheme}
                                        className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 dark:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                                        aria-label="Toggle theme"
                                    >
                                        <span
                                            className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform ${theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
                                                }`}
                                        />
                                    </button>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="px-6 py-6 space-y-3 border-t border-gray-200/80 dark:border-gray-700/80 gap-4 flex flex-col items-center justify-center  bg-white dark:bg-gray-900">
                                <Link className='w-full' href="/login" onClick={closeMobileMenu}>
                                    <Button
                                        variant="ghost"
                                        className="w-full justify-center font-semibold text-lg py-6 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all duration-300"
                                    >
                                        Sign In
                                    </Button>
                                </Link>
                                <Link className='w-full' href="/register" onClick={closeMobileMenu}>
                                    <Button className="w-full bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 font-semibold text-lg py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
                                        <span className="relative z-10 flex items-center justify-center">
                                            <Sparkles className="mr-3 h-5 w-5" />
                                            Get Started Free
                                        </span>
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </header>
    );
};

export default LPHeader;