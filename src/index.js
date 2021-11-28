const express = require('express')
require('./db/mongoose')
var cors = require('cors')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')
const packageRouter = require('./routers/package')
const connectionRouter = require('./routers/connection')
const customerRouter = require('./routers/customer')
const paymentRouter = require('./routers/payment')

const app = express()
app.use(cors())
const port = process.env.PORT || 3000

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)
app.use(packageRouter)
app.use(connectionRouter)
app.use(customerRouter)
app.use(paymentRouter)

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})