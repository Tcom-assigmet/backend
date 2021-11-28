const mongoose = require('mongoose')

const Connection = mongoose.model('Connection', {
    package: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Package",
        required: true,

    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customer",
        required: true,
    },
    connectionstatus: {
        type: String,
        default: false
    },
    phoneNum:{
        type: String,
        required: true

    },
    cusId: {
        type: String,
        required: true,
    },
})

module.exports = Connection