var app = {
  server: 'https://api.parse.com/1/classes/messages/',
  username: 'anonymous',
  roomname: 'lobby',
  messages: [],
  lastMessageId: 0,
  friends: {},

  init: function() {
    app.username = window.location.search.substr(10);

    app.$message = $('message');
    app.$chats = $('chats');
    app.$roomSelect = $('#roomSelect')
    app.$send = $('#send');

    app.$send.on('submit', app.handleSubmit);
    app.$roomSelect.on('change', app.handleRoomChange);
    app.$chats.on('click', '.username', app.handleUsernameClick);

    app.startSpinner();
    app.fetch();

    setInterval(function() {
      app.fetch();
    }, 3000)
  },

  fetch: function() {
    $.ajax({
      url: app.server,
      type: 'GET',
      data: {order: '-createdAt'},
      success: function(data) {
        if (!data.results || !data.results.length) { return; }

        app.messages = data.results;

        var mostRecentMessage = app.messages[app.messages.length - 1];

        if (mostRecentMessage.objectId !== app.lastMessageId) {

          app.renderRoomList(app.messages);
          app.renderMessages(app.messages);
          }
      },
      error: function(error) {
        console.log('Fetch error.');
        console.log(error);
      }
    })
  },

  renderMessages: function(messages) {
    app.clearMessages();

    messages
      .filter(function(message) {
        if (app.roomname === 'lobby' && !message.roomname) {
          return true;
        } else if (message.roomname === app.roomname) {
          return true;
        } else {
          return false;
        }
      })
      .forEach(app.renderMessage);
      console.log('Deez');

    app.stopSpinner();
  },

  clearMessages: function() {
    app.$chats.html('');
    console.log('Deez');
  },
  renderMessage: function(message) {
    var $chat = $('<div class="chat"/>');

    var $username = $('<span class="username"/>');
    $username
      .text(message.username + ': ')
      .attr('data-username', message.username)
      .appendTo('$chat');

    if (app.friends[messages.username] === true) {
      $username.addClass('friend');
    }

    var $message = $('<br><span>');
    $message.text(message.text).appendTo($chat);

    app.$chats.append($chat);
  },

  handleSubmit: function(event) {
    var message = {
      username: app.username,
      text: app.$message.val(),
      roomname: app.roomname || 'lobby'
    };

    app.send(message);

    event.preventDefault();
  },

  send: function(message) {
    app.startSpinner();

    $.ajax({
      url: app.server,
      type: 'POST',
      data: JSON.stringify(message),
      success: function() {
        app.$messages.val('');
        app.fetch();
      },
      error: function(error) {
        console.log('Failed to send message.', error);
      }
    });
  },

  renderRoomList: function(messages) {
    app.$roomSelect.html('<option value="__newRoom">New room...</option></select>');
    if (messages) {
      var rooms = {};
      messages.forEach(function(message) {
        var roomname = message.roomname;
        if (roomname && !rooms[roomname]) {
          app.renderRoom(roomname);

          rooms[roomname] = true;
        }
      });
    }

    app.$roomSelect.val(app.roomname);
  },

  renderRoom: function(roomname) {
    var $option = $('<option/>').val(roomname).text(roomname);

    app.$roomSelect.append($option);

    console.log('Deez');
  },

  handleRoomChange: function(event) {
    var selectIndex = app.$roomSelect.prop('selectedIndex');
    if (selectIndex === 0) {
      var roomname = prompt('Enter New Room Name.');

      if (roomname) {
        app.roomname = roomname;
        app.renderRoom(roomname);
        app.$roomSelect.val(roomname);
      }
    } else {
      app.roomname = app.$roomSelect.val();
    }

    app.renderMessage(app.messages);
  },

  handleUsernameClick: function (event) {
    var username = $(event.target).data('username');

    if (username !== undefined) {
      app.friends[username] = !app.friends[username];

      var selector = '[data-username="' + username.replace(/"/g, '\\\"' + '"]');
      var $usernames = $(selector).toggleClass('friend');
    }
  },

  startSpinner: function() {
    $('.spinner img').show();
    $('form input[type=submit]').attr('disabled', true);
  },

  stopSpinner: function() {
    $('.spinner img').fadeOut('fast');
    $('form input[type=submit]').attr('disabled', null);
  },
  // escapeHTML: function(string) {
  //   if (!string) { return; }
  //   return string.replace(/[&<>"'=\/]/g, '');
  // }
};

// var message = {
//   username: 'shawndrost',
//   text: 'trololo',
//   roomname: '4chan'
// };

