'use strict'

const dotenv     = require('dotenv').config()
const bodyParser = require('body-parser')
const cors       = require('cors')
const express    = require('express')
const mustache   = require('mustache-express')


const PORT = 3001
const app = express()

app.engine('html', mustache())
app.set('view engine', 'html')
app.set('views', __dirname + '/views')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use(cors())  // allow invoking this service from anywhere

app.get('/', require('./lib/route-index'))

app.use(express.static('public'))

app.listen(PORT)

console.log(`smartdeco web-service running at http://localhost:${PORT} =====`)
