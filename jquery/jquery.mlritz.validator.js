(function(factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD. Register as an anonymous module.
		define(['jquery'], factory);
	} else {
		// Browser globals
		factory(jQuery);
	}
}(function( $ ) {
	var validateFuncList = {
		'required':function(val,opt){
			if( !opt || ($.isArray(opt) && opt.length == 0) ){
				return ( val && val.length > 0 )? true:false;
			}else if( $.isArray(opt) && opt.length > 0 ){
				var name = opt[0].match(/^name:(.*)$/);
				if( name && name[1] ){
					var el = $('[name="' + name[1] + '"]');
					if( el.length > 0 ){
						if( opt[1] ){
							if( !$.isArray(opt[1]) ){
								opt[1] = [opt[1]];
							}
							if( $.inArray(el.mlritz_get(),opt[1]) >= 0 ){
								return validateFuncList['required'](val,opt.slice(2));
							}
						}
					}
				}else{
					name = opt[0].match(/^ng:$/);
					if( name && name[0] && opt[1] ){
						if( val == opt[1] ){
							return false;
						}
					}
				}
			}
			return true;
		},
		'length':function(val,opt){
			if( !val || val.length == 0 ) return true;
			if( opt[0] && opt[1] ){
				//opt[0] => min
				//opt[1] => max
				return (
					opt[0] <= val.length
					&&
					val.length <= opt[1]
				);
			}else if( opt[0] ){
				//opt[0] => max
				return (
					val.length <= opt[0]
				);
			}
			return val;
		},
		'range':function(val,opt){
			if( !val || val.length == 0 ) return true;
			if( opt.length == 2 ){
				//opt[0] => min
				//opt[1] => max
				return (
					opt[0] <= (val + 0)
					&&
					val <= opt[1]
				);
			}else if( opt.length == 1 ){
				//opt[0] => max
				return (
					(val + 0)<= opt[0]
				);
			}
			return val;
		},
		'count':function(val,opt){
			if( !val || val.length == 0 ) return true;
			var orgval = val;
			if( !$.isArray(val) ){
				val = [val];
			}
			if( opt[0] && opt[1] ){
				//opt[0] => min
				//opt[1] => max
				return (
					opt[0] <= val.length
					&&
					val.length <= opt[1]
				);
			}else if( opt[0] ){
				//opt[0] => max
				return (
					val.length <= opt[0]
				);
			}
			return orgval;
		},
		'regexp_match':function(val,opt){
			if( !val || val.length == 0 ) return true;
			if( !opt[0] ) return true;
			return val.match(opt[0])? true:false;
		},
		'email':function(val,opt){
			if( !val || val.length == 0 ) return true;
			var mail_regex1 = new RegExp( '(?:[-!#-\'*+/-9=?A-Z^-~]+\.?(?:\.[-!#-\'*+/-9=?A-Z^-~]+)*|"(?:[!#-\[\]-~]|\\\\[\x09 -~])*")@[-!#-\'*+/-9=?A-Z^-~]+(?:\.[-!#-\'*+/-9=?A-Z^-~]+)*' );
			var mail_regex2 = new RegExp( '^[^\@]+\@[^\@]+$' );
			if( val.match( mail_regex1 ) && val.match( mail_regex2 ) ) {
				// JPcode check
				if( val.match( /[^a-zA-Z0-9\!\"\#\$\%\&\'\(\)\=\~\|\-\^\\\@\[\;\:\]\,\.\/\\\<\>\?\_\`\{\+\*\} ]/ ) ) { return false; }
				// domain check
				if( !val.match( /\.[a-z]+$/ ) ) { return false; }
				return true;
			} else {
				return false;
			}
		},
		'date':function(val,opt){
			if( !val || val.length == 0 ) return true;
			return ( $.Mlritz.util.genDate(val,false) === null )? false:true;
		},
		'date_future':function(val,opt){
			if( !val || val.length == 0 ) return true;
			if( !opt[0] ) return true;
			var util = $.Mlritz.util;
			opt[0] = getDateOpt(opt[0]);
			var cur = util.genDate(val);
			var tgt = util.genDate(opt[0]);
			if( !tgt || !cur ) return true;
			return (cur > tgt);
		},
		'date_reward':function(val,opt){
			if( !val || val.length == 0 ) return true;
			if( !opt[0] ) return true;
			opt[0] = getDateOpt(opt[0]);

			var util = $.Mlritz.util;
			var cur = util.genDate(val);
			var tgt = util.genDate(opt[0]);

			if( !tgt || !cur ) return true;

			return (cur == tgt);
		},
		'chkizon':function(val,opt){
			if( !val || val.length == 0 ) return true;
			return (!$.Mlritz.util.isKishuIzon(val));
		},
		'regexp_replace':function(val,opt){
			if( !val || val.length == 0 ) return true;
			if( !opt[0] || !opt[1] ) return true;
			return val.replace(opt[0],opt[1]);
		},
		'trimsp':function(val){
			if( val.length > 0 ){
				return val.replace(/^\s+|\s+$/g,'');
			}
			return val;
		},
		'cnvizon':function(val){
			if( val.length > 0 ){
				return $.Mlritz.util.cnvKishuIzon(val);
			}
			return val;
		},
		'cnvzentohan':function(val){
			if( val.length > 0 ){
				return $.Mlritz.util.cnvZenToHan(val);
			}
			return val;
		}
	};
	var validateMsgList = {
		'##default##':{
			'required':function(res){
				return '必須項目です';
			},
			'length':function(res){
				var msg = '';
				if( $.isArray(res[1]) ){
					if( res[1][0] && res[1][1] ){
						if( res[1][0] == res[1][1] ){
							msg = res[1][0]+'文字';
						}else{
							msg = res[1][0]+'文字以上'+res[1][1]+'文字以内';
						}
					}else{
						msg = res[1][0]+'文字以内';
					}
				}else{
					msg = res[1]+'文字以内';
				}
				return msg;
			},
			'range':function(res){
				var msg = '';
				if( $.isArray(res[1]) ){
					if( res[1].length == 2 ){
						if( res[1][0] == res[1][1] ){
							msg = res[1][0]+'のみ';
						}else{
							msg = res[1][0]+'以上'+res[1][1]+'以下の数字';
						}
					}else{
						msg = res[1][0]+'以下の数字';
					}
				}else{
					msg = res[1]+'以下の数字';
				}
				return msg;
			},
			'count':function(res){
				var msg = '';
				if( $.isArray(res[1]) ){
					if( res[1][0] && res[1][1] ){
						if( res[1][0] == res[1][1] ){
							msg = res[1][0]+'個選択';
						}else{
							msg = res[1][0]+'個以上'+res[1][1]+'個以下選択';
						}
					}else{
						msg = res[1][0]+'個以下選択';
					}
				}else{
					msg = res[1]+'個以下選択';
				}
				return msg;
			},
			'email':function(res){
				return 'メールアドレスの書式に誤りがあります';
			},
			'regexp_match':function(res){
				return '入力条件にマッチしません';
			},
			'date':function(res){
				return '存在しない日付の可能性があります';
			},
			'date_future':function(res){
				var opt = [];
				if( res && res[1] && $.isArray(res[1]) ) opt = res[1];
				if( !opt[0] ){
					return '未来の日時を設定してください';
				}
				return opt[0]+'より未来の日時を指定してください';
			},
			'date_reward':function(res){
				var opt = [];
				if( res && res[1] && $.isArray(res[1]) ) opt = res[1];
				if( !opt[0] ){
					return '過去の日時を設定してください';
				}
				return opt[0]+'過去の日時を指定してください';
			},
			'date_same':function(res){
				var opt = [];
				if( res && res[1] && $.isArray(res[1]) ) opt = res[1];
				if( !opt[0] ){
					return '同じ日時を設定してください';
				}
				return opt[0]+'と同じ日時を指定してください';
			},
			'chkizon':function(res){
				return '機種依存文字が含まれています';
			}
		}
	};

	var getDateOpt = function(optStr){
		var util = $.Mlritz.util;
		if( optStr == 'today' ){
			optStr = ''+ util.dateFormat(util.genDateToday());
		}else if( optStr == 'now' ){
			optStr = ''+ util.dateFormat(util.genDateNow(),'YYYY/MM/DD hh:mm');
		}else{
			var mstr = optStr.match(/^name:(.*)$/);
			if( mstr ){
				var el = $('[name="' + mstr[1] + '"]');
				if( el.length > 0 ){
					optStr = el.mlritz_get();
				}
			}
		}
		return optStr;
	};

	$.Mlritz.validator = {};
	$.Mlritz.validator.validate = function(target,rule){
		if(!$.isPlainObject(target)){
			target = $('[name="'+target+'"]');
		}
		if( target.length == 0 ){
			console.log('NotFound:'+target.selector);
			return false;
		}
		var res = {};
		var val = $.Mlritz.util.get(target);
		var orgval = val;
		var validator = $.Mlritz.validator;
		for( var i = 0;i < rule.length;i++ ){
			var name = null;
			var opt = null;
			if( $.isArray(rule[i]) ){
				if( validator.isFunction(rule[i][0]) ){
					opt = rule[i].slice(1);
					name = rule[i][0];
				}
				else if(
					rule[i][1]
					&&
					validator.isFunction(rule[i][1])
				){
					opt = rule[i].slice(2);
					name = rule[i][1];
				}
			}
			else if( validator.isFunction(rule[i]) ){
				name = rule[i];
			}
			if( name ){
				var r = ( validator.getFunction(name) )(val,opt);
				if( $.isPlainObject(r) ){
					for( var key in r ){
						if( !r.hasOwnProperty(key) ) continue;
						if( r[key] !== true ){
							res[key] = r[key];
						}
					}
				}else{
					if( r === false ){
						res[name] = [false,opt];
					}else if( r !== true && r !== false ){
						val = r;
					}
				}
			}else{
				console.log('UnmachRule:'+rule[i]);
			}
		}
		if( orgval != val ){
			$.Mlritz.util.set(target,val);
		}
		if( Object.keys(res).length > 0 ){
			return res;
		}else{
			return true;
		}
	};
	$.Mlritz.validator.validateList = function(nameRuleHash){
		var validator = $.Mlritz.validator;
		var resList = {};
		for( var name in nameRuleHash ){
			if( !nameRuleHash.hasOwnProperty(name) ) continue;
			var res = validator.validate(name,nameRuleHash[name]);
			resList[name] = res;
		}
		return resList;
	};
	$.Mlritz.validator.addFunction = function(name,callback){
		if( $.isFunction(callback) ){
			validateFuncList[name] = callback;
		}
		return this;
	};
	$.Mlritz.validator.isFunction = function(name){
		return (
			($.isFunction(name))
			||
			( validateFuncList[name] && $.isFunction(validateFuncList[name]) )
		);
	};
	$.Mlritz.validator.getFunction = function(name){
		if( $.isFunction(name) ){
			return name;
		}
		if( validateFuncList[name] && $.isFunction(validateFuncList[name]) ){
			return validateFuncList[name];
		}
		return false;
	};
	$.Mlritz.validator.addMessage = function(name,callback,itemname){
		if( !itemname || itemname.length == 0 ){
			itemname = '##default##';
		}
		if( $.isFunction(callback) ){
			if( !validateMsgList[itemname] ){
				validateMsgList[itemname] = {};
			}
			validateMsgList[itemname][name] = callback;
		}
		return this;
	};
	$.Mlritz.validator.isMessage = function(name,itemname){
		if( !itemname || itemname.length == 0 ){
			itemname = '##default##';
		}
		var res = ( validateMsgList[itemname] && validateMsgList[itemname][name] && $.isFunction(validateMsgList[itemname][name]) );
		if( !res && itemname != '##default##' ){
			return $.Mlritz.validator.isMessage(name);
		}
		return res;
	};
	$.Mlritz.validator.getMessage = function(name,itemname){
		if( !itemname || itemname.length == 0 ){
			itemname = '##default##';
		}
		if( validateMsgList[itemname] && validateMsgList[itemname][name] && $.isFunction(validateMsgList[itemname][name]) ){
			return validateMsgList[itemname][name];
		}else if(itemname != '##default##'){
			return $.Mlritz.validator.getMessage(name);
		}
		return false;
	};
	$.Mlritz.validator.genMessageList = function(name,res){
		var msgList = [];
		var validator = $.Mlritz.validator;
		for( var key in res ){
			if( !res.hasOwnProperty(key) ) continue;
			if( validator.isMessage(key,name) ){
				var msg = (validator.getMessage(key,name))(res[key]);
				if( $.isArray(msg) ){
					msgList = msgList.concat(msg);
				}else if( msg.length > 0 ){
					msgList.push(msg);
				}
			}
		}
		return msgList;
	};
	$.Mlritz.validator.triggerEvent = function(name,res){
		var el = $('[name="'+ name + '"]');
		if( el.length == 0 ) return ;
		$(el).trigger(
			'mlritz_validated',
			[res,$.Mlritz.validator.genMessageList(name,res)]
		);
	};
	$.Mlritz.validator.notify = function(name,res,effectCallback){
		var validator = $.Mlritz.validator;
		if( $.isFunction(effectCallback) ){
			effectCallback(name,res);
		}else{
			( function(name,res){
				validator.notifyAction(
					name,//validator.findNotifyBGTarget(name),
					res
				);
			} )(name,res);
		}
		validator.triggerEvent(name,res);
		return this;
	};
	$.Mlritz.validator.notifyAction = function(name,res){
		var el = $('[name="'+ name + '"]:eq(0)');
		if( el.length == 0 ) return ;
		if( res === true ){
			el.addClass('valid_ok').removeClass('valid_ng');
		}else{
			el.addClass('valid_ng').removeClass('valid_ok');
		}
	};
	$.Mlritz.validator.notifyList = function(resList){
		for( var name in resList ){
			if( !resList.hasOwnProperty(name) ) continue;
			$.Mlritz.validator.notify(name,resList[name]);
		}
	};
	$.Mlritz.validator.isOK = function(resList){
		var ok = true;
		for(var name in resList){
			if( !resList.hasOwnProperty(name) ) continue;
			if( resList[name] === true ) continue;
			ok = false;
			break;
		}
		return ok;
	};
}));
