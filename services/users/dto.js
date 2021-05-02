export const single = (user) => {
  if (!user) return null;

  return {
    id: user._id,
    username: user.username,
    email: user.email,
    isAdmin: user.isAdmin,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};

export const multiple = (users) => users.map((user) => single(user));
