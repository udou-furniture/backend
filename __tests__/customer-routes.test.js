const app = require('../app'); // Link to your server file
const request = require('supertest');
const mongoose = require('mongoose');
require('dotenv').config();

beforeAll(() => {
  const dbConfig = { useNewUrlParser: true, useUnifiedTopology: true };
  mongoose.connect(process.env.TEST_DB_URL, dbConfig, err => {
    if (err) {
      console.log(err);
    }
  });
});

afterAll(() => {
  mongoose.disconnect();
});

// const request = supertest(app)
// test('Testing to see if Jest works', () => {
//   expect(1).toBe(2)
// })
const login = async () => {
  // this is a normal funcion to get the login token.
  const response = await request(app)
    .post('/api/customer/login')
    .send({
      email: 'test6@test.com',
      password: 'password'
    });
  return JSON.parse(response.text).access_token
};

describe('Test customer-routes', () => {
  test('attempts register with already existing test email', async done => {
    const res = await request(app)
      .post('/api/customer/register')
      .send({
        email: 'test6@test.com',
        password: 'password'
      });

    expect(res.status).toBe(500);
    // console.log(res.text); // this returns the access token when it is not a 500, if its a new email.
    done();
  });

  it('requests without the token ', async done => {
    const res = await request(app).get('/api/customer/check-token');

    expect(res.status).toBe(403);

    // ...
    done();
  });

  it('logins', async done => {
    // const token = await login();
    const res = await request(app)
      .post('/api/customer/login')
      .send({
        email: 'test6@test.com',
        password: 'password'
      });
  
    expect(res.status).toBe(200);
    done();
  });
  it('enters new customer details', async done => {
    const token = await login();
    const res = await request(app)
      .patch('/api/customer/new-customer-details')
      .set('authorisation', `Bearer ${token}`)
      .send({
        firstName: 'KYLE',
        lastName: 'SMITH',
        address: '123 RealAF Street',
        city: 'Moon City',
        state: 'Moon',
        postcode: '6969',
        phoneNumber: '0411111111'
      });
    expect(res.status).toBe(200);
    done();
  });
});


