import { describe, it } from 'mocha';
import { expect } from 'chai';
import apiService from '../../src/services/apiService';

describe('apiService', () => {
    describe('fetchVessels', () => {
        it('should fetch vessels from remote api', async () => {
            let vessels;
            try {
                vessels = await apiService.fetchVessels();
            } catch (e) {
                console.error(e);
            }
            expect(vessels.data).to.be.an('array').with.length(12);
            vessels.data.forEach(vessel => expect(vessel).to.have.property('imo'));
            vessels.data.forEach(vessel => expect(vessel).to.have.property('name'));
        });
    });

    describe('fetchScheduleByVesselId', () => {
        it('should fetch the schedule for the vessel with specified imo', async () => {
            let schedule;
            try {
                schedule = await apiService.fetchScheduleByVesselId('9303807');
            } catch (e) {
                console.error(e);
            }
            expect(schedule.data).to.be.an('object').with.property('portCalls');
        });
    });
});
