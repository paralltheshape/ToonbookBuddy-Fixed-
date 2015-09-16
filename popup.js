function changeTab(tabName){
	$(".tab_windows > div").hide();
	$(".tab_windows #"+tabName).show();
	$(".tab_windows #"+tabName).children().show();
}

$(document).ready(function(){
	changeTab("post");
	
	if(!isLoggedIn()){
		chrome.browserAction.setIcon({path: "icon_gray.png"});
		
		$(".logged_in").css("display", "none");
		$(".logged_out").css("display", "block");
	}else{
		chrome.browserAction.setIcon({path: "icon.png"});
		
		$(".logged_in").css("display", "block");
		$(".logged_out").css("display", "none");
	}
	
	$("#post form").submit(function(){
		$.post("http://www.toonbook.me/wall/index/post", {body: $("#post_text").val(), return_url: "/members/home", privacy: "everyone", broadcast: $("#post_broadcast").prop("checked") ? "on" : "off", "composer[fbpage_id]": 0, "composer[tags]": "", "composer[peoples]": "", format: "json"}, function(data){
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
	
	$("#refresh_notifications").click(updateNotifications);
});
