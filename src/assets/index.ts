const importAll = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  modules: Record<string, () => Promise<any>>
): Promise<{ [key: string]: string }> => {
  const promises = Object.keys(modules).map((path) =>
    modules[path]().then((module) => ({
      fileName: path.replace("./", ""),
      src: module.default,
    }))
  );

  const results = await Promise.all(promises);
  const images: {[key_1: string]: string;} = {};
  results.forEach(({fileName, src}) => {
    images[fileName] = src;
  });
  return images;
};

const images = importAll(import.meta.glob("./*.{jpg,png}"));

export default images;
