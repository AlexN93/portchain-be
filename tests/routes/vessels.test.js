import { describe, it } from 'mocha';
import chai, { assert } from 'chai';
import chaiHttp from 'chai-http';
import app from '../../src/app';

chai.use(chaiHttp);

const { request, expect } = chai;

describe('GET /api/vessels', () => {
    it('should return a list of all vessels', done => {
        request(app)
            .get('/api/vessels')
            .end((error, response) => {
                expect(response).to.be.json;
                expect(response).to.have.status(200);
                expect(response.body).to.be.an('array').with.length(12);
                done();
            });
    });

    it('should return a list of all vessels with port call delay percentiles', done => {
        request(app)
            .get('/api/vessels?delayDays=2,7,14&delayPerc=5,20,80')
            .end((error, response) => {
                expect(response).to.be.json;
                expect(response).to.have.status(200);
                expect(response.body).to.be.an('array').with.length(12);
                expect(response.body[0])
                    .to.have.property('portCallDelays')
                    .which.is.an('array')
                    .with.length(3);
                assert.deepEqual(response.body[0].portCallDelays[0], {
                        days: 2,
                        percentiles: [
                            { percentile: 5, value: 0.3 },
                            { percentile: 20, value: 1.48 },
                            { percentile: 80, value: 18.85 }
                        ]
                    }
                );
                done();
            });
    });

    it('should return the top 5 vessels with the least port calls', done => {
        request(app)
            .get('/api/vessels?limit=5&sortKey=portCalls')
            .end((error, response) => {
                expect(response).to.be.json;
                expect(response).to.have.status(200);
                expect(response.body).to.be.an('array').with.length(5);
                expect(response.body.map(port => port.name)).to.include.members([
                    'AL MASHRAB',
                    'APL MIAMI',
                    'MILANO BRIDGE',
                ]);
                done();
            });
    });

    it('should return the top 5 vessels with the most port calls', done => {
        request(app)
            .get('/api/vessels?limit=5&sortKey=portCalls&sortDir=desc')
            .end((error, response) => {
                expect(response).to.be.json;
                expect(response).to.have.status(200);
                expect(response.body).to.be.an('array').with.length(5);
                expect(response.body.map(port => port.name)).to.include.members([
                    'EMPIRE',
                    'NYK CONSTELLATION',
                    'ONE COSMOS',
                ]);
                done();
            });
    });
});
