/**
 * 通用调用模块
 *
 * @creator hzliyan@corp.netease.com
 */
 define(function(require,exports){
 	var w = require('./widgets'),
 		$ = require('../sea-modules/jquery/1.7.2/jquery');

 	var searchText = '搜索资讯源、书籍';

	/**
	 * 导航鼠标移入移出
	 *
	 */
 	var navHover = function(id){
		$(id).mouseenter(function(){
			if(!$(this).hasClass('j-crt')){
				$(this).addClass('hover');
			}
		});
		$(id).mouseleave(function(){
			$(this).removeClass('hover');
		});
	};

	/**
	 * 反馈弹窗
	 *
	 */
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

 	function init(){
 		navHover('#J_Nav li');
 		addServNum();
 		w.msgInput('#topsearch','s-fc4',searchText);
 		w.testEmpty('#topsearch',searchText);
 	}

 	init();
 })