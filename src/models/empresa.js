const { readFileSync } = require("fs");
const path = require("path");

const csv = require("csvtojson");

const EMPRESAS_CSV_PATH = path.join(__dirname, "../../public/Recolección de Datos para Catálogo de Miembros del CSoftMty (Responses) - Form Responses 1.csv")

/**
 * @typedef {object} Local
 * @property {string} nombre
 * @property {string} email
 * @property {string} telefono
 * @property {string} horarioDeApertura
 * @property {string} horarioDeCierre
 * @property {string} direccion
 */

/**
 * @typedef {object} Certificacion
 * @property {string} nombre
 * @property {string} fechaInicio
 * @property {string} fechaVencimiento
 */

/**
 * @typedef {object} Empresa
 * @property {string} timestamp
 * @property {string} nombre
 * @property {string} descripcion
 * @property {string} tipoDeMiembro
 * @property {string} cantidadDeEmpleados
 * @property {object} localSede
 * @property {string} localSede.nombre
 * @property {string} localSede.email
 * @property {string} localSede.telefono
 * @property {string} localSede.horarioDeApertura
 * @property {string} localSede.horarioDeCierre
 * @property {string} localSede.direccion
 * @property {Local[]} locales
 * @property {string} presenciaEnPaises
 * @property {Certificacion[]} certificaciones
 * @property {string[]} servicios
 * @property {string} logo
 */

class EmpresaModel {

    /**
     * Buscar todas las empresas.
     * @returns {Promise.<Empresa[]>} empresas
     */
    static async find() {
        const empresasCsv = await csv({
                output: "csv"
            })
            .fromFile(EMPRESAS_CSV_PATH);

        const empresasResult = [];

        for (const empresaRow of empresasCsv) {
            const thisEmpresa = {
                timestamp: empresaRow[0],
                nombre: empresaRow[1],
                descripcion: empresaRow[2],
                tipoDeMiembro: empresaRow[3],
                cantidadDeEmpleados: empresaRow[4],
                localSede: {
                    nombre: empresaRow[5],
                    email: empresaRow[6],
                    telefono: empresaRow[7],
                    horarioDeApertura: empresaRow[8],
                    horarioDeCierre: empresaRow[9],
                    direccion: empresaRow[10],
                },
            };

            let localIndex = 2;

            while (localIndex <= 5 && empresaRow[11 + (localIndex - 2) * 7] === "Sí") {
                if (localIndex === 2) {
                    thisEmpresa["locales"] = [];
                }

                const thisLocalStartIndex = 11 + (localIndex - 2) * 7 + 1;

                thisEmpresa.locales.push({
                    nombre: empresaRow[thisLocalStartIndex],
                    email: empresaRow[thisLocalStartIndex + 1],
                    telefono: empresaRow[thisLocalStartIndex + 2],
                    horarioDeApertura: empresaRow[thisLocalStartIndex + 3],
                    horarioDeCierre: empresaRow[thisLocalStartIndex + 4],
                    direccion: empresaRow[thisLocalStartIndex + 5],
                });

                localIndex++;
            };

            thisEmpresa.presenciaEnPaises = empresaRow[39];

            if (empresaRow[40] === "Sí") {
                thisEmpresa["certificaciones"] = [];

                thisEmpresa.certificaciones.push({
                    nombre: empresaRow[41],
                    fechaInicio: empresaRow[42],
                    fechaVencimiento: empresaRow[43],
                })

                let certificacionIndex = 2;

                while (certificacionIndex <= 10 && thisEmpresa[44 + (certificacionIndex - 2) * 4] === "Sí") {
                    const thisCertificacionStartIndex = 44 + (certificacionIndex - 2) * 4 + 1;

                    thisEmpresa.certificaciones.push({
                        nombre: empresaRow[thisCertificacionStartIndex],
                        fechaInicio: empresaRow[thisCertificacionStartIndex + 1],
                        fechaVencimiento: empresaRow[thisCertificacionStartIndex + 2],
                    });

                    certificacionIndex++;
                };
            };

            thisEmpresa["servicios"] = empresaRow[80].split(", ");

            thisEmpresa["logo"] = empresaRow[81];

            empresasResult.push(thisEmpresa);
        }

        return empresasResult
    }
}

module.exports = EmpresaModel;
