(function(){
	
	var getPage; 
	
	/*******************ȫѡ*****************/
	var selectOpt = (function(){
		var currentSec;
			
		return {
			selectItems : function(){
				currentSec = $('#Searchresult ul li input');
				$('#Searchresult ul li:odd').addClass('even');
			},
			selectAll : function(){
				currentSec.each(function(idx){
					this.checked = true;
				});
			},
			selectOpp : function(){
				currentSec.each(function(idx){
					if(this.checked){
						this.checked = false;
					}else{
						this.checked = true;
					}
				
				});
			}
		}
	})();
	
	var initPagination = (function(){
		return {
			init : function(){
				var num_length = $('#hiddenresult div.result').length;
				getPage = num_length;
				if(num_length === 1){
					$('#Searchresult').empty().append($('#hiddenresult div.result'));
					selectOpt.selectItems();
				}else{
					var num_entries = num_length;
					$('#Pagination').pagination(num_entries,{
						num_edge_entries : 1,
						num_display_entries : 3,
						callback : pageControl.pageselectCallback,
						items_per_page : 1
					});
				}
			}
		}
	})();
	
	var pageControl = (function(){
		var num_select = 0;
		return { 
			pageselectCallback : function(page_index,jq){
				var currentSec = $('#Searchresult div.result');
				if(currentSec.length >0){
					if(num_select === 0){
						$('#hiddenresult').prepend(currentSec);
					}else if(num_select === (getPage-1)){
						$('#hiddenresult').append(currentSec);
					}else{
						currentSec.insertBefore($('#hiddenresult div.result:eq('+ num_select +')'));
					}
				}
				var selectSec = $('#hiddenresult div.result:eq('+ page_index +')');
				num_select = page_index;
				$('#Searchresult').empty().append(selectSec);
				selectOpt.selectItems();
				//console.log(page_index,getPage,num_select);
			}
		}
		
	})();
	
	
	var subTest = (function(){
		var btn = $('#J_RSSSub');
		btn.click(function(){
			if($('.m-rlist input:checked').length === 0){
				$('#J_RSSHint').fadeIn(300).delay(3000).fadeOut(300);
			}else{
				$.ajax({
				  type: 'POST',
				  url: '/youdaoSubs.do',
				  data: $('#J_RSSForm').serialize(),
				  success: function(data){
						if(data.ResultCode === 1){
							$('#J_RSSInput').hide();
							if(data.Success*1 === 0 && data.Fail*1 >0){
								youdaoLog('youdaofail', 0, '', 0, 0,data.userId);
								youdaoLog('youdaodao', 1, 'fail', 0,data.Fail, data.userId);
							}
							if(data.Fail*1 === 0){
								youdaoLog('youdaodao', 1, 'success', data.Success, 0, data.userId);
								youdaoLog('youdaosuccess', 0, '', 0, 0, data.userId);
							}
							if(data.Fail*1 > 0){
								youdaoLog('youdaodao', 1, 'fail', data.Success, data.Fail, data.userId);
							}
							if(data.Success*1 > 0 && data.Fail*1 >0){
								youdaoLog('youdaosuccfail', 0, '', 0, 0, data.userId);
							}
							
							$('#J_YSuccess').text(data.Success);
							if(data.Fail*1 == 0){
								$('#J_IFZero').hide();
							}else{
								$('#J_YFail').text(data.Fail);
							}
							if(data.Fail > 0){
								$('#J_FailDetail').append(data.Detail).show();
							}
							YD.openLayer('#J_RSSResult');
							pageTracker._trackPageview("/youdao/succfail.html");
						}else if(data.ResultCode === 0){
							$('#J_RSSInput').hide();
							YD.openLayer('#J_RSSError');
							pageTracker._trackPageview("/youdao/succfail.html");
						}
				  },
				  error : function(){
					
				  },
				  dataType: "json"
				});
				$(this).addClass('disable').unbind();
			}
		});
	})();
	
	var openRSSLog = function(){
		$('#J_AddRSS').click(function(){
			YD.openLayer('#J_RSSConfirm');
			$(this).parents('.m-popup').hide();
		});
		
		$('.checkid').click(function(){
			YD.openLayer('#J_RSSLog');
			$('#J_RSSLog .ipt').val('');
			pageTracker._trackPageview("/youdao/login.html");
			$('#pserror').hide();
			$(this).parents('.m-popup').hide();
		});
		
		$('#J_YDLog').click(function(){
			var username = $('#J_YDLogName').val(),password = $('#J_YDLogPassword').val();
			if(username.length > 0 && password.length > 0){
				$.ajax({
					type : 'GET',
					url : '/youdaoLogin.do',
					data : {'type':1,'youdaouser':username,'youdaopass':password},
					success : function(data){
						processReturn(data);
					},
					error : function(){
						$('#pserror').fadeIn(300).delay(3000).fadeOut(300);
					},
					dataType : "html"
				});
			}else{
				$('#pserror').fadeIn(300).delay(3000).fadeOut(300);
			}
		});
	};
	
	var processReturn = function(data){
		$('#hiddenresult').append(data);
		var ifNull = $('#J_YNull').val();
		if(ifNull == 1){
			YD.openLayer('#J_RSSError');
			$('#J_RSSConfirm').hide();
			$('#J_RSSLog').hide();
			return;
		}
		$('#J_YTotal').text($('#J_YTotalO').val());
		$('#J_YRemain').text($('#J_YRemainO').val());
		$('#J_RSSConfirm').hide();
		$('#J_RSSLog').hide();
		initPagination.init();
		YD.openLayer('#J_RSSInput');
		pageTracker._trackPageview("/youdao/choosesource.html");
	};
	
	var userIdSend = function(){
		var uid = $('#J_YDUser').text();
		$('#J_YDOps .nextstep').click(function(){
			$.ajax({
				type : 'GET',
				url : '/youdaoLogin.do',
				data : {'type':0,'youdaouser':uid},
				success : function(data){
					processReturn(data)
				},
				error : function(){
				},
				dataType : "html"
			});
		});
	};
	
	var init = function(){
		$('#J_SelectAll').click(function(){
			selectOpt.selectAll();
		});
		
		$('#J_SelectOpp').click(function(){
			selectOpt.selectOpp();
		});
		
		
		userIdSend();
		openRSSLog();
	};
	
	init();
	
})();