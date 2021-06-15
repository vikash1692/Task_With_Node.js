const request = require('supertest')
const app = require('../server')
describe('Post Endpoints', () => {
  it('should get a group', async () => {
    const res = await request(app).get('/group');
    expect(res.statusCode).toEqual(200)
  });

  it('should create a user', async () => {
    const res = await request(app).post('/group/createGroup')
    .send({
        login: 'vikash',
        password: 'vikash123'
    })
    expect(res.statusCode).toEqual(201)
  });

  it('should get a user by ID', async () => {
    const res = await request(app).post('/group/1')
    expect(res.statusCode).toEqual(200)
  });

  it('should update a user by ID', async () => {
    const res = await request(app).put('/group/updateGroup/1')
    .send({
        login: 'vikash',
        age: 30
    })
    expect(res.statusCode).toEqual(200)
  });

  it('should delete a user by ID', async () => {
    const res = await request(app).delete('/group/deleteGroup/1')
    expect(res.statusCode).toEqual(200)
  });
})