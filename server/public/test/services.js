/**
 * services.js
 */
var root_url = '/api/v1/';

// common
function async_request(args) {
	
	var url = args.url;
	var success_handler = args.success_handler;
	var data = args.data;
	var type = args.type;
	if (type == undefined)
		type = 'GET';
	
	$.ajax({
		url: url,
		data: data,
		type: type,
		async: true,
		dataType: 'json',
		cache: false,
		contentType: 'application/json; charset=utf-8',
		success: success_handler,
		error: function(data, status) {
			var v = JSON.parse(data.responseText);
			if (v.failed) {
				var e = new Error();
				e.name = 'MeeetletNetworkError';
				e.message = JSON.stringify(v.message);
				throw e;
			}
		}
	});
}

function sync_request(args) {
	var url = args.url;
	var data = args.data;
	var type = args.type;
	if (type == undefined)
		type = 'GET';
	
	var response = $.ajax({
		url: url,
		data: data,
		type: type,
		async: false,
		dataType: 'json',
		cache: false,
		contentType: 'application/json; charset=utf-8'
	}).responseText;

	// instead of "trim" method.
	if (response.replace(/^\s+|\s+$/g, "") != "") {
		var v = JSON.parse(response);
		if (v.failed) {
			var e = new Error();
			e.name = 'MeeetletNetworkError';
			e.message = JSON.stringify(v.message);
			throw e;
		}
		return v;
	}
	return {};
}

// auths
function is_login() {
	return sync_request({
		url: root_url + 'auths/0',
		data: {service: 'is_login'}
	});
}
function logout() {
	return sync_request({
		url: root_url + 'auths/0',
		data: {service: 'logout'}
	});
}

// users
function get_me(p) {
	async_request({
		url: root_url + 'users/0',
		data: {service: 'get_me'},
		success_handler: function(data, status) {
			p(data);
		}
	});
}
function get_my_friends(p) {
	async_request({
		url: root_url + 'users/0',
		data: {service: 'get_my_friends'},
		success_handler: function(data, status) {
			p(data);
		}
	});
}


// battles
var BattleKind = {
	tournament: 0,
	league: 1
};
var BattleStatus = {
	ongoing: 50,
	finished: 90
};
function find_my_battles(conditions, p) {
	var offset = 0;
	if (conditions.offset != undefined)
		offset = conditions.offset;
	var limit = 10;
	if (conditions.limit != undefined)
		limit = conditions.limit;
	
	async_request({
		url: root_url + 'battles',
		data: {service: 'find_my_battles', offset: offset, limit: limit},
		success_handler: function(data, status) {
			p(data);
		}
	});
}
function get_my_battle(id, p) {
	async_request({
		url: root_url + 'battles/' + id,
		data: {service: 'get_my_battle'},
		success_handler: function(data, status) {
			p(data);
		}
	});
}
function create_new_battle(
		title,
		date,
		description,
		kind,
		result,
		status,
		participants) {	
	var b = {
			title: title,
			date: date,
			description: description,
			kind: kind,
			result: result,
			status: status,
			participants: participants
	};
	var response = sync_request({
		url: root_url + 'battles',
		type: 'POST',
		data: JSON.stringify({service: 'create_new_battle', battle: b})
	});
	return response;
}
function update_result_of_battle(id, result) {	
	var b = {
			result: result
	};
	sync_request({
		url: root_url + 'battles/' + id,
		type: 'PUT',
		data: JSON.stringify({service: 'update_result_of_battle', battle: b})
	});
}
function delete_battle(id) {
	sync_request({
		url: root_url + 'battles/' + id,
		type: 'DELETE',
		data: JSON.stringify({service: 'delete_battle'})
	});
}
