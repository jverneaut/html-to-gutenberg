import { useBlockProps } from "@wordpress/block-editor";

export default () => {
  const blockProps = useBlockProps();

  return (
    <section
      style={{
        color: "red",
        background: "green",
        transform: "translateX(10px)",
      }}
      {...blockProps}
    ></section>
  );
};
