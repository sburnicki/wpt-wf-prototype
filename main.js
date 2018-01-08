$(document).ready(function () {

	var colors  = {
		"html": {
			ttfb: ['#a9b7cb', '#6d98d4', '#e0ecfe'],
			download: ['#6890c9', '#6d98d4', '#a7cbfc']
		},
		"image": {
			ttfb: ['#d5cade', '#bbafc4', '#f0e5f8'],
			download: ['#d5b8ee', '#d5b8ee', '#9c7bb9']
		},
		"js": {
			ttfb: ['#a9b7cb', '#6d98d4', '#e0ecfe'],
			download: ['#a9b7cb', '#6d98d4', '#e0ecfe']
		},
		"css": {
			ttfb: ['#b6c6ae', '#b6c6ae', '#e0ecfe'],
			download: ['#a9b7cb', '#6d98d4', '#e0ecfe']
		},
		"other": {
			ttfb: ['#cbcbcb', '#cecece', '#fefefe'],
			download: ['#999999', '#888888', '#dddddd']
		}
	};

	function GetRequestColors(contentType) {
		var fileType = GetFileType(contentType);
		console.log(fileType);
		return colors[fileType];
	}

	function GetFileType(contentType) {
		if (contentType === 'text/html') {
			return 'html';
		}
		else if (contentType.substring(0, 6) == "image/") {
			return 'image';
		}
		else if (contentType == "text/css") {
			return 'css';
		}
		else {
			return 'other';
		}
	}

	function GetRequestGradient(ctx, contentType, metricType) {
		var gradient = ctx.createLinearGradient(0, 16, 0, 0);

		var colors = GetRequestColors(contentType);

		gradient.addColorStop(0, colors[metricType][0]);
		gradient.addColorStop(1, colors[metricType][1]);
		gradient.addColorStop(.85, colors[metricType][2]);

		return gradient;
	}

	function DrawRequestBar(ctx, data) {
			var scale = .25;
			var ttfb_start = data.ttfb_start;
			var ttfb_end = data.ttfb_end;
			var download_ms = data.download_ms;

			ctx.fillStyle = GetRequestGradient(ctx, data.contentType, 'ttfb');
			ctx.fillRect(ttfb_start * scale, 1, (ttfb_end - ttfb_start) * scale, 15);

			ctx.fillStyle = GetRequestGradient(ctx, data.contentType, 'download');
			ctx.fillRect((ttfb_start * scale) + ((ttfb_end - ttfb_start) * scale), 1, download_ms * scale, 15);
	}


	function DrawWaterfallRow(ctx, data) {
		DrawRequestBar(ctx, data);
	}

	function renderWaterfallItems(waterfallItems) {

		waterfallItems.each(function (i, waterfallItem) {
			var ctx = waterfallItem.getContext('2d');
			var wfItemData = wptRequestData['step1'][i];
			DrawWaterfallRow(ctx, wfItemData);
		});
	}

	function resizeWaterfallItems(waterfallItems) {
		waterfallItems.each(function (i, waterfallItem) {
			waterfallItem.width = $(waterfallItem).width();
			waterfallItem.height = $(waterfallItem).height();
		});
	}

	var rows = $('.wpt-wf tr');

	$(rows).not('.full-stat').not('.wpt-wf-header').on('click', function (e) {
		var row = $(this);

		if (row.is('a')) row = $(this).closest('tr');

		rows.removeClass('selected');

		row.addClass('selected');

		e.preventDefault();

	});


	$('.view-mode-toggle').on('click', function () {
		$('.wpt-wf-image').toggle();
		$('.wpt-wf-interactive').toggle();

		var waterfallItems = $('.wf-item');
		resizeWaterfallItems(waterfallItems);
		renderWaterfallItems(waterfallItems);

		var viewModeToggle = $('.view-mode-toggle');

		console.log(viewModeToggle.text().indexOf('Interactive view') == -1);

		if (viewModeToggle.text().indexOf('Interactive view') == -1) {
			viewModeToggle.text('Interactive view')	
		}
		else {
			viewModeToggle.text('Image view')	
		}

	});

	setTimeout(function () {
		$('.view-mode-toggle').click();
	}, 25);

	$('.wf-panel input').on('keyup', function () {
		var search = this.value;
		var interactiveWf = $(this).closest('.wpt-wf-interactive')
		var rows = interactiveWf.find('.wpt-wf tr').not('.full-stat').not('.wpt-wf-header');
		rows.each(function (i, e) {
			if ($(e).find('td.item').text().indexOf(search) === -1) {
				$(e).hide();
			}
			else {
				$(e).show();
			}
		});
	});



});

