/**************************** when window resize, remake the desktop grid ****************************/
$(function () {
    var logger = jQuery.osxUtils.logger;
    /***************** _make desktop grid *****************/
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

    /***************** _make desktop grid *****************/
    var cellContentAry = $.DesktopGrid.make(desktopGridConfig);

    /***************** bind your own doubleClick event to each cellContent *****************/
    for (var i = 0; i < cellContentAry.length; i++) {
//        logger.info('cellContents of screen' + i + '=' + cellContentAry[i].length);
        for (var j = 0; j < cellContentAry[i].length; j++) {
            $(cellContentAry[i][j]).dblclick(function(){
                openWindowWhenDBclick($(this), $(this).text(), $(this).text());
            });
        }
    }

    /**************************** click osx dock element to open an osx-window ****************************/
    $('.osx-dock td.mid').each(function(){
        var $td = $(this);
        $(this).find('img').not('#Demo').click(function(){
                var winId = $(this).attr('_win_id') + '';
                var $win = $('#' + winId);

                //open or minimize window
                if($win.size() == 1){
                    $.fn.osxWindow.toggle($win);
                    return;
                }

                $(this).fadeTo('fast', 0.8);

                //create new window
                var winIdNew = 'osxWindow_' + new Date().getTime();
                $(this).attr({
                    _win_id: winIdNew
                });
                var $win = $('<div/>').text($(this).attr('id')).osxWindow('init', {
                    id: winIdNew,
                    title: 'Osx-Window ' + $(this).attr('id'),
                    width: 500,
                    height: 300,
                    modal: false,
                    beforeClose: function($win){
                        $('#' + $win.attr('_dock_element_id')).fadeTo('fast', 1);
                    }
                });
                $win.attr({
                    _dock_element_id: $(this).attr('id')
                });
        });
    });

    /**************************** api-demo event ****************************/
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

    function openWindowWhenDBclick($target, content, taskText){
        var logger = jQuery.osxUtils.logger;

        //reopen Maximized window
        var $winOpened = $('#' + $target.attr('win_id'));
        if ($winOpened.size() == 1) {
            logger.info('reopen Maximized window, winId=' + $target.attr('win_id'));

            var display = $winOpened.css('display');
            $winOpened.osxWindow('open');
            return;
        }

        logger.info('create new window...');
        var osxWindowId = 'osx-window_' + new Date().getTime();
        var winConfig = {
            id: osxWindowId,
            title: 'Window-' + content,
            width: $(document.body).width() * 0.5,
            height: $(document.body).height() * 0.4,
            afterOpen: function($win){
                //check taskLi exist in taskUL or not
                var isCreated = false;
                $(jQuery.DesktopGrid.dataObj.barTopId).find('.task span').each(function(){
                    if($(this).attr('win_id') == $win.attr('id')){
                        isCreated = true;
                        return false;
                    }
                });
                if(isCreated){
                    logger.info('task li already created, so return......');
                    return;
                }

                //add taskLi to taskUL
                var $taskLi = $('<span/>').text(taskText).attr({
                    win_id: osxWindowId,
                    cell_id: $target.attr('id')
                }).click(function(){
                    var $win = $('#' + $(this).attr('win_id'));

                    var currentScreen = jQuery.DesktopGrid.dataObj.currentScreen;
                    var screen_id_of_win = parseInt($win.attr("screen_id"));

                    if(screen_id_of_win == currentScreen){
                        $.fn.osxWindow.toggle($win);
                    }else{
                        jQuery.DesktopGrid.goToScreen(screen_id_of_win);
                        $.fn.osxWindow.open($win);
                    }
                }).appendTo($(jQuery.DesktopGrid.dataObj.barTopId).find('.task'));

                return true;
            },
            afterMinimize: function ($win) {

            },
            beforeClose: function ($win) {
                logger.info('window closed, winId=' + $win.attr('id'));
                var cellId = $win.attr('cell_id');
                $('#' + cellId).removeAttr('win_id').fadeTo('fast', 1);

                //delete taskLi from taskUl
                $(jQuery.DesktopGrid.dataObj.barTopId).find('.task span').each(function(){
                    if($(this).attr('win_id') == $win.attr('id')){
                        $(this).remove();
                    }
                });
                return true;
            }
        };

        //create new window
        $target.attr({
            win_id: osxWindowId
        }).fadeTo('fast', 0.8);

        var $win = $('<div/>').text($target.attr('id')).osxWindow('init', winConfig);

        $win.attr({
            cell_id: $target.attr('id')
        });
    }

    /**************************** osx window css and event enhance ****************************/
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
});
