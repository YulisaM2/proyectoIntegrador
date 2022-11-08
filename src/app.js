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
const EmpresaModel = require("./models/empresa");
const { Console } = require("console");

const app = express();
app.use(express.json());
app.set("view engine", "hbs");
app.set("views", templatePath);

app.use(express.static(publicPath));
hbs.registerPartials(partialsPath);

hbs.registerHelper('isEqualString', (arg1, arg2) => {
  return arg1 === arg2
});

hbs.registerHelper("isNotNull", (arg1) => {
  return arg1 !== null;
});

app.get("/", async (_req, res) => {
  try {
    const servicios = Servicio.find();

    if (servicios === undefined) {
      res.status(404).render("pagina_error", {
        codigo: "404",
        error: `No se encontraron servicios'.`,
      });
      return;
    }

    res.render("servicios", { servicios, activePage: "Servicios" });
  } catch (error) {
    console.log(error);
    res.status(500).render("pagina_error", {
      codigo: "500",
      error
    });
  }
});

app.get("/empresas", async (req, res) => {
  try {
    let empresas = await Empresa.find();

    if (empresas === undefined) {
      res.status(404).render("pagina_error", {
        codigo: "404",
        error: `No se encontraron empresas.`,
      });
      return;
    }

    if ('servicio' in req.query && typeof req.query.servicio === 'string' && req.query.servicio.length !== 0) {
      empresas = empresas.filter(e => e.servicios.includes(req.query.servicio))
    }

    if ('search' in req.query && typeof req.query.search === 'string') {
      const regex = new RegExp(req.query.search, 'gi');
      empresas = empresas.filter(e => regex.test(e.nombre));
    }

    var servicios = Servicio.find();
    servicios.sort(function (a, b) {
      var servicioA = a.nombre.toUpperCase();
      var servicioB = b.nombre.toUpperCase();
      return (servicioA < servicioB) ? -1 : (servicioA > servicioB) ? 1 : 0;
    });

    if (empresas.length === 0) {
      res.render("empresas-de-servicio", {
        pageError: `No se encontraron empresas.`,
        empresas: [],
        servicio: { nombre: req.query.servicio },
        search: req.query.search,
        servicios,
        activePage: "Empresas",
      });
      return;
    }

    res.render("empresas-de-servicio", {
      empresas,
      servicio: { nombre: req.query.servicio },
      search: req.query.search,
      servicios,
      activePage: "Empresas",
    });
  } catch (error) {
    console.log(error);
    res.status(500).render("pagina_error", {
      codigo: "500",
      error,
    });
  }
});

app.listen(port, () => {
  console.log("Server is up on 3000");
});

/* ************** */
// Para probar la vista de detalle de empresa (empresa.hbs)
app.get("/empresa/:nombre", async (req, res) => {
  try {
    const empresa = await Empresa.find({ detalle: req.params.nombre });

    if (empresa === undefined) {
      res.status(404).render("pagina_error", {
        codigo: "404",
        error: `No se encontró la empresa: ${req.params.nombre}`,
      });
      return;
    }

    res.render("empresa", { empresa });
  } catch (error) {
    console.log(error);
    res.status(500).render("pagina_error", {
      codigo: "500",
      error,
    });
  }
});

app.get("*", async (req, res) => {
  res.status(404).render("pagina_error", {
    codigo: "404",
    error: `No encontramos la página: ${req.path}`,
  });
});