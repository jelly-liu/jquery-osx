$(function () {
    var logger = jQuery.osxUtils.logger;

    /***************** _make desktop grid start *****************/
    var desktopGridConfig = {
        cellWH: 70,//the cellContent width and height, this is the really true cellContent that you can seed via browser
        cellWrapWH: 80,//the wrapper of cellContent, it was just used to convenience the calculate of cell abs position
        gridDivPaddingTop: 0,//the margin that first row to the top of gridDiv container
        gridDivPaddingBottom: 0,//the margin that last row to the top of gridDiv container
        gridDivPaddingLeft: 0,//the margin that first column to the left of gridDiv container
        gridDivPaddingRight: 0,//the margin that first column to the left of gridDiv container
        cellRandomBackgroundColor: false,//give an random background color to all cellContent
        screenRandomBackgroundColor: 'url(./osx/images/desk-bg.jpg)',//give an random background color to all screen, 'url(./osx/images/desk-bg.jpg)'
        exchangeCellContent: true, //exchange two cellContent if the position already occupied
        easingManner: 'swing'//if you use jquery-easing plugin, then your can pass another easing manner name, such as easeOutBounce(i love this manner)
        // dragStartEvent: function () {//this event will fired when you start drag
        // },
        // dragStopEvent: function () {//this event will fired when you stop drag
        // }
    };
    var cellContentAry = $.DesktopGrid.make(desktopGridConfig);
    /***************** _make desktop grid end *****************/

    /***************** bind apple logo event *****************/
    bindAppleLogoEvent();

    /***************** open osx-windows when click cell *****************/
    for (var i = 0; i < cellContentAry.length; i++) {
        for (var j = 0; j < cellContentAry[i].length; j++) {
            $(cellContentAry[i][j]).dblclick(function(){
                openWindowWhenClick($(this), $(this).text(), $(this).text());
            });
        }
    }
    /***************** open osx-windows when click dock icon *****************/
    $('.osx-dock td.mid').each(function(){
        var $td = $(this);
        $(this).find('a').not('#Demo').click(function(){
            openWindowWhenClick($(this), $(this).attr('title_prop'), $(this).attr('title_prop'));
        });
    });
    /***************** show api demo *****************/
    $('#Demo').click(function () {
        $('#api-demo-iframe').osxWindow('init', {
            title: 'Osx-Window-Hello',
            width: 700,
            height: 500,
            windowBackgroundOpacity: 1,
            modal: false,
            showManner: 'fadeIn',
            maximizeAfterInit: false,
            confirmBeforeClose: true
        });
    });
});

function bindAppleLogoEvent() {
    $('.apple-logo').click(function () {

    })
}

//******************** open window when click desktop grid cell, or dock icon ********************
function openWindowWhenClick($targer, winTitle, taskText){
    var logger = jQuery.osxUtils.logger;

    //reopen Maximized window
    var $winOpened = $('#' + $targer.attr('win_id'));
    if ($winOpened.size() == 1) {
        logger.info('reopen Maximized window, winId=' + $targer.attr('win_id'));

        var display = $winOpened.css('display');
        $winOpened.osxWindow('open');
        return;
    }

    logger.info('create new window...');
    var osxWindowId = 'osx-window_' + new Date().getTime();
    var winConfig = {
        id: osxWindowId,
        title: 'Window-' + winTitle,
        titleIcon: $targer.find('img').clone().css({width: '14px', height: '14px', position: 'relative', top: '2px'}),
        width: $(document.body).width() * 0.5,
        height: $(document.body).height() * 0.4,
        afterOpen: function($win){
            //check taskLi exist in taskUL or not
            var isCreated = false;
            $(jQuery.DesktopGrid.dataObj.barTopId).find('.task span').each(function(){
                if($(this).attr('win_id') == $win.attr('id')){
                    isCreated = true;
                    return;
                }
            });
            if(isCreated){
                logger.info('task li already created, so return......');
                return;
            }

            addToTaskBar($targer.find('img').clone(), $win);

            return true;
        },
        afterMinimize: function ($win) {

        },
        beforeClose: function ($win) {
            logger.info('window closed, winId=' + $win.attr('id'));
            //delete taskLi from taskUl
            $(jQuery.DesktopGrid.dataObj.barTopId).find('.task span').each(function(){
                if($(this).attr('win_id') == $win.attr('id')){
                    $(this).remove();
                }
            })
            return true;
        }
    };

    //create new window
    $targer.attr({
        win_id: osxWindowId
    });

    var $win = $('<div/>').text($targer.attr('id')).osxWindow('init', winConfig);

    $win.attr({
        cell_id: $targer.attr('id')
    });
}

//******************** create task bar image ********************
function addToTaskBar($image, $win){
    $image.css({
        width: 18,
        height: 18
    })

    var $taskLi = $('<span/>').html($image).attr({
        win_id: $win.attr('id')
    }).click(function(){
        var $winTarget = $('#' + $(this).attr('win_id'));

        var currentScreen = jQuery.DesktopGrid.dataObj.currentScreen;
        var screen_id_of_win = parseInt($winTarget.attr("screen_id"));

        if(screen_id_of_win == currentScreen){
            $.fn.osxWindow.toggle($winTarget);
        }else{
            jQuery.DesktopGrid.goToScreen(screen_id_of_win);
            $.fn.osxWindow.open($winTarget);
        }
    }).appendTo($(jQuery.DesktopGrid.dataObj.barTopId).find('.task'));
}

/**************************** osx window api demo ****************************/
/*   $('<div>helloWindow...</div>').osxWindow('init', {
 title: 'Osx-Window-Hello',
 width: 500,
 height: 300,
 windowBackgroundOpacity: 0.8,
 modal: false,
 showManner: 'fadeIn'
 });

 $('<div>This is an alert</div>').osxMessage('alert', {
 title: 'Osx-Alert',
 windowBackgroundOpacity: 0.8
 });

 $('<div>This is an confirm</div>').osxMessage('confirm', {
 title: 'Osx-Confirm',
 windowBackgroundOpacity: 0.8,
 onOk: function(){
 alert('onOk...');
 },
 onCancel: function(){
 alert('onCancel...');
 }
 });

 $('<div>This is an prompt</div>').osxMessage('prompt', {
 title: 'Osx-Prompt',
 windowBackgroundOpacity: 0.8,
 onOk: function(text){
 alert('onOk, ' + text);
 },
 onCancel: function(text){
 alert('onCancel, ' + text);
 }
 });

 $('<div>This is an note</div>').osxMessage('note', {
 title: 'Osx-Note',
 windowBackgroundOpacity: 0.8,
 timeout: 3,
 width: 150,
 height: 80,
 location: 'br',
 showManner: 'slideDown',
 hideManner: 'slideUp'
 });*/