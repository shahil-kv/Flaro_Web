import type { Config } from 'tailwindcss';

export default {
	darkMode: 'class',
	content: [
		'./src/pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/components/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/app/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
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
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
			},
			backgroundImage: {
				'animated-texture': `
          radial-gradient(circle at 25% 25%, rgba(255, 0, 0, 0.12) 0%, transparent 50%),
          radial-gradient(circle at 75% 75%, rgba(255, 0, 0, 0.08) 0%, transparent 50%)`,
				'animated-texture-dark': `
          radial-gradient(circle at 25% 25%, rgba(255, 0, 0, 0.18) 0%, transparent 50%),
          radial-gradient(circle at 75% 75%, rgba(255, 0, 0, 0.15) 0%, transparent 50%)`,
				'bg-texture': `
          radial-gradient(circle at 20% 30%, rgba(255, 0, 0, 0.08) 0%, transparent 40%),
          radial-gradient(circle at 80% 70%, rgba(255, 0, 0, 0.06) 0%, transparent 40%),
          radial-gradient(circle at 60% 20%, rgba(255, 0, 0, 0.07) 0%, transparent 30%)`,
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' },
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' },
				},
				'fade-in': {
					'0%': { opacity: '0', transform: 'translateY(20px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' },
				},
				float: {
					'0%, 100%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-20px)' },
				},
				spinCustom: {
					'0%': { transform: 'rotate(0deg) scale(1)' },
					'50%': { transform: 'rotate(360deg) scale(2)' },
					'100%': { transform: 'rotate(0deg) scale(1)' },
				},
				wave: {
					'0%, 100%': { transform: 'scaleY(0.4)' },
					'50%': { transform: 'scaleY(1.2)' },
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.8s ease-out',
				float: 'float 6s ease-in-out infinite',
				spinCustom: 'spinCustom 2s infinite',
				wave: 'wave 1.2s ease-in-out infinite',
			},
		},
	},
	// eslint-disable-next-line @typescript-eslint/no-require-imports
	plugins: [require('tailwindcss-animate')],
} satisfies Config;