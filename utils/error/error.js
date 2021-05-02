export const error = {
  general: "general",
  token: "token",
  confirmationToken: "confirmationToken",
  passwordToken: "passwordToken",
  mongoose: "mongoose",
  mail: "mail",
  id: "id",
  user: "user",
  email: "email",
  username: "username",
  password: "password",
  isAdmin: "isAdmin",
  name: "name",
  photo: "photo",
  title: "title",
  category: "category",
  price: "price",
  description: "description",
  cover: "cover",
  blueprint: "blueprint",
  discount: "discount",
  perPage: "perPage",
  address: "address",
  phone: "phone",
  socialMedia: "socialMedia",
};

export class ValidationError extends Error {
  constructor(name, message) {
    super(message);
    this.name = name;
  }

  getError() {
    let error = {};
    error[this.name] = this.message;

    return error;
  }
}

export class ValidationErrors extends Error {
  constructor(array) {
    super("Coleccion de errores");
    this.name = "collection-errors";
    this.errors = array;
  }

  getError() {
    return this.errors;
  }
}
