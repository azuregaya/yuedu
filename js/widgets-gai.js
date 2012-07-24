/*
 * 网易阅读 Slider based on jQuery
 * 
 * Authored by liyan
 * Or say helo on mail: liam.yan.li@gmail.com
 * Free for all to use, abuse and improve under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 * 
 * January  2012(the end of the world)
 */
(function($){
	$.fn.goSlider = function(options){
		var settings = {};
		
		var defaults = {
			animation	:	'fade',
			animationDuration : 400,
			autoDuration : 5000,
			automatic : true,
			hoverPause : true,
			showControl : true,
			slideDirection : 'horizontal'
		};
		
		settings = $.extend({},defaults,options);
		
		var container = this,
			sliderWrap = this.find('ul.j-slider'),  //轮播ul容器
			sliderItem = sliderWrap.children('li'), //轮播的每一项
			sliderCount = sliderItem.length, 		//轮播项的数目
			animating = false,						//是否动画进行
			paused = false,							//是否暂停
			crtNum = 0,								//当前高亮
			nextNum = 0,
			position = 1,
			active = sliderItem.eq(0),
			nextItem,
			forward = 'forward',
			backward = 'backward',
			controlWrap = this.find('ol.j-control'),
			controlItem = controlWrap.children('li');
		
		
		var checkPos = function(dir){
			if(settings.animation === 'fade'){
				if(dir === forward){
					active.next().length ? nextNum ++ : nextNum = 0;
				}else if(dir === backward){
					active.prev().length ? nextNum -- : nextNum = sliderCount-1;
				}
			}
			return nextNum;
		};
		
		var autoRun = function(){
			goInterval = setInterval(function(){goMove(forward)},settings.autoDuration);
		};
		
		var hoverControl = function(){
			if(settings.hoverPause && settings.automatic){
				container.hover(function(){
					if(!paused){
						clearInterval(goInterval);
						paused = true;
					}
				},function(){
					if(paused){
						goInterval = setInterval(function(){goMove(forward)},settings.autoDuration);
						paused = false;
					}
				});
			}
		};
		
		var setControl = function(){
			controlItem.hover(function(){
				if(!$(this).hasClass('j-crt') && !animating){
					var crtKey = $(this).find('span').text()*1;
					goMove(false,crtKey);
				}
			},function(){
				
			});
		};
		
		var goMove = function(dir,pos){
			if(!animating){
				
				if(dir){
					nextNum = checkPos(dir);
				}else if(pos && settings.animation == 'fade'){
					nextNum = pos -1;
				}else{
					nextNum = pos;
				}
				animating = true;
				
				
				if(settings.animation === 'fade'){
					if(settings.showControl){
						controlItem.eq(crtNum).removeClass('j-crt');
						controlItem.eq(nextNum).addClass('j-crt');
					}
					
					nextItem = sliderItem.eq(nextNum);
					
					active.fadeOut(settings.animationDuration);
					nextItem.fadeIn(settings.animationDuration,function(){
						active.hide();
						crtNum = nextNum;
						active = nextItem;
						animating = false;
					});
				}else if(settings.animation === 'slide'){
					if(settings.showControl){
						//TODO 有标记点的状况
					}
					
					if(settings.slideDirection === 'horizontal'){
						sliderWrap.animate({'left': -nextNum*settings.width},settings.animationDuration,function(){
							if(nextNum === 0){
								position = sliderCount -2;
								sliderWrap.css({'left' : -position*settings.width});
							}else if(nextNum == sliderCount -1){
								position = 1;
								sliderWrap.css({'left' : -settings.width});
							}else{
								position = nextNum;
							}
							
							animating = false;
						});
					}
				}
			}
		};
		
		var init = function(){
			sliderItem.not(':first').hide();
			controlItem.eq(0).addClass('j-crt');
			autoRun();
			hoverControl();
			setControl();
		};
		
		init();
		
		return this;
	};
})(jQuery);
/**
 * 常用javascript功能
 *
 * @creator hzliyan@corp.netease.com
 */

var YD = {};

