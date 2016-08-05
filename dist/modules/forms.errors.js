if (typeof Thunbolt !== 'object') {
	var Thunbolt = {};
}

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

var _tmp = (function ($) {
	var helpers = Thunbolt.Helpers;

	if (helpers.isUndefined($)) {
		helpers.printError('jQuery missing.');
		return;
	}
	if (helpers.isUndefined(Nette)) {
		helpers.printError('Nette forms missing.');
		return;
	}
	if (!helpers.hasMethod(Nette, 'showFormErrors')) {
		helpers.printError('Install newer version of nette forms.');
		return;
	}

	return {
		renderers: {},
		defaultRenderer: 'bootstrap',
		isInitialized: false,
		renderer: null,
		init: function (renderer) {
			if (this.isInitialized) {
				return;
			}
			this.isInitialized = true;
			renderer = renderer || this.defaultRenderer;

			if (!renderer in this.renderers) {
				helpers.printError('Renderer "' + renderer + '" not exists.');
				return;
			}
			this.renderer = renderer = this.renderers[renderer];

			Nette.showFormErrors = function (form, errors) {
				renderer.render(form, errors);
			};
		},
		addListenerOnChange: function () {
			var form, i, j, self = this;
			Nette.addEvent(document, 'DOMContentLoaded', function() {
				for (i = 0; i < document.forms.length; i++) {
					form = document.forms[i];
					for (j = 0; j < form.elements.length; j++) {
						if (form.elements[j].getAttribute('data-nette-rules')) {
							self.initOnChangeForm(form);
							break;
						}
					}
				}
			});
		},
		initOnChangeForm: function (form) {
			var i, element, self = this;

			for (i = 0; i < form.elements.length; i++) {
				element = form.elements[i];
				element.addEventListener('change', function (e) {
					Nette.formErrors = [];
					if (!Nette.validateControl(this) && Nette.formErrors.length) {
						self.renderer.renderControl(this, Nette.formErrors[Nette.formErrors.length - 1].message);
						if (e && e.stopPropagation) {
							e.stopPropagation();
							e.preventDefault();
						} else if (window.event) {
							event.cancelBubble = true;
							event.returnValue = false;
						}
					} else {
						self.renderer.removeControlError(this);
					}
					Nette.formErrors = [];
				});
			}
		},
		addRenderer: function (name, renderer) {
			if (!helpers.isObject(renderer)) {
				helpers.printError('Renderer "' + name + '" must be an object.');
				return;
			}
			if (!helpers.hasMethod(renderer, 'render')) {
				helpers.printError('Renderer "' + name + '" must have method render.');
				return;
			}
			if (!helpers.hasMethod(renderer, 'removeControlError')) {
				helpers.printError('Renderer "' + name + '" must have method removeControlError.');
				return;
			}
			if (!helpers.hasMethod(renderer, 'renderControl')) {
				helpers.printError('Renderer "' + name + '" must have method renderControl.');
				return;
			}

			this.renderers[name] = renderer;
		}
	};
})(jQuery);

Thunbolt.FormErrors = _tmp;

(function ($) {
	var helpers = Thunbolt.Helpers;

	var ctrl = {
		render: function (form, errors) {
			var focus, self = this, form = $(form);
			this.removeErrors(form);

			$.each(errors, function (i, val) {
				self.renderControl(val.element, val.message);
				if (!focus && val.focus) {
					focus = val;
				}
			});

			if (focus) {
				focus.focus();
			}
		},
		renderControl: function (el, message) {
			this.removeControlError(el);
			el = $(el);
			var target, attr = el.attr('data-errors-target');
			if (helpers.isUndefined(attr) || !attr) {
				target = this.createTarget(el);
			} else {
				target = $(attr);
			}

			target.text(message);
			el.closest('.form-group').addClass('has-error');
		},
		createTarget: function (el) {
			var target = $(document.createElement('span')).addClass('help-block').attr('data-has-error-rendered', 'true');
			el.after(
				target
			);

			return target;
		},
		removeControlError: function (ctrl) {
			ctrl = $(ctrl);
			var target = ctrl.attr('data-errors-target');
			if (helpers.isUndefined(target) || !target) {
				ctrl.next('[data-has-error-rendered]').remove();
			} else {
				$(target).text('');
			}

			ctrl.closest('.form-group.has-error').removeClass('has-error');
		},
		removeErrors: function (form) {
			form.find('[data-has-error-rendered]').remove();
			form.find('.form-group.has-error').removeClass('has-error');
		}
	};

	Thunbolt.FormErrors.addRenderer('bootstrap', ctrl);
})(jQuery);
