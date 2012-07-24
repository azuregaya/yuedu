$(document).ready(function(){
	/* DOM结构定义 */
	var container = $('#J_entryCon'),//主容器
		pop = $('#J_CmtTepl_pop'),//源评论弹出浮层
		mask = $('.m-mask'),
		cmtTepl = $('#J_CmtTepl'),//文章评论模板
		snsPanel = $('#J_Forward'),//转发弹出浮层
		snsTxt = $('#J_ForTxt'),//转发文本框
		wordType = $('#J_Words'),//转发已经输入字数框
		tenmore = $('#J_addTenMore'),//加载更多按钮
		subStars = $('#J_Cmtstar_pop'),//源评论星评级
		hintBox = $('#J_Hint');//提示框
		
	var itemArr ={},openItem,entryArr=[];
	
	$('.j-close').click(function(){//弹出框关闭按钮
		$(this).parents('.m-popup').hide();
	});
	
	var popHint = function(str){
		hintBox.empty().text(str).fadeIn(300).delay(3000).fadeOut(300);
	};
	
	/************************文章加载功能*************************/
	var loadBrief = function(str){//加载十条缩略信息
		var url = str;
		$.getJSON(url,function(_data){
			var data = _data[1];
			$.each(data,function(entryIndex){
				/* 创建缩略浏览部分DOM结构*/
				var entryHTML = '<div id="J_Entry' + data[entryIndex].entryID + '" class="m-entry m-entry-t" first="true" entryid="' + data[entryIndex].entryID + '" sourceid="' + data[entryIndex].sourceID +  '">';
				entryHTML += '<div class="header"><h2 class="headerh2 '+ data[entryIndex].read +'"><span></span>' + data[entryIndex].title + '</h2>' +'<span class="time">' + data[entryIndex].posttime + '</span></div>';
				entryHTML += '<div class="source"><p class="source">从  <a href="' + data[entryIndex].sourceURL + '" target="_blank">' + data[entryIndex].source + '</a></p></div>';
				entryHTML += '<div class="content">';
				entryHTML += '<div class="m-brief">';
				entryHTML += '<p>' + data[entryIndex].breif +'...<a class="switch">查看全文</a></p></div>';
				entryHTML += '<div class="m-detail hidden"></div>';
				entryHTML += '</div><div class="opt">';
				entryHTML += '<ul><li><a class="cmt" href="javascript:void(0);">评论</a><span>|</span></li>';
				if(data[entryIndex].favor === "unstar"){
					entryHTML += '<li class="favor favor-t"><a href="javascript:void(0);">收藏</a><span>|</span></li>';
				}else if(data[entryIndex].favor === "stared"){
					entryHTML += '<li class="favor favor-t favoron"><a href="javascript:void(0);">取消收藏</a><span>|</span></li>';
				}
				entryHTML += '<li><a class="forward forward-t" href="javascript:void(0);">转发至</a></li></ul>';
				entryHTML += '</div></div>';
				tenmore.before(entryHTML);
			});
			
			addBriefEvent();
			toggleStar();
			addMore(_data[0].more);
			//shareSNS();
		});
		
	};
	
	var addBriefEvent = function(){//缩略信息绑定事件
		$('.m-entry-t').click(function(e){
			var currentID = $(this).attr('entryid');
			if($(e.target).hasClass('headerh2') || $(e.target).hasClass('switch') || $(e.target).hasClass('cmt')){
				
				if(openItem){//控制只有一篇文章展开
					if(openItem.attr('entryid') !== $(this).attr('entryid') && $('.m-brief',openItem).hasClass('hidden')){
						$('.m-brief', openItem).toggleClass('hidden');
						$('.m-detail', openItem).toggleClass('hidden');
						$(document).scrollTop($(this).offset().top -144);
					}
					openItem = $(this);
				}else{
					openItem = $(this);
				}
				if($(this).attr('first') === 'true'){//文章首次加载
					//存储相关对象
					itemArr[currentID] = {};
					itemArr[currentID]['scrollTop'] = $(document).scrollTop();
					itemArr[currentID]['clickItem'] = $(this);
					itemArr[currentID]['breifBox'] = $('.m-brief',$(this));
					itemArr[currentID]['detailBox'] = $('.m-detail',$(this));
					itemArr[currentID]['header'] = $('.headerh2',$(this));
					
					
					//改变首次加载和未读状态
					$(this).attr('first','false');
					itemArr[currentID]['header'].removeClass('unread').addClass('read');
					
					//发送文章ajax请求
					$.ajax({
						url	: 'data/inner-3.html',
						dataType : 'html',
						success : function(data){
							itemArr[currentID]['detailBox'].append(data).toggleClass('hidden');
							itemArr[currentID]['breifBox'].toggleClass('hidden');
							cmtTepl.clone().appendTo(itemArr[currentID]['detailBox']).attr('id',('J_CmtTepl_'+currentID)).show();
							formatComt(currentID);
							
							/* 如果点击评论，移动到评论框focus */
							itemArr[currentID]['comt'] = $(('#J_ComTxt_' + currentID));
							if($(e.target).hasClass('cmt')){
								itemArr[currentID]['comt'].focus();
								$(document).scrollTop(itemArr[currentID]['comt'].offset().top-200);
							}
						}
					});
				}else{//文章非首次加载
					if(itemArr[currentID]['breifBox'].hasClass('hidden')){//文章展开，点击闭合状态
						if($(e.target).hasClass('cmt')){//文章展开状态点击评论
							itemArr[currentID]['comt'].focus();
							$(document).scrollTop(itemArr[currentID]['comt'].offset().top-200);
							return;
						}
						$(document).scrollTop(itemArr[currentID]['scrollTop']);
					}else{//文章闭合，点击展开状态
						itemArr[currentID]['scrollTop'] = $(document).scrollTop();
					}
					
					itemArr[currentID]['detailBox'].toggleClass('hidden');
					itemArr[currentID]['breifBox'].toggleClass('hidden');
					
					if($(e.target).hasClass('cmt')){//文章闭合状态点击评论
						itemArr[currentID]['comt'].focus();
						$(document).scrollTop(itemArr[currentID]['comt'].offset().top-200);
					}
				}
			}
		});
		
		//移入移出边框显示
		$('.m-entry-t').mouseenter(function(){
			$(this).addClass('m-entry-1');
		});
		
		$('.m-entry-t').mouseleave(function(){
			$(this).removeClass('m-entry-1');
		});
		
		
		entryArr = [];
		$('.m-entry').each(function(){
			entryArr.push($(this));
		});
		
		$('.m-entry').removeClass('m-entry-t');
		
	};
	
	var toggleStar = function(){//添加取消收藏
		$('.favor-t a').click(function(){
			var btn = $(this),id=btn.parents('.m-entry').attr('entryid'),txt=btn.text();
			$.get('data/json5.js',[id,txt],function(data){//传送参数为该条目的ID号
				var state = data.state;
				if(state === 'unlogin') alert('请登录');
				if(state === 'stared'){
					btn.text('收藏').parent().removeClass('favoron');
				}else{
					btn.text('取消收藏').parent().addClass('favoron');
				}
			},['json']);
		});
		$('.favor').removeClass('favor-t');
	};
	
	var addMore = function(_boolean){//加载更多
		if(_boolean){
			tenmore.unbind().click(function(){
				loadBrief('data/json1.js');
			});
		}else{
			tenmore.unbind().addClass('m-tenmore-1');
		}
	}
	
	var formatComt = function(_num){//添加评论基本事件
		var comtBox = $('#J_CmtTepl_'+_num),
			txta = $('.j-ta',comtBox),
			sendBtn = $('.send',comtBox);
			
		txta.attr('id',('J_ComTxt_'+_num));
		YD.msgInput(('#J_ComTxt_'+_num),'s-fc4','说说我的看法');
		
		$('#J_ComTxt_'+_num).keyup(function(){//检测字数为空时按钮样式
			if($.trim($(this).val()).length == 0){
				sendBtn.removeClass('enable').addClass('disable');
			}else{
				sendBtn.removeClass('disable').addClass('enable');
			}
		});
		
		sendBtn.click(function(){
			if($(this).hasClass('enable')){
				var comtTxt = txta.val();
			
				$.get('data/json6.js',['articleID',comtTxt],function(data){
					var newComt;
					if(data.state === 'success'){
						//内容为文章评论
						newComt = '<li><div class="who">';
						newComt += '<strong>'+ data.username + '</strong>';
						newComt += '<span class="time">' + data.posttime + '</span></div>';
						newComt += '<p>' + data.text + '</p></li>';
						$('.j-atcComtList',comtBox).prepend(newComt);
					}
				},['json']);
			}
		});
	};
	
	/****************************只有源详情有的功能******************************/
	var entryBrowser = function(dir){//上一篇下一篇
		if(openItem){
			if(dir === 'down'){
				for(var i=0; i<entryArr.length;i++){
					if(openItem.attr('id') === entryArr[i].attr('id') && i!==(entryArr.length-1)){
						$('.headerh2',entryArr[i+1]).trigger('click');
						return;
					}
				}
			}else if(dir === 'up'){
				for(var i=0;i<entryArr.length;i++){
					if(openItem.attr('id') === entryArr[i].attr('id') && i !== 0){
						$('.headerh2',entryArr[i-1]).trigger('click');
						return;
					}
				}
			}
		}else{
			if(dir === 'down'){
				$('.headerh2',entryArr[0]).trigger('click');
			}
		}
	};
	
	$('#J_Browse').click(function(e){
		if($(e.target).hasClass('up')){
			entryBrowser('up');
		}else if($(e.target).hasClass('down')){
			entryBrowser('down');
		}
	});
	
	$('#J_Subscribe').click(function(){
		if($(this).hasClass('o1')){//这段代码为demo演示，整合还根据原来的方法，完成后调用popHint();
			$(this).removeClass('o1').addClass('o3');
			popHint('订阅源添加成功');
		}else{
			$(this).removeClass('o3').addClass('o1');
			popHint('订阅源取消成功');
		}
	});
	
	var init = function(){
		loadBrief('data/json1.js');
		//subsComt();
		//checkSNS();
		$(document).scrollTop(0);
		
	};
	
	init();

});