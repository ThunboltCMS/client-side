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
