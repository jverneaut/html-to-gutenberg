export default {
  transform: {
    "^.+\\.(js|jsx)$": "babel-jest",
  },

  testPathIgnorePatterns: ["/node_modules/", "/__tests__/fixtures/"],

  moduleFileExtensions: ["js", "jsx", "json", "html", "twig"],
};
