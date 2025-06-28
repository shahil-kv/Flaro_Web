
import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Sun, Moon, Menu, X, Sparkles } from 'lucide-react';
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

    if (!mounted) return null;

    const navItems = [
        { name: 'Features', href: '#features' },
        { name: 'How it Works', href: '#how-it-works' },
        { name: 'Pricing', href: '#pricing' },
        { name: 'Contact', href: '#contact' }
    ];

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    return (
        <header
            className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled
                ? 'glass-card shadow-lg py-2'
                : 'bg-transparent py-4'
                }`}
        >
            <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
                {/* Logo */}
                <div
                    className="flex items-center space-x-2 "
                >
                    <div
                        className="w-10 h-10 rounded flex items-center justify-center shadow-sm bg-orange-600"
                    >
                        <Image src="/images/flaro-logo-white.svg" alt="Flaro Logo" width={32} height={32} />
                    </div>
                    <span className="text-4xl font-bold text-orange-600 dark:text-white">
                        flaro
                    </span>
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center space-x-8">
                    {navItems.map((item) => (
                        <a
                            key={item.name}
                            href={item.href}
                            className="text-gray-600 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 transition-all duration-300 relative group font-medium"
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
                    >
                        <div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-500/10 to-transparent"
                        />
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
                        <div >
                            <Button variant="ghost" className="font-semibold text-gray-700 dark:text-gray-300 hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors px-5 py-2 rounded-lg">
                                <Link href="/login">
                                    Sign In
                                </Link>
                            </Button>
                        </div>
                        <div >
                            <Button className="bg-orange-600 dark:bg-orange-600 hover:bg-orange-700 font-medium shadow-lg relative overflow-hidden">
                                <Link href="/register">
                                    <div
                                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                                    />
                                    <span className="relative z-10 flex items-center">
                                        <Sparkles className="mr-2 h-4 w-4" />
                                        Get Started
                                    </span></Link>
                            </Button>
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 rounded-lg glass-effect transition-colors"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div
                    className="md:hidden glass-card border-t border-gray-200/20 dark:border-gray-800/20"

                >
                    <div className="px-6 py-6 space-y-4">
                        {navItems.map((item) => (
                            <a
                                key={item.name}
                                href={item.href}
                                className="block text-gray-600 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors py-2 font-medium"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                {item.name}
                            </a>
                        ))}
                        <div className="flex flex-col space-y-3 pt-4">
                            <Button variant="ghost" className="w-full justify-start font-medium">Sign In</Button>
                            <Button className="w-full bg-orange-600 hover:bg-orange-700 font-medium">
                                <Sparkles className="mr-2 h-4 w-4" />
                                Get Started
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

export default LPHeader;
