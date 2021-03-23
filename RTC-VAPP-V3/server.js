const express = require('express');
const app = express();
const server = require('http').Server(app); //! this step is for sceurity issuse
const io = require('socket.io')(server);
const { v4:uuidV4 } = require('uuid');
const PORT = process.env.PORT || 443 || 5500 || 80;
const HOST = process.env.HOST || 'localhost';
const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server , { debug : true });

//* setting the view engine and its static folder
app.set('view engine' , 'ejs');
app.use(express.static('public'));
app.use('/peerjs' , peerServer);

app.get('/' , (req,res)=>{
    res.render('home');
});

//. Video Room Routs

app.post('/room' , (req,res)=>{
    res.redirect(`/video/${ uuidV4() }`);
});

app.get('/video/:room' , (req,res)=>{
    res.render('vroom' , { roomId: req.params.room, host : HOST , port : PORT });
});

//. Caht Room Routs

app.post('/rooom' , (req,res)=>{
    res.redirect(`/chat/${ uuidV4() }`);
});

app.get('/chat/:room' , (req,res)=>{
    res.render('croom' , { roomId: req.params.room, host : HOST , port : PORT});
});

const users = {};

io.on('connection' , socket =>{

    socket.on('join-room' , function(roomId , userId){
        socket.join(roomId);
        socket.to(roomId).emit('user-connected' , userId);
    }.bind(this));

    let ID;
    socket.on('new-user' , (nam , roomID)=>{
        ID=roomID;
        users[socket.id]=nam;
        socket.join(ID);
        socket.to(ID).emit('user-connected' , nam);
    });

    socket.on('disconnect' , ()=>{
        socket.join(ID);
        socket.to(ID).emit('user-disconnected' , users[socket.id]);
        delete users[socket.id];
    });

    socket.on('send-chat-msg' , msg=>{
        socket.join(ID);
        socket.to(ID).emit(' chat-msg' , {msg : msg , name : users[socket.id]});
    })
})


server.listen(PORT, HOST, ()=>{
    console.log(`DING DING We are on : http://${HOST}:${PORT}`);
});