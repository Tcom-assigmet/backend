const express = require('express')
const Package = require('../models/package')
const Payment = require('../models/payment')
const router = new express.Router()

router.post('/payment', async(req, res) => {

    const payment = new Payment(req.body)

    try {
        // Package.findById(req.body.product)
        //     .then(product => {
        //         if (!product) {
        //             return res.status(404).json({
        //                 message: "package not found"
        //             });
        //         }

        //     })
        await payment.save()
        res.status(201).send(payment)

    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/payment', async(req, res) => {
    try {
        const payment = await Payment.find({})
        res.send(payment)
    } catch (e) {
        res.status(500).send()
    }

})

router.get('/payment/:id', async (req, res) => {
    const _id = req.params.id

    try {
        const payment = await Payment.findById(_id)

        if (!payment) {
            return res.status(404).send()
        }
        
        res.send(payment)
    } catch (e) {
        res.status(500).send()
    }
})

// router.patch('/package/:id', async (req, res) => {
//     const updates = Object.keys(req.body)
//     const allowedUpdates = ['description', 'completed']
//     const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

//     if (!isValidOperation) {
//         return res.status(400).send({ error: 'Invalid updates!' })
//     }

//     try {
//         const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

//         if (!task) {
//             return res.status(404).send()
//         }

//         res.send(task)
//     } catch (e) {
//         res.status(400).send(e)
//     }
// })

// router.delete('/payment/:id', async (req, res) => {
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