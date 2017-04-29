$(function() {
	const mainContent = $(".main-content"),
				filesDiv = $(`<div class="files"></div>`);

	$.getJSON("getdir.json", response => {
		response.map(files => {
			mainContent.append(filesDiv);
			renderFiles(files);
		});
	});

	const renderFiles = files => {
		let sectionsDiv = $(`<div class="sections"></div>`),
				sectionDiv = $(`<div class="section"></div>`),
				fileDiv = $(`<div class="file"></div>`),
				p = $(`<p></p>`);

		$.each(files, (filename,obj) => {
			p.html(`<strong>FILE</strong>: ${filename}`).wrapInner('<pre></pre>');

			// Click Event //
			p.click(event => {
				$(event.target).parent().next('.sections').slideToggle();
			});
			//

			sectionCreate(files[filename]);
		});

		filesDiv.append(fileDiv);
		fileDiv.append(p);
		fileDiv.append(sectionsDiv);
		sectionsDiv.append(sectionDiv);
	};

	const sectionCreate = file => {
		let fileDiv = $('.main-content .file'),
				sectionDiv = $('.sections .section'),
				p = $(`<p></p>`),
				table = $(`<table class="table table-condensed section-table"></table>`),
				tableWrapper = $('<div class="table-wrap"></div>',),
				thead = $(`<thead></thead>`),
				tr = $(`<tr><td>Variable name</td><td>En</td><td>Ru</td></tr>`);

		$.each(file,(propname,val) => {
			thead.append(tr);
			table.append(thead);			
			sectionDiv.append(p);
			sectionDiv.append(tableWrapper),
			tableWrapper.append(table);
			p.html(`<strong>Property</strong>: ${propname}`).wrapInner('<pre></pre>');

			// Click Event
			p.click(event => {
				let tableWrap = $(event.target).parent().next('div.table-wrap');

				if (tableWrap.css('display') === 'none') {
					tableWrap.slideUp();   // НЕ РАБОТАЕТ !!!
				} else {
					tableWrap.slideUp();
				}
			});
			//

			createRow(val);
		});
	};

	const createRow = rowData => {
		let tbody = $('<tbody></tbody>'),
				tr = $('<tr />');

		$('.section .table').append(tbody);

		rowData.map(val => {
			tr.append(`<td>${val.var}</td>`)
			tr.append(`<td>${val.en}</td>`)
			tr.append(`<td>${val.ru}</td>`)
		});

		tbody.append(tr);
	};
});
