const express = require("express");
const app = express();
const {chats} = require("./backend/data/data")
const dotenv = require("dotenv");

dotenv.config();
const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.send('chat server is running');
})

app.get('/api/chat',(req,res)=>{
    res.send(chats)
})

//? for single chat id 
app.get("/api/chat/:id",(req,res)=>{
    //? id data will get in console.log(req.params.id)
    const singleChat = chats.find((c)=>c._id === req.params.id);
    res.send(singleChat)
})

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));