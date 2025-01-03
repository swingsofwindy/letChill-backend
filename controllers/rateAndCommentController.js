const {db}=require('../firebase')
//GET rate va comment
const getRate=async(req, res)=>{
    const songId=req.params.id;
    try {
        // const racSnapshot=await db.collection('rac').where('songId','==',songId).get();
        // const racCount=racSnapshot.size;
        // if (racSnapshot.empty) {
        //     return res.status(200).json({
        //         racCount: 0,
        //         racList: [],
        //         message: "No matching documents found."
        //     });
        // }

        // const racList=racSnapshot.docs.map(doc=>{
        //     const data=doc.data();
        //     return{
        //         creatorId: data.creatorId,
        //         rate: data.rate,
        //         comment:data.comment
        //     };
        // });

        // res.status(201).json({
        //     racCount:racCount,
        //     racList:racList
        // });
        res.status(201).json({
            racCount:5,
            racList:[
                {
                    creatorId: 'YenTran',
                    rate: 5,
                    comment: 'Chill.'
                },
                {
                    creatorId:'KhoaQuan',
                    rate: 4,
                    comment: 'Sleep.'
                }
            ]
        });
        console.log({
            songId: songId
        })
    } catch (error) {
        res.status(400).json({message: "Fail", error:error.message});
    }
}

//CREATE rate va comment
const addRate=async(req, res)=>{
    const songId=req.params.id;
    const{uid,rate, comment}=req.body;
    try {
        // await db.collection('rac').doc().set({
        //     songId: songId,
        //     creatorId:uid,
        //     rate: rate||'0',
        //     comment: comment
        // });
        // res.status(201).json({
        //     message:"Success."
        // })
        console.log({
            songId: songId,
            uid: uid,
            rate: rate,
            comment: comment
        })
    } catch (error) {
        res.status(400).json({message: "Fail.", error:error.message});
    }
}

module.exports={
    getRate,
    addRate
}