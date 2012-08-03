var chapterSet = (function(){
	var chapTable = $('#J_ChapTable'),secNum,ifCart;
	
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
	
	var selectOps = (function(){
		var items,ifcart = false;
		
		return {
			ifcart : function(b){
				ifcart = b;
			},
			selectAll : function(){
				items.each(function(){
					this.checked = true;
				});
				$('.title-check').each(function(){
					this.checked = true;
				});
				if(ifcart) priceSum.setChange();
			},
			selectNone : function(){
				items.each(function(){
					this.checked = false;
				});
				if(ifcart) priceSum.setChange();
			},
			selectOpp : function(){
				items.each(function(){
					if(this.checked){
						this.checked = false;
					}else{
						this.checked = true;
					}
				});
				selectOps.selectVol(secNum);
				if(ifcart) priceSum.setChange();
			},
			selectVol : function(tarNum){
				for(var i=0;i<=tarNum;i++){
					if($('.j-chapSec'+i+':checked').length == $('.j-chapSec'+i).length){
						$('#J_Volumn'+i)[0].checked = true;
					}else{
						$('#J_Volumn'+i)[0].checked = false;
					}
				}
			},
			init : function(id){
				items = $(id);
			}
		}
	})();
	
	var priceSum = (function(){
		var iptSelected,num,allItem,priceSelect,sum;
		var totalNum = $('#J_TotalNum'),totalPrice = $('#J_TotalPrice');
		
		return {
			setAll : function(){
				if($('#J_Cart .ccb').length === $('#J_Cart .ccb:checked').length){
					$('#J_SelectAll')[0].checked = true;
				}else{
					$('#J_SelectAll')[0].checked = false;
				}
			},
			setSelect : function(){
				allItem = $('.bookitem');
				allItem.each(function(){
					if($('.ccb',this)[0].checked){
						$(this).addClass('selected');
					}else{
						$(this).removeClass('selected');
					}
				});
			},
			getNum : function(){
				iptSelected = $('#J_Cart .ccb:checked');
				num = iptSelected.length;
			},
			getSum : function(){
				sum = 0;
				priceSum.setSelect();
				priceSelect = $('#J_Cart tr.selected .s-price em');
				priceSelect.each(function(){
					sum += $(this).text()*1;
				});
				sum = (Math.round(sum*100))/100;
			},
			setChange : function(){
				priceSum.getNum();
				totalNum.text(num);
				priceSum.getSum();
				totalPrice.text(sum);
			}
		}
	})();
	
	var chapterOps = (function(){
		var chapTable = $('#J_ChapTable'),clicked,tarPrice,tarChap,sendURL,id,form = $('#J_M_ConfirmOrder'),amount,remain;
		
		return {
			setBID : function(bid){
				if(bid){
					id = bid;
				}
			},
			setSendURL : function(url){
				if(url){
					sendURL = url;
				}else{
					sendURL = '';
				}
			},
			setLength : function(){
				setTimeout(function(){
					if(chapTable.height() > 500){
						$('#J_ChapCorl').css({'height':500,'overflow-y':'scroll','overflow-x':'hidden','position':'relative'}).scrollTop(0);
					}
				},30);
			},
			setclicked : function(obj){
				clicked = obj;
				tarPrice = $(clicked).parents('.bookitem').find('.s-price em');
				tarChap = $(clicked).parents('.bookitem').find('.s-chapnum');
			},
			checkNone : function(){
				if($('#J_ChapTable .ccb:checked').length == 0){
					alert('请选择至少一个章节完成订单！');
					return false;
				}else{
					chapterOps.sendChap();
					openLayer.closeLayer('#J_ChapSelect');
					if(ifCart){
						selectOps.init('#J_Cart .ccb');
					}
				}
			},
			calSum : function(){
				amount = 0;
				$('#J_Chapter .ccb:checked').each(function(){
					amount += $(this).parent().parent().find('.amount').text()*1;
				});
				amount = (Math.round(amount*100))/100;
				$('.j-chaptatol').text(amount+'读书币');
				$('.j-rmb').text(amount/100);
				chapterOps.checkRemain();
			},
			setRemain : function (num){
				remain = num*1;
				$('.j-remain').text(remain);
			},
			checkRemain : function (){
				if(amount <= remain){
					$('#J_CantGo').hide();
					$('#J_CanGo').show();
					$('#J_AutoSub')[0].disabled = '';
				}else{
					$('#J_CantGo').show();
					$('#J_CanGo').hide();
					$('#J_AutoSub')[0].disabled = 'disabled';
				}
			},
			checkSub : function (str){
				if(str && str == "checked"){
					$('#J_AutoSub')[0].checked = true;
				}else if(str && str == "unchecked"){
					$('#J_AutoSub')[0].checked = false;
				}
			},
			sendChap : function(){//发送已经选择的章节
				var iptSelected = $('#J_Chapter .ccb:checked'),valArr = [];
				iptSelected.each(function(){
					valArr.push($(this).val());
				});
				
				if(ifCart){//如果页面是购物车
					$.ajax({
						url : sendURL,
						data : {'operation': 'reselect_articles', 'source_uuid': id, 'article_uuids': valArr.join(',')},
						dataType : 'json',
						type : 'POST',
						success : function(data){
							if(data.resultCode == 0){//返回更改数据，只有购物车页面有
								tarPrice.text(data.Price);
								tarChap.text('共'+data.Number+'章');
								priceSum.setChange();
							}
						},
						error : function(){
							
						}	
					});
				}else{//非购物车页面
					form.submit();
				}
			}
		}
	})();
	
	var processData = function(data){//生成表格
			
		if(data[0].resultCode == 0){//返回状态正常
			if(data[0].resultCode == -694) {
				YD.popTipLayer('该书还没有需要付费的章节，您暂时不需要购买。');
				return;
			}
			if(data[0].none){
				YD.popTipLayer('当前无可选章节 ，您选择的章节已存在于某未付款订单中。您可以点击查看<a href="/order.do?operation=list">购买记录</a>');
				return; //没有章节情况显示
			}
			openLayer.openLayer('#J_ChapSelect');
			chapTable.empty();
			var _data = data[1];
			$.each(_data,function(idx){
				secNum = idx;
				var listHTML = '<tr><td class="section-title"><input id="J_Volumn' + idx +'" class="title-check" series="' + idx + '" type="checkbox" checked="true" /></td>';
				listHTML += '<td class="section-title section-title-1" colspan="4"';
				listHTML += 'sectionId="'+ _data[idx].sectionId +'">';
				listHTML += _data[idx].sectionTitle;
				listHTML += '</td></tr>';
				$.each(_data[idx].chapters,function(num){
					listHTML += '<tr><td><input name="article_uuid" class="ccb volumn' + idx +' j-chapSec' + idx + '" type="checkbox" series="'+ idx +'" checked="true" value="' + _data[idx].chapters[num].chapterID + '" /></td>';
					listHTML += '<td class="cpt"><span>' + _data[idx].chapters[num].chapterTitle + '</span></td>';
					listHTML += '<td>' + _data[idx].chapters[num].words + '</td>';
					listHTML += '<td class="amount">' + _data[idx].chapters[num].chapPrice +'</td></tr>';
				});
				
				chapTable.append(listHTML);
			});
			
			selectOps.init('#J_Chapter .ccb');
			chapterOps.setLength();
			chapterOps.setRemain(data[0].remain);
			chapterOps.checkSub(data[0].substate);
			$.each(_data,function(idx){
				var group = $('.j-chapSec'+idx);
				$.each(_data[idx].chapters,function(num){
					if(_data[idx].chapters[num].ifChecked){
						group.eq(num)[0].checked = true;
					}else{
						group.eq(num)[0].checked = false;
					}
				});
			});
			selectOps.selectVol(secNum);
			
			$('#J_Chapter .ccb').click(function(){
				var s = $(this).attr('series');
				
				if($('.volumn'+s+':checked').length == $('.volumn'+s).length){
					$('#J_Volumn'+s)[0].checked = true;
				}else{
					$('#J_Volumn'+s)[0].checked = false;
				}
				chapterOps.calSum();
			});
			$('#J_Chapter .title-check').click(function(){
				var s = $(this).attr('series');
				if(this.checked){
					$('.volumn'+s).each(function(){
						this.checked = true;
					});
				}else{
					$('.volumn'+s).each(function(){
						this.checked = false;
					});
				}
				chapterOps.calSum();
			});
			chapterOps.calSum();
			
			
		}else if(data[0].resultCode == -1){//返回状态错误
			YD.popTip('服务器错误！');
		}else if(data[0].resultCode == -999){
			login163();
		}
	};
	
	var selectEvent = function(){
		$('.j-capall').unbind().click(function(){//全选按钮
			selectOps.selectAll();
			chapterOps.calSum();
		});
		
		$('.j-capopp').unbind().click(function(){//反选按钮
			selectOps.selectOpp();
			chapterOps.calSum();
		});
		
		$('.j-alldone').unbind().click(function(e){//确定按钮
			e.preventDefault();
			chapterOps.checkNone();
		});
		$('.j-cancel').unbind().click(function(){//取消按钮
			openLayer.closeLayer('#J_ChapSelect');
			if(ifCart){
				selectOps.init('#J_Cart .ccb');
			}
		});
	};
	
	return {
		init : function(data,cart,url,bid){
			processData(data);
			selectEvent();
			ifCart = cart;
			selectOps.ifcart(cart);
			chapterOps.setSendURL(url);
			chapterOps.setBID(bid);
		},
		priceSum : priceSum,
		selectOps : selectOps,
		chapterOps : chapterOps
	};
})();