const express = require("express");
const path = require("path");
const hbs = require("hbs");
const port = 3000;
const publicPath = path.join(__dirname, "../public");
const templatePath = path.join(__dirname, "../templates");
const partialsPath = path.join(__dirname, "../templates/partials");

const app = express();
app.use(express.json());
app.set("view engine", "hbs");
app.set("views", templatePath);

app.use(express.static(publicPath));
hbs.registerPartials(partialsPath);

app.get("/", (req, res) => {
  res.render("index");
});

app.listen(port, () => {
  console.log("Server is up on 3000");
});
