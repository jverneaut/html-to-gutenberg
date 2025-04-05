import HTMLToGutenberg from "./HTMLToGutenberg.js";

describe("HTMLToGutenberg", () => {
  test("should throw if no inputDirectory is set", () => {
    expect(() => new HTMLToGutenberg()).toThrow();
  });

  test("should set outputDirectory to inputDirectory if not set", () => {
    const htmlToGutenberg = new HTMLToGutenberg({
      inputDirectory: "./",
    });

    expect(htmlToGutenberg.outputDirectory).toBe(
      htmlToGutenberg.inputDirectory,
    );
  });

  test('should set blocksPrefix to "custom" by default', () => {
    const htmlToGutenberg = new HTMLToGutenberg({
      inputDirectory: "./",
    });

    expect(htmlToGutenberg.blocksPrefix).toBe("custom");
  });

  test('should set engine to "php" by default', () => {
    const htmlToGutenberg = new HTMLToGutenberg({
      inputDirectory: "./",
    });

    expect(htmlToGutenberg.engine).toBe("php");
  });

  test("should use twig engine when set", () => {
    const htmlToGutenberg = new HTMLToGutenberg({
      inputDirectory: "./",
      engine: "twig",
    });

    expect(htmlToGutenberg.engine).toBe("twig");
  });

  test("should throw if unrecognized engine", () => {
    expect(
      () =>
        new HTMLToGutenberg({
          inputDirectory: "./",
          engine: "go",
        }),
    ).toThrow();
  });
});
