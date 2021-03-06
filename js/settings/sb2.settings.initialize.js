var urlParams;

// Default to loading room ss20
var r_id = "r_ss20";

// pic that gets loaded if no profile pic is present
var no_pic_url = 'assets/no_profile_pic.png';

function initializeUrlParams() {
	var match,
        pl     = /\+/g,  // Regex for replacing addition symbol with a space
        search = /([^&=]+)=?([^&]*)/g,
        decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
        query  = window.location.search.substring(1);

    urlParams = {};
    while (match = search.exec(query))
       urlParams[decode(match[1])] = decode(match[2]);
}


$(document).ready(function(){

    initializeUrlParams();
    if (urlParams['r_id']) r_id = urlParams['r_id'].toLowerCase();

    stripped_r_id = (r_id.lastIndexOf('r_id', 0) === 0 ?
        r_id : r_id.substring(2, r_id.length)).toUpperCase();

    $('h1').text(stripped_r_id + ' NetBoard settings');

    $('#save_settings').click(save_settings);
    $('#add_user').click(function() {
		add_user(new Object(), true);
	});
	
	$.ajax({
		dataType: "json",
		url: "content/room_data_"+r_id+".json",
		cache: false,
		success: function(json_data){
			_(json_data.users).each(function(e) {
				add_user(e, false);
			});
		}
	});
	
	
	$("#btn_returntoindex").click(function() {
		window.location.href = window.location.href.replace("settings.html", "index.html");
	});
    
});


function add_user(user, fromClick, insertLocation){

	var usr_sec = $('<section/>').addClass('user');

	var img = $('<img/>').attr('src', user.img_src ? user.img_src : no_pic_url);
    img.attr('onerror', "this.src='" + no_pic_url + "';");

    var form_div = $('<div/>').addClass('form');

    var text_id = $('<aside/>').text('User ID'),
        input_id = $('<input/>').attr('name', 'input_id').val(user.u_id);

    var text_name = $('<aside/>').text('Name'),
        input_name = $('<input/>').attr('name', 'input_name').val(user.name);

    var text_description = $('<aside/>').text('Description'),
        input_description = $('<input/>').attr('name', 'input_description').val(user.description);

    var text_imageUrl = $('<aside/>').text('Image URL'),
        input_imageUrl = $('<input/>').attr('name', 'input_imageUrl').val(user.img_src);

    var text_status = $('<aside/>').html('Status <br> <span>optional</span>'),
        input_status = $('<input/>').attr('name', 'input_status').val(user.status);

    var text_webpageUrl = $('<aside/>').html('Webpage URL <br> <span>optional</span>'),
        input_webpageUrl = $('<input/>').attr('name', 'input_webpageUrl').val(user.webpage_src);

    var delete_button = $('<button/>').text('delete user').addClass('ALIZARIN');
    var save_button = $('<button/>').text('save changes').addClass('EMERALD');
	
	var div_userbuttons = $("<div/>").addClass("userbuttons");
	div_userbuttons.append(delete_button);
	div_userbuttons.append(save_button);
	

    // update the preview of the profile picture
    input_imageUrl.on('input', function(evt) {
        img.attr('src', input_imageUrl.val());
    });
	
	// update the user object in response to changes in the input values
	form_div.on("input", "input", function() {
		user = extract_user_details(usr_sec);
	});

    delete_button.click(function(){delete_user(user, usr_sec)});
	save_button.click(save_settings);

    form_div.append(text_id).append(input_id);
    form_div.append(text_name).append(input_name);
    form_div.append(text_description).append(input_description);
    form_div.append(text_imageUrl).append(input_imageUrl);
    form_div.append(text_status).append(input_status);
    form_div.append(text_webpageUrl).append(input_webpageUrl);
    form_div.append(div_userbuttons);
	usr_sec.append(img).append(form_div);
	
	if (fromClick == true) usr_sec.hide();
	if (typeof insertLocation != 'undefined') {
		console.log(usr_sec);
		$(usr_sec).insertAfter(insertLocation);
	} else {
		$("#sortable").append(usr_sec);
	}
	if (fromClick == true) usr_sec.slideDown();
}

function delete_user(user, usr_sec){

    var deleted_usr_sec = $('<section/>'),
        deleted_usr_div = $('<div/>').addClass('deleted_user');
    deleted_usr_div.html('User deleted (' + (typeof user.name != 'undefined' ? user.name : 'unnamed user') + '). <span>Undo?</span>')

    deleted_usr_sec.append(deleted_usr_div);
    deleted_usr_div.children('span').click(function(){
        deleted_usr_sec.slideUp(function() {
			$(this).remove();
		});
        add_user(user, true, deleted_usr_sec)
    });
	
	deleted_usr_sec.hide();
    usr_sec.before(deleted_usr_sec);
	deleted_usr_sec.slideDown();
    usr_sec.slideUp(function() {
		$(this).remove();
	});
}