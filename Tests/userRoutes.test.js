const mongoose = require('mongoose')
const userRoutes = require('../routes/userRoutes')
const request = require('supertest')

require('dotenv').config()

const token = process.env.TOKEN

beforeEach(async () => {
    await mongoose.connect(process.env.DBConnectionUrl);
});

afterEach(async () => {
    await mongoose.connection.close();
});

describe('GET /:id', () => {
    it('should get a blog with the specified id', async () => {
        request(userRoutes)
            .get('/user/63677885a8a0bb3a7b30c0b8')
            .expect(200)
            .expect('Content-Type', 'application/json')
    })

    it('should get all blogs for the current user', async () => {
        request(userRoutes)
            .get('/user/myblogs')
            .expect(200)
            .expect('Content-Type', 'application/json')
    })
    it('should create a blog', async () => {
        const response = request(userRoutes)
            .post('/user')
            .set('Authorization', token)
            .send({title: "Json web token", body: "JWT is an authentication method",
            description: "Intro to JWT", tags: ["#JWT"]})
            .expect(200)
            .expect('Content-Type', 'application/json')
    })
    it('should update the state of a blog', async () => {
        const response = request(userRoutes)
            .patch('/user/63680b0a296fcfbab4a33a7e')
            .set('Authorization', token)
            .expect(200)
            .expect('Content-Type', 'application/json')
    })
    it('should delete a blog', async () => {
        const response = request(userRoutes)
            .delete('/user/63680b0a296fcfbab4a33a7e')
            .set('Authorization', token)
            .expect(200)
    })

})