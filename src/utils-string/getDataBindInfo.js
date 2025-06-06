import { DATA_BIND_TYPES } from "#constants";

export default (dataBind) => {
  if (dataBind.trim() === DATA_BIND_TYPES.postTitle) {
    return {
      type: DATA_BIND_TYPES.postTitle,
    };
  }

  const splitDataBind = dataBind.replaceAll(" ", "").split(".");

  switch (splitDataBind.length) {
    case 0:
    case 1:
      return {
        type: DATA_BIND_TYPES.attributes,
        key: dataBind,
      };

    case 2:
      switch (splitDataBind[0]) {
        case DATA_BIND_TYPES.attributes:
          return {
            type: DATA_BIND_TYPES.attributes,
            key: splitDataBind[1],
          };
        case DATA_BIND_TYPES.postMeta:
          return {
            type: DATA_BIND_TYPES.postMeta,
            key: splitDataBind[1],
          };
        default:
          throw new Error(`Unrecognized dataBind format: ${dataBind}`);
      }

    default:
      throw new Error(`Unrecognized dataBind format: ${dataBind}`);
  }
};
