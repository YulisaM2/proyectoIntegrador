const path = require("path");

const csv = require("csvtojson");

const EMPRESAS_CSV_PATH = path.join(__dirname, "../../public/Datos dummies (formato forms) - Hoja 1.csv")

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
 * @property {string} sitioWeb
 * @property {string} descripcion
 * @property {string} tipoDeMiembro
 * @property {string} cantidadDeEmpleados
 * @property {Local} localMatriz
 * @property {Local[]} locales
 * @property {string} presenciaEnPaises
 * @property {Certificacion[]} certificaciones
 * @property {string[]} servicios
 * @property {string} logo
 */

class EmpresaModel {

    /**
     * Buscar empresas.
     * @param {Object} [filter]
     * @param {string} [filter.nombre]
     * @param {string} [filter.servicios]
     * @returns {Promise.<Empresa[] | undefined>} empresas
     */
    static async find(filter) {
        const empresasCsv = await csv({
            output: "csv",
        })
            .fromFile(EMPRESAS_CSV_PATH);

        let empresasResult = [];

        for (const empresaRow of empresasCsv) {
            const thisEmpresa = {
                timestamp: empresaRow[0],
                nombre: empresaRow[1],
                sitioWeb: empresaRow[2],
                logo: empresaRow[3],
                descripcion: empresaRow[4],
                tipoDeMiembro: empresaRow[5],
                cantidadDeEmpleados: empresaRow[6],
                localMatriz: {
                    nombre: empresaRow[7],
                    email: empresaRow[8],
                    telefono: empresaRow[9],
                    horarioDeApertura: empresaRow[10],
                    horarioDeCierre: empresaRow[11],
                    direccion: empresaRow[12],
                },
            };

            let localIndex = 1;

            const NUM_FIELDS_IN_LOCAL = 6;
            const MAX_LOCALES = 10;

            while (empresaRow[13 + (localIndex - 1) * (NUM_FIELDS_IN_LOCAL + 1)] === "Sí" && localIndex < MAX_LOCALES) {
                if (localIndex === 1) {
                    thisEmpresa.locales = [];
                }

                const thisLocalStartIndex = 14 + (localIndex - 1) * (NUM_FIELDS_IN_LOCAL + 1);

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

            thisEmpresa.presenciaEnPaises = empresaRow[76];

            if (empresaRow[77] === "Sí") {
                thisEmpresa.certificaciones = [{
                    nombre: empresaRow[78],
                    fechaInicio: empresaRow[79],
                    fechaVencimiento: empresaRow[80],
                }];

                let certificacionIndex = 1;

                const NUM_FIELDS_IN_CERTIFICACION = 3;
                const MAX_CERTIFICACIONES = 20;

                while (empresaRow[81 + (certificacionIndex - 1) * (NUM_FIELDS_IN_CERTIFICACION + 1)] === "Sí" && certificacionIndex < MAX_CERTIFICACIONES) {
                    const thisCertificacionStartIndex = 82 + (certificacionIndex - 1) * (NUM_FIELDS_IN_CERTIFICACION + 1);

                    thisEmpresa.certificaciones.push({
                        nombre: empresaRow[thisCertificacionStartIndex],
                        fechaInicio: empresaRow[thisCertificacionStartIndex + 1],
                        fechaVencimiento: empresaRow[thisCertificacionStartIndex + 2],
                    });

                    certificacionIndex++;
                };
            };

            thisEmpresa["servicios"] = empresaRow[157].split(", ");

            empresasResult.push(thisEmpresa);
        }

        if (empresasResult.length === 0) {
            return undefined;
        }

        if ((typeof filter === 'object') && ('nombre' in filter) && (typeof filter.nombre === 'string')) {
            return empresasResult.find(e => e.nombre === filter.nombre);
        }

        if ((typeof filter === 'object') && ('servicios' in filter) && (typeof filter.servicios === 'string')) {
            const result = empresasResult.filter(e => e.servicios.includes(filter.servicios))

            if (result.length === 0) {
                return undefined;
            }

            return result;
        }

        return empresasResult;
    }
}

module.exports = EmpresaModel;
