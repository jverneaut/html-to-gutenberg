import { useBlockProps } from "@wordpress/block-editor";

export default () => {
  return (
    <section
      {...useBlockProps({
        style: {
          color: "red",
          background: "green",
          transform: "translateX(10px)",
        },
      })}
    ></section>
  );
};
