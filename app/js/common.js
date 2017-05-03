$(function() {
	const mainContent = $(".main-content .container"),
				select = $('#dir');
	let count = 0;

	const getSectionsList = $.getJSON("getlist.json", response => {
		let options = [];

		$.each(response, (i, element) => {

			options.push($(`<option value=${element}>${element}</option>`))
			select
				.append(options);
		});

		select.on('change', () => {
			let dirIndex = $(this).find(':selected').val();

			$('.loader-container').addClass('hidden');
			$('.main-content .container > *').addClass('hidden');

			const requestContent = $.getJSON(`${dirIndex}.json`, response => {
				response.map(files => {
					renderContent(files);
				});
			}).fail(error => { console.log( "error at request content" ) });
			
			const renderContent = files => {

				$.each(files, (filename,obj) => {
					let filesDiv = $('.hidden_template').clone();
						
					filesDiv
						.attr('id',`${count++}`)
						.removeClass('hidden_template')
						.css('display','flex')
						.appendTo(mainContent);

					filesDiv
						.find('.file > pre')
						.text(filename)
						.append($('<i class="fa fa-sort-down"></i>'));

					filesDiv
						.find('.file > pre')
						.click(event => {
							let sections = $(event.target).parent('.file').children('.sections');

							sections.slideToggle();
							$(event.target).find('.fa').toggleClass('fa-sort-up');
						});

					$.each(files[filename],(groupname,obj) => {
								section = $(`
									<div class="section">
										<pre>${groupname}</pre>
										<div class="table-wrap">
											<table class="table table-condensed section-table">
												<thead>
													<tr>
														<td>VARIABLE NAME</td>
														<td>EN</td>
														<td>RU</td>
													</tr>
												</thead>
												<tbody></tbody>
											</table>
										</div>
								`);

						obj.map((val) => {
							let tr = $('<tr></tr>');
							tr.append(`<td><span>${val.var}</span></td>`);
							tr.append(`<td><span>${val.en}</span></td>`);
							tr.append(`<td><span>${val.ru}</span><input type="text" class="td-edit hidden" placeholder=${(val.ru || '') ? val.ru : "Enter value"}></input></td>`);
							tr.appendTo(section.find('tbody'));
						});

							section.appendTo(filesDiv.find('.sections'));

						// Click Event
						section.find('pre').append($('<i class="fa fa-sort-down"></i>')).click(event => {
							$(event.target)
								.parent('.section')
								.children('.table-wrap')
								.slideToggle();

							$(event.target).find('.fa').toggleClass('fa-sort-up');
						});

						section.find('tbody td').eq(2).click(event => {
							$(event.target).addClass('hidden');
							$(event.target).parent().find('input.td-edit').removeClass('hidden').focus();
						});

					});
				});
			};
		});
	})
		.done(() => select.selectize({}))
		.fail(() => { error("error at request sections list") });
		
	const error = msg => {
		let div = $('<div class="content-error"></div>'),
				errorText = $(`<h1>${msg}</h1>`);

		div
			.append(errorText)
			.addClass('blink');

		mainContent
			.html('')
			.append(div);
	};

	$(window).scroll(() => {
		if ($(this).scrollTop() > 1200) {
			$('.top').addClass('active');
		} else {
			$('.top').removeClass('active');
		}
	});

	$('.top').on('click', () => {
		$('htmlm, body')
			.stop()
			.animate({scrollTop: 0}, 'slow', 'swing');
	});
});

$(window).on('load', () => {
	$('.preloader').delay(2000).fadeOut('slow');
	$('.loader-container').delay(5000).removeClass('hidden');
});

