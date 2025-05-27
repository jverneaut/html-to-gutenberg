import getBlockData from "./getBlockData.js";

const defaultBlockOptions = {
  blockName: "name",
  blockSlug: "slug",
  blockTitle: "title",
};

describe("getBlockData", () => {
  test("should extract explicit block name", async () => {
    const input = `
      <section data-name="custom/block-name"></section>
    `;

    const blockData = await getBlockData(input, defaultBlockOptions);

    expect(blockData.name).toBe("custom/block-name");
  });

  test("should extract slug from explicit block name", async () => {
    const input = `
      <section data-name="custom/block-name"></section>
    `;

    const blockData = await getBlockData(input, defaultBlockOptions);

    expect(blockData.slug).toBe("block-name");
  });

  test("should extract explicit block title", async () => {
    const input = `
      <section data-title="Block Title"></section>
    `;

    const blockData = await getBlockData(input, defaultBlockOptions);

    expect(blockData.title).toBe("Block Title");
  });

  test("should extract explicit block description", async () => {
    const input = `
      <section data-description="Block Description"></section>
    `;

    const blockData = await getBlockData(input, defaultBlockOptions);

    expect(blockData.description).toBe("Block Description");
  });

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

  test("should have editing mode to null by default", async () => {
    const input = `
      <section></section>
    `;

    const blockData = await getBlockData(input, defaultBlockOptions);

    expect(blockData.rootElement.editingMode).toBe(null);
  });

  test("should parse editing mode when set", async () => {
    const input = `
      <section data-editing-mode="disabled"></section>
    `;

    const blockData = await getBlockData(input, defaultBlockOptions);

    expect(blockData.rootElement.editingMode).toBe("disabled");
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
