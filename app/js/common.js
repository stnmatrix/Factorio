$(function() {
	const mainContent = $(".main-content"),
				select = $('#dir');
	let count = 0;

	const getSectionsList = $.getJSON("getlist.json", response => {
		let options = [];

		select.html('');

		$.each(response, (i, element) => {

			options.push($(`<option value=${element}>${element}</option>`))
			select
				.append(options)
				.find('option:eq(0)')
				.prop('selected', true);
		});

		select.on('change', () => {
			let dirIndex = $(this).find(':selected').val();

			mainContent.html('');

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
							tr.append(`<td>${val.var}</td>`);
							tr.append(`<td>${val.en}</td>`);
							tr.append(`<td>${val.ru}</td>`);
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
					});
				});
			};
		});
	}).fail(() => { error("error at request sections list") });

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
});
