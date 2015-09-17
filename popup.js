function changeTab(tabName){
	$(".tab_windows > div").hide();
	$(".tab_windows #"+tabName).show();
	$(".tab_windows #"+tabName).children().show();
}

$(document).ready(function(){
	changeTab("post");
	
	$("#manifest_version").text(chrome.runtime.getManifest().version);
	
	if(!isLoggedIn()){
		chrome.browserAction.setIcon({path: "icon_gray.png"});
		
		$(".logged_in").css("display", "none");
		$(".logged_out").css("display", "block");
	}else{
		chrome.browserAction.setIcon({path: "icon.png"});
		
		$(".logged_in").css("display", "block");
		$(".logged_out").css("display", "none");
	}
	
	$("#mark_all_read").click(function(){
		$.get("http://www.toonbook.me/sdtopbarmenu/index/hide?format=html&page=1", function(){
			checkNotifications();
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
});
