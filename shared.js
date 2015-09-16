var notificationValues = [];

function isLoggedIn(){
	var ret = true;
	
	$.post("http://www.toonbook.me/sdtopbarmenu/index/update?format=json", function(data){
		try{
			JSON.parse(data);
		}catch(e){
			ret = false;
		}
	});
	
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
						
						notificationDOM.forEach(function(e){
							if(e.className == "notifications_unread"){
								var id = $(e).attr("value");
								
								if(notificationValues.indexOf(id) == -1){
									notificationValues.push(id);
									
									chrome.notifications.create("tb_notification_"+id, {
										type: "basic",
										title: "Toonbook Notification!",
										message: $(e).find(".notification_item_general").text(),
										iconUrl: $(e).find("img").attr("src")
									});
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

checkNotifications();

setInterval(function(){
	checkNotifications();
}, 10000);