// var app = {
//
//   server: 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages',
//   username: 'anonymous',
//   roomname: 'lobby',
//   lastMessageId: 0,
//   friends: {},
//   messages: [],
//
//   // server: ''https://api.parse.com/1/classes/chatterbox/?order=-createdAt',
//   // chatRooms: {},
//   // myFriends: {},
//   // currentRoom: "lobby",
//   // chatMessages: [],
//
//   init: function() {
//
//     // app.username = getParameterByName('username');
//     // //load templates
//     // app.roomTemplate = _.template($('#roomItem').html());
//     // app.messageTemplate = _.template($('#messageTemplate').html());
//     // app.update();
//     // setInterval(app.update, 1000);
//
//     // app.send
//
//     // document.getElementById("addFriend").onclick = handleUsernameClick;
//
//     $('.username').on('click', function() {
//       app.handleUsernameClick();
//     });
//
//     $('.sendButton').on('click', function() {
//       app.send();
//     });
//
//     // $('#messageForm').on('submit', function(e){
//     //   e.preventDefault();
//     //   var text = $('#inputText').val();
//     //   if(text.length<1){
//     //     return;
//     //   }
//     //   $('#inputText').val('');
//
//     // $("#button").on("click", function() {
//     //   console.log('All UR Base R Belong 2 Us');
//     //   app.handleUsernameClick();
//     // };
//
//     // $("#button").on("click", function() {
//     //   console.log('All UR Base R Belong 2 Us');
//     //   app.handleSubmit();
//     // };
//
//         // // Get username
//         // app.username = window.location.search.substr(10);
//         //
//         // // Cache jQuery selectors
//         // app.$message = $('#message');
//         // app.$chats = $('#chats');
//         // app.$roomSelect = $('#roomSelect');
//         // app.$send = $('#send');
//         //
//         // // Add listeners
//         // app.$chats.on('click', '.username', app.handleUsernameClick);
//         // app.$send.on('submit', app.handleSubmit);
//         // app.$roomSelect.on('change', app.handleRoomChange);
//         //
//         // // Fetch previous messages
//         // app.startSpinner();
//         // app.fetch(false);
//         //
//         // // Poll for new messages
//         // setInterval(function() {
//         //   app.fetch(true);
//         // }, 3000);
//
//         // app.username = getParameterByName('username');
//         // //load templates
//         // app.roomTemplate = _.template($('#roomItem').html());
//         // app.messageTemplate = _.template($('#messageTemplate').html());
//         // app.update();
//         // setInterval(app.update, 1000);
//
//         // $('.username').on('click', function(){ app.addFriend(); })
//         // $('#messageForm').on('submit', function(e){
//         //   e.preventDefault();
//         //   var text = $('#inputText').val();
//         //   if(text.length<1){
//         //     return;
//         //   }
//         //   $('#inputText').val('');
//         //
//         //   var sendObj = {username:app.username,
//         //     text:text,
//         //     roomname: app.currentRoom
//         //   };
//         //   app.send(sendObj);
//         // });
//         // $('#createRoomButton').on('click',function(){
//         //   console.log('after 31, or connection is broken');
//         //   var $el = $('#newRoomInput');
//         //
//         //   var roomName = $el.val();
//         //   app.chatRooms[roomName] = true;
//         //   app.currentRoom = roomName;
//         //   $el.val('');
//         // });
//   },
//
//   send: function(message) {
//     $.ajax({
//       // This is the url you should use to communicate with the parse API server.
//       url: 'http://parse.CAMPUS.hackreactor.com/chatterbox/classes/messages',
//       type: 'POST',
//       data: JSON.stringify(message),
//       contentType: 'application/json',
//       success: function (data) {
//         console.log('chatterbox: Message sent');
//       },
//       error: function (data) {
//         // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
//         console.error('chatterbox: Failed to send message', data);
//       }
//     });
//   },
//
//   fetch: function() {
//     $.ajax({
//       // This is the url you should use to communicate with the parse API server.
//       url: 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages',
//       type: 'GET',
//       data: JSON.stringify(message),
//       contentType: 'application/json',
//         success: function (data) {
//           console.log('chatterbox: Message sent');
//         },
//         error: function (data) {
//           // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
//           console.error('chatterbox: Failed to send message', data);
//         }
//     });
//   },
//
//   clearMessages: function() {
//   	var node = document.getElementById('chats');
//   	  while (node.firstChild){
//   	  	node.removeChild(node.firstChild);
//   	  }
//   },
//
//   renderMessage: function(message) {
//     $('#chats').append('<li>' + message.username + ': ' + message.text + '</li>');
//   },
//
//   // $.post("demo_test_post.asp",
//   // {
//   //     name: "Donald Duck",
//   //     city: "Duckburg"
//   // },
//   // function(data, status) {
//   //     alert("Data: " + data + "\nStatus: " + status);
//   // });
//
//   renderRoom: function(newRoom) {
//     // 	var room = '<div class="room" data-room="' + newRoom + '">' + newRoom + '</div>';
//     // $('#roomSelect').append(room);
//     $('#roomSelect').append('<li>' + newRoom + '</li>');
//   },
//
//
//   handleUsernameClick: function() {
//   //     // Get username from data attribute
//   // var username = $(event.target).data('username');
//   //
//   // if (username !== undefined) {
//   //   // Toggle friend
//   //   app.friends[username] = !app.friends[username];
//   //
//   //   // Escape the username in case it contains a quote
//   //   var selector = '[data-username="' + username.replace(/"/g, '\\\"') + '"]';
//   //
//   //   // Add 'friend' CSS class to all of that user's messages
//   //   var $usernames = $(selector).toggleClass('friend');
//   // }
//   },
//
//   handleSubmit: function() {
//   //       var message = {
//   //         username: app.username,
//   //         text: app.$message.val(),
//   //         roomname: app.roomname || 'lobby'
//   //       };
//   //
//   //       app.send(message);
//   //
//   //       // Stop the form from submitting
//   //       event.preventDefault();
//   // }
//   },
//
// };

