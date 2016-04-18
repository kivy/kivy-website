// select panel

var lastpanel = null;

function checkPanelNavigation() {
	if (window.location.hash) {
		var hash = window.location.hash.substr(1);
		if (hash != lastpanel) {
			triggerNav({ id: hash });
		}
	}
	setTimeout('checkPanelNavigation()', 150)
}

function selectPanel(name) {
	var panelname = 'panel-' + name;
	var panelid = '#' + panelname;

	if ( name == 'home' ) {
		$('.slideshow-shadow').show();
		$('#header').css({
				'height': '440px'
		});
	} else {
		$('.slideshow-shadow').hide();
		$('#header').css({
				'height': '120px'
		});
	}

	if ( $(panelid).exists() ) {
		$(panelid).show();
		$('div.panel:not('+panelid+')').hide();
	} else {
		var panel = $('<div class="panel"></div>').attr('id', panelname);
		$('#content .wrapper').append(panel);
		panel.load('./panel-' + name + '.html', function() {
			$('div.panel:not('+panelid+')').hide();
			panel.show();
		});
	}

	lastpanel = panelid;
}

// handle nav selection
function selectNav(event) {
		var href = $(this).attr('href');
		var name = 'home';
		if ( href )
				name = href.substring(1);

		if (event)
				event.preventDefault();

		if ( $(this).hasClass('selected') && window.location.hash == '#' + name)
				return;

		window.location.hash = '#' + name;

		$(this)
			.parents('ul:first')
					.find('a')
					.removeClass('selected')
					.end()
			.end()
			.addClass('selected');

		selectPanel(name);
}

function triggerNav(data) {
	var el = $('#menu .navigation').find('a[href$="' + data.id + '"]').get(0);
	if ( el )
		selectNav.call(el);
	else
		selectPanel(data.id);
}


$(document).ready(function () {
	jQuery.fn.exists = function(){return jQuery(this).length>0;}

	//
	// PANELS
	//
	$('div.panel').hide()
	$('#menu .navigation').find('a[href^="#"]').click(selectNav);
	$("a[rel^='panel']").click(selectNav);

	if (window.location.href.search('place=') > 0) {
		triggerNav({ id : 'forum' });
	} else if (window.location.hash) {
		triggerNav({ id : window.location.hash.substr(1) });
	} else {
		$('ul.navigation a:first').click();
	}


	//
	// Platforms
	//
	$('table.downloads tr').removeClass('selected')

	var dos = $.client.os;
	if ( dos == 'Windows' ) {
		$('tr[class=os-window]').addClass('selected');
	} else if ( dos == 'Mac' ) {
		$('tr[class=os-macosx]').addClass('selected');
	} else if ( dos == 'Linux' ) {
		$('tr[class=os-linux]').addClass('selected');
	}

	//
	// Socials
	//

	// Facebook / Like button
	$('.facebook_like').socialbutton('facebook_like', {
		url: 'https://www.facebook.com/kivysoftware',
		show_faces: false,
		locale: 'en_US',
		button: 'box_count'
	});

	// Google / Google +1 Button
	/**
	$('.google_plusone').socialbutton('google_plusone', {
		url: 'http://kivy.org/',
		lang: 'en-US'
	});
	**/

	// Twitter / Tweet Button
	$('.twitter').socialbutton('twitter', {
		url: 'http://kivy.org/',
		lang: 'en'
	});


	checkPanelNavigation();
});

//get url for nightly build
//ajax from https://github.com/padolsey-archive/jquery.fn/tree/master/cross-domain-ajax

//leading zeros for date
function addZeros(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}

//getNightly('cp27','win32'); for cpXY and win32, win_amd64
function getNightly(pyVer, arch){
    var drive_url = 'https://drive.google.com/folderview?id=0B1_HB9J8mZepOV81UHpDbmg5SWM&usp=sharing#list';
    jQuery.ajax = (function(_ajax){
        var protocol = location.protocol,
            hostname = location.hostname,
            exRegex = RegExp(protocol + '//' + hostname),
            YQL = 'http' + (/^https/.test(protocol)?'s':'') + '://query.yahooapis.com/v1/public/yql?callback=?',
            query = 'select * from html where url="{URL}" and xpath="*"';
        function isExternal(url) {
            return !exRegex.test(url) && /:\/\//.test(url);
        }
        return function(o) {
            var url = o.url;
            if ( /get/i.test(o.type) && !/json/i.test(o.dataType) && isExternal(url) ) {
                o.url = YQL;
                o.dataType = 'json';
                o.data = {
                    q: query.replace(
                        '{URL}',
                        url + (o.data ?
                            (/\?/.test(url) ? '&' : '?') + jQuery.param(o.data)
                        : '')
                    ),
                    format: 'xml'
                };
                if (!o.success && o.complete) {
                    o.success = o.complete;
                    delete o.complete;
                }
                o.success = (function(_success){
                    return function(data) {
                        if (_success) {
                            _success.call(this, {
                                responseText: data.results[0]
                                    .replace(/<script[^>]+?\/>|<script(.|\s)*?\/script>/gi, '')
                            }, 'success');
                        }
                    };
                })(o.success);
            }
            return _ajax.apply(this, arguments);
        };
    })(jQuery.ajax);
    $.ajax({
        url: drive_url,
        type: 'GET',
        success: function(res) {
            var prefixUrl = "https://docs.google.com/uc?id=";
            var urlPart = String(/entry-([a-zA-Z0-9\-]*?)/);
            var htmlGarbage = String(/(?:" role="link" tabindex="0"><div class="flip-entry-info"><div class="flip-entry-visual"><div class="flip-entry-visual-card"><div class="flip-entry-icon"><img alt="Compressed Archive" src="https:\/\/ssl.gstatic.com\/docs\/doclist\/images\/icon_9_archive_xl128\.png"\/><\/div><\/div><\/div><div class="flip-entry-list-icon"><img alt="" src="https:\/\/ssl\.gstatic\.com\/docs\/doclist\/images\/icon_9_archive_list\.png"\/><\/div><div class="flip-entry-title">)/);
            var wheel = String(/(Kivy-\d\.\d\.\d)(\.\w{4}_$date$_git\_?\w{7}-$pyVer$)(-none|_\d{8}_git_\w{7}-$pyVer$m)(-$arch$.whl)/);
            var date = new Date();
            var yesterday = addZeros(date.getDate()-1, 2);
            var month = addZeros(date.getMonth()+1, 2);
            var year = date.getFullYear();
            date = yesterday+month+year;
            wheel = wheel.replace("$date$",date).replace("$pyVer$",pyVer);
            wheel = wheel.replace("$pyVer$",pyVer).replace("$arch$",arch);
            var patt = new RegExp(urlPart.slice(1,-1)+htmlGarbage.slice(1,-1)+wheel.slice(1,-1));
            var text = res.responseText;
            var result;
            try{
                result = text.match(patt);
                var wheelUrl = prefixUrl+result[1];
                console.log(wheelUrl);
                return wheelUrl;
            }
            catch(e){
                alert('No nightly-build wheel is available yet!');
            }
        }
    });
}
