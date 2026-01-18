export const objectIdConvert = (object) => {
  return {
    ...object,
    id: object._id?.toString(),
  };
};
export const objectIdArrayConvert = (arr = []) =>
  arr.map(({ _id, ...rest }) => ({
    ...rest,
    id: _id?.toString(),
  }));