// // YOUR CODE HERE:
//
//
// var app ={
//   // server: 'https://api.parse.com/1/classes/chatterbox',
//   server: 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages',
//   roomList: {},
//   friendList: {},
//
//   init: function() {
//     app.$roomSelect = $('#roomSelect');
//
//     app.fetch();
//     setInterval(app.fetch, 20000);
//
//   },
//
//   send: function(message) {
//     $.ajax({
//     // always use this url
//     // url: 'https://api.parse.com/1/classes/chatterbox',
//     url: app.server,
//     type: 'POST',
//     data: JSON.stringify(message),
//     contentType: 'application/json',
//     success: function (data) {
//       console.log('chatterbox: Message sent');
//     },
//     error: function (data) {
//       // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
//       console.error('chatterbox: Failed to send message');
//     }
//   });
//   },
//
//   fetch: function() {
//     $.ajax({
//     // always use this url
//     //url: 'https://api.parse.com/1/classes/chatterbox',
//     url: app.server,
//     type: 'GET',
//     // data: {order: '-createdAt'},
//     data: {},
//     contentType: 'application/json',
//     success: function (data) {
//       app.clearMessages();
//       _.each(data.results, function(value) {
//         app.addMessage(value);
//       });
//     },
//
//     error: function (data) {
//       // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
//       console.error('chatterbox: Failed to fetch messages');
//     }
//     });
//   },
//
//   clearMessages: function() {
//     $('#chats').empty();
//   },
//
//   addMessage: function(message) {
//     var selectedRoom = $("#roomSelect option:selected").val();
//     if (!selectedRoom) {
//       selectedRoom = 'lobby';
//     }
//
//     // if (selectedRoom === message.roomname) {
//       // if (app.friendList[message.username]) {
//       //   $('#chats').append('<div class="chat"><p class="friend"> <span class="username" data-username>' + _.escape(message.username) + '</span> : ' + _.escape(message.message) + ' ' + '<span class="roomname" data-roomname>' + _.escape(message.roomname) + '</span></p></div>');
//       //   $('.username').click( function(value) {
//       //     app.addFriend(value.target);
//       //   });
//       // } else {
//         $('#chats').append('<div class="chat"><p>' + '<span class="username" data-username>' + _.escape(message.username) + '</span> : ' + _.escape(message.message) + ' ' + '<span class="roomname" data-roomname>' + _.escape(message.roomname) + '</span></p></div>');
//         $('.username').click( function(value) {
//           app.addFriend(value.target);
//         });
//       // }
//     // }
//     app.addRoom(message.roomname);
//   },
//
//   addRoom: function(room) {
//     if (room !== undefined && room !== '') {
//       if (app.roomList[room] === undefined) {
//         $('#roomSelect').append('<option value="' + room + '">' + room + '</option>');
//         app.roomList[room] = true;
//       }
//     }
//   },
//
//   addFriend: function(evt) {
//     var username = $(evt).text();
//     app.friendList[username] = true;
//   },
//
//   handleSubmit: function(e) {
//     e.preventDefault();
//
//     var username = $('.username2').text();
//     // var message = _.escape($('.message2').val());
//     var message = $('.message2').val();
//     // var room = $('#roomSelect').val();
//     var room = app.$roomSelect.val();
//
//     var messageObj = {
//       // username: username,
//       username: getUrlParameter('username'),
//       message: message,
//       roomname: room
//     };
//     console.log(messageObj);
//
//     //  var messageObj = {
//     //   username: 'Jennifer1',
//     //   message: '1111',
//     //   roomname: 'lobby'
//     // };
//
//     app.send(messageObj);
//   }
//
// };

// function getUrlParameter(sParam) {
//   var sPageURL = window.location.search.substring(1);
//   var sURLVariables = sPageURL.split('&');
//   for (var i = 0; i < sURLVariables.length; i++) {
//       var sParameterName = sURLVariables[i].split('=');
//       if (sParameterName[0] == sParam) {
//         return sParameterName[1];
//       }
//   }
// }
//
// $( document ).ready(function() {
//
//     app.init();
//
//     var whoami = getUrlParameter('username');
//     $('.username2').text(whoami);
//
//
//     $('.submit').click( function(event) {
//         app.handleSubmit(event);
//     });
// });
// };
//
// var app = {
//   server: 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages',
//   username: 'anonymous',
//   roomname: 'lobby',
//   lastMessageId: 0,
//   friends: {},
//   messages: [],
//
//   init: function() {
//     // Get username
//     app.username = window.location.search.substr(10);
//
//     // Cache jQuery selectors
//     app.$message = $('#message');
//     app.$chats = $('#chats');
//     app.$roomSelect = $('#roomSelect');
//     app.$send = $('#send');
//
//     // Add listeners
//     app.$chats.on('click', '.username', app.handleUsernameClick);
//     app.$send.on('submit', app.handleSubmit);
//     app.$roomSelect.on('change', app.handleRoomChange);
//
//     // Fetch previous messages
//     app.startSpinner();
//     app.fetch(false);
//
//     // Poll for new messages
//     setInterval(function() {
//       app.fetch(true);
//     }, 3000);
//   },
//
//   send: function(message) {
//     app.startSpinner();
//
//     // POST the message to the server
//     $.ajax({
//       url: app.server,
//       type: 'POST',
//       data: message,
//       success: function (data) {
//         // Clear messages input
//         app.$message.val('');
//
//         // Trigger a fetch to update the messages, pass true to animate
//         app.fetch();
//       },
//       error: function (error) {
//         console.error('chatterbox: Failed to send message', error);
//       }
//     });
//   },
//
//   fetch: function(animate) {
//     $.ajax({
//       url: app.server,
//       type: 'GET',
//       data: { order: '-createdAt' },
//       contentType: 'application/json',
//       success: function(data) {
//         // Don't bother if we have nothing to work with
//         if (!data.results || !data.results.length) {
//           return;
//         }
//
//         // Store messages for caching later
//         app.messages = data.results;
//
//         // Get the last message
//         var mostRecentMessage = data.results[data.results.length - 1];
//
//         // Only bother updating the DOM if we have a new message
//         if (mostRecentMessage.objectId !== app.lastMessageId) {
//           // Update the UI with the fetched rooms
//           app.renderRoomList(data.results);
//
//           // Update the UI with the fetched messages
//           app.renderMessages(data.results, animate);
//
//           // Store the ID of the most recent message
//           app.lastMessageId = mostRecentMessage.objectId;
//         }
//       },
//       error: function(error) {
//         console.error('chatterbox: Failed to fetch messages', error);
//       }
//     });
//   },
//
//   clearMessages: function() {
//     app.$chats.html('');
//   },
//
//   renderMessages: function(messages, animate) {
//     // Clear existing messages`
//     app.clearMessages();
//     app.stopSpinner();
//     if (Array.isArray(messages)) {
//       // Add all fetched messages that are in our current room
//       messages
//         .filter(function(message) {
//           return message.roomname === app.roomname ||
//                 app.roomname === 'lobby' && !message.roomname;
//         })
//         .forEach(app.renderMessage);
//     }
//
//     // Make it scroll to the top
//     if (animate) {
//       $('body').animate({scrollTop: '0px'}, 'fast');
//     }
//   },
//
//   renderRoomList: function(messages) {
//     app.$roomSelect.html('<option value="__newRoom">New room...</option>');
//
//     if (messages) {
//       var rooms = {};
//       messages.forEach(function(message) {
//         var roomname = message.roomname;
//         if (roomname && !rooms[roomname]) {
//           // Add the room to the select menu
//           app.renderRoom(roomname);
//
//           // Store that we've added this room already
//           rooms[roomname] = true;
//         }
//       });
//     }
//
//     // Select the menu option
//     app.$roomSelect.val(app.roomname);
//   },
//
//   renderRoom: function(roomname) {
//     // Prevent XSS by escaping with DOM methods
//     var $option = $('<option/>').val(roomname).text(roomname);
//
//     // Add to select
//     app.$roomSelect.append($option);
//   },
//
//   renderMessage: function(message) {
//     if (!message.roomname) {
//       message.roomname = 'lobby';
//     }
//
//     // Create a div to hold the chats
//     var $chat = $('<div class="chat"/>');
//
//     // Add in the message data using DOM methods to avoid XSS
//     // Store the username in the element's data attribute
//     var $username = $('<span class="username"/>');
//     $username.text(message.username + ': ').attr('data-roomname', message.roomname).attr('data-username', message.username).appendTo($chat);
//
//     // Add the friend class
//     if (app.friends[message.username] === true) {
//       $username.addClass('friend');
//     }
//
//     var $message = $('<br><span/>');
//     $message.text(message.text).appendTo($chat);
//
//     // Add the message to the UI
//     app.$chats.append($chat);
//
//   },
//
//   handleUsernameClick: function(event) {
//
//     // Get username from data attribute
//     var username = $(event.target).data('username');
//
//     if (username !== undefined) {
//       // Toggle friend
//       app.friends[username] = !app.friends[username];
//
//       // Escape the username in case it contains a quote
//       var selector = '[data-username="' + username.replace(/"/g, '\\\"') + '"]';
//
//       // Add 'friend' CSS class to all of that user's messages
//       var $usernames = $(selector).toggleClass('friend');
//     }
//   },
//
//   handleRoomChange: function(event) {
//
//     var selectIndex = app.$roomSelect.prop('selectedIndex');
//     // New room is always the first option
//     if (selectIndex === 0) {
//       var roomname = prompt('Enter room name');
//       if (roomname) {
//         // Set as the current room
//         app.roomname = roomname;
//
//         // Add the room to the menu
//         app.renderRoom(roomname);
//
//         // Select the menu option
//         app.$roomSelect.val(roomname);
//       }
//     } else {
//       app.startSpinner();
//       // Store as undefined for empty names
//       app.roomname = app.$roomSelect.val();
//     }
//     // Rerender messages
//     app.renderMessages(app.messages);
//   },
//
//   handleSubmit: function(event) {
//     var message = {
//       username: app.username,
//       text: app.$message.val(),
//       roomname: app.roomname || 'lobby'
//     };
//
//     app.send(message);
//
//     // Stop the form from submitting
//     event.preventDefault();
//   },
//
//   startSpinner: function() {
//     $('.spinner img').show();
//     $('form input[type=submit]').attr('disabled', 'true');
//   },
//
//   stopSpinner: function() {
//     $('.spinner img').fadeOut('fast');
//     $('form input[type=submit]').attr('disabled', null);
//   }
// };

