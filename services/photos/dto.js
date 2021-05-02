export const single = (photo) => {
  if (!photo) return null;

  return {
    id: photo._id,
    photo: `${process.env.BASE_URL}image/photo/${photo.photo}`,
    createdAt: photo.createdAt,
    updatedAt: photo.updatedAt,
  };
};

export const multiple = (photos) => photos.map((photo) => single(photo));
