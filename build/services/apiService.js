"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _axios = _interopRequireDefault(require("axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function fetchVessels() {
  return _axios.default.get('https://import-coding-challenge-api.portchain.com/api/v2/vessels');
}

function fetchScheduleByVesselId(id) {
  return _axios.default.get(`https://import-coding-challenge-api.portchain.com/api/v2/schedule/${id}`);
}

var _default = {
  fetchVessels,
  fetchScheduleByVesselId
};
exports.default = _default;