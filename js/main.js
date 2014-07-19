var fn = {

	content:null,
	myUrl: window.location.host,
	currentUrl:'',
	previousUrl:'',
	main: $('#main'),

	

	init: function(data) {
		fn.content = data;
		fn.linking();
	},

	checkURL:function(){
		fn.currentUrl = cleanURL();
		var pageToLoad;
		var modal = '';
		// trace('current url length is '+currentUrl.length);
		// trace(currentUrl);
		
		if (fn.currentUrl[1]){
			$.each(fn.content, function (index, section){
				var str = section.href.toString();
				if (fn.currentUrl[1] == (str) && str != 'home-page'){
					// trace(pageToLoad);
					if (fn.currentUrl[2]){
						// trace(fn.currentUrl[2]);
						$.each(section.main.thumbnailImages, function (index, section){
							str = section.href.toString().split('/');
							var subStr = str[1];
							if (fn.currentUrl[2] == subStr){
								modal = section;
								trace ('theres a winning modal, display it');
								// pageToLoad = [section, section, section.format];
								// $('.modal').removeClass('hide');
								return false;
							}
						});
						// check through section thumbnails and return modal yes
					}
					pageToLoad = [section, section.main.thumbnailImages,modal];
					return false;
				} else {
					pageToLoad = [fn.content.homePage, fn.content,''];		
				}
			});
		} else {
			pageToLoad = [fn.content.homePage, fn.content,''];
		}
		return pageToLoad;
	},

	updateContent:function(a,initialState){
		var $main = $("#main");
		var $a = a[0];
		var $b = a[1];
		var $modal = a[2];

		if(fn.currentUrl.length < 3 && initialState == 'initial'){
			$('body').fadeOut(0, function(){
				$main.empty().append(fn.loadMarkup($a));
				// $('body').removeClass('hide');
				$('body').fadeIn(250)
				$('body').ScrollTo();
				fn.loadWork($b);
			});
		} else if (fn.currentUrl.length == 3 && initialState == 'initial'){
			$('body').fadeOut(0, function(){
				$main.empty().append(fn.loadMarkup($a));
				// $('body').removeClass('hide');
				$('body').fadeIn(250);
				$('body').ScrollTo();
				fn.loadWork($b);
				trace($modal);
				//load the required modal
				showModal($modal);
				// $('.modal').removeClass('hide');
			});
		};

		if (initialState != 'initial' && fn.previousUrl.length < 3 && fn.currentUrl.length < 3){
			$main.fadeOut(250, function(){
				$main.empty().append(fn.loadMarkup($a)).fadeIn(250);
				$('body').ScrollTo();
				fn.loadWork($b);
			});
		} else if (initialState != 'initial' && fn.currentUrl.length == 3){
			trace('modal to fade in');
			showModal();
		}

		if (fn.previousUrl.length == 3) {
			$('.modal').removeClass('show');
			$('.modal').empty()
		}

		function showModal(){
			
			$('.modal').append(fn.loadMarkup($modal));
			
			$('.modal').addClass('show');
			fn.addThis($modal);
			
			// $('body').addClass('open-modal');
			
		}
		fn.previousUrl = cleanURL(window.location.href);
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

			fn.updateContent(fn.checkURL(),'initial');
		} else {
			return false;
		}

		History.Adapter.bind(window, 'statechange', function(){
			fn.updateContent(fn.checkURL(),'');
		});

	    $(document).on("click", ".tile", function(e) {
	    	// this will have to be different for the type of tile
	    	var $a = $(this).data('content');
	    	e.preventDefault();
	    	History.pushState('', '', $a.href);
	    });
	    $(document).on("click", ".modal", function(e){
	    	trace('click');
	    	e.preventDefault();
	    	var closeLocation = (cleanURL(window.location.href));
	    	var newUrl ='/'+closeLocation[1];
	    	History.pushState('', '', newUrl);
	    	// History.back();
	    });
	    $(document).on("click", ".modal-content", function(e){
	    	e.stopPropagation();
	    });
	},

	// <--?end-->
	loadWork:function(data) {
		var toLoad;
		trace(data);
		for(var i in data) {
			// trace(i);
			toLoad = data[i];
			// trace(toLoad);
			
			if (toLoad.thumb){
				addTile(toLoad.head, toLoad, toLoad.format);
			}
		}

		function addTile(name, content, addTo) {
			$thumb = $('<img>').addClass('img').attr('src', content.thumb);
			
			$figCaption = $('<figcaption>').addClass(name);

			$span = $('<span>').html(name);

			$figCaption.append($span);

			$figure = $('<figure>').append($thumb,$figCaption);;

			$tile = $('<div>').addClass('tile').data('content',content).append($figure);
			// trace(addTo);	
			switch (addTo) {
				case 'project':
					$tile.addClass('three-col');
					$('#projectTiles').append($tile);
					break;
				case 'skill':
					$tile.addClass('two-col');
					$('#skillTiles').append($tile);
					break;
				case 'modal':
					$tile.addClass('three-col');
					$('#section-tiles').append($tile);
					break;
			}
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
			case 'caseStudy':
				$.each(item.main, function (index, section){
					switch (index){
						case 'hero':
							markup += '<div class="tileSection"><div class="doubleCol"><h1>' + section.head + '</h1>' + '<p>' + section.copy + '</p></div></div>'
							break;
						case 'section 1':
							// append copy to markup
							markup += '<div class="sectionHolder"><div class="tileSection"><div class="singleCol"><h1>' + section.head +'</h1><p>' + section.copy + '</p></div></div></div>';
							break;
						// case "section 2":
						// 	break;
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
				markup += '<div class="modal-content"><div class="tileSection clearfix"><div class="doubleCol"><h1>' + item.head + '</h1><h2>created for <a target="_blank" href='+item.subHeadLink+'>' + item.subHead + '</a></h2><p>' + item.copy + '</p></div>'
				markup += '<div class="addthis_toolbox addthis_32x32_style"><a class="addthis_button_facebook social-btn" style="cursor:pointer"></a><a class="addthis_button_twitter social-btn" style="cursor:pointer"></a><a class="addthis_button_linkedin social-btn" style="cursor:pointer"></a><a class="addthis_button_pinterest_share social-btn" style="cursor:pointer"></a><a class="addthis_button_email social-btn" style="cursor:pointer"></a></div></div>';
				// trace(item.images);
				if (item.images.length > 0){
					trace(item.images);
					markup += '<div class="modal-images">'
					$.each(item.images, function(index,image){
						trace(image);
						markup += '<img src=' + image + '></img>'
					})
					markup += '</div>'
				}

				markup += '</div>';
				break;
		}
		return markup;
	},

	loadModalContent: function(item) {

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
	// trace (splitUrl);
	return splitUrl;
}


/* = = =  Prevent console.log in IE8  = = = */
function trace(s) {
if ('console' in self && 'log' in console) console.log(s); 
};


//Ready function, load content
$(document).ready(function () {

		//needs a timer


	    addthis.init(); //callback function for script loading
		$.getJSON('content.json', fn.init);


		// $('.tile').hide();
		

		// 	setTimeout(function(){
		// 		//show one at a time at random scale from 0 to
		// 		$('.tile').show();
		// 	},500);
});