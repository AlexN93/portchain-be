"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.loadData = exports.memCache = void 0;

var _apiService = _interopRequireDefault(require("../services/apiService"));

var _Schedule = require("../models/Schedule");

var _Vessel = require("../models/Vessel");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const memCache = require('memory-cache');

exports.memCache = memCache;

const loadData = async () => {
  let vessels = await _apiService.default.fetchVessels();
  let schedules = await Promise.all(vessels.data.map(vessel => _apiService.default.fetchScheduleByVesselId(vessel.imo)));
  vessels = vessels.data.map(vessel => new _Vessel.Vessel(vessel));
  schedules = schedules.map(schedule => new _Schedule.Schedule(schedule.data));
  memCache.put('vessels', vessels);
  memCache.put('schedules', schedules);
};

exports.loadData = loadData;