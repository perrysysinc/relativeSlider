/*
 * relativeSlider 1.0.0 - multi level grouping indicators for tables
 * Version 1.0.0
 * @requires jQuery v1.6+ and jQuery.ui
 * 
 * Copyright (c) 2014 Perry Systems
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 */
/*
 * @description jQuery plugin to calculate the relative worth of individual sliders relative to the total selected value..
 * @example $('.skills-slider').relativeSlider('init');
 */
 
(function( $ ) {
 
    $.fn.relativeSlider = function( action, options ) {
		var self = {};
		self.callers = this;
		//http://jsfiddle.net/bruno/4DU2H/1/
		//http://stackoverflow.com/questions/13483430/how-to-make-rounded-percentages-add-up-to-100
		self.percentageFixer = function ( orig, target ) {

			var i = orig.length, j = 0, total = 0, change, newVals = [], next, factor1, factor2, len = orig.length, marginOfErrors = [];

			// map original values to new array
			while( i-- ) {
				total += newVals[i] = Math.round( orig[i] );
			}

			change = total < target ? 1 : -1;

			while( total !== target ) {

				// select number that will be less affected by change determined 
				// in terms of itself e.g. Incrementing 10 by 1 would mean 
				// an error of 10% in relation to itself.
				for( i = 0; i < len; i++ ) {

					next = i === len - 1 ? 0 : i + 1;

					factor2 = errorFactor( orig[next], newVals[next] + change );
					factor1 = errorFactor( orig[i], newVals[i] + change );

					if(  factor1 > factor2 ) {
						j = next; 
					}
				}

				newVals[j] += change;
				total += change;
			}


			for( i = 0; i < len; i++ ) { marginOfErrors[i] = newVals[i] && Math.abs( orig[i] - newVals[i] ) / orig[i]; }

			for( i = 0; i < len; i++ ) {
				for( j = 0; j < len; j++ ) {
					if( j === i ) continue;

					var roundUpFactor = errorFactor( orig[i], newVals[i] + 1)  + errorFactor( orig[j], newVals[j] - 1 );
					var roundDownFactor = errorFactor( orig[i], newVals[i] - 1) + errorFactor( orig[j], newVals[j] + 1 );
					var sumMargin = marginOfErrors[i] + marginOfErrors[j];

					if( roundUpFactor < sumMargin) { 
						newVals[i] = newVals[i] + 1;
						newVals[j] = newVals[j] - 1;
						marginOfErrors[i] = newVals[i] && Math.abs( orig[i] - newVals[i] ) / orig[i];
						marginOfErrors[j] = newVals[j] && Math.abs( orig[j] - newVals[j] ) / orig[j];
					}

					if( roundDownFactor < sumMargin ) { 
						newVals[i] = newVals[i] - 1;
						newVals[j] = newVals[j] + 1;
						marginOfErrors[i] = newVals[i] && Math.abs( orig[i] - newVals[i] ) / orig[i];
						marginOfErrors[j] = newVals[j] && Math.abs( orig[j] - newVals[j] ) / orig[j];
					}

				}
			}


			function errorFactor( oldNum, newNum ) {
				return Math.abs( oldNum - newNum ) / oldNum;
			}

			return newVals;
		}
		
        self.settings = $.extend({
        }, options );
		
		
		self.onSliderChange = function(){
			var calculatedValues = self.calculateSliders();
			self.settings.onChange.apply(self, [calculatedValues]);
		}
		
		self.calculateSliders = function(){
			var calculateResult = {};
			var totalValue =  0;
			var calculatedValues = {};
			var slidersCount = self.callers.length;
			self.callers.each(function() {
				var $currentSlider = $(this);
				 var currentValue = parseInt($currentSlider.slider('value'));
				 totalValue += currentValue;
				 calculatedValues[$currentSlider.attr('id')] = {value : currentValue};
			});
			
			var percentages = [];
			for (var x in calculatedValues){
				if (!(totalValue > 0)){
					var perc = 100 / slidersCount;
					percentages.push(perc)
				}else{
					var perc = (100/ totalValue ) * calculatedValues[x].value;
					percentages.push(perc);
				}
			}
			
			var fixedPercentages = self.percentageFixer(percentages, 100);
			var percIndex = 0;
			for (var x in calculatedValues){
				calculatedValues[x].percentage = fixedPercentages[percIndex];
				percIndex++;
			}
				
			calculateResult.totalValue = totalValue;
			calculateResult.slidersCount = slidersCount;
			calculateResult.sliders = calculatedValues;
			
			return calculateResult;
		}
		
        if ( action === "init") {
			var slidersResult =  self.callers.each(function() {
				  var $currentSlider = $(this);
				  var currentValue = parseInt($currentSlider.text());
				  $( this ).empty().slider({
						value: currentValue,
						min : 0,
						max : 100,
						range: "min",
						animate: true,
						orientation: "horizontal",
						change : self.onSliderChange
				  }).css({'visibility': 'visible'});
			});
			
			self.onSliderChange();
			return slidersResult;
        }
 
        if ( action === "calculate" ) {
			return self.calculateSliders();
        }
 
    };
 
}( jQuery ));