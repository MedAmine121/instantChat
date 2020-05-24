var app = require('express')();
var http = require('http').createServer(app);
const session = require('express-session');
var sess=session({secret: 'ssshhhhh'})
var io = require('socket.io')(http);
io.use(function(socket, next) {
    sess(socket.request, socket.request.res || {}, next);
});
app.use(sess);
var name=""
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/chat.html');
});
app.get("/chat",(req,res)=>{
req.session.name=req.query.name
req.session.room=req.query.number
res.redirect("/chat/"+req.query.number)

})
app.get("/chat/:number",(req,res)=>{res.sendFile(__dirname + '/index.html')})

io.on('connection', (socket) => {socket.on('room',(number)=>{
	socket.join(number);
	io.to(socket.request.session.room).emit('chat message',socket.request.session.name+" has connected.")})
  socket.on('chat message', (msg) => {
  	
    io.to(socket.request.session.room).emit('chat message',socket.request.session.name+": "+msg);
  });
  socket.on('disconnect',(dis)=>{
io.to(socket.request.session.room).emit('chat message',socket.request.session.name+" has disconnected.")

  })
});


http.listen(5000, () => {
  console.log('listening on *:3000');
});