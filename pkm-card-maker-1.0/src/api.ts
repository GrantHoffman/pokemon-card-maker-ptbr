import { relativePathPrefix } from "services";

export const getCardOptions = async () => {
  try {
    const response = await fetch(relativePathPrefix('/data/cardOptions.json'));
    return response.json();
  } catch(e) {
    console.error(e);
  }
}
