const Joi = require('joi');

const listingSchema = Joi.object({
  listing: Joi.object({

    name: Joi.string().min(3).required().messages({
      'string.empty': 'Name is required',
      'string.min': 'Name must be at least 3 characters long'
    }),
    location: Joi.string().required().messages({
      'string.empty': 'Location is required',
    }),

    category: Joi.string()
    .custom((value, helpers) => {
    const allowed = ['Library', 'Bookstore', 'Stationery', 'Other'];
    const fixed = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
    if (!allowed.includes(fixed)) {
      return helpers.error('any.only');
    }
    return fixed;
  })
  .required()
  .messages({
    'any.only': 'Category must be one of Library, Bookstore, Stationery or Other'
  }),

    openHours: Joi.string().required().messages({
      'string.empty': 'Open hours are required',
    }),
    description: Joi.string().required().messages({
      'string.empty': 'Description is required',
    }),
    contact: Joi.string().pattern(/^[0-9]{10}$/).optional().messages({
      'string.pattern.base': 'Phone number must be 10 digits'
    }),
    rating: Joi.number().min(0).max(5).required().messages({
      'number.base': 'Rating must be a number',
      'number.min': 'Rating must be between 0 and 5',
      'number.max': 'Rating must be between 0 and 5'
    }),
    image: Joi.string().allow('', null), // Optional
  }).required()
});

module.exports = listingSchema;
