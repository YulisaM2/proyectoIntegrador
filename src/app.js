const express = require("express");
const path = require("path");
const hbs = require("hbs");
const csv = require("csvtojson");
const { json } = require("express/lib/response");
const port = 3000;
const publicPath = path.join(__dirname, "../public");
const csvPath = path.join(__dirname, "../public/directory.csv");
const templatePath = path.join(__dirname, "../templates");
const partialsPath = path.join(__dirname, "../templates/partials");
const Empresa = require("./models/empresa");
const Rubro = require("./models/rubro");

const app = express();
app.use(express.json());
app.set("view engine", "hbs");
app.set("views", templatePath);

app.use(express.static(publicPath));
hbs.registerPartials(partialsPath);

app.get("/", async (req, res) => {
  let jsonArray = [];
  try {
    jsonArray = await csv().fromFile(csvPath);
    jsonArray.map((res) => {
      //Esto es para las respuestas de checklist
      res.Checklist = res.Checklist.split(";");
    });
    console.log(jsonArray);
  } catch (error) {
    console.log(error);
  }

  res.render("index", { jsonArray: JSON.stringify(jsonArray) });
});

app.get("/empresas", async (_req, res) => {
  try {
    const empresas = await Empresa.find();

    res.render("empresas", { empresas });
  } catch (error) {
    console.log(error);
    res.send(`ERROR: ${error}`);
  }
});

app.get("/rubros", async (_req, res) => {
  try {
    const rubros = Rubro.find();
    
    res.render("rubros", { rubros });
  } catch (error) {
    console.log(error);
    res.send(`ERROR: ${error}`);
  }
});

app.listen(port, () => {
  console.log("Server is up on 3000");
});
