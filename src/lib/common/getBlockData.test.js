import getBlockData from "./getBlockData.js";

const defaultBlockOptions = {
  blockName: "name",
  blockSlug: "slug",
  blockTitle: "title",
  blockEngine: "php",
};

describe("getBlockData", () => {
  test("should extract the root element className", async () => {
    const input = `
      <section class="container"></section>
    `;

    const blockData = await getBlockData(input, defaultBlockOptions);

    expect(blockData.rootElement.className).toBe("container");
  });

  test("should extract the root element styles as an array", async () => {
    const input = `
      <section data-styles="default primary"></section>
    `;

    const blockData = await getBlockData(input, defaultBlockOptions);

    expect(blockData.rootElement.styles).toStrictEqual(["default", "primary"]);
  });

  test("should set root-placeholder", async () => {
    const input = `
      <section></section>
    `;

    const blockData = await getBlockData(input, defaultBlockOptions);

    expect(blockData.html).toContain("root-placeholder");
  });

  test("should extract string attributes", async () => {
    const input = `
        <section>
          <h2 data-attribute="title">Hello, Gutenberg!</h2>
          <p data-attribute="content"></p>
        </section>
    `;

    const blockData = await getBlockData(input, defaultBlockOptions);

    expect(blockData.attributes.title.type).toBe("string");
    expect(blockData.attributes.title.default).toBe("Hello, Gutenberg!");
    expect(blockData.attributes.title._internalType).toBe("text");

    expect(blockData.attributes.content.type).toBe("string");
    expect(blockData.attributes.content._internalType).toBe("text");
  });

  test("should extract image attributes", async () => {
    const input = `
        <section>
          <img data-attribute="image">
        </section>
    `;

    const blockData = await getBlockData(input, defaultBlockOptions);

    expect(blockData.attributes.image.type).toBe("integer");
    expect(blockData.attributes.image._internalType).toBe("image");
  });
});
