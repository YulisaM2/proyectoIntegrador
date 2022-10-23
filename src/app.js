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
const Servicio = require("./models/servicio");

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

app.get("/empresas", async (req, res) => {
  try {
    if ('servicio' in req.query && typeof req.query.servicio === 'string') {
      await getEmpresasDeServicio(req, res);
      return;
    }

    const empresas = await Empresa.find();

    if (empresas === undefined) {
      res.status(500).send('ERROR: no se encontraron empresas.');
      return;
    }

    res.render("empresas", { empresas });
  } catch (error) {
    console.log(error);
    res.send(`ERROR: ${error}`);
  }
});

const getEmpresasDeServicio = async (req, res) => {
  const empresas = await Empresa.find({ servicios: req.query.servicio });

  if (empresas === undefined) {
    res.status(400).send(`ERROR: no se encontraron empresas de servicio '${req.query.servicio}'.`);
    return;
  }

  const servicio = Servicio.find({ nombre: req.query.servicio });

  if (servicio === undefined) {
    res.status(400).send(`ERROR: no se encontraron servicios con nombre '${req.query.servicio}'.`)
    return;
  }

  var servicios = Servicio.find();
  servicios.sort(function(a, b) {
    var servicioA = a.nombre.toUpperCase();
    var servicioB = b.nombre.toUpperCase();
    return (servicioA < servicioB) ? -1 : (servicioA > servicioB) ? 1 : 0;
  });

  console.log(servicios)

  res.render('empresas-de-servicio', { empresas, servicio, servicios});
}

app.get("/servicios", async (_req, res) => {
  try {
    const servicios = Servicio.find();

    if (servicios === undefined) {
      res.status(500).send('ERROR: no se encontraron servicios')
      return;
    }
    
    res.render("servicios", { servicios });
  } catch (error) {
    console.log(error);
    res.send(`ERROR: ${error}`);
  }
});

app.listen(port, () => {
  console.log("Server is up on 3000");
});

/* ************** */
// Para probar la vista de detalle de empresa (empresa.hbs)
app.get("/empresa/:nombre", async (req, res) => {
  try {
    const empresa = await Empresa.find({ nombre: req.params.nombre });

    if (empresa === undefined) {
      res.status(500).send('ERROR: no se encontró la empresa.');
      return;
    }

    res.render("empresa", { empresa });
  } catch (error) {
    console.log(error);
    res.send(`ERROR: ${error}`);
  }
});