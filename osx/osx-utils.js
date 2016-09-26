$(function () {
    jQuery.osxUtils = {
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
        //locate the $element
        //tl,tc,tr,ml,mc,mr,bl,bc,br
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

            //tl,tc,tr,cl,cc,cr,bl,bc,br
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
                default : {
                    top = vBottom; left = hRight;
                    break;
                }
            }

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
        }
    }
});