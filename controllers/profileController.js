const {db}=require('../firebase')

//GET profile
const getProfile= async (req, res)=>{
    const uid=req.params.id;
    try{
        const userDoc=await db.collection('users').doc(uid).get();
        if(!userDoc.exists)
        {
            console.log("User not exist!");
            return res.status(404).json({ message: "User not found." });;
        }
        const userName=userDoc.data().name;

        const playlistSnapshot=await db.collection('playlist').where('creatorId','==',uid).get();
        const playlistCount=playlistSnapshot.size;
        console.log(`Tên người dùng: ${userName}`);
        console.log(`Số danh sách phát: ${playlistCount}`);

        res.status(200).json({
            name: userName,
            playlistCount: playlistCount
        });
        console.log({uid: uid});
         res.status(200).json({
            name: 'YenTran',
            playlistCount: '0'
        });
    }
    catch(error){
        res.status(400).json({message:'Fail.', error:error.message});
    }
}

//UPDATE profile
const updateProfile=async(req, res)=>{
    const {uid, newName}=req.body;
    try{
        const userRef=db.collection('users').doc(uid);
        await userRef.update({name:newName});
        res.status(200).json({message:"Rename success!"})
        console.log({
            uid: uid,
            newName: newName
        })
    }
    catch(error){
        res.status(400).json({message:'Fail.', error:error.message});
    }
}

module.exports={
    getProfile,
    updateProfile
}