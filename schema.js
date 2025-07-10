const joi = require('joi');

module.exports.listingSchema = joi.object({
    Listing: joi.object({
        title: joi.string().required(),
        description: joi.string().required(),
        price: joi.number().required().min(0),
        location: joi.string().required(),
        country: joi.string().required(),
        category: joi.array().items(joi.string().valid("trending","rooms","iconic-cities","mountains","beach","pool","camping","farms","arctic")).required(),
    }).required(),
});

module.exports.reviewSchema = joi.object({
    Review: joi.object({
        rating: joi.number().required().min(1).max(5),
        comment: joi.string().required(),
    }).required(),
})