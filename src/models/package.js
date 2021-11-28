const mongoose = require('mongoose')

const Package = mongoose.model('Package', {
    pName: {
        type: String,
        required: true,
        trim: true
    },
    data: {
        type: String,
        default: false
    },
    freeData: {
        type: String,
        default: false
    },
    monthlyRental: {
        type: String,
        default: false
    },
    postPaid: {
        type: Boolean,
        default: false
    },
})

module.exports = Package