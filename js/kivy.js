$(document).ready(function () {
	//
	// SLIDES
	//

	$('#slides').slides({
		preload: true,
		preloadImage: 'img/loading.gif',
		play: 5000,
		pause: 10000000,
		hoverPause: true
	});

	//
	// PANELS
	//
	$('div.panel').hide()

    // handle nav selection
    function selectNav() {
        $(this)
            .parents('ul:first')
                .find('a')
                    .removeClass('selected')
                .end()
            .end()
            .addClass('selected');

		$('div.panel').hide()
		$($(this).attr('href')).show();
    }

	$('#menu .navigation').find('a').click(selectNav);

    function trigger(data) {
        var el = $('#menu .navigation').find('a[href$="' + data.id + '"]').get(0);
        selectNav.call(el);
    }

    if (window.location.hash) {
        trigger({ id : window.location.hash.substr(1) });
    } else {
        $('ul.navigation a:first').click();
    }


	//
	// Platforms
	//
	$('ul.platforms .content').hide();
	$('ul.platforms li').mouseenter(function() {
		$('.platform-content').hide();
		$('#platform-' + $(this).attr('rel')).show();
		$('ul.platforms li').removeClass('selected')
		$(this).addClass('selected');
	});

	$('.platform-content').hide();

	var dos = $.client.os;
	if ( dos == 'Windows' ) {
		$('#platform-window').show();
		$('ul.platforms li[rel=window]').addClass('selected');
	} else if ( dos == 'Mac' ) {
		$('#platform-macosx').show();
		$('ul.platforms li[rel=macosx]').addClass('selected');
	} else if ( dos == 'Linux' ) {
		$('#platform-linux').show();
		$('ul.platforms li[rel=linux]').addClass('selected');
	} else {
		$('#platform-choose').show();
	}

});
