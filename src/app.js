require('dotenv').config()
const compression = require('compression')
const express = require('express')
const { default: helmet } = require('helmet')
const morgan = require('morgan')
const app = express()

//init middleware
app.use(morgan("dev")) //render log status, thoi gian phan hoi

app.use(helmet()) //bao ve thong tin ung dung

app.use(compression()) // giam tai dung luong tu sever gui ve

app.use(express.json())
app.use(express.urlencoded({extended:true} ))
//init db
require('./dbs/init.mongodb')
const {checkOverload, countConnect } = require('./helpers/check.connect')
countConnect()
checkOverload()

// init route 
app.use("/", require('./routes'))

// handling error

module.exports = app 