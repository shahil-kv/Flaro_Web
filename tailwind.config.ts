import type { Config } from 'tailwindcss';
import tailwindcssAnimate from 'tailwindcss-animate';

export default {
	darkMode: 'class',
	// Optimized content paths
	content: [
		'./src/**/*.{js,ts,jsx,tsx,mdx}',
		'./components/**/*.{js,ts,jsx,tsx,mdx}',
		'./app/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/components/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/app/**/*.{js,ts,jsx,tsx,mdx}',
	],
	// Safelist critical utilities for better performance
	safelist: [
		'mobile-container',
		'mobile-safe',
		'touch-target',
		'glass',
		'fade-in',
		'slide-in',
		'glow',
	],
	theme: {
		container: {
			center: true,
			padding: {
				DEFAULT: '1rem',
				sm: '1.5rem',
				lg: '2rem',
				xl: '2.5rem',
				'2xl': '3rem',
			},
			screens: {
				sm: '640px',
				md: '768px',
				lg: '1024px',
				xl: '1280px',
				'2xl': '1400px',
			},
		},
		extend: {
			fontFamily: {
				sans: ['var(--font-open-sauce-one)', 'Open Sans', 'system-ui', '-apple-system', 'sans-serif'],
				'open-sauce': ['var(--font-open-sauce-one)', 'sans-serif'],
			},
			textColor: {
				primary: 'hsl(var(--primary-foreground))',
				secondary: 'hsl(var(--secondary-foreground))',
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',

				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))',
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))',
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))',
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))',
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))',
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))',
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))',
				},
				orange: {
					50: '#fff4f0',
					100: '#ffe0d6',
					200: '#ffc0ad',
					300: '#ff9966',
					400: '#ff6f33',
					500: '#ff471a',
					600: '#ff0000',
					700: '#cc0000',
					800: '#990000',
					900: '#660000',
					950: '#330000',
				},
				blue: {
					50: '#eff6ff',
					100: '#dbeafe',
					200: '#bfdbfe',
					300: '#93c5fd',
					400: '#60a5fa',
					500: '#3b82f6',
					600: '#2563eb',
					700: '#1d4ed8',
					800: '#1e40af',
					900: '#1e3a8a',
					950: '#172554',
				},
				purple: {
					50: '#faf5ff',
					100: '#f3e8ff',
					200: '#e9d5ff',
					300: '#d8b4fe',
					400: '#c084fc',
					500: '#a855f7',
					600: '#9333ea',
					700: '#7c3aed',
					800: '#6b21a8',
					900: '#581c87',
					950: '#3b0764',
				},
				gray: {
					50: '#f9fafb',
					100: '#f3f4f6',
					200: '#e5e7eb',
					300: '#d1d5db',
					400: '#9ca3af',
					500: '#6b7280',
					600: '#4b5563',
					700: '#374151',
					800: '#1f2937',
					900: '#111827',
					950: '#030712',
				},
			},

			// Optimized border radius
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
			},

			// Simplified spacing scale
			spacing: {
				'18': '4.5rem',
				'88': '22rem',
				'128': '32rem',
			},

			// Mobile-optimized screen sizes
			screens: {
				xs: '475px',
				'3xl': '1600px',
			},

			// Optimized keyframes - fewer, simpler animations
			keyframes: {
				'fade-in': {
					'0%': { opacity: '0', transform: 'translateY(10px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' },
				},
				'slide-in': {
					'0%': { transform: 'translateX(-20px)', opacity: '0' },
					'100%': { transform: 'translateX(0)', opacity: '1' },
				},
				'gentle-float': {
					'0%, 100%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-10px)' },
				},
				'pulse-soft': {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.8' },
				},
				// Accordion animations for UI components
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' },
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' },
				},
			},

			// Optimized animations
			animation: {
				'fade-in': 'fade-in 0.3s ease-out',
				'slide-in': 'slide-in 0.3s ease-out',
				'float': 'gentle-float 4s ease-in-out infinite',
				'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
			},

			// Optimized backdrop blur
			backdropBlur: {
				xs: '2px',
				sm: '4px',
				md: '8px',
				lg: '12px',
				xl: '16px',
			},

			// Box shadow optimization
			boxShadow: {
				'mobile': '0 2px 8px rgba(0, 0, 0, 0.1)',
				'mobile-lg': '0 4px 16px rgba(0, 0, 0, 0.15)',
				'glow': '0 0 20px rgba(255, 102, 0, 0.3)',
				'glow-red': '0 0 20px rgba(255, 0, 0, 0.3)',
			},

			// Typography optimization
			fontSize: {
				'mobile-xs': ['0.75rem', { lineHeight: '1rem' }],
				'mobile-sm': ['0.875rem', { lineHeight: '1.25rem' }],
				'mobile-base': ['1rem', { lineHeight: '1.5rem' }],
				'mobile-lg': ['1.125rem', { lineHeight: '1.75rem' }],
				'mobile-xl': ['1.25rem', { lineHeight: '1.75rem' }],
				'mobile-2xl': ['1.5rem', { lineHeight: '2rem' }],
			},
		},
	},

	plugins: [
		tailwindcssAnimate,

		// Custom plugin for mobile optimizations
		function ({ addUtilities }: import('tailwindcss/types/config').PluginAPI) {
			const mobileUtilities = {
				'.mobile-container': {
					width: '100%',
					maxWidth: '100vw',
					padding: '0 1rem',
					overflowX: 'hidden',
				},
				'.mobile-safe': {
					paddingLeft: 'max(1rem, env(safe-area-inset-left))',
					paddingRight: 'max(1rem, env(safe-area-inset-right))',
					paddingBottom: 'env(safe-area-inset-bottom)',
				},
				'.touch-target': {
					minHeight: '44px',
					minWidth: '44px',
					touchAction: 'manipulation',
				},
				'.glass': {
					background: 'var(--glass-bg)',
					backdropFilter: 'blur(10px)',
					WebkitBackdropFilter: 'blur(10px)',
					border: '1px solid var(--glass-border)',
					boxShadow: '0 4px 16px var(--glass-shadow)',
				},
				'.no-scroll': {
					msOverflowStyle: 'none',
					scrollbarWidth: 'none',
					'&::-webkit-scrollbar': {
						display: 'none',
					},
				},
			};

			addUtilities(mobileUtilities)
		}
	],

	// Purge unused styles more aggressively
	future: {
		hoverOnlyWhenSupported: true,
	},
} satisfies Config;