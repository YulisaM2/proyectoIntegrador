const fs = require('fs');
const path = require('path');

const YAML = require('yaml');

class RubroModel {

    /**
     * Buscar rubros.
     * @param {Object} [filter]
     * @param {string} [filter.nombre]
     * @returns {Rubro[]} rubros
     */
    static find(filter) {
        const rubrosPath = path.join(__dirname, '../../config/rubros.yaml');

        const rubrosYamlString = fs.readFileSync(rubrosPath, "utf-8");

        const rubrosYaml = YAML.parse(rubrosYamlString).rubros;

        if ((filter === 'object') && ('nombre' in filter) && (typeof filter.nombre === 'string')) {
            return rubrosYaml.find(r => r.nombre === filter.nombre);
        }

        return rubrosYaml
    }
}

module.exports = RubroModel;
