import { useBlockProps, InnerBlocks } from "@wordpress/block-editor";

export default () => {
  return (
    <section {...useBlockProps()}>
      <InnerBlocks
        allowedBlocks={["core/group", "core/heading", "core/paragraph"]}
        template={[
          [
            "core/group",
            {},
            [
              [
                "core/group",
                {},
                [
                  [
                    "core/group",
                    {},
                    [
                      ["core/heading", { level: 3 }],
                      ["core/paragraph", {}],
                    ],
                  ],
                ],
              ],
            ],
          ],
        ]}
      ></InnerBlocks>
    </section>
  );
};
