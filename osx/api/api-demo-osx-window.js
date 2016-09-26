/**
 * first, you should import css and js to your html page
 */

/**
 * simple api like follow
 * note, the close method will remove window from dom
 * note, the afterClose callback without parameter $win
 *
 * var $win = $content.osxWindow('init', {see follows to known about detail config of osx-window});
 * $win.osxWindow('open');
 * $win.osxWindow('toggle');
 * $win.osxWindow('maximize');
 * $win.osxWindow('minimize');
 * $win.osxWindow('close');
 */

/**
 * detail window config demo like follows
 */
$(function(){
    //open an new window
    var $win = $('<div>Hello Window</div>').osxWindow('init', {
        //the window id
        id: null,
        //the window title
        title: 'window',
        windowBackgroundColor: null,
        //specify an number between [0,1]
        windowBackgroundOpacity: 0.8,
        //modal or no modal
        modal: false,
        //there are three control element of window, close,minimize,maximize
        //you must give an array here like this: null, [minimize,maximize]
        //the control element that you specify here will be removed from dom
        hideControlWindowElements: null,
        //window can be resize or not
        resizable: true,
        //window can be dragged or not
        draggable: true,
        //window width, you can specify any thing that css grammar support: 60%, 600, auto,
        width: '60%',
        //window height
        height: 'auto',
        //the window show manner, if you imported jquery-easing, you can give any manner that jquery support
        showManner: 'slideDown',
        //the window hide manner
        hideManner: 'slideUp',
        //control the window open immediately or not after initialized
        openAfterInit: true,
        //follows are some call back when window status change
        //ie: if the beforeOpen callback return true or without return, window will open, else, window not open
        beforeOpen: function($win){jQuery.osxUtils.logger.info('osx-window, beforeOpen...');return true;},
        afterOpen: function($win){jQuery.osxUtils.logger.info('osx-window, afterOpen...');return true;},
        beforeMinimize: function($win){jQuery.osxUtils.logger.info('osx-window, beforeMinimize...');return true;},
        afterMinimize: function($win){jQuery.osxUtils.logger.info('osx-window, afterMinimize...');return true;},
        beforeMaximize: function($win){jQuery.osxUtils.logger.info('osx-window, beforeMaximize...');return true;},
        afterMaximize: function($win){jQuery.osxUtils.logger.info('osx-window, afterMaximize...');return true;},
        beforeClose: function($win){jQuery.osxUtils.logger.info('osx-window, beforeClose...');return true;},
        afterClose: function(){jQuery.osxUtils.logger.info('osx-window, afterClose...');return true;}
    });
})
