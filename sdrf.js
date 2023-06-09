"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var Cluster = require('puppeteer-cluster').Cluster;
var fileURLToPath = require('url').fileURLToPath;
var dirname = require('path').dirname;
var path = require("path");
var fs = require("fs");
var _filename = fileURLToPath(require('url').pathToFileURL(__filename).toString());
var _dirname = dirname(_filename);
var obj;
var filepath = path.resolve(_dirname, './directions.json');
fs.readFile(filepath, function (err, data) {
    if (err) {
        console.log('Read error');
    }
    else {
        obj = JSON.parse(data.toString());
    }
});
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var cluster_1, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                return [4 /*yield*/, Cluster.launch({
                        concurrency: Cluster.CONCURRENCY_CONTEXT,
                        maxConcurrency: 8,
                        monitor: true,
                        puppeteerOptions: {
                            headless: false,
                        }
                    })];
            case 1:
                cluster_1 = _a.sent();
                return [4 /*yield*/, cluster_1.task(function (_a) {
                        var page = _a.page, data = _a.data;
                        return __awaiter(void 0, void 0, void 0, function () {
                            var amountSet, totalSum;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0: return [4 /*yield*/, page.goto(data.url)];
                                    case 1:
                                        _b.sent();
                                        return [4 /*yield*/, page.setViewport({ width: 1028, height: 1024 })];
                                    case 2:
                                        _b.sent();
                                        amountSet = '#C2Csearchamount_searchbox_amount';
                                        return [4 /*yield*/, page.waitForSelector(amountSet).then(function () { return __awaiter(void 0, void 0, void 0, function () {
                                                return __generator(this, function (_a) {
                                                    switch (_a.label) {
                                                        case 0: return [4 /*yield*/, page.type(amountSet, data.sum.toString()).then(function () { return __awaiter(void 0, void 0, void 0, function () {
                                                                return __generator(this, function (_a) {
                                                                    switch (_a.label) {
                                                                        case 0: return [4 /*yield*/, page.evaluate(function () {
                                                                                for (var _i = 0, _a = Array.from(document.querySelectorAll('div')); _i < _a.length; _i++) {
                                                                                    var div = _a[_i];
                                                                                    if (div.innerText == "Поиск" || div.innerText == "Search")
                                                                                        div.click();
                                                                                }
                                                                            })];
                                                                        case 1:
                                                                            _a.sent();
                                                                            return [2 /*return*/];
                                                                    }
                                                                });
                                                            }); })];
                                                        case 1:
                                                            _a.sent();
                                                            return [2 /*return*/];
                                                    }
                                                });
                                            }); })];
                                    case 3:
                                        _b.sent();
                                        totalSum = 0;
                                        return [4 /*yield*/, page.waitForSelector('div[data-tutorial-id="trade_price_limit"]').then(function () { return __awaiter(void 0, void 0, void 0, function () {
                                                var priceDivClass, selector, inner_html, i;
                                                return __generator(this, function (_a) {
                                                    switch (_a.label) {
                                                        case 0: return [4 /*yield*/, page.$eval('div[data-tutorial-id="trade_price_limit"]', function (element) { return element.innerHTML.toString().split('"')[1]; })];
                                                        case 1:
                                                            priceDivClass = _a.sent();
                                                            selector = '.' + priceDivClass;
                                                            return [4 /*yield*/, page.evaluate(function (selector) { return Array.from(document.querySelectorAll("".concat(selector)), function (e) { return e.innerHTML; }); }, selector)];
                                                        case 2:
                                                            inner_html = _a.sent();
                                                            console.log(inner_html);
                                                            for (i = 0; i < data.average; i++) {
                                                                totalSum = totalSum + parseFloat(inner_html[i]);
                                                            }
                                                            totalSum = parseFloat((totalSum / data.average).toPrecision(4));
                                                            return [2 /*return*/];
                                                    }
                                                });
                                            }); })];
                                    case 4:
                                        _b.sent();
                                        obj.directions.forEach(function (element, index) {
                                            if (element.name == data.dir && element.type == data.type) {
                                                obj.directions[index].course = totalSum;
                                                obj.directions[index].datetime = Date.now();
                                            }
                                        });
                                        return [4 /*yield*/, page.screenshot({ path: path.resolve(_dirname, "./".concat(data.dir, "-").concat(data.type, ".png")) })];
                                    case 5:
                                        _b.sent();
                                        return [2 /*return*/];
                                }
                            });
                        });
                    })];
            case 2:
                _a.sent();
                obj.directions.forEach(function (element) {
                    var info = { url: element.url, dir: element.name, sum: element.sum, average: element.averageCount, type: element.type };
                    cluster_1.queue(info);
                });
                return [4 /*yield*/, cluster_1.idle()];
            case 3:
                _a.sent();
                return [4 /*yield*/, cluster_1.close().then(function () {
                        var file = JSON.stringify(obj);
                        fs.writeFile(filepath, file, function (err) {
                            if (err) {
                                console.log('Write error');
                            }
                            else {
                                console.log(fs.readFileSync(filepath, "utf-8"));
                            }
                        });
                    })];
            case 4:
                _a.sent();
                return [3 /*break*/, 6];
            case 5:
                e_1 = _a.sent();
                console.log(e_1);
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); })();
