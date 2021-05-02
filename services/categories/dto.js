export const single = (category) => {
  if (!category) return null;

  return {
    id: category._id,
    name: category.name,
    url: category.url,
    createdAt: category.createdAt,
    updatedAt: category.updatedAt,
  };
};

export const multiple = (categories) => categories.map((category) => single(category));
