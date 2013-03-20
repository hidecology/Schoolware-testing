function bindEvents(){
    /*============================================
                Sidebar click events
    ==============================================  */
    $("#sidebar nav ul li a").click(function(event){

        event.preventDefault();
        $("#x").click();

        $("#sidebar nav ul li.selected").removeClass("selected").addClass("non-selected");
        $(this).parent().removeClass("non-selected").addClass("selected");

        if($(this).attr('href') == "#installed-apps"){

            browsingHTML = appPane.html();

            appPane.fadeOut("fast",function(){

                var instApps = linker.fetchFile("appList.html");
                if(instApps == "" ||instApps == " "){
                    appPane.html('<h1 id="start-br">Start browsing applications.</h1>');
                }
                else{

                    $(this).html(instApps);
                    var selcat = $("#inst-cat li.selected").text();
                    filterApps(selcat);
                }

            });

            $( "div" ).promise().done(function() {
                $( "#app-pane" ).fadeIn("fast");
              });

            if($("#inst-cat").css("left") != "180px"){
                if($("#br-cat").css("left") != "0px"){
                    $("#br-cat").animate({left: "-=180"},200,function(){
                        $("#inst-cat").animate({left: "+=180"},200);
                    });
                }
                else{
                    $("#inst-cat").animate({left: "+=180"},200);
                }

            }
        }
        else if($(this).attr('href') == "#_faq_"){
            if($("#inst-cat").css("left") != "0px"){
                $("#inst-cat").animate({left: "-=180"},200);
                appPane.fadeOut("slow",function(){
                    $(this).html("");
                }).fadeIn("slow");
            }
            else{
                $("#br-cat").animate({left: "-=180"},200);
                appPane.fadeOut("slow",function(){
                    $(this).html("");
                }).fadeIn("slow");
            }
        }
        else{
            if($("#br-cat").css("left") != "180px"){
                if($("#inst-cat").css("left") != "0px"){
                    $("#inst-cat").animate({left: "-=180"},200,function(){
                        $("#br-cat").animate({left: "+=180"},200);
                    });
                }
                else{
                    $("#br-cat").animate({left: "+=180"},200);
                }

            }
            if(browsingHTML != " "){
                appPane.fadeOut("fast",function(){
                    $(this).html(browsingHTML);
                }).fadeIn("fast");
            }
            else{
                appPane.html( '<h1 id="start-br">Select a category.</h1>');
            }
        }

    });

/*============================================
            Categories click events
============================================== */

    $("#inst-cat ul li a").live("click",function(event){

        event.preventDefault();
        $("#x").click();
        $("#inst-cat li.selected").removeClass("selected");
        $(this).parent().addClass("selected");
        var selcat = $(this).text();
        filterApps(selcat);
    });

    $("#br-cat ul li a").live("click",function(event){

        event.preventDefault();
        $("#x").click();
        $("#br-cat li.selected").removeClass("selected");
        $(this).parent().addClass("selected");
        retrieveAppsByCat($(this).parent().attr("id"));

    });

/*============================================
       Application related events
==============================================*/

    $(".browse-app a").live("click",function(event){

        event.preventDefault();

        cover.fadeIn(200);
        cover.append('<div id="full-app-desc"><div id="fad-wrapper"></div></div>');

        var href = $(this).attr("href");
        $(this).parent().clone().appendTo("#fad-wrapper");
        $("#fad-wrapper").append("<p id=\"app-desc\">"+$(this).parent().attr("description")+"</p>");

        $("#full-app-desc div.browse-app img").unwrap();
        var aname = $("#full-app-desc div.browse-app").text();
        var acat = $(this).parent().attr("category");
       // appExists(aname, acat);
        if(appExists(aname, acat)){
                 $("#full-app-desc").append("<div id=\"download\" class=\"installed\"><a>Installed</a></div>");
        }
        else{
            $("#full-app-desc").append("<div id=\"download\" class=\"install\"><a href=\""+href+"\" onfocus=\"blur();\">Install</a></div>");
        }
        $("#full-app-desc").animate({top: "+=600"},200,function(){
            $("#full-app-desc").prepend('<div id="x"><a>CLOSE<img src="img/x.png"/></a></div>');
        });
    });

    $("#x").live("click",function(){
        $("#full-app-desc").animate({top: "-=600"},200,function(){
            $(this).remove();
            cover.hide();
        });
    });

    $(".install a").live("click",function(event){

        event.preventDefault();

        var classArr = $("#full-app-desc div.browse-app").attr('class');
        var cat = $("#full-app-desc div.browse-app").attr('category');
        var url = $(this).attr('href');
        var desc = $("#app-desc").text();
        var app_name = $("#full-app-desc div.browse-app").text();

        linker.initiateDownload(url, app_name, cat, desc);

        loadingText.text("Downloading...");
        loading.animate({bottom: "+=70"},200);
        $("#inst-cat ul li #all").addClass("selected");
       // $("#inst-cat ul li.selected").removeClass("selected");

    });

    $(".installed-app a").live("click",function(event){

        event.preventDefault();

        cover.fadeIn(200);
        cover.append('<div id="full-app-desc"><div id="fad-wrapper"></div></div>');

        var href = $(this).attr("href");
        var AppName = $(this).text();
        $(this).parent().clone().appendTo("#fad-wrapper");
        $("#fad-wrapper").append("<p id=\"app-desc\">"+$(this).parent().attr("description")+"</p>");

        $("#full-app-desc div.installed-app img").unwrap();
        $("#full-app-desc").append("<div id=\"launch\"><a href=\""+href+"\" onfocus=\"blur();\">Launch</a></div>");
        $("#full-app-desc").append("<div id=\"download\" class=\"uninstall\" category=\""+$(this).parent().attr("category")+"\"><a class href=\""+AppName +"\" onfocus=\"blur();\">Uninstall</a></div>");

        $("#full-app-desc").animate({top: "+=600"},200,function(){
            $("#full-app-desc").prepend('<div id="x"><a>CLOSE<img src="img/x.png"/></a></div>');
        });
    });

    $("#launch a").live("click",function(event){
        event.preventDefault();
        var appPath = $(this).attr('href');

            var exit = linker.launchApp(appPath);
            if(exit === 1){
                $().toastmessage('showErrorToast', "Failed to launch the application.");
            }
    });

    $(".uninstall a").live("click",function(event){
        event.preventDefault();
        var appname = $(this).attr("href");
        var category = $(this).parent().attr("category");

        if(linker.uninstallApp(appname, category)){

            var count = 0;

            $("#app-pane div").each(function(){

                if($(this).attr('category') == category && $(this).find("a").text() == appname){

                    var elemToRemove = $(this);

                    $("#x").click();
                    $("#x").promise().done(function(){

                        elemToRemove.fadeOut("slow",function(){

                            $(this).remove();
                            var updateVar = "";
                            if($("#app-pane div").length > 0){

                               updateVar = appPane.html();
                            }
                            linker.updateFile("appList.html",updateVar);

                        });
                    });

                }
                else if($(this).attr('category') == category){
                    count ++;
                }

            });
            if (count == 0 ){

                $("#inst-cat  #"+category).remove();
                var updateData = "";
                if($("#inst-cat ul li").length != 1){
                    var obj = $("#inst-cat ul li:not(:first)");
                    alert(obj.wrap("<div></div>").parent.html());
                    updateData = obj.wrap("<div></div>").parent.html();
                }

                linker.updateFile("cathtml.html",updateData);
            }
        }
        else $().toastmessage('showErrorToast', "Something went wrong!");
    });


   /*============================
        Useful operations
     ===========================*/

    /* Function used to filter installed apps based on their category*/

    function filterApps(selcat){

        if(selcat == "All"){
            $("#app-pane div").each(function(){
                if($(this).is(":hidden")){
                    $(this).show("fast");
                }
            });
        }
        else{
            $("#app-pane div").each(function(){

             var str = $(this).attr("category");
                if(selcat != str){
                    $(this).hide("slow");
                }
                 else{
                    $(this).show("slow");
                }
            });
         }
    }

    /* Check if application exists */

    function appExists(appname, category){

        var apps = linker.fetchFile("update.json");

        if(apps != " "){
        try{
            var obj = JSON.parse(apps);
            for (var i = 0, len = obj.length; i < len; i++) {
                if(obj[i].Appname == appname && obj[i].Category === category){
                    return true;
                }
            }
        }catch(e){
            $().toastmessage('showErrorToast', "Error: Applications file corrupted");
        }
        }
        return false;
    }
  /*  appPane.scroll(function(){

        if(231 - $(this).scrollTop() == 0) {
              alert("call!");
           }
    });*/
}

