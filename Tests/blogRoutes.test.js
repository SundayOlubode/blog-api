const mongoose = require('mongoose')
const blogRoutes = require('../routes/blogRoutes')
const request = require('supertest')

require('dotenv').config()

beforeEach(async () => {
    await mongoose.connect(process.env.DBConnectionUrl);
});

afterEach(async () => {
    await mongoose.connection.close();
});

describe('GET  /', () => {
    it('should get all published blogs', async () => {
        request(blogRoutes)
            .get('/')
            .expect(200)
            .expect('Content-Type', 'application/json')
    })
})

