const admin=require('firebase-admin');

//Login
 const signinUser=async (req,res)=>{
    const {email, password}=req.body;
    try {
        const user=await admin.auth().getUserByEmail(email);
        res.status(200).json({message:"Đăng nhập thành công", uit: user.uid});
        } catch (error) {
        res.status(400).json({message:"Đăng nhập thất bại", error: error.message});
    }
 }

//Signup
const signupUser=async (req,res)=>{
    const {email, password, name, birth, gender}=req.body;
    try {
        const userRecord=await admin.auth().createUser({
            email:email, 
            password:password
        });
        console.log("Đăng ký thành công")
        
        await admin.firestore().collection('users').doc(userRecord.uid).set({
            userId:userRecord.uid,
            name:name,
            birth: birth,
            gender: gender,
            imageUrl:""
        });

        res.status(201).json({
            message: "Đăng ký thành công!",
            uid: userRecord.uid
        });
    } catch (error) {
        res.status(400).json({message:"Đăng ký thất bại!", error:error.message});
    }
}

module.exports={signinUser,signupUser}