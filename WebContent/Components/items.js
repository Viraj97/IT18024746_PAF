$(document).ready(function()
{
    $("#alertSuccess").hide();
    $("#alertError").hide();
});
// SAVE ============================================
$(document).on("click", "#btnSave", function(event) {
	// Clear alerts---------------------
	$("#alertSuccess").text("");
	$("#alertSuccess").hide();
	$("#alertError").text("");
	$("#alertError").hide();
	// Form validation-------------------
	var status = validatePaymentForm();
	if (status != true) {
		$("#alertError").text(status);
		$("#alertError").show();
		return;
	}
// If valid------------------------
	
	var type = ($("#hidPaymentIDSave").val() == "") ? "POST" : "PUT";

	$.ajax({
		url : "ItemsAPI",
		type : type,
		data : $("#formPayment").serialize(),
		dataType : "text",
		complete : function(response, status) {
			onPaymentSaveComplete(response.responseText, status);
		}
	});

});

function onPaymentSaveComplete(response, status) {
	if (status == "success") {
		var resultSet = JSON.parse(response);
		if (resultSet.status.trim() == "success") {
			$("#alertSuccess").text("Successfully saved.");
			$("#alertSuccess").show();
			$("#divItemsGrid").html(resultSet.data);
		} else if (resultSet.status.trim() == "error") {
			$("#alertError").text(resultSet.data);
			$("#alertError").show();
		}
	} else if (status == "error") {
		$("#alertError").text("Error while saving.");
		$("#alertError").show();
	} else {
		$("#alertError").text("Unknown error while saving..");
		$("#alertError").show();
	}
	$("#hidPaymentIDSave").val("");
	$("#formPayment")[0].reset();
}

// UPDATE==========================================
$(document).on(
		"click",
		".btnUpdate",
		function(event) {
			$("#hidPaymentIDSave").val(
					$(this).closest("tr").find('#hidPaymentIDUpdate').val());
			$("#type").val($(this).closest("tr").find('td:eq(1)').text());
			$("#ammount").val($(this).closest("tr").find('td:eq(2)').text());
			$("#paymentHolder").val($(this).closest("tr").find('td:eq(3)').text());
			$("#date").val($(this).closest("tr").find('td:eq(4)').text());
			$("#payeeId").val($(this).closest("tr").find('td:eq(5)').text());
		});


//remove
$(document).on("click", ".btnRemove", function(event) {
	$.ajax({
		url : "ItemsAPI",
		type : "DELETE",
		data : "PaymentID=" + $(this).data("PaymentID"),
		dataType : "text",
		complete : function(response, status) {
			onItemDeleteComplete(response.responseText, status);
		}
	});
});


function onItemDeleteComplete(response, status) {
	if (status == "success") {
		var resultSet = JSON.parse(response);
		if (resultSet.status.trim() == "success") {
			$("#alertSuccess").text("Successfully deleted.");
			$("#alertSuccess").show();
			$("#divItemsGrid").html(resultSet.data);
		} else if (resultSet.status.trim() == "error") {
			$("#alertError").text(resultSet.data);
			$("#alertError").show();
		}
	} else if (status == "error") {
		$("#alertError").text("Error while deleting.");
		$("#alertError").show();
	} else {
		$("#alertError").text("Unknown error while deleting..");
		$("#alertError").show();
	}
}
// CLIENTMODEL=========================================================================
function validatePaymentForm() {
	// CODE
	if ($("#type").val().trim() == "") {
		return "Enter Payment Type.";
	}
	// NAME
	if ($("#ammount").val().trim() == "") {
		return "Enter Amount.";
	}
	// PRICE-------------------------------
	if ($("#paymentHolder").val().trim() == "") {
		return "Enter Payment Holder.";
	}
	// DESCRIPTION------------------------
	if ($("#payeeId").val().trim() == "") {
		return "Enter Payee ID.";
	}
	return true;
}