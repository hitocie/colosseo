var CURRENT_BATTLE_KEY = 'current_battle_key';

/*
*  public.
*  Action of all parts.
*/
$(function() {
  // login-btn
  $("#index-login-btn").live('click', function() {
                        _login();
                        });
  
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

  // before showing selectcompetitors page
  $(document).delegate("#select-participants-page", 'pageinit', function() {
                       _init_select_participants_page();
                       });
  
  // new-battle-btn
  $("#new-battle-btn").live('click', function() {
                            _create_battle();
                            });
  
  // setting-logout-link
  $("#setting-logout").live('click', function() {
                            _logout();
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
    find_my_battles(function(battles) {
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
                    if (battle.status == 10) {
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

    // server api:create_new_battle
//    create_new_batte(
}

//
// show friends
//
function _init_select_participants_page() {
    get_my_friends(function(friends) {                   
                   var row = '<fieldset data-role="controlgroup">';
                   
                   for (var i=0; i<friends.length; i++) {
                   var f_name = friends[i].name;
                   row += '<input type="checkbox" name="cb' + i + '" id="cb' + i + '" class="custom" />'
                   row += '<label for="cb' + i + '">' + f_name + '</label>';
                   }

                   row += '</fieldset>';

                   $('#select-participants-list').html(row).trigger('create');
                   });
}

//
// select participants
//
function _select_participants() {
    
}