// jQuery.post();
// $.get(URL,callback);

// var message = {
//   username: 'shawndrost',
//   text: 'trololo',
//   roomname: '4chan'
// };

// var app =  {
// init:function () {
// app.fetch();
//
//
// },
//
// 'lastcheck':null,
// 'rooms':{},
// 'returnData':{ },
// 'server': 'https://api.parse.com/1/classes/chatterbox',
// "roomdone":{},
//
// send:function(message){
// 	 $.ajax({
//   // This is the url you should use to communicate with the parse API server.
//   url: app.server,
//   type: 'POST',
//   data: JSON.stringify(message),
//   contentType: 'application/json',
//   success: function (data) {
//     console.log('chatterbox: Message sent');
//   },
//   error: function (data) {
//     // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
//     console.error('chatterbox: Failed to send message');
//   }
// });
// },
// fetch: function(input){
//
// 	if (input===undefined) {
// 	  input = {order: "-createdAt"};
// 	}
// 		// data: 'where={"name": "vishal"}',
//
// 	 $.ajax({
// 		url: app.server,
// 		type: 'GET',
// 		data: input,
// 		contentType: 'application/json',
// 		success: function (data) {
// 			app['returnData'] = data.results;
// 			app['rooms']={}
// 			for(var i = 0; i<app.returnData.length;i++){
// 				var temp = app.returnData[i];
//
// 				app['rooms'][temp.roomname]= app['rooms'][temp.roomname]||[];
// 				app['rooms'][temp.roomname].push([temp.username,temp.text,temp.createdAt]);
// 				app['lastcheck']=app.returnData[0].objectId;
//
// 			}
// 			app.autoaddroom()
// 			console.log('chatterbox: Message retrieved');
// 		},
// 		error: function (data) {
// 		// See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
// 		console.error('chatterbox: Failed to retrieve message');
// 		}
// 		});
// 	 // return obj;
//
// 	},
// addMessage:function(message) {
// // loop find last date in html, find position in data array. put all messages from that point to current time. this is a single message but it will be used in a loop.
// // var message = {
// //           username: 'Mel Brooks',
// //           text: 'Never underestimate the power of the Schwartz!',
// //           roomname: 'lobby'
// //         };
//   var tweet;
//    if((login['Friend'].length>0) && (login.Friend.indexOf(message['username'])!==-1)) {
//
//        tweet = '<div data-lobby="' + message.roomname + '" class ="tweet"><b><p class="username" data-name ="'+message.username+'">' + message.username + ':</p><p class="text">' + message.text + '</b></p></div>';
//      } else {
//        tweet = '<div data-lobby="' + message.roomname + '" class ="tweet"><p class="username" data-name ="'+message.username+'">' + message.username + ':</p><p class="text">' + message.text + '</p></div>';
//    	}
// 	$('#chats').append(tweet);
//
// 	},
// clearMessages:function(){
// 	var node = document.getElementById('chats');
// 	  while (node.firstChild){
// 	  	node.removeChild(node.firstChild);
// 	  }
// 	},
// newMessage:function(){
//   //get data from textbox
//   var data = document.getElementById('textbox').value ;
//   var user = login['name'] ;//user.name
//   var message={
//   	username:user,
//   	text: data,
//   	roomname: app.currentroom
//   };
//   app.send(message);
//   app.init();
//   setTimeout(function(){app.showRoom(app.currentroom); }, 1000);
//   console.log(message);
// },
// addRoom:function(newRoom){
//   	var room = '<div class="room" data-room="' + newRoom + '">' + newRoom + '</div>';
// 	$('#roomSelect').append(room);
//
// },
// autoaddroom: function(){
// 	for(var r in app.rooms){
// 		if(!(r in app['roomdone'])){
// 			app.addRoom(''+r);
// 			console.log(r)
// 			app['roomdone'][r]=0;
// 		}
// 	}
// },
// 'currentroom':null,
// showRoom:function(room) {
//   app.clearMessages();
// //add all messages with property 'room' to div id="chats"
//   for (var i = 0; i < app.rooms[room].length; i++) {
//   	//0=user, 1=message, 2=date
//   	var chatMessage = {username:app.rooms[room][i][0], text:app.rooms[room][i][1], roomname: app.rooms[room][i][2] }
//   	app.addMessage(chatMessage);
//   }
//   app.currentroom= room;
// },
// addFriend:function(){
//
// }
// };
// var login={
// 	'name':null,
// 	'Friend':[],
// 	'id': null
// }
// $(document).ready(function(){
// 	//event listener for room selection:
//   $('#roomSelect').on('click','.room', function(){
//     var room = $(this).data('room');
//   	// console.log(app.rooms[room]);
// 	app.showRoom(room);
//    });
//   $('#submit').on('click', function(){
//   	app.newMessage();
//   	console.log("clicks")
//
//   })
//   var loggedin = false;
//   $('#login').on('click',function(){
//   	login['name'] = document.getElementById('username').value;
//
//   	$('#login').hide();
//   	$('#username').hide();
//    	$.ajax({
// 		url: app.server,
// 		type: 'GET',
// 		data: 'where={"name":"'+login.name+'"}',
// 		contentType: 'application/json',
// 		success: function(data){
// 			if(data.results.length===1){login['id']=data.results[0]['objectId'];
// 				login['Friend']= data.results[0]['friends'];
// 			}
// 			else{var userinfo={'name':login['name'],
// 					'friends':[]
// 				};
// 				login['Friend'] = [];
// 				app.send(userinfo);
// 			}
// 			console.log();
// 			//if array is 1 do{pull friends to local and push later} else no
// 		},
// 		error:function(){}
//
//   	});
//   });
// 	app.init();
// 	setInterval(function(){app.init()},20000);
// 		var node;
// 	$("#chats").on('click', '.username', function(){
// 		var name = $(this).data('name');
// 		if(confirm('Do you want to add a Friend')){console.log(name)}
// 		else{}
// 	})
// 	//onclickfunction(){if (loggedin){put to friends server using id}})
// });

