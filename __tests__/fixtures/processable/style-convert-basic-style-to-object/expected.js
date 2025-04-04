import { useBlockProps } from "@wordpress/block-editor";

export default () => {
  return (
    <section
      style={{
        color: "red",
        background: "green",
        transform: "translateX(10px)",
      }}
      {...useBlockProps()}
    ></section>
  );
};
