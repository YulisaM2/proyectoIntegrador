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
    if ('search' in req.query && typeof req.query.search === 'string') {
      await getEmpresasDeNombre(req, res);
      return;
    }

    if ('servicio' in req.query && typeof req.query.servicio === 'string') {
      await getEmpresasDeServicio(req, res);
      return;
    }

    const empresas = await Empresa.find();

    if (empresas === undefined) {
      res.status(404).render("pagina_error", {
        codigo: "404",
        error: `No se encontraron empresas.`,
      });
      return;
    }

    res.render("empresas", { empresas });
  } catch (error) {
    console.log(error);
    res.status(500).render("pagina_error", {
      codigo: "500",
      error,
    });
  }
});

const getEmpresasDeNombre = async (req, res) => {
  const empresas = await Empresa.find({ nombre: req.query.search })
  if (empresas === undefined) {
    res.status(404).render("pagina_error", {
      codigo: "404",
      error: `No se encontraron empresas con nombre '${req.query.search}'.`,
    });
    return;
  }

  var servicios = Servicio.find();
  servicios.sort(function(a, b) {
    var servicioA = a.nombre.toUpperCase();
    var servicioB = b.nombre.toUpperCase();
    return (servicioA < servicioB) ? -1 : (servicioA > servicioB) ? 1 : 0;
  });

  res.render("empresas-de-nombre", { empresas, nombre:req.query.search, servicios });
}

const getEmpresasDeServicio = async (req, res) => {
  const empresas = await Empresa.find({ servicios: req.query.servicio });
  const servicio = Servicio.find({ nombre: req.query.servicio });

  if (servicio === undefined) {
    res.status(404).render("pagina_error", {
      codigo: "404",
      error: `No se encontraron servicios con nombre '${req.query.servicio}'.`,
    });
    return;
  }

  var servicios = Servicio.find();
  servicios.sort(function (a, b) {
    var servicioA = a.nombre.toUpperCase();
    var servicioB = b.nombre.toUpperCase();
    return servicioA < servicioB ? -1 : servicioA > servicioB ? 1 : 0;
  });

  if (empresas === undefined) {
    res.render("empresas-de-servicio", {
      empresas: [{nombre: 'No existen empresas con este servicio'}],
      servicio: { nombre: req.query.servicio },
      servicios,
    });
    return;
  }

  console.log(servicios)

  res.render('empresas-de-servicio', { empresas, servicio, servicios});
}

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