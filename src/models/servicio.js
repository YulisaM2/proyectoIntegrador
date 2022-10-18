const fs = require('fs');
const path = require('path');

const YAML = require('yaml');

/**
 * Definición de Servicio.
 * @typedef {Object} Servicio
 * @property {string} nombre
 * @property {string} icono
 */

class ServicioModel {

    /**
     * Buscar servicioss.
     * @param {Object} [filter]
     * @param {string} [filter.nombre]
     * @returns {Servicio[] | undefined} servicios
     */
    static find(filter) {
        const serviciosPath = path.join(__dirname, '../../config/servicios.yaml');

        const serviciosYamlString = fs.readFileSync(serviciosPath, "utf-8");

        const serviciosYaml = YAML.parse(serviciosYamlString).servicios;

        if (serviciosYaml.length === 0) {
            return undefined;
        }

        if ((typeof filter === 'object') && ('nombre' in filter) && (typeof filter.nombre === 'string')) {
            return serviciosYaml.find(r => r.nombre === filter.nombre);
        }

        return serviciosYaml
    }
}

module.exports = ServicioModel;
