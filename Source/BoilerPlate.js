const _language = new WeakMap();
const _name = new WeakMap();
const _url = new WeakMap();

class BoilerPlate {
    constructor(language, name, url) {
        _language.set(this, language);
        _name.set(this, name);
        _url.set(this, name);
    }

    get name() { return _name.get(this); }
    get language() { return _language.get(this); }
    get url() { return _url.get(this); }
}

module.exports = BoilerPlate;