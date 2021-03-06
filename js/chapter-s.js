var chapterSet = (function(){
	var chapTable = $('#J_ChapTable');
	
	var openLayer = (function(){
		
		return {
			creatMask : function(){
				var mask = $('<div class="m-mask" style="display:block;"></div>');
				mask.height($(document).height());
				mask.insertAfter($('.g-doc'));
			},
			openLayer : function(id){
				ol = ($(document).width() - $(id).width())/2, offTop = $(document).scrollTop();
				$(id).css({'top': (80+offTop),'left':ol,'z-index':9000}).show();
				setTimeout(function(){
					openLayer.creatMask();
				},60);
			},
			closeLayer : function(id){
				$('.m-mask').hide();
				$(id).hide();
			}
		}
	})();
	
	var chapterOps = (function(){
		var chapTable = $('#J_ChapTable'), clicked,tarPrice,tarChap;
		
		return {
			setOps : function(){
				selectOps.init('#J_Chapter .ccb');
			},
			setLength : function(){
				setTimeout(function(){
					if(chapTable.height() > 500){
						$('#J_ChapCorl').css({'height':400,'overflow-y':'scroll','overflow-x':'hidden','position':'relative'}).scrollTop(0);
					}
				},30);
			},
			setclicked : function(obj){
				clicked = obj;
				tarPrice = $(clicked).parents('.bookitem').find('.s-price em');
				tarChap = $(clicked).parents('.bookitem').find('.s-chapnum');
			},
			calSum : function(){
				var amount = 0;
				$('td.amount-t').each(function(){
					amount += $(this).text()*1;
					
				});
				//amount = (Math.round(amount*100))/100;
				$('#J_SelectSum').text(amount+'丁丁币');
				$('#J_RMB').text((amount/100).toFixed(2));
			}
		}
	})();
	
	var processData = function(data){//生成表格
	
		if(data.resultCode == -694){
			YD.popTipLayer('该书还没有需要付费的章节，您暂时不需要购买。');
			return;
		}else if(data.resultCode == -1){//返回状态错误
			YD.popTip('服务器错误！');
			return;
		}else if(data.resultCode == -999){//未登录
			login163();
		}else if(data.resultCode == 0){//返回状态正常
			if(data.none){//没有章节情况显示
				YD.popTipLayer('当前无可选章节 ，您选择的章节已存在于某未付款订单中。您可以点击查看<a href="/order.do?operation=list">购买记录</a>');
				return; 
			}

			openLayer.openLayer('#J_ChapSelect');
			chapTable.empty();
			if (data.chapters) {
				var _data = data.chapters;
				var listHTML = '';
				$.each(_data,function(idx){
					listHTML += '<tr><td class="cpt cpt-1"><span>' + _data[idx].chapterTitle + '</span></td>';
					listHTML += '<td>' + _data[idx].words + '</td>';
					listHTML += '<td class="amount amount-t">' + _data[idx].chapPrice +'</td></tr>';
				});
				chapTable.append(listHTML);
			};
			if (data.sections) {
				var _data = data.sections;
				$.each(_data,function(idx){
					var listHTML = '<tr><td class="section-title section-title-2" colspan="4"';
					listHTML += 'sectionId="'+ _data[idx].sectionId +'">';
					listHTML += _data[idx].sectionTitle;
					listHTML += '</td></tr>';
					$.each(_data[idx].chapters,function(num){
						listHTML += '<tr><td class="cpt cpt-1"><span>' + _data[idx].chapters[num].chapterTitle + '</span></td>';
						listHTML += '<td>' + _data[idx].chapters[num].words + '</td>';
						listHTML += '<td class="amount amount-t">' + _data[idx].chapters[num].chapPrice +'</td></tr>';
					});
					chapTable.append(listHTML);
				});
			};
			
			chapterOps.setLength();
			chapterOps.calSum();
			
		}
	};
	
	return {
		init : function(data){
			processData(data);
			
			$('.j-alldone').unbind().click(function(e){
				e.preventDefault();
				openLayer.closeLayer('#J_ChapSelect');
			});

			$('.j-cancel').unbind().click(function(e){
				e.preventDefault();
				openLayer.closeLayer('#J_ChapSelect');
			});
		}
	};
})();