const app = require('../app');
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

const login = async () => {
  // this is a normal funcion to get the login token.
  const response = await request(app)
    .post('/api/customer/login')
    .send({
      email: 'test6@test.com',
      password: 'password'
    });

  return JSON.parse(response.text).access_token;
};
const saveOrder = async () => {
  const token = await login();
  const res = await request(app)
    .post('/api/orders/new-saved-order')
    .set('authorisation', `Bearer ${token}`)
    .send({
      height: '1',
      width: '1',
      depth: '1',
      colour: 'White',
      price: '199',
      furnitureType: 'custom'
    });
    // console.log(res)
    
};
const getID = async () => {
  const token = await login();
  await saveOrder();
  const response = await request(app)
  .get('/api/orders/my-saved-orders')
  .set('authorisation', `Bearer ${token}`)

  
  return JSON.parse(response.text)[0]._id;
};

describe('test the order-routes', () => {
  test('Gets the reviews', async done => {
    const res = await request(app).get('/api/orders/reviews');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);

    done();
  });

  test('gets my-saved-orders', async done => {
    const token = await login();
    const res = await request(app)
      .get('/api/orders/reviews')
      .set('authorisation', `Bearer ${token}`);

    expect(res.status).toBe(200);

    expect(Array.isArray(res.body)).toBe(true);

    done();
  });

  test('patch new review', async done => {
    const token = await login();
    const res = await request(app)
      .patch('/api/orders/new-review')

      .set('authorisation', `Bearer ${token}`);
    expect(res.status).toBe(200);
    done();
  });

  test('patch remove saved order', async done => {
    const token = await login();
    const ID = await getID();

    const res = await request(app)
      .patch('/api/orders/remove-saved-order')
      .set('authorisation', `Bearer ${token}`)
      .send({ orderID: ID });
    expect(res.status).toBe(200);
    done();
  });

  test('post new saved order', async done => {
    const token = await login();
    const res = await request(app)
      .post('/api/orders/new-saved-order')
      .set('authorisation', `Bearer ${token}`)
      .send({
        height: '1',
        width: '1',
        depth: '1',
        colour: 'White',
        price: '199',
        furnitureType: 'custom'
      });
    expect(res.status).toBe(200);

    done();
  });

  test('post new purchased order', async done => {
    const token = await login();
    const res = await request(app)
      .post('/api/orders/new-purchased-order')
      .set('authorisation', `Bearer ${token}`)
      .send({
        height: '1',
        width: '1',
        depth: '1',
        colour: 'White',
        price: '199',
        furnitureType: 'custom'
      });
    expect(res.status).toBe(200);

    done();
  });
});
