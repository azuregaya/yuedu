/**
 * 常用javascript功能模块
 *
 * @creator hzliyan@corp.netease.com
 */

define(function(require,exports){
	var $ = require('../sea-modules/jquery/1.7.2/jquery');

	/**
	 * 搜索框提示 
	 *
	 */
	function msgInput(id,className,txt){
		var ipt = $(id);
		if(ipt.val() === txt){
			ipt.addClass(className);
		}
		if(ipt.val() ===""){
			ipt.addClass(className).val(txt);
		}
		ipt.focus(function(){
			if(ipt.val() === txt){
				ipt.val("").removeClass(className);
			}
		});
		ipt.blur(function(){
			if(ipt.val() === ""){
				ipt.val(txt).addClass(className);
			}
		});
	}

	/**
	 * 搜索框不能为空提示
	 *
	 */
	function testEmpty(id,searchText){
		var tipBox = $('<div id="J_EmptyTip" style="display:none;" class="m-layer m-layer-3"></div>');
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
				openLayer('#J_EmptyTip');
			}
		});
	}

	/**
	 * 创建遮罩
	 *
	 */
	function createMask(){//TODO有待测试
		if($('.m-mask').length === 0){
			var mask = $('<div class="m-mask" style="display:block;"></div>');
			mask.insertAfter($('.g-doc'));
		}else{
			$('.m-mask').show();
		}
	};

	/**
	 * 打开弹窗通用
	 *
	 */
	function openLayer(id){
		var box = $(id),
			bWidth = box.width(), 
			bHeight = box.height(), 
			winWidth = $(window).width(),
			winHeight = $(window).height();

		setTimeout(function(){
			createMask();
		},60);
		var st = $(document).scrollTop(), 
			toff = (winHeight - bHeight)/2 + st, loff = (winWidth - bWidth)/2;

		box.css({'top':toff,'left':loff,'z-index':8999}).show();
		$((id+' .j-close')).unbind().click(function(e){
			e.preventDefault();
			box.hide();
			if($('.m-mask').length !== 0){
				$('.m-mask').hide();
			}
		});
	}


	/* 输出 */
	exports.msgInput = msgInput;
	exports.testEmpty = testEmpty;
	exports.openLayer = openLayer;
})