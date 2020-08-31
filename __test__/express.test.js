const request = require('supertest')
const server = require('../src/server/index')

describe('Test endpoints', () => {
    it('Testing if keys are defined', async() => {
        const res = await request(server).get("/getapikeys");
      expect(res.body.weatherKey).toBeDefined()
      expect(res.body.pixbayKey).toBeDefined()
    })
})
