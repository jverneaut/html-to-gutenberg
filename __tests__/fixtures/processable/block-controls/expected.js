import { useBlockProps, BlockControls } from "@wordpress/block-editor";
import {
  ToolbarGroup,
  ToolbarButton,
  ToolbarDropdownMenu,
} from "@wordpress/components";
import { useSelect } from "@wordpress/data";
import { useEntityProp } from "@wordpress/core-data";
import {
  arrowUp,
  arrowRight,
  arrowDown,
  arrowLeft,
  styles,
  formatBold,
  more,
} from "@wordpress/icons";

export default ({ attributes, setAttributes }) => {
  const postType = useSelect(
    (select) => select("core/editor").getCurrentPostType(),
    [],
  );

  const [meta, setMeta] = useEntityProp("postType", postType, "meta");

  return (
    <section {...useBlockProps()}>
      <BlockControls>
        <ToolbarGroup>
          <ToolbarButton
            icon={styles}
            isActive={attributes.darkMode}
            onClick={() => setAttributes({ darkMode: !attributes.darkMode })}
          ></ToolbarButton>
          <ToolbarButton
            icon={formatBold}
            isActive={meta.bold}
            onClick={() => setMeta({ ...meta, bold: !meta.bold })}
          ></ToolbarButton>
        </ToolbarGroup>

        <ToolbarGroup>
          <ToolbarDropdownMenu
            icon={more}
            label="Select a direction"
            controls={[
              {
                title: "Up",
                icon: arrowUp,
                isActive: attributes.direction === "up",
                onClick: () => setAttributes({ direction: "up" }),
              },
              {
                title: "Right",
                icon: arrowRight,
                isActive: attributes.direction === "right",
                onClick: () => setAttributes({ direction: "right" }),
              },
              {
                title: "Down",
                icon: arrowDown,
                isActive: attributes.direction === "down",
                onClick: () => setAttributes({ direction: "down" }),
              },
              {
                title: "Left",
                icon: arrowLeft,
                isActive: attributes.direction === "left",
                onClick: () => setAttributes({ direction: "left" }),
              },
            ]}
          ></ToolbarDropdownMenu>

          <ToolbarDropdownMenu
            icon={more}
            label="Select a size"
            controls={[
              {
                title: "Small",
                isActive: meta.size === "small",
                onClick: () => setMeta({ ...meta, size: "small" }),
              },
              {
                title: "big",
                isActive: meta.size === "big",
                onClick: () => setMeta({ ...meta, size: "big" }),
              },
            ]}
          ></ToolbarDropdownMenu>
        </ToolbarGroup>
      </BlockControls>
    </section>
  );
};
