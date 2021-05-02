export const comaToDot = (price) => {
  return price.replace(/,/g, ".");
};

export const dotToComa = (price) => {
  return price.toString().replace(/\./g, ",");
};

export const decimals = (price) => {
  return Number.parseFloat(price).toFixed(2);
};
