var CURRENT_BATTLE_KEY = 'current_battle_key';
var TEMP_PARTICIPANTS_KEY = 'temp_participants_key';
var LAST_PARITCIPANTS_KEY = 'last_participants_key';

/*
*  public.
*  Action of all parts.
*/
$(function() {
  /*
   * Login.
   */
  // login-btn
  $("#index-login-btn").live('click', function() {
                        _login();
                        });
  
  /*
   * Home.
   */
  // before showing main page
  $(document).delegate("#main-page", 'pageinit', function() {
                       _show_battle_info_list();
                       });
  
  // before showing status page
  $(document).delegate("#tournament-page", 'pageinit', function() {
                       _init_battle_status_page();
                       });
  
  // before showing result page
  $(document).delegate("#result-page", 'pageinit', function() {
                       _init_battle_result_page();
                       });
  
  // input-result-btn
  $("#input-result-btn").live('click', function() {
                              // 
                              });
  
  /*
   * New.
   */
  $(document).delegate("#new-page", 'pageinit', function() {
      // datepicker
  	  $("#new_b_date").scroller({
  			setText: '設定',
  			cancelText: 'キャンセル',	
       		preset: 'date',
        	theme: 'android',
        	display: 'modal',
        	mode: 'scroller',
        	dateFormat: 'yy/mm/dd',
        	dateOrder: 'mmD ddyy'
    		});
  });
  
  // before showing selectcompetitors page
  $(document).delegate("#select-participants-page", 'pageinit', function() {
                       _init_select_participants_page();
                       });
     
  // select-participants-btn
  $("#select-participants-btn").live('click', function() {
                                     _select_participants();
                                     });
  
  // new-battle-btn
  $("#new-battle-btn").live('click', function() {
                            _create_battle();
                            });
  
  // setting-logout-link
  $("#setting-logout").live('click', function() {
                            _logout();
                            });
  
  // before showing arrange participants page
  $(document).delegate("#arrange-participants-page", 'pageinit', function() {
                       _init_arrange_participants_page();
                       });
  
  // arrange-participant list
  $(".arrange-participant").live('click', function() {
                                 _move_to_arrange_result(this.id);
                                 });

  // result-participant list
  $(".result-participant").live('click', function() {
                                _move_to_arrange_list(this.id);
                                });
  
  // arrange-participants-refresh
  $("#arrange-participants-refresh").live('click', function() {
                                          _refresh_arrange_participants_page();
                                          });
  
  // arrange-participants-btn
  $("#arrange-participants-btn").live('click', function() {
                                      _finish_arrange_participants();
                                      });

  }
  );
    
/*
*  private.
*  Functions for all pages.
*/

//
// login
//
function _login() {
    $.mobile.changePage("main.html");
}

//
// logout
//
function _logout() {
    // logout function here.
    
    // initialize localStorage.
    window.localStorage.clear();
    
    $.mobile.changePage("index.html", {transition: "none"});
}

//
// show battle info list
//
function _show_battle_info_list() {
    // server api: find_my_battles
    find_my_battles({}, function(battles) {
                    var b_list = battles;
                    
                    var row = '';
                    
                    for (var i=0; i<b_list.length; i++) {
                    var battle = b_list[i];
                    
                    var b_id = battle.id;
                    var b_storage_id = 'battle_' + b_id;
                    var b_title = battle.title;
                    var b_status = '';
                    var b_result_page = '';
                    
                    // create list
                    if (battle.status == 50) {
                    b_status = "kaisai";
                    b_result_page = 'tournament';
                    } else {
                    b_status = "syuryo";
                    b_result_page = 'result';
                    }
                    
                    row += '<li><a href="#"><img src="img/'+b_status+'.png" class="ui-li-icon">'+b_title+'</a><a id="'+b_storage_id+'" class="b-link" href="'+b_result_page+'.html" data-transition="slide">link</a></li>';
                    };
                    
                    $("#main-battle-list").append(row);
                    $("#main-battle-list").listview('refresh');
                    
                    // set target battle for status/result pages.
                    $(".b-link").click(function() {
                                       window.localStorage.setItem(CURRENT_BATTLE_KEY, (this.id).replace(/battle_/, ""));
                                       });
                    
    });

}

//
// init battle status page
//
function _init_battle_status_page() {
    // get a battle value from localStorage.
    var b_key = window.localStorage.getItem(CURRENT_BATTLE_KEY);

    // server api:get_my_battle
    get_my_battle(b_key, function(battle) {
                  b_val = battle;
                  var b_title = b_val.title;
                  var b_desc = b_val.description;
                  
                  $("#t-title").append('<h3>'+b_title+'</h3>');
                  $("#t-description").append('<h5>'+b_desc+'</h5>');               
                  });    
}

//
// input status
//
function _input_status() {
    
}

