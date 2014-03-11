relativeSlider
==============
jquery.relativeSlider
Relative Sliders for jQuery UI.

relativeSlider 1.0.0 - jQuery plugin to calculate the relative worth of individual sliders relative to the total selected value

Copyright (c) 2014 Pery Systems Inc. Dual licensed under the MIT and GPL licenses: http://www.opensource.org/licenses/mit-license.php http://www.gnu.org/licenses/gpl.html

Demo:
http://www.perrysysinc.com/Demos/RelativeSlider

Example Usage:

$('.my-slider').relativeSlider('init', {onChange : function(calculatedValues){
  console.log(calculatedValues);
}});