YD.namespace = function (str){
	var arr = str.split("."),o = YD;
	for(i = (arr[0]==="S")? 1 : 0; i < arr.length; i++){
		o = o[arr[i]] = o[arr[i]] || {};
	}
	return o;
}

/*******************搜索框提示********************/
YD.msgInput = function(_id,_class,_txt){
	var ipt = $(_id);
	var eptTip ='<div id="eptTip" style="display:none;" class="m-layer m-layer-3"><div class="lytt yy"><h4></h4><a href="#" class="lyclose j-close">关闭</a></div><div class="lyct"><div class="m-actip"><h3>搜索内容不能为空</h3><a href="#" class="btn j-close">我知道了</a></div></div><div class="lybt"><button class="j-close">我知道了</button></div></div>';
	
	if(ipt.val() === _txt){
		ipt.addClass(_class);
	}
	if(ipt.val() ===""){
		ipt.addClass(_class).val(_txt);
	}
	ipt.focus(function(){
		$(document).keydown(function(e){
			if(e.keyCode === 13 && ipt.val().length === 0){
				e.preventDefault();
				$('body').append(eptTip);
				YD.openLayer('#eptTip');
			}
		});
		
		if(ipt.val() === _txt){
			ipt.val("").removeClass(_class);
		}
	});
	ipt.blur(function(){
		$(document).unbind('keydown');
		
		if(ipt.val() === ""){
			ipt.val(_txt).addClass(_class);
		}
	});
};

/*******************5星评分条********************/
YD.starsAll = function(_id){
	var starSec = $(_id),starBar = $('.sc',starSec),starNum = $('.sm',starSec),total = 1,max = 1,numArr=[],maxLength = 125;
	starNum.each(function(){
		var voteNum = parseInt($(this).text());
		total = total + voteNum;
		if(max<voteNum){
			max = voteNum;
		}
		numArr.push(voteNum);
	});
	starBar.each(function(idx){
		$(this).width((numArr[idx]/total)*maxLength/(max/total));
	});
	
};

/*******************评价星点数********************/
YD.stars = function(_id){
	var items = $((_id + ' span')),levels=["真差劲","不如意","一般般","挺好的","棒极了"];
	items.each(function(idx){
		$(this).attr('title',levels[idx]);
		$(this).mouseover(function(){
			for(var x=0; x<=idx; x++){$(items[x]).removeClass('no');}
			for(var y=idx+1;y<levels.length;y++){$(items[y]).addClass('no')}
		});
	});
};

/*******************设置浮动********************/
YD.setFixed = function(_id){
	var floatBar = $(_id), initTop = 95, scrollVal,count;
	
	setTimeout(function(){
		scrollVal = $(window).scrollTop();
		//alert(scrollVal);
		adjust();
	},100)
	
	function adjust(){
		if(scrollVal > initTop){
			//floatBar.css('top',(scrollVal-initTop));
			floatBar.animate({top:(scrollVal-initTop)});
		}
		if(scrollVal <= initTop){
			//floatBar.css('top', 0);
			floatBar.animate({top:0});
		}
	}
	
	$(window).scroll(function(){
		setTimeout(function(){
			scrollVal = $(document).scrollTop();
			adjust();
		},100);
	});
};
/*******************计算滚动高度********************/
YD.heightCal = function(_id){
	var secTop = $(_id).offset().top, winHeight = $(window).height(), defaultSet = 25;
	//console.log(rSecTop);
	$(_id).height(winHeight-secTop-defaultSet);
}

/*******************打开弹窗********************/
YD.openLayer = function(_id){
	var box = $(_id),bWidth = box.width(), bHeight = box.height(), winWidth = $(window).width(),winHeight = $(window).height();
	/*var st = setTimeout(function(){
		return $(document).scrollTop();
	},100)*/
	var st = $(document).scrollTop(), toff = (winHeight - bHeight)/2 + st, loff = (winWidth - bWidth)/2;
	box.css({'top':toff,'left':loff}).show();
	$((_id+' .j-close')).unbind().click(function(e){
		e.preventDefault();
		box.hide();
	});
}