/* 设备判断 */
function checkBrowser () {
	var ua = navigator.userAgent.toLowerCase();
	var clientArr = ["ipad","iphone os","android"];
	
	for (var i = 0; i < clientArr.length; i++) {
		if(ua.indexOf(clientArr[i]) != -1){
			switch(clientArr[i]){
				case "ipad":
					console.log("goto ipad");
				break;
				case "iphone os":
					console.log("goto iphone");
				break;
				case "android":
					console.log("goto android");
				break;

				default:
					console.log("goto default");
			}
		}
	}		
};