
/**
 * Created by sgjeon on 16. 4. 8..
 */
const clc = require('cli-color');
const slice = [].slice;

module.exports = {
	log: function (){
		console.log(clc.white.apply(clc, slice.call(arguments, 0)));
	},
	warn: function(){
	    console.log(clc.yellow.apply(clc, slice.call(arguments, 0)));
	},
	error: function(){
	    console.log(clc.red.apply(clc, slice.call(arguments, 0)));
	}
};