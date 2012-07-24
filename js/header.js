(function(){
	YD.msgInput('#topsearch','s-fc4','搜索内容源、书籍');
	
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
			if(newStr.length === 0 || newStr == '搜索内容源、书籍'){
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
		});
		btn.mouseleave(function(){
			onTarget = false;
			var testTarget = setTimeout(function(){
				if(!onTarget){
					if(!fSec.hasClass('f-dn')) fSec.addClass('f-dn');
				}
			},500);
		});
		
		fSec.mouseenter(function(){
			onTarget = true;
		});
		fSec.mouseleave(function(){
			onTarget = false;
			fSec.toggleClass('f-dn');
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
		var box = $('#J_SearchOps'),hideIpt = $('#J_SearchType');
		
		$('#topsearch').keyup(function(e){
			if($('#topsearch').val().length > 0){
				$('#J_SearchOps li em').text($('#topsearch').val());
				box.show();
				if($('#topsearch').val().length > 5){
					var cutted = $('#topsearch').val().slice(0,5) + '...';
					console.log(cutted);
					$('#J_SearchOps li em').text(cutted);
					//$('#topsearch').val(cutted);
				}
			}else if($('#topsearch').val().length == 0){
				$('#J_SearchOps li em').text('');
				box.hide();
			}
			
			if(e.keyCode === 40){
				if($('#J_SearchOps li').hasClass('crt')){
					$('#J_SearchOps li').eq(1).addClass('crt');
					$('#J_SearchOps li').eq(0).removeClass('crt');
					hideIpt.val($('#J_SearchOps li a').eq(1).attr('type'));
				}else{
					$('#J_SearchOps li').eq(0).addClass('crt');
					hideIpt.val($('#J_SearchOps li a').eq(0).attr('type'));
				}
			}
			if(e.keyCode === 38){
				if($('#J_SearchOps li').hasClass('crt')){
					$('#J_SearchOps li').eq(0).addClass('crt');
					$('#J_SearchOps li').eq(1).removeClass('crt');
					hideIpt.val($('#J_SearchOps li a').eq(0).attr('type'));
				}else{
					//$('#J_SearchOps li').eq(0).addClass('crt');
				}
			}
			if(e.keyCode === 13 && $('#topsearch').val() !== 0){
				$('#J_Form').submit();
			}
		});
		
		$('#J_SearchOps li a').click(function(e){
			hideIpt.val($(this).attr('type'));
			$('#J_Form').submit();
			e.preventDefault();
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
		cartNumber();
		searchOps();
		addServNum();
		navHover();
		YD.Header.testIE6.detect();
	});
})();