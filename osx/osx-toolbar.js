/**************************** toolBar css and event enhance ****************************/
$(function(){
    $('#toolBar').delegate('.tool li:gt(0), .task span', 'mouseover', function(e){
        $(this).addClass('liHover');
    });

    $('#toolBar').delegate('.tool li:gt(0), .task span', 'mouseout', function(e){
        $(this).removeClass('liHover');
    });

    $('#toolBar .tool').find('li').mouseover(function(){
        $(this).children('ul').show();
    }).mouseout(function(){
        $(this).children('ul').hide();
    });

    $('#toolBar').find('.appleSys').hover(function(){
            $(this).addClass('appleSysHover');
            $(this).removeClass('appleSys');
        },function(){
            $(this).addClass('appleSys');
            $(this).removeClass('appleSysHover');
        }
    );
})