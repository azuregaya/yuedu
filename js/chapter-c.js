var chapterSet = (function(){
	var chapTable = $('#J_ChapTable'),secNum,ifCart;
	
	var openLayer = (function(){
		return {
			creatMask : function(){
				if($('.m-mask').length === 0){
					var mask = $('<div class="m-mask" style="display:block;"></div>');
					mask.height($(document).height());
					mask.insertAfter($('.g-doc'));
				}else{
					$('.m-mask').height($(document).height()).show();
				}
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
		var totalNum = $('#J_TotalNum'),totalPrice = $('#J_TotalPrice'),totalPriceRMB = $('#J_TotalPriceRMB');
		
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
				//sum = (Math.round(sum*100))/100;
			},
			setChange : function(){
				priceSum.getNum();
				totalNum.text(num);
				priceSum.getSum();
				totalPrice.text(sum);
				totalPriceRMB.text((sum/100).toFixed(2));
				chapterOps.checkRemainCart();
			}
		}
	})();
	
	var chapterOps = (function(){
		var chapTable = $('#J_ChapTable'),clicked,tarPrice,tarChap,sendURL,id,form = $('#J_M_ConfirmOrder'),amount,remain;
		var cartAmount = $('#J_TotalPrice'),cartRemain = $('#J_CartRemain'),goRecharge = $('#J_ReCheck'),goBtn = $('#J_GoPay');

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
						$('#J_ChapCorl').css({'height':400,'overflow-y':'scroll','overflow-x':'hidden','position':'relative'}).scrollTop(0);
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
				//amount = (Math.round(amount*100))/100;
				$('.j-chaptatol').text(amount+'丁丁币');
				$('.j-rmb').text((amount/100).toFixed(2));
				chapterOps.checkRemain();
			},
			setRemain : function (num){
				remain = num*1;
				$('.j-remain').text(remain);
			},
			checkRemain : function (){//用于章节选择浮层检查余额
				if(amount <= remain){
					$('#J_CantGo').hide();
					$('#J_CanGo').show();
					$('#J_AutoSub')[0].disabled = '';
				}else{
					var n = amount;
					$('#J_CantGo').show();
					$('#J_CanGo').hide();
					if(!ifCart){
						$('#J_AutoSub')[0].disabled = 'disabled';
					}else{
						$('#J_AutoSub')[0].disabled = '';
					}
					$('#J_ChargeLink').attr('href','/recharge.do?operation=form&v_required='+n);
					$('#J_ChargeLink').unbind().click(function(){
						$('#J_ChapSelect').hide();
						$('.m-mask').hide();
						YD.openLayer('#J_After');
					});
				}
			},
			checkRemainCart : function(){//用于购物车检查余额
				if(cartRemain.text()*1 >= cartAmount.text()*1){
					goRecharge.hide();
					goBtn.removeClass('fbd');
				}else{
					var n = cartAmount.text();
					$('#J_ChargeLink_Cart').attr('href','/recharge.do?operation=form&v_required='+n);
					goBtn.addClass('fbd');
					goRecharge.show();
					$('#J_ChargeLink_Cart').click(function(e){
						YD.openLayer('#J_After');
					});
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
				var ifChecked = $('#J_AutoSub')[0].checked;


				if(ifCart){//如果页面是购物车
					$.ajax({
						url : sendURL,
						data : {'operation': 'reselect_articles', 'source_uuid': id, 'article_uuids': valArr.join(','),'auto_sub':ifChecked},
						dataType : 'json',
						type : 'POST',
						success : function(data){
							if(data.resultCode == 0){//返回更改数据，只有购物车页面有
								tarPrice.text(data.Price);
								tarChap.text('共'+data.Number+'章');
								priceSum.setChange();
							}else if(data.resultCode == -1){//未知错误
								YD.popTip('发生未知错误，请稍候再试');
							}else if(data.resultCode == -697){//选择的章节已经购买
								YD.popTip('您选择的章节已经购买');
							}
						},
						error : function(){
							
						}	
					});
				}else{//非购物车页面Ajax提交
					$.ajax({
						url : '/trade.do',//'data/json26.js''/trade.do'
						data : form.serialize(),
						dataType : 'json',
						type : 'POST',
						success : function(data){
							if(data.resultCode == 0){//正常
								YD.popTip('购买成功，花费'+ data.v_paid + '丁丁币');
								if(data.all_paid){//全部买完了
									//列表页面的话改变按钮状态 详情页面去掉按章购买按钮和加入书单按钮状态
									if($('#J_BuyNow').length != 0) $('#J_BuyNow').hide();
									if($('#J_BuyLater').length != 0) $('#J_BuyLater').hide();
									if($('.j-buys').length != 0){
										$('.j-buys').each(function(){
											if($(this).attr('source_uuid') == data.source_uuid){
												$(this).hide();
											}
										});
									}
								}else{//没有全部买完
									//列表页面和详情页面无变化
								}
							}else if(data.resultCode == -999){
								login163();
							}else if(data.resultCode == -693 && data.v_required){
								window.location.href = "/recharge.do?operation=form&v_required="+data.v_required;
							}else if(data.resultCode == -1){
								YD.popTip('出错了，请稍候再试！');
							}
						},
						error : function(){
						}
					});
				}
			}
		}
	})();
	
	var processData = function(data){//生成表格
		
		if(data.resultCode == -694) {
				YD.popTipLayer('该书还没有需要付费的章节，您暂时不需要购买');
				return;
		}else if(data.resultCode == -697){
				YD.popTipLayer('您已经购买过了，请刷新页面');
				return;
		}else if(data.resultCode == -1){
				YD.popTipLayer('出错了，请稍候再试！');
				return;
		}else if(data.resultCode == -999){
				login163();
		}else if(data.resultCode == 0){//返回状态正常
			if(data.none){
				YD.popTipLayer('当前无可选章节 ，您选择的章节已存在于某未付款订单中。您可以点击查看<a href="/order.do?operation=list">购买记录</a>');
				return; //没有章节情况显示
			}
			openLayer.openLayer('#J_ChapSelect');
			chapTable.empty();
			if(data.chapters){
				var _data = data.chapters;
				var listHTML = '';
				$.each(_data,function(idx){
					listHTML += '<tr class="j-level1 pointer" series="'+ idx +'"><td><input name="article_uuid" class="ccb volumn' + idx +' j-chapSec' + idx + '" type="checkbox" checked="true" value="' + _data[idx].chapterID + '" /></td>';
					listHTML += '<td class="cpt"><span>' + _data[idx].chapterTitle + '</span></td>';
					listHTML += '<td>' + _data[idx].words + '</td>';
					listHTML += '<td class="amount">' + _data[idx].chapPrice +'</td></tr>';
				});
				chapTable.append(listHTML);
			}
			if(data.sections){
				var _data = data.sections;
				$.each(_data,function(idx){
					secNum = idx;
					var listHTML = '<tr class="j-level2 pointer" series="' + idx + '"><td class="section-title"><input id="J_Volumn' + idx +'" class="title-check" type="checkbox" checked="true" /></td>';
					listHTML += '<td class="section-title section-title-1" colspan="4"';
					listHTML += 'sectionId="'+ _data[idx].sectionId +'">';
					listHTML += '<b></b>' + _data[idx].sectionTitle;
					listHTML += '</td></tr>';
					$.each(_data[idx].chapters,function(num){
						listHTML += '<tr class="j-level1 pointer" series="'+ idx +'"><td><input name="article_uuid" class="ccb volumn' + idx +' j-chapSec' + idx + '" type="checkbox" checked="true" value="' + _data[idx].chapters[num].chapterID + '" /></td>';
						listHTML += '<td class="cpt"><span>' + _data[idx].chapters[num].chapterTitle + '</span></td>';
						listHTML += '<td>' + _data[idx].chapters[num].words + '</td>';
						listHTML += '<td class="amount">' + _data[idx].chapters[num].chapPrice +'</td></tr>';
					});
					chapTable.append(listHTML);
				});
			}
			
			selectOps.init('#J_Chapter .ccb');
			chapterOps.setLength();
			
			chapterOps.setRemain(data.remain);
			chapterOps.checkSub(data.substate);
			if(data.chapters){//一级目录情况
				var group = $('#J_ChapTable .ccb');
				$.each(_data,function(idx){
					if(ifCart){
						if(_data[idx].ifChecked){
							group.eq(idx)[0].checked = true;
						}else{
							group.eq(idx)[0].checked = false;
						}
					}else{
						group.eq(idx)[0].checked = true;
					}
				});

				$('#J_ChapTable .ccb').click(function(e){
					e.stopPropagation();
					chapterOps.calSum();
				});

				$('.j-level1').click(function(e){
					var ipt = $(this).find('input')[0];
					if(ipt.checked){
						ipt.checked = false;
					}else{
						ipt.checked = true;
					}
					chapterOps.calSum();
				});

			}

			if(data.sections){//二级目录情况
				$.each(_data,function(idx){
					var group = $('.j-chapSec'+idx);
					$.each(_data[idx].chapters,function(num){
						if(ifCart){
							if(_data[idx].chapters[num].ifChecked){
								group.eq(num)[0].checked = true;
							}else{
								group.eq(num)[0].checked = false;
							}
						}else{
							group.eq(num)[0].checked = true;
						}
						
					});
				});

				selectOps.selectVol(secNum);
				$('.j-level1').click(function(e){
					var s = $(this).attr('series');
					var ipt = $(this).find('input')[0];
					if($(e.target).hasClass('ccb')){

					}else{
						if(ipt.checked){
							ipt.checked = false;
						}else{
							ipt.checked = true;
						}
					}
					if($('.volumn'+s+':checked').length == $('.volumn'+s).length){
						$('#J_Volumn'+s)[0].checked = true;
					}else{
						$('#J_Volumn'+s)[0].checked = false;
					}
					chapterOps.calSum();
				});
				$('.j-level2').click(function(e){
					var s = $(this).attr('series');
					var ipt = $(this).find('input')[0];

					if($(e.target).hasClass('title-check')){

					}else{
						if(ipt.checked){
							ipt.checked = false;
						}else{
							ipt.checked = true;
						}
					}
					if(ipt.checked){
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
			}
			chapterOps.calSum();
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
			ifCart = cart;
			processData(data);
			selectEvent();
			selectOps.ifcart(cart);
			chapterOps.setSendURL(url);
			chapterOps.setBID(bid);
		},
		priceSum : priceSum,
		selectOps : selectOps,
		chapterOps : chapterOps
	};
})();