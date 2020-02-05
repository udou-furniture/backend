const express = require('express');
const router = express.Router();

const Order = require('../models/Order')
const {verifyToken} = require('../auth/tokenMiddleware')


router.get('/my-orders', verifyToken, (req,res) => {
    const query = {
        customerEmail: req.decoded.email,
        purchased: true
    }
    Order.find(query)
    .then(allOrders => {
        return res.json(allOrders);
    })
    .catch(err => res.json(err));
});

router.get('/my-saved-orders', verifyToken, (req,res) => {
    const query = {
        customerEmail: req.decoded.email,
        saved: true
    }
    Order.find(query)
    .then(allOrders => {
        return res.json(allOrders);
    })
    .catch(err => res.json(err));
});

router.get('/reviews', (req, res) => {
    const query = {
        purchased: true
    }

    Order.find(query)
    .then(allOrders => {
        return res.json(allOrders)
    })
    .catch(err => res.json(err));
});

router.patch('/new-review/', verifyToken, (req,res) => {
    const {orderID, review} = req.body
    const query = {customerEmail: req.decoded.email, _id: orderID}

    Order.findOneAndUpdate(query, {review: review})
    .then( () => {
        return res.end()
    })
})

router.patch('/remove-saved-order', verifyToken, (req,res) => {
    const {orderID} = req.body
    const query = {customerEmail: req.decoded.email, _id: orderID}

    Order.findOneAndUpdate(query, {saved: false})
    .then( () => {
        return res.end()
    })
})

router.post('/new-saved-order', verifyToken, (req, res) => {
    const customerEmail = req.decoded.email;
    const {height, width, depth, colour, price, furnitureType} = req.body
    const purchased = false
    const saved = true
    const review = ''

    Order.create({
        purchased,
        saved,
        review,
        customerEmail,
        configuration: { height, width, depth, colour, price, furnitureType }
    })
    .then(newOrder => {
      res.json(newOrder);
    })
    .catch(err => res.json(err));
});

router.post('/new-purchased-order', verifyToken, (req, res) => {
    const customerEmail = req.decoded.email;
    const {height, width, depth, colour, price, furnitureType} = req.body
    const purchased = true
    const saved = false
    const review = ''

    Order.create({
        purchased,
        saved,
        review,
        customerEmail,
        configuration: { height, width, depth, colour, price, furnitureType }
    })
    .then(newOrder => {
      res.json(newOrder);
    })
    .catch(err => res.json(err));
});

module.exports = router;
