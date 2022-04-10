const express = require('express');
const app = express();
var http = require('http').Server(app);

var io = require('socket.io')(http);

const port = process.env.PORT || 8000;

// express routing
app.use(express.static('public'));

/**STATE */
let userArr = [];
let votedUserArr = [];

io.on('connection', function (socket) {
    console.log('here')
    let socketId = socket.id;
    socket.on('hasRegistered', function (name, id) {
        let tempArr = [];
        if(id == 0){
                    
            tempArr[0] = name;
            tempArr[1] = socketId; 
            userArr.push(tempArr);  

            socket.emit('userReg', name, socketId);
            io.sockets.emit('usersOnline', userArr, votedUserArr);//broadcast to all including me
        } else {
            let onlineUserLen = userArr.length;
            let c, found = 0;
            for(c = 0; c < onlineUserLen; c++){
                if(userArr[c][1] == id){
                    found = 1;
                }
            }
            
            if(found == 0){
                tempArr[0] = name;
                tempArr[1] = id; 
                userArr.push(tempArr);  

                io.sockets.emit('usersOnline', userArr, votedUserArr);//broadcast to all including me
            } else {
                io.sockets.emit('usersOnline', userArr, votedUserArr);//broadcast to all including me
            }
        }
    });

    socket.on('iVote', (userId, vote) => {
        let votedUserArrLen = votedUserArr.length;
        let c, found = 0, tempArr = [];
        for(c = 0; c < votedUserArrLen; c++){
            if(votedUserArr[c][0] == userId){
                votedUserArr[c][1] = vote;
                found = 1;
            }
        }
        
        if(found == 0){
            tempArr[0] = userId;
            tempArr[1] = vote; 
            votedUserArr.push(tempArr);  

            io.sockets.emit('usersVoted', votedUserArr);//broadcast to all including me
        } else {
            io.sockets.emit('usersVoted', votedUserArr);//broadcast to all including me
        }
    });
});

// listener
http.listen(8000,'0.0.0.0', function () {
    console.log('listening on', port);
});