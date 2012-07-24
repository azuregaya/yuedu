var curArr,newArr,curCon = $('cur-con'),newCon = $('new-con'),nin = $('nn'),gdt = $$('gd','gradio'),introarea = $('intro-area'),rt = $('writed'),photoBox = $('photoshow'),ias;

var setHighlight = function(){/* 设置输入框点击高亮 */
	var iptArr = $$('profile','ipttxt');
	//console.log(iptArr.length);
	for(var i=0; i<iptArr.length; i++){
		evton(iptArr[i],'focus',function(e){
			addClass(target(e),'focus');
		});
		
		evton(iptArr[i],'blur',function(e){
			delClass(target(e),'focus');
		});
	}
};

var controlWords = function(num){/* 控制输入文本字数 */
	if(trim(introarea.value).length > 0){
		rt.innerHTML = trim(introarea.value).length;
	}else{
		rt.innerHTML = 0;
	}
	evton(introarea,'keyup',function(e){
		if(trim(introarea.value).length > num){
			introarea.value = trim(introarea.value).substring(0,num);
		}
		rt.innerHTML = trim(introarea.value).length;
	});
};

var switchEdit = function(){//绑定头像更改按钮事件，可以自行用jQuery的toggle等方法替换；
	var editBox1 = $$('profile','edit1'),editBox2 = $$('profile','edit2'),btnload = $('btnA'),btnOK = $('btnB'), btnBack = $('btnC'),btnUp = $('btnD'),stup = $$('profile','pra2')[0],sterror = $$('profile','pra3')[0];
	evton(btnload,'click',function(e){
		if(btnUp.value.length > 0){
			addClass(editBox1[0],'hidden');
			delClass(editBox2[0],'hidden');
			editPhoto();
			//showTip(sterror,'show');
			alert(btnUp.value);
			btnUp.value = '';
			alert(btnUp.value);
		}
	});
	evton(btnOK,'click',function(e){
		addClass(editBox2[0],'hidden');
		delClass(editBox1[0],'hidden');
	});
	evton(btnBack,'click',function(e){
		ias = jQuery('img#profile-image').imgAreaSelect({remove: true});
		addClass(editBox2[0],'hidden');
		delClass(editBox1[0],'hidden');
	});
};

var showTip = function(elm,type){/* 控制提示显隐，showTip(stup,'show')显示正在上传；showTip(sterror,'show')现实错误；不加'show'隐藏 */
	if(type === 'show'){
		delClass(elm,'hidden');
	}else{
		addClass(elm,'hidden');
	}
};


var photoAlign = function(){/* 图片在resize之后调用这个函数进行居中对齐 */
	var imgW = $('profile-image').width,imgH = $('profile-image').height,wrapW = $$('profile','img-wrap')[0].style.width,wrapH = $$('profile','img-wrap')[0].style.height;
	$$('profile','img-wrap')[0].style.width = imgW + 'px';
	$$('profile','img-wrap')[0].style.height = imgH + 'px';
	$('profile-image').style.left = -imgW/2 + 'px';
	$('profile-image').style.top = -imgH/2 + 'px';
};

var editPhoto = function(){/* 编辑头像区块，需引入jquery插件 */
	jQuery.getScript('js/imgslt/jquery.imgareaselect.pack.js',function(){
		ias = jQuery('img#profile-image').imgAreaSelect({instance: true,aspectRatio:'1:1', handles: true,fadeSpeed:200});
	})
};

var generateTags = function(con,arr,k){
	var _con = con, _arr = arr, _k = k;
	_con.innerHTML = '';
	for(var i=0; i<_arr.length;i++){
		var newItem = document.createElement('li');
		if(_k == 'cur'){
			newItem.innerHTML = '<a class="cur" href="javascript:void(0);" value="'+ arr[i] +'">'+_arr[i]+'</a>';
		}else if(_k == 'new'){
			newItem.innerHTML = '<a class="new" href="javascript:void(0);" value="'+ arr[i] +'">'+_arr[i]+'</a>';
		}
		_con.appendChild(newItem);
	}
};

var delData = function(str){
	for(var i=curTags.length; i>=0; i--){
		if(str == curTags[i]){
			curTags.splice(i,1);
			//console.log('减去某个值后',curTags);
		}
	}
};

