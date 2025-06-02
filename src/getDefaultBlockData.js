const defaultBlockData = {
  // Internal properties set in the processing stage and used by printers
  _className: null,
  _editorClassName: null,
  _hasAttributesProps: false,
  _editingMode: null,
  _hasServerSideRender: false,
  _hasMediaUploadImport: false,
  _hasRichTextImport: false,
  _hasInnerBlocks: false,
  _hasSelected: false,

  _boundImages: [], // {key: string, size?: string}[]
  _dependencies: [], // string[],

  // Block.json metadata
  name: null,
  styles: [],
  namespace: null,
  version: null,
  category: null,
  title: null,
  textdomain: null,
  style: null,
  editorStyle: null,
  viewScript: null,
  icon: null,
  parent: null,
  description: null,
  attributes: {},
};

export default (options) => {
  Object.assign(
    defaultBlockData,
    Object.fromEntries(
      Object.entries(options).filter(([_, value]) => value !== null),
    ),
  );

  // Prevents the addition of new properties
  return Object.seal(structuredClone(defaultBlockData));
};
