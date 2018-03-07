const _language = new WeakMap();
const _name = new WeakMap();
const _description = new WeakMap();
const _file = new WeakMap();

class FileTemplate {
    constructor(language, name, description, file) {
        _language.set(this, language);
        _name.set(this, name);
        _description.set(this, description);
        _file.set(this, file);
    }

    get language() {
        return _language.get(this);
    }

    get name() {
        return _name.get(this);
    }

    get description() {
        return _description.get(this);
    }

    get file() {
        return _file.get(this);
    }
}

module.exports = FileTemplate;