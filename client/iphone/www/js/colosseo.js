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

  // setting-logout-link
  $("#setting-logout").live('click', function() {
                            _logout();
                            });
  
  get_my_friends(function(friends) {alert("aaaaa");});
  
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
    // json sample
    var b_list = [
                  {"id":1,"title":"BATTLE-1","date":"2012-01-01","description":"This is a big event.","kind":0,"result":{"z":1000,"x":2000},"status":10,"owner":{"id":1,"uid":"10001","name":"Hitoshi Okada"}},
                  {"id":2,"title":"BATTLE-2","date":"2012-01-01","description":"This is a big event.","kind":0,"result":{"z":1000,"x":2000},"status":90,"owner":{"id":1,"uid":"10001","name":"Hitoshi Okada"}}
                  ];
    
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
        
        // set local storage
        // id: b_storage_id, value: battle(json string)
        window.localStorage.setItem(b_storage_id, JSON.stringify(battle));
    };
    
    $("#main-battle-list").append(row);
    $("#main-battle-list").listview('refresh');
    
    // set target battle for status/result pages.
    $(".b-link").click(function() {
                       window.localStorage.setItem(CURRENT_BATTLE_KEY, this.id);
                       });

}

//
// init battle status page
//
function _init_battle_status_page() {
    // get a battle value from localStorage.
    var b_key = window.localStorage.getItem(CURRENT_BATTLE_KEY);
    var b_val = JSON.parse(window.localStorage.getItem(b_key));
    
    var b_title = b_val.title;
    var b_desc = b_val.description;
    
    $("#t-title").append('<h3>'+b_title+'</h3>');
    $("#t-description").append('<h5>'+b_desc+'</h5>');
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
  var b_val = JSON.parse(window.localStorage.getItem(b_key));
  
  var b_title = b_val.title;
  var b_desc = b_val.description;
  
  $("#r-title").append('<h3>'+b_title+'</h3>');
  $("#r-description").append('<h5>'+b_desc+'</h5>');    
}

//
// create battle
//
function _create_battle() {
    
}

//
// show friends
//
function _show_friends() {

}

//
// select participants
//
function _select_participants() {
    
}
