var main = {
	content:null,
	init: function(data) {
		// main.importProjects(content.json);
		// $(document).ready(function () {
		// 	main.init();
		// 	main.importProjects(content.json);
		// });
		
		animatedScroll();
		main.loadWork(data);

		// $('#workTiles').masonry({
		// 	itemSelector: '.tile',
		// });

	},

	loadWork:function(data) {
	main.content = data;
	trace(Object.keys(main.content).length + ' tiles loaded');

		for(var i in main.content) {
			if(main.content[i].tile) main.addTile(i,main.content[i].tile);
		}

	},

	addTile: function(name, tile) {

		$image = $('<img>').addClass('tile').addClass('name').attr('src', 'http://placekitten.com/g/400/400');
		
		$figCaption = $('<figcaption>').addClass('project'+ name);

		$span = $('<span>').html(name);

		$figCaption.append($span);

		$figure = $('<figure>').append($image,$figCaption);;

		$tile = $('<div>').addClass('tile').data('name',name).append($figure);

		// $('project'+name).click(function(){
		// 	location.href='https://www.facebook.com/jessicamaryyork';
		// });
		$('#workTiles').append($tile);
		trace('appended');

	}
	// importProjects:function(data) {
	// 	for(i wk = 0; i < data.length; i++) {
	// 		trace('imported ' + data[i]);
	// 	}
	// }
}

function animatedScroll() {
	var docElem = document.documentElement,
	header = document.querySelector('.header'),
	socialList = document.querySelector('.socialList'),
	logo = document.querySelector('.logo'),
	workSection = document.querySelector('.workSection'),
	didScroll = false,
	showWorkTitle = 1;
	changeHeaderOn = 80;

	function headerInit() {
		window.addEventListener( 'scroll', function( event ) {
			if(!didScroll){
				didScroll = true;
				setTimeout(scrollPage,250);
			}
		}, false);
	}

	function scrollPage() {
		trace('scroll page ran, didScroll = '+ didScroll);
		var sy = scrollY();
		if ( sy >= showWorkTitle ) {
	        classie.add( workSection, 'workSectionDrop' );
	    }
	    else {
	    	classie.remove( workSection, 'workSectionDrop' );  
	    }
	    if ( sy >= changeHeaderOn ) {
	        classie.add( header, 'headerShrink' );
	        classie.add( socialList, 'socialListShrink' );
	        classie.add( logo, 'logoShrink' );
	    }
	    else {
	        classie.remove( header, 'headerShrink' );
	        classie.remove( socialList, 'socialListShrink' );
	        classie.remove( logo, 'logoShrink' );
	    }
	    didScroll = false;
	}

	function scrollY() {
		return window.pageYOffset || docElem.scrollTop;
	}
	headerInit();
};


function validateEmail(email) {
	var re = /^(([^<>()[\]\\.,;:\s@\']+(\.[^<>()[\]\\.,;:\s@\']+)*)|(\'.+\'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email);
}
function validateText(text) {
	var re = /[a-zA-Z]/g;
	return re.test(text);
}

/* = = =  Prevent console.log in IE8  = = = */
function trace(s) {
if ('console' in self && 'log' in console) console.log(s); 
};

$(document).ready(function () {

		$.getJSON('content.json',main.init);
			$('.tile').hide();
			// $('h1#ourwork').hide();
			// $('.aboutpanel').hide();
			// $('.clientcloud').hide();
			// $('.legal').hide();
			setTimeout(function(){
				//show one at a time at random scale from 0 to
				$('.tile').show();
				// $('h1#ourwork').show();
				// $('.aboutpanel').show();
				// $('.clientcloud').show();
				// $('.legal').show();

			},500);
});