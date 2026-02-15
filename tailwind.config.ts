
import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: {
				DEFAULT: '1rem',
				sm: '2rem',
				lg: '4rem',
				xl: '5rem',
				'2xl': '6rem',
			},
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				brown: {
					DEFAULT: '#875c51',
					50: '#f7f3f2',
					100: '#ebe2df',
					200: '#d7c5c0',
					300: '#c3a9a1',
					400: '#a47f73',
					500: '#875c51',
					600: '#7b5249',
					700: '#67443c',
					800: '#533832',
					900: '#402d28',
				},
				offwhite: '#f9f8f8',
				darkgray: '#473e38',
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
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
					'0%': { opacity: '0', transform: 'translateY(10px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' },
				},
				'fade-in-right': {
					'0%': { opacity: '0', transform: 'translateX(20px)' },
					'100%': { opacity: '1', transform: 'translateX(0)' },
				},
				'fade-in-left': {
					'0%': { opacity: '0', transform: 'translateX(-20px)' },
					'100%': { opacity: '1', transform: 'translateX(0)' },
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-10px)' },
				},
				'pulse-soft': {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.7' },
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.7s ease-out forwards',
				'fade-in-right': 'fade-in-right 0.7s ease-out forwards',
				'fade-in-left': 'fade-in-left 0.7s ease-out forwards',
				'float': 'float 6s ease-in-out infinite',
				'pulse-soft': 'pulse-soft 3s ease-in-out infinite',
			},
			fontFamily: {
				'inter': ['var(--font-inter)', 'Inter', 'sans-serif'],
				'playfair': ['var(--font-playfair)', 'Playfair Display', 'serif'],
			},
			fontSize: {
				// Escala tipográfica modular (Major Third 1.25)
				'xs': ['0.8rem', { lineHeight: '1.6' }],
				'sm': ['0.875rem', { lineHeight: '1.5' }],
				'base': ['1rem', { lineHeight: '1.5' }],
				'lg': ['1.125rem', { lineHeight: '1.5' }],
				'xl': ['1.25rem', { lineHeight: '1.4' }],
				'2xl': ['1.563rem', { lineHeight: '1.3' }],
				'3xl': ['1.953rem', { lineHeight: '1.2' }],
				'4xl': ['2.441rem', { lineHeight: '1.15' }],
				'5xl': ['3.052rem', { lineHeight: '1.1' }],
				'6xl': ['3.815rem', { lineHeight: '1.05' }],
			},
			maxWidth: {
				'prose': '66ch',
				'prose-narrow': '45ch',
				'prose-wide': '80ch',
			},
			letterSpacing: {
				'caps': '0.06em',
			},
			transitionDuration: {
				'400': '400ms',
			},
			boxShadow: {
				'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.06)',
				'medium': '0 8px 30px -4px rgba(0, 0, 0, 0.1)',
				'badge': '0 2px 8px -1px rgba(0, 0, 0, 0.1)',
			},
		}
	},
	plugins: [tailwindcssAnimate],
} satisfies Config;
