(function($) {
    var winHtml = "<div id=\"tableWindow\" class=\"osx-window\">\n" +
        "    <div class=\"osx-window-bg\"></div>\n" +
        "    <table class=\"osx-window-table\">\n" +
        "        <tr class=\"osx-window-titleTr\">\n" +
        "            <td>\n" +
        "                <ul class=\"osx-window-control\">\n" +
        "                    <li class=\"close\" title=\"close\"></li>\n" +
        "                    <li class=\"minimize\" title=\"minimize\"></li>\n" +
        "                    <li class=\"maximize\" title=\"maximize\"></li>\n" +
        "                </ul>\n" +
        "                <span class=\"osx-window-title\">oxs-window</span>\n" +
        "            </td>\n" +
        "        </tr>\n" +
        "        <tr class=\"osx-window-containerTr\" style=\"height: 100%;\">\n" +
        "            <td class=\"osx-window-containerTd\"></td>\n" +
        "        </tr>\n" +
        "    </table>\n" +
        "</div>";

    $.fn.osxWindow = function(method, opt) {
        jQuery.osxUtils.logger.info('-------------------------- osxWindow --------------------------');

        opt = $.extend({}, $.fn.osxWindow.constantConfig, opt);
        opt.id = (opt.id == null ? ('osx-window_' + new Date().getTime() + '_' + new String(Math.random()).substr(2)) : opt.id);
        $.fn.osxWindow.dataObj.opt[opt.id] = opt;

        var $win = $.fn.osxWindow[method]($(this), opt);

        return $win;
    };

    //store some user config
    $.fn.osxWindow.dataObj = {
        opt: {},
        zIndex: 4000,
        wins:[],//all created and active osx windows
    }

    $.fn.osxWindow.constantConfig = {
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
        //control the window maximize immediately or not after initialized, under control of openAfterInit is true
        maximizeAfterInit: false,
        confirmBeforeClose: false,
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
    }

    //init method, only call once when window was created
    $.fn.osxWindow.init = function ($content, opt){
        jQuery.osxUtils.logger.info('execute method of osxWindow: init');

        //init window html
        var $win = initWindowHtml($content, opt);

        //center the win on browser
        jQuery.osxUtils.locateElement($win, $('body'), 'sd');

        //bind maximize, minimize, close event, ext.
        bindWindowEvent($win, opt);

        //open window
        if(opt.openAfterInit){
            if(opt.maximizeAfterInit){
                $.fn.osxWindow.maximize($win, $.fn.osxWindow.dataObj.opt[$win.attr('id')]);
            }
            $.fn.osxWindow.open($win, $.fn.osxWindow.dataObj.opt[$win.attr('id')]);
        }

        //add $win to $.fn.osxWindow.dataObj.wins
        addWinToWins($win);

        return $win;
    }

    function addWinToWins($win){
        var winId = $win.attr('id');
        var wins = $.fn.osxWindow.dataObj.wins;
        wins.push($win)
        jQuery.osxUtils.logger.info('add win to wins, winId=' + winId + ', current win size=' + wins.length);
    }

    function removeWinFromWins($win){
        var winId = $win.attr('id');
        var wins = $.fn.osxWindow.dataObj.wins;
        var wins2 = [];
        var i = 0;
        var removeWinId = null;
        for(; i < wins.length; i++){
            var $winTmp = wins[i];
            var winIdTmp = $winTmp.attr('id');
            if(winId == winIdTmp){
                removeWinId = winIdTmp;
            }else{
                wins2.push($winTmp);
            }
        }
        $.fn.osxWindow.dataObj.wins = wins2;
        jQuery.osxUtils.logger.info('remove win from wins, winId=' + winId + ', current win size=' + wins2.length);
    }

    function initWindowHtml($content, opt){
        jQuery.osxUtils.logger.info('init window html, winId=' + opt.id)
        var $win = $(winHtml);
//        var $win = $('#tableWindow');
//        jQuery.osxUtils.logger.info(winHtml);

        //set core css properties
        $win.attr({
            id: opt.id,
            screen_id: jQuery.DesktopGrid.dataObj.currentScreen
        }).css({
            position: 'absolute',
            width: opt.width,
            height: opt.height,
            'z-index': $.fn.osxWindow.dataObj.zIndex++
        });

        //set window title
        $win.find('.osx-window-title').html(opt.title);

        //set container opacity
        $win.find('.osx-window-bg').css({
            background: opt.windowBackgroundColor == null ? jQuery.osxUtils.getRandomColor(100) : opt.windowBackgroundColor,
            opacity: opt.windowBackgroundOpacity
        });

        //set window content
        $win.find('.osx-window-containerTd').append($content);
        $content.show();

        //append window-masker to body
        if(opt.modal){
            var $masker = $('<div class="osx-window-masker"/>');
            $masker.attr({
                id: 'osx-window-masker_' + $win.attr('id')
            }).css('opacity', 0.6);
            $masker.appendTo($(window.document.body));
        }

        //append window to body
        $win.appendTo($(window.document.body));

        //hide control window elements
        if(opt.hideControlWindowElements != null && opt.hideControlWindowElements.length != 0){
            for(var i = 0; i < opt.hideControlWindowElements.length; i++){
                $win.find('.' + opt.hideControlWindowElements[i]).remove();
            }
        }

        return $win;
    }

    function bindWindowEvent($win, opt){
        jQuery.osxUtils.logger.info('bind window event');

        $win.find('.osx-window-control > li').hover(function(){
            var className = $(this).attr('class');
            $(this).removeClass(className);
            $(this).addClass(className + 'Hover');
        }, function(){
            var className = $(this).attr('class');
            $(this).removeClass(className);
            $(this).addClass(className.substr(0, className.indexOf('Hover')));
        });

        //when mouseover osx-window, increase z-index to make window on top of others
        $win.mousedown(function(){
            $(this).css({
                'z-index': $.fn.osxWindow.dataObj.zIndex++
            });
        });

        //osx-window draggable
        if(opt.draggable){
            var winConfig = {
                cursor: 'move',
                handle: '.osx-window-titleTr',
                containment: $(document.body)
            };
            $win.draggable(winConfig);
        }

        //osx-window resizeable
        if(opt.resizable){
            $win.resizable({
                containment: $(document.body)
            });
        }

        //window close or destroy, will delete this element from document
        $win.find('.close').click(function(){
            $.fn.osxWindow.close($win, $.fn.osxWindow.dataObj.opt[$win.attr('id')]);
        });

        //window min
        $win.find('.minimize').click(function(){
            $.fn.osxWindow.minimize($win, $.fn.osxWindow.dataObj.opt[$win.attr('id')]);
        });

        //window max
        $win.find('.osx-window-titleTr').dblclick(function(){
            $win.find('.maximize').click();
        });
        $win.find('.maximize').click(function(){
            $.fn.osxWindow.maximize($win, $.fn.osxWindow.dataObj.opt[$win.attr('id')]);
        });
    }

    $.fn.osxWindow.id = function ($win){
        return $win.attr('id');
    }

    $.fn.osxWindow.position = function ($win){
        var position = {}
        position.top = parseInt($win.css('top'));
        position.left = parseInt($win.css('left'));
        jQuery.osxUtils.logger.info('execute method of osxWindow: position={top:' + position.top + ', left:' + position.left + '}');
        return position;
    }

    $.fn.osxWindow.open = function ($content, opt){
        jQuery.osxUtils.logger.info('execute method of osxWindow: open');
        $content = $content || $(this);
        var $win = $content.closest('.osx-window');
        opt = opt || $.fn.osxWindow.dataObj.opt[$win.attr('id')];

        var flag = opt.beforeOpen($win);
        if(flag + '' != 'undefined' && !flag){
            return;
        }

        var $masker = $('#osx-window-masker_' + $win.attr('id'));
        if($masker.size() > 0){
            $masker.css({
                'z-index': $.fn.osxWindow.dataObj.zIndex++
            }).fadeIn('fast');
        }

        $win.css({
            'z-index': $.fn.osxWindow.dataObj.zIndex++
        })[opt.showManner]('fast');
        opt.afterOpen($win);
    }

    $.fn.osxWindow.isOpen = function ($win){
        jQuery.osxUtils.logger.info('execute method of osxWindow: isOpen');
        var isOpen;
        var display = $win.css('display');
        jQuery.osxUtils.logger.info('display====' + display);
        if(display && display == 'block'){
            isOpen = true;
        }else{
            isOpen = false;
        }
        jQuery.osxUtils.logger.info('execute method of osxWindow: open=' + isOpen);
        return isOpen;
    }

    $.fn.osxWindow.toggle = function($content, opt){
        jQuery.osxUtils.logger.info('execute method of osxWindow: open');
        $content = $content || $(this);
        var $win = $content.closest('.osx-window');

        var isOpen = $.fn.osxWindow.isOpen($content, opt);
        if(isOpen){
            $win.osxWindow('minimize');
        }else{
            $win.osxWindow('open');
        }
    }

    $.fn.osxWindow.maximize = function($content, opt){
        jQuery.osxUtils.logger.info('execute method of osxWindow: maximize');
        $content = $content || $(this);
        var $win = $content.closest('.osx-window');
        opt = opt || $.fn.osxWindow.dataObj.opt[$win.attr('id')];

        var flag = opt.beforeMaximize($win);
        if(flag + '' != 'undefined' && !flag){
            return;
        }

        var _max = $win.attr('_max');
        if(_max == 'y'){
            //resize to the size before maximize
            $win.attr({
                _max: 'n'
            }).css({
                top: parseInt($win.attr('_top_src')),
                left: parseInt($win.attr('_left_src')),
                width: $win.attr('_width_src'),
                height: $win.attr('_height_src')
            });
        }else{
            //store some data on this element
            $win.attr({
                _top_src: $win.position().top,
                _left_src: $win.position().left,
                _width_src: $win.width(),
                _height_src: $win.height(),
                _max: 'y'
            }).css({
                top: 0,
                left: 0,
                width: $(window.document.body).width(),
                height: $(window.document.body).height()
            });
        }

        opt.afterMaximize($win);
    }

    $.fn.osxWindow.minimize = function($content, opt){
        jQuery.osxUtils.logger.info('execute method of osxWindow: minimize');
        $content = $content || $(this);
        var $win = $content.closest('.osx-window');
        opt = opt || $.fn.osxWindow.dataObj.opt[$win.attr('id')];

        var flag = opt.beforeMinimize($win);
        if(flag + '' != 'undefined' && !flag){
            return;
        }

        $win.attr('_min', 'y');

        $win[opt.hideManner]('fast', function(){
            var $masker = $('#osx-window-masker_' + $win.attr('id'));
            if($masker.size() > 0){
                $masker.hide('fast');
            }

            opt.afterMinimize($win);
        });
    }

    $.fn.osxWindow.close = function($content, opt){
        jQuery.osxUtils.logger.info('execute method of osxWindow: close');
        $content = $content || $(this);
        var $win = $content.closest('.osx-window');
        opt = opt || $.fn.osxWindow.dataObj.opt[$win.attr('id')];

        //customer design can not close
        var flag = opt.beforeClose($win);
        if(flag + '' != 'undefined' && !flag){
            return;
        }

        if(opt.confirmBeforeClose){
            $('<div>Are you really want to close this window?</div>').osxMessage('confirm', {
                title: 'Window-Close-Confirm',
                onOk: function () {
                    closeWin();
                }
            });
        }else{
            closeWin();
        }

        function closeWin(){
            $win[opt.hideManner]('fast', function(){
                var $masker = $('#osx-window-masker_' + $win.attr('id'));
                if($masker.size() > 0){
                    $masker.remove();
                }

                removeWinFromWins($win);
                $.fn.osxWindow.dataObj.opt[$win.attr('id')] = null;
                $win.remove();
                opt.afterClose();
            });
        }
    }
})(jQuery);