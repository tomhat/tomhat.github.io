(function(factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD. Register as an anonymous module.
		define(['jquery'], factory);
	} else {
		// Browser globals
		factory(jQuery);
	}
}(function( $ ) {
	$.fn.mlritz_get = function(){
		return $.Mlritz.util.get($(this));
	};
	$.fn.mlritz_set = function(value){
		$.Mlritz.util.set($(this),value);
		return this;
	};
	$.Mlritz = {};
	$.Mlritz.util = {};
	$.Mlritz.util.exjoin = function(sep,val){
		return $.isArray(val)? val.join('|'):val;
	};
	$.Mlritz.util.exsplit = function(sep,val){
		return $.isArray(val)? val:val.split('|');
	};
	$.Mlritz.util.get = function(target){
		if( target.length == 0 ){
			console.log('NotFoundItem:'+target.selector);
			return '';
		}
		switch( target.get(0).tagName ){
			case 'INPUT':
				switch(target.attr('type')){
					case 'email':
						/* falls through */
					case 'number':
						/* falls through */
					case 'search':
						/* falls through */
					case 'tel':
						/* falls through */
					case 'url':
						/* falls through */
					case 'text':
						/* falls through */
					case 'password':
						return target.val();
					case 'radio':
						var v = '';
						target.each(function(){
							if( $(this).is(":checked") ){
								v = $(this).val();
								return ;
							}
						});
						return v;
					case 'checkbox':
						return (function(target){
							var vList = [];
							target.each(function(){
								var cur = $(this);
								if( cur.is(":checked") ) vList.push(cur.val());
							});
							return vList;
						}).call(this,target);
					default:
						console.log('Unkonwn:Type:'+target.attr('type'));
						break;	
				}
				break;
			case 'SELECT':
				if( target.prop('multiple') ){
					return (function(target){
						var vList = [];
						target.children('option:selected').each(function(){
							var cur = $(this);
							if( cur.is(":selected") ){
								if(cur.val().length > 0){
									v = cur.val();
									if( v.length > 0 ) vList.push(v);
								}
							}
						});
						return vList;
					}).call(this,target);
				}else{
					return target.val();
				}
			case 'TEXTAREA':
				return target.val();
			default:
				console.log('Unkonwn:tagName:'+target.get(0).tagName);
				break;	
		}
	};
	$.Mlritz.util.set = function(target,value){
		if( target.length == 0 ){
			console.log('NotFoundItem:'+target.selector);
			return false;
		}
		switch( target.get(0).tagName ){
			case 'INPUT':
				switch(target.attr('type')){
					case 'radio':
						/* falls through */
					case 'checkbox':
						if( !$.isArray(value) ){
							value = [value];
						}
						/* falls through */
					case 'email':
						/* falls through */
					case 'number':
						/* falls through */
					case 'search':
						/* falls through */
					case 'tel':
						/* falls through */
					case 'url':
						/* falls through */
					case 'text':
						/* falls through */
					case 'password':
						target.val(value);
						break;
					default:
						console.log('Unkonwn:Type:'+target.attr('type'));
						break;	
				}
				break;
			case 'SELECT':
				return target.val(value);
			case 'TEXTAREA':
				return target.val(value);
			default:
				console.log('Unkonwn:tagName:'+target.get(0).tagName);
				break;	
		}
		return true;
	};
	$.Mlritz.util.genDate = function(dateStr,normalize){
		if( normalize === undefined ) normalize = true;
		if( $.isArray(dateStr) ){
			var y = ( dateStr[0] )? dateStr[0]:1990;
			var m = ( dateStr[1] )? dateStr[1]:1;
			var d = ( dateStr[2] )? dateStr[2]:1;
			var hh = ( dateStr[3] )? dateStr[3]:0;
			var mm = ( dateStr[4] )? dateStr[4]:0;
			var ss = ( dateStr[5] )? dateStr[5]:0;
			dateStr = y + '/' + m + '/' + d + ' ' + hh + ':' + mm + ':' + ss;
		}else{
			return $.Mlritz.util.genDate(dateStr.split(/-|\//),normalize);
		}
		var date = new Date(dateStr);
		if (Object.prototype.toString.call(date) !== "[object Date]") return null;
		if( isNaN(date.getTime()) ) return null;
		if( normalize ) return date;
		var dateReg = /^(\d{4}|\d{2})(?:\x2d|\u002f)(\d{2}|\d)(?:\x2d|\u002f)(\d{2}|\d)/;
		var timeReg = /(\d{2}|\d{1}):(\d{2}|\d{1}):(\d{2}|\d{1})$/;
		var timeReg2 = /(\d{2}|\d{1}):(\d{2}|\d{1})$/;
		var dateList = dateStr.match(dateReg);
		var timeList = dateStr.match(timeReg);
		if( !dateList ) return null;
		if( !timeList ){
			timeList = dateStr.match(timeReg2);
		}
		if( !timeList ){
			timeList = ['','00','00','00'];
		}else if( timeList.length < 4 ){
			switch(timeList.length){
				case 2:
					timeList.push('00');
					/* falls through */
				case 3:
					timeList.push('00');
					break;
			}
		}
		if( 
			(
				(date.getFullYear() - 0) + (date.getMonth() - 0) + (date.getDate() - 0)
				+
				(date.getHours() - 0) + (date.getMinutes() - 0) + (date.getSeconds() - 0)
			)
			==
			(
				(dateList[1] - 0) + (dateList[2] - 1) + (dateList[3] - 0)
				+
				(timeList[1] - 0) + (timeList[2] - 0) + (timeList[3] - 0)
			)

		){
			return date;
		}
		return null;
	};
	$.Mlritz.util.genDateNow = function(){
		return new Date();
	};
	$.Mlritz.util.genDateToday = function(){
		var now = new Date();
		now.setHours(0);
		now.setMinutes(0);
		now.setSeconds(0);
		return now;
	};
	$.Mlritz.util.dateFormat = function(date,format){
		if(!format){
			format = 'YYYY/MM/DD';
		}
		var div = '/';
		var dtDiv = ' ';
		var dList = [];
		var tList = [];
		switch(format){
			case 'YYYYMMDDhhmm':
				div = '';
				dtDiv = '';
				/* falls through */
			case 'YYYY/MM/DD hh:mm':
				dList.push(date.getFullYear(),('0'+(date.getMonth()+1)).slice(-2),('0'+date.getDate()).slice(-2));
				tList.push(('0'+date.getHours()).slice(-2),('0'+date.getMinutes()).slice(-2));
				break;

			case 'YYYYMMDDhhmmss':
				div = '';
				dtDiv = '';
				/* falls through */
			case 'YYYY/MM/DD hh:mm:ss':
				dList.push(date.getFullYear(),('0'+(date.getMonth()+1)).slice(-2),('0'+date.getDate()).slice(-2));
				tList.push(('0'+date.getHours()).slice(-2),('0'+date.getMinutes()).slice(-2),('0'+date.getSeconds()).slice(-2));
				break;

			case 'YYYY-MM-DD':
				div = '-';
				dList.push(date.getFullYear(),('0'+(date.getMonth()+1)).slice(-2),('0'+date.getDate()).slice(-2));
				break;

			case 'YYYYMM':
				div = '';
				/* falls through */
			case 'YYYY/MM':
				dList.push(date.getFullYear(),('0'+(date.getMonth()+1)).slice(-2));
				break;

			case 'YYYYMMDD':
				div = '';
				/* falls through */
			default:
				/* falls through */
			case 'YYYY/MM/DD':
				dList.push(date.getFullYear(),('0'+(date.getMonth()+1)).slice(-2),('0'+date.getDate()).slice(-2));
				break;
		}
		var dstr = dList.join(div);
		if( tList.length ){
			dstr += dtDiv + tList.join(':');
		}
		return dstr;
	};
	$.Mlritz.util.isKishuIzon = function(text){
		var reg = "[①②③④⑤⑥⑦⑧⑨⑩⑪⑫⑬⑭⑮⑯⑰⑱⑲⑳ⅠⅡⅢⅣⅤⅥⅦⅧⅨⅩ㍉㌔㌢㍍㌘㌧㌃㌶㍑㍗㌍㌦㌣㌫㍊㌻㎜㎝㎞㎎㎏㏄㎡㍻〝〟№㏍℡㊤㊥㊦㊧㊨㈱㈲㈹㍾㍽㍼]";
		return (text.match(reg)==null)? false:true;
	};
	$.Mlritz.util.cnvKishuIzon = function(text){
		if( !$.Mlritz.util.isKishuIzon(text) ) return text;
		var izon_char = [
			'①','②','③','④','⑤','⑥','⑦','⑧','⑨','⑩','⑪','⑫','⑬','⑭','⑮','⑯','⑰','⑱','⑲','⑳','Ⅰ','Ⅱ','Ⅲ','Ⅳ','Ⅴ','Ⅵ','Ⅶ','Ⅷ','Ⅸ','Ⅹ',
			'㍉','㌔','㌢','㍍','㌘','㌧','㌃','㌶','㍑','㍗','㌍','㌦','㌣','㌫','㍊','㌻','㎜','㎝','㎞','㎎','㎏','㏄','㎡','㍻',
			'〝','〟','№','㏍','℡','㊤','㊥','㊦','㊧','㊨','㈱','㈲','㈹','㍾','㍽','㍼',
		];
		var cnv_char = [
			'(1)','(2)','(3)','(4)','(5)','(6)','(7)','(8)','(9)','(10)','(11)','(12)','(13)','(14)','(15)','(16)','(17)','(18)','(19)','(20)','I','II','III','IV','V','VI','VII','VIII','IX','X',
			'ﾐﾘ','ｷﾛ','ｾﾝﾁ','ﾒｰﾄﾙ','ｸﾞﾗﾑ','ﾄﾝ','ｱｰﾙ','ﾍｸﾀｰﾙ','ﾘｯﾄﾙ','ﾜｯﾄ','ｶﾛﾘｰ','ﾄﾞﾙ','ｾﾝﾄ','ﾊﾟｰｾﾝﾄ','ﾐﾘﾊﾞｰﾙ','ﾍﾟｰｼﾞ','mm','cm','km','mg','kg','cc','平方ﾒｰﾄﾙ','平成',
			'「','」','No.','K.K.','TEL','(上)','(中)','(下)','(左)','(右)','(株)','(有)','(代)','明治','大正','昭和',
		];
		for(var i=0; i<=izon_char.length;i++){
			text = text.replace( izon_char[i], cnv_char[i], 'mg' );
		}
		return text;
	};
	$.Mlritz.util.cnvZenToHan = function(text){
		var retVal = text.replace(/[！-～]/g,
			function( text ) {
				return String.fromCharCode( text.charCodeAt(0) - 0xFEE0 );
			}
		);
		return retVal.replace(/”/g, "\"")
			.replace(/’/g, "'")
			.replace(/‘/g, "`")
			.replace(/￥/g, "\\")
			.replace(/　/g, " ")
			.replace(/〜/g, "~")
			.replace(/−/g, "-")
			;
	};
}));
