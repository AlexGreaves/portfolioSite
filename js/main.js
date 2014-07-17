var fn = {

	content:null,
	myUrl: window.location.host,
	currentUrl:'',
	main: $('#main'),
	

	init: function(data) {
		fn.content = data;
		fn.linking();
	},

	checkURL:function(){
		var currentUrl = cleanURL();
		trace(currentUrl);
		var pageToLoad;


		// old code
		// if (currentUrl == fn.myUrl){
		// 	pageToLoad = fn.content.homePage;
		// }

		// else {
		// 	$.each(fn.content, function (index, section){
		// 		var str = section.href.toString();
		// 		if (currentUrl.search(str) != -1){
		// 			trace('yipee you found me!');
		// 			pageToLoad = section;
		// 			return false;
		// 		};
		// 	});
		// };
		// if (pageToLoad != null){
		// 	return pageToLoad;	
		// } else {
		// 	trace("404 page");
		// 	return fn.content.homePage;
		// }

	},

	updateContent:function(a){
		var $main = $("#main");
		var $a = a;
		fn.currentUrl = cleanURL();
		trace('current url is ' + cleanURL());

		if ($a.href){
			$main.fadeOut(500, function(){
				$('body').ScrollTo();
				$main.empty().append(fn.displayPage($a)).fadeIn(500);
				// old code
				if ($a.href == "home-page"){
					fn.loadWork(fn.content);
				} else {
					fn.loadWork($a.main.thumbnailImages);
				}
				// old code

				//modal-images
			});	


		} else {
			trace("no href data! Now Rerouting");
			fn.updateContent(fn.checkURL());
		}
	},

	// <--history.js-->
	linking:function(){
		var History = window.History;

		if (History.enabled){
			var State = History.getState(); // Note: We are using History.getState() instead of event.state 
			History.pushState(State, '', State.urlPath);

			fn.updateContent(fn.checkURL());
		} else {
			return false;
		}

		History.Adapter.bind(window, 'statechange', function(){
			fn.updateContent(History.getState().data);
		});

	    $(document).on("click", ".tile", function(e) {
	    	var State = History.getState();
	    	var $a = $(this).data('content');
	    	trace($a);

	    	e.preventDefault();
	    	History.pushState($a, '', $a.href);
	    });
	},

	// <--?end-->
	loadWork:function(data) {
		var toLoad;

			for(var i in data) {
				// trace(i);
				toLoad = data[i];
				
				if (toLoad.thumb){
					trace(toLoad);
					addTile(toLoad.head, toLoad, toLoad.format);
				}
			}

	//NEWNEWNEWNEWNEW
		function addTile(name, content, addTo) {
			$thumb = $('<img>').addClass('img').attr('src', content.thumb);
			
			$figCaption = $('<figcaption>').addClass(name);

			$span = $('<span>').html(name);

			$figCaption.append($span);

			$figure = $('<figure>').append($thumb,$figCaption);;

			$tile = $('<div>').addClass('tile').data('content',content).append($figure);
					
			if(addTo == 'project'){
				$tile.addClass('three-col');
				$('#projectTiles').append($tile);	
			} else if(addTo == 'skill'){
				$tile.addClass('two-col');
				$('#skillTiles').append($tile);
			} else if(addTo = 'thumbnailImages'){
				$tile.addClass('three-col');
				$('#section-tiles').append($tile);
			}
		}
	},

	
// >>>>>>>>>>>>> formatting for pages <<<<<<<<<<<<<<<<

	displayPage: function(item) {
		var markup ='';
		switch (item.format){
			case ('homePage'):
				$.each(item.main, function (index, section){
					switch (index){
						case 'hero':
							// $image = $('<div>').addClass('hero-image').css('background-image', 'url("' + section.image + '")');
							//for now this will do need to add hero image in to markup
							markup += '<div class="hero-image"></div>';
							break;
						case 'section 1':
							markup += '<div id="projectSection" class="tileSection clearfix">'
							markup += '<div class="case-studies"><h1>' + section.head +'</h1><p>' + section.copy + '</p></div>';
							markup += '<div id="projectTiles" class="tiles three-col"></div></div>';
							break;
						case 'section 2':
							markup += '<div class="sectionHolder"><div id="skillSection" class="tileSection clearfix"><div class="singleCol"><h1>' + section.head +'</h1><p>' + section.copy + '</p></div>'
							markup += '<div id="skillTiles" class="tiles two-col"></div></div></div>'
							break;
						case 'section 3':
							markup += '<div id="aboutMe" class="tileSection clearfix"><div class=floatHolder><div class="doubleCol doubleImage"><img src=' + section.images + '></img></div><div class="singleCol about-me"><h1>' + section.head +'</h1><p>' + section.copy + '</p></div></div></div>'
							break;
					}
				});
				break;
			case ('caseStudy'):
				$.each(item.main, function (index, section){
					switch (index){
						case 'hero':
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
							markup += '<div class="tileSection skill-copy clearfix"><div class="doubleCol"><h1>' + section.head + '</h1>' + '<p>' + section.copy + '</p></div></div>'
							break;
							
						case 'thumbnailImages':
							markup += '<div class="tileSection clearfix"><div id="section-tiles" class="tiles three-col"></div></div>';
							break;
					}
				});
				break;
		}
		return markup;
	}
}

function validateEmail(email) {
	var re = /^(([^<>()[\]\\.,;:\s@\']+(\.[^<>()[\]\\.,;:\s@\']+)*)|(\'.+\'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email);
}
function validateText(text) {
	var re = /[a-zA-Z]/g;
	return re.test(text);
}

function cleanURL(url) {
	var exp = window.location.href.split(/^(([^:\/?#]+):)?(\/\/([^\/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?/);
	var url = exp[4] + exp[5];
	var splitUrl = url.split('/');
	trace (splitUrl);
	return splitUrl;
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