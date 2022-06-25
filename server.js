const express = require('express')
const app = express();
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const mongoose = require('mongoose')
require('dotenv').config()
const AdminRoutes = require('./Routes/adminRoutes')

//middleware
app.use(bodyParser.json())
app.use(cookieParser())
app.use(cors())

const MONGO_URI = 'mongodb+srv://pepu:KqhGEU9zzYjK1ldO@cluster0.squ3el2.mongodb.net/?retryWrites=true&w=majority'
mongoose.connect(MONGO_URI, { useNewUrlParser: true})
.then(() => console.log('database connected'))
.catch((err) => console.log('An error occured', err))

app.get('/', (req, res) => {
  res.send('Hello World')
})

app.use('/admin', AdminRoutes)

const PORT = process.env.PORT || 4000;
app.listen(PORT, console.log(`Server is running on PORT ${PORT}`))