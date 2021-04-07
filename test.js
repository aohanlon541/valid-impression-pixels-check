const assert = require('assert');
const index = require('./index');

describe('Should return results', function() {
    it('Should have 10 total pixels', async function() {
        let results = await index.processData(10);
        assert.equal(results.successCount + results.failedCount, 10);
    });

    it('Should have 3 successful pixels', async function() {
        let results = await index.processData(10);
        assert.equal(results.successCount, 3);
    });

    it('Should have 7 failed pixels', async function() {
        let results = await index.processData(10);
        assert.equal(results.failedCount, 7);
    });

    it('Should have length 7 failed pixels URLS', async function() {
        let results = await index.processData(10);
        assert.equal(results.failedUrls.length, 7);
    });
});