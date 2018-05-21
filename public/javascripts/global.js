//  Equipment list data array for filling in info box
var equipmentListData = [];

//  DOM Ready
$(document).ready(function(){
	// Populate the equipment table on intial page load
	populateTable();

	//  Equipmentname link click
	$('#equipmentList table tbody').on('click', 'td a.linkshowequipment', showEquipmentInfo)

	// Add Equipment button click
	$('#btnAddEquipment').on('click', addEquipment);

	// Delete Equipment link click
	$('#equipmentList table tbody').on('click', 'td a.linkdeleteequipment', deleteEquipment);
});

// Functions

// Fill table with data
function populateTable() {
	var tableContent = '';

	// jQuery AJAX call for JSON
	$.getJSON('/equipment/equipmentlist', function(data) {
		// Stick our user data array into an equipmentlist variable in the global object
		equipmentListData = data;

		// For each item in our JSON add a table row and cells to the content string
		$.each(data, function(){
			tableContent += '<tr>';
			tableContent += '<td><a href="#" class="linkshowequipment" rel="' + this.equipmentname + '">' + this.equipmentname + '</a></td>';
      		tableContent += '<td>' + this.color + '</td>';
     		tableContent += '<td><a href="#" class="linkdeleteequipment" rel="' + this._id + '">delete</a></td>';
      		tableContent += '</tr>';
		});

		// Inject the whole content string into our existing HTML table
		$('#equipmentList table tbody').html(tableContent);
	});
};

// Show Equipment info
function showEquipmentInfo(event) {
	// Prevent Link from firing
	event.preventDefault();

	// Retrieve equipmentname from link rel attribute
	var thisEquipmentName = $(this).attr('rel');

	// Get index of object based on id value
	var arrayPosition = equipmentListData.map(function(arrayItem) {return arrayItem.equipmentname;}).indexOf(thisEquipmentName);

	// Get our equipment object
	var thisEquipmentObject = equipmentListData[arrayPosition];

	// Populate info Box
	$('#equipmentInfoColor').text(thisEquipmentObject.color);
	$('#equipmentInfoMake').text(thisEquipmentObject.Make);
};

// Add Equipment
function addEquipment(event) {
	event.preventDefault();

	// Syoer basic validation - increase errorCount variable if any fields are blank
	var errorCount = 0;
	$('#addEquipment input').each(function(index, val) {
		if($(this).val() === '') {errorCount++;}
	});

	// Check and make sure errorCount's still at zero
	if(errorCount ===0) {
		// If iti s, compile all user info into one object
		var newEquipment = {
			'equipmentname': $('#addEquipment fieldset input#inputEquipmentType').val(),
			'color': $('#addEquipment fieldset input#inputEquipmentColor').val(),
			'Make': $('#addEquipment fieldset input#inputEquipmentMake').val()
		}

		// Use AJAX to post the object to our addequipment service
		$.ajax({
			type: 'POST',
			data: newEquipment,
			url: '/equipment/addequipment',
			datatype: 'JSON'
		}).done(function(response) {
			// Check for successful (blank) response
			if (response.msg === '') {
				// clear the form inputs
				$('#addEquipment fieldset input').val('');
				// update the table
				populateTable();
			}
			else {
				// if something goes wrong, alert the error message that our service returned
				lert('Error: ' + response.msg);
			}
		});
	}
	else {
		// if errorCount is more than 0, error out
		alert('Please fill in all fields');
		return false;
	}
};

// Delete Equipment
function deleteEquipment(event) {
	event.preventDefault();
	// Pop up confirmation dialog
	var confirmation = confirm('Are you sure you want to delete this Equipement?');

	// Check and make sure the user confirmed
	if (confirmation === true) {
		// if they did, do our delete
		$.ajax({
			type: 'DELETE',
			url: '/equipment/deleteequipment/' + $(this).attr('rel')
		}).done(function(response) {
			// Check for a successful (blank) response
			if(response.msg === ''){

			} 
			else {
				alert('Error:' + response.msg);
			}

			// Update the Table
			populateTable();
		});
	} 
	else {
		// If they said no to the confirm, do nothing
		return false
	}
};
