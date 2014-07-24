var fn = {

	content:null,
	hostUrl: 'localhost',
	currentUrl:'',
	previousUrl:'',
	main: $('#main'),

	init: function(data) {
		fn.content = data;
		fn.linking();
	},

	addThis:function(modal){
		var addthis_share =	{'url':window.location.href,'title':modal.head + ' by Frankly Nonsense','description':modal.copy};
		addthis.toolbox('.addthis_toolbox','',addthis_share);
	},

	// <--history.js-->
	linking:function(){
		var History = window.History;

		if (History.enabled){
			var State = History.getState(); // Note: We are using History.getState() instead of event.state 
			History.replaceState('', '', State.urlPath);

			fn.updateContent(fn.checkUrl(),'true');
		} else {
			return false;
		}

		History.Adapter.bind(window, 'statechange', function(){
			fn.updateContent(fn.checkUrl(),'');
		});

	    $(document).on("click", ".tile ", function(e) {
	    	// this will have to be different for the type of tile
	    	if(!$(this).hasClass('locked')){
	    		var $a = $(this).data('content');
		    	// trace($a);
		    	e.preventDefault();
		    	History.pushState('', '', $a.href);	
	    	} else {
	    		trace('this content is locked');
	    	}
	    	
	    });

	    $('.homeUrl').on("click", function() {
	    	History.pushState('', '', ' ');
	    });

	    $(document).on("click", ".close, .modal", function(e){

	    	e.preventDefault();
	    	var a = window.location.href;
	    	var b = a.lastIndexOf('/');
	    	var c = a.substring(b, a.length);
	    	var d = a.split(c).join('');
	    	var newUrl = d;
    		History.pushState('', '', newUrl);	
	    	
	    });
	    $(document).on("click", ".modal-content", function(e){
	    	e.stopPropagation();
	    });
	    $(document).on("click", ".banner", function(e){
	    	var $a = $(this).data('content');
	    	var $width = $(this).children([0]).width(); 
	    	var $height = $(this).children([0]).height();
	    	var $replace = $(this).find($('.replace-me'));
	    	$replace.flash({src:$a.swf, height:$height, width:$width});
	    });
	    $(document).on("click", "button", function(e){
	    	window.location.href = $(this).attr('href');
	    });
	    
	},
		// add check url and update content
	checkUrl:function(){
		fn.currentUrl = cleanURL(window.location.href);
		var markup = '';
		var tiles = '';
		var modal = '';

		var pageToLoad; // this is an object containing the information for update content
		trace(fn.currentUrl);
		if (fn.currentUrl[1] && fn.currentUrl[1] != 'home-page' && fn.currentUrl[1] != 'index'){
			$.each(fn.content, function (index, section){
				if (section.href == fn.currentUrl[1]){
					trace(section.href);
					if(section.format == 'modal'){
						modal = section;
						markup = fn.content.homePage;
						tiles = fn.content;
					} else if(section.format == 'skill'){
						markup = section;
						tiles = section.main.thumbnailImages;

							if (fn.currentUrl.length > 2){
								$.each(section.main.thumbnailImages, function (index, section){
									str = section.href.toString().split('/');
									subStr = str[str.length-1];
									if (fn.currentUrl[2] == subStr){
										modal = section;
										return false;
									}
							});	
						}
						
					}
					return false;
				}
				// else {
				// 	trace('404 page');
				// 	markup = section;
				// 	// tiles = '';	
				// 	return false;
				// }
			});
		} else {
			markup = fn.content.homePage;
			tiles = fn.content;
		}

		pageToLoad = [markup,tiles,modal];
		return pageToLoad; // always return object	
	},

	updateContent:function(toLoad,initialState){
		var $main = $('#main')
		var markup = toLoad[0];
		var tiles = toLoad[1];
		var modal = toLoad[2];

		// load page based on initial state

		if (initialState == 'true') {
			//check to see if this is the first load to show body
			$('body').fadeOut(0, function(){
				$main.empty().append(fn.loadMarkup(markup)).fadeIn(250);
				$('body').ScrollTo();
				
				if(tiles != ''){
					fn.loadWork(tiles);
					trace(tiles);	
				}

				$('body').removeClass('hide');
				$('body').fadeIn(250);
			});

		} else {

			if(modal != '' || $('.modal').hasClass('show')){
				
			} else{
				$main.fadeOut(250, function(){
					$main.empty().append(fn.loadMarkup(markup)).fadeIn(250);
					$('body').ScrollTo();
					fn.loadWork(tiles);
				});	
			}
			

		}

		// load the modal if there is one

		if (modal != ''){

			$('.modal').empty().append(fn.loadMarkup(modal)).fadeIn(250);
			fn.loadRichContent(modal);	
			fn.addThis(modal);
			$('.modal').addClass('show');
			$('.modal-content').ScrollTo();

		} else {

			$('.modal').removeClass('show');

			// show or hide back button
			if(fn.currentUrl[1] != '' && fn.currentUrl[1] != 'home-page'){
				$('.back-holder').removeClass('hide');
			} else if ($('.back-holder').hasClass('hide') != true){
				$('.back-holder').addClass('hide');
			}

		}

		
	},
	// <--?end-->
	loadWork:function(data) {
		var toLoad;
		for(var i in data) {
			toLoad = data[i];
			
			if (toLoad.thumb){
				addTile(toLoad.head, toLoad, toLoad.addTo);
				// trace(toLoad);
			}
		}


		function addTile(name, content, addTo) {

			$thumb = $('<img>').addClass('img').attr('src', content.thumb);
			
			$figCaption = $('<figcaption>').addClass(name);

			$span = $('<span>').html(name);

			$figCaption.append($span);

			$figure = $('<figure>').append($thumb,$figCaption);;

			$tile = $('<div>').addClass('tile').data('content',content).append($figure);

			if (content.special){
				trace(name);
				
				// this needs a way to update the dom
				// .attr('xlink:href', '/svg/svg-defs.svg#lock-icon')
				// $lockedIcon = $('<use>').addClass('lock-icon');
				// $locked = $('<svg>').addClass('icon').append($lockedIcon);

				// $('.socialLinks').append($locked);
				$tile.addClass('locked');

			}

			switch (addTo) {
				case 'project':
					$tile.addClass('three-col');
					$('#projectTiles').append($tile);
					break;
				case 'skill':
					$tile.addClass('two-col');
					$('#skillTiles').append($tile);
					break;
				case 'section':
					$tile.addClass('three-col');
					$('#section-tiles').append($tile);
					break;
			}
		}
		// trace($('.lock-icon'));
		// $('.lock-icon').setAttributeNS( 'http://www.w3.org/1999/xlink', 'href', '/svg/svg-defs.svg#lock-icon' );
	},

	loadRichContent: function(item){
		if (item.flash){
			$.each(item.flash, function(index,section){
				var myColours = ['#58c8f3','#e55c95','#eed652'];				
				$section = $('<div>').addClass('clearfix banner-holder ' + index);
				$.each(section, function(index,content){				
					var colour = randomColour(myColours);
					myColours = $.grep(myColours, function(n) {
					  return n != colour;
					});

					$img = $('<img>').addClass('replace-me').attr('src', content.backup);
					$flashBanner = $('<div>').addClass('banner').data('content',content).append($img);
					$container = $('<div>').addClass('block container ' + index).css('background-color', colour).append($flashBanner);
					$section.append($container);
				});
				$('#flash-work').append($section);
			});
		}
		if (item.video){
			var Height = 9*($('#video-work').width()/16);
			$.each(item.video, function(index,section){
				$vimeoVid = $('<iframe>').addClass('vimeoVid').attr('src',section.src).css('height', Height);
			});
			$('#video-work').append($vimeoVid);

			$( window ).resize(function() {
				Height = 9*($('#video-work').width()/16);
			  $('.vimeoVid').css('height', Height);
			});
		}
	},
	
	
// >>>>>>>>>>>>> formatting for pages <<<<<<<<<<<<<<<<

	loadMarkup: function(item) {
		var markup ='';
		switch (item.format){
			case 'homePage':
				$.each(item.main, function (index, section){
					switch (index){
						case 'hero':
							// $image = $('<div>').addClass('hero-image').css('background-image', 'url("' + section.image + '")');
							//for now this will do need to add hero image in to markup
							markup += '<div class="hero-image"></div>';
							break;
						case 'section 1':
							markup += '<div id="projectSection" class="tileSection clearfix"><div class="doubleCol"><h1>' + section.head +'</h1><p>' + section.copy + '</p></div>'
							markup += '<div id="projectTiles" class="tileSection skill-copy tiles three-col"></div></div>'
							break;
						case 'section 2':
							markup += '<div class="sectionHolder"><div id="skillSection" class="tileSection clearfix"><div class="singleCol"><h1>' + section.head +'</h1><p>' + section.copy + '</p></div>'
							markup += '<div id="skillTiles" class="tiles two-col"></div></div></div>'
							break;
						case 'section 3':
							markup += '<div id="aboutMe" class="tileSection clearfix"><div class="doubleCol doubleImage"><img src=' + section.images + '></img></div><div class="singleCol about-me"><h1>' + section.head +'</h1><p>' + section.copy + '</p></div>'
							markup += '<button class="email" href="mailto:alex@franklynonsense.com?subject=Your site is frankly nonsense! I wanted to say hello because..."><h1>send me an email</h1></button></div></div>'
							break;
					}
				});
				break;
			case 'project':

				$.each(item.main, function (index, section){
					switch (index){
						case 'hero':
							markup += '<div class="tileSection skill-copy clearfix"><div class="doubleCol"><h1>' + section.head + '</h1>' + '<p>' + section.copy + '</p></div></div>'
							break;
							
						case 'thumbnailImages':
							markup += '<div class="tileSection clearfix"><div id="section-tiles" class="tiles three-col"></div></div>';
							// markup += '<div class="modal hide"></div>';
							break;
					}
				});
				break;
			case 'skill':
				$.each(item.main, function (index, section){
					switch (index){
						case 'hero':
							markup += '<div class="tileSection skill-copy clearfix"><div class="doubleCol"><h1>' + section.head + '</h1>' + '<p>' + section.copy + '</p></div></div>'
							break;
							
						case 'thumbnailImages':
							markup += '<div class="tileSection clearfix"><div id="section-tiles" class="tiles three-col"></div></div>';
							// markup += '<div class="modal hide"></div>';
							break;
					}
				});
				break;
			case 'modal':
				markup += '<div class="modal-content"><h1 class="close">&times</h1><div class="tileSection clearfix"><div class="doubleCol"><h1>' + item.head + '</h1><h2>created for <a target="_blank" href='+item.subHeadLink+'>' + item.subHead + '</a></h2><p>' + item.copy + '</p></div>'
				markup += '<div class="addthis_toolbox addthis_32x32_style"><a class="addthis_button_facebook social-btn" style="cursor:pointer"></a><a class="addthis_button_twitter social-btn" style="cursor:pointer"></a><a class="addthis_button_linkedin social-btn" style="cursor:pointer"></a><a class="addthis_button_tumblr social-btn" style="cursor:pointer"></a><a class="addthis_button_pinterest_share social-btn" style="cursor:pointer"></a></div></div>';
				if (item.images.length > 0){
					markup += '<div class="modal-images">'
					$.each(item.images, function(index,image){
						markup += '<img src=' + image + '></img>'
					})
					markup += '</div>'
				}

				if (item.flash){
					markup += '<div id="flash-work"></div>';
				}
				if (item.video){
					markup += '<div id="video-work"></div>';
				}
				markup += '</div>';
				break;
			case '404':
			trace('loading 404');
				markup += '<div class="tileSection skill-copy clearfix"><div class="doubleCol"><h1>' + section.head + '</h1>' + '<p>' + section.copy + '</p></div></div>'
		}
		return markup;
	},
}

function validateEmail(email) {
	var re = /^(([^<>()[\]\\.,;:\s@\']+(\.[^<>()[\]\\.,;:\s@\']+)*)|(\'.+\'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email);
}
function validateText(text) {
	var re = /[a-zA-Z]/g;
	return re.test(text);
}

function cleanURL(a) {
	var exp = a.split(/^(([^:\/?#]+):)?(\/\/([^\/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?/);
	var url = exp[4] + exp[5];
	var b = url.split(fn.hostUrl).join('');
	var splitUrl = b.split('/');

	return splitUrl;
}

function randomColour(colours){
	
	return colours[Math.floor(Math.random() * colours.length)];
}


/* = = =  Prevent console.log in IE8  = = = */
function trace(s) {
if ('console' in self && 'log' in console) console.log(s); 
};


//Ready function, load content
$(document).ready(function () {
	    addthis.init(); //callback function for script loading
		$.getJSON('content.json', fn.init);
});