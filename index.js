const express = require("express");
const app = express();
const { chats } = require("./backend/data/data")
const dotenv = require("dotenv");
const userRoutes = require('./backend/routes/userRoutes')
const { notFound, errorHandler } = require("./backend/middleware/errorMiddleware")
dotenv.config();
const connectDB = require("./backend/config/db");
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

//? for single chat id 
app.get("/api/chat/:id", (req, res) => {
    //? id data will get in console.log(req.params.id)
    const singleChat = chats.find((c) => c._id === req.params.id);
    res.send(singleChat)
})

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));