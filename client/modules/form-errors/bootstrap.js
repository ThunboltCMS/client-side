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
