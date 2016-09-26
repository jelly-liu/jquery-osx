function appendCellsToGridDiv() {
    var startNum = 10000;
    var $cellContentDiv = $('#cellContentDiv');
    for (var i = 0; i < 200; i++) {
        var j = i % 10;
        var $cell = $('#cell_' + j);
        var $cellNew = $cell.clone(true, true);
        $cellNew.attr({
            id: 'cell_' + startNum + '_' + i
        }).css({
            display: 'none'
        });
        $cellNew.appendTo($cellContentDiv);
    }
}

//init desktop mac os x
var bodyHeightOld = null;
var bodyWidthOld = null;
function reInit(cellContentAry){
    var logger = jQuery.osxUtils.logger;

    //when resize element, jquery ui resizeable always trigger resize event of window
    //but the bodyHeight and bodyWidth do not change
    var bodyHeight = $('body').height();
    var bodyWidth = $('body').width();
    if(bodyHeightOld && bodyHeightOld == bodyHeight && bodyWidthOld && bodyWidthOld == bodyWidth){
        return;
    }
    bodyHeightOld = bodyHeight;
    bodyWidthOld = bodyWidth;

    //resize toolBar and gridDivOuter
    resizeDesktop();

    /***************** _make desktop grid *****************/
//    var desktopGridConfig = {
//        gridDivOuterSelector: '#gridDivOuter',//the gridDivOuter selector, we use $(gridDivOuterSelector) to select the gridDivOuter, to determine the gridScreen size, it is very important
//        gridCellSelector: '#cellContentDiv .gridCell',//the gridCell selector, we use $(gridCellSelector) to select the cellContent element
//        cellWH: 70,//the cellContent width and height, this is the really true cellContent that you can seed via browser
//        cellWrapWH: 80,//the wrapper of cellContent, it was just used to convenience the calculate of cell abs position
//        gridDivPaddingTop: 0,//the margin that first row to the top of gridDiv container
//        gridDivPaddingBottom: 0,//the margin that last row to the top of gridDiv container
//        gridDivPaddingLeft: 0,//the margin that first column to the left of gridDiv container
//        gridDivPaddingRight: 0,//the margin that first column to the left of gridDiv container
//        cellRandomBackgroundColor: true,//give an random background color to all cellContent
//        screenRandomBackgroundColor: false,//give an random background color to all screen
//        exchangeCellContent: true, //exchange two cellContent if the position already occupied
//        easingManner: 'swing',//if you use jquery-easing plugin, then your can pass another easing manner name, such as easeOutBounce(i love this manner)
//        dragStartEvent: function () {//this event will fired when you start drag
//        },
//        dragStopEvent: function () {//this event will fired when you stop drag
//        }
//    };

    var desktopGridConfig = {
        gridDivOuterSelector: '#gridDivOuter',//the gridDivOuter selector, we use $(gridDivOuterSelector) to select the gridDivOuter, to determine the gridScreen size, it is very important
        gridCellSelector: '.gridCell',//the gridCell selector, we use $(gridCellSelector) to select the cellContent element
        gridScreenSelector: 'div.gridScreen',
        cellWH: 70,//the cellContent width and height, this is the really true cellContent that you can seed via browser
        cellWrapWH: 80,//the wrapper of cellContent, it was just used to convenience the calculate of cell abs position
        gridDivPaddingTop: 0,//the margin that first row to the top of gridDiv container
        gridDivPaddingBottom: 0,//the margin that last row to the top of gridDiv container
        gridDivPaddingLeft: 0,//the margin that first column to the left of gridDiv container
        gridDivPaddingRight: 0,//the margin that first column to the left of gridDiv container
        cellRandomBackgroundColor: true,//give an random background color to all cellContent
        screenRandomBackgroundColor: false,//give an random background color to all screen
        exchangeCellContent: true, //exchange two cellContent if the position already occupied
        easingManner: 'swing',//if you use jquery-easing plugin, then your can pass another easing manner name, such as easeOutBounce(i love this manner)
        dragStartEvent: function () {//this event will fired when you start drag
        },
        dragStopEvent: function () {//this event will fired when you stop drag
        }
    };

    var cellContentAry = $.DesktopGrid.remake(desktopGridConfig);
//    logger.info('cellContentArySize=' + cellContentAry.length);
    /***************** _make desktop grid *****************/

    //bind doubleClick event to each cellContent
    for (var i = 0; i < cellContentAry.length; i++) {
//        logger.info('cellContents of screen' + i + '=' + cellContentAry[i].length);
        for (var j = 0; j < cellContentAry[i].length; j++) {
            $(cellContentAry[i][j]).dblclick(function(){
                openWindowWhenDbclick($(this), $(this).text(), $(this).text());
            });
        }
    }

    /**************************** add grid screen thumbnail to toolBar ****************************/
    var $screenThumbnailOuter = $('#toolBar .screenThumbnailTd');
    $screenThumbnailOuter.find('.screenThumbnail').remove();
    var $ul = $.DesktopGrid.createGridScreenThumbnail();
    $ul.css({
        float:'right'
    });
    $screenThumbnailOuter.append($ul);
}

