$(function() {
	const mainContent = $(".main-content .container"),
				select = $('#dir'),
				section = mainContent.find('.sections .section'),
				sectionTemplate = $(`<div class="section"><pre></pre><div class="table-wrap"><table class="table table-condensed section-table"><thead><tr><td>VARIABLE NAME</td><td>EN</td><td>RU</td></tr></thead><tbody></tbody></table></div`);
	let count = 0;

	const getSectionsList = $.getJSON("getlist.json", response => {
		let options = [];

		$.each(response, (i, element) => {

			options.push($(`<option value=${element}>${element}</option>`))
			select.append(options);
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

					filesDiv.find('.file > pre')
						.text(filename)
						.append($('<i class="fa fa-sort-down"></i>'));

					$.each(files[filename],(groupname,obj) => {
						let sectionClone = sectionTemplate.clone();

						sectionClone.find('pre')
							.append(groupname)
							.append($('<i class="fa fa-sort-down"></i>'))

						obj.map((val) => {
							let tr = $('<tr></tr>');
							tr.append(`<td><span>${val.var}</span></td>`);
							tr.append(`<td><span>${val.en}</span></td>`);
							tr.append(`<td><span>${(val.ru === '') ? "Не указано": val.ru}</span><input type="text" class="td-edit hidden invisible" placeholder=${(val.ru || '') ? val.ru : 'Перевод 123'}></input></td>`);
							tr.appendTo(sectionClone.find('tbody'));
						});

						sectionClone.appendTo(filesDiv.find('.sections'));						
					});
				});
			};			
		});
	})
		.done(() => {
			select.selectize({});
		})
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



			/* Events */

	mainContent.on("click", ".file pre",event => {
		$(event.target).parent('.file').children('.sections').slideToggle(400);
		$(event.target).find('.fa').toggleClass('fa-sort-up');
	});

	mainContent.on("click", ".section pre", event => {
		$(event.target).parent(".section").children(".table-wrap").slideToggle(400);
		$(event.target).find(".fa").toggleClass("fa-sort-up");
	});

	mainContent.on("click", "tbody td span", event => {
		$(event.target)
			.toggleClass("invisible")
			.fadeOut()
			.toggleClass("hidden");

		$(event.target).parent().find("input.td-edit")
			.fadeIn()
			.toggleClass("hidden invisible active")
			.focus();
	});

	mainContent.on("keydown", "tbody .td-edit", event => {
		switch (event.which) {
			case 13: //
				$(event.target).parent('td').find("span")
					.fadeIn()
					.toggleClass("hidden invisible");

				$(event.target)
					.toggleClass("invisible")
					.fadeOut()
					.toggleClass("hidden active");

				if (!($(event.target).val()) && !(($(event.target).val()) === "")) {
					$(event.target).parent().find("span").text($(event.target).val());
				}

				$(event.target).val("");

				break;
			case 27: // esc
				$(event.target)
					.parent().find("span")
					.fadeIn()
					.toggleClass("hidden invisible");

				$(event.target)
					.toggleClass("invisible")
					.fadeOut()
					.toggleClass("hidden active");
				$(event.target).val("");

				break;
		}
	});

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
	$('.preloader').delay(100).fadeOut('slow');
	$('.loader-container').delay(5000).removeClass('hidden');
});