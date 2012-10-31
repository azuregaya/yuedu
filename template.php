<!DOCTYPE html>
<html>
<head>
<meta http-equiv="content-type" content="text/html;charset=utf-8"/>
<title>阅读首页</title>
<meta name="keywords" content=""/>
<meta name="description" content=""/>
<link type="text/css" rel="stylesheet" href="css/header.css"/>
<link type="text/css" rel="stylesheet" href="css/layer.css"/>
</head>
<body>
<noscript>请使用支持脚本的浏览器！</noscript>
<div class="g-doc">
	<div class="g-hdw">
		<?php
			include 'snip/header_normal.html';//加入头部内容
		?>
	</div>
	<div class="g-bdw">
		<div id="J_Container"></div>
	</div>
    <div class="g-ftw">
    	<?php
			include 'snip/footer_normal.html';//加入页脚内容
		?>
    </div>
</div>
<script src="js/sea-modules/seajs/1.2.1/sea.js"></script>
<script>
(function(){
	seajs.use('./js/src/header');
})();

</script>
</body>
</html>