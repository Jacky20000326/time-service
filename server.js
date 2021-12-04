const express = require("express");
const app = express();
const http = require("http")
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const mongoose = require("mongoose");
const dotenv = require("dotenv")
dotenv.config()
const bodyParser = require('body-parser');
const AuthRoute = require("./routes/index").Auth
const store = require("./routes/index").store
const interactive = require("./routes/index").interactive
const room = require("./models/roomModel")
const authentication =  require("./config/passport")

const port = process.env.PORT || 3002


// connect cosmos db
// mongoose.connect("mongodb://"+process.env.COSMOSDB_HOST+":"+process.env.COSMOSDB_PORT+"/"+process.env.COSMOSDB_DBNAME+"?ssl=true&replicaSet=globaldb", {
//   auth: {
//     user: process.env.COSMOSDB_USER,
//     password: process.env.COSMOSDB_PASSWORD
//   },
// useNewUrlParser: true,
// useUnifiedTopology: true,
// retryWrites: false
// })
// .then(() => console.log('Connection to CosmosDB successful'))
// .catch((err) => console.error(err));

// mongo atlas connect
mongoose.connect("mongodb+srv://778899:778899password@1014db.72drx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", { 
    useUnifiedTopology: true,
    useNewUrlParser: true, 
}).then(()=>{
    console.log("success to connect to mongodb atlas")
}).catch((err)=>{
    console.log(err)
})




// middlewares
app.use(bodyParser.urlencoded({ extended: false }))
app.use("/api/auth",AuthRoute)
app.use("/api/interactive",interactive)
app.use("/api/store",store)
app.use('/api/passport',authentication)
app.use('/api/room',room)

io.on("connection", (socket) => {
    console.log("connect socket server")
    console.log("connect id is"+ socket.id)


    // 裝o置連接socket通知
    // io.emit("connectInfo","The device is connecting")
    
    //broadcast when user connect
    // io.emit("message", "A user is connect")
        // io.emit("get_msg", msg) 此為可以方送給所有user，也包含自己
        // Run when is disconnect

    //使用者離開通知
    socket.on("disconnect",()=>{

        io.emit("message","user have leave rom")
        console.log("user is leaving")

    }); 

    // 創建房間
    socket.on("create_room",()=>{
        let room_id = Math.random().toString(36).slice(-8);
        io.emit("connectroom",room_id)
        room.createRoom(room_id,"616e65d649caf115bb78c345")
        socket.join(room_id)
        // 回傳房間密碼給host
    })

    // 進入房間
    
    socket.on("joinroom",(roomID)=>{
        let clients = io.sockets.adapter.rooms[roomID]
        room.findRoom(roomID,(Room)=>{
            socket.join(Room)
        })
    })

    // 得到host設定的時間
    socket.on("setTime",(roomId,timer)=>{
        room.findRoom(roomId,(Room)=>{
            Room.setTime = timer
            Room.save()
            socket.join(roomId)
            io.in(roomId).emit("getTime",timer)
        })
    })


    socket.on("getTime",(roomId)=>{
        room.findRoom(roomId,(Room)=>{
            socket.join(roomId)
            console.log(Room)
            socket.emit("getTimer",Room.setTime)
        })
    })


    socket.on("start",(isstart,roomId)=>{
        console.log(isstart)
        console.log(`roomId:${roomId}`)
        io.in(roomId).emit("startStudy","isstart")
        })
    });



server.listen(port,()=>{
    console.log(`It's port ${port} `);
})








