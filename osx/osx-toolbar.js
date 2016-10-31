/**************************** toolBar css and event enhance ****************************/
$(function(){
    $('body').click(function () {
        clearActive();
    })

    //init top tool bar event
    $('#bar_top a.menu_trigger').click(function(e) {
        clearActive();
        if ($(this).next('ul.menu').is(':hidden')) {
            $(this).addClass('active').next('ul.menu').show();
        }
        e.stopPropagation();
    });

    //clear function
    function clearActive(){
        $('#bar_top a.active').removeClass('active');
        $('#bar_top ul.menu').hide();
    }
})