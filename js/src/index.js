define(function(require){
	var $ = require('../sea-modules/jquery/1.7.2/jquery'); 
	require('./slider')($);

	$(function(){
		$('#J_Slider01').goSlider({
			'animation' : 'fade'
		});
		
		$('#J_Slider02').goSlider({
			'animation' : 'slide',
			'showControl' : false,
			'orientation' : 'vertical'
		});
		
		if(('#J_Slider03 .j-con').length > 1){
			$('#J_Slider03').goSlider({
				'animation' : 'slide',
				'showControl' : false,
				'orientation' : 'vertical',
				'sliderWrap' : '.j-slider',
				'sliderItem' : '.j-con'
			});
		}
	});
});