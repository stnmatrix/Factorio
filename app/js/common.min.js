$(function() {
	const mainContent = $(".main-content"),
				files = $('.main-content .files'),
				file = $('.main-content .file'),
				filePre = $('.main-content .file > p > pre'),
				sections = $('.main-content .sections'),
				section = $('.main-content .section'),
				sectionPre = $('.main-content .section > p > pre'),
				tbody = $('.main-content .section > .table-wrap > .table tbody');
	let count = 0;
			

	$.getJSON("getdir.json", response => {
		response.map(files => {
			renderContent(files);
		});
	});
	
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
				.html(`<strong>file:</strong> ${filename}`)
			

			$.each(files[filename],(groupname,obj) => {
				let tr = $('<tr></tr>'),
						section = $(`
							<div class="section">
								<pre><strong>group name:</strong> ${groupname}</pre>
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
					tr.append(`<td>${val.var}</td>`)
					tr.append(`<td>${val.en}</td>`)
					tr.append(`<td>${val.ru}</td>`)
				});
				tr.appendTo(section.find('.table tbody'))
				section.appendTo(filesDiv.find('.sections'))


				
			});
		});
	};


			// // Click Event //
			// p.click(event => {
			// 	$(event.target).parent().next('.sections').slideToggle();
			// });
			// //
});
