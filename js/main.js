var totalProjects;
var projectsLoaded = 0;
var projectsRemaining;
var noProjectsToLoad = 9;
var projectToLoad;


var fn = {

	content:null,
	myUrl:"localhost",
	main: $('#main'),
	

	init: function(data) {
		fn.content = data;
		trace(fn.content.homePage);
		testing = fn.content.homePage;
		// displayPage(checkURL());
		
		$('#main').append(fn.checkURL);
		fn.loadWork();
		// fn.setup();
	},

	checkURL:function(){
		var a = fn.displayPage(testing);

		return a;
	},
	// <--history.js-->
	setup:function(){
		var $main = $('#main');

		String.prototype.decodeHTML = function() {
			return $("<div>", {html: "" + this}).html();
		};

		$(document).on("click", ".tile, .thumb", function() {
			var $a = $(this).data('content');
		  	history.pushState({}, '', $a.href);
		  	loadPage($a)
		  	return false;
		});
		$(window).on("popstate", function(e) {
			if (e.originalEvent.state !== null) {
				trace(location.href)
				loadPage(location.href);
			} else {
				trace(e.originalEvent.state);
			}
		});
		//neaten up some animation
		loadPage = function (content) {
			$main.fadeOut(500, function(){
				$main.empty().append(fn.displayPage(content)).fadeIn(500);
			});	
		};
	},
	// <--?end-->
	loadWork:function() {
		var totalProjects;
		var projectsLoaded = 0;
		var projectsRemaining;
		var projectToLoad;

		totalProjects = fn.content.length;
		projectsRemaining = totalProjects - projectsLoaded;

			for(var i in fn.content) {
				projectToLoad = fn.content[i];
				// if (i == projectToLoad) {
				if(fn.content[i].format == 'caseStudy') {
					if(fn.content[i].tile) {
						trace("case study found i at " + i)
						projectsLoaded++;
						projectsRemaining = totalProjects - projectsLoaded;
						fn.addTile(i,fn.content[i], 'project');
					}
				} else if(fn.content[i].format == 'skill') {
					if(fn.content[i].tile) {
						trace("skill found i at " + i)
						projectsLoaded++;
						projectsRemaining = totalProjects - projectsLoaded;
						fn.addTile(i,fn.content[i], 'skill');
					}
				}
			}
	},

	addTile: function(name, content, addTo) {
		$image = $('<img>').addClass('img').attr('src', content.tile.image);
		
		$figCaption = $('<figcaption>').addClass(name);

		$span = $('<span>').html(name);

		$figCaption.append($span);

		$figure = $('<figure>').append($image,$figCaption);;

		$tile = $('<div>').addClass('tile').data('content',content).append($figure);
				
		if(addTo == 'project'){
			$tile.addClass('three-col');
			$('#projectTiles').append($tile);	
		} else if(addTo == 'skill'){
			$tile.addClass('two-col');
			$('#skillTiles').append($tile);
		}
	},
// >>>>>>>>>>>>> formatting for pages <<<<<<<<<<<<<<<<

	displayPage: function(item) {
		// var item = $(this).data('project');
		var markup ='';
			switch (item.format){
				case ('homePage'):
					$.each(item.main, function (index, section){
						switch (index){
							case 'hero':
								trace('hero');
								// $image = $('<div>').addClass('hero-image').css('background-image', 'url("' + section.image + '")');
								//for now this will do need to add hero image in to markup
								markup += '<div class="hero-image"></div>';
								break;
							case 'section 1':
								trace('section 1');
								markup += '<div id="projectSection" class="tileSection">'
								markup += '<div class="case-studies"><h1>' + section.head +'</h1><p>' + section.copy + '</p></div>';
								markup += '<div id="projectTiles" class="tiles three-col"></div></div>';
								break;
							case 'section 2':
								trace('section 2');
								markup += '<div class="sectionHolder"><div id="skillSection" class="tileSection"><div class="singleCol"><h1>' + section.head +'</h1><p>' + section.copy + '</p></div>'
								markup += '<div id="skillTiles" class="tiles two-col"></div></div></div>'
								break;
							case 'section 3':
								trace('section 3');
								markup += '<div id="aboutMe" class="tileSection"><div class=floatHolder clearfix><div class="doubleCol doubleImage"><img src=' + section.images + '></img></div><div class="singleCol about-me"><h1>' + section.head +'</h1><p>' + section.copy + '</p></div></div></div>'
								break;
						}
					});
					break;
				case ('caseStudy'):
					$.each(item.main, function (index, section){
						switch (index){
							case 'hero':
								$image = $('<div>').addClass('hero-image').css('background-image', 'url("' + section.image + '")').css('background-repeat', 'no-repeat');
								markup += '<div class="tileSection"><div class="doubleCol"><h1>' + section.head + '</h1>' + '<p>' + section.copy + '</p></div></div>'
								break;
								
							case 'section 1':
								// append copy to markup
								markup += '<div class="sectionHolder"><div class="tileSection"><div class="singleCol"><h1>' + section.head +'</h1><p>' + section.copy + '</p></div>';
								// append images to markup
								if (section.images != '') {
									markup += '<div class="tile-holder"><div class="tiles">';
									$.each (section.images, function(index, image){
										markup += '<div class="tile two-col"><img class="img" src=' + image + '></img></div>';
									})
								}
								markup += '</div></div>';
								break;
							// case "section 2":
							// 	break;
						}
					});
					break;
				case ('skill'):
					$.each(item.main, function (index, section){
						switch (index){
							case 'hero':
								// $image = $('<div>').addClass('hero-image').css('background-image', 'url("' + section.image + '")').css('background-repeat', 'no-repeat');
								markup += '<div class="tileSection skill-copy"><div class="doubleCol"><h1>' + section.head + '</h1>' + '<p>' + section.copy + '</p></div></div>'
								break;
								
							case 'masonry-images':
								// markup += '<div class="sectionHolder"><div class="tileSection">';
								// append images to markup
								if (section.images != '') {
									markup += '<div class="tileSection"><div class="tiles three-col">';
									$.each (section.images, function(index, image){
										markup += '<div class="tile three-col"><img class="img" src=' + image + '></img></div>';
									})
								}
								markup += '</div></div>';
								break;
							// case "section 2":
							// 	break;
						}
					});
					break;
			}
		return markup;
	}
}

