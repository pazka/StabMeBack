"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var events_1 = require("../Services/events");
var allEvents_1 = require("../Services/Constants/allEvents");
var BaseObject_1 = require("./BaseObject");
var TimeStamped = (function (_super) {
    __extends(TimeStamped, _super);
    function TimeStamped(id) {
        var _this = _super.call(this, id) || this;
        _this.LastActive = Date.now();
        _this.DateCreated = Date.now();
        (0, events_1.sub)(allEvents_1.default.OBJECT_IS_ACTIVE, function (id) {
            if (_this.Id == id)
                _this.LastActive = Date.now();
        });
        return _this;
    }
    return TimeStamped;
}(BaseObject_1.default));
exports.default = TimeStamped;
//# sourceMappingURL=TimeStamped.js.map