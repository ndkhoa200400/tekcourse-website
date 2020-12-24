const catchAsync = require("../utils/catchAsync");
const axios = require('axios');



exports.addToCart = catchAsync(async (req, res, next) => {
    try {

        if (req.session.cart) {
            if (!req.session.cart.includes(req.body.id))
                req.session.cart.push(req.body.id);
        }
        else {
            req.session.cart = [req.body.id];
        }
        res.redirect(req.headers.referer);
    } catch (error) {
        console.log(error);
    }
});