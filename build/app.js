"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _morgan = _interopRequireDefault(require("morgan"));

var _cors = _interopRequireDefault(require("cors"));

var _memCache = require("./cache/memCache");

var _portRouter = _interopRequireDefault(require("./routes/portRouter"));

var _vesselRouter = _interopRequireDefault(require("./routes/vesselRouter"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('./nativeUtils');

const app = (0, _express.default)();
app.use((0, _morgan.default)('dev'));
app.use(_express.default.json());
app.use(_express.default.urlencoded({
  extended: false
}));
app.use((0, _cors.default)());
const initialize = new Promise((resolve, reject) => {
  (0, _memCache.loadData)().then(() => resolve()).catch(e => reject(e));
});
app.use('/api/ports', _portRouter.default);
app.use('/api/vessels', _vesselRouter.default);
app.use(async (req, res, next) => {
  await initialize;
  next();
});
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send(err);
});
var _default = app;
exports.default = _default;