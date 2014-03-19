/* global Backbone, jQuery, _, BasisBuilderApp, setUserSetting, deleteUserSetting, basisHTMLBuilderData */
var oneApp = oneApp || {};

(function (window, Backbone, $, _) {
	'use strict';

	oneApp.MenuView = Backbone.View.extend({
		el: '#ttf-one-menu',

		$stage: $('#ttf-one-stage'),

		$document: $(window.document),

		$scrollHandle: $('html, body'),

		$pane: $('.ttf-one-menu-pane'),

		initialize: function () {
			this.listenTo(oneApp.sections, 'add', this.addOne);
		},

		events: {
			'click .ttf-one-menu-list-item-link': 'addSection',
			'click .ttf-one-menu-tab-link': 'menuToggle'
		},

		addSection: function (evt) {
			evt.preventDefault();

			var $evt = $(evt),
				$target = $($evt.get(0).currentTarget),
				sectionType = $target.attr('data-section').replace(/\W/g, ''); // Get and sanitize section

			// Add a new model to the collection with the specified section type
			oneApp.sections.create({
				sectionType: sectionType,
				sectionNumber: new Date().getTime()
			});
		},

		addOne: function (section) {
			// Create view
			var view = new oneApp.SectionView({
				model: section
			});

			// Append view
			var html = view.render().el;
			this.$stage.append(html);

			// Scroll to the new section
			this.$scrollHandle.animate({
				scrollTop: parseInt($('#' + view.id).offset().top, 10) - 32 - 9 // Offset + admin bar height + margin
			}, 800, 'easeOutQuad');

			oneApp.sections.toggleStageClass();
			oneApp.initAllEditors(view.id, section);
		},

		menuToggle: function(evt) {
			evt.preventDefault();
			var id = ttfOneBuilderData.pageID,
				key = 'ttfonemt' + parseInt(id, 10);

			// Open it down
			if (this.$pane.is(':hidden')) {
				this.$pane.slideDown({
					duration: oneApp.options.openSpeed,
					easing: 'easeInOutQuad',
					complete: function() {
						deleteUserSetting( key );
						this.$el.addClass('ttf-one-menu-opened').removeClass('ttf-one-menu-closed');
					}.bind(this)
				});

			// Close it up
			} else {
				this.$pane.slideUp({
					duration: oneApp.options.closeSpeed,
					easing: 'easeInOutQuad',
					complete: function() {
						setUserSetting( key, 'c' );
						this.$el.addClass('ttf-one-menu-closed').removeClass('ttf-one-menu-opened');
					}.bind(this)
				});
			}
		}
	});
})(window, Backbone, jQuery, _);