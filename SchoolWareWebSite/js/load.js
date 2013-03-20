/*============================
        Gloabl variables
  ===========================*/

var catHtml = " ";
var instAppsHtml = " ";
var browsingHTML= " ";

/*============================
         Caching
  ===========================*/
var loading = $("#loading-wrapper");
var loadingText = $("#loading-wrapper span");
var appPane = $("#app-pane");
var cover = $("#cover");
/*============================
     Window onload function
  ===========================*/

window.onload = function(e){

    e.preventDefault();

    /*Tweaked jQuery's fx interval for smoother animations in Qt*/
    jQuery.fx.interval = 50;


    /*============================================
            Load html files stored locally
    ==============================================  */
bindEvents();
        instAppsHtml = linker.fetchFile("appList.html");
        if(instAppsHtml !=  " "){
            appPane.html(instAppsHtml);
        }
        else appPane.html('<h1 id="start-br">Start browsing applications.</h1>');

        catHtml = linker.fetchFile("cathtml.html");

        if(catHtml != " "){
            $("#inst-cat ul").append(catHtml);
        }
        $('body').fadeIn("fast",function(){

            var msg = linker.bootChecks();
            if(msg){

                $().toastmessage('showNoticeToast', "You need the following programs to run applications:\n"+ msg);

            }

            retrieveCategories();
           // window.location = "http://www.google.com/"
        });


}

