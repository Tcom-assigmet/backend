const mongoose = require('mongoose')

const Customer = mongoose.model('Customer', {
    cusName: {
        type: String,
        required: true,
        trim: true
    },
    nic: {
        type: String,
        default: false
    },
  
    cBranch: {
        type: String,
        default: true
    },
    cAddress: {
        type: String,
        default: true
    },
    cEmail: {
        type: String,
        default: true
    },
})

module.exports = Customer