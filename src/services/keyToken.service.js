'use strict'

const { Types } = require("mongoose")
const keytokenModel = require("../models/keytoken.model")

class KeyTokenService {
  static createKeyToken = async ({userId,privateKey, publicKey,refreshToken})=>{
    try {
      //lv0
      // const tokens = await keytokenModel.create({
      //   user:userId,
      //   publicKey,
      //   privateKey
      // })
      // return tokens ? tokens.publicKey : null

      //lvxx
      const filter = {user : userId}, update = {
        publicKey, privateKey, refreshTokenUsed:[],refreshToken
      }, options = {upsert:true,new:true}
      const tokens = await keytokenModel.findOneAndUpdate(filter, update, options)
      // nếu chưa có thì insert, còn nếu có thì update
      return  tokens ? tokens.publicKey : null 
    } catch (error) {
      return error
    }
  }

  static findByUserId = async(userId)=>{
    return await keytokenModel.findOne({user: Types.ObjectId(userId)}).lean()
  }
  static removeKeyById = async (id)=>{
    return await keytokenModel.deleteOne(id)
  } 

}

module.exports = KeyTokenService