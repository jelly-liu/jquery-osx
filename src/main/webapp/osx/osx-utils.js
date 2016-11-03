$(function () {
    jQuery.osxUtils = {
        typeOf: {
            string: 'string',
            boolean: 'boolean'
        },
        /******* this is an logger *******/
        logger: {
            consoleEnable: (function () {
                if (typeof console != 'undefined') {
                    return true;
                } else {
                    return false;
                }
            }()),
            info: function (message) {
                if (this.consoleEnable) {
                    console.info(message)
                }
            },
            warn: function (message) {
                if (this.consoleEnable) {
                    console.warn(message)
                }
            },
            error: function (message) {
                if (this.consoleEnable) {
                    console.error(message)
                }
            },
            log: function (message) {
                if (this.consoleEnable) {
                    console.log(message)
                }
            }
        },
        //[0,max), not include max
        nextInt: function (max) {
            if(max <= 0){
                return 0;
            }
            var rdm = Math.floor(Math.random() * (max + 1));
            return rdm;
        },
        //locate the $element
        //tl,tc,tr,ml,mc,mr,bl,bc,br,sd
        //sd, means slide
        locateElement: function ($element, $outer, location) {
            jQuery.osxUtils.logger.info('locate element...');
            var outerWidth = $outer.width();
            var outerHeight = $outer.height();
            var elementWidth = $element.width();
            var elementHeight = $element.height();

            var vCenter = (outerHeight - elementHeight) / 2;
            var hCenter = (outerWidth - elementWidth) / 2;
            var hRight = outerWidth - elementWidth - 4;
            var vBottom = outerHeight - elementHeight - 4;

            //default is br
            var locationS = location;
            if(arguments.length == 2){
                locationS = 'cc';
            }

            //tl,tc,tr,cl,cc,cr,bl,bc,br,rdm,sd
            //rdm means random position
            //sd means slide
            var top = 0;
            var left= 0;
            switch (locationS){
                case 'tl' : {
                    top = 4; left = 0;
                    break;
                }
                case 'tc' : {
                    top = 4; left = hCenter;
                    break;
                }
                case 'tr' : {
                    top = 4; left = hRight;
                    break;
                }
                case 'cl' : {
                    top = vCenter; left = 0;
                    break;
                }
                case 'cc' : {
                    top = vCenter; left = hCenter;
                    break;
                }
                case 'cr' : {
                    top = vCenter; left = hRight;
                    break;
                }
                case 'bl' : {
                    top = vBottom; left = 0;
                    break;
                }
                case 'bc' : {
                    top = vBottom; left = hCenter;
                    break;
                }
                case 'br' : {
                    top = vBottom; left = hRight;
                    break;
                }
                case 'rdm' : {
                    rdm();
                    break;
                }
                case 'sd' : {
                    sd();
                    break
                }
                default : {
                    top = vCenter; left = hCenter;
                    break;
                }
            }

            function rdm() {
                //TODO...
                top = jQuery.osxUtils.nextInt(outerHeight - 60);
                left = jQuery.osxUtils.nextInt(outerWidth - 60);
            }

            function sd(){
                var wins = $.fn.osxWindow.dataObj.wins;
                if(wins.length == 0){
                    top = vCenter; left = hCenter;
                    return;
                }

                var i = 0;
                var zIndex = -1;
                var $winWithMax_Z_Index = null;
                for(; i < wins.length; i++){
                    var $winTmp = wins[i];
                    var screenId = parseInt($winTmp.attr('screen_id'));

                    if(screenId != jQuery.DesktopGrid.dataObj.currentScreen){
                        continue;
                    }

                    var zIndexTmp = $winTmp.css('z-index');
                    if(zIndexTmp > zIndex){
                        zIndex = zIndexTmp;
                        $winWithMax_Z_Index = $winTmp;
                    }
                }

                if($winWithMax_Z_Index == null){
                    jQuery.osxUtils.logger.info('can not find any win of grid screen' + jQuery.DesktopGrid.dataObj.currentScreen + ', will locate win to center');
                    //goto case cc
                    top = vCenter; left = hCenter;
                }else{
                    var position = $.fn.osxWindow.position($winWithMax_Z_Index);
                    top = position.top + 30;
                    left = position.left + 30;
                }
            }

            jQuery.osxUtils.logger.info('locate element, top=' + top + ', left=' + left);
            $element.css({
                top: top,
                left: left
            });
        },
        /******* return random color of rgb *******/
        getRandomColor: function (start, end) {
            var defaultStart = 160;
            var defaultEnd = 95;

            if (arguments.length == 1) {
                defaultStart = start;
                defaultEnd = 255 - defaultStart;
            }

            if (arguments.length == 2) {
                defaultStart = start;
                defaultEnd = end;
            }

            var r = defaultStart + jQuery.osxUtils.getRandomNumber(defaultEnd);
            var g = defaultStart + jQuery.osxUtils.getRandomNumber(defaultEnd);
            var b = defaultStart + jQuery.osxUtils.getRandomNumber(defaultEnd);
            return 'rgb(' + r + ', ' + g + ', ' + b + ')';
        },
        /******* [0, maxNumber] *******/
        getRandomNumber: function(maxNumber){
            return Math.floor(Math.random() * maxNumber);
        },
        /******* [0, maxNumber] *******/
        isTrue: function(str){
            if(str === 'true' || str == true){
                return true;
            }
            return false;
        },
        isTypeOfString: function (str) {
            return typeof str == jQuery.osxUtils.string;
        },
        isTypeOfBoolean: function (str) {
            return typeof str == jQuery.osxUtils.boolean;
        },
        copyPropertyName: function () {
            
        }
    }
});