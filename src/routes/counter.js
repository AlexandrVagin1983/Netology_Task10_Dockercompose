const express = require('express')
const router = express.Router()

const redis = require('redis')
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379'


const client = redis.createClient({ url: REDIS_URL});

(async () => {
    await client.connect()
})()

router.get('/counter/:id/incr', async (req, res) => {
    
    const { id } = req.params
    const cnt = await client.get(id)

    res.json({ id: id, counter: cnt})
})

router.post('/counter/:id', async (req, res) => {
    
    const { id } = req.params
    try {
        const cnt = await client.incr(id)
        res.status(200)
        res.json({ id: id, counter: cnt})
    } catch (err) {
        res.status(500)
        res.json({errcode: 500, errmsg: `redis error: ${err}!`})
    }
        
})

//Получение количества просмотров для массива книг
router.post('/counters', async (req, res) => {
    
    const mBooks = req.body
    const mBooksCounters = []
    for (let book of mBooks) {
        try {
            const cnt = await client.get(book.id)
            mBooksCounters.push({id: book.id, counter: cnt})
        } catch (err) {
            res.status(500)
            res.json({errcode: 500, errmsg: `redis error: ${err}!`})
        }
    }

    res.status(201)
    res.json({mBooksCounters: mBooksCounters})
})

module.exports = router