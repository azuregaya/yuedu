(function(){
	var searchText = '搜索资讯源、书籍';

	YD.msgInput('#topsearch','s-fc4',searchText);
	
	YD.Header = {};
	
	YD.Header.openYD = (function(){
		return {
			createBox : function(name){
				var openBoxHTML = '',openBox = $('<div id="openYD" class="m-open" style="display:none;"></div>');
					openBoxHTML += '<div class="inner">';
					openBoxHTML += '<h4>Hi，' + name +'，<em>轻松四步，随时随地阅读</em></h4>';
					openBoxHTML += '<a id="get-yd" class="yeap"></a>';
					openBoxHTML += '<a class="nope closeit j-pf">不，谢谢</a><a class="clbtn closeit"></a></div>';
				
					openBox.html(openBoxHTML);
					openBox.insertAfter($('.g-doc'));
					YD.Header.openYD.createMask();
					YD.openLayer('#openYD');
					YD.Header.testIE6.detect();
					
					$('.closeit').click(function(){
						$('#openYD').hide();
						$('.m-mask').hide();
					});
			},
			createMask : function(){
				var mask = $('<div class="m-mask" style="display:block;"></div>');
				mask.height($(document).height());
				mask.insertAfter($('.g-doc'));
				
			},
			createError : function(){
				var errorBox = $('<div id="eroTip" style="display:none;" class="m-layer m-layer-3"></div>');
				errorBox.html('\
					<div class="lytt yy"><h4></h4><a href="#" class="lyclose j-close">关闭</a></div>\
						<div class="lyct">\
							<div class="m-actip">\
								<h3>订阅出错！！！</h3>\
								<a href="#" class="btn j-close">我知道了</a>\
							</div>\
						</div>\
					<div class="lybt">\
						<button class="j-close">我知道了</button>\
					</div>\
				');
				
				errorBox.insertAfter($('.g-doc'));
				errorBox.css('z-index',10001);
				YD.openLayer('#eroTip');
			}
		};
	})();
	
	YD.Header.testIE6 = (function(){
		return {
			detect : function(){
				if(jQuery.browser.msie){
					if(jQuery.browser.version === '6.0'){
						jQuery('.m-tips').addClass('m-tips-1');
						/*
						jQuery.getScript('http://a.tbcdn.cn/apps/hitao/sys/pngfix.js',function(){
							DD_belatedPNG.fix('.png');
						});
						*/
						if(typeof DD_belatedPNG != 'undefined'){
							DD_belatedPNG.fix('.png');
						}
						
						
						$('#J_FIXED').css({'position':'absolute','top':57,'left':0});
						$(window).scroll(function(){
							$('#J_FIXED').css({'top': ($(document).scrollTop() + 57)});
						});
						$(window).resize(function(){
							$('#J_FIXED').css({'top': ($(document).scrollTop() + 57)});
						});
						
					}
				}
			}
		}
	})();
	
	var testEmpty = function(id){
		var tipBox = $('<div id="eptTip" style="display:none;" class="m-layer m-layer-3"></div>');
		tipBox.html('\
						<div class="lytt yy"><h4></h4><a href="#" class="lyclose j-close">关闭</a></div>\
						<div class="lyct">\
							<div class="m-actip">\
								<h3>搜索内容不能为空</h3>\
								<a href="#" class="btn j-close">我知道了</a>\
							</div>\
						</div>\
						<div class="lybt">\
							<button class="j-close">我知道了</button>\
						</div>');
		
		var txtIpt = $(id);
		$(txtIpt.prop('form')).bind('submit',function(e){
			var newStr = $.trim(txtIpt.val());
			if(newStr.length === 0 || newStr == searchText){
				e.preventDefault();
				tipBox.insertAfter($('.g-doc'));
				YD.openLayer('#eptTip');
			}
		});
	};
	
	
	var menuRollOverOut = function(btn,box){
		var btn = $(btn),fSec = $(box), onTarget = false;
		
		btn.mouseenter(function(){
			onTarget = true;
			fSec.toggleClass('f-dn');
			if(jQuery.browser.msie){
					if(jQuery.browser.version === '6.0'){
						if($('#J_Select').length != 0){
							$('#J_Select').hide();
						}
					}
			}
		});
		btn.mouseleave(function(){
			onTarget = false;
			var testTarget = setTimeout(function(){
				if(!onTarget){
					if(!fSec.hasClass('f-dn')) fSec.addClass('f-dn');
					if(jQuery.browser.msie){
						if(jQuery.browser.version === '6.0'){
							if($('#J_Select').length != 0){
								$('#J_Select').show();
							}
						}
					}
				}
			},500);
		});
		
		fSec.mouseenter(function(){
			onTarget = true;
		});
		fSec.mouseleave(function(){
			onTarget = false;
			fSec.toggleClass('f-dn');
			if(jQuery.browser.msie){
				if(jQuery.browser.version === '6.0'){
					if($('#J_Select').length != 0){
						$('#J_Select').show();
					}
				}
			}
		});
	};
	
	var cartNumber = function(){
		var icon = $('#J_CartNum'),num = $('#J_CartNum span');
		
		icon.mouseenter(function(){
			var url = $(this).attr('url');
			$.ajax({
				type: 'GET',
				url: url,
				dataType: 'json',
				success : function(data){
					if(data.resultCode === 0){
						num.text(data.amount);
					}else{
						if(data.resultCode == -999) YD.popTip('出错了，请刷新页面后再试');
					}
				}
			});
		});
		
		icon.trigger('mouseenter');
	};
	
	var searchOps = function(){
		var ts = $('#topsearch'),
			setDelay,
			crtPosition,
			list,
			listLength,
			storeText,
			typedWord,
			box = $('#J_SearchOps'),
			hideIpt = $('#J_SearchType'),
			isOverAllSearch = $('<input name="overallSearch" type="hidden" value="true" />').insertAfter(hideIpt);

		var keyArr = [65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,48,49,50,51,52,53,54,55,56,57,96,97,98,99,100,101,102,103,104,105,8,186,187,188,189,190,191,32,108,13],
      		isTheKey;

		var setStringHighLight = function(str,key){
			var _str = str, _key = key, _length = _key.length, _return;

			if(_str.indexOf(_key) >= 0){
				var pos = _str.indexOf(_key);
				var a = _str.slice(0,pos),
					b = _str.slice(pos,(pos+_length)),
					c = _str.slice((pos+_length)),
					_return = a + '<em>' + b + '</em>' + c;
				
				return _return;
			}else{
				return _str;
			}
		};

		var filterKey = function(num){
	      for (var i = 0; i < keyArr.length; i++) {
	        if(num == keyArr[i]){
	          isTheKey = true;
	          break;
	        }
	      };
	    };

	    var cutWords = function(str){
	    	var _word = str;
	    	if(_word.length > 6){
	    		var cutted = _word.slice(0,6) + '..';
				$('#J_SearchOps li.parent em').text(cutted);
	    	}
	    };

		var createSearchContent = function(data){
			var _data = data, innerHTML = '',kw,processedStr;

			if(_data.resultCode == 0){//返回正常情况

				kw = _data.keyword;
				if(_data.source.length > 0){
					innerHTML += '<li class="parent topli"><a href="javascript:;" type="0">搜"<em>' + kw +'</em>"资讯源</a></li>';
					for(var i=0; i< _data.source.length; i++){
						var sourceName = _data.source[i].name;
						processedStr = setStringHighLight(sourceName,kw);
						if(i == _data.source.length -1){
							innerHTML += '<li class="children children-last"><a href="javascript:;" type="0">' + processedStr + '</a></li>';
						}else{
							innerHTML += '<li class="children"><a href="javascript:;" type="0">' + processedStr + '</a></li>';
						}
					}
				}else{
					innerHTML += '<li class="parent topli parent-s"><a href="javascript:;" type="0">搜"<em>' + kw +'</em>"资讯源</a></li>';
				}
				if(_data.book.length > 0){
					innerHTML += '<li class="parent"><a href="#" type="4">搜"<em>' + kw + '</em>"书籍</a></li>';
					for (var j = 0; j < _data.book.length; j++) {
						var bookName = _data.book[j].name;
						processedStr = setStringHighLight(bookName,kw);
						if(j == _data.book.length-1){
							innerHTML += '<li class="children children-last"><a href="javascript:;" type="4">' + processedStr + '</a></li>';
						}else{
							innerHTML += '<li class="children"><a href="javascript:;" type="4">' + processedStr + '</a></li>';
						}
					}
				}else{
					innerHTML += '<li class="parent parent-s"><a href="#" type="4">搜"<em>' + kw + '</em>"书籍</a></li>';
				}

				//console.log('inner is',innerHTML);
				box.empty().append(innerHTML).show();
				crtPosition = -1;
				cutWords(kw);
				list = $('#J_SearchOps li');
				listLength = $('#J_SearchOps li').length;
				$('#J_SearchOps li a').click(function(e){
					if($(this).parent().hasClass('parent')){
						ts.val(kw);
					}else{
						ts.val($(this).text());
					}
					hideIpt.val($(this).attr('type'));
					isOverAllSearch.val('');
					$('#J_Form').submit();
					e.preventDefault();
				});
			}
		}

		var searchValueSet = function(pos){
			var _pos = pos;
			hideIpt.val($('#J_SearchOps li a').eq(_pos).attr('type'));
			if(list.eq(_pos).hasClass('parent')){
				ts.val(typedWord);
			}else{
				ts.val(list.eq(_pos).text());
			}
		};

		var sendReq = function(kw){
			if($.trim(kw).length > 0){
				$.ajax({
					type : 'GET',
					url	 : '/querySearchHints.do',///querySearchHints.do
					data : {"keyword": kw},
					dataType : 'json',
					success : function(data){
						if(data){
							createSearchContent(data);
						}else{
							YD.popTip('出错了，请稍候再试');
						}
					},
					error : function(){

					}
				});
			}
		};

		ts.keydown(function(e){//按下取消计时
			var ifClear = false;
			
			for(var i=0;i<keyArr.length;i++){
				if(e.keyCode === keyArr[i]){
					ifClear = true;
					storeText = ts.val();
					break;
				}
			}
			if(ifClear){
				if(setDelay){
					clearTimeout(setDelay);
				}
			}
			
		});	

		ts.keyup(function(e){
			if(ts.val().length > 0){
				isTheKey = false;
				filterKey(e.keyCode);
				if(isTheKey){//正常键位输入
					setDelay = setTimeout(function(){//设置按键发送请求延时,200毫秒
						var n = ts.val();
						var kw = $.trim(ts.val());
						typedWord = kw;
						if(e.keyCode === 13 || e.keyCode === 108 || e.keyCode === 32){//当时空格回车，判断值是否变化
							if(n !== storeText){
								sendReq(kw);
							}
						}else{
							sendReq(kw);
						}
					},200);
				}

				if(e.keyCode === 40){//向下键
					if(list.length > 0){
						crtPosition ++;
						if(crtPosition > (listLength -1)) crtPosition = listLength - 1;
						list.each(function(){
							$(this).removeClass('crt');
						});
						list.eq(crtPosition).addClass('crt');
						searchValueSet(crtPosition);
					}
				}

				if(e.keyCode === 38){//向上键
					if(list.length > 0){
						crtPosition --;
						if(crtPosition < 0) crtPosition = 0;
						list.each(function(){
							$(this).removeClass('crt');
						});
						list.eq(crtPosition).addClass('crt');
						searchValueSet(crtPosition);
					}
				}

				if(e.keyCode === 27){//ESC键
					box.hide();
				}

			isOverAllSearch.val(hideIpt.val() == ''? 'true' : '');

			}else if(ts.val().length == 0){
				box.hide();
			}
		});

	};
	
	if($('#J_tb').length>0 && $('#J_tb').attr('state') == 1){//已经开通阅读
		menuRollOverOut('#J_tb .arrow','.options');
	}
	
	if($('#J_tb').length>0 && $('#J_tb').attr('state') == 2){//尚未开通阅读
		menuRollOverOut('#J_tb .name','.openbox');
	}
	
	var addServNum = function(){
		var html = '\
			<div id="J_ServiceNum" class="m-layer m-layer-5" style="display:none;">\
				<div class="inner">\
					<div class="up"><a href="javascript:void(0);"></a></div>\
					<div class="down">\
						<p>购买书籍后无法阅读等问题<br /></p>\
						<p>可拨打：020-83568090-7-6</p>\
					</div>\
				</div>\
			</div>';
		var clicked = false;
		$('#J_Service').click(function(e){
			if(clicked){
				$('#J_ServiceNum').show();
			}else{
				var top = $(this).offset().top - 120, left = $(this).offset().left;
				$('.g-doc').append(html);
				$('#J_ServiceNum').css({'top': top, 'left' : left})
				$('#J_ServiceNum').show();
				clicked = true;
				$('#J_ServiceNum .up a').click(function(){
					$('#J_ServiceNum').hide();
				});
			}
		});
	};
	
	var navHover = function(){
		$('#J_Nav li').mouseenter(function(){
			if(!$(this).hasClass('j-crt')){
				$(this).addClass('hover');
			}
		});
		$('#J_Nav li').mouseleave(function(){
			$(this).removeClass('hover');
		});
	};
	
	$().ready(function(){
		testEmpty('#topsearch');
		//cartNumber();
		searchOps();
		addServNum();
		navHover();
		YD.Header.testIE6.detect();
	});
})();