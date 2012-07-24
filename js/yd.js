var $ = function (id){
 return "string" == typeof id ? document.getElementById(id) : id;
}
var $$ = function(id,_class){
	var iclass = [];
	var itag = $(id).getElementsByTagName("*");
	for(var jj=0;jj<itag.length;jj++){
		if((" "+itag[jj].className+" ").indexOf(" "+_class+" ")!=-1){
			iclass.push(itag[jj]);
		}
	}
	return iclass;
}
var Class = {
	create: function(){
		return function(){
			this.initialize.apply(this, arguments);
		}
	}
}

var trim = function(str){
	return str.replace(/^\s+|\s+$/g,'');
}

var target = function(e){
	e = window.event || e;
	return e.srcElement || e.target;
}

var evton = function(obj,eventType,handler){
	if(document.all){
		obj.attachEvent("on" + eventType, handler);
	}else{
		obj.addEventListener(eventType,handler,false);
	}
}

var evtdel = function(obj,eventType,handler){
	if(document.all){
		obj.detachEvent("on" + eventType, handler);
	}else{
		obj.removeEventListener(eventType,handler,false);
	}
}

Object.extend = function(destination, source){
	for (var property in source){
		destination[property] = source[property];
	}
	return destination;
}
function stopDefault( e ) {
    // Prevent the default browser action (W3C)
    if ( e && e.preventDefault )
        e.preventDefault();
    // A shortcut for stoping the browser action in IE
    else
        window.event.returnValue = false;
    return false;
}
function addClass(obj,clsname){
	if((" "+obj.className+" ").indexOf(" "+clsname+" ")==-1){
		obj.className = obj.className + (" "+clsname);
	}
}
function delClass(obj,clsname){
	if((" "+obj.className+" ").indexOf(" "+clsname+" ")!=-1){
		obj.className = obj.className.replace(new RegExp("(?:^|\\s)"+clsname+"(?=\\s|$)","g")," ");
	}
}

