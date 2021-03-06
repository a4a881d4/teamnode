var globes = {
    im:{},
    sio:null
  };

function getCouchUrl(db) {
  return '/couch'+'/'+db;
}

function api( command, params, callback ) {
  if( command == 'im_send' )
    __im_send( params, callback );
  if( command == 'im_history' )
    __im_history( params, callback );
  if( command == 'reset_im_box' )
    __reset_im_box( params, callback );
}

function __im_send(params, callback) {
  var url = '/api/im_counter';
  $.get(url,function(data) {
    var ret = JSON.parse(data);
    if( ret.err_code==0 ) {
      params['sn']=ret.data;
      var curl = getCouchUrl('im');
      $.ajax({
          type: "POST"
        , url: curl
        , contentType: 'application/json'
        , data: JSON.stringify(params)
      }).done( function( data ) {
        callback( data );
        var since = params.timeline+1;
        globes.im[params.toUid]['history']=since.toString();
      });
    } else {
      callback(data);
    }
  });
}

function buildKeys( keys ) {
  for( var k in keys ) {
    if( keys[k]!='{}' )
      keys[k] = '"'+keys[k]+'"';
  }
  return '['+keys.join(',')+']';
};

function fromMytoYour( myUid, yourUid, after, items, callback ) {
  var url = '/couch/im/_design/default/_view/fromto?startkey=' 
    + buildKeys( [ myUid, yourUid, after ] ) 
    + '&endkey='
    + buildKeys( [ myUid, yourUid, '{}' ] )
    ;
  $.get( url , function( data ) {
    data = JSON.parse(data);
    var count=0;
    if( data['rows'] && data['rows'].length>0 ) {
      data.rows.forEach( function(item) {
        items.push(JSON.parse(item.value));
        count++;
        if( count==data.rows.length )
          callback();
      });
    } else {
      callback();
    }
  });
}

function __im_history( params, callback ) {
  var uid = params.yourUid;
  var myUid = params.myUid;
  var items = [];
  if( globes.im[uid]==undefined ) 
    globes.im[uid]={
      history:'0'
    };
  fromMytoYour( uid, myUid,globes.im[uid].history,items, function() {
    fromMytoYour( myUid,uid,globes.im[uid].history,items, function() {
      function sortTimeLine(a, b) {return a.timeline - b.timeline;}
      items.sort(sortTimeLine);
      callback(items);
      if( items.length>0 ) {
        var since = items[items.length-1].timeline+1;
        globes.im[uid]['history']=since.toString();
      }
    });
  });
};

function __reset_im_box( params, callback ) {
  var uid = params.Uid;
  if( globes.im[uid]==undefined ) {
    globes.im[uid]={
      history:'0'
    };
  } else {
    globes.im[uid]['history']='0';
  }
  callback();
};

function sio_connect() {
  var url = 'http://'+window.location.host;
  globes.sio = io.connect(url);
}

function regist_socket_io(uid) {
  globes.sio.emit('register',{Uid:uid});
};

function regist_channel( channel, callback ) {
  globes.sio.on(channel,callback);
};

function regist_im( uid, callback ) {
  if( globes.im[uid]==undefined )
    globes.im[uid]={
        history:'0'
      , sinceid:0
      , callback:callback
    };
  else
    globes.im[uid].callback=callback;
};

function im_socket_io() {
  regist_channel('im', function(msg) {
    var items = globes.im;
    for( var uid in items ) {
      if( items[uid].callback instanceof Function ) {
        items[uid].callback(msg);
      }
    }
  });
};