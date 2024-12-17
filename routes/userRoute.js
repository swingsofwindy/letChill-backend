const express=require('express')
const router=express.Router()

//
const{signinUser, signupUser}=require('../controllers/userController')

//Login
router.post('/signin',signinUser)

//Sign up
router.post('/signup',signupUser)

module.exports=router