if ( typeof linker === "undefined" )
{
var linker = {
    launchApp: function(appPath) {
        var regAppName = new RegExp("MathsAppNew", "i");
        if ( appPath.match(regAppName) != null )
        {
            return 1;
        }
        else
        {
            return 0;
        }
    },

    initiateDownload: function(url, app_name, cat, desc) {
        // var storage = sessionStorage;
        var storage = localStorage;
        // build cathtml.html
        var storeCatData = storage.getItem( "cathtml.html" );
        if ( storeCatData != null )
        {
            var reg = new RegExp(cat, "i");
            if ( storeCatData.match(reg) == null )
            {
                storeCatData += "<li id=\""+cat+"\"><a onfocus=\"blur();\">"+cat+"</a></li>";
            }
        }
        else
        {
            storeCatData = "<li id=\""+cat+"\"><a onfocus=\"blur();\">"+cat+"</a></li>";
        }
        storage.setItem( "cathtml.html", storeCatData );
        // build appList.html
        var storeAppListData = storage.getItem( "appList.html" );
        var urlParts = url.split('/');
        var appFileName = urlParts[urlParts.length - 1];
        var PathToApp = "/Applications/AppFolder/" + cat + "/" + app_name + "App/" + appFileName;
        if ( storeAppListData != null )
        {
            //var PathToApp = "aaa";
            storeAppListData += "<div class=\"installed-app\" category=\""+cat+"\" description=\""+desc+"\">";
            storeAppListData += "<a href=\""+PathToApp+"\"><img src=\"img/application_icon.png\"/>"+app_name+"</a>";
            storeAppListData += "</div>";
        }
        else
        {
            storeAppListData = "<div class=\"installed-app\" category=\""+cat+"\" description=\""+desc+"\">";
            storeAppListData += "<a href=\""+PathToApp+"\"><img src=\"img/application_icon.png\"/>"+app_name+"</a>";
            storeAppListData += "</div>";
        }
        storage.setItem( "appList.html", storeAppListData );
        // build JSON
        var storeJSONData = storage.getItem( "update.json" );
        if ( storeJSONData != null )
        {
            var len = storeJSONData.length;
            storeJSONData = storeJSONData.substring(0, len - 2);
            storeJSONData += ",\n{\"Appname\" : \""+appFileName+"\",\"Category\":\""+cat+"\"}\n]";
        }
        else
        {
            storeJSONData = "[\n{\"Appname\" : \""+appFileName+"\",\"Category\":\""+cat+"\"}\n]";
        }
        storage.setItem( "update.json", storeJSONData );
        // call a JS callback
        finishedDownload();
        return;
    },

    setFrame: function() {

    },

    JSCallback: function() {

    },

    fetchFile: function(url) {
        // var storage = sessionStorage;
        var storage = localStorage;
        if ( typeof sessionStorage == undefined )
        {
            if ( url === "appList.html" ) {
                return "<div class=\"installed-app\" category=\"Mathematics\" description=\"asdassdad\"><a href=\"/Applications/AppFolder/Mathematics/AppTestApp/Coureswork.jar\"><img src=\"img/application_icon.png\"/>AppTest</a></div>";
            } else if ( url === "cathtml.html" ) {
                return "<li id=\"Mathematics\"><a onfocus=\"blur();\">Mathematics</a></li>";
            } else if ( url === "update.json" ) {
                return "[ {\"Appname\" : \"AppTest\",\"Category\":\"Mathematics\"} ]";
            } else {
                return " ";
            }
        }
        else
        {
            var storeData = storage.getItem( url );
            if ( storeData == null )
            {
                return " ";
            }
            else
            {
                return storeData;
            }
        }
    },

    json: function() {

    },

    uninstallApp: function(appname, category) {
        // var storage = sessionStorage;
        var storage = localStorage;
        var storedJSONData = storage.getItem( "update.json" );
        var blockJSON = storedJSONData.split("\n");
        var storeData = "";
        var count = 0;
        var len = blockJSON.length;
        for ( var i = 0 ; i < len ; i++ )
        {
            var regAppName = new RegExp(appname, "i");
            var regCategory= new RegExp(category, "i");
            if ( (blockJSON[i].match(regAppName) == null) && (blockJSON[i].match(regCategory) == null) )
            {
                storeData += blockJSON[i] + "\n";
                count++;
            }
        }
        if ( count >= 3 )
        {
            storage.setItem( "update.json", storeData );
        }
        else
        {
            storage.removeItem( "update.json" );
        }
        return true;
    },

    updateFile: function(filename, updateData) {
        // var storage = sessionStorage;
        var storage = localStorage;
        if ( typeof sessionStorage == undefined )
        {
            return;
        }
        else
        {
            storage.setItem( filename, updateData );
        }
    },

    bootChecks: function() {
        var storage = localStorage;
        if ( typeof sessionStorage == undefined )
        {
            return null;
        }
        else
        {
            var storeData = storage.getItem( "start_flg" );
            if ( storeData == null )
            {
                storage.setItem( "start_flg", "true" );
                return "     Java<br/>";
            }
            else
            {
                return null;
            }
        }
    }
};
}