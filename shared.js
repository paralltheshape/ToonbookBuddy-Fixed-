if(localStorage.getItem("showPostNotifications") == null){
	localStorage.setItem("showPostNotifications", "true");
}

var notificationValues = [];

function isLoggedIn(){
	var ret = true;
	
	$.ajax({type: "POST", url: "http://www.toonbook.me/sdtopbarmenu/index/update?format=json", success: function(data){
		ret = true;
	}, error: function(){
		ret = false;
	}, async: false});
	
	return ret;
}

function checkNotifications(){
	if(isLoggedIn()){
		$.post("http://www.toonbook.me/sdtopbarmenu/index/update?format=json", function(data){
			try{
				if(data.notificationCount > 0){
					chrome.browserAction.setBadgeText({text: data.text});
					
					$.get("http://www.toonbook.me/sdtopbarmenu/index/pulldown?format=html", function(data){
						var notificationDOM = $.parseHTML(data);
					
						$("#notification_window").html(data);
						$("#notification_window a").click(function(){
							chrome.tabs.update({url: "http://www.toonbook.me" + $(this).attr("href")});
							return false;
						});
						
						notificationDOM.forEach(function(e){
							if(e.className == "notifications_unread"){
								var id = $(e).attr("value");
								
								if(notificationValues.indexOf(id) == -1){
									notificationValues.push(id);
									
									if(localStorage.getItem("showPostNotifications") == "true"){
										chrome.notifications.create("tb_notification_"+id, {
											type: "basic",
											title: "Toonbook Notification!",
											message: $(e).find(".notification_item_general").text(),
											iconUrl: $(e).find("img").attr("src")
										});
									}
								}
							}
						});
					});
				}else
					chrome.browserAction.setBadgeText({text: ""});
			}catch(e){
				//This shouldn't happen, but just in case.
				console.log(e.message);
			}
		});
	}else{
		chrome.browserAction.setBadgeText({text: ""});
	}
}

function checkAll(){
	if(!isLoggedIn()){
		chrome.browserAction.setIcon({path: "icon_gray.png"});
		
		$(".logged_in").css("display", "none");
		$(".logged_out").css("display", "block");
	}else{
		chrome.browserAction.setIcon({path: "icon.png"});
		
		$(".logged_in").css("display", "block");
		$(".logged_out").css("display", "none");
	}
}

checkAll();

setInterval(checkAll, 10000);