// function animatedScroll() {
// 	var docElem = document.documentElement,
// 	header = document.querySelector('.header'),
// 	socialList = document.querySelector('.socialList'),
// 	logo = document.querySelector('.logo'),
// 	workSection = document.querySelector('.workSection'),
// 	didScroll = false,
// 	showWorkTitle = 1;
// 	changeHeaderOn = 80;

// 	function headerInit() {
// 		window.addEventListener( 'scroll', function( event ) {
// 			if(!didScroll){
// 				didScroll = true;
// 				setTimeout(scrollPage,250);
// 			}
// 		}, false);
// 	}

// 	function scrollPage() {
// 		trace('scroll page ran, didScroll = '+ didScroll);
// 		var sy = scrollY();
// 		if ( sy >= showWorkTitle ) {
// 	        classie.add( projectSection, 'sectionDrop' );
// 	    }
// 	    else {
// 	    	classie.remove( projectSection, 'workSectionDrop' );  
// 	    }
// 	    if ( sy >= changeHeaderOn ) {
// 	        classie.add( header, 'headerShrink' );
// 	        classie.add( socialList, 'socialListShrink' );
// 	        classie.add( logo, 'logoShrink' );
// 	    }
// 	    else {
// 	        classie.remove( header, 'headerShrink' );
// 	        classie.remove( socialList, 'socialListShrink' );
// 	        classie.remove( logo, 'logoShrink' );
// 	    }
// 	    didScroll = false;
// 	}

// 	function scrollY() {
// 		return window.pageYOffset || docElem.scrollTop;
// 	}
// 	headerInit();
// };


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

		//needs a timer
		$.getJSON('content.json', fn.init);
		// $('.tile').hide();
		

		// 	setTimeout(function(){
		// 		//show one at a time at random scale from 0 to
		// 		$('.tile').show();
		// 	},500);
});