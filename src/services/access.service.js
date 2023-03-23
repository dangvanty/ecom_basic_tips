'use strict'

const shopModel = require("../models/shop.model")
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const keyTokenService = require("./keyToken.service")
const { createTokenPair } = require("../auth/authUtils")
const { getIntoData } = require("../utils")
const { BadRequestError, AuthFailureError } = require("../core/error.response")
const { findByEmail } = require("./shop.service")
const KeyTokenService = require("./keyToken.service")

const RoleShop = {
  SHOP: 'SHOP',
  WRITE: 'WRITE',
  EDITOR: 'EDITOR',
  ADMIN: 'ADMIN'
}

class AccessService {
  static logout = async(keyStore)=>{
    const delKey = await KeyTokenService.removeKeyById(keyStore._id)
    console.log({delKey})
    return delKey
  }

  /*
    1- Check email in db 
    2- match password
    3- create Atoken và Rtoken và save
    4- generate tokens
    5- get data return login. 
  */
  static login = async ({email,password, refreshToken = null})=>{
    //1.
    const foundShop = await findByEmail({email})
    if (!foundShop) throw new BadRequestError('Shop is not registered')
    //2.
    const match = bcrypt.compare(password,foundShop.password)
    if(!match) throw new AuthFailureError('Authentication error')

    //3. created privatedKey, publicKey
    const privateKey = crypto.randomBytes(64).toString('hex')
    const publicKey = crypto.randomBytes(64).toString('hex')

    //4. generate tokens
    const {_id:userId}=foundShop
    const tokens = await createTokenPair({userId, email}, publicKey, privateKey)

    await KeyTokenService.createKeyToken({refreshToken:tokens.refreshToken, privateKey,publicKey,userId})
    return {
        shop: getIntoData({fileds:['_id','name','email'],object:foundShop}),
        tokens
    }
  }

  static signUp = async ({name, email, password})=>{
      // step1: check email exists
      const holderShop = await shopModel.findOne({email}).lean() // lean để trả về obj js thuần không có các râu ria như kết nối,...
      if(holderShop){
         throw new BadRequestError('Error: Shop is already registered!')
      }
      // hash password 
      const passwordHash = await bcrypt.hash(password,10)
      const newShop  = await shopModel.create({
        name, email, password: passwordHash, roles: [RoleShop.SHOP]
      })

      if(newShop){
        // created privateKey, publicKey: --> privateKey: dùng để sign token//--> người dùng,
        // publicKey dùng để verify token --> db 
        // const {privateKey, publicKey} = crypto.generateKeyPairSync('rsa',{
        //   modulusLength: 4096,
        //   publicKeyEncoding: {
        //     type: 'pkcs1',
        //     format: 'pem'
        //   },
        //   privateKeyEncoding: {
        //     type: 'pkcs1',
        //     format: 'pem' // dđịnh dạng mã hóa nhị phân 
        //   }
        // })

        //  cách đơn giản --> lưu cả private và public vào keytoken: 
        const privateKey = crypto.randomBytes(64).toString('hex')
        const publicKey = crypto.randomBytes(64).toString('hex')
        console.log({privateKey, publicKey}) // save collection keyStore
        
        const keyStore = await keyTokenService.createKeyToken({
          userId: newShop._id,
          privateKey,
          publicKey
        })

        if(!keyStore){
          throw new BadRequestError('Error: publicKeyString Error')
          
        }

        // const publicKeyObject = crypto.createPublicKey(publicKeyString)
        // // create token pair 
        const tokens = await createTokenPair({userId: newShop._id, email}, publicKey, privateKey)
        console.log('created token success', tokens)
        return {
          code: 201,
          metaData: {
            shop: getIntoData({fileds:['_id', 'name', 'email'], object: newShop}),
            tokens
          }
        }
      }

      return {
        code: 201,
        metaData: null
      }
  }

}

module.exports = AccessService