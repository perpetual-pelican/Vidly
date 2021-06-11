const mongoose = require('mongoose');
const Joi = require('joi');
const moment = require('moment');
const { customerSchema } = require('./customer');
const { movieSchemaFields } = require('./movie');

const rentalSchema = new mongoose.Schema({
    customer: {
        type: customerSchema,
        required: true
    },
    movie: {
        type: new mongoose.Schema(movieSchemaFields),
        required: true
    },
    dateOut: {
        type: Date,
        required: true,
        default: Date.now
    },
    dateReturned: {
        type: Date
    },
    rentalFee: {
        type: Number,
        min: 0
    }
});

rentalSchema.statics.lookup = function(customerId, movieId) {
    return this.findOne({
        'customer._id': customerId,
        'movie._id': movieId
    });
};

rentalSchema.methods.return = async function() {
    this.dateReturned = Date.now();
    
    const daysOut = moment(this.dateReturned).diff(this.dateOut, 'days');
    this.rentalFee = daysOut * this.movie.dailyRentalRate;

    await this.save();
};

const Rental = mongoose.model('Rental', rentalSchema);

function validate(rental) {
    const schema = Joi.object({
        customerId: Joi.objectId().required(),
        movieId: Joi.objectId().required()
    });
    return schema.validate(rental);
}

exports.Rental = Rental;
exports.validate = validate;