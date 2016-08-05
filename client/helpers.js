if (typeof Thunbolt.Helpers !== 'object') {
	var _tmp = (function ($) {
		return {
			hasMethod: function (obj, method) {
				return typeof obj[method] === 'function';
			},
			isObject: function (obj) {
				return typeof obj === 'object';
			},
			isCallable: function (callback) {
				return typeof callback === 'function';
			},
			isUndefined: function (v) {
				return typeof v === 'undefined';
			},
			printError: function (msg) {
				console.error('WebChemistry: ' + msg);
			},
			hasProperty: function (obj, name) {
				if (!this.isObject(obj)) {
					return false;
				}

				return name in obj;
			},
			parseJSON: function (str) {
				return $.parseJSON(str);
			},
			/**
			 * @param {...object}
			 * @return object
			 */
			merge: function () {
				var args = arguments;
				Array.prototype.unshift.call(args, true);

				return $.extend.apply(this, args);
			}
		};
	})(jQuery);

	Thunbolt.Helpers = _tmp;
}
