import { useBlockProps, RichText } from "@wordpress/block-editor";
import { useSelect } from "@wordpress/data";
import { useEntityProp } from "@wordpress/core-data";

export default () => {
  const postType = useSelect(
    (select) => select("core/editor").getCurrentPostType(),
    [],
  );

  const [postTitle, setPostTitle] = useEntityProp(
    "postType",
    postType,
    "title",
  );

  return (
    <section {...useBlockProps()}>
      <RichText
        tagName="p"
        value={postTitle}
        onChange={(postTitle) => setPostTitle(postTitle)}
      ></RichText>
    </section>
  );
};