//幻灯
var TransformView = Class.create();
TransformView.prototype = {
	//容器对象,滑动对象,切换参数,切换数量
	initialize: function(slider, parameter, count, oOptions){
		if(parameter <= 0 || count <= 0) return;
		var oSlider = $(slider), oThis = this;
	
		this.Index = 0;//当前索引
	
		this._timer = null;//定时器
		this._slider = oSlider;//滑动对象
		this._parameter = parameter;//切换参数
		this._count = count || 0;//切换数量
		this._target = 0;//目标参数
	
		this.SetOptions(oOptions);
		this.Itms = this.oOptions.Itms;
		this.Up = !!this.oOptions.Up;
		this.Step = Math.abs(this.oOptions.Step);
		this.Time = Math.abs(this.oOptions.Time);
		this.Auto = !!this.oOptions.Auto;
		this.Pause = Math.abs(this.oOptions.Pause);
		this.onStart = this.oOptions.onStart;
		this.onFinish = this.oOptions.onFinish;
		oSlider.style.position = "absolute";
		oSlider.style.top = oSlider.style.left = 0;
	},
	//设置默认属性
	SetOptions: function(oOptions){
		this.oOptions = {//默认值
			Up:   true,//是否向上(否则向左)
			Step:  6,//滑动变化率
			Time:  35,//滑动延时
			Auto:  true,//是否自动转换
			Pause:  5000,//停顿时间(Auto为true时有效)
			onStart: function(){},//开始转换时执行
			onFinish: function(){}//完成转换时执行
		};
		Object.extend(this.oOptions, oOptions || {});
	},
	//开始切换设置
	Start: function(){
		if(this.Index < 0){
			this.Index = this._count - 1;
		}else if(this.Index >= this._count){
			this.Index = 0;
		}
		this._target = -1 * this._parameter * this.Index;
		this.onStart();
		if(this.Show){
			this.fnShow();
		}else{
			this.Move();
		}
	},
	//移动
	Move: function(){
		clearTimeout(this._timer);
		var oThis = this, style = this.Up ? "top" : "left", iNow = parseInt(this._slider.style[style]) || 0, iStep = this.GetStep(this._target, iNow);
	
		if (iStep != 0){
			this._slider.style[style] = (iNow + iStep) + "px";
			this._timer = setTimeout(function(){ oThis.Move(); }, this.Time);
		}else{
			this._slider.style[style] = this._target + "px";
			this.onFinish();
			if (this.Auto){
				var __pause = this.Pause;
				if(this.One){
					if(this._target==0||this._target==(-(this._count-1)*this._parameter)){
						__pause = (this.One-1)*__pause;
					}
				}
				this._timer = setTimeout(function(){ oThis.Index++; oThis.Start(); }, __pause);
			}
		}
	},
	//淡入淡出
	fnShow: function(){
		clearTimeout(this._timer);
		var oThis = this;
		if(this.GetCrt()!=oThis.Index){
			this.Itms[this.GetCrt()].style.zIndex = this.Itms.length-1;
			this.Itms[oThis.Index].style.zIndex = this.Itms.length-2;
			
			if(this.isFilter){
				this.Itms[oThis.Index].filters[0].Opacity = 100;
				this.Itms[this.GetCrt()].filters[0].Opacity = this.Itms[this.GetCrt()].filters[0].Opacity - 20;
				if(this.Itms[this.GetCrt()].filters[0].Opacity<=0){
					this.Itms[this.GetCrt()].filters[0].Opacity = 0;
					this.Itms[this.GetCrt()].style.zIndex = this.Itms.length-2;
					this.Itms[oThis.Index].style.zIndex = this.Itms.length-1;
				}
			}else{
				this.Itms[oThis.Index].style.opacity = 1;
				this.Itms[this.GetCrt()].style.opacity = this.Itms[this.GetCrt()].style.opacity - 0.25;
				//console.log(Math.round(this.Itms[this.GetCrt()].style.opacity * 100)/100);
				if(this.Itms[this.GetCrt()].style.opacity<=0){
					this.Itms[this.GetCrt()].style.opacity = 0;
					this.Itms[this.GetCrt()].style.zIndex = this.Itms.length-2;
					this.Itms[oThis.Index].style.zIndex = this.Itms.length-1;
				}
			}
			this._timer = setTimeout(function(){ oThis.fnShow(); }, this.Time);
		}else{
			if(this.isFilter){
				this.Itms[oThis.Index].filters[0].Opacity = 100;
			}else{
				this.Itms[oThis.Index].style.opacity = 1;
			}
			this.Itms[oThis.Index].style.zIndex = this.Itms.length-1;
			this.onFinish();
			if (this.Auto){
				this._timer = setTimeout(function(){ oThis.Index++; oThis.Start(); }, this.Pause);
			}
		}
	},
	//获取步长
	GetStep: function(iTarget, iNow){
		var iStep = (iTarget - iNow) / this.Step;
		if (iStep == 0) return 0;
		if (Math.abs(iStep) < 1) return (iStep > 0 ? 1 : -1);
		return iStep;
	},
	//获取当前淡出项索引
	GetCrt: function(){
		var iCrt = 0;
		for(var i=0;i<this.Itms.length;i++){
			if(this.Itms[i].style.zIndex==this.Itms.length-1){
				iCrt = i;
			}
		}
		return iCrt;
	},
	//停止
	Stop: function(iTarget, iNow){
		clearTimeout(this._timer);
		this._slider.style[this.Up ? "top" : "left"] = this._target + "px";
	}
}
function Each(list, fun){
	for (var i = 0, len = list.length; i < len; i++){ fun(list[i], i); }
}

