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

  test('should set defaultNamespace to "custom" by default', () => {
    const htmlToGutenberg = new HTMLToGutenberg({
      inputDirectory: "./",
    });

    expect(htmlToGutenberg.defaultNamespace).toBe("custom");
  });

  test('should set defaultCategory to "theme" by default', () => {
    const htmlToGutenberg = new HTMLToGutenberg({
      inputDirectory: "./",
    });

    expect(htmlToGutenberg.defaultCategory).toBe("theme");
  });

  test('should set defaultVersion to "0.1.0" by default', () => {
    const htmlToGutenberg = new HTMLToGutenberg({
      inputDirectory: "./",
    });

    expect(htmlToGutenberg.defaultVersion).toBe("0.1.0");
  });

  test("should not have defaultIcon by default", () => {
    const htmlToGutenberg = new HTMLToGutenberg({
      inputDirectory: "./",
    });

    expect(htmlToGutenberg.defaultIcon).toBe(undefined);
  });

  test("should correctly parse default options", () => {
    const htmlToGutenberg = new HTMLToGutenberg({
      inputDirectory: "./",
      defaultNamespace: "default-namespace",
      defaultCategory: "defaultCategory",
      defaultVersion: "1.0.0",
      defaultIcon: "star",
    });

    expect(htmlToGutenberg.defaultNamespace).toBe("default-namespace");
    expect(htmlToGutenberg.defaultCategory).toBe("defaultCategory");
    expect(htmlToGutenberg.defaultVersion).toBe("1.0.0");
    expect(htmlToGutenberg.defaultIcon).toBe("star");
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
