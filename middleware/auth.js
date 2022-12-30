const jwt = require ("jsonwebtoken")
const paymentDetailsSchema = require("../models/payment-detail")


const auth = async ( req, res, next)=> {
try{

    const token = req.cookies.jwt;
    console.log(token)
   let User = jwt.verify(token, process.env.SECRET_KEY)
  const verifyUser = jwt.verify(token, process.env.SECRET_KEY);
    console.log(User)

   const user = await paymentDetailsSchema.findOne({orderId:verifyUser.orderId})
  console.log(user)

  req.token=token;
  req.user=user
    next();


}catch(error){

    res.status(400).send("require payment")

}


}

module.exports = auth;