const memCache = require('memory-cache');
import apiService from '../services/apiService';
import { Schedule } from '../models/Schedule';
import { Vessel } from '../models/Vessel';

const loadData = async () => {
    let vessels = await apiService.fetchVessels();
    let schedules = await Promise.all(
        vessels.data.map(vessel => apiService.fetchScheduleByVesselId(vessel.imo))
    );

    vessels = vessels.data.map(vessel => new Vessel(vessel));
    schedules = schedules.map(schedule => new Schedule(schedule.data));

    memCache.put('vessels', vessels);
    memCache.put('schedules', schedules);
};

const cache = (duration) => {
    return (req, res, next) => {
        const key = '__express__' + req.originalUrl || req.url;
        const cachedBody = memCache.get(key);
        if (cachedBody) {
            res.send(cachedBody);
            return;
        }
        res.sendResponse = res.send;
        res.send = (body) => {
            memCache.put(key, body, duration * 1000);
            res.sendResponse(body);
        };
        next();
    }
};

export {memCache, loadData, cache};