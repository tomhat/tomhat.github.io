(function(factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD. Register as an anonymous module.
		define(['jquery'], factory);
	} else {
		// Browser globals
		factory(jQuery);
	}
}(function($){
	var tooltipAPI = function tooltipAPI(target,options){
		this.options = options;
		this.target  = target;

		this.tooltip = (function generate(){
			var $target = $(target);
			var $body = $('body');
			var colorClass = options.colorClass;
			var arrowClass = options.arrowClass;
			var tooltip = $([
				"<span class='mlritz_tooltip'>",
					"<span class='mlritz_tooltip_body mlritz_tooltip_" + colorClass + " mlritz_tooltip_" + arrowClass + "'>",
						$target.attr('title'),
					"</span>",
				"</span>"
			].join("")).hide();
			$target.attr('title','');
			$body.append(tooltip);
			return tooltip;
		})();
		this.setupEvent();
		this.setupPosition();
		this.setupAPItoTarget();
	};
	tooltipAPI.prototype.setupEvent = function setupEvent(){
		var api = this;
		var $target = $(this.target);
		if( this.options.showAction.length > 0 && this.options.showAction != 'manual' ){
			$target.on(this.options.showAction,function(){
				api.show();
			});
		}
		if( this.options.hideAction.length > 0 && this.options.hideAction != 'manual' ){
			$target.on(this.options.hideAction,function(){
				api.hide();
			});
		}
		if( this.options.useClick ){
			this.tooltip.on('click',function(){
				api.hide();
			});
		}
		return this;
	};
	tooltipAPI.prototype.setupPosition = function setupPosition(){
		var pos = this.options.pos;
		var $target = $(this.target);
		var tgOffset = $target.offset();
		var tgSize = {
			width: $target.outerWidth(),
			height: $target.outerHeight()
		};
		var ttSize = {
			width: this.width(),
			height: this.height()
		};

		if( pos == 'tc' ){
			this.moveTo(tgOffset.top - ttSize.height,tgOffset.left + tgSize.width / 2 - ttSize.width / 2);
		}
		else if( pos == 'bc' ){
			this.moveTo(tgOffset.top + +tgSize.height + ttSize.height,tgOffset.left + tgSize.width / 2 - ttSize.width / 2);
		}
		else if( pos == 'bl' ){
			this.moveTo(tgOffset.top + +tgSize.height + ttSize.height + 10,tgOffset.left - 10);
		}
		else{
			//tl
			this.moveTo(tgOffset.top - ttSize.height,tgOffset.left - 10);//+ ttSize.width / 2 - ttSize.width / 2);
		}
	};
	tooltipAPI.prototype.setupAPItoTarget = function setupAPItoTarget(){
		var $target = $(this.target);
		$target.data(this.options.dataName,{tooltip:this});
	};
	tooltipAPI.prototype.moveTo = function moveTo(y,x){
		this.tooltip.css({
			top: y,
			left: x 
		});
	};
	tooltipAPI.prototype.show = function show(){
		if( this.tooltip ){
			this.tooltip.stop(true,false).fadeIn(500);
		}
		return this;
	};
	tooltipAPI.prototype.hide = function hide(){
		if( this.tooltip ){
			this.tooltip.stop(true,false).fadeOut(500);
		}
		return this;
	};
	tooltipAPI.prototype.destroy = function destroy(){
		if( this.tooltip ){
			$(this.target).off().removeData(this.options.dataName);
			this.tooltip.off().remove();
		}
	};
	tooltipAPI.prototype.update = function update(content){
		if( this.tooltip ){
			this.tooltip.children('span').text(content);
		}
		return this;
	};
	tooltipAPI.prototype.width = function width(){
		if( this.tooltip ){
			return this.tooltip.outerWidth();
		}
		return false;
	};
	tooltipAPI.prototype.height = function height(){
		if( this.tooltip ){
			return this.tooltip.outerHeight();
		}
		return false;
	};

	var defaults = {
		dataName:'mlritztip',
		showAction:'mouseenter.mlritztip',
		hideAction:'mouseleave.mlritztip',
		useClick:true,
		pos:'bc',
		colorClass: 'red',
		arrowClass: 'tl'
	};

	var methods = {
		init : function init(opts){
			$.fn.mlritzTip.options = $.extend({},defaults,opts);

			return this.each(function(){
				var options = $.fn.mlritzTip.options;
				var $target = $(this);
				if( !$target || $target.length == 0 ) return ;
				var data = $target.data(options.dataName);
				if( ! data ){
					new tooltipAPI(this,options);
				}
			});
		},
		destroy : function destroy(){
			return this.each(function(){
				var options = $.fn.mlritzTip.options;
				var $target = $(this);
				if( $target && $target.length && $target.data(options.dataName) ){
					$target.data(options.dataName).tooltip.destroy();
				}
			});
		},
		show : function show(){
			return this.each(function(){
				var options = $.fn.mlritzTip.options;
				var $target = $(this);
				if( $target && $target.length && $target.data(options.dataName) ){
					$target.data(options.dataName).tooltip.show();
				}
			});
		},
		hide : function hide(){
			return this.each(function(){
				var options = $.fn.mlritzTip.options;
				var $target = $(this);
				if( $target && $target.length && $target.data(options.dataName) ){
					$target.data(options.dataName).tooltip.hide();
				}
			});
		},
		update : function update( contents ){
			return this.each(function(){
				var options = $.fn.mlritzTip.options;
				var $target = $(this);
				if( $target && $target.length && $target.data(options.dataName) ){
					$target.data(options.dataName).tooltip.update(contents);

				}
			});
		}
	};

	// Plugin: Application Start Point 
	$.fn.mlritzTip = function(method){
		if( methods[method] ) {
			return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ) );
		}
		else if ( typeof method === 'object' || !method ){
			return methods.init.apply( this, arguments );
		}
		else{
			$.error( 'Method ' + method + ' does not exist on jQuery.mlritzTip' );
		}
	};
}));
