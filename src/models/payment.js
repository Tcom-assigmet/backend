const mongoose = require('mongoose')

const Payment = mongoose.model('Payment', {
   
    connection: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Connection",
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now
    },
    status: {
        type: Boolean,
       default: false,
    },
 
})

module.exports = Payment