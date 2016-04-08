(function( $ ) {
	var def = {
    	degFrom:-25,
    	degTo:15,
    }

	var randNum = function (a, b) {
        return (Math.random() * (b - a + 1)) + a;
    }

    var getPrefix = function(){
    	var userAgent = window.navigator.userAgent.toLowerCase();
    	if(userAgent.indexOf("msie") != -1){
    		return "-ms-";
    	}else if(userAgent.indexOf("chrome") != -1 || userAgent.indexOf("safari") != -1){
    		return "-webkit-"
    	}else if(userAgent.indexOf("firefox") != -1){
    		return "-moz-";
    	}else if(userAgent.indexOf("opera") != -1){
    		return "-o-";
    	}else{
    		return "";
    	}
    }

    var numImgs = 0;
	// opt to specify order
	// opt = -1, photos arranged in reverse order
	// default/any other value, photos in the original order of html tags
    $.fn.makePhotostack = function(opt) {
		var children = $(this).children();
		var browser = getPrefix();
		numImgs = children.length;
		if (opt !== -1) {
			var zIndex = 0;
			var id = 0;
			children.each(function() {
				var child = $(this);
				var rand = randNum(def.degFrom,def.degTo);
				child.css(browser + "transform","rotate("+rand+"deg)");
				child.css("z-index",zIndex);
				child.attr("id",id);
				zIndex++;
				id++;
			});
		} else {
			var zIndex = children.length;
			var id = 0;
			children.each(function() {
				var child = $(this);
				var rand = randNum(def.degFrom,def.degTo);
				child.css(browser + "transform","rotate("+rand+"deg)");
				child.css("z-index",zIndex);
				child.attr("id",id);
				zIndex--;
				id++;
			});
		}
		return $(this) 		 
    };


    $.fn.scatterPhoto = function(opt) {
    	var children = $(this).children();
    	children.each(function() {
    		var child = $(this).children();
    		var rand = randNum(25,29);
    		if (rand < 26) {
    			child.css("left",-100*rand);
    			child.css("top",-100*rand);
    		} else if (rand >= 26 && rand < 27) {
    			child.css("left",-100*rand);
    			child.css("bottom",-100*rand);
    		} else if (rand >= 27 && rand < 28) {
    			child.css("right",-100*rand);
    			child.css("top",-100*rand);
    		} else if (rand >= 28) {
    			child.css("right",-100*rand);
    			child.css("bottom",-100*rand);
    		}
    	});
    	return $(this);
    }

   	var sequence = 0;
    $.fn.animateIn = function() {
    	var position = {top:0,left:0};
    	var next = "#" + sequence;
    	var prev = "#" + (sequence-1);
    	var finished = true
        if (!finished) {
            return;
        }
        finished = false;
		$(next).children()
		.animate(position,300)
        .queue(function(next){
            finished = true;
            next();
        });
		sequence++;
    }

    // return the top most image
    $.fn.topMostImg = function() {
    	var id = numImgs - 1;
    	id = "#" + id;
    	return $(id).children();
    }

    // If click on the top most image, all images animated out of window
    // opt for callback function
    $.fn.animateOut = function(opt) {
    	var children = $('.photostack').children();
    	var position = [];
    	for (var i = 0; i < numImgs; i++) {
    		var rand = randNum(25,29);
    		if (rand < 26) {
    			position.push({"left":-3000*rand,"top":-3000*rand});
    		} else if (rand >= 26 && rand < 27) {
    			position.push({"left":-3000*rand,"bottom":-3000*rand});
    		} else if (rand >= 27 && rand < 28) {
    			position.push({"right":-3000*rand,"top":-3000*rand});
    		} else if (rand >= 28) {
    			position.push({"right":-3000*rand,"bottom":-3000*rand});
    		}
    	}
    	i = 0;
    	children.each(function() {
			$(this).animate(position[i], 1800)
            .queue(function(next){
                next()
            }).animate({opacity:0},300)
            .queue(function(next){
                next();
            });
    		i++
			// $(this).children().animate(position, 800);
		}) // end children.each()
        opt();
    }

    $.fn.swapPhoto = function() {
    	var children = $(this).children();
    	children.each(function() {
		var max = 0;
		$(this).click(function(e) {
			// increment everyone's z-index
			children.each(function() {
				var zIndex = parseInt($(this).css("z-index"));
				zIndex++;
				$(this).css("z-index",zIndex);
				if (zIndex > max) max = zIndex;
			});
			// filter out the one being pushed to the bottom
			var pushChild = children.filter(function() {
				return $(this).css("z-index") == max;
			});
			pushChild.animate({
					opacity:0
				}, 10)
				.queue(function(next){
					pushChild.css("z-index",0);
					next();
				})
				.animate({opacity:1},10)
				.queue(function(next){
					next();
				});
			}) //end this.click
		}) // end children.each()
    }
 
}( jQuery ));