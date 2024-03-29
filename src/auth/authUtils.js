'use strict'
const JWT = require('jsonwebtoken')
const { AuthFailureError, NotFoundError } = require('../core/error.response')
const asyncHandler = require('../helpers/asyncHandler')
const { findByUserId } = require('../services/keyToken.service')

const HEADER = {
  API_KEY: 'x-api-key',
  CLIENT_ID:'x-client-id',
  AUTHORIZATION: 'authorization'
}

const createTokenPair = async(payload, publicKey, privateKey)=>{
  try {
    //accessToken
    const accessToken = await JWT.sign(payload,publicKey,{
      // algorithm:'RS256',
      expiresIn:'2 days'
    })

    const refreshToken = await JWT.sign(payload,privateKey,{
      // algorithm: 'RS256',
      expiresIn: '7 days'
    })

    JWT.verify(accessToken,publicKey, (err,decode)=>{
      if(err){
        console.error('error verify:::', err)
      }else{
        console.log('decode verify:::',decode)
      }
    })

    return {accessToken, refreshToken}
  } catch (error) {
    
  }
}

const authentication = asyncHandler(async(req,res,next)=>{
  /*
    1- Check userId missing??
    2- get access token
    3- verifyToken
    4- check user in dbs?
    5- check keyStore with this userId
    6- Ok all -> return next()
  */
  //-------------
  //1.
  const userId = req.headers[HEADER.CLIENT_ID]
  if(!userId) throw new AuthFailureError('Invalid request')

  //2.
  const keyStore = await findByUserId(userId)
  if(!keyStore) throw new NotFoundError('Not found keyStore')

  //3. 
  const accessToken = req.headers[HEADER.AUTHORIZATION]
  if(!accessToken) throw new AuthFailureError('Invalid request')

  // decode ko dc thì throw lỗi
  try {
    const decodeUser = JWT.verify(accessToken, keyStore.publicKey)
    if(userId != decodeUser.userId) throw new AuthFailureError('Invalid UserId')
    req.keyStore = keyStore
    return next()
  } catch (error) {
    throw error
  }
})

module.exports= {
  createTokenPair,
  authentication
}