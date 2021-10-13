const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const router = express.Router()

require('dotenv').config()

const Schema = mongoose.Schema
const postsSchema = new Schema(
  { author: String, title: String },
  { collection: 'inspections' }
)

const postsData = mongoose.model('PostsData', postsSchema)

const app = express()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())
app.get('/', (req, res, next) => {
  postsData
    .find()
    .limit(20)
    .then(data => res.render('index', { items: data }))
    .catch(err => res.render('error'))
})
const uri = process.env.MONGO_ATLAS_URI

mongoose.connect(uri, { useNewUrlParser: true })
mongoose.connection.once('open', () => {
  console.log('MongoDB connection successfully established')
})

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`)
})
