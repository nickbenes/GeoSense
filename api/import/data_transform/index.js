var errors = require('../../../errors'),
	ValidationError = errors.ValidationError,
	console = require('../../../ext-console.js'),
	util = require('util'),
	_ = require('cloneextend');

var ARRAY_SEPARATORS = /[,;]/;

var DataTransformError = function(msg, errors) {
	DataTransformError.super_.call(this, msg, this.constructor);
    this.errors = errors;
}
util.inherits(DataTransformError, errors.BasicError)
DataTransformError.prototype.name = 'DataTransformError';
DataTransformError.prototype.message = 'Transform Error';

var ValueSkippedWarning = function(msg, errors) {
	ValueSkippedWarning.super_.call(this, msg, this.constructor);
}
util.inherits(ValueSkippedWarning, errors.BasicError)
ValueSkippedWarning.prototype.name = 'ValueSkippedWarning';
ValueSkippedWarning.prototype.message = 'Value Skipped';

function isErr(val) {
	return val instanceof Error;
}

function isEmpty(val) {
	return val == '' || val == undefined || val == null;
}

function isValidDate(d) {
	if ( Object.prototype.toString.call(d) !== "[object Date]" )
    	return false;
	return !isNaN(d.getTime());
}

var clamp180 = this.clamp180 = function(deg) 
{
	if (deg < -360 || deg > 360) {
		deg = deg % 360;	
	} 
	if (deg < -180) {
		deg = 180 + deg % 180;
	}
	if (deg > 180) {
		deg = -180 + deg % 180;
	}
	if (deg == 180) {
		deg = -180;
	}

	return deg;
};

var Cast = {

	Number: function(value, options)
	{
		if (options.skipEmpty && isEmpty(value)) {
			return;
		}
		var num = Number(value);
		if (isNaN(num)) {
			return new DataTransformError('Not a number');
		}
		if (!options.skipZero || num != 0) {
			return num;
		}
	},

	String: function(value, options) 
	{
		if (value != undefined) {
			var str = '' + value;
			if (!options.skipEmpty || value != '') {
				return str;
			}
		}
	},

	Array: function(value, options) 
	{
	    if (value != undefined) {
		    if (!Array.isArray(value)) {
		        return [value];
		    } else {
		        return value;
		    }
	    }
	},

	Date: function(value, options) 
	{
		if ((Array.isArray(value) && value.length == 3) || typeof(value) == 'string') {
			var date = new Date(value);
			if (isValidDate(date)) {
				return date;
			}
		}
	}
}

var FieldType = {

	Number: function(from, options) 
	{
		var options = options || {};
		return function() {
			var ret;
			iterFields(from, this, function(num) {
				var num = Cast.Number(num, options);
				if (num != undefined) {
					if (options.min != undefined && num < options.min) {
						ret = new ValueSkippedWarning('Skipping low number: ' + num);
						return false;
					} else if (options.max != undefined && num > options.max) {
						ret = new ValueSkippedWarning('Skipping high number:' + num);
						return false;
					} else {
						ret = num;
						return false;
					}
				}
			});
			return ret;
		};
	},

	Array: function(from, options) 
	{
		var options = options || {},
			cast = options.cast ? Cast[options.cast] : null,
			options = options || {},
			singleElement = from != '*' ?
				(!Array.isArray(from) ? from : from.length == 1 ? from[0] : null) : null;
		return function() {
			var arr = [];
			iterFields(from, this, function(v) {
				if (Array.isArray(v) && singleElement) {
					arr = v;
					return false;
				}
				if (typeof v == 'string' && options.split) {
					if (v != undefined) {
						var splitArr = Cast.Array(v.split(
							options.split === true ? ARRAY_SEPARATORS : options.split));
						if (splitArr) {
							var al = splitArr.length;
							for (var j = 0; j < al; j++) {
								var casted = !cast ? splitArr[j] : cast(splitArr[j], options);
								if (isErr(casted)) {
									arr = casted;
									return false;
								}
								if (!options.skipEmpty || !isEmpty(casted)) {
									arr.push(casted);
								}
							}
						}
					}
				} else {
					var casted = !cast ? v : cast(v, options);
					if (isErr(casted)) {
						arr = casted;
						return false;
					}
					if (!options.skipEmpty || !isEmpty(casted)) {
						arr.push(casted);
					}
				}
			});
			return arr;
		};
	},

	Date: function(from, options) 
	{
		var options = options || {},
			singleElement = from != '*' ?
				(!Array.isArray(from) ? from : from.length == 1 ? from[0] : null) : null;
		return function() {
			var date;
			if (singleElement) {
				date = Cast.Date(this.get(singleElement), options);
				if (!date) {
					return new DataTransformError('No date recognized');
				}
			} else {
				var numbers = [];
				iterFields(from, this, function(val) {
					numbers.push(Cast.Number(val, options));
				});
				date = Cast.Date(numbers);
				if (!date) {
					return new DataTransformError('No date recognized');
				}
			}
			if (date) {
				if (!options.skipFuture || date <= new Date()) {
					return date;			
				} else {
					return new ValueSkippedWarning('Skipping future date: ' + date);
				}
			}
		};
	},

	String: function(from, options) 
	{
		var options = options || {};
		if (!options.format) {
			var arrayOptions = _.cloneextend(options, {
					'cast': 'String'
				}),
				toArray = FieldType.Array(from, arrayOptions);
			return function() {
				var arr = toArray.call(this);
				if (arr) {
					var joined = arr.join(options.join || ', ');
					if (!options.skipEmpty || !isEmpty(joined)) {
						return joined;
					}
				}
			}
		} else {
			return function() {
				var strings = {};
				iterFields(from, this, function(str, key) {
					var str = Cast.String(str, options);
					if (str != undefined) {
						strings[key] = str;
					}
				});
				var formatted = options.format.format(strings); 
				if (!options.skipEmpty || !isEmpty(joined)) {
					return formatted;
				}
			};
		}
	},

	LngLat: function(from, options) 
	{
		var options = options || {},
			arrayOptions = _.cloneextend(options, {
				cast: 'Number',
				split: true,
				skipZero: false
			}),
			toArray = FieldType.Array(from, arrayOptions);
		return function() {
			var arr = toArray.call(this);
			if (isErr(arr)) return arr;
			if (arr) {
				if (arr.length != 2) {
					return new DataTransformError('Needs 2D');
				}
				arr = [clamp180(arr[0]), clamp180(arr[1])];
				if (!options.skipZero || (arr[0] != 0 && arr[1] != 0)) {
					return arr;
				} else {
					return new ValueSkippedWarning('Skipping 0,0');
				}
			}
		}
	},
	
	LatLng: function(from, options) 
	{
		var toLngLat = FieldType.LngLat(from, options);
		return function() {
			var arr = toLngLat.call(this);
			if (arr) {
				if (isErr(arr)) return arr;
				return [arr[1], arr[0]];
			}
		}
	}, 

	Object: function(from, options) 
	{
		var options = options || {},
			singleElement = from != '*' ?
				(!Array.isArray(from) ? from : from.length == 1 ? from[0] : null) : null;
		return function() {
			var obj = {};
			iterFields(from, this, function(val, key) {
				if ((singleElement || options.expand) && typeof val == 'object') {
					obj = _.cloneextend(obj, val);
				} else {
					obj[key] = val;
				}
			});
			if (obj == null && options.skipEmpty) {
				return new ValueSkippedWarning('Skipping null');
			}
			return obj;
		}
	}
}

