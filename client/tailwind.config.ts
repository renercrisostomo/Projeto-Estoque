import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}', // If you have a pages directory
  ],
  theme: {
    extend: {
      colors: {
        primary: '#458ac9',      // AntD primary
        secondary: '#6c757d',    // Neutral grey
        accent: '#FFC107',       // Muted gold/amber
        success: '#28a745',      // Green
        danger: '#dc3545',       // Red
        info: '#5091D8',         // Lighter blue
        light: '#f8f9fa',        // Very light grey
        dark: '#343a40',         // Dark grey
        neutral: {
          100: '#f1f5f9', // slate-100
          300: '#cbd5e1', // slate-300
          500: '#64748b', // slate-500
          700: '#334155', // slate-700
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
};
export default config;
