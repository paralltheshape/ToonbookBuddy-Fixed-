function addToLocalStorage(item, val){
	if(localStorage.getItem(item) == null)
		localStorage.setItem(item, val);
}

addToLocalStorage("showPostNotifications", "true");
addToLocalStorage("adblock", "true");
addToLocalStorage("postRegex", "");

var notificationValues = [];
var messageValues = [];
var postValues = [];

var notificationAmount = 0;
var messageAmount = 0;

function isLoggedIn(logged_in, logged_out){
	var logged_out = logged_out || function(){};
	
	$.ajax({type: "POST", url: "http://www.toonbook.me/sdtopbarmenu/index/update?format=json", success: function(data){
		logged_in();
	}, error: function(){
		logged_out();
	}});
}

function fixBadge(){
	var toSet = notificationAmount + messageAmount;
	
	if(toSet > 0)
		chrome.browserAction.setBadgeText({text: toSet.toString()});
	else
		chrome.browserAction.setBadgeText({text: ""});
}

function checkNotifications(){
	isLoggedIn(function(){
		$.post("http://www.toonbook.me/sdtopbarmenu/index/update?format=json", function(data){
			try{
				if(data.notificationCount > 0){
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
									notificationAmount++;
									fixBadge();
									
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
				}else{
					notificationAmount = 0;
					fixBadge();
				}
			}catch(e){
				//This shouldn't happen, but just in case.
				console.log(e.message);
			}
		});
	}, function(){
		notificationAmount = 0;
		fixBadge();
	});
}

function checkMessages(){
	isLoggedIn(function(){
		$.post("http://www.toonbook.me/sdtopbarmenu/index/messageupdate?format=json", function(data){
			try{
				if(data.messageCount > 0){
					$.get("http://www.toonbook.me/sdtopbarmenu/index/messagepulldown?format=html", function(data){
						var notificationDOM = $.parseHTML(data);
					
						$("#message_window").html(data);
						$("#message_window a").click(function(){
							chrome.tabs.update({url: "http://www.toonbook.me" + $(this).attr("href")});
							return false;
						});
						
						notificationDOM.forEach(function(e){
							if(e.className == "notifications_unread"){
								var id = $(e).attr("value");
								
								if(messageValues.indexOf(id) == -1){
									messageAmount++;
									messageValues.push(id);
									fixBadge();
									
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
				}else{
					messageAmount = 0;
					fixBadge();
				}
			}catch(e){
				//This shouldn't happen, but just in case.
				console.log(e.message);
			}
		});
	}, function(){
		messageAmount = 0;
		fixBadge();
	});
}

function checkPosts(){
	isLoggedIn(function(){
		$.get("http://www.toonbook.me/widget/index/name/wall.feed?format=html&mode=recent&list_id=0&type=&minid=0&getUpdate=true&subject=&feedOnly=true", function(data){
			var postDOM = $.parseHTML(data);
			
			if(localStorage.getItem("postRegex") != ""){
				postDOM.forEach(function(e){
					if(e.className == "wall-action-item wall-broadcast-item"){
						var post = $(e).find(".feed_item_bodytext");
						var postId = $(post).parents("li").attr("rev");
						
						if(postValues.indexOf(postId) == -1){
							postValues.push(postId);
							
							if($(post).text().toLowerCase().match(localStorage.getItem("postRegex")) != null){
								chrome.notifications.create("tb_notification_"+postId, {
									type: "basic",
									title: "Toonbook Notification!",
									message: $(post).parents("li").find(".item_photo_user").attr("alt").replace(/<\/?[^>]+(>|$)/g, "") + " made a post you wanted to see!",
									iconUrl: $(post).parents("li").find(".item_photo_user").attr("src")
								});
							}
						}
					}
				});
			}
		});
	});
}

function checkAll(){
	isLoggedIn(function(){
		chrome.browserAction.setIcon({path: "icon.png"});
		
		$(".logged_in").css("display", "block");
		$(".logged_out").css("display", "none");
	}, function(){
		chrome.browserAction.setIcon({path: "icon_gray.png"});
		
		$(".logged_in").css("display", "none");
		$(".logged_out").css("display", "block");
	});
	
	checkNotifications();
	checkPosts();
	checkMessages();
}

checkAll();

setInterval(checkAll, 10000);
