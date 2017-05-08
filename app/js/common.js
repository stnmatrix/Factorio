$(function() {
	const mainContent = $(".main-content .container"),
		select = $("#dir"),
		section = mainContent.find(".sections .section"),
		sectionTemplate = $(
			`<div class="section"><pre></pre><div class="table-wrap"><table class="table table-condensed section-table"><thead><tr><td>VARIABLE NAME</td><td>EN</td><td>RU</td></tr></thead><tbody></tbody></table></div`
		),
		url = 'http://localhost/result.php';

	/*		Get Sections List		*/

	const getSectionsList = $.getJSON(`${url}?getlist`, response => {
		let options = [];

		$.each(response, (i, element) => {
			options.push($(`<option value=${i}>${element}</option>`));
			select.append(options);
		});

		select.on("change", () => {
			let dirIndex = $(this).find(":selected").val();

			$(".loader-container").addClass("hidden");
			$(".main-content .container > *").addClass("hidden");

			const requestContent = $.getJSON(`${url}?getlist=${dirIndex}`, response => {
				console.log(response)
				$.each(response, filename => {
					renderContent(filename, response[filename]);
				});
			}).fail(error => {
				console.log("error at request content");
			});
		});
	})
		.done(() => {
			select.selectize({});
		})
		.fail(() => {
			error("error at request sections list");
		});

	const renderContent = (filename, object) => {	
			let filesDiv = $(".hidden_template").clone();

			filesDiv
				.removeClass("hidden_template")
				.css("display", "flex")
				.appendTo(mainContent);

			filesDiv
				.find(".file > pre")
				.text(filename)
				.append($('<i class="fa fa-sort-down"></i>'));

			$.each(object, (groupname, obj) => {
				let sectionClone = sectionTemplate.clone(),
						tbody = sectionClone.find("tbody");				

				sectionClone
					.find("pre")
					.append(groupname)
					.append($('<i class="fa fa-sort-down"></i>'));
				
				$.each(obj,(i, val) => {
					let tr = $("<tr></tr>"),
							placeholder = "";

					if (val.ru === "") {
						placeholder = "Введите перевод";
					} else {
						placeholder = val.ru;
					}

					tr.append(`<td><span>${val.var}</span></td>`);
					tr.append(`<td><span>${val.en}</span></td>`);
					tr.append(
						`<td><span class='ru-translate'>${val.ru === "" ? "Не указано" : val.ru}</span><input type="text" class="td-edit hidden invisible"></input></td>`
					);


					tr
						.children("td")
						.eq(2)
						.children(".td-edit")
						.attr("placeholder", placeholder);
					tr.appendTo(tbody);
					
				});

				sectionClone.appendTo(filesDiv.find(".sections"));
			});
	};

	/*		Additional functions		*/

	const error = msg => {
		let div = $('<div class="content-error"></div>'),
			errorText = $(`<h1>${msg}</h1>`);

		div.append(errorText).addClass("blink");

		mainContent.html("").append(div);
	};

	const sendValueToServer = (input, value) => {
		let url = 'http://localohost:3000/index.html',  // EDIT URL
				store = {},
				dir = $('.selectize-dropdown-content > .option.selected.active').attr("data-value"),
				file = input.closest('.file').children('pre'),
				section = input.closest('.section').children('pre'),
				variable = input.closest('tr').children('td').eq(0).children('span');
		store.dir = dir;
		store.filename = file.text();
		store.sectionname = section.text();
		store.variablename = variable.text();
		store.ru = value;

		console.log(store);	

		$.post(url, store)
			.done(() => {
				console.log('Данные отправлены');
				console.log(store);
			});

	};

	/*		Show/Hide function		*/

	const showElement = (element, classes) => {
		if ($(document).has(element)) {
			let cls = classes || '';
			element
				.fadeToggle()
				.toggleClass(cls);
			return element;
		}
	};

	const hideElement = (element, classes) => {
		if ($(document).has(element)) {
			let cls = classes || '';
			element
				.fadeToggle()
				.toggleClass(cls)
				.focus();
			return element;
		}
	};

	/*		Events		*/

	mainContent.on("click", ".file pre", event => {
		event.stopPropagation();
		$(event.target).siblings(".sections").slideToggle(400);
		$(event.target).find(".fa").toggleClass("fa-sort-up");
	});

	mainContent.on("click", ".section pre", event => {
		event.stopPropagation();
		$(event.target).siblings(".table-wrap").slideToggle(400);
		$(event.target).find(".fa").toggleClass("fa-sort-up");
	});

	mainContent.on("click", "tbody tr .ru-translate", event => {
		event.stopPropagation();

		let input = $(event.target).siblings("input.td-edit"),
				span = $(event.target).closest("td").children("span"),
				activeInput = mainContent.find('input.td-edit.active'),
				activeInputParent = activeInput.closest("td").children("span.ru-translate");

		if (activeInput.hasClass('active')) {
			hideElement(activeInput,"hidden invisible active");
			showElement(activeInputParent, "invisible hidden");

			if (!(activeInput.val() === "")) {
				activeInputParent.text(activeInput.val());

				sendValueToServer(activeInput, activeInput.val());//

			}
			activeInput.val("");
		}
		hideElement(input,"hidden invisible active");
		showElement(span, "invisible hidden");
	});

	mainContent.on("keydown", "tbody .td-edit", event => {
		event.stopPropagation();

		let span = $(event.target).closest("td").children("span"),
				value = $(event.target).val();

		switch (event.which) {
			case 13: // Enter
				showElement(span, "invisible hidden");
				hideElement($(event.target),"hidden invisible active");

				if (!($(event.target).val() === "")) {
					span.text(value);

					sendValueToServer($(event.target), $(event.target).val());//

				}
				$(event.target).val("");
				break;
			case 27: // Esc
				showElement(span, "invisible hidden");
				hideElement($(event.target),"hidden invisible active");
				$(event.target).val("");
				break;
		}
	});

	$(document).on('click', event => {

		let	input = mainContent.find(".td-edit.active"),
				span = input.closest('td').children(".ru-translate");

		if (!(mainContent.has(event.target).length)) {
			showElement(span, "invisible hidden");
			hideElement(input,"hidden invisible active");
			// if ($) {
				
			// }
			if (!(input.val() === "")) {
				span.text(input.val());
				//sendValueToServer(input, input.val());//
			}
			input.val("");
		}
	});

	$(window).scroll(() => {
		if ($(this).scrollTop() > 1200) {
			$(".top").addClass("active");
		} else {
			$(".top").removeClass("active");
		}
	});

	$(".top").on("click", () => {
		event.stopPropagation();

		$("htmlm, body").stop().animate({ scrollTop: 0 }, "slow", "swing");
	});
});

$(window).on("load", () => {
	$(".preloader").delay(2000).fadeOut("slow");
	$(".loader-container").delay(5000).removeClass("hidden");
});
