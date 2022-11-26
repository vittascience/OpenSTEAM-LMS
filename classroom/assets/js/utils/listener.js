var x = {
    init: false,
    _init: false,
    trad: false,
    _trad: false,
    modals: false,
    _modals: false,
    initListener: function (val) {
        if (val != false) {
            toolboxInit(val)
        }
    },
    set init(val) {
        this._init = val;
        this.initListener(val);
    },
    get init() {
        return this.init;
    },
    tradListener: function (val) {
        if (val != false && this._modals != false) {
            $('body').localize()
        }
    },
    set trad(val) {
        this._trad = val;
        this.tradListener(val);
    },
    get trad() {
        return this.trad;
    },
    modalsListener: function (val) {
        if (val != false && this._trad != false) {
            $('body').localize()
        }
    },
    set modals(val) {
        this._modals = val;
        this.modalsListener(val);
    },
    get modals() {
        return this.modals;
    }
}