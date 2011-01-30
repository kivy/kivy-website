$(document).ready(function () {
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
});
