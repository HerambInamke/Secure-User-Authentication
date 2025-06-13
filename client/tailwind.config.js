/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6B46C1',
          dark: '#553C9A',
          light: '#9F7AEA'
        },
        secondary: {
          DEFAULT: '#3B82F6',
          dark: '#2563EB',
          light: '#60A5FA'
        },
        accent: {
          DEFAULT: '#F59E0B',
          dark: '#D97706',
          light: '#FBBF24'
        },
        success: {
          DEFAULT: '#10B981',
          dark: '#059669',
          light: '#34D399'
        },
        warning: {
          DEFAULT: '#F97316',
          dark: '#EA580C',
          light: '#FB923C'
        },
        error: {
          DEFAULT: '#DC2626',
          dark: '#B91C1C',
          light: '#EF4444'
        },
        dark: {
          DEFAULT: '#1F2937',
          darker: '#111827',
          lighter: '#374151'
        },
        light: {
          DEFAULT: '#F8FAFC',
          darker: '#F1F5F9',
          lighter: '#FFFFFF'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif']
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
      },
      backdropBlur: {
        'glass': '4px'
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms')
  ],
} 