//调用幻灯
var slidePlayer = function(_option){
	//_option = {wrap: , sliders: , controls: , prv: , nxt: , up: , auto: , crt: , pause: ,one:}
	var _controls = _option.controls,
		_itms = _option.sliders,
		_cwidth = _itms[0].clientWidth,
		_cheight = _itms[0].clientHeight,
		_slen = _option.sliders.length,
		_crt = _option.crt||"j-crt",
		_up = _option.up||false,
		_auto = _option.auto==false?false:true,
		_show = _option.show||false,
		_pause = _option.pause||5000;
		_one = _option.one||0;
	if(_slen<2) return;
	if(_up){
		_option.wrap.style.height = _cheight*_slen+"px";
	}else if(!_show){
		_option.wrap.style.width = _cwidth*_slen+"px";
	}
	var tvs = new TransformView(_option.wrap, _up?_cheight:_cwidth, _one?_slen-_one+1:_slen, {
		onStart: _controls?function(){ Each(_controls, function(o, i){ o.className = tvs.Index == i ? _crt : ""; }) }:function(){},//按钮样式
		Up: _up,
		Pause: _pause,
		Itms:_itms
	});
	tvs.isFilter = _itms[0].filters?true:false;
	tvs.Show = _show;
	tvs.Auto = _auto;
	tvs.One = _one;
	tvs.Start();
	if(_controls){
		Each(_controls, function(o, i){
			o.onmouseover = function(){
				o.className = _crt;
				tvs.Auto = false;
				tvs.Index = i;
				tvs.Start();
			}
			o.onmouseout = function(){
				o.className = "";
				tvs.Auto = _auto;
				tvs.Start();
			}
		});
	}
	if(_option.prv){
		_option.prv.onclick = function(){tvs.Index--;tvs.Start();}
	}
	if(_option.nxt){
		_option.nxt.onclick = function(){tvs.Index++;tvs.Start();}
	}
}



//切换



//弹窗

function layerOpen(_id,focus,tar) {
	var _per = 20;
	var o = $(_id);
	o.style.display = "";
	o.style.overflow = "hidden";
	var _dh = document.documentElement.clientHeight;
	if(typeof pageYOffset != 'undefined'){
		var _dt = pageYOffset;
	}else{
		var _dta = document.body; //IE 怪异模式
		var _dtb = document.documentElement; //IE正常模式
		_dtb = (_dtb.clientHeight) ?  _dtb: _dta;
		var _dt = _dtb.scrollTop;
	}
	var _lw = o.clientWidth;
	var _lh = o.clientHeight;
	var _py = _lh %  _per;
	var _pz = _lh - _py;
	var _ps = _pz / _per;
	var _po = (100 - (100 % _ps)) / _ps;
	if(_dh > _lh){
		o.style.top = _dt+((_dh-_lh)/2)+"px";
	}else{
		o.style.top = _dt+((_lh-_dh)/2)+"px";
	}
	o.style.left = "50%";
	o.style.marginLeft = -(_lw/2)+"px";
	o.style.height = "0px";
	o.style.opacity = 0;
	o.style.filter = "alpha(opacity=0)";
	o.opa = 0;
	Each($$(_id,"j-close"),function(link,i){
		link.onclick = function(e){layerClose(o);stopDefault(e)}
	});
	if(focus){
		tar.focus();
	}
	fnlayerOpen(o,_pz,_py);
}
function fnlayerOpen(o,_pz,_py){
	
	o.style.height = _pz + _py + "px";
	o.style.opacity = 1;
	o.style.filter = "alpha(opacity=100)";
	o.opa = 100;
	/*
	if(parseInt(this.o.style.height) == this._pz){
		this.o.style.height = this._pz + this._py + "px";
		this.o.style.opacity = 1;
		this.o.style.filter = "alpha(opacity=100)";
		this.o.opa = 100;
	}else{
		this.o.style.height = parseInt(this.o.style.height) + this._per + "px";
		this.o.style.opacity = (this.o.opa + this._po) / 100;
		this.o.style.filter = "alpha(opacity="+(this.o.opa + this._po)+")";
		this.o.opa = this.o.opa + this._po;
	}
	if(parseInt(this.o.style.height)<this._lh){
		setTimeout(fnlayerOpen,10);
	}
	*/
}
function layerClose(o){
	if (!o) {
		return;
	}
	o.style.opacity = 0;
	o.style.filter = "alpha(opacity=0)";
	o.opa = 0;
	o.style.height = "auto";
	o.style.display = "none";
	/*
	if(parseInt(this.o.style.height) <= this._py){
		this.o.style.opacity = 0;
		this.o.style.filter = "alpha(opacity=0)";
		this.o.opa = 0;
		this.o.style.height = "auto";
		this.o.style.display = "none";
	}else{
		this.o.style.height = parseInt(this.o.style.height) - this._per + "px";
		this.o.style.opacity = (this.o.opa - this._po) / 100;
		this.o.style.filter = "alpha(opacity="+(this.o.opa - this._po)+")";
		this.o.opa = this.o.opa - this._po;
	}
	if(parseInt(this.o.style.height)>=this._py){
		setTimeout(layerClose,10);
	}
	*/
}

