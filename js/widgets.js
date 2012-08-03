/**
 * 常用javascript功能
 *
 * @creator hzliyan@corp.netease.com
 */

var YD = {};

/*******************搜索框提示********************/
YD.msgInput = function(_id,_class,_txt){
	var ipt = $(_id);
	if(ipt.val() === _txt){
		ipt.addClass(_class);
	}
	if(ipt.val() ===""){
		ipt.addClass(_class).val(_txt);
	}
	ipt.focus(function(){
		if(ipt.val() === _txt){
			ipt.val("").removeClass(_class);
		}
	});
	ipt.blur(function(){
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
	var secTop = $(_id).offset().top, winHeight = $(window).height(), defaultSet = 28;
	//console.log(rSecTop);
	$(_id).height(winHeight-secTop-defaultSet);
}

/*******************弹出提示********************/
YD.popTip = function(str){
	var structure = '<div id="J_FIXED" class="m-tipss" style="display:none;"><div id="J_TIPS" class="inner"></div></div>';
	if($('#J_FIXED').length == 0){
		$('.g-doc').prepend(structure);
	}
	var _tip = str, box = $('#J_TIPS');
	box.empty().text(_tip);
	box.parent().fadeIn(300).delay(3000).fadeOut(300);
};

YD.popTipLayer = function(str){
	var structure = 
	'<div class="m-layer m-layer-2 m-layer-4" id="infoTip">\
		    <div class="lytt yy"><h4>提示</h4><a class="lyclose j-close" href="#">关闭</a></div>\
		    <div class="lyct">\
		        <div class="m-removeyuan">\
					<h3 style="line-height:26px;height:71px;"></h3>\
					<div class="bt">\
						<button class="j-close">知道了</button>\
					</div>\
		        </div>\
		    </div>\
		</div>';
	if($('#infoTip').length == 0){
		$('body').append(structure);
	}
	var _tip = str, layer = $('#infoTip');
		
	$('#infoTip').css('z-index',10001);
	$('#infoTip .lyct h3').html(_tip);
	YD.openLayer('#infoTip');
};

/*******************浮层********************/
YD.createLayer = function(options){
	var settings = {};
	var defaults = {
		id : 1,
		size : 1,
		type : 1,
		title : "",
		content : "",
		openby : "screen",
		callback : null
	};
	settings = $.extend({},defaults,options);
	
	if($('#'+settings.id).length == 0){
		var layerHTML = 
		'<div id="J_NY1" class="m-newlayer m-newlayer-s1" style="display:none;">\
			<h2><span>这里是标题</span><a href="javascript:void(0)" class="j-close"></a></h2>\
			<div class="inner">\
				<div class="content">\
					<p>sdfdfas</p>\
				</div>\
				<div class="button">\
					<a class="cc j-close">取&nbsp;&nbsp;消</a>\
					<a class="ok">确&nbsp;&nbsp;定</a>\
				</div>\
			</div>\
		</div>';
		$('.g-doc').append(layerHTML);
	}
	
	YD.openLayer('#J_NY1');
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


/*******************分页代码********************/
YD.pagination = function(){
	
};

/*******************模板解析引擎********************/
YD.generator = function () {
	var parseTempl = function (tpl, start) {
		var nextlb, rb, ret, data, prevIndex, key, parts = [],strArr = [];
		start = start || 0;
		prevIndex = start;
		if (tpl.substr(start, 1) !== "{") {
			tpl = "{ " + tpl;
		}

		nextlb = tpl.indexOf("{", prevIndex + 1);
		rb = tpl.indexOf("}", prevIndex + 1);

		if (nextlb < rb) {
			while (nextlb > -1) {
				// 查找 }，如果 { 在这之前则递归到下一层
				rb = tpl.indexOf("}", prevIndex);
				if (rb === -1) {
					rb = tpl.length;
				}

				if (nextlb < rb) {
					// 保存 { 之前的内容
					(nextlb > prevIndex) && parts.push(tpl.substring(prevIndex, nextlb));
					// 获取内嵌的 { } 内容
					ret = parseTempl(tpl, nextlb);
					prevIndex = ret.end + 1;
					parts.push(ret.data);
					nextlb = tpl.indexOf("{", prevIndex);
				} else {
					nextlb = -1;
				}
			}
		}

		rb = tpl.indexOf("}", prevIndex);
		if (rb === -1) {
				rb = tpl.length;
			}
		parts.push(tpl.substring(prevIndex, rb));

		ret = { data: "", end: rb };

		// 获取当前节的 key
		var first = parts[0],si;
		if (first && first.substr && first.substr(0, 1) === "{") {
			si = first.indexOf(" ");
			if (si > 0) {
				key = first.substring(1, si);
				parts[0] = first.substr(si + 1);
				ret.data = {
					key: key,
					parts: parts
				};
			} else {
				key = first.substr(1);
				ret.data = "{" + key + "}";
			}
		}
		return ret;
	};

	var processTempl = function (node, data) {
		var //isArray = YAHOO.lang.isArray,
			//substitute = YAHOO.lang.substitute,
			isArray = function(s){return s instanceof Array;},
			substitute = function substitute (str, obj) {
						if (!(Object.prototype.toString.call(str) === '[object String]')) {
							return '';
						}

						if(!(Object.prototype.toString.call(obj) === '[object Object]' && 'isPrototypeOf' in obj)) {
							return str;
						}

						return str.replace(/\{([^{}]+)\}/g, function(match, key) {
							var value = obj[key];
							return ( value !== undefined) ? ''+value :'';
						});
					},
			html = [],
			parts = node.parts,
			part, i, j, strArr = [],
			tpl;

		if (!data) { return ""; }

		if (isArray(data)) {
			for (i = 0; i < data.length; ++i) {
				html.push(processTempl(node, data[i]));
			}
		} else {
			for (i = 0; i < parts.length; ++i) {
				part = parts[i];
				if (typeof part === "string") {
					strArr.push(part);
				} else {
					if (strArr.length > 0) {
						html.push(substitute(strArr.splice(0, strArr.length).join(""), data));
					}
					html.push(processTempl(part, part.key ? data[part.key] : data));
				}
			}
			if (strArr.length > 0) {
				html.push(substitute(strArr.splice(0, strArr.length).join(""), data));
			}
		}
		return html.join("");
	};

	var processor = function (tpl, data) {
		var tplTree, root;
		if (typeof tpl === "string") {
			tplTree = parseTempl("{root " + tpl + "}");
			root = tplTree.data;
		} else if (tpl.key && tpl.parts) {
			root = tpl;
		}
		return processTempl(root, data);
	};

	return {
		parse: function (tpl) {
			return parseTempl("{root " + tpl + "}").data;
		},
		process: processor
	};
}();

