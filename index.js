const express = require("express");
const app = express();
const views = require("./views");

app.set("view engine", "ejs");
app.use(express.static("static"));

app.get("/", views.main);
app.get("/list/:id/", views.listObjects);
app.get("/obj/:id/", views.arcObject);
app.use(views.error404);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Listening on " + port);
});
