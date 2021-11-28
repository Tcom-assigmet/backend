const express = require('express')
const Package = require('../models/package')
const router = new express.Router()

router.post('/package', async(req, res) => {
    const package = new Package(req.body)

    try {
        await package.save()
        res.status(201).send(package)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/package', async(req, res) => {
    try {
        const packages = await Package.find({})
        res.send(packages)
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/package/:id', async (req, res) => {
    const _id = req.params.id

    try {
        const package = await Package.findById(_id)

        if (!package) {
            return res.status(404).send()
        }

        res.send(package)
    } catch (e) {
        res.status(500).send()
    }
})

router.patch('/package/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['pName', 'data','freeData','monthlyRental','postPaid']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        const package = await Package.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

        if (!package) {
            return res.status(404).send()
        }

        res.send(package)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/package/:id', async (req, res) => {
    try {
        const package = await Package.findByIdAndDelete(req.params.id)

        if (!package) {
            //send status 404 and not found message if package not found
            return res.status(404).send()

            


        }

        res.send(package)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router