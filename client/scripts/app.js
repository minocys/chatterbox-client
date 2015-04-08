// YOUR CODE HERE:

var app = {
  rooms : [],
  friends : [],
  server : 'https://api.parse.com/1/classes/chatterbox',
  filter : 'all',
  lastRoomIndex : 0,

  init : function(){
    $('#send').on('submit', function(){
      app.handleSubmit($('#message').val());
      $('#message').val("");
      return false;
    });

    $('.username').on('click', function(){
      app.addFriend($(this).text());
    });

    $('#roomSelect').on('change', function(){
      event.preventDefault();
      this.filter = $('#roomSelect option:selected').text();
      if(this.filter === 'all'){
        $('#chats').children().show();
      }
      $('#chats').children().hide();
      $('#chats').children('[data-name="'+ this.filter + '"]').show();
    });

    this.fetch();
    setTimeout(app.updateRoomList(app.rooms), 3000);
    setInterval(function(){
      app.fetch();
      app.updateRoomList(app.rooms);
    }, 5000);
  },

  send : function(message){
    $.ajax({
      // always use this url
      url : this.server,
      type : 'POST',
      data : JSON.stringify(message),
      contentType : 'application/json',
      success : function (data) {
        console.log('chatterbox: Message sent');
      },
      error : function (data) {
        // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message');
      }
    });
  },

  fetch : function(){
    $.ajax({
      url: this.server,
      type: 'GET',
      data : {'order':'-createdAt'},
      dataType: 'text json',
      success : function(data){
        app.addMessage(data.results);
      },
      error :function(){
        console.error('failed to get messages');
      }
    });
  },

  clearMessages : function(){
    $('#chats').children().remove();
  },

  createMessage: function(message){

    var newMessage = _.template('<div class="chat" data-name="<%-data.room%>">', {variable:'data'})({room:message.roomname});
    newMessage += _.template('<span class="username"><%-data.user%></span>', {variable:'data'})({user:message.username});
    newMessage += _.template('<%-data.text%>', {variable:'data'})({text:message.text}) + '</div>';
    return newMessage;
  },

  addMessage : function(messages){
    this.clearMessages();
    for(var i = 0; i < messages.length; i++){
      var $lastmessage = this.createMessage(messages[i]); 
      console.log($lastmessage);
      var str = $lastmessage.match(/(?<=data-name\=\")([^"]+)/g) || "";
      console.log(str);
      $("#chats").append($lastmessage);
      //adds new rooms to room list
      //var room = $lastMessage.data('name');
      // if(this.rooms.indexOf(room) === -1 && room != undefined){
      //   this.rooms.push(room);
      // }
    }
  },

//'<div class="tweets" data-name="@' + tweet.user + '" style="display:none"></div>'



  addRoom : function(room){
    var $option = $("<option>"+room+"</option>");
    $("#roomSelect").append($option);
  },

  updateRoomList : function(roomlist){
    if(this.lastRoomIndex < this.rooms.length-1){
      for (this.lastRoomIndex; this.lastRoomIndex < this.rooms.length; this.lastRoomIndex++){
        this.addRoom(this.rooms[this.lastRoomIndex]);
      }
    }
  },

  addFriend : function(friend){
    this.friends.push(friend);
  },

  handleSubmit : function(text){
    var message = {};
    message.username = window.location.search.slice(10);
    message.text = text;
    message.roomname = $('roomSelect option:selected') || "";
    app.send(message);
  }

}
// var message = {
//   'username':'hello',
//   'text': 'testing',
//   'roomname': 'none'
// }
// app.send(message);

$(document).ready(function(){
  app.init();
});


