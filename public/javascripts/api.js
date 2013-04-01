function getCouchUrl(db) {
  return '/couch'+'/'+db;
}

function api( command, params, callback ) {
  if( command == 'im_send' )
    __im_send( params, callback );
  if( command == 'im_history' )
    __im_history( params, callback );
}

function __im_send(params, callback) {
  var curl = getCouchUrl('im');
  $.ajax({
      type: "POST"
    , url: curl
    , contentType: 'application/json'
    , data: JSON.stringify(params)
  }).done( function( data ) {
    callback( data ) 
  });
}

function fromMytoYour( myUid, yourUid, items, callback ) {
  var url = '/couch/im/_design/default/_view/fromto?key=["' + myUid+'","'+yourUid+'"]' ;
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
  fromMytoYour( uid, myUid, items, function() {
    fromMytoYour( myUid,uid, items, function() {
      function sortTimeLine(a, b) {return a.timeline - b.timeline;}
      items.sort(sortTimeLine);
      callback(items);
    });
  });
};