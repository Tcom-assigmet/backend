const express = require('express')
const Package = require('../models/package')
const Connection = require('../models/connection')
const router = new express.Router()

router.post('/connection', async(req, res) => {

    const connection = new Connection(req.body)

    try {
        // Package.findById(req.body.product)
        //     .then(product => {
        //         if (!product) {
        //             return res.status(404).json({
        //                 message: "package not found"
        //             });
        //         }

        //     })
        await connection.save()
        res.status(201).send(connection)

    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/connection', async(req, res) => {

    try {
        const connection = await Connection.find({})
        res.send(connection)
    } catch (e) {
        res.status(500).send()
    }
    // try {
    //     const connections = await Connection.find({}). //populate from customer and package
    //     populate('customer').
    //     populate('package')
    //         .exec().then(docs => {
    //             res.status(200).json({
    //                 count: docs.length,
    //                 connection: docs.map(doc => {
    //                     return {
    //                         _id: doc._id,
    //                         package: doc.package,
    //                         customer: doc.customer,
    //                         connectionstatus: doc.connectionstatus,
    //                         phoneNum: doc.phoneNum,
                           
    //                     }
    //                 })
    //             })
    //         })
    //     res.send(connections)
    // } catch (e) {
    //     res.status(500).send()
    // }
})

router.get('/connection/:id', async (req, res) => {
    const _id = req.params.id

    try {
        const connection = await Connection.findById(_id)

        if (!connection) {
            return res.status(404).send()
        }

        res.send(connection)
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/connectionbynum/:num', async (req, res) => {
    const phoneNum  = req.params.num

    //get connection by phone number
    try {
        const connection = await Connection.find({phoneNum: phoneNum})
        //populate from customer and package
        .populate('customer').
        populate('package')
            .exec().then(docs => {
                res.status(200).json({
                    count: docs.length,
                    connection: docs.map(doc => {
                        return {

                            _id: doc._id,
                            package: doc.package,
                            customer: doc.customer,
                            connectionstatus: doc.connectionstatus,
                            phoneNum: doc.phoneNum,
                        
                        }
                    })
                })
            })

        if (!connection) {
            return res.status(404).send()
        }

        res.send(connection)
    } catch (e) {
        res.status(500).send()
    }

})




router.get('/connectionbycus/:id', async (req, res) => {
    const _id = req.params.id

   //find connection by customer id
    try {
        const connection = await Connection.find(). //populate from customer and package
        populate('customer').
        populate('package')
            .exec().then(docs => {
                res.status(200).json(//filter by customer id
                    docs.filter(doc => {
                        return doc.customer._id == _id
                    })
                    .map(doc => {
                        
                        return {
                            _id: doc._id,
                            package: doc.package,
                            customer: doc.customer,
                            connectionstatus: doc.connectionstatus,
                            phoneNum: doc.phoneNum,
                           
                        }
                    })
                )
            })
        res.send(connection)

           

       
    } catch (e) {
        res.status(500).send()
    }
})

//                 //     {
//                 //     count: docs.length,
//                 //     connection: docs.filter(docs.customer._id===_id).map(doc => {
//                 //         return {
//                 //             _id: doc._id,
//                 //             package: doc.package,
//                 //             customer: doc.customer,
//                 //             connection: doc.connection,
//                 //             request: {
//                 //                 type: "GET",
//                 //                 url: "http://localhost:3000/connection/" + doc._id
//                 //             }
//                 //         }
//                 //     })
//                 // }
//                 )
//             })
//         res.send(connection)
//     }
//     catch (e) {
//         res.status(500).send()
//     }

// })

router.patch('/connection/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['package']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        const connection = await Connection.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

        if (!connection) {
            return res.status(404).send()
        }

        res.send(connection)
    } catch (e) {
        res.status(400).send(e)
    }
})

// router.delete('/package/:id', async (req, res) => {
//     try {
//         const task = await Task.findByIdAndDelete(req.params.id)

//         if (!task) {
//             res.status(404).send()
//         }

//         res.send(task)
//     } catch (e) {
//         res.status(500).send()
//     }
// })

module.exports = router