var totalProjects;
var projectsLoaded = 0;
var projectsRemaining;
var noProjectsToLoad = 9;
var projectToLoad;


var main = {

	content:null,

	init: function(data) {
		animatedScroll();
		main.loadWork(Object.keys(data));
	},

	loadWork:function(data) {
		var totalProjects;
		var projectsLoaded = 0;
		var projectsRemaining;
		var projectToLoad;

		main.content = data;
		console.log("case studies are " + Object.keys(main.content));

		totalProjects = main.content.length;
		projectsRemaining = totalProjects - projectsLoaded;
		trace(projectsRemaining + ' remaining');

			for(var i in main.content) {
				projectToLoad = main.content[i];
				trace('loading ' + projectToLoad);
				// if (i == projectToLoad) {
				// if(main.content[i].tag) {
					trace("found a match at " + projectToLoad);
					if(main.content[i].tile) {

						trace("found i at " + i)
						projectsLoaded++;
						projectsRemaining = totalProjects - projectsLoaded;
						main.addTile(i,main.content[i].tile);
					}
				// }
				// 	trace("error at project to load")
				// }
			}
			// if (projectsRemaining > 0) {
			// 	//add loadMore Button
			// 	$span = $('<span>').html('load more');
			// 	$loadMore = $('<div>').addClass('btn').addClass('loadMore').append($span);

			// 	$('.workSection').append($loadMore)
			// 	$('.loadMore').click(function(){
			// 		main.loadWork(data);
			// 	});
			// } else {
			// 	//transition
			// 	// $('.loadMore').
			// 	setTimeout(function(){
			// 		//show one at a time at random scale from 0 to
			// 		$( ".loadMore" ).remove();
			// 	},2000);
				
			// }
			// trace('how many projects left ' + projectsRemaining);
			// trace('projects loaded ' + projectsLoaded);
	},

	addTile: function(name, tile) {

		$image = $('<img>').addClass('tile').attr('src', 'http://placekitten.com/g/400/400');
		
		$figCaption = $('<figcaption>').addClass('project'+ name);

		$span = $('<span>').html(name);

		$figCaption.append($span);

		$figure = $('<figure>').append($image,$figCaption);;

		$tile = $('<div>').addClass('tile').data('name',name).append($figure);
		$('#workTiles').append($tile);
		

	}

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


//Ready function, load content
$(document).ready(function () {

		$.getJSON('content.json',main.init);
			$('.tile').hide();

			setTimeout(function(){
				//show one at a time at random scale from 0 to
				$('.tile').show();


			},500);
});