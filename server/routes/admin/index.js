module.exports = app =>{
    const express = require('express')
    const jwt = require('jsonwebtoken')
    const AdminUser = require('../../models/AdminUser')
    const assert = require('http-assert')
    const router = express.Router({
        mergeParams:true
    })
    router.post("/",async (req,res)=>{
       const model = await req.Model.create(req.body)
       res.send(model)
    })
    router.put("/:id",async (req,res)=>{
        const model = await req.Model.findByIdAndUpdate(req.params.id,req.body)
        res.send(model)
    })

    //删除  
    router.delete("/:id",async (req,res)=>{
        await req.Model.findByIdAndDelete(req.params.id,req.body)
        res.send({
            success:true
        })
    })

    

    //列表信息
    router.get("/",async (req,res)=>{
        const queryOptions = {}
        if(req.Model.modelName === 'Category'){
            queryOptions.populate = 'parent'
        }
        const items = await req.Model.find().setOptions(queryOptions).limit(10)
        // const items = await req.Model.find().populate('parent').limit(10)
        res.send(items)
    })

    //根据id获取一条信息
    router.get("/:id",async (req,res)=>{
        const model = await req.Model.findById(req.params.id)
        res.send(model)
    })

    //登录校验中间件
    const authMiddleware = require('../../middleware/auth')

    //模型中间件
    const resourceMiddleware = require('../../middleware/resource')
     
    app.use("/admin/api/rest/:resource",authMiddleware(),resourceMiddleware(),router)


    //图片上传
    const multer = require('multer')
    const upload = multer({dest:__dirname + '/../../uploads'})
    app.post('/admin/api/upload',authMiddleware(),upload.single('file'),async (req,res)=>{
        const file = req.file
        file.url = `http://localhost:3000/uploads/${req.file.filename}`
        res.send(file)
    })


    //登录
    app.post('/admin/api/login', async (req,res)=>{
        const {username,password} = req.body
        //1.用户名找用户
        
        // const user = await AdminUser.findOne({username}).select('+password')
        const user = await AdminUser.findOne({username}).select('+password')
        // if(!user){
        //     return res.status(422).send({
        //         message:'用户不存在'
        //     })
        // }
        assert(user,401,'用户不存在')

        //2.校验密码
        // const isValid =  require('bcrypt').compareSync(password,user.password)
        // if(!isValid){
        //     return res.status(422).send({
        //         message:'密码错误'
        //     })
        // }

        //3.返回token
        const token = jwt.sign({ id:user._id },app.get('secret'))
        res.send({token})
    })


    //错误处理
    app.use(async (err,req,res,next)=>{
        res.status(err.statusCode || 500).send({
            message:err.message
        })
    })
}