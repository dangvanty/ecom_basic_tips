'use strict'

const {Schema, model, Types} = require('mongoose'); // Erase if already required
const COLLECTION_NAME = 'ApiKeys'
const DOCUMENT_NAME = 'Apikey'


// Declare the Schema of the Mongo model
var apiKeySchema = new Schema({
    key:{
        type:String,
        required:true,
        unique:true,

    },
    status:{
        type:Boolean,
        default :true
    },
    permissions:{
        type:[String],
        required:true,
        enum:['0000','1111','2222']
    },
    // createdAt:{
    //     type:Date,
    //     default:Date.now,
    //     expires:'30d' // auto delete expries API key after 30 days
    // },
},{
  timestamps:true,
  collection: COLLECTION_NAME
});

//Export the model
module.exports = model(DOCUMENT_NAME, apiKeySchema);