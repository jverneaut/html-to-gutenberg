import generateAst from "./generateAst.js";

describe("generateAst", () => {
  it("should fail to parse HTML with multiple <InnerBlocks />", () => {
    const input = `
      <section>
        <blocks></blocks>
        <blocks></blocks>
      </section>
    `;

    expect(() => generateAst(input)).toThrow();
  });

  it("should fail to parse HTML with multiple root elements", () => {
    const input = `
      <section></section>
      <section></section>
    `;

    expect(() => generateAst(input)).toThrow();
  });

  it("should fail to parse HTML with nested fields", () => {
    const input = `
      <section>
        <p data-attribute="title">
          <span data-attribute="sub_title"></span>
        </p>
      </section>
    `;

    expect(() => generateAst(input)).toThrow();
  });

  it("should fail to parse HTML with dashes in attributes keys", () => {
    const input = `
      <section>
        <p data-attribute="my-title"></p>
      </section>
    `;

    expect(() => generateAst(input)).toThrow();
  });

  it("should fail to parse HTML with whitespace in attributes keys", () => {
    const input = `
      <section>
        <p data-attribute="my title"></p>
      </section>
    `;

    expect(() => generateAst(input)).toThrow();
  });

  it("should fail to parse HTML with templated block not in allowed blocks", () => {
    const input = `
      <section>
        <blocks allowedBlocks="custom/allowed-block"">
          <block name="custom/not-allowed-block"></block>
        </blocks>
      </section>
    `;

    expect(() => generateAst(input)).toThrow();
  });
});
