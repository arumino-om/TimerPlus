module.exports = {
  mode: "jit",
  purge: [
    "./public/*.html",
    "./src/app/**/*.ts",
  ],
  darkMode: false, // or 'media' or 'class'
  variants: {
    extend: {
      boxShadow: ["active"]
    },
  },
  theme: {
    extend: {
      transitionDuration: {
       '0': '0ms',
      },
      fontSize: {
        '12xl': '12rem'
      }
    }
  },
  plugins: [],
}
