import Axios from 'axios';

function fetchVessels() {
  return Axios.get('https://import-coding-challenge-api.portchain.com/api/v2/vessels');
}

function fetchScheduleByVesselId(id) {
  return Axios.get(`https://import-coding-challenge-api.portchain.com/api/v2/schedule/${id}`);
}

export default { fetchVessels, fetchScheduleByVesselId };
