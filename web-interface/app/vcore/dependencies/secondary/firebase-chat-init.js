/** Firebase Chat Init */

// thakns to https://w3collective.com/realtime-javascript-chat/

const firebaseChatConfig = {
  apiKey: 'AIzaSyCw6TAuBUrlWqNVZ1470xE4pBcHuQeY_Vo',
  authDomain: 'vi-network-chats.firebaseapp.com',
  databaseURL: 'https://vi-network-chats-default-rtdb.firebaseio.com',
  projectId: 'vi-network-chats',
  storageBucket: 'vi-network-chats.appspot.com',
  messagingSenderId: '120778279060',
  appId: '1:120778279060:web:a14315107afce576398c81',
};

firebase.initializeApp( firebaseChatConfig );

const NetworkMainRoom = firebase.database().ref( window.location.host.replace( /\./g, '_' ) );

NetworkMainRoom.on( 'child_added', function childAddedLive( snap ) {
  const res = snap.val();
  Chat.drawMessage( {
    time: res.a,
    uuidE: res.i,
    sender: res.j,
    msg: res.m,
  } );
} );
