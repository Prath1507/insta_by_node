const mongoose = require('mongoose')


const schema = mongoose.Schema;

const maleSchema = new schema({



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


module.exports = mongoose.model('maleuser', maleSchema)