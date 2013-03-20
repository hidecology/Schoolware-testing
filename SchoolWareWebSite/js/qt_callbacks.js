function finishedDownload(msg){
    loading.animate({bottom: "-=70" },200,function(){

        if(msg){
            $().toastmessage('showErrorToast', msg);
        }
        else{

            $("#inst-cat ul li:not(:first-child)").remove()
            $("#inst-cat ul").append(linker.fetchFile("cathtml.html"));
            $(".install a").fadeOut("fast",function(){
                $(this).replaceWith("<a>Installed</a>");
            }).fadeIn("fast");
        }
    });

}

function passMsg(msg){
    setTimeout(function() {
        $().toastmessage('showNoticeToast', msg);
    }, 1000)
}
