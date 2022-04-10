M.AutoInit();

//localStorage.removeItem("userName");
//localStorage.removeItem("userId");

// Let's do this
var socket = io();

/**STATE MGT */
//localstorage
let userName = localStorage.getItem("userName");
let userId = localStorage.getItem("userId");
$('#notRegistered').hide();
$('#registered').hide();
$('#userNotVoted').hide();
$('.userVoted').hide();

if(userId == null){
    $('#nameModal').modal('open');

    //switch view to home
    $('#notRegistered').show();
    $('#registered').hide();
} else {
    //switch view to polling
    $('#notRegistered').hide();
    $('#registered').show();

    socket.emit('hasRegistered', userName, userId);
}

//handle name registeration form
$('#nameForm').on('submit', (e) => {
    e.preventDefault();
    let name = $('#first_name').val()+' '+$('#last_name').val();

    socket.emit('hasRegistered', name, 0);
})

socket.on('connect', function () { 
    $('#connectionStatus').html('Connected').removeClass('danger').addClass('success');
    
});
socket.on('disconnect', function () {
    $('#connectionStatus').html('Disconnected').removeClass('success').addClass('danger');
});

socket.on('userReg', function (name, id) {
    localStorage.setItem("userName", name);
    localStorage.setItem("userId", id);

    //Switch view to polling
    $('#notRegistered').hide();
    $('#registered').show();

    //close modal
    $('#nameModal').modal('close');
});

socket.on('usersOnline', function (usersOnline, votedUserArr) { 
    let messiVote = 0;
    let ronaldoVote = 0;
    let votedUserArrLen = votedUserArr.length;
    let a, found = 0, myVote = "";
    
    for(a = 0; a < votedUserArrLen; a++){
        if(votedUserArr[a][0] == userId){
            found = 1;
            if(votedUserArr[a][1] == 'M'){
                myVote = 'M';
            } else if(votedUserArr[a][1] == 'C'){
                myVote = 'C';
            }
        }

        if(votedUserArr[a][1] == 'M'){
            messiVote++;
        } else if(votedUserArr[a][1] == 'C') {
            ronaldoVote++;
        }
    }

    if(votedUserArrLen == 0 || found == 0){
        $('#userNotVoted p').html('You are yet to register your opinion. You need to register to view the statistics of the poll');
        $('#userNotVoted').show();
        $('.userVoted').hide();
    } else {
        let perc = (messiVote / votedUserArrLen) * 100;
        
        if(messiVote == 1 && myVote == 'M'){
            $('#messiVote p').html('(1 vote) You picked Lionel Messi as the GOAT ('+perc+'%)');
        } else if(messiVote > 1 && myVote == 'M') {                
            messiVote = messiVote - 1;                
            $('#messiVote p').html('You & '+messiVote+' out of '+votedUserArrLen+' picked Lionel Messi as the GOAT ('+perc+'%)');
        } else {
            $('#messiVote p').html(messiVote+' out of '+votedUserArrLen+' picked Lionel Messi as the GOAT ('+perc+'%)');
        }

        let percR = (ronaldoVote / votedUserArrLen) * 100;
        if(ronaldoVote == 1 && myVote == 'C'){
            $('#ronaldoVote p').html('(1 vote) You picked Christiano Ronaldo as the GOAT ('+percR+'%)');
        } else if(ronaldoVote > 1 && myVote == 'C') {                
            ronaldoVote = ronaldoVote - 1;                
            $('#ronaldoVote p').html('You & '+ronaldoVote+' out of '+votedUserArrLen+' picked Christiano Ronaldo as the GOAT ('+percR+'%)');
        } else {
            $('#ronaldoVote p').html(ronaldoVote+' out of '+votedUserArrLen+' picked Christiano Ronaldo as the GOAT ('+percR+'%)');
        }

        $('#ronaldoVote .determinate').css("width", percR+"%");
        $('#messiVote .determinate').css("width", perc+"%");   
        
        $('#userNotVoted').hide();
        $('.userVoted').show();
    }
});

$('input[name="poll"]').on('change', function(){
    let myOpin = $(this).val();

    socket.emit('iVote', userId, myOpin);
});

socket.on('usersVoted', function (votedUserArr) { 
    let messiVote = 0;
    let ronaldoVote = 0;
    let votedUserArrLen = votedUserArr.length;
    let a, found = 0, myVote = "";
    
    for(a = 0; a < votedUserArrLen; a++){
        if(votedUserArr[a][0] == userId){
            found = 1;
            if(votedUserArr[a][1] == 'M'){
                myVote = 'M';
            } else if(votedUserArr[a][1] == 'C'){
                myVote = 'C';
            }
        }

        if(votedUserArr[a][1] == 'M'){
            messiVote++;
        } else if(votedUserArr[a][1] == 'C') {
            ronaldoVote++;
        }
    }

    if(votedUserArrLen == 0 || found == 0){
        $('#userNotVoted p').html('You are yet to register your opinion. You need to register to view the statistics of the poll');
        $('#userNotVoted').show();
        $('.userVoted').hide();
    } else {
        let perc = (messiVote / votedUserArrLen) * 100;
        
        if(messiVote == 1 && myVote == 'M'){
            $('#messiVote p').html('(1 vote) You picked Lionel Messi as the GOAT ('+perc+'%)');
        } else if(ronaldoVote > 1 && myVote == 'M') {                
            messiVote = messiVote - 1;                
            $('#messiVote p').html('You & '+messiVote+' out of '+votedUserArrLen+' picked Lionel Messi as the GOAT ('+perc+'%)');
        } else {
            $('#messiVote p').html(messiVote+' out of '+votedUserArrLen+' picked Lionel Messi as the GOAT ('+perc+'%)');
        }

        let percR = (ronaldoVote / votedUserArrLen) * 100;
        if(ronaldoVote == 1 && myVote == 'C'){
            $('#ronaldoVote p').html('(1 vote) You picked Christiano Ronaldo as the GOAT ('+percR+'%)');
        } else if(ronaldoVote > 1 && myVote == 'C') {                
            ronaldoVote = ronaldoVote - 1;                
            $('#ronaldoVote p').html('You & '+ronaldoVote+' out of '+votedUserArrLen+' picked Christiano Ronaldo as the GOAT ('+percR+'%)');
        } else {
            $('#ronaldoVote p').html(ronaldoVote+' out of '+votedUserArrLen+' picked Christiano Ronaldo as the GOAT ('+percR+'%)');
        }

        $('#ronaldoVote .determinate').css("width", percR+"%");
        $('#messiVote .determinate').css("width", perc+"%");    
        
        $('#userNotVoted').hide();
        $('.userVoted').show();
    }
});