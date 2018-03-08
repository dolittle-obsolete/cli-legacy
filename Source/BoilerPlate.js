const _language = new WeakMap();
const _name = new WeakMap();
const _description = new WeakMap();
const _realName = new WeakMap();

class BoilerPlate {
    constructor(language, name, description, realName) {
        _language.set(this, language);
        _name.set(this, name);
        _description.set(this, description);
        _realName.set(this, realName);
    }

    get name() { return _name.get(this); }
    get language() { return _language.get(this); }
    get description() { return _desription.get(this); }
    get realName() { return _realName.get(this); }
}

module.exports = BoilerPlate;