//评分总揽
function starsAll(_id){
	var _itm1 = $$(_id,"sc");
	var _itm2 = $$(_id,"sm");
	var _total = 1;
	var _max = 1;
	Each(_itm2,function(o,i){
		_total = _total + parseInt(_itm2[i].innerHTML);
		if(_max<parseInt(_itm2[i].innerHTML)){
			_max = parseInt(_itm2[i].innerHTML);
		}
	});
	Each(_itm1,function(o,i){
		_itm1[i].style.width = ((parseInt(_itm2[i].innerHTML)/_total)*170)/(_max/_total) +"px";
	});
}

//评分
function stars(_id){
	var _itm = $(_id).getElementsByTagName("span");
	_itm[0].title = "真差劲";
	_itm[1].title = "不如意";
	_itm[2].title = "一般般";
	_itm[3].title = "挺好的";
	_itm[4].title = "棒极了";
	Each(_itm,function(o,i){
		o.onmouseover = function(){
			if($(_id).yes) return;
			for(var xx=0;xx<=i;xx++){delClass(_itm[xx],"no");}
			for(var yy=i+1;yy<_itm.length;yy++){addClass(_itm[yy],"no");}
		}
		o.onclick = function(){
			if(!$(_id).yes){
				//ajax here
			}
			// $(_id).yes = true;
		}
	});
}

//输入框内提示
function msgInput(_id,_class,_txt){
	if($(_id).value==_txt){
		addClass($(_id),_class);
	}
	if($(_id).value==""){
		addClass($(_id),_class);
		$(_id).value = _txt;
	}
	$(_id).onfocus = function(){
		if($(_id).value==_txt){
			$(_id).value = "";
			delClass($(_id),_class);
		}
	}
	$(_id).onblur = function(){
		if($(_id).value==""){
			addClass($(_id),_class);
			$(_id).value = _txt;
		}
	}
}

//搜索空提示
function testEpt(_id){
	var txtIpt = $(_id);
	var keyTest = function(){
		var e = arguments[0];
		if(e.keyCode === 13 && txtIpt.value.length === 0){
			stopDefault(e);
			layerOpen('eptTip');
		}
	}
	evton(txtIpt,'focus',function(){
		evton(document,'keydown',keyTest);
	});
	
	evton(txtIpt,'blur',function(){
		evtdel(document,'keydown',keyTest);
	});
}

//taber
function taber(_options){
	var _ctrl = _options.ctrl,
		_content = _options.content,
		_current = _options.current||0;
	if(_ctrl.length<2||_ctrl.length!=_content.length) return;
	var _len = _ctrl.length;
	for(var j=0;j<_len;j++){
		delClass(_ctrl[j],"j-crt");
		_content[j].style.display = "none";
	}
	addClass(_ctrl[_current],"j-crt");
	_content[_current].style.display = "block";
	Each(_ctrl,function(o,i){
		o.onclick = function(){
			for(var j=0;j<_len;j++){
				delClass(_ctrl[j],"j-crt");
				_content[j].style.display = "none";
			}
			addClass(_ctrl[i],"j-crt");
			_content[i].style.display = "block";
		}
	});
}

//hoverShow
function hoverShow(_options){
	var _ctrl = _options.ctrl,
		_content = _options.content;
	if(_ctrl.length<1||_ctrl.length!=_content.length) return;
	var _len = _ctrl.length;
	Each(_ctrl,function(o,i){
		o.onmouseover = function(){
			for(var j=0;j<_len;j++){
				_content[j].style.display = "none";
			}
			_content[i].style.display = "block";
		}
		o.onmouseout = function(){
			for(var j=0;j<_len;j++){
				_content[j].style.display = "none";
			}
		}
	});
}
function searchSource(){
	var searchKey = document.getElementById("topsearch").value;
	if (searchKey){
		return true;
	}else {
	   alert("请输入关键字");
	   return false;
	}	
	
}