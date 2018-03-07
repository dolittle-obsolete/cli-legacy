const _language = new WeakMap();
const _name = new WeakMap();
const _description = new WeakMap();

class BoilerPlate {
    constructor(language, name, description) {
        _language.set(this, language);
        _name.set(this, name);
        _description.set(this, description);
    }

    get name() { return _name.get(this); }
    get language() { return _language.get(this); }
    get description() { return _desription.get(this); }
}

module.exports = BoilerPlate;