const cors = require('cors');
const db=require("./config/mongoose-connect")
let express = require("express")
let app = express();
const cookieParser=require("cookie-parser")
app.use(cookieParser())
require("dotenv").config();

// const allowedOrigins = process.env.ALLOWED_ORIGINS.split(',');

// app.options('*', cors({
//     origin: function (origin, callback) {
//         console.log(origin,allowedOrigins)
//         if (!origin) return callback(null, true);
//         if (allowedOrigins.indexOf(origin) !== -1) {
//             console.log("hello1");
//             callback(null, true);
//         } else {
//             callback(new Error('Not allowed by CORS'));
//         }
//     },
//     credentials: true
// }));

app.use(cors({
    origin: process.env.ORIGIN, // Allow this origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow these methods
    credentials: true // Enable sending cookies
  }));
  
app.use(express.json())
app.use(express.urlencoded({extended:true}))

const indexRouter = require("./routes/indexRouter")
app.use("/",indexRouter)

const userRouter=require("./routes/userRouter")
app.use("/user",userRouter)

app.listen(process.env.PORT,(err)=>{
    if(err){
        console.log(err)
    }
    else{
        console.log(`You are live at http://localhost:${process.env.PORT}/`)
    }
})