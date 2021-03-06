const express = require('express')
const Connection  = require('../models/connection')
const Customer = require('../models/customer')

const router = new express.Router()

router.post('/customer', async(req, res) => {
    const customer = new Customer(req.body)

    try {
        await customer.save()
        res.status(201).send(customer)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/customer', async(req, res) => {
    try {
        const customer = await Customer.find({})
        res.send(customer)
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/customer/:id', async (req, res) => {
    const _id = req.params.id

    try {
        const customer = await Customer.findById(_id)

        if (!customer) {
            return res.status(404).send("not found")
        }

        res.send(customer)
    } catch (e) {
        res.status(500).send()
    }
})

router.patch('/customer/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['cusName', 'nic', 'cNumber','cBranch','cAddress','cEmail']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

        if (!customer) {
            return res.status(404).send()
        }

        res.send(customer)
    } catch (e) {
        res.status(400).send(e)
    }
})

//dlete customer and update the reference in Connection model 
// router.delete('/customer/:id', async (req, res) => {
//     try {

        
//         const customer = await Customer.findByIdAndDelete(req.params.id)

//         if (!customer) {
//             return res.status(404).send()
//         }

//         res.send(customer)

//     } catch (e) {
//         res.status(500).send()
//     }
// })

router.delete('/customer/:id', async (req, res) => {
    try {
       
        // const connection = await Connection.findByIdAndUpdate({ cusId: req.params.id })
        const connection = await Connection.findOneAndUpdate({ cusId: req.params.id }, { cusId: null ,customer: null})
        const customer = await Customer.findByIdAndDelete(req.params.id)
        if (!customer) {
            return res.status(404).send()

        }

        res.send({  message: "User has been deleted" })
    } catch (e) {
        res.status(500).send()
    }
})



module.exports = router