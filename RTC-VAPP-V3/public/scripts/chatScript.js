const PORT = 5500 || 443 || 80;
const socket = io(`/`);
const sendContainer = document.getElementById('send-container');
const msgInput = document.getElementById('msg-input');
const msgContainer = document.getElementById('msg-container'); //* Where to put our sended msg on screan
const nam = prompt('Enter A Name PLZ ...');
const ifConnected = document.getElementById('ifConnected');
const shareBtn = document.getElementById('share');

const appendConnection = msg =>{
    const icon = document.createElement('i');
    icon.className += 'fa fa-link';
    icon.setAttribute('aria-hidden', 'true');
    ifConnected.append(icon);
    const Element = document.createElement('div');
    Element.innerText = msg;
    ifConnected.append(Element);
    
};

const appendMessage = msg =>{
    const msgElement = document.createElement('li');
    msgElement.innerText = msg;
    msgContainer.append(msgElement);
};
appendConnection('Connected');
socket.emit('new-user' , nam , ROME_ID);

sendContainer.addEventListener('submit', e=>{
    e.preventDefault();

    const msg = msgInput.value;
    appendMessage(`you: ${msg}`);
    socket.emit('send-chat-msg' , msg);
    msgInput.value = ' ';
});

socket.on('user-connected' , nam=>{
    appendMessage(`${nam} joined the room`);
})

socket.on('chat-msg' , data=>{
    appendMessage(`${data.name}: ${data.msg}`);
});


socket.on('user-disconnected' , name =>{
    appendMessage(`${name} Disconnected`);
});

shareBtn.addEventListener('click', e=>{    
    if(navigator.share){
        navigator.share({
            title : 'Room URL',
            url : `http://${host}:${port}/chat/${ROME_ID}`
        }).then(()=>{
            console.log('sucsecc');
        }).catch(()=>{
            console.log(console.error);
        });
    }else{
        console.log('sorry Boss');
        alert('Sorry, you are using an unsupported browser. You need to copy and paste the  URL link manually in order to share it.');
    };
});