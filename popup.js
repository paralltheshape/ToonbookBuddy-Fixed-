function changeTab(tabName){
	$(".tab_windows > div").hide();
	$(".tab_windows #"+tabName).show();
	$(".tab_windows #"+tabName).children().show();
}

//Thanks, LightStyle on StackOverflow for this code!
function validateRegex(pattern) {
	var parts = pattern.split('/'),
		regex = pattern,
		options = "";
	
	if (parts.length > 1) {
		regex = parts[1];
		options = parts[2];
	}
	try {
		new RegExp(regex, options);
		return true;
	}
	catch(e) {
		return false;
	}
}

function checkPostRegex(){
	var text = $("#post_regex").val();
	
	if(validateRegex(text))
		$("#post_regex").css("background-color", "inherit");
	else
		$("#post_regex").css("background-color", "red");
}

$(document).ready(function(){
	changeTab("post");
	
	$("#manifest_version").text(chrome.runtime.getManifest().version);
	
	isLoggedIn(function(){
		chrome.browserAction.setIcon({path: "icon.png"});
		
		$(".logged_in").css("display", "block");
		$(".logged_out").css("display", "none");
	}, function(){
		chrome.browserAction.setIcon({path: "icon_gray.png"});
		
		$(".logged_in").css("display", "none");
		$(".logged_out").css("display", "block");
	});
	
	$("#post_regex").val(localStorage.getItem("postRegex"));
	checkPostRegex();
	
	$("#mark_all_read").click(function(){
		$.get("http://www.toonbook.me/sdtopbarmenu/index/hide?format=html&page=1", function(){
			checkNotifications();
		});
		
		$.get("http://www.toonbook.me/sdtopbarmenu/index/hidemessag?format=html&page=1", function(){
			checkMessages();
		});
	});
	
	$("#post form").submit(function(){
		var data = {body: $("#post_text").val(), return_url: "/members/home", privacy: "everyone", "composer[fbpage_id]": 0, "composer[tags]": "", "composer[peoples]": "", format: "json"};
		
		if($("#post_broadcast").prop("checked"))
			data.broadcast = true;
		else
			data.is_timeline = 1;
		
		$.post("http://www.toonbook.me/wall/index/post", data, function(data){
			if(data.status)
				alert("Posted!");
			else
				alert("Error: "+data.error);
		});
		
		return false;
	});
	
	$(".tabs img").click(function(){
		changeTab($(this).attr("id"));
	});
	
	$("#show_post_notifications").change(function(){
		localStorage.setItem("showPostNotifications", $(this).is(":checked"));
	});
	
	$("#show_post_notifications").prop("checked", localStorage.getItem("showPostNotifications") == "true");
	
	$("#refresh_notifications").click(checkNotifications);
	
	$("#post_regex").on("change paste keyup", checkPostRegex);
	$("#post_regex_submit").click(function(){
		var text = $("#post_regex").val();
		
		if(validateRegex(text)){
			localStorage.setItem("postRegex", text);
			alert("Set!");
		}else
			alert("Regex not valid!");
	});
	
	function setup(){
		$.get("http://status.toonbook.me/", function(data){
			var statusDOM = $.parseHTML(data);
			var statusTable = $(statusDOM).find(".table");
			
			$("#status_window").html(statusTable);
		});
	}
	
	setInterval(setup, 10000);
	setup();
});
