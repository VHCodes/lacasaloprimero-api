export const slugify = (text) => {
  const find = ["á", "Á", "é", "É", "í", "Í", "ó", "Ó", "ú", "Ú", "ñ", "Ñ", "ü", "Ü"];
  const repl = ["a", "a", "e", "e", "i", "i", "o", "o", "u", "u", "n", "n", "u", "u"];

  find.forEach((element, index) => {
    text = text.replaceAll(element, repl[index]);
  });

  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/\-\-+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, ""); // Trim - from end of text
};
