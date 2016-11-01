(function($) {
    var alertButtonDiv = '<div class="osx-button-outer"><a class="osx-button">Ok</a></div>';
    var confirmButtonDiv = '<div class="osx-button-outer"><a class="osx-button osx-button-ok">Ok</a><a class="osx-button osx-button-cancel">Cancel</a></div>';
    var promptButtonDiv = '<div class="osx-button-outer"><input type="text" class="promptInput" style="width: 280px;"/><br/><a class="osx-button osx-button-ok">Ok</a><a class="osx-button osx-button-cancel">Cancel</a></div>';

    $.fn.osxMessage = function(method, opt) {
        jQuery.osxUtils.logger.info('-------------------------- osxMessage --------------------------');

        opt = $.extend({}, $.fn.osxWindow.defaultConfig, $.fn.osxMessage.defaultConfig, opt, $.fn.osxMessage.constantConfig);

        $.fn.osxMessage[method]($(this), opt);
    };

    //init note, note-message can not be dragged
    $.fn.osxMessage.note = function ($content, opt){
        opt = $.extend({
            //seconds
            timeout: 3,
            //tl,tc,tr,cl,cc,cr,bl,bc,br
            location: 'br'
        }, opt, {
            modal: false,
            resizable: false,
            draggable: false
        });

        var $win = $content.osxWindow('init', opt);
        var $container = $win.find('.osx-window-containerTd');
        $container.css({
            'text-align': opt.textAlign,
            'vertical-align': opt.verticalAlign
        });

        //locate element
        jQuery.osxUtils.locateElement($win, $(document.body), opt.location);

        //shown message
        $win.osxWindow('open');

        setTimeout(function(){
            $win.slideDown('fast', function(){
                $win.osxWindow('close');
            });
        }, opt.timeout * 1000);
    }

    //init alert
    $.fn.osxMessage.alert = function ($content, opt){
        $.extend(opt, {
            modal: true,
            resizable: false,
            width:300
        });

        var $win = $content.osxWindow('init', opt);
        var $container = $win.find('.osx-window-containerTd');
        $container.css({
            'text-align': opt.textAlign,
            'vertical-align': opt.verticalAlign
        });

        var $alertButtonDiv = $(alertButtonDiv);
        $alertButtonDiv.find('.osx-button').click(function(){
            $win.osxWindow('close');
        });

        $container.append($alertButtonDiv);

        //shown message
        $win.osxWindow('open');
    }

    //init confirm
    $.fn.osxMessage.confirm = function ($content, opt){
        $.extend(opt, {
            modal: true,
            resizable: false,
            width:300
        });

        var $win = $content.osxWindow('init', opt);
        var $container = $win.find('.osx-window-containerTd');
        $container.css({
            'text-align': opt.textAlign,
            'vertical-align': opt.verticalAlign
        });

        var $alertButtonDiv = $(confirmButtonDiv);
        $alertButtonDiv.find('.osx-button-ok').click(function(){
            $win.osxWindow('close');
            if(opt.onOk)opt.onOk();

        });
        $alertButtonDiv.find('.osx-button-cancel').click(function(){
            $win.osxWindow('close');
            if(opt.onCancel)opt.onCancel();
        });

        $container.append($alertButtonDiv);

        //shown message
        $win.osxWindow('open');
    }

    //init confirm
    $.fn.osxMessage.prompt = function ($content, opt){
        $.extend(opt, {
            modal: true,
            resizable: false,
            width:300
        });

        var $win = $content.osxWindow('init', opt);
        var $container = $win.find('.osx-window-containerTd');
        $container.css({
            'text-align': opt.textAlign,
            'vertical-align': opt.verticalAlign
        });

        var $alertButtonDiv = $(promptButtonDiv);
        $alertButtonDiv.find('.osx-button-ok').click(function(){
            $win.osxWindow('close');
            if(opt.onOk)opt.onOk($alertButtonDiv.find('.promptInput').val());
        });
        $alertButtonDiv.find('.osx-button-cancel').click(function(){
            $win.osxWindow('close');
            if(opt.onCancel)opt.onCancel($alertButtonDiv.find('.promptInput').val());
        });

        $container.append($alertButtonDiv);

        //shown message
        $win.osxWindow('open');
    }

    //the config that can be respecified by user
    $.fn.osxMessage.defaultConfig = {
        width: 200,
        height: 100
    }

    //all kinds of message must have this config
    $.fn.osxMessage.constantConfig = {
        textAlign: 'center',
        verticalAlign: 'middle',
        openAfterInit: false,
        hideControlWindowElements: ['minimize','maximize']
    }
})(jQuery);