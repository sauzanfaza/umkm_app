//setup server
const express = require('express')
const cors = require('cors')
const produkRoutes = require('./src/routes/produk')
const penjualanRoutes = require('./src/routes/penjualan')
const laporanRouter = require('./src/routes/laporan')
require('dotenv').config()
require('./src/config/db')

//init app
const app = express()

//middleware
app.use(cors())
app.use(express.json())
app.use('/produk', produkRoutes)
app.use('/penjualan', penjualanRoutes )
app.use('/laporan', laporanRouter)

//test route nya
app.get('/', (req, res) => {
    res.send('API UMKM coba dulu dah jalan')
})

//jalanin server
const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})