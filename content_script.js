$(document).ready(function(){
	var ToonbookBuddy = {};

	ToonbookBuddy.EventEmitter = new EventEmitter();
	
	window.ToonbookBuddy = ToonbookBuddy;
	
	function emitPostEvent(post){
		ToonbookBuddy.EventEmitter.emit("post", {
			author: $(post).find(".feed_item_username").text(),
			message: $(post).find(".feed_item_bodytext").html(),
			date: new Date($(post).find(".timestamp").attr("title")),
			element: post,
			post: true,
			comment: false
		});
	}
	
	function emitCommentEvent(comment){
		ToonbookBuddy.EventEmitter.emit("comment", {
			author: $(comment).find(".comments_author").text(),
			message: $(comment).clone().find(".comments_info").remove("div, span").text(),
			date: new Date($(comment).find(".timestamp").attr("title")),
			element: comment,
			comment: true,
			post: false
		});
	}
	
	$(document).arrive(".wall-action-item", function(){
		emitPostEvent($(this));
	});
	
	$(".wall-action-item").each(function(){
		emitCommentEvent($(this));
	});
	
	$(document).arrive(".wall-comment-item", function(){
		emitCommentEvent($(this));
	});
	
	$(".wall-comment-item").each(function(){
		emitCommentEvent($(this));
	});
});
