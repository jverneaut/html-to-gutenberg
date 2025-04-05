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

  test('should set flavor to "php" by default', () => {
    const htmlToGutenberg = new HTMLToGutenberg({
      inputDirectory: "./",
    });

    expect(htmlToGutenberg.flavor).toBe("php");
  });

  test("should use twig flavor when set", () => {
    const htmlToGutenberg = new HTMLToGutenberg({
      inputDirectory: "./",
      flavor: "twig",
    });

    expect(htmlToGutenberg.flavor).toBe("twig");
  });

  test("should throw if unrecognized flavor", () => {
    expect(
      () =>
        new HTMLToGutenberg({
          inputDirectory: "./",
          flavor: "go",
        }),
    ).toThrow();
  });
});
