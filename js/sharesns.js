var snsForward = (function(){
	var snsPanel = $('#J_Forward'),snsTxt = $('#J_ForTxt'),wordType = $('#J_Words');
	
	var checkSNS = function(t,l,callback){
		var _title = t, _link = l;
		var snsArr = [],list = $('#J_Forward ul li');

		snsTxt.unbind().bind('keyup mouseup blur',function(){//检测转发字数,控制140以内
			if($.trim($(this).val()).length > 140 || $.trim($(this).val()) === "说说我的看法"){
				var newVal = $.trim($(this).val()).substring(0,140);
				$(this).val(newVal);
			}
			var typed = $.trim($(this).val()).length;
			wordType.text(typed);
		});
		
		$.ajax({//首次发送请求，查看授权
			type: 'GET',
			url: '/weibo.do?operation=bindings&get_short_link=true&url=' + encodeURIComponent(_link),
			crossDomain: false,
			dataType: 'json',
			success: function(data) {
				var resultCode = data.ResultCode;
				if (resultCode == ResultCode.ERROR_NOT_LOGGED_IN) {
					login163();
				} else if (resultCode == ResultCode.SUCCESS) {
					var shortUrl = data.shortUrl;
					$('#J_M_url').val(shortUrl);
					$('#J_M_title').val(_title);

					callback && callback();

					snsTxt.val('//我正在看《' + _title + '》，网易云阅读里面好书真多啊。  ' + shortUrl);
					if(snsTxt[0].setSelectionRange){
						snsTxt[0].setSelectionRange(0, 0);
					};
					
					if (snsTxt[0].setSelectionRange) { // W3C
						snsTxt[0].setSelectionRange(0, 0);					
						snsTxt[0].focus();				
					}else if(snsTxt[0].createTextRange) { // IE
						var oR = snsTxt[0].createTextRange();// Fixbug :
						oR.moveStart('character',0); 
						oR.collapse(true);
						oR.select();
						snsTxt[0].focus();			
					}
					//snsTxt.focus();
					snsTxt.trigger('keyup');

					try {
						list.find('input[name=site]').each(function() {
							var currentSiteObj = null;
							for (var i = 0; i < data.sites.length; i++) {
								var siteObj = data.sites[i];
								if (this.value == siteObj.site) {
									currentSiteObj = siteObj;
									break;
								}
							}
							if (currentSiteObj) {
								this.checked = currentSiteObj.checked;
								$(this).parent().removeClass('dis');
							} else {
								this.checked = false;
								$(this).parent().addClass('dis');
							}
						});
					} catch (e) {
						//alert(data);
					}
				} else {
					YD.popTip('出错了，请稍后再试');
				}
			},
			error: function() {
				YD.popTip('出错了，请稍后再试'); //ERRPR TIP
			}
		});
		
		list.find('input[name=site]').unbind().click(function(e){
			var ctl = this,newCheckedState = this.checked;
			$('#J_GoWhere').val(this.value);
			if(newCheckedState){
				e.preventDefault();
				
				$.ajax({//再次验证授权状态
					type: 'GET',
					url: '/weibo.do?operation=checkAuthorization&site=' + this.value,
					crossDomain: false,
					dataType: 'json',
					success: function(data) {
						if (data.ResultCode == ResultCode.SUCCESS) {
							if (data.isAuthorized) {
								ctl.checked = true;
								$(ctl).parent().removeClass('dis');
							} else {
								$('#J_AtrLayer').show();//TODO 样式位置调整
							}
						} else if (data.ResultCode == ResultCode.ERROR_NOT_LOGGED_IN) {
							YD.popTip('请登录');
						} else {
							YD.popTip('出错了，请稍后再试');
						}
					},
					error: function(xhr) {
						if (xhr.status != 0) {
							YD.popTip('出错了，请稍后再试');
						}
					}
				});
			}
		});
		
		$('#J_AtrGo').unbind().click(function(){
			$(this).parent().parent().hide();
			window.open('/weibo.do?operation=authorize&site=' + $('#J_GoWhere').val(), 'yueduWeiboAuthorize');
		});
		
		$('.j-close-1').unbind().click(function(){
			$(this).parent().hide();
		});
		
		$('#J_Forward .send').unbind().click(function(){
			if ($('input[name=site]:checked').length == 0) {
				YD.popTip('请选择需要转发的微博');
				return;
			}
			if ($('#J_ForTxt').val().trim() == '') {
				YD.popTip('请输入需要转发的内容');
				return;
			}

			var txtCon = $('#J_ForTxt').val();
			//console.log(txtCon.indexOf('//'));
			if(txtCon.indexOf('//') === 0){//如果没有输入内容去掉斜杠
				txtCon = txtCon.slice(2);
				$('#J_ForTxt').val(txtCon);
			}

			$.ajax({
				type: 'POST',
				url: '/weibo.do',
				data: $("#publishForm").serialize(),
				crossDomain: false,
				dataType: 'json',
				success: function(data) {
					if (data.ResultCode == ResultCode.SUCCESS) {
						var success = '';
						var fail = '';
						var results = data.results;
						for (var i = 0; i < results.length; i++) {
							var r = results[i];
							if (r.successful) {
								success += r.siteName + ',';
							} else {
								fail += r.siteName + ',';
							}
						}
						YD.popTip('转发成功');
						if (typeof _gaq != 'undefined') { // Google analytics
							_gaq.push(['_trackEvent', 'yuedu', 'share', 'share_succeed']);
							logRequest('share_succeed');
						}
						//alert('success: ' + success + ' \nfail: ' + fail);
					} else if (data.ResultCode == ResultCode.ERROR_NOT_LOGGED_IN) {
						YD.popTip('请登录');
					} else if (data.ResultCode == ResultCode.ERROR_PARTIAL_FAILURE) {
						YD.popTip('部分微博发表失败');
						if (typeof _gaq != 'undefined') { // Google analytics
							_gaq.push(['_trackEvent', 'yuedu', 'share', 'share_fail']);
							logRequest('share_fail');
						}
					} else {
						YD.popTip('出错了，请稍后再试');
						if (typeof _gaq != 'undefined') { // Google analytics
							_gaq.push(['_trackEvent', 'yuedu', 'share', 'share_fail']);
							logRequest('share_fail');
						}
					}
					$('#J_Forward').hide();
				},
				error: function() {
					YD.popTip('出错了，请稍后再试'); //ERRPR TIP
				}
			});
		});
	};
	
	var shareSNS = function(id){
		$(id).click(function(){
			var toff = $(this).offset().top + 34,loff = $(this).offset().left -300;
			if(loff < 20){
				loff = 20;
			}
			$('#J_CmtSwitch').click(function(){
				$(this).parents('.m-popup').hide();
			});
			var title = $(this).attr('data1'),url = $(this).attr('data2');
			checkSNS(title,url,function() {
				snsPanel.css({'top':toff,'left':loff}).show();
			});
		});
	};
	
	return {
		init : function(id){
			shareSNS(id);
		}
	};
})();