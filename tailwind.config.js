import daisyui from 'daisyui';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],

  theme: {
    extend: {
      fontFamily: {
        sans:    ['DM Sans', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif:   ['Cormorant Garamond', 'Georgia', 'ui-serif', 'serif'],
        display: ['Cormorant Garamond', 'Georgia', 'ui-serif', 'serif']
      },
      colors: {
        cream:     '#FAF6F0',
        beige:     '#EDE0CC',
        brown:     '#7C5232',
        earth:     '#4A2C17',
        sand:      '#C8A882',
        lightsand: '#D4B896',
        nearblack: '#2A1A0E',
        midbrown:  '#6B4431',
        surface:   '#F5EDE0'
      }
    }
  },

  plugins: [daisyui],

  daisyui: {
    themes: [
      {
        altholz: {
          'primary':          '#7C5232',
          'primary-content':  '#FAF6F0',
          'secondary':        '#C8A882',
          'secondary-content':'#2A1A0E',
          'accent':           '#D4B896',
          'accent-content':   '#2A1A0E',
          'neutral':          '#4A2C17',
          'neutral-content':  '#FAF6F0',
          'base-100':         '#FAF6F0',
          'base-200':         '#EDE0CC',
          'base-300':         '#D4B896',
          'base-content':     '#2A1A0E',
          'info':             '#6B4431',
          'success':          '#7C5232',
          'warning':          '#C8A882',
          'error':            '#4A2C17',
          '--rounded-box':    '0.5rem',
          '--rounded-btn':    '0.375rem',
          '--animation-btn':  '0.2s'
        }
      }
    ],
    logs: false
  }
};
