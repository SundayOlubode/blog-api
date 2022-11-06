const mongoose = require('mongoose')
const app = require('../app')
const request = require('supertest')

require('dotenv').config()

beforeEach(async () => {
    await mongoose.connect(process.env.DBConnectionUrl);
});

afterEach(async () => {
    await mongoose.connection.close();
});

describe('POST /login', () => {
    it('should log in a user', async () => {
        request(app)
            .post('/login')
            .send({email: 'bigshow@gmail.com', password: 'zuzu'})
            .expect(200)
            .expect('Content-Type', 'application/json')
    })
})

describe('POST /signup', () => {
    it('should sign up a user', async () => {
        request(app)
            .post('/signup')
            .send({email: 'mimi@gmail.com',  firstname: "Mimi",
            lastname: "Doe", password: 'zuzu'})
            .expect(200)
            .expect('Content-Type', 'application/json')
    })
})