var changelog = [
	"Comments (and occasionally posts) now show their ID",
	"Fixed a bug where Toonbook Buddy would only work on the main domain, and not other nodes",
	"Added a built in Adblock",
	"Replies now show the name next to the ID, to support non Toonbook Buddy users",
	"Added this sweet changelog alert thingy"
]; //This should be changed every update, big or small. In a big update, write everything in the past versions from the last major to the current version. Example: When going from version 1.4 to 1.5, write everything that changed in versions like 1.4.1, 1.4.2, etc

$(document).ready(function(){
	var ToonbookBuddy = {};
	var comment_box_styles = {
		"overflow-x": "auto",
		"overflow-y": "hidden",
		"resize": "none",
		"padding-bottom": "0px",
		"padding-top": "4px",
		"padding-left": "4px",
		"height": "58px",
		"max-height": "58px"
	};

	ToonbookBuddy.EventEmitter = new EventEmitter();
	
	window.ToonbookBuddy = ToonbookBuddy;
	
	function emitPostEvent(post){
		var jPost = $(post);
		
		ToonbookBuddy.EventEmitter.emit("post", {
			author: jPost.find(".feed_item_username").text(),
			authorObject: jPost.find(".feed_item_username:first"),
			authorId: jPost.find(".feed_item_username:first").attr("rev"),
			postId: jPost.attr("rev").split("item-")[1],
			message: jPost.find(".feed_item_bodytext").html(),
			messageObject: jPost.find(".feed_item_bodytext"),
			date: new Date(jPost.find(".timestamp").attr("title")),
			element: jPost,
			post: true,
			comment: false
		});
	}
	
	function emitCommentEvent(comment){
		var jComment = $(comment);
		
		ToonbookBuddy.EventEmitter.emit("comment", {
			author: jComment.find(".comments_author").text(),
			authorObject: jComment.find(".comments_author"),
			authorId: jComment.find(".comments_author").find("a").attr("rev"),
			postId: jComment.attr("rev").split("item-")[1],
			message: jComment.clone().find(".comments_info").remove("div, span").text(),
			messageObject: jComment.clone().find(".comments_info"),
			postObject: jComment.parents(".wall-action-item"),
			date: new Date(jComment.find(".timestamp").attr("title")),
			element: jComment,
			comment: true,
			post: false
		});
	}
	
	function addReplyFeature(comment){
		comment.element.find(".comment-like").after(" - <a href='javascript:void(0)' id='comment-reply'>Reply</a>");
		comment.element.attr("id", "buddy-comment-"+comment.postId);
		
		comment.message.split(/\s/).forEach(function(line){
			if(line[0] == "@"){
				var split = line.split("@");
				var id = split[1];
				
				if(!isNaN(parseInt(id))){
					var replyingTo = comment.postObject.find('.wall-comment-item[rev="item-'+id+'"]');
					
					if(replyingTo.length != 0){
						var newComment = comment.element.find(".comments_info").html();
						newComment = newComment.replace(line, "<a href='javascript:void(0)' class='comment_reply' data-replying-to='"+id+"'>"+line+"</a>");
						comment.element.find(".comments_info").html(newComment);
					}
				}
			}
		});
	}
	
	function addDeveloperTag(){
		if($(this).attr("rev") == "user_29481" && $(this).attr("href") == "/profile/boynedmaster" && $(this).find("img").length == 0){
			$(this).addClass("toon_tb_dev");
		}
	}
	
	function showId(post){
		var toCheck;
		
		if(post.comment)
			toCheck = post.element;
		else
			toCheck = post.element.closest(".generic_layout_container").find(".wall-view-action-title");
		
		if(toCheck.find("#post-id").length == 0){
			if(toCheck.find(".timestamp").length != 0)
				toCheck.find(".timestamp").after(" - <b id='post-id'>"+post.postId+"</b>");
		}
	}
	
	ToonbookBuddy.EventEmitter.on("post", showId);
	ToonbookBuddy.EventEmitter.on("comment", showId);
	ToonbookBuddy.EventEmitter.on("comment", addReplyFeature);
	
	chrome.runtime.sendMessage({method: "getAdblock"}, function(response){
		if(response)
			$(".layout_core_ad_campaign").remove();
	});
	
	chrome.runtime.sendMessage({method: "newUpdate"}, function(response){
		if(response){
			swal({
				title: "Toonbook Buddy Update",
				text: "<b>Toonbook Buddy has been updated. Here is the list of new features:</b><br><ul><li>"+changelog.join("</li><li>")+"</li></ul>",
				html: true,
				confirmButtonText: "Toontastic!"
			});
		}
	});
	
	$(document).arrive(".wall-action-item", function(){
		emitPostEvent($(this));
	});
	
	$(".wall-action-item").each(function(){
		emitPostEvent($(this));
	});
	
	$(document).arrive(".wall-comment-item", function(){
		emitCommentEvent($(this));
	});
	
	$(document).arrive("a", addDeveloperTag);
	$("a").each(addDeveloperTag);
	
	$(".wall-comment-item").each(function(){
		emitCommentEvent($(this));
	});
	
	$(".comment_reply").click(function(){
		window.location.hash = "#buddy-comment-"+$(this).attr("data-replying-to");
		window.scrollBy(0, -40);
	});
	
	$(".comment_reply").hover(function(){
		var replying_to = $("#buddy-comment-"+$(this).attr("data-replying-to"));
		
		replying_to.css("background-color", "rgb(224, 255, 255)");
	}, function(){
		var replying_to = $("#buddy-comment-"+$(this).attr("data-replying-to"));
		
		replying_to.css("background-color", "");
	});
	
	$(document).on("click", "#comment-reply", function(){
		var post = $(this).parents(".wall-action-item");
		var comment = $(this).parents(".wall-comment-item");
		
		post.find(".wall-comment-form #body").val(post.find(".wall-comment-form #body").val() + "@"+comment.attr("rev").split("item-")[1]+" / "+comment.find(".comments_author").text().trim()+"\n");
		
		if(post.find(".wall-comment-form #body").css("display") != "block"){
			post.find(".wall-comment-form").show();
			post.find(".wall-comment-form #body").css(comment_box_styles);
		}
	});
});
