const express=require('express')
const router=express.Router()

//
const{signinUser, signupUser}=require('../controllers/userController')

//Login
router.post('/sign-in',signinUser)

//Sign up
router.post('/sign-up',signupUser)

module.exports=router