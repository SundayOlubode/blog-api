const mongoose = require('mongoose')
const userRoutes = require('../routes/userRoutes')
const request = require('supertest')

require('dotenv').config()

beforeEach(async () => {
    await mongoose.connect(process.env.DBConnectionUrl);
});

afterEach(async () => {
    await mongoose.connection.close();
});

describe('GET /:id', () => {
    it('should a blog with the specified id', async () => {
        request(userRoutes)
            .get('/user/63677885a8a0bb3a7b30c0b8')
            .expect(200)
            .expect('Content-Type', 'application/json')
    })
})