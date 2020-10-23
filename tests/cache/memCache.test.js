import { describe, it } from 'mocha';
import { assert, expect } from 'chai';
import { memCache, loadData } from '../../src/cache/memCache';

describe('memCache', () => {
    it('should store and retrieve values', () => {
        memCache.put('ports', ['P1', 'P2', 'P3']);

        const ports = memCache.get('ports');

        assert.isArray(ports);
        assert.isNotEmpty(ports);
        assert.deepEqual(ports, ['P1', 'P2', 'P3']);
    });

    it('should modify existing values in place', () => {
        memCache.put('ports', ['P1', 'P2', 'P3']);

        const ports = memCache.get('ports');

        ports.push('P4');

        expect(memCache.get('ports')).to.have.length(4);
        expect(memCache.get('ports')).to.include('P4');
    });
});

describe('loadData', () => {
    it('should load and cache values from the api', async () => {
        await loadData();

        const ports = memCache.get('ports');
        const vessels = memCache.get('vessels');

        assert.isArray(ports);
        assert.isArray(vessels);
        assert.isNotEmpty(ports);
        assert.isNotEmpty(vessels);
    });
});