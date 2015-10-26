$(document).ready(function(){
	var ToonbookBuddy = {};

	ToonbookBuddy.EventEmitter = new EventEmitter();
	
	window.ToonbookBuddy = ToonbookBuddy;
	
	function emitPostEvent(post){
		var jPost = $(post);
		
		ToonbookBuddy.EventEmitter.emit("post", {
			author: jPost.find(".feed_item_username").text(),
			authorObject: jPost.find(".feed_item_username:first"),
			authorId: jPost.find(".feed_item_username:first").attr("rev"),
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
			message: jComment.clone().find(".comments_info").remove("div, span").text(),
			messageObject: jComment.clone().find(".comments_info"),
			date: new Date(jComment.find(".timestamp").attr("title")),
			element: jComment,
			comment: true,
			post: false
		});
	}
	
	function addDeveloperTag(post){
		if(post.authorId == "user_29481"){
			post.authorObject.addClass("toon_tb_dev");
		}
	}
	
	ToonbookBuddy.EventEmitter.on("post", addDeveloperTag);
	ToonbookBuddy.EventEmitter.on("comment", addDeveloperTag);
	
	$(document).arrive(".wall-action-item", function(){
		emitPostEvent($(this));
	});
	
	$(".wall-action-item").each(function(){
		emitPostEvent($(this));
	});
	
	$(document).arrive(".wall-comment-item", function(){
		emitCommentEvent($(this));
	});
	
	$(".wall-comment-item").each(function(){
		emitCommentEvent($(this));
	});
});
