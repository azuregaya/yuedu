var editPhoto = function(){//绑定头像更改按钮事件，可以自行用jQuery的toggle等方法；
	var editBox1 = $$('profile','edit1'),editBox2 = $$('profile','edit2'),btnload = $('btnA'),btnOK = $('btnB'), btnBack = $('btnC');
	//var btnArr = [$('btnA'),$('btnB'),$('btnC')];
	evton(btnload,'click',function(e){
		addClass(editBox1[0],'hidden');
		delClass(editBox2[0],'hidden');
	});
	evton(btnOK,'click',function(e){
		addClass(editBox2[0],'hidden');
		delClass(editBox1[0],'hidden');
	});
	evton(btnBack,'click',function(e){
		addClass(editBox2[0],'hidden');
		delClass(editBox1[0],'hidden');
	});
	
}

var setHighlight = function(){
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
}

var controlWords = function(num){
	var txt = $('intro-area'),rt = $('writed');
	if(trim(txt.value).length > 0){
		rt.innerHTML = trim(txt.value).length;
	}else{
		rt.innerHTML = 0;
	}
	evton(txt,'keyup',function(e){
		if(trim(txt.value).length > num){
			txt.value = trim(txt.value).substring(0,num);
		}
		rt.innerHTML = trim(txt.value).length;
	});
	//console.log(trim(txt.value).length);
}

setHighlight();
editPhoto();

var userInfo = {
	userName : 'i@abc.com',
	nickName : 'kissyme',
	gender : 0,
	introduction : '一只飞进玻璃瓶的蚊子，看得见光明，却找不到出路。 wenyunchao@gmail.com http://wenyunchao.com/',
	imageUrl : 'images/tx.jpg',
	userLabels : ['<2234>','UI设计师','网易','设计师','暴雪']
}

var curArr,newArr,curCon = $('cur-con'),newCon = $('new-con'),nin = $('nn'),gdt = $$('gd','gradio'),introarea = $('intro-area');
var curTags = ['<2234>','UI设计师','网易','设计师','暴雪'];
var newTags = ['互联网001','互联网002','网易','互联网003','互联网004'];


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
}

var delData = function(str){
	for(var i=curTags.length; i>=0; i--){
		if(str == curTags[i]){
			curTags.splice(i,1);
			//console.log('减去某个值后',curTags);
		}
	}
}

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
}

var addTags = function(str){
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
			curCon.appendChild(newItem);
			curTags.push(str);
		}else{
			closeAlert('oup');
		}
	}else{
		closeAlert('lmt');
	}
	update();
}

var update = function(){
	curArr = $$('profile','cur');
	delTags(curArr);
}

var closeAlert = function(k){
	var ap = $$('profile','alert');
	if(k=="lmt") ap[0].innerHTML="您最多设置5个标签";
	if(k=="oup") ap[0].innerHTML="您已经有了这个标签！";
	ap[0].style.display = 'block';
	closeUp = setTimeout(function(){
		ap[0].style.display = 'none';
	},2500);
}

var setAddTags = function(){
	var tagipt = $('tag-input'),addBtn = $('add-btn');
	evton(addBtn,'click',function(e){
		var iptVal = trim(tagipt.value);
		addTags(iptVal);
	});
}

var initTags = function(){
	generateTags(curCon,curTags,'cur');//生产现有标签加参数'cur';
	generateTags(newCon,newTags,'new');//生产兴趣标签加参数'new';
	curArr = $$('cur-con','cur');
	newArr = $$('new-con','new');
	delTags(curArr);
	delTags(newArr,true);
	setAddTags();
}

var ajaxPush = function(){
	var newDate = ['互联网007','互联网008','网易123','互联网009','互联网010'];//由Ajax获取到的数据；
	generateTags(newCon,newDate,'new');
	newArr = $$('new-con','new');
	delTags(newArr,true);
}

var ajaxChange = function(){
	var btn = $('change-tags');
	evton(btn,'click',function(e){
		ajaxPush();
	});
}

var loadData = function(){
	nin.value = userInfo.nickName;
	if(userInfo.gender === 0){
		gdt[0].checked = false;
		gdt[1].checked = true;
	}else{
		gdt[0].checked = true;
		gdt[1].checked = false;
	}
	introarea.value = userInfo.introduction;
	controlWords(500);
}

jQuery.noConflict();
jQuery(document).ready(function(){
	jQuery('img#profile-image').imgAreaSelect({aspectRatio:'1:1', handles: true,fadeSpeed:200}); 
});


initTags();
ajaxChange();

$("btn1").onclick= function(){
	layerOpen("profile");
	loadData();
}