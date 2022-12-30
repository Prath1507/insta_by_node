const express = require('express')
const maleSchema = require('../models/maleSchema')
const female = require('../models/female')
const jwt = require('jsonwebtoken');
const auth = require("../middleware/auth")
const paymentDetailsSchema = require("../models/payment-detail")



const Router = express.Router();



Router.get("/data", (err, res) => {
    res.render('data')

})

Router.post('/data', async (req, res) => {
    try {
        const {
            name,
            date,
            gender,
            Discription,
            month
        } = req.body;

        console.log(name, date, gender, Discription, month)
        if (gender == "male") {

            const userData = new maleSchema({
                Discription: req.body.Discription,
                date: req.body.date,
                gender: req.body.gender,
                month: req.body.month

            })


            console.log("the success part" + userData)
            // const token = userData.generateAuthToken();
            // console.log("the token part" + token)

            // res.cookie("jwt", token);

            userData.save(err => {
                if (err) {
                    res.render('data', { title: 'Data exist, enter new data' })
                }
                else {
                    res.render('data', { title: 'Done' })
                }
            })
        } else {
            {

                const u = new female({
                    Discription: req.body.Discription,
                    date: req.body.date,
                    gender: req.body.gender,
                    month: req.body.month

                })


                console.log("the success part" + u)

                u.save(err => {
                    if (err) {
                        res.render('data', { title: 'Data exist, enter new data' })
                    } else {
                        res.render('data', { title: 'Done' })
                    }
                })
            }
        }

    } catch (error) {
        res.render('data', { title: 'Error ' })
    }

})




//fetchdata////fetchdata////fetchdata////fetchdata////fetchdata////fetchdata////fetchdata//





Router.get("/", (err, res) => {

 

    res.render('register')

})


Router.post('/register', async (req, res) => {
    try {

        const name= req.body.name;
        const date = req.body.date;
        const month = req.body.month;


        if (req.body.gender == "male") {


            const userdetails = await maleSchema.findOne({ month: month })
            if (req.body.date == userdetails.date) {
                console.log(userdetails)

                res.status(201).render('maleusers', { title: userdetails , name:req.body.name });
            } else {
                res.status(400).send('invalid details');
            }


        } else if (req.body.gender == "female") {
            const femaleuserdetails = await female.findOne({ month: month })
            if (req.body.date == femaleuserdetails.date) {
            console.log(femaleuserdetails)

            res.status(201).render('femaleusers', { title: femaleuserdetails, name:req.body.name });
            }

        } else {
            res.send('invalid password details')
        }

    } catch (error) {
        res.status(400).send('invalid details')
    }

})



const Razorpay = require('razorpay')
const PaymentDetail =  require('../models/payment-detail')
//const { nanoid } = require("nanoid");

// Create an instance of Razorpay
let razorPayInstance = new Razorpay({
	key_id:'rzp_test_MwFcFgWMG8pGlx',
	key_secret:'DwN9cdW8nYyYj0hhlUmCf5hx'
})

/**
 * Make Donation Page
 * 
 */
Router.get('/orderr', function(req, res, next) {
	// Render form for accepting amount
	res.render('pages/payment/order', { 
		title: 'Donate for Animals'
	});
});

/**
 * Checkout Page
 * 
 */
Router.post('/payment/order', async function(req, res, next) {
	params = {
		amount: req.body.amount * 100,
		currency: "INR",
		//receipt: nanoid(),
		payment_capture: "1"
	}
	razorPayInstance.orders.create(params)
	.then(async (response) => {
		const razorpayKeyId = 'rzp_test_MwFcFgWMG8pGlx'
		// Save orderId and other payment details
		const paymentDetail = new PaymentDetail({
			orderId: response.id,
			receiptId: response.receipt,
			amount: response.amount,
			currency: response.currency,
			createdAt: response.created_at,
			status: response.status
		})
		try {
           
			// Render Order Confirmation page if saved succesfully
			await paymentDetail.save()

           
			res.render('pages/payment/checkout', {
				title: "Confirm Order",
				razorpayKeyId: razorpayKeyId,
				paymentDetail : paymentDetail
			})
		} catch (err) {
			// Throw err if failed to save
			if (err) throw err;
		}
	}).catch((err) => {
		// Throw err if failed to create order
		if (err) throw err;
	})
});

/**
 * Verify Payment
 * 
 */

// Router.get('/payment/verify', function(req, res, next) {
// 	// Render form for accepting amount
// 	res.render('pages/payment/order');
// });



Router.post('/payment/verify', async function(req, res, next) {
	body=req.body.razorpay_order_id + "|" + req.body.razorpay_payment_id;
	let crypto = require("crypto");
	let expectedSignature = crypto.createHmac('sha256', 'DwN9cdW8nYyYj0hhlUmCf5hx')
							.update(body.toString())
							.digest('hex');

	// Compare the signatures
	if(expectedSignature == req.body.razorpay_signature) {

        


		// if same, then find the previosuly stored record using orderId,
		// and update paymentId and signature, and set status to paid.
		const paymentdetail = PaymentDetail.findOneAndUpdate(

			{ orderId: req.body.razorpay_order_id },
			{
				paymentId: req.body.razorpay_payment_id,
				signature: req.body.razorpay_signature,
				status: "paid"
                
			},

           
            
			{ new: true },
          
            
			async function(err, doc) {
				// Throw er if failed to save
				if(err){
					throw err
				}
                
               

				// Render payment success page, if saved succeffully
				res.render('pages/payment/success', {
					title: "Payment verification successful",
					paymentDetail: doc

                    

				})
			}
		);
	} else {
		res.render('pages/payment/fail', {
			title: "Payment verification failed",
		})
	}
});









module.exports = Router;