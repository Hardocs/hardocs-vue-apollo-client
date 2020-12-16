/* eslint-disable prettier/prettier */
/*
 ** TailwindCSS Configuration File
 **
 ** Docs: https://tailwindcss.com/docs/configuration
 ** Default: https://github.com/tailwindcss/tailwindcss/blob/master/stubs/defaultConfig.stub.js
 */
module.exports = {
  future: {
    // their request from Tailwind as they transition
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true
  },
  theme: {
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px'
    },
    fontFamily: {
      display: ['Gilroy', 'sans-serif'],
      body: ['Graphik', 'sans-serif']
    },
    borderWidth: {
      default: '1px',
      '0': '0',
      '2': '2px',
      '4': '4px'
    },
    extend: {
      colors: {
        primary: {
          100: 'var(--primary100) !important',
          75: 'var(--primary75) !important',
          50: 'var(--primary50) !important',
          25: 'var(--primary25) !important',
          10: 'var(--primary10) !important'
        },
        ui: {
          background: 'var(--color-ui-background)',
          sidebar: 'var(--color-ui-sidebar)',
          typo: 'var(--color-ui-typo)',
          primary: 'var(--color-ui-primary)',
          border: 'var(--color-ui-border)'
        },
        accent: {
          100: 'var(--accent100) !important',
          75: 'var(--accent75) !important',
          50: 'var(--accent50) !important',
          25: 'var(--accent25) !important'
        },
        gray: {
          100: 'var(--gray100) !important',
          75: 'var(--gray75) !important',
          50: 'var(--gray50) !important',
          25: 'var(--gray25) !important',
          15: 'var(--gray15) !important',
          10: 'var(--gray10) !important'
        },
        white: 'var(--white) !important'
      },
      borderRadius: {
        '2xl': '20px',
        xl: '16px'
      },
      boxShadow: {
        lg: '0px 6.41594px 22.9141px rgba(102, 102, 102, 0.25);'
      },
      maxWidth: {
        '1/4': '25%',
        '1/2': '50%',
        '3/4': '75%'
      },
      minWidth: {
        '5xl': '64rem'
      },
      spacing: {
        '96': '24rem',
        '128': '32rem'
      }
    }
  },
  variants: {},
  plugins: [],
  purge: {
    // Learn more on https://tailwindcss.com/docs/controlling-file-size/#removing-unused-css
    mode: 'layers', // avoids a warning from Tailwind, suggested by them, maybe because two-stage build
    layers: ['utilities'], // also Tailwind says this needed but still warns
    enabled: process.env.NODE_ENV === 'production',
    content: [
      'src/components/**/*.vue',
      'src/layouts/**/*.vue',
      'src/views/**/*.vue',
      'src/plugins/**/*.js',
      '!src/components/DocsContents.vue',
      '!src/components/DocEditor.vue'
    ]
  }
};
