(function(){
	
	/* 设备检测 */
	var deviceDetect = function(link1,link2){
		var ua = navigator.userAgent.toLowerCase();
		if(ua.match(/iphone/i) || ua.match(/ipod/i)){
			//goto App store
			window.location.href = link1;
		}else if(ua.match(/android/i)){
			//goto Google Play
			window.location.href = link2;
		}
	};
	
	$('#J_Down').click(function(){
		var link1 = $(this).attr('data1'),link2 = $(this).attr('data2');
		deviceDetect(link1,link2);
	});

	$('#J_Close').click(function(){
		$(this).parent().parent().fadeOut(300);
	});
	
	/* 发送更多请求 */
	var pages = 0;
	var addMore = function(url){
		var sendURL = url;
		$.ajax({
			url : sendURL,
			data : [pages],
			dataType : 'json',
			success : function(data){
				if(data.resultCode == 0){//返回更改数据，只有购物车页面有
					var listHTML = '';
					if(!data.more){
						$('#J_Addmore').addClass('disable');
					}
					var _data = data.data;
					$.each(_data,function(idx){
						listHTML += '<li><div class="title"><h4>';
						listHTML += _data[idx].username +'</h4>';
						if(_data[idx].stars){
							listHTML += '<span class="w-star w-star1">';
							for(var i=0; i<(_data[idx].stars*1); i++){
								listHTML += '<span>&nbsp;</span>';
							}
							for(var j=0; j<(5-(_data[idx].stars*1));j++){
								listHTML += '<span class="no">&nbsp;</span>';
							}
							listHTML += '</span>';
						};
						listHTML += '<span class="date">' + _data[idx].posttime + '</span></div>';
						listHTML += '<p class="cmt">' + _data[idx].text + '</p></li>';
					});
					$('#J_CmtList').append(listHTML);
					pages ++;
				}
			},
			error : function(){
				
			}	
		});
	};
	
	$('#J_Addmore').click(function(){
		if($('#J_Addmore').hasClass('disable')){
			alert('没有更多评论');
		}else{
			var url = $(this).attr('data');
			addMore(url);
		}
	});
})();