const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://184018T:184018T@cluster0.u7lqm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
})