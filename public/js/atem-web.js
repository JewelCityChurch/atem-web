var ws;
var localCam = false;
var states = ['preview', 'program'];
var intervals = [];
$(function() {
	init_config();
	var ws = new WebSocket("ws://"+location.hostname+":8080/", "protocolOne");
	ws.onmessage = function (event) {
		var jsObj = JSON.parse(event.data);
		update_dom(jsObj);
	}
	localCam = $.urlParam('localCams');
	if (localCam !== null) {
		$('#top-container').removeClass('hidden');
		$("#btm-container").removeClass('hundred');
		$("#btm-container").addClass('thirtyFive');
	}
});

function init_config () {
	$.get( "/api", function( data ) {
		//update_dom(data);
	});
	
}

function update_dom (data) {
	intervals.forEach(clearInterval);
	$.each(data, function(index, value) {
		if(! $('div[data-abbreviation="'+value.abbreviation+'"]').length ) {
			$('<div>').addClass('camera').html("<div>"+value.name+"<br /><span></span></div>").attr('data-abbreviation', value.abbreviation).appendTo('#cameras');
			if(value.abbreviation == localCam) {
				$('<div>').addClass('camera').html("<div>"+value.name+"</div>").attr('data-abbreviation', value.abbreviation).appendTo('#cameras-top');
			}
		}
		$.each(states, function(index, tState) {
			$('div[data-abbreviation="'+value.abbreviation+'"]').each(function(i, el) {$(el).removeClass(tState);});
			if(value.state == tState) {
				$('div[data-abbreviation="'+value.abbreviation+'"]').each(function(i, el) {
					$(el).addClass(tState);
					if(tState == 'program') {
						//intervals.push(setInterval( function(){	updateTimer($(el).find("span"));	}, 1000));
					}
				});
				console.log(value.abbreviation, tState);
			}
		});
	});
}

function pad ( val ) { return val > 9 ? val : "0" + val; }
function updateTimer(elem) {
	var sec = 0;
	if($(elem).attr('data-sec') !== undefined) {
		sec = $(elem).attr('data-sec');
	} else {
		$(elem).attr('data-sec', 0);
	}
	$(elem).html(pad(parseInt(sec/60,10)) + ':' + pad(++sec%60));
	$(elem).attr('data-sec', sec);
}

$.urlParam = function(name){
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results==null){
       return null;
    }
    else{
       return decodeURI(results[1]) || 0;
    }
}