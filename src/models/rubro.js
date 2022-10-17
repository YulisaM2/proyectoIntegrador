const fs = require('fs');
const path = require('path');

const YAML = require('yaml');

class RubroModel {

    /**
     * Buscar todos los rubros.
     * @returns {Rubro[]} rubros
     */
    static find() {
        const rubrosPath = path.join(__dirname, '../../config/rubros.yaml');

        const rubrosYamlString = fs.readFileSync(rubrosPath, "utf-8");

        const rubrosYaml = YAML.parse(rubrosYamlString);

        return rubrosYaml.rubros
    }
}

module.exports = RubroModel;