function openWindowWhenDbclick($target, content, taskText){
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
            $('#toolBar .task span').each(function(){
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
                $.fn.osxWindow.toggle($win);
            }).appendTo($('#toolBar .task'));

            return true;
        },
        afterMinimize: function ($win) {

        },
        beforeClose: function ($win) {
            logger.info('window closed, winId=' + $win.attr('id'));
            var cellId = $win.attr('cell_id');
            $('#' + cellId).removeAttr('win_id').fadeTo('fast', 1);

            //delete taskLi from taskUl
            $('#toolBar .task span').each(function(){
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
    }).fadeTo('fast', 0.6);

    var $win = $('<div/>').text($target.attr('id')).osxWindow('init', winConfig);

    $win.attr({
        cell_id: $target.attr('id')
    });
}

function resizeDesktop() {
    var bodyHeight = $(document.body).height();
//    jQuery.osxUtils.logger.info('bodyHeight=' + bodyHeight);

    var toolBarDivHeight = 21;

    $('#toolBar').css({
        height: toolBarDivHeight,
        'line-height': toolBarDivHeight + 'px'
    });

    $('#gridDivOuter').css({
        height: bodyHeight - toolBarDivHeight
//        top: 26,
//        left: 0
    });
}

$(function () {
    var logger = jQuery.osxUtils.logger;

    appendCellsToGridDiv();

    reInit();

    /**************************** when window resize, remake the desktop grid ****************************/
    //because resize will be fired more than one times
    //so we process this event like this way
    var windowResize = false;
    $(window).resize(function () {
        windowResize = true;
    });
    var windowResizeInterval = setInterval(function () {
        if (!windowResize) {
            return;
        }

        logger.info('window resize...');
        reInit();

        windowResize = false;
    }, 1500);

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

                $(this).fadeTo('fast', 0.6);

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
            width: 500,
            height: 150,
            windowBackgroundOpacity: 1,
            modal: false,
            showManner: 'fadeIn',
            maximizeAfterInit: true,
            confirmBeforeClose: true
        });
    });

    /**************************** osx window css and event enhance ****************************/
//    $('<div>helloWindow...</div>').osxWindow('init', {
//        title: 'Osx-Window-Hello',
//        width: 500,
//        height: 300,
//        windowBackgroundOpacity: 0.8,
//        modal: false,
//        showManner: 'fadeIn'
//    });

//    $('<div>This is an alert</div>').osxMessage('alert', {
//        title: 'Osx-Alert',
//        windowBackgroundOpacity: 0.8
//    });
//
//    $('<div>This is an confirm</div>').osxMessage('confirm', {
//        title: 'Osx-Confirm',
//        windowBackgroundOpacity: 0.8,
//        onOk: function(){
//            alert('onOk...');
//        },
//        onCancel: function(){
//            alert('onCancel...');
//        }
//    });
//
//    $('<div>This is an prompt</div>').osxMessage('prompt', {
//        title: 'Osx-Prompt',
//        windowBackgroundOpacity: 0.8,
//        onOk: function(text){
//            alert('onOk, ' + text);
//        },
//        onCancel: function(text){
//            alert('onCancel, ' + text);
//        }
//    });
//
//    $('<div>This is an note</div>').osxMessage('note', {
//        title: 'Osx-Note',
//        windowBackgroundOpacity: 0.8,
//        timeout: 3,
//        width: 150,
//        height: 80,
//        location: 'br',
//        showManner: 'slideDown',
//        hideManner: 'slideUp'
//    });
});
