$(function() {
	const mainContent = $(".main-content"),
				filesDiv = $(`<div class="files"></div>`);

	$.getJSON("getdir.json", response => {
		$.each(response, (key, val) => {
			mainContent.append(filesDiv);
			renderFiles(val);
		});
	});

	const renderFiles = data => {
		let sectionsDiv = $(`<div class="sections"></div>`),
				sectionDiv = $(`<div class="section"></div>`),
				fileDiv = $(`<div class="file"></div>`),
				p = $(`<p></p>`);

		filesDiv.append(fileDiv);
		fileDiv.append(p);
		fileDiv.append(sectionsDiv);
		sectionsDiv.append(sectionDiv);

		for (file in data) {
			p.text(file);
		}
		sectionCreate(data);
	};

	const sectionCreate = file => {
		let fileDiv = $('.main-content .file'),
				sectionDiv = $('.sections .section'),
				caption = $(`<caption>caption</caption>`),
				table = $(`<table class="table section-table"></table>`),
				thead = $(`<thead></thead>`),
				tr = $(`<tr><td>Variable name</td><td>En</td><td>Ru</td></tr>`);
		console.log(file)

		thead.append(tr);
		table.append(thead);
		sectionDiv.append(caption);
		sectionDiv.append(table);


	};

	const createRow = rowData => {
		console.log(rowData);

		//let tr = $('<tr />');
	};
});
