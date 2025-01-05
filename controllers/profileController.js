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
        const user=userDoc.data();

        const playlistSnapshot=await db.collection('playlist').where('creator','==',uid).get();
        const playlistData = playlistSnapshot.docs.map(doc => {
            const data = doc.data();

            return {
                id: doc.id,
                name: data.name,
                avtUrl: data.avtUrl,
                description: data.description
            }
        })
        const playlistCount=playlistSnapshot.size;
        console.log(`Tên người dùng: ${user.name}`);
        console.log(`Số danh sách phát: ${playlistCount}`);

        res.status(200).json({
            name: user.name,
            imageUrl: user.imageUrl||'',
            playlist: playlistData,
            playlistCount: playlistCount
        });
    }
    catch(error){
        res.status(400).json({message:'Fail.', error:error.message});
    }
}

//UPDATE profile
const updateProfile=async(req, res)=>{
    const uid=req.params.id;
    const {newName, imageUrl}=req.body;
    try{
        const userRef=db.collection('users').doc(uid);
        await userRef.update({
            name:newName,
            imageUrl: imageUrl
        });
        res.status(200).json({message:"Rename success!"})
        console.log({
            newName: newName,
            imageUrl: imageUrl
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