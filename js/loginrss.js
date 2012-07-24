
if(NECtrl==undefined){
var NECtrl={};
}
NECtrl.CxtInput=Class.create();
NECtrl.CxtInput.prototype.initialize=function(oParent,oOptions){
oParent=$id(oParent);
if(!oParent)return;
oOptions=oOptions||{};
this.body=document.createElement('div');
this.body.className=oOptions.className||'';
this.cbChange=oOptions.onchange||Prototype.emptyFunction;
this.cbSuccess=oOptions.onsuccess;
var str='<span id="loginUserNameWrapper" class="ipt-wrap"><input type="text" autocomplete="off" class="ipt" value="name@example.com" style="color:#bbbbbb" '
+'onfocus="if(this.value==\'name@example.com\'){this.value=\'\';this.style.color=\'#000000\';}"'
+'onblur="if(this.value==\'\'){this.value=\'name@example.com\';this.style.color=\'#bbbbbb\';}"';
if(oOptions.inputId)str+=' id="'+oOptions.inputId+'"'+' name="'+oOptions.inputId+'"';
str+='/></span><div class="'+oOptions.className+'-cxt" style="display:none;"></div>';
this.body.innerHTML=str;
this.input=this.body.getElementsByTagName('input')[0];
this.context=this.body.getElementsByTagName('div')[0];
Event.observe(this.input,'input',this.onChange.bind(this));
Event.observe(this.input,'propertychange',this.onChange.bind(this));
Event.observe(this.input,'keypress',this.onKeyPress.bindAsEventListener(this));
Event.observe(document,'click',this.onClick.bind(this));
oParent.appendChild(this.body);
};
NECtrl.CxtInput.prototype.onChange=function(){
if(this.input.value==''||this.input.value=='name@example.com'){
this.context.style.display='none';
return;
}
this.cbChange(this.input.value,this.onListChange.bind(this));
};
NECtrl.CxtInput.prototype.onListChange=function(list){
if(!list||!list.length){
this.resetList([]);
this.context.style.display='none';
}else{
this.resetList(list);
this.context.style.display='';
}
};
NECtrl.CxtInput.prototype.onKeyPress=function(event){
switch(event.keyCode){
case 9:
case 13:
this.select(this.context.curIndex);
Event.stop(event);
break;
case 38:
if(this.context.curIndex>0){
Element.removeClassName(this.context.getElementsByTagName('div')[this.context.curIndex+1],'cur');
this.context.curIndex--;
Element.addClassName(this.context.getElementsByTagName('div')[this.context.curIndex+1],'cur');
}
break;
case 40:
if(this.context.curIndex<this.list.length-1){
Element.removeClassName(this.context.getElementsByTagName('div')[this.context.curIndex+1],'cur');
this.context.curIndex++;
Element.addClassName(this.context.getElementsByTagName('div')[this.context.curIndex+1],'cur');
}
break;
}
};
NECtrl.CxtInput.prototype.resetList=function(list){
if(!list||!list.length)list=[];
this.list=list;
for(var i=0,cs=this.context.childNodes,len=cs.length;i<len;i++)
this.context.removeChild(this.context.firstChild);
var frag=document.createDocumentFragment(),tpl=document.createElement('div'),div;
div=tpl.cloneNode(false);
div.className='hint';
div.innerText=div.textContent='请选择或继续输入...';
div.onclick=this.select.bind(this,this.context.curIndex);
frag.appendChild(div);
for(var i=0,l=list.length,self=this;i<l;i++){
div=tpl.cloneNode(false);
div.innerText=div.textContent=list[i];
if(i==0){
Element.addClassName(div,'cur');
this.context.curIndex=i;
}
div.onmouseover=this.onMouseOver.bind(this,i);
frag.appendChild(div);
}
this.context.appendChild(frag);
};
NECtrl.CxtInput.prototype.onMouseOver=function(index){
Element.removeClassName(this.context.getElementsByTagName('div')[this.context.curIndex+1],'cur');
this.context.curIndex=index;
Element.addClassName(this.context.getElementsByTagName('div')[this.context.curIndex+1],'cur');
};
NECtrl.CxtInput.prototype.onClick=function(){
if(this.context.curIndex!=undefined&&this.context.style.display!='none')this.select(this.context.curIndex);
};
NECtrl.CxtInput.prototype.select=function(index){
if(this.list&&this.list.length>0){
this.input.value=this.list[index];
}
this.context.style.display='none';
this.cbSuccess&&this.cbSuccess();
};
if(NetEase==undefined){
var NetEase={};
}
if(NetEase.Act==undefined){
NetEase.Act={};
}
NetEase.Act.quickLoginTemplate=null;
NetEase.indexLoginTemplate=null;
var ckLoginInfoKey="NEBLOG_LOGIN";
var ckLoginInfo={type:null,name:null,pass:null};
var ckPath="/";
var ckDomain=DomainMap.cookieDomain;
NetEase.Act.QuickLogin=Class.create();
NetEase.Act.QuickLogin.prototype={
initialize:function(presentShowId,serverName,bFromIndex){
this.options=Object.extend({
err:false,
jsWindowManager:null,
loginTarget:null,
invitor:null,
group:null,
app:null
},arguments[3]||{});
this.presentShowId=presentShowId;
this.serverName=serverName;
this.bFromIndex=bFromIndex;
this.err=false;
this.jsWindowManager=this.options.jsWindowManager;
this.objUsername;
this.objPassword;
this.objSetCkCheck;
this.frmLogin;
this.btn_login;
this.btn_reg;
this.curUserType=0;
this.isPwdFromCk=false;
this.pwdFromCk;
this.pwdFromCkTrim;
this.strUsername;
this.strPassword;
this.qLoginZone=null;
this.loginTarget=this.options.loginTarget;
this._load();
},
_load:function(){
if(!this.bFromIndex||this.presentShowId=="qIndexLoginDiv"){
if(NetEase.Act.quickLoginTemplate==null)
NetEase.Act.quickLoginTemplate=NetEase.Act.quicklogin_jst;
var regUrl="http://reg.163.com/reg0.shtml?product=easyread&url=http://"+window.location.host+"/index.do";
var data={err:false,regUrl:regUrl};
var result=NetEase.Act.quickLoginTemplate.processUseCache(data);
if(this.presentShowId){
this.qLoginZone=this.jsWindowManager.createWindow(this.presentShowId,{
className:'m-layer m-layer-s',width:475,height:292,hideFlash:true,useGlay:false,
title:'你哈哈登录网易通行证',onTop:true,notKeepPos:true,useShadow:false
});
this.qLoginZone.panel.innerHTML=result;
this.qLoginZone.showWindow();
}
}else{
if(NetEase.indexLoginTemplate==null)
NetEase.indexLoginTemplate=indexlogin_jst;
var data={err:false};
var result=NetEase.indexLoginTemplate;
$id("outLoginDiv").innerHTML=result;
}
var input=new NECtrl.CxtInput('div_in_username',{inputId:'in_username',className:'cxt-input',onchange:neteaselogin_getList,onsuccess:function(){
try{
$id('in_password_new').focus();
}catch(e){
}
}});
this.frmLogin=$id("frmLogin");
this.frmLogin.setAttribute('autocomplete','off');
this.objUsername=$id("in_username");
this.objPassword=$id("in_password_new");
this.objSetCkCheck=$id("setCookieCheck");
if(document.all){
this.objUsername.attachEvent("onblur",this.newCheckUsername.bind(this));
this.objPassword.attachEvent("onfocus",this.fnPassOnFocus.bind(this));
this.objPassword.attachEvent("onblur",this.checkPassword.bind(this));
$id("qLoginButt").attachEvent("onclick",this.dologin.bind(this));
this.frmLogin.attachEvent("onkeypress",this.frmDologinIE.bind(this));
this.objSetCkCheck.attachEvent("onclick",this.changeCookieCheck.bind(this));
}else{
this.objUsername.addEventListener("blur",this.newCheckUsername.bind(this),true);
this.objPassword.addEventListener("focus",this.fnPassOnFocus.bind(this),true);
this.objPassword.addEventListener("blur",this.checkPassword.bind(this),true);
$id("qLoginButt").onclick=this.dologin.bind(this);
this.frmLogin.onkeypress=this.frmDologin.bind(this);
this.objSetCkCheck.onclick=this.changeCookieCheck.bind(this);
}
this.selectUserType();
},
showWindow:function(target,title,submitButtonValue){
if(target){
this.loginTarget=target;
}
if(title){
this.jsWindowManager.updateTitle(this.presentShowId,title);
}
if(submitButtonValue){
$id("qLoginButt").value=submitButtonValue;
}
this.qLoginZone.showWindow();
},
frmDologinIE:function(){
if(event.keyCode==13)
this.dologin();
},
frmDologin:function(event){
if(event.keyCode==13)
this.dologin();
},
changeCookieCheck:function(){
if(!this.objSetCkCheck.checked){
clearLoginCookie();
}
if(this.objSetCkCheck.value=='on'){
this.objSetCkCheck.value='off';
}else{
this.objSetCkCheck.value='on';
this.objSetCkCheck.checked=false;
}
},
checkUsername:function(){
var strUsername=this.getUserName();
strUsername=Trim(strUsername);
var filter=/^[@0-9a-zA-Z_\.\-\s]+$/;
if(false==filter.test(strUsername)||strUsername.indexOf(" ")>0){
return false;
}
return true;
},
newCheckUsername:function(){
var strUsername=this.getUserName();
strUsername=Trim(strUsername);
var filter=/^[@0-9a-zA-Z_\.\-\s]+$/;
if(false==filter.test(strUsername)||strUsername.indexOf(" ")>0){
$id('untip').style.display='block';
tiptime=setTimeout(function(){
$id('untip').style.display='none';
},2000);
return false;
}
return true;
},
checkPasswordFocus:function(){
var strPassword=this.objPassword.value;
if(strPassword==""){
strPassword=ckLoginInfo.pass;
if(null!=strPassword){
this.pwdFromCk=strPassword;
this.pwdFromCkTrim=strPassword;
this.isPwdFromCk=true;
this.objPassword.value=strPassword;
}
}
this.checkPassword();
},
fnPassOnFocus:function(){
this.objPassword.select();
this.checkPassword();
},
checkPassword:function(){
var strPassword=this.objPassword.value;
if(null==strPassword||strPassword==""){
this.isPwdFromCk=false;
}
var rePassword=/^[\s]*$/g;
if(strPassword.match(rePassword)!=null){
return false;
}else{
return true;
}
},
dologin:function(){
if(this.checkUsername()&&this.checkPassword()){
this.objUsername.disabled=true;
this.objPassword.disabled=true;
if(document.all){
this.objUsername.detachEvent("onblur",this.checkUsername);
this.objPassword.detachEvent("onfocus",this.checkPassword);
this.objPassword.detachEvent("onblur",this.checkPassword);
$id("frmLogin").detachEvent("onkeypress",this.frmDologinIE);
$id("qLoginButt").detachEvent("onclick",this.dologin);
this.objSetCkCheck.detachEvent("onclick",this.changeCookieCheck);
}else{
this.objUsername.removeEventListener("blur",this.checkUsername,true);
this.objPassword.removeEventListener("focus",this.checkPassword,true);
this.objPassword.removeEventListener("blur",this.checkPassword,true);
}
var strPassword=this.objPassword.value;
var strUsername=Trim(this.objUsername.value.toLowerCase());
var bSavePass=this.objSetCkCheck.checked;
this.strUsername=strUsername;
this.strPassword=strPassword;
var loginForm=$id("frmLogin");
var _target=this.loginTarget;
if(bSavePass){
this.setFormValue(loginForm,"savelogin",1);
}else{
this.setFormValue(loginForm,"savelogin",0);
}
this.setFormValue(loginForm,"username",this.strUsername);
this.setFormValue(loginForm,"password",this.strPassword);
this.setFormValue(loginForm,"url",_target);
this.setFormValue(loginForm,"type",1);
this.setFormValue(loginForm,"product","easyread");
loginForm.target="_self";
loginForm.action="https://reg.163.com/logins.jsp";
loginForm.method="post";
loginForm.submit();
}
return false;
},
setFormValue:function(form,name,value){
if(form[name]){
form[name].value=value;
}else{
var e=document.createElement("input");
e.setAttribute("type","hidden");
e.setAttribute("name",name);
e.setAttribute("value",value);
form.appendChild(e);
}
},
calTarget:function(){
if(this.loginTarget==null){
if($id("$_oppoPageUrlForLogin")&&(UD.hostName==this.strUsername)){
if(UD.hostPath=="")
this.loginTarget="http://"+DomainMap.getParentDomain(this.strUsername)+$id("$_oppoPageUrlForLogin").value;
else
this.loginTarget=$id("$_oppoPageUrlForLogin").value;
}
else
this.loginTarget=window.location;
}
},
getUserName:function(){
var strUsername=this.objUsername.value;
return strUsername;
},
selectUserType:function(){
this.objPassword.value="";
var userNameInit=ckLoginInfo.name;
if(userNameInit){
this.objUsername.value=userNameInit;
this.checkPasswordFocus();
this.objSetCkCheck.checked=true;
}else{
this.objSetCkCheck.checked=false;
}
var urlStr=window.location.href;
var i=urlStr.indexOf("err=");
if(i!=-1){
var errStr=urlStr.charAt(i+4);
if(errStr=="1"||errStr=="2"||errStr=="3"||errStr=="4"){
var n=parseInt(errStr);
if(n>3)n=1;
}
}
this.checkUsername();
return false;
}
};
function clearLoginCookie(){
ckLoginInfo.name=null;
ckLoginInfo.pass=null;
Cookie.clear(ckLoginInfoKey,ckPath);
if(ckLoginInfo.type!=null&&ckLoginInfo.type!=undefined&&ckLoginInfo.type!="null")
Cookie.set(ckLoginInfoKey,ckLoginInfo.type,30,ckPath,ckDomain);
}
var Cookie={
set:function(name,value,expirationInDays,path,domain){
var cookie=escape(name)+"="+escape(value);
if(expirationInDays){
var date=new Date();
date.setDate(date.getDate()+expirationInDays);
cookie+="; expires="+date.toGMTString();
}
if(path){
cookie+=";path="+path;
}
if(domain){
cookie+=";domain="+domain;
}
document.cookie=cookie;
if(value&&(expirationInDays==undefined||expirationInDays>0)&&!this.get(name)){
return false;
}
},
clear:function(name,path){
this.set(name,"",-1,path,ckDomain);
},
get:function(name){
var pattern="(^|;)\\s*"+escape(name)+"=([^;]+)";
var m=document.cookie.match(pattern);
if(m&&m[2]){
return unescape(m[2]);
}else{
return null;
}
}
};
NetEase.Act.quicklogin_jst=new String('\
<div class="lyct">\
    <div class="m-login">\
		<h4>登录到网易云阅读</h4>\
        <form name="frmLogin"  id="frmLogin"  method="post">\
            <div class="row" style="z-index:99999;"><label>帐号：</label><div class="intwrap" id="div_in_username"></div></div>\
   <div id="untip" class="row-2" style="display: none;">帐号名格式错误，请重新输入！</div>\
            <div class="row"><label>密码：</label><div class="intwrap"><span class="ipt-wrap"><input class="ipt" type="password" name="in_password_new" id="in_password_new" tabindex="2"/></span></div></div>\
            <div class="row row-1">\
                <input type="checkbox" name="setCookieCheck" id="setCookieCheck" tabindex="3" /><label class="auto">两周内自动登录</label>\
                <a href="http://reg.163.com/RecoverPasswd1.shtml" target="_blank" tabindex="4">忘记密码？</a>\
            </div>\
            <div class="row row-1">\
                <button id="qLoginButt" tabindex="5"><span>登录</span></button>\
                <a class="wyt" href="${regUrl}" target="_blank" tabindex="6">注册网易通行证&gt;&gt;</a>\
            </div>\
        </form>\
    </div>\
</div>');
var neteaselogin_posts=['@163.com','@126.com','@yeah.net','@vip.163.com','@vip.126.com','@popo.163.com','@188.com','@qq.com','@yahoo.com','@sina.com'];
function neteaselogin_getList(value,cb){
if(value==undefined||value==''||!cb)return;
var arr=/([^@]*)(.*)/.exec(value),list=[];
var pre=arr[1],post=arr[2];
neteaselogin_posts.each(function(pt){
if(pt.indexOf(post)!=-1){
list.push(pre+pt);
}
});
cb(list);
}
String.prototype.processUseCache=function(context,optFlags){
if(this.__template__==null)
this.__template__=TrimPath.parseTemplate(this,null);
if(this.__template__!=null)
return this.__template__.process(context,optFlags);
return this;
};
g_quickLoginCon_new=null;
var jsWindowManager_new=new NetEase.JSWindowManager({allowDrag:false,systemBarClassName:''});
function showLoginDlg_New(serverName,loginTarget){
if(g_quickLoginCon_new==null){
g_quickLoginCon_new=new NetEase.Act.QuickLogin("qLoginDivNew",serverName,false,{err:false,jsWindowManager:jsWindowManager_new,loginTarget:loginTarget});
var iptArr=$id$cls('$_qLoginDivNew','ipt');
for(var i=0;i<iptArr.length;i++){
evton(iptArr[i],'focus',function(e){
addClass(target(e).parentNode,'focus');
});
evton(iptArr[i],'blur',function(e){
delClass(target(e).parentNode,'focus');
});
}
}
g_quickLoginCon_new.showWindow(loginTarget);
}
function login163(target,handsAwayFromTarget){
var loginTarget=target||location.href;
if(loginTarget.indexOf('logout')!=-1){
loginTarget="http://"+window.location.host;
}
if(!handsAwayFromTarget){
loginTarget='http://'+window.location.host+'/login.do?target='+encodeURIComponent(loginTarget)+'&from=login';
}
showLoginDlg_New(null,loginTarget);
$id$cls('loginUserNameWrapper','ipt')[0].focus();
};
String.prototype.endsWith=function(str){
return(this.match(str+"$")==str);
};
function log163out(target){
if(target){
location.href="http://"+window.location.host+"/logoutRedir.do?target="+encodeURIComponent(target);
}else{
location.href="http://"+window.location.host+"/logout";
}
}