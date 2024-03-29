require('dotenv').config()
const compression = require('compression')
const express = require('express')
const { default: helmet } = require('helmet')
const morgan = require('morgan')
const app = express()

//***init middleware
app.use(morgan("dev")) //render log status, thoi gian phan hoi

app.use(helmet()) //bao ve thong tin ung dung

app.use(compression()) // giam tai dung luong tu sever gui ve

app.use(express.json())
app.use(express.urlencoded({extended:true} ))
//***init db
require('./dbs/init.mongodb')
const {checkOverload, countConnect } = require('./helpers/check.connect')
countConnect()
checkOverload()

//***init route 
app.use("/", require('./routes'))

//***handling error
// hàm middelware
app.use((req,res,next)=>{
  const error = new Error('Not found')
  error.status = 404
  next(error)
})

// hàm xử lý lỗi: 
app.use((error,req,res,next)=>{
  console.log("err",error)
  const statusCode = error.status || 500
  return res.status(statusCode).json({
    status: 'error',
    code: statusCode,
    message: error.message || 'Internal Server Error'
  })
})
module.exports = app 