var delTags = function(arr,ifnew){
	if(arr.length > 0){
		for(var i=0; i<arr.length; i++){
			//console.log(arr[i].className.indexOf('add'));
			if(arr[i].className.indexOf('added') < 0){
				addClass(arr[i],'added');
				evton(arr[i],'click',function(e){
					if(ifnew && $$('cur-con','cur').length == 5) return;
					if(!ifnew) delData(target(e).getAttribute('value'));
					target(e).parentNode.parentNode.removeChild(target(e).parentNode);
				});
			}
			if(ifnew){
				evton(arr[i],'click',function(e){
					var pushTxt = target(e).getAttribute('value');
					addTags(pushTxt);
				});
			}
		}
	}
};

var addTags = function(str){
	if(str.length === 0) {
		closeAlert('noept');
		return;
	}
	curArr = $$('profile','cur');
	var exist = false;
	if(curArr.length <= 4){
		for(var i=0; i<curTags.length; i++){
			if(curTags[i] ==str){ 
				exist = true;
				break;
			}
		}
		if(!exist){
			var newItem = document.createElement('li');
			newItem.innerHTML = '<a class="cur" href="javascript:void(0);" value="'+str+'">'+str+'</a>';
			addDelay = setTimeout(function(){/* 修改ie下面加载顺序bug */
				curCon.appendChild(newItem);
				curTags.push(str);
				update();
			},100);
		}else{
			closeAlert('oup');
		}
	}else{
		closeAlert('lmt');
	}
	
};

var update = function(){
	curArr = $$('profile','cur');
	delTags(curArr);
};

var closeAlert = function(k){
	var ap = $$('profile','alert');
	if(k=="lmt") ap[0].innerHTML="您最多设置5个标签";
	if(k=="oup") ap[0].innerHTML="您已经有了这个标签！";
	if(k=="noept") ap[0].innerHTML="标签内容不能为空";
	ap[0].style.display = 'block';
	closeUp = setTimeout(function(){
		ap[0].style.display = 'none';
	},2500);
};

var setAddTags = function(){
	var tagipt = $('tag-input'),addBtn = $('add-btn');
	evton(addBtn,'click',function(e){
		var iptVal = trim(tagipt.value);
		addTags(iptVal);
	});
};

var ajaxPush = function(){ /* 此添加处获得新标签的Ajax方法*/
	generateTags(newCon,newLabels2,'new');
	newArr = $$('new-con','new');
	delTags(newArr,true);
};

var ajaxChange = function(){
	var btn = $('change-tags');
	evton(btn,'click',function(e){
		ajaxPush();
	});
};

/* 通过AJAX加载一个信息对象，如果成功的话调用loadData */
var userInfo = {
	userName : 'i@abc.com',
	nickName : 'kissyme',
	gender : 0,
	introduction : '一只飞进玻璃瓶的蚊子，看得见光明，却找不到出路。 wenyunchao@gmail.com http://wenyunchao.com/',
	imageUrl : 'images/tx.jpg',
	userLabels : ['<2234>','UI设计师','网易','设计师','暴雪']
};
var curTags = userInfo.userLabels;
var newLabels1 = ['互联网001','互联网002','网易','互联网003','互联网004']; //模拟第一次加载是兴趣标签
var newLabels2 = ['互联网007','互联网008','网易123','互联网009','互联网010']; //模拟点击换一批加载的兴趣标签

var loadData = function(){
	if(userInfo.imageUrl) {
		photoBox.src = 'images/tx.jpg';
	}else{
		photoBox.src = 'default path here';
	}
	nin.value = userInfo.nickName || '';
	if(userInfo.gender === 0){
		gdt[0].checked = false;
		gdt[1].checked = true;
	}else{
		gdt[0].checked = true;
		gdt[1].checked = false;
	}
	introarea.value = userInfo.introduction || '';
	controlWords(500);
	setHighlight();
	switchEdit();
	/* 以下生成标签各项功能 */
	generateTags(curCon,curTags,'cur');//现有标签加参数'cur';
	generateTags(newCon,newLabels1,'new');//兴趣标签加参数'new';
	curArr = $$('cur-con','cur');
	newArr = $$('new-con','new');
	delTags(curArr);
	delTags(newArr,true);
	setAddTags();
	ajaxChange();
};

loadData();
