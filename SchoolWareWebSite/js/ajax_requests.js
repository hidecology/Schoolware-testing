function retrieveCategories(){
    loading.promise().done(function(){
    loadingText.text("Loading...");
    loading.animate({bottom: "+=70"},200,function(){

        $("#br-cat ul").append('<li id="all"><a onfocus="blur();">All</a></li>');

        $.getJSON("http://schoolware.cs.ucl.ac.uk:9999/aad-ws/api/categories", function(data) {

            $.each(data, function(i, item) {

                $.each(item,function(prop,value){
                    $("#br-cat ul").append('<li id="'+value.categId+'"><a onfocus="blur();">'+value.categType+'</a></li>');
                });

              });

        })
        .success(function(){
            loading.animate({bottom: "-=70"},200);}
        )
        .error(function(jq, textstatus, errorThrown) {
            loading.animate({bottom: "-=70"},200);
                //alert("Error: "+errorThrown);
            $().toastmessage('showErrorToast', "Error: "+errorThrown);
        });

    });
    });
}

function retrieveAppsByCat(category){

    loading.promise().done(function(){
    appPane.fadeOut("fast",function(){
        $(this).empty();
        loadingText.text("Loading...");
        loading.animate({bottom: "+=70"},200,function(){

            $.getJSON("http://schoolware.cs.ucl.ac.uk:9999/aad-ws/api/applications/"+category, function(data) {
              $.each(data, function(i,apps) {
                  $.each(apps,function(prop,value){
                     // alert(value.categoryName);
                      appPane.append('<div class="browse-app" category="'+value.categoryName+'" description=\"'+value.description+'\"><a href="'+value.url+'" onfocus="blur();"><img src="img/application_icon.png"/>'+value.name+'</a></div>');
                     $(".browse-app").fadeIn("fast");
                  });

                });
            })
            .success(function(){
             loading.animate({bottom: "-=70"},200);

             })
            .error(function(jq, textstatus, errorThrown) {
                loading.animate({bottom: "-=70"},200);
                $().toastmessage('showErrorToast', "Error: "+errorThrown);
            });

     });
        }).fadeIn("fast");
    });
}

function sendTestResults(str){

    var json;
    loading.promise().done(function(){
    try{

        json = JSON.parse(str);
        loadingText.text("Sending resutls...");
        loading.animate({bottom: "+=70"},200,function(){

            $.ajax({
                    type: "POST",
                    url: "http://schoolware.cs.ucl.ac.uk:9999/aad-ws/api/result/submit",
                      // data : {json:json},
                         data: str,
                       contentType:'application/json'
                }).done(function(msg ) {
                    //$().toastmessage('showErrorToast',"Fine");
                    $().toastmessage('showSuccessToast', "Test Resutls sent.");
                    loading.animate({bottom: "-=70"},200);
                  })
            .error(function(jq, textstatus, errorThrown){
                $().toastmessage('showErrorToast', "Error: " + errorThrown);
                loading.animate({bottom: "-=70"},200);
            });

        });
    }
    catch(e){
        $().toastmessage('showErrorToast', "Error: Application produced faulty resutls.");
    }
   });
}
/* Meant to implement the observer pattern
  function poll(){
$.ajax({ '': "server", success: function(data){
            alert('Polling!');
            //update code goes here


    }, dataType: "json", complete: poll, timeout: 30000 });
    }
    */