//
// init battle result page
//
function _init_battle_result_page() {
    // get a battle value from localStorage.
    var b_key = window.localStorage.getItem(CURRENT_BATTLE_KEY);

    // server api:get_my_battle
    get_my_battle(b_key, function(battle) {
                  b_val = battle;
                  var b_title = b_val.title;
                  var b_desc = b_val.description;
                  
                  $("#r-title").append('<h3>'+b_title+'</h3>');
                  $("#r-description").append('<h5>'+b_desc+'</h5>');                  
                  });      
}

//
// create battle
//
function _create_battle() {
    var b_title = $('#new_b_title').val();
    var b_date = $('#new_b_date').val();
    var b_desc = $('#new_b_description').val();
    var b_type = 0;
    var b_type_val = $('#new_b_type option:selected').val();
    if (  b_type_val == 'tournament' ) {
        b_type = BattleKind.tournament;
    } else if (b_type_val == 'league') {
        b_type = BattleKind.league;
    }
    
    if (b_title == "") {
        alert("title");
        return;
    } else if (b_date == "") {
        alert("date");
        return;
    } else if (b_desc == "") {
        alert("comment");
        return;
    }
    
    var b_participants = JSON.parse(window.localStorage.getItem(LAST_PARITCIPANTS_KEY));
    
    if (b_participants == null || typeof b_participants === "undefined") {
        alert("participants");
    }
    // server api:create_new_battle
    create_new_battle(b_title,
                      b_date,
                      b_desc,
                      b_type,
                      null,
                      BattleStatus.ongoing,
                      b_participants);

    _clear_new_page();
    
    // move to main page
    $.mobile.changePage("main.html");

}

//
// show friends
//
function _init_select_participants_page() {
    get_my_friends(function(friends) {          
                   var row = '<fieldset data-role="controlgroup">';
                   
                   for (var i=0; i<friends.length; i++) {
                   var f_id = friends[i].uid;
                   var f_name = friends[i].name;
                   row += '<input type="checkbox" name="f_cb" id="cb' + f_id + '" value="' + f_id + '" class="custom" />';
                   row += '<label id="label'+f_id+'" for="cb' + f_id + '">' + f_name + '</label>';
                   }

                   row += '</fieldset>';

                   $('#select-participants-select').html(row).trigger('create');
                   });
}

//
// select participants
//
function _select_participants() {
    var cb_vals = Array();
    var cb_json = {};
    $("input[name=f_cb]:checked").map(function() {
                                      cb_vals.push($(this).val());
                                      });
    for (var i=0; i<cb_vals.length; i++) {
        var fid = cb_vals[i];
        cb_json[fid] = $("#label"+fid).text();
    }

    window.localStorage.setItem(TEMP_PARTICIPANTS_KEY, JSON.stringify(cb_json));
    
    $.mobile.changePage("arrangeparticipants.html", {transition: "slide"});
}

//
// init arrange participants page
//
function _init_arrange_participants_page() {
    var p_json = JSON.parse(window.localStorage.getItem(TEMP_PARTICIPANTS_KEY));
    var row = '';
    for (var key in p_json) {
        row += '<li class="arrange-participant" id="a' + key + '" data-icon="arrow-d"><a href="#">' + p_json[key] + '</a></li>';
    }

    $("#arrange-participants-list").append(row);
    $("#arrange-participants-list").listview('refresh');
    $("#arrange-participants-list li:first").addClass('ui-corner-top');
    $("#arrange-participants-list li:last").addClass('ui-corner-bottom');
}

//
// move from participants list to result list
//
function _move_to_arrange_result(id) {
    $("#"+id).removeClass("arrange-participant").addClass("result-participant").buttonMarkup({icon:"arrow-u"}).appendTo("#arrange-result-list");
    $("#arrange-result-list").listview('refresh');
    $("#arrange-participants-list").listview('refresh');
}

//
// move from result list to particpants list
//
function _move_to_arrange_list(id) {
    $("#"+id).removeClass("result-participant").addClass("arrange-participant").buttonMarkup({icon:"arrow-d"}).appendTo("#arrange-participants-list");
    $("#arrange-result-list").listview('refresh');
    $("#arrange-participants-list").listview('refresh');
}

//
// refresh arrange participants page
//
function _refresh_arrange_participants_page() {
    $("#arrange-participants-list li").remove();
    $("#arrange-result-list li").remove();
    _init_arrange_participants_page();
}

//
// finish arrange participants
//
function _finish_arrange_participants() {
    var a_list = $("#arrange-result-list li");
    var a_json = [];

    for (var i=0; i<a_list.length; i++) {
        var a_id = (a_list[i].id).replace('a','');
        a_json[i] = {uid:a_id};
    }

    window.localStorage.setItem(LAST_PARITCIPANTS_KEY, JSON.stringify(a_json));
    
    $.mobile.changePage("new.html");
}

//
// clear new page
//
function _clear_new_page() {
    $("#new_b_title").val("");
    $("#new_b_date").val("");
    $("#new_b_description").val("");
    $("#new_b_type").val("tournament").selectmenu('refresh');
    window.localStorage.removeItem(TEMP_PARTICIPANTS_KEY);
    window.localStorage.removeItem(LAST_PARITCIPANTS_KEY);
}