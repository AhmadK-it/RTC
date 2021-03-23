
const PORT = 5500 || 443 || 80;
const socket = io(`/`);
const myVideo = document.createElement('video');
myVideo.muted = true;
let myVideoStream;
const HOST = '/';
const videoGrid = document.querySelector('#video-grid');
const shareBtn = document.getElementById('share');

const peer = new Peer(undefined , {
    path : '/peerjs',
    port: PORT,
    host : HOST
});


navigator.mediaDevices.getUserMedia({
    video:true,
    audio:true
}).then(stream=>{
    myVideoStream = stream ;
    
    addVideoStream(myVideo , myVideoStream);
    peer.on('call' , call=>{
        call.answer(stream);
        const video = document.createElement('video');
        call.on('stream' , userVideoStream=>{
            
            addVideoStream(video , userVideoStream);
        }); 
    });

    socket.on('user-connected' , userId =>{
        connectToNewUser(userId , stream);
    });
    
});
    


peer.on('open', Id =>{
    console.log(`I'm webRTC peer:${Id}`);
    socket.emit('join-room' , ROME_ID , Id);
});



const connectToNewUser = (userId , stream)=>{
    const call = peer.call(userId , stream);
    const video = document.createElement('video');
    call.on('stream' , userVideoStream =>{
        addVideoStream(video , userVideoStream);
    });
};

const addVideoStream= (video , stream)=>{
        video.srcObject = stream;
        video.addEventListener('loadedmetadata' , ()=>{
            video.play();
        });
        videoGrid.append(video);
};

//* Mute and UnMute our Video

const  muteUnmute = () =>{
    const enabled = myVideoStream.getAudioTracks()[0].enabled;
    if(enabled){
        myVideoStream.getAudioTracks()[0].enabled = false;
        setUnmuteButton();
    }else{
        setMuteButton();
        myVideoStream.getAudioTracks()[0].enabled = true;
    }
};

const setMuteButton = () =>{
    const html = `
    <i class= " fas fa-microphone "></i>
    <span>Mute</span>
    `;
    document.querySelector('.main-mute-button').innerHTML = html;
};

const setUnmuteButton = () =>{
    const html = `
    <i class= "unmute fas fa-microphone-slash "></i>
    <span>UnMute</span>
    `;
    document.querySelector('.main-mute-button').innerHTML = html;
};


shareBtn.addEventListener('click', e=>{    
    if(navigator.share){
        navigator.share({
            title : 'Room URL',
            url : `http://${host}:${port}/video/${ROME_ID}`
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

// TODO

//* Active Stop Video button 

const playStop = () =>{
    console.log('obj');
    const enabled = myVideoStream.getVideoTracks()[0].enabled;
    if(enabled){
        myVideoStream.getVideoTracks()[0].enabled = false;
        setPlayVideo();
    }else {
        setStopVideo();
        myVideoStream.getVideoTracks()[0].enabled = true;
    }
}

const setPlayVideo = () =>{
    const html = `
    <i class="stop fas fa-video-slash"></i>
    <span>Play Video</span>
    `;
    document.querySelector('.main-video-button').innerHTML = html;
};

const setStopVideo = () =>{
    const html = `
    <i class="fas fa-video"></i>
    <span>Stop Video</span>
    `;
    document.querySelector('.main-video-button').innerHTML = html;
};


