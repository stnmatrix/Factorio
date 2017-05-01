$(function() {
	const mainContent = $(".main-content"),
				select = $('#dir');
	let count = 0;

	const requestSection = $.getJSON("", response => {
 
	})


	const requestContent = $.getJSON("getdir.json", response => {
		response.map(files => {
			renderContent(files);
		});
	})
		.fail(error => { console.log( "error" ) });
	
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