// var message = {
//   username: 'something',
//   text: 'something',
//   roomname: 'something'
// };
//
// var rooms = {};
//
// var saveInput = function() {
//   var username = $('#username').val();
//   var message = $('#message').val();
//   var room = $('#room').val();
//   app.send({
//     username: username,
//     text: message,
//     roomname: room
//   });
// };
//
// var refresh = function() {
//   app.fetch();
// };
//
// var app = {
//   server: 'https://api.parse.com/1/classes/chatterbox'
// };
//
// app.init = function() {
//   app.fetch();
//   app.handleSubmit();
// };
//
// app.send = function(message) {
//   $.ajax({
//     // This is the url you should use to communicate with the parse API server.
//     url: app.server,
//     type: 'POST',
//     data: JSON.stringify(message),
//     contentType: 'application/json',
//     success: function(data) {
//         console.log('chatterbox: Message sent');
//         $('#chats').empty();
//         app.fetch();
//     },
//     error: function(data) {
//         // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
//         console.error('chatterbox: Failed to send message');
//     }
//   });
// };
//
// app.fetch = function() {
//   $.ajax({
//     url: app.server,
//     type: 'GET',
//     data: JSON.stringify(message),
//     contentType: 'application/json',
//     success: function(data) {
//       var ourData = data.results;
//       for (var i = 0; i < ourData.length; i++) {
//         var user = ourData[i].username;
//         var msg = ourData[i].text;
//         var room = ourData[i].roomname;
//         rooms[room] = room;
//         var a = $('<li>');
//         a.text(user + ": " + msg + ", room: " + room);
//         a.append('</li>');
//         jQuery('#chats').append(a);
//       }
//       app.listRoom();
//     },
//     error: function(data) {
//       console.error('chatterbox: Failed to receive message');
//     }
//   });
// };
//
// app.fetchByRoom = function(targetRoom) {
//   $.ajax({
//     url: app.server,
//     type: 'GET',
//     data: JSON.stringify(message),
//     contentType: 'application/json',
//     success: function(data) {
//       var ourData = data.results;
//       for (var i = 0; i < ourData.length; i++) {
//         var user = ourData[i].username;
//         var msg = ourData[i].text;
//         var room = ourData[i].roomname;
//         rooms[room] = room;
//         if (targetRoom === room) {
//           var a = $('<li>');
//           a.text(user + ": " + msg + ", room: " + room);
//           a.append('</li>');
//           jQuery('#chats').append(a);
//         }
//       }
//       app.listRoom();
//     },
//     error: function(data) {
//       console.error('chatterbox: Failed to receive message');
//     }
//   });
// };
//
// app.handleSubmit = function() {
//
// };
// app.clearMessages = function() {
//   $('#chats').empty();
// };
//
// // for test to pass
// app.addMessage = function(message) {
//   $('#chats').append('<li>' + message.username + ': ' + message.text + '</li>');
// };
//
// app.listRoom = function() {
//   $('#roomSelect').empty();
//   for (var key in rooms) {
//     var option = $('<option></option>');
//     option.val(key);
//     option.text(key);
//     $('#roomSelect').append(option);
//   }
// };
//
// app.addRoom = function(room){
//   $('#roomSelect').append('<li>' + room + '</li>');
// };
//
// app.addFriend = function() {
//
// };
//
// // $( "selected" )
// //   .change(function() {
// //     $( "selected option:selected" ).each(function() {
// //       console.log('selected?');
// //       var roomName = $(this).val();
// //       app.fetchByRoom(roomName);
// //     });
// //   })
// //   .trigger( "change" );
// $(document).ready(function(){
//   $('#roomSelect').change(function(){
//     var selectedVal = $(this).val();
//     $.ajax({
//         url: app.server,
//         type: 'GET',
//         data: JSON.stringify(message),
//         contentType: 'application/json',
//         success: function(data) {
//           var ourData = data.results;
//           $('#chats').empty();
//           for (var i = 0; i < ourData.length; i++) {
//             var user = ourData[i].username;
//             var msg = ourData[i].text;
//             var room = ourData[i].roomname;
//             rooms[room] = room;
//             if (selectedVal === ourData[i].roomname) {
//               var a = $('<li>');
//               a.text(user + ": " + msg + ", room: " + room);
//               a.append('</li>');
//               jQuery('#chats').append(a);
//             }
//           }
//           app.listRoom();
//         },
//         error: function(data) {
//           console.error('chatterbox: Failed to receive message');
//         }
//       });
//   });
// });
//
// // setInterval(function() {
// //   app.fetch();
// // }, 1000);
// // setInterval(function() {
// //   $('#chats').empty();
// // }, 5000);
//
//
// // function sendHelper () {
// //   var message = {
// //     username: 'something',
// //     text: 'something',
// //     roomname: 'something'
// //   };
//
// //   $('#submit').on('click', function(){
// //     message.username = $('#username').val();
// //     message.text = $('#message').val();
// //   });
// // }

