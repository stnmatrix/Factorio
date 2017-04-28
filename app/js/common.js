$(function() {
	const tbody = $('<tbody><tbody>');

	const renderFile = (filename, dest) => {
		if (!dest) {
			return false
		}
		let section = $(`
			<div class="section">
				<table class="table">
					<thead>
						<th>variable</th>
						<th>en</th>
						<th>ru</th>
					</thead>
				</table>
			</div>
		`)
	}
	

	$.getJSON('/getlist.json', (data) => {
		let options = [];
		$('#dir').html('')
		
		$.each(data, (i,el) => {
			options.push($(`<option value=${i}>${el}</option>`))
		})
		$('#dir').append(options)
	})
	
	$('#dir').on('change', () => {
		let dirIndex = $(this).find(':selected').val();

		$.getJSON(`http://10.168.0.2/result.php?getdir=${dirIndex}`, (data) => {
			console.log(data);
		})
	})

});
