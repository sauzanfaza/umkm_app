//setup server
const express = require('express')
const cors = require('cors')
const produkRoutes = require('./src/routes/produk')
require('dotenv').config()
require('./src/config/db')

//init app
const app = express()

//middleware
app.use(cors())
app.use(express.json())
app.use('/produk', produkRoutes)

//test route nya
app.get('/', (req, res) => {
    res.send('API UMKM coba dulu dah jalan')
})

//jalanin server
const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})