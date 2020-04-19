<!--This makes the page scroll-->
var delta = 0;
var scrollThreshold = 5;

// detect available wheel event
wheelEvent = "onwheel" in document.createElement("div") ? "wheel" : // Modern browsers support "wheel"
	document.onmousewheel !== undefined ? "mousewheel" :         // Webkit and IE support at least "mousewheel"
		"DOMMouseScroll";                                            // let's assume that remaining browsers are older Firefox

// Bind event handler
$(window).on(wheelEvent, function (e) {
	// Do nothing if we weren't scrolling the carousel
	var carousel = $('.carousel.vertical:hover');
	if (carousel.length === 0)  return;

	// Get the scroll position of the current slide
	var currentSlide = $(e.target).closest('.item')
	var scrollPosition = currentSlide.scrollTop();

	// --- Scrolling up ---
	if (e.originalEvent.detail < 0 || e.originalEvent.deltaY < 0 || e.originalEvent.wheelDelta > 0) {
		// Do nothing if the current slide is not at the scroll top
		if(scrollPosition !== 0) return;

		delta--;

		if ( Math.abs(delta) >= scrollThreshold) {
			delta = 0;
			carousel.carousel('prev');
		}
	}

	// --- Scrolling down ---
	else {
		// Do nothing if the current slide is not at the scroll bottom
		var contentHeight = currentSlide.find('> .content').outerHeight();
		if(contentHeight > currentSlide.outerHeight() && scrollPosition + currentSlide.outerHeight() !== contentHeight) return;

		delta++;
		if (delta >= scrollThreshold)
		{
			delta = 0;
			carousel.carousel('next');
		}
	}

	// Prevent page from scrolling
	return false;
});
<!--Ending-->


$(function () {

	window.verifyRecaptchaCallback = function (response) {
		$('input[data-recaptcha]').val(response).trigger('change')
	}

	window.expiredRecaptchaCallback = function () {
		$('input[data-recaptcha]').val("").trigger('change')
	}

	$('#contact-form').validator();

	$('#contact-form').on('submit', function (e) {
		if (!e.isDefaultPrevented()) {
			var url = "contact.php";

			$.ajax({
				type: "POST",
				url: url,
				data: $(this).serialize(),
				success: function (data) {
					var messageAlert = 'alert-' + data.type;
					var messageText = data.message;

					var alertBox = '<div class="alert ' + messageAlert + ' alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>' + messageText + '</div>';
					if (messageAlert && messageText) {
						$('#contact-form').find('.messages').html(alertBox);
						$('#contact-form')[0].reset();
						grecaptcha.reset();
					}
				}
			});
			return false;
		}
	})
});