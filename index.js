const express = require("express");
const app = express();
const { chats } = require("./backend/data/data")
const dotenv = require("dotenv");
const userRoutes = require('./backend/routes/userRoutes')
const { notFound, errorHandler } = require("./backend/middleware/errorMiddleware")
dotenv.config();
const connectDB = require("./backend/config/db");
const chatRoutes = require('./backend/routes/chatRoutes')
const messageRoutes = require('./backend/routes/messageRoutes')
const PORT = process.env.PORT || 5000;
connectDB();
//? so that user json format user data accepted 
app.use(express.json());

//? for mongodb 


//? for server requests 
app.get('/', (req, res) => {
    res.send('chat server is running');
})


app.use("/api/chat", chatRoutes)

app.use('/api/user', userRoutes)

app.use('/api/message', messageRoutes)
//? for single chat id 
app.get("/api/chat/:id", (req, res) => {
    //? id data will get in console.log(req.params.id)
    const singleChat = chats.find((c) => c._id === req.params.id);
    res.send(singleChat)
})

app.use(notFound);
app.use(errorHandler);

const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const io = require("socket.io")(server, {
    pingTimeout: 60000,
    cors: {
        origin: "http://localhost:3000",
        // credentials: true,
    },
});

io.on("connection", (socket) => {
    console.log("Connected to socket.io");
    socket.on("setup", (userData) => {
        socket.join(userData._id);
        socket.emit("connected");
    });

    socket.on("join chat", (room) => {
        socket.join(room);
        console.log("User Joined Room: " + room);
    });
    socket.on("typing", (room) => socket.in(room).emit("typing"));
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

    socket.on("new message", (newMessageRecieved) => {
        var chat = newMessageRecieved.chat;

        if (!chat.users) return console.log("chat.users not defined");

        chat.users.forEach((user) => {
            if (user._id == newMessageRecieved.sender._id) return;

            socket.in(user._id).emit("message recieved", newMessageRecieved);
        });
    });

    socket.off("setup", () => {
        console.log("USER DISCONNECTED");
        socket.leave(userData._id);
    });
});