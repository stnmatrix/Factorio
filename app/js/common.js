$(function() {
	const mainContent = $(".main-content .container"),
		select = $("#dir"),
		section = mainContent.find(".sections .section"),
		sectionTemplate = $(
			`<div class="section"><pre></pre><div class="table-wrap"><table class="table table-condensed section-table"><thead><tr><td>VARIABLE NAME</td><td>EN</td><td>RU</td></tr></thead><tbody></tbody></table></div`
		);
	let count = 0;

	/*		Get Sections List		*/

	const getSectionsList = $.getJSON("getlist.json", response => {
		let options = [];

		$.each(response, (i, element) => {
			options.push($(`<option value=${element}>${element}</option>`));
			select.append(options);
		});

		select.on("change", () => {
			let dirIndex = $(this).find(":selected").val();

			$(".loader-container").addClass("hidden");
			$(".main-content .container > *").addClass("hidden");

			const requestContent = $.getJSON(`${dirIndex}.json`, response => {
				response.map(files => {
					renderContent(files);
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

	const renderContent = files => {
		$.each(files, (filename, obj) => {
			let filesDiv = $(".hidden_template").clone();

			filesDiv
				.attr("id", `${count++}`)
				.removeClass("hidden_template")
				.css("display", "flex")
				.appendTo(mainContent);

			filesDiv
				.find(".file > pre")
				.text(filename)
				.append($('<i class="fa fa-sort-down"></i>'));

			$.each(files[filename], (groupname, obj) => {
				let sectionClone = sectionTemplate.clone();

				sectionClone
					.find("pre")
					.append(groupname)
					.append($('<i class="fa fa-sort-down"></i>'));

				obj.map(val => {
					let tr = $("<tr></tr>"), placeholder = "";

					if (val.ru === "") {
						placeholder = "Введите перевод";
					} else {
						placeholder = val.ru;
					}

					tr.append(`<td><span>${val.var}</span></td>`);
					tr.append(`<td><span>${val.en}</span></td>`);
					tr.append(
						`<td><span class='ru-translate'>${val.ru === "" ? "Не указано" : val.ru}</span><div className="td-edit invisible"><input type="text" class="td-edit-input"></input></div></td>`
					);
					tr
						.find("td")
						.eq(2)
						.find(".td-edit-input")
						.attr("placeholder", placeholder);
					tr.appendTo(sectionClone.find("tbody"));
				});

				sectionClone.appendTo(filesDiv.find(".sections"));
			});
		});
	};
	const error = msg => {
		let div = $('<div class="content-error"></div>'),
			errorText = $(`<h1>${msg}</h1>`);

		div.append(errorText).addClass("blink");

		mainContent.html("").append(div);
	};

	/*		Events		*/

	mainContent.on("click", ".file pre", event => {
		$(event.target).parent(".file").children(".sections").slideToggle(400);
		$(event.target).find(".fa").toggleClass("fa-sort-up");
	});

	mainContent.on("click", ".section pre", event => {
		$(event.target).parent(".section").children(".table-wrap").slideToggle(400);
		$(event.target).find(".fa").toggleClass("fa-sort-up");
	});

	mainContent.on("click", "tbody tr .ru-translate", event => {
		$(event.target).toggleClass("invisible").fadeToggle().toggleClass("hidden");

		$(event.target)
			.parent()
			.find(".td-edit")
			.fadeToggle()
			.toggleClass("hidden invisible active")
			.find('.td-edit-input')
				.focus();
	});

	mainContent.on("keydown", "tbody .td-edit", event => {
		switch (event.which) {
			case 13: //
				$(event.target)
					.parent("td")
					.find("span")
					.fadeToggle()
					.toggleClass("hidden invisible");

				$(event.target)
					.toggleClass("invisible")
					.fadeToggle()
					.toggleClass("hidden active");

				if (!($(event.target).val() === "")) {
					$(event.target).parent("td").find("span").text($(event.target).val());
				}

				$(event.target).val("");

				break;
			case 27: // esc
				$(event.target)
					.parent()
					.find("span")
					.fadeToggle()
					.toggleClass("hidden invisible");

				$(event.target)
					.toggleClass("invisible")
					.fadeToggle()
					.toggleClass("hidden active");
				$(event.target).val("");

				break;
		}
	});

	$(document).on('click', event => {
		let	inputWrap = mainContent.find(".td-edit.active"),
				input = inputWrap.has('.td-edit-input'),
				span = inputWrap.parent().find(".ru-translate");

		if (!(mainContent.has(event.target).length)) {

			span
				.fadeToggle()
				.toggleClass("hidden invisible");

			inputWrap
				.toggleClass("invisible")
				.fadeToggle()
				.toggleClass("hidden active");

			if (!(input.val() === "")) {
				span.text(input.val());
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
		$("htmlm, body").stop().animate({ scrollTop: 0 }, "slow", "swing");
	});
});

$(window).on("load", () => {
	$(".preloader").delay(100).fadeOut("slow");
	$(".loader-container").delay(5000).removeClass("hidden");
});
