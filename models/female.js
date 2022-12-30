const mongoose = require('mongoose')


const schema = mongoose.Schema;

const femaleSchema = new schema({



    name: {
        type: String,
    },

    gender: {
        type: String,
    },

    date: {
        type: String,
    },

    month: {
        type: String,
    },




    Discription: {
type: String,

    }

  


})


module.exports = mongoose.model('femaleuser', femaleSchema)