import { useBlockProps } from "@wordpress/block-editor";

export default ({ attributes, setAttributes }) => {
  return (
    <section
      {...useBlockProps({
        style: {
          color: "red",
          background: attributes.background,
          textAlign: attributes.center ? "center" : "",
        },
      })}
    ></section>
  );
};
