const app = require('../app'); // Link to your server file
const request = require('supertest');
const mongoose = require('mongoose');
require('dotenv').config({path: '../.env'});
const expect = require("assert")

before(() => {
  console.log(process.env.TEST_DB_URL)
  const dbConfig = { useNewUrlParser: true, useUnifiedTopology: true };
  mongoose.connect(process.env.TEST_DB_URL, dbConfig, err => {
    if (err) {
      console.log(err);
    }
  });
});

after(() => {
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
  it('attempts register with already existing test email', async done => {
    const res = await request(app)
      .post('/api/customer/register')
      .send({
        email: 'test6@test.com',
        password: 'password'
      });

    expect.deepEqual(res.status, 500);
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
    // .set("authorisation", token)
    // console.log(res.text);
    // console.log(JSON.parse(res.text).access_token);
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

// it('logins with no pasword or emails', async done => {
//   const res = await request.post( '/login' );
//         expect( res.status ).toBe( 403 );

// })

// it("doesn't gets the token ", async done => {

//   let token = req.headers['x-access-token'] || req.headers['authorisation']

//   const res = await request.get('/check-token')

//   if (!token)
//   {
//   expect(res.status).toBe(403)
//   }

//   // ...
//   done()
// })
