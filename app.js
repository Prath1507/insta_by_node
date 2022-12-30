const express = require('express')
const mongoose = require ('mongoose')
const bodyParser = require ('body-parser')
const homeRouter = require('../insta/routers/homeRouter')

const port = process.env.port ||  8080;
const app = express();



app.set('view engine','ejs')
// db connect
mongoose.set('strictQuery', true);
mongoose.connect('mongodb://localhost:27017/instadata', {usenewUrlParser: true})
const db = mongoose.connection;


db.on("error",()=>{console.log("error in connection")})
db.once('open',()=>{console.log("connected")})

// parse application/json
app.use(bodyParser.json())

app.use(express.static('public'))




app.use(bodyParser.urlencoded({ extended: false }))

app.use('/',homeRouter)


app.listen(port)