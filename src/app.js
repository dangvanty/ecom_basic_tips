const compression = require('compression')
const express = require('express')
const { default: helmet } = require('helmet')
const morgan = require('morgan')
const app = express()

//init middleware
app.use(morgan("dev")) //render log status, thoi gian phan hoi

app.use(helmet()) //bao ve thong tin ung dung

app.use(compression()) // 
//init db


// init route 
app.get('/',(req,res,next)=>{
  return res.status(200).json({
    message:"Welcome "
  })
})

// handling error

module.exports = app 