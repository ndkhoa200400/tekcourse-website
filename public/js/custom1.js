// === Dropdown === //

$('.ui.dropdown')
	.dropdown()
	;

// === Model === //
$('.ui.modal')
	.modal({
		blurring: true
	})
	.modal('show')
	;

// === Tab === //
$('.menu .item')
	.tab()
	;

// === checkbox Toggle === //
$('.ui.checkbox')
	.checkbox()
	;

// === Toggle === //
$('.enable.button')
	.on('click', function () {
		$(this)
			.nextAll('.checkbox')
			.checkbox('enable')
			;
	})
	;

// Featured Courses home
$('.courses_performance').owlCarousel({
	items: 10,
	loop: false,
	margin: 30,
	nav: true,
	dots: false,
	navText: ["<i class='uil uil-angle-left'></i>", "<i class='uil uil-angle-right'></i>"],
	responsive: {
		0: {
			items: 1
		},
		600: {
			items: 1
		},
		1000: {
			items: 1
		},
		1200: {
			items: 1
		},
		1400: {
			items: 1
		}
	}
})

// Latest News Dashboard
$('.edututs_news').owlCarousel({
	items: 10,
	loop: false,
	margin: 30,
	nav: true,
	dots: false,
	navText: ["<i class='uil uil-angle-left'></i>", "<i class='uil uil-angle-right'></i>"],
	responsive: {
		0: {
			items: 1
		},
		600: {
			items: 1
		},
		1000: {
			items: 1
		},
		1200: {
			items: 1
		},
		1400: {
			items: 1
		}
	}
})


/*Floating Code for Iframe Start*/
if (jQuery('iframe[src*="https://www.youtube.com/embed/"],iframe[src*="https://player.vimeo.com/"],iframe[src*="https://player.vimeo.com/"]').length > 0) {
	/*Wrap (all code inside div) all vedio code inside div*/
	jQuery('iframe[src*="https://www.youtube.com/embed/"],iframe[src*="https://player.vimeo.com/"]').wrap("<div class='iframe-parent-class'></div>");
	/*main code of each (particular) vedio*/
	jQuery('iframe[src*="https://www.youtube.com/embed/"],iframe[src*="https://player.vimeo.com/"]').each(function (index) {

		/*Floating js Start*/
		var windows = jQuery(window);
		var iframeWrap = jQuery(this).parent();
		var iframe = jQuery(this);
		var iframeHeight = iframe.outerHeight();
		var iframeElement = iframe.get(0);
		windows.on('scroll', function () {
			var windowScrollTop = windows.scrollTop();
			var iframeBottom = iframeHeight + iframeWrap.offset().top;
			//alert(iframeBottom);

			if ((windowScrollTop > iframeBottom)) {
				iframeWrap.height(iframeHeight);
				iframe.addClass('stuck');
				jQuery(".scrolldown").css({ "display": "none" });
			} else {
				iframeWrap.height('auto');
				iframe.removeClass('stuck');
			}
		});
		/*Floating js End*/
	});
}

// expand/collapse all Start

var headers = $('#accordion .accordion-header');
var contentAreas = $('#accordion .ui-accordion-content ').hide()
	.first().show().end();
var expandLink = $('.accordion-expand-all');

// add the accordion functionality
headers.click(function () {
	// close all panels
	contentAreas.slideUp();
	// open the appropriate panel
	$(this).next().slideDown();
	// reset Expand all button
	expandLink.text('Expand all')
		.data('isAllOpen', false);
	// stop page scroll
	return false;
});

// hook up the expand/collapse all
expandLink.click(function () {
	var isAllOpen = !$(this).data('isAllOpen');
	console.log({ isAllOpen: isAllOpen, contentAreas: contentAreas })
	contentAreas[isAllOpen ? 'slideDown' : 'slideUp']();

	expandLink.text(isAllOpen ? 'Collapse All' : 'Expand all')
		.data('isAllOpen', isAllOpen);
});


// Payment Method Accordion
$('input[name="paymentmethod"]').on('click', function () {
	var $value = $(this).attr('value');
	$('.return-departure-dts').slideUp();
	$('[data-method="' + $value + '"]').slideDown();
});

// Right Click Disable
window.oncontextmenu = function () {
	return false;
}




