'use strict'

const shopModel = require("../models/shop.model")
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const keyTokenService = require("./keyToken.service")
const { createTokenPair } = require("../auth/authUtils")
const { getIntoData } = require("../utils")

const RoleShop = {
  SHOP: 'SHOP',
  WRITE: 'WRITE',
  EDITOR: 'EDITOR',
  ADMIN: 'ADMIN'
}

class AccessService {
  static signUp = async ({name, email, password})=>{
    try {
      // step1: check email exists
      const holderShop = await shopModel.findOne({email}).lean() // lean để trả về obj js thuần không có các râu ria như kết nối,...
      if(holderShop){
        return {
          code: 'xxx',
          message: 'Shop already registered!'
        }
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
          return {
            code: 'xxx',
            message: 'publicKeyString Error'
          }
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
      
    } catch (error) {
      return {
        code: 'xxx',
        message: error.message,
        status: 'error'
      }
    }
  }

}

module.exports = AccessService