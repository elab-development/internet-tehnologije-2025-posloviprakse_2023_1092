export default {
  test: {
    environment: 'jsdom',
    exclude: [
      '**/backend/**',
      '**/node_modules/**',
      '**/dist/**',
    ],
    globals: true
  }
};