var FieldSetter = function(value) {
	return function() {
		return value;
	}
};

/**
* Iterates over fields in doc and calls a callback for each field.
* Breaks if the callback returns false.
*
* fields can be either a string, an array of strings, or '*' denoting
* all fields in doc. 
*/
var	iterFields = function(fields, doc, callback) {
	var fields = fields == '*' ?
		Object.keys(doc) : Array.isArray(fields) ? fields : [fields];
	fields.forEach(function(key) {
		//console.log(key, '=', doc.get(key));
		if (callback(doc.get(key), key) === false) return;
	});
};

/**
Initializes a DataTransform object based on field definitions, which look like the
following:

	descript = [
		{
			'to': '<to-field-name>',
			'type': 'Number|String|Array|Date|Object',
			'from': '<from-field-name>'|['<field1>', '<field2>', '...'],
			'options': { // all are optional
				'min': <Number>, // for Number
				'max': <Number>, // for Number
				'skipEmpty': <Boolean>, // for Number
				'igoreZero': <Boolean>, // for String
				'skipFuture': <Boolean>, // for Date
				'cast': '<field-type>' // for Array and Object elements
		}
		
		// or
		
		{
			'to': '<to-field-name>',
			'set': <constant-value>
		}
		
		// etc
	]
*/
var DataTransform = function(descript, options) 
{
	var fields = {};
	if (typeof descript != 'object') {
		descript = {};
	}

	for (var i = 0; i < descript.length; i++) {
		var d = descript[i];
		if (d.set) {
			fields[d.to] = FieldSetter(d.set);
		} else if (!d.type || !FieldType[d.type]) {
			throw new ValidationError('Invalid field type: ' + d.type);
		} else {
			fields[d.to] = FieldType[d.type](d.from || d.to, d.options);
		}
	}

	this.fields = fields;
	this.descript = descript;
	this.options = _.cloneextend({
		strict: true
	}, options || {});
};

DataTransform.prototype.transformModel = function(fromDoc, ToModel, config) 
{
	var transformed = {}
		errors = 0;
	for (var to in this.fields) {
		var f = this.fields[to];
		transformed[to] = f.apply(fromDoc, [transformed]);
		if (isErr(transformed[to])) {
			var err = transformed[to],
				log = err instanceof ValueSkippedWarning ? 'warn' : 'error';
			console[log](err.name + ' on field ' + to + ':', err.message);
			errors++;
		}
	}

	var m = null;
	if (ToModel && (!this.options.strict || !errors)) {
		m = new ToModel({}, false);
		for (var key in transformed) {
			m.set(key, transformed[key]);
		}
	}

	if (config && config.DEBUG) {
		console.log('original:', fromDoc);
		console.log('transformed:', transformed);
		console.log('model:', m);
	}
	
	return {
		model: (!this.options.strict || !errors ? m : null),
		transformed: transformed
	};
};

module.exports = {
	DataTransform: DataTransform,
	DataTransformError: DataTransformError,
};