// var app = {
//   server: 'https://api.parse.com/1/classes/chatterbox/?order=-createdAt',
//   chatRooms: {},
//   myFriends: {},
//   currentRoom: "lobby",
//   chatMessages: []
// };
//
//
// app.init = function(){
//   app.username = getParameterByName('username');
//   //load templates
//   app.roomTemplate = _.template($('#roomItem').html());
//   app.messageTemplate = _.template($('#messageTemplate').html());
//   app.update();
//   setInterval(app.update, 100a0);
//
//   $('.username').on('click', function(){ app.addFriend(); })
//   $('#messageForm').on('submit', function(e){
//     e.preventDefault();
//     var text = $('#inputText').val();
//     if(text.length<1){
//       return;
//     }
//     $('#inputText').val('');
//
//     var sendObj = {username:app.username, text:text, roomname:app.currentRoom};
//     app.send(sendObj);
//   });
//   $('#createRoomButton').on('click',function(){
//     console.log('after 31, or connection is broken');
//     var $el = $('#newRoomInput');
//
//     var roomName = $el.val();
//     app.chatRooms[roomName] = true;
//     app.currentRoom = roomName;
//     $el.val('');
//   });
// };
//
// app.render = function(){
//   $("#roomContainer").html('');
//   $('#chats').html('');
//   for(var i = 0; i < app.chatMessages.length; i++){
//
//     if(app.currentRoom === app.chatMessages[i].roomname){
//
//         directionClass = 'right';
//         directionClassB = 'left';
//       var user =  app.chatMessages[i];
//       user.ago = moment(user.createdAt).fromNow();
//
//
//       user.directionClass = directionClass;
//       user.directionClassB = directionClassB;
//       user.isFriend = false;
//       if(app.myFriends[user.username]===true){
//         user.isFriend = true;
//       }
//       var el = app.messageTemplate(user);
//       var $el = $(el);
//       $el.find('.userName').on('click',function(){
//         var username = $(this).attr('data-username');
//         console.log(username+"added to my friends! D:");
//         app.myFriends[username]=!app.myFriends[username];
//       });
//
//       $('#chats').prepend($el);
//     }
//   }
//   for(var key in app.chatRooms){
//     if(app.chatRooms.hasOwnProperty(key)){
//       //create a room
//       var className;
//       if(app.currentRoom === key){
//         className = "active";
//       } else {
//         className = "";
//       }
//       var el = app.roomTemplate({name:key,className:className});
//       var $el = $(el);
//       $("#roomContainer").append($el);
//       //Handle events
//       $el.find('a').on('click', function(e){
//         console.log("Did you click me!");
//         console.log( $(this).attr('data-roomname'));
//         app.currentRoom = $(this).attr('data-roomname');
//         app.render();
//       });
//
//
//     }
//   }
// //
// //  var objDiv = document.getElementById("chats");
// //  objDiv.scrollTop = objDiv.scrollHeight;
// };
//
// app.preprocess = function(obj){
//   // use _.escape on their text messages :D
//   //use _.defaults
//   var result = {};
//   var defaults = _.defaults(obj, {username:"troll", text:"I'm a troll", roomname:"trollroom" });
//   result.username = _.escape(defaults.username);
//   result.text = _.escape(defaults.text);
//   result.roomname = _.escape(defaults.roomname);
//
//   return result;
// }
//
// app.send = function(message, onSuccess, onError){
//   onError = onError || app.errorCallback;
//   console.log("Message is sending" + message);
//   $.ajax({
//     // always use this url
//     url: app.server,
//     type: 'POST',
//     data: JSON.stringify(message),
//     contentType: 'application/json',
//     success: onSuccess,
//     error: onError
//   });
// };
//
// app.fetch = function(onSuccess, onError){
//   onError = onError || app.errorCallback;
//   onSuccess = onSuccess || app.successCallback;
//
//   $.ajax({
//     // always use this url
//     url: app.server,
//     type: 'GET',
//     contentType: 'application/json',
//     success: onSuccess,
//     error: onError
//   });
// };
//
// app.successCallback = function (data) {
//   app.clearMessages();
//   // create a set
//   _.each(data.results, function(item, index){
//     if(item.roomname !== undefined){
//       //create chat room
//       app.chatRooms[_.escape(item.roomname)] = true;
//       //add to set
//     }
//     app.addMessage(item);
//   });
//   app.render();
// }
//
// app.errorCallback = function(data){
//   console.log("there is a callback error");
// }
//
// app.clearMessages = function(element){
//   app.chatMessages = [];
// };
//
// app.addMessage = function(message){
//   //var el = $('<div>');
//   //$('#chats').append(el);
//   var preprocess = app.preprocess(message);
//   app.chatMessages.push(preprocess);
//
// };
//
// app.addRoom = function(roomName){
//   var el = $('<div>');
//   $('#roomSelect').append(el);
// };
//
// app.addFriend = function(){
//
// };
//
// app.update = function(){
//
//   //fetch and draw messages & rooms
//   app.fetch();
//
// };
//
// $(document).ready(app.init);
//
// function getParameterByName(name) {
//     name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
//     var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
//         results = regex.exec(location.search);
//     return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
// }

// var app ={
//   // server: 'https://api.parse.com/1/classes/chatterbox',
//   server: 'http://127.0.0.1:3000/classes/messages',
//   roomList: {},
//   friendList: {},
//
//   init: function() {
//     app.$roomSelect = $('#roomSelect');
//
//     app.fetch();
//     setInterval(app.fetch, 20000);
//
//   },
//
//   send: function(message) {
//     $.ajax({
//     // always use this url
//     // url: 'https://api.parse.com/1/classes/chatterbox',
//     url: app.server,
//     type: 'POST',
//     data: JSON.stringify(message),
//     contentType: 'application/json',
//     success: function (data) {
//       console.log('chatterbox: Message sent');
//     },
//     error: function (data) {
//       // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
//       console.error('chatterbox: Failed to send message');
//     }
//   });
//   },
//
//   fetch: function() {
//     $.ajax({
//     // always use this url
//     //url: 'https://api.parse.com/1/classes/chatterbox',
//     url: app.server,
//     type: 'GET',
//     // data: {order: '-createdAt'},
//     data: {},
//     contentType: 'application/json',
//     success: function (data) {
//       app.clearMessages();
//       _.each(data.results, function(value) {
//         app.addMessage(value);
//       });
//     },
//
//     error: function (data) {
//       // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
//       console.error('chatterbox: Failed to fetch messages');
//     }
//     });
//   },
//
//   clearMessages: function() {
//     $('#chats').empty();
//   },
//
//   addMessage: function(message) {
//     var selectedRoom = $("#roomSelect option:selected").val();
//     if (!selectedRoom) {
//       selectedRoom = 'lobby';
//     }
//
//     // if (selectedRoom === message.roomname) {
//       // if (app.friendList[message.username]) {
//       //   $('#chats').append('<div class="chat"><p class="friend"> <span class="username" data-username>' + _.escape(message.username) + '</span> : ' + _.escape(message.message) + ' ' + '<span class="roomname" data-roomname>' + _.escape(message.roomname) + '</span></p></div>');
//       //   $('.username').click( function(value) {
//       //     app.addFriend(value.target);
//       //   });
//       // } else {
//         $('#chats').append('<div class="chat"><p>' + '<span class="username" data-username>' + _.escape(message.username) + '</span> : ' + _.escape(message.message) + ' ' + '<span class="roomname" data-roomname>' + _.escape(message.roomname) + '</span></p></div>');
//         $('.username').click( function(value) {
//           app.addFriend(value.target);
//         });
//       // }
//     // }
//     app.addRoom(message.roomname);
//   },
//
//   addRoom: function(room) {
//     if (room !== undefined && room !== '') {
//       if (app.roomList[room] === undefined) {
//         $('#roomSelect').append('<option value="' + room + '">' + room + '</option>');
//         app.roomList[room] = true;
//       }
//     }
//   },
//
//   addFriend: function(evt) {
//     var username = $(evt).text();
//     app.friendList[username] = true;
//   },
//
//   handleSubmit: function(e) {
//     e.preventDefault();
//
//     var username = $('.username2').text();
//     // var message = _.escape($('.message2').val());
//     var message = $('.message2').val();
//     // var room = $('#roomSelect').val();
//     var room = app.$roomSelect.val();
//
//     var messageObj = {
//       // username: username,
//       username: getUrlParameter('username'),
//       message: message,
//       roomname: room
//     };
//     console.log(messageObj);
//
//     //  var messageObj = {
//     //   username: 'Jennifer1',
//     //   message: '1111',
//     //   roomname: 'lobby'
//     // };
//
//     app.send(messageObj);
//   }
//
// };
//
// function getUrlParameter(sParam) {
//   var sPageURL = window.location.search.substring(1);
//   var sURLVariables = sPageURL.split('&');
//   for (var i = 0; i < sURLVariables.length; i++) {
//       var sParameterName = sURLVariables[i].split('=');
//       if (sParameterName[0] == sParam) {
//         return sParameterName[1];
//       }
//   }
// }
//
// $( document ).ready(function() {
//
//     app.init();
//
//     var whoami = getUrlParameter('username');
//     $('.username2').text(whoami);
//
//
//     $('.submit').click( function(event) {
//         app.handleSubmit(event);
//     });
// });

// var app = {
//   lastCreated: '2015-02-17T00:50:32.494Z',
//   currentRoom: undefined,
//   server: 'https://api.parse.com/1/classes/chatterbox',
//   rooms: {},
//   friends: {},
//
//   init: function() {
//     var context = this;
//     setInterval(function() {
//       context.fetch();
//     }, 2000);
//
//     var filterRoom = function() {
//       var $element = $(this);
//       var name =  $element.val() || $element.text();
//
//       if (name === 'Global') {
//         name = undefined;
//       }
//
//       context.filterRoom(name);
//     };
//
//     // add interactivity
//     $('#send-message').click(function(e) {
//       e.preventDefault();
//       context.send();
//     });
//     // Add click handler to room name in each message
//     $(document).on('click', '.roomname', filterRoom);
//     $(document).on('change', '#roomSelect', filterRoom);
//     $(document).on('click', '.username', function() {
//       var friend = $(this).text();
//       if (!(friend in context.friends)) {
//         context.friends[friend] = true;
//         $('#friends').append('<li class="friends-list-item">' + friend + '</li>');
//         $(this).removeClass('enemy').addClass('friend');
//       }
//     });
//   },
//
//   cleanData: function(unsafe) {
//     unsafe = unsafe || 'NA';
//     return he.encode(unsafe);
//   },
//
//   displayMessages: function(messages) {
//     var context = this;
//     var $messageList = $('#chats');
//
//     // iterate through message array (containing message objects)
//     for (var i = 0; i < messages.length; i++) {
//       var friendClass = 'enemy';
//       var message = messages[i];
//       var username = this.cleanData(message.username);
//       var text = this.cleanData(message.text);
//       var roomname = this.cleanData(message.roomname);
//
//       if (username in this.friends) {
//         friendClass = 'friend';
//       }
//
//       var messageDiv =
//         '<div class="message">' +
//           '<div class="row">' +
//             '<div class="col6">' +
//               '<a class="username ' + friendClass + '">' + username + '</a>' +
//             '</div>' +
//             '<div class="col6 text-right">' +
//               '<a class="roomname">' + roomname + '</a>' +
//             '</div>' +
//           '</div>' +
//           '<p class="text">' + text + '</p>' +
//         '</div>';
//       $messageList.prepend(messageDiv);
//     }
//
//
//   },
//
//   addNewRooms: function(messages) {
//     var $options = $('#roomSelect');
//     for (var i = 0; i < messages.length; i++) {
//       var room = this.cleanData(messages[i].roomname);
//
//       if (!(room in this.rooms)) {
//         var option = '<option>' + room + '</option>';
//         $options.append(option);
//         this.rooms[room] = true;
//       }
//     }
//   },
//
//   fetch: function() {
//     var context = this;
//
//     var where = {
//       createdAt: {
//         '$gt': context.lastCreated
//       }
//     };
//     // extend where defaults
//     if (context.currentRoom !== undefined) {
//       _.extend(where, {roomname: context.currentRoom});
//     }
//
//     var data = {
//       order: '-createdAt',
//       where: where
//     };
//
//     $.ajax({
//       url: context.server,
//       type: 'GET',
//       data: data,
//       success: function(response) {
//         var messages = response.results;
//
//         if (messages[0] !== undefined) {
//           context.lastCreated = messages[0].createdAt; // get most up-to-date timestamp
//         }
//         context.addNewRooms(messages);
//         context.displayMessages(messages);
//       },
//       error: function() {
//         console.log('chatterbox: Failed to get message');
//       }
//     });
//   },
//
//   send: function(message) {
//     var context = this;
//     console.log("Sent!");
//
//     var defaults = {
//       username : $('#user').val(),
//       text: $('#message').val(),
//       roomname: $('#room').val()
//     };
//
//     console.log(typeof message);
//     var message = message || defaults;
//
//     $.ajax({
//       url: context.server,
//       type: 'POST',
//       data: JSON.stringify(message),
//       contentType: 'application/json',
//       success: function() {
//         $('#status').text('Your message was successfully sent!')
//                     .addClass('success');
//       },
//       error: function() {
//         $('#status').text('Your message failed :(')
//                     .addClass('failure');
//       }
//     });
//   },
//
//   clearMessages: function() {
//     var $chats = $('#chats');
//     $chats.children().remove();
//   },
//
//   addRoom: function(roomName) {
//     var $roomSelect = $('#roomSelect');
//     $roomSelect.append('<option>' + roomName + '</option>');
//   },
//
//   filterRoom: function(roomName) {
//     this.clearMessages();
//     this.currentRoom = roomName;
//     this.fetch();
//   }
// };
//
// $(document).ready(function(){
//   app.init();
// });

// $(document).ready(function() {
//   var app={
//     roomName: undefined,
//     friends: {},
//     server: 'https://api.parse.com/1/classes/chatterbox/',
//     init: function() {
//       //Load page and refresh
//       app.fetch(app.roomName);
//       setInterval(function() {
//         app.fetch(app.roomName);
//       }, 1000);
//
//       //initialize submit message listener
//       app.submitMessage();
//       app.roomChange();
//       app.addFriend();
//     },
//
//     render: function(data){
//       $('.post').remove();
//       //limiting to 30 messages instead of full data['results'].length
//       for (var i=0; i<data.results.length; i++) {
//         var msgData=data.results[i];
//         //concat all parts of the post and put in our format ('username'-['roomname']-'date-time'-'message')
//         var post=msgData.username+' ['+msgData.roomname+'] '+moment(msgData.createdAt).format('lll')+': '+msgData.text;
//         if (msgData.username===undefined) {
//           var nameClass='anonymous';
//         } else {
//           var nameClass=msgData.username.split(" ").join();
//         }
//         var el = $('<div class="post '+nameClass+'">');
//         el.text(post);
//         $('.messages').append(el);
//       }
//     },
//
//     send: function(message) {
//       $.ajax({
//         url: 'https://api.parse.com/1/classes/chatterbox',
//         type: 'POST',
//         data: JSON.stringify(message),
//         contentType: 'application/json',
//         success: function (data) {
//           console.log('chatterbox: Message sent');
//         },
//         error: function (data) {
//           console.error('chatterbox: Failed to send message');
//         }
//       });
//     },
//     fetch: function(room) {
//       if (room===undefined || room==='') {
//         var dataFilter={
//           order: '-createdAt'
//         };
//       } else {
//         var dataFilter={
//           order: '-createdAt',
//           where: '{"roomname": "'+room+'"}'
//         };
//       }
//       $.ajax({
//         url:  'https://api.parse.com/1/classes/chatterbox',
//         type: 'GET',
//         data: dataFilter,
//         contentType: 'application/json',
//         success: function (data) {
//           console.log('chatterbox: Message received');
//           app.render(data);
//           app.highlightFriends();
//         },
//         error: function (data) {
//           console.error('chatterbox: Failed to get message');
//         }
//       });
//     },
//     highlightFriends: function() {
//       for (var friend in app.friends) {
//         $('.'+friend).css('font-weight','bold');
//       }
//     },
//     submitMessage: function() {
//       $('#sendButton').on('click', function() {
//         var message={};
//         message.username=window.location.search.slice(10);
//         message.text=$('#messageInput').val();
//         message.roomname=app.roomName;
//         app.send(message);
//       });
//     },
//     roomChange: function() {
//       $('#roomButton').on('click', function() {
//         app.roomName=$('#roomInput').val();
//         app.fetch(app.roomName);
//       });
//     },
//     addFriend: function() {
//       $('.messages').on('click', 'div', function() {
//         if(confirm('Add '+this.classList[1]+' to your friend list?') && !(this.id in app.friends)) {
//           app.friends[this.classList[1]]=1;
//         }
//       });
//     }
//   };
//   //start app
//   app.init();
//
// });
