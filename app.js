import express from "express";
import cors from "cors";
import upload from "express-fileupload";

import routes from "./routes/routes.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(upload());
app.use(cors());
/*app.use(function (req, res, next) {
  setTimeout(next, 1000);
});*/

app.use("/", routes);

export default app;
