/**
 * jQuery DeskTop Grid Version-2.0.3
 * qq       195358385
 * email    collonn@126.com
 * blog     http://blog.csdn.net/collonn
 */

//desktop grid example, align vertical, just like icons on desktop in windows system//
/////////   //////////////////////
//0,4,8//   //(0,0),(0,1),(0,2)//
//1,5,8//   //(1,0),(1,1),(1,2)//
//2,6,10//  //(2,0),(2,1),(2,2)//
//3,7,11//  //(3,0),(3,1),(3,2)//
/////////   //////////////////////

$(function () {
    jQuery.DesktopGrid = {
        /******* some data of desktop grid and config some parameter of user's *******/
        dataObj: {},

        /******* prepare something to do make and return the cellContent array *******/
        remake: function (options) {
            //check making status, mainly resolve call the method _make() too many times when window resize
            //this is the second safeguard to make sure remake only do once when window resize
            if (jQuery.DesktopGrid.dataObj.making) {
                jQuery.osxUtils.logger.info('desktop grid is making, so return...');
                return null;
            }

            jQuery.osxUtils.logger.info('-------------------------- desktop grid --------------------------');

            //set making to true
            jQuery.DesktopGrid.dataObj.making = true;

            //delete the old grid screen
            for (var i = 0; i < $.DesktopGrid.dataObj.totalScreens; i++) {
                var screenId = $.DesktopGrid.dataObj.screenName + i;
                $('#' + screenId).remove();
                jQuery.osxUtils.logger.info('remake, delete screenId=' + screenId);
            }

            //reset some config of dataObj
            resetDataObj();

            //_make totally new grid screen
            var cellContentAry = make(options);

            //set making to false
            setTimeout(function () {
                jQuery.DesktopGrid.dataObj.making = false;
            }, 500);

            return cellContentAry;
        },

        /******* screen number start from 0, go to left screen of current screen *******/
        leftScreen: function () {
            if (jQuery.DesktopGrid.dataObj.currentScreen == 0) {
                jQuery.osxUtils.logger.info('current screen is first, do not need to switch screen');
                return;
            }

            var totalScreen = jQuery.DesktopGrid.dataObj.totalScreens;
            var currentScreen = this.dataObj.currentScreen;
            jQuery.DesktopGrid.dataObj.currentScreen--;
            for (var i = 0; i < totalScreen; i++) {
                var $screen = $('#' + jQuery.DesktopGrid.dataObj.screenName + i);
                $screen.animate({
                    left: $screen.position().left + jQuery.DesktopGrid.dataObj.gridWidth
                }, 'fast');
            }

            //highlight the current screenThumbnail
            highlightGridScreenThumbnail(jQuery.DesktopGrid.dataObj.currentScreen);

            jQuery.osxUtils.logger.info('totalScreen=' + this.dataObj.totalScreens + ', currentScreen=' + currentScreen + ', gotoScreen=' + this.dataObj.currentScreen);
        },

        /******* screen number start from 0, go to right screen of current screen *******/
        rightScreen: function () {
            if (jQuery.DesktopGrid.dataObj.currentScreen == jQuery.DesktopGrid.dataObj.totalScreens - 1) {
                jQuery.osxUtils.logger.info('current screen is last, do not need to switch screen');
                return;
            }

            var totalScreen = jQuery.DesktopGrid.dataObj.totalScreens;
            var currentScreen = this.dataObj.currentScreen;
            jQuery.DesktopGrid.dataObj.currentScreen++;
            for (var i = 0; i < totalScreen; i++) {
                var $screen = $('#' + jQuery.DesktopGrid.dataObj.screenName + i);
                $screen.animate({
                    left: $screen.position().left - jQuery.DesktopGrid.dataObj.gridWidth
                }, 'fast');
            }

            //highlight the current screenThumbnail
            highlightGridScreenThumbnail(jQuery.DesktopGrid.dataObj.currentScreen);

            jQuery.osxUtils.logger.info('totalScreen=' + this.dataObj.totalScreens + ', currentScreen=' + currentScreen + ', gotoScreen=' + this.dataObj.currentScreen);
        },

        /******* screen number start from 0, go to the screen that user specified *******/
        goToScreen: function (toScreen) {
            if (toScreen == jQuery.DesktopGrid.dataObj.currentScreen) {
                jQuery.osxUtils.logger.info('current screen is equal to screen you want to jump, so do not jump, currentScreen=' + jQuery.DesktopGrid.dataObj.currentScreen + ', gotoScreen=' + toScreen);
                return;
            }

            if (toScreen < 0 || toScreen >= jQuery.DesktopGrid.dataObj.totalScreens) {
                jQuery.osxUtils.logger.info('screen must between 0 and ' + (jQuery.DesktopGrid.dataObj.totalScreens - 1));
                return;
            }

            var totalScreen = jQuery.DesktopGrid.dataObj.totalScreens;
            var fromScreen = this.dataObj.currentScreen;
            var jumpDistance = (toScreen - fromScreen) * jQuery.DesktopGrid.dataObj.gridWidth;
            jQuery.DesktopGrid.dataObj.currentScreen = toScreen;
            for (var i = 0; i < totalScreen; i++) {
                var $screen = $('#' + jQuery.DesktopGrid.dataObj.screenName + i);
                $screen.animate({
                    left: $screen.position().left - jumpDistance
                }, 'fast');
            }

            //highlight the current screenThumbnail
            highlightGridScreenThumbnail(toScreen);

            //record state all osx-window of this screen, and hide them
            var wins = $.fn.osxWindow.dataObj.wins;
            var i = 0;
            for(; i < wins.length; i++){
                var $win = wins[i];
                var screen_id = $win.attr('screen_id');
                if(screen_id == fromScreen){
                    var isOpen = $.fn.osxWindow.isOpen($win);
                    $win.attr('pre_state_is_open', isOpen);
                    $.fn.osxWindow.minimize($win);
                }else if(screen_id == toScreen){
                    var pre_state_is_open_str = $win.attr('pre_state_is_open');
                    jQuery.osxUtils.logger.info($win.attr('id') + '==>' + pre_state_is_open_str);
                    if(pre_state_is_open_str == 'true'){
                        $.fn.osxWindow.open($win);
                    }
                }
            }

            jQuery.osxUtils.logger.info('currentScreen=' + fromScreen + ', gotoScreen=' + toScreen);
        },

        /******* create grid screen thumbnail *******/
        createGridScreenThumbnail: function(options){
            if(jQuery.DesktopGrid.dataObj.gridScreenThumbnail != null){
                return jQuery.DesktopGrid.dataObj.gridScreenThumbnail;
            }

            var $ul = $('<ul class="screenThumbnail"/>').css({
                'display': 'block',
                'background': 'none'
            });

            var borderColor = jQuery.osxUtils.getRandomColor(50,50);
            for(var i = 0; i < jQuery.DesktopGrid.dataObj.totalScreens; i++){
                var $li = $('<li/>');

                $li.css({
                    'position':'relative',
                    'display': 'block',
                    'float': 'left',
                    'width': 26,
                    'min-width': 26,
                    'height': '100%',
                    'line-height': 'auto',
                    'text-align': 'center',
                    'cursor': 'pointer',
                    'background': 'none',
                    'border-left': i == 0 ? '1px solid ' + borderColor : 'none',
                    'border-right': i < jQuery.DesktopGrid.dataObj.totalScreens - 1 ? '1px solid ' + borderColor : 'none'
                }).attr({
                    '_screen': i
                }).click(function(){
                    var _screen = $(this).attr('_screen');
                    if(_screen == jQuery.DesktopGrid.dataObj.currentScreen){
                        return;
                    }

                    highlightGridScreenThumbnail(_screen);
                    jQuery.DesktopGrid.goToScreen(_screen);
                }).text(i);

                $li.appendTo($ul);
            }

            jQuery.DesktopGrid.dataObj.gridScreenThumbnail = $ul;
            highlightGridScreenThumbnail(0);

            return $ul;
        }
    }



    /**************************** other functions that do not expose to user, so we define them here *****************************/
    /******* highLight the current screenThumbnail *******/
    /******* init virtual screen, blackLight other screenThumbnail *******/
    function highlightGridScreenThumbnail(toScreen){
        jQuery.DesktopGrid.dataObj.gridScreenThumbnail.find('li').css({
            background: 'none'
        });
        jQuery.DesktopGrid.dataObj.gridScreenThumbnail.find('li').eq(toScreen).css({
            background: jQuery.osxUtils.getRandomColor(0, 255)
        });
    }

    /******* make desktop grid and return the cellContent array *******/
    function make(options) {
        $.extend(jQuery.DesktopGrid.dataObj, options);

        var $gridDivOuter = $(jQuery.DesktopGrid.dataObj.gridDivOuterSelector);
        var $cellContent = $(jQuery.DesktopGrid.dataObj.gridCellSelector);
        jQuery.DesktopGrid.dataObj.totalCellContents = $cellContent.size();
        jQuery.osxUtils.logger.info('cellContentSize=' + jQuery.DesktopGrid.dataObj.totalCellContents);

        //can not find any cellContent
        if (jQuery.DesktopGrid.dataObj.totalCellContents == 0) {
            return;
        }

        //recommend this properties for body
        $('body').css({
            position: 'relative',
            width:'100%',
            overflow: 'hidden'
        });

        //recommend this properties for gridDivOuter
        $gridDivOuter.css({
            position: 'relative',
            overflow: 'hidden'
        });



        //we calculate some key number
        var gridWidth = $gridDivOuter.width();
        var gridHeight = $gridDivOuter.height();
        jQuery.DesktopGrid.dataObj.gridWidth = gridWidth;
        jQuery.DesktopGrid.dataObj.cellContentMargin = (jQuery.DesktopGrid.dataObj.cellWrapWH - jQuery.DesktopGrid.dataObj.cellWH) / 2;
//        jQuery.osxUtils.logger.info('gridWidth=' + gridWidth + ', gridHeight=' + gridHeight);

        var rows = Math.floor((gridHeight - jQuery.DesktopGrid.dataObj.gridDivPaddingTop - jQuery.DesktopGrid.dataObj.gridDivPaddingBottom) / jQuery.DesktopGrid.dataObj.cellWrapWH);
        var columns = Math.floor((gridWidth - jQuery.DesktopGrid.dataObj.gridDivPaddingLeft - jQuery.DesktopGrid.dataObj.gridDivPaddingRight) / jQuery.DesktopGrid.dataObj.cellWrapWH);
        var totalCellsPerScreen = rows * columns;

        jQuery.DesktopGrid.dataObj.rows = rows;
        jQuery.DesktopGrid.dataObj.columns = columns;
        jQuery.DesktopGrid.dataObj.totalCellsPerScreen = totalCellsPerScreen;

        var cellContentAry = null;
        if(jQuery.DesktopGrid.dataObj.gridScreenSelector){
            cellContentAry = processScreenUserDefined($gridDivOuter);
        }else{
            cellContentAry = processScreenAuto($gridDivOuter, $cellContent);
        }

        //bind screen switch hot key
        bindScreenEvent();

        return cellContentAry;
    }

    /******* user define several grid screen, each screen has some cellContent *******/
    function processScreenUserDefined($gridDivOuter){
        jQuery.osxUtils.logger.info('processScreenUserDefined...');
        var $gridScreen = $(jQuery.DesktopGrid.dataObj.gridScreenSelector);
        if($gridScreen.size() == 0){
            jQuery.osxUtils.logger.info('can not find any grid screen by selector=' + jQuery.DesktopGrid.dataObj.gridScreenSelector);
            return;
        }

        jQuery.DesktopGrid.dataObj.totalScreens = $gridScreen.size();
        jQuery.osxUtils.logger.info('rows=' + jQuery.DesktopGrid.dataObj.rows + ', columns=' + jQuery.DesktopGrid.dataObj.columns + ', totalCellsPerScreen=' + jQuery.DesktopGrid.dataObj.totalCellsPerScreen + ', totalScreens=' + jQuery.DesktopGrid.dataObj.totalScreens);

        //init virtual screen
        initVirtualScreen($gridDivOuter);

        //build cellContentAry
        var cellContentAry = [];
        for(var i = 0; i < $gridScreen.size(); i++){
            cellContentAry[i] = [];
            var $screen = $($gridScreen[i]);
            var $cellContentPerScreen = $screen.find(jQuery.DesktopGrid.dataObj.gridCellSelector);

            for(var j = 0; j < $cellContentPerScreen.size(); j++){
                if(j >= jQuery.DesktopGrid.dataObj.totalCellsPerScreen){
                    jQuery.osxUtils.logger.info('too many cellContent, so break, cellContents=' + $cellContentPerScreen.size() + ', totalCellsPerScreen=' + jQuery.DesktopGrid.dataObj.totalCellsPerScreen);
                    break;
                }
                cellContentAry[i][j] = $($cellContentPerScreen[j]).clone(true, true);
            }
        }

        //put cellContent into right cell of grid
        processCellContent(cellContentAry);

        return cellContentAry;
    }

    /******* user do not define grid screen, auto create grid screen by all cellContents that user specified *******/
    function processScreenAuto($gridDivOuter, $cellContent){
        jQuery.osxUtils.logger.info('processScreenAuto...');
        jQuery.DesktopGrid.dataObj.totalScreens = Math.ceil(jQuery.DesktopGrid.dataObj.totalCellContents / jQuery.DesktopGrid.dataObj.totalCellsPerScreen);
        jQuery.osxUtils.logger.info('rows=' + jQuery.DesktopGrid.dataObj.rows + ', columns=' + jQuery.DesktopGrid.dataObj.columns + ', totalCellsPerScreen=' + jQuery.DesktopGrid.dataObj.totalCellsPerScreen + ', totalCellContents=' + jQuery.DesktopGrid.dataObj.totalCellContents + ', totalScreens=' + jQuery.DesktopGrid.dataObj.totalScreens);

        //init virtual screen
        initVirtualScreen($gridDivOuter);

        //build cellContentAry
        var cellContentAry = splitCellByScreen($cellContent, jQuery.DesktopGrid.dataObj.totalCellsPerScreen, jQuery.DesktopGrid.dataObj.totalScreens);

        //put cellContent into right cell of grid
        processCellContent(cellContentAry);

        return cellContentAry;
    }

    /******* put cellContent into right cell of grid *******/
    function processCellContent(cellContentAry){
        for (var i = 0; i < cellContentAry.length; i++) {
            var $screen = $('#' + jQuery.DesktopGrid.dataObj.screenName + i);
            for (var j = 0; j < cellContentAry[i].length; j++) {
//            if we have 4row, 3column, so (7%4=3,7/4=1), (8%/4=0,8/4=2), (11%4=3, 11/4=2)
                var row = j % jQuery.DesktopGrid.dataObj.rows;
                var column = Math.floor(j / jQuery.DesktopGrid.dataObj.rows);
//            logger.info('cellContentIndex=' + j + ', row=' + row + ', column=' + column);

                var cellInfo = getCellAbs(row, column, jQuery.DesktopGrid.dataObj.cellWrapWH, jQuery.DesktopGrid.dataObj.cellContentMargin);
                cellInfo.cellWrapWH = jQuery.DesktopGrid.dataObj.cellWrapWH;
                cellInfo.cellWH = jQuery.DesktopGrid.dataObj.cellWH;
                cellInfo.cellContentMargin = jQuery.DesktopGrid.dataObj.cellContentMargin;
                cellInfo.row = row;
                cellInfo.column = column;
                cellInfo.screen = i;

                var $cell = $(cellContentAry[i][j]);

                //decorate attribute and css of each cell element
                decorateCell($cell, cellInfo);

                $cell.appendTo($screen);

                jQuery.DesktopGrid.dataObj.cellIdIJ[i + '_' + row + '_' + column] = $cell.attr('id');
//                jQuery.osxUtils.logger.info('screen' + i + ', row=' + row + ', column=' + column + ', id=' + $cell.attr('id'));
            }
        }
    }

    /******* reset some config of dataObj *******/
    function resetDataObj() {
        jQuery.DesktopGrid.dataObj = {
            /******************** options that can not be changed by user ********************/
            gridWidth: 0,//the grid width
            cellIdIJ: {},//the id of cell[row, column] content, id such as <div id="yourDivId"/>
            rows: 0,//the totalRows that calculate by the height of gridDiv and cellWrapWH
            columns: 0,//the totalColumns that calculate by the width of gridDiv and cellWrapWH
            totalCellsPerScreen: 0,//the totalCellsPerScreen that calculate by the width and height of gridDiv and cellWrapWH
            totalScreens: 0,//like multi virtual screens of linux
            currentScreen: 0,//the current screen that you see
            zIndex: 1000 * 1,//the z-index of cellContent, when drag start, z-index will be increased, to _make sure the dragged cell keep on the top layer
            making: true,//making the desktop grid
            screenName: 'jQueryDesktopScreen',
            cellContentMargin: 0,//cellContent margin to grid cell
            totalCellContents: 0,//the total number of all cellContent
            gridScreenThumbnail: null,//the thumbnail of all grid screen
            /******************** options that can change by user options ********************/
            gridDivOuterSelector: null,//define the grid width and height
            //the gridCell selector
            //if gridScreenSelector is null, we use $(gridCellSelector) to select all cellContent
            //if gridScreenSelector is not null, we use $(gridScreenSelector).find(gridCellSelector) to select the cellContent of each gridScreen
            gridCellSelector: null,
            gridScreenSelector: null,//gridScreen selector that user specified
            cellWH: 90,//the cellContent width and height, this is the really true cellContent that you can seed via browser
            cellWrapWH: 100,//the wrapper of cellContent, it was just used to convenience the calculate of cell abs position
            gridDivPaddingTop: 0,//the margin that first row to the top of gridDiv container
            gridDivPaddingBottom: 0,//the margin that last row to the top of gridDiv container
            gridDivPaddingLeft: 0,//the margin that first column to the left of gridDiv container
            gridDivPaddingRight: 0,//the margin that first column to the left of gridDiv container
            cellRandomBackgroundColor: true,//give an random background color to all cellContent
            screenRandomBackgroundColor: true,//give an random background color to all screen
            exchangeCellContent: true, //exchange two cellContent if the position already occupied
            easingManner: 'swing',//if you use jquery-easing plugin, then your can pass another easing manner name, such as easeOutBounce(i love this manner)
            dragStartEvent: function () {//this event will fired when you start drag
            },
            dragStopEvent: function () {//this event will fired when you stop drag
            }
        };
    }

    /******* bind screen switch hot key *******/
    function bindScreenEvent() {
        //17 ctrl
        //18 alt
        //37 <-
        //39 ->
        $(window).keydown(function (e) {
//            console.log(e.keyCode);
            if (e.ctrlKey && e.keyCode == 37) {
                jQuery.DesktopGrid.leftScreen();
            }
            if (e.ctrlKey && e.keyCode == 39) {
                jQuery.DesktopGrid.rightScreen();
            }
        });
    }

    /******* split cell into different screen *******/
    function splitCellByScreen($cellContent, totalCellsPerScreen, totalScreens) {
        var screenCellAry = [];
        var length = $cellContent.length;

        out: for (var i = 0; i < totalScreens; i++) {
            screenCellAry[i] = [];
            for (var j = 0; j < totalCellsPerScreen; j++) {
                var tmp = i * totalCellsPerScreen + j;
                if (tmp >= length) {
                    break out;
                }
                screenCellAry[i][j] = $($cellContent[i * totalCellsPerScreen + j]).clone(true, true);
            }
        }

        //only for debug
//            for(var i = 0; i < screenCellAry.length; i++){
//                jQuery.osxUtils.logger.info('===========screen' + i);
//                for(var j = 0; j < screenCellAry[i].length; j++){
//                    jQuery.osxUtils.logger.info($(screenCellAry[i][j]).attr('id'));
//                }
//            }

        return screenCellAry;
    }

    /******* init virtual screen *******/
    function initVirtualScreen($gridDivOuter) {
        for (var i = 0; i < jQuery.DesktopGrid.dataObj.totalScreens; i++) {
            //we just clone the girdDiv, do not need clone the sub element of girdDiv
            var $screen = $('<div/>').attr({
                id: jQuery.DesktopGrid.dataObj.screenName + i
            }).css({
                overflow:'hidden',
                width: '100%',
                height: '100%',
                position: 'absolute',
                top: 0,
                left: 0 + jQuery.DesktopGrid.dataObj.gridWidth * i,
                background: jQuery.DesktopGrid.dataObj.screenRandomBackgroundColor == true ? jQuery.osxUtils.getRandomColor() : 'none'
            }).appendTo($gridDivOuter);

            //the first screen must be showed
            if (i == 0) {
                $screen.show();
            }

            jQuery.osxUtils.logger.info('create grid screenId=' + $screen.attr('id'));
        }

        jQuery.DesktopGrid.dataObj.currentScreen = 0;
    }

    /******* decorate attribute and css of each cell element *******/
    function decorateCell($this, cellInfo) {
        $this.attr({
            _cell_wrap_wh: cellInfo.cellWrapWH,
            _cell_margin: cellInfo.cellContentMargin,
            _row: cellInfo.row,
            _column: cellInfo.column,
            _screen: cellInfo.screen,
            _top: cellInfo.top,
            _left: cellInfo.left
        }).css({
            cursor:'move',
            'z-index': jQuery.DesktopGrid.dataObj.zIndex,
            position: 'absolute',
            width: cellInfo.cellWH,
            height: cellInfo.cellWH,
            background: jQuery.DesktopGrid.dataObj.cellRandomBackgroundColor == true ? jQuery.osxUtils.getRandomColor() : 'none',
            top: cellInfo.top,
            left: cellInfo.left
        }).show();

        //eventType=start, stop
        function getStartEventKey(eventType){
            if($.parser){
                if(eventType == 'start'){
                    return 'onStartDrag';
                }else if(eventType == 'stop'){
                    return 'onStopDrag';
                }
            }

            if(eventType == 'start'){
                return 'start';
            }else if(eventType == 'stop'){
                return 'stop';
            }
        }

        /******* enable draggable *******/
        //if you use jquery-easyui plugin, $.parser will be an object, easyui rewrite the draggable() method, so we process it like this
        var dragEventConfig = {};
        dragEventConfig[getStartEventKey('start')] = function(){
            jQuery.osxUtils.logger.info('onStartDrag...');
            var $this = $(this);
            $this.css('z-index', ++jQuery.DesktopGrid.dataObj.zIndex);
            jQuery.DesktopGrid.dataObj.dragStartEvent();
        }
        dragEventConfig[getStartEventKey('stop')] = function(){
            jQuery.osxUtils.logger.info('onStopDrag...');
            rePositionCell($(this));
            jQuery.DesktopGrid.dataObj.dragStopEvent();
        }
        $this.draggable(dragEventConfig);
    }

    /******* the absolute position of cellWrapper *******/
    function getCellWrapperAbs(row, column, wrapCellWH) {
        return {
            top: wrapCellWH * row,
            left: wrapCellWH * column
        }
    }

    /******* the absolute position of cell *******/
    function getCellAbs(row, column, wrapCellWH, cellMargin) {
        return {
            top: wrapCellWH * row + cellMargin + jQuery.DesktopGrid.dataObj.gridDivPaddingTop,
            left: wrapCellWH * column + cellMargin + jQuery.DesktopGrid.dataObj.gridDivPaddingLeft
        }
    }

    /******* the absolute position of cell center *******/
    function getCellAbsCenter(row, column, wrapCellWH) {
        return {
            top: wrapCellWH * row + wrapCellWH / 2,
            left: wrapCellWH * column + wrapCellWH / 2
        }
    }

    /******* when drag stop, put the cellYouDragFrom(your dragged) into the right cellYouWantDragTo(you want to drag to) *******/
    function rePositionCell($this) {
        var top = parseInt($this.position().top);
        var left = parseInt($this.position().left);
        var width = parseInt($this.width());
        var height = parseInt($this.height());
        var cellWrapWH = parseInt($this.attr('_cell_wrap_wh'));
        var cellMargin = parseInt($this.attr('_cell_margin'));
        var rowSrcFrom = parseInt($this.attr('_row'));
        var columnSrcFrom = parseInt($this.attr('_column'));
        var topSrc = $this.attr('_top');
        var leftSrc = $this.attr('_left');

        var centerTop = top + height / 2;
        var centerLeft = left + width / 2;

        var rowNew = Math.floor((centerTop - jQuery.DesktopGrid.dataObj.gridDivPaddingTop) / cellWrapWH);
        var columnNew = Math.floor((centerLeft - jQuery.DesktopGrid.dataObj.gridDivPaddingLeft) / cellWrapWH);
        jQuery.osxUtils.logger.info('rowSrc=' + rowSrcFrom + ', columnSrc=' + columnSrcFrom)
        jQuery.osxUtils.logger.info('rowNew=' + rowNew + ', columnNew=' + columnNew);

        rowNew = Math.max(rowNew, 0);
        columnNew = Math.max(columnNew, 0);
        rowNew = Math.min(rowNew, jQuery.DesktopGrid.dataObj.rows - 1);
        columnNew = Math.min(columnNew, jQuery.DesktopGrid.dataObj.columns - 1);

        var cellAbsDragFrom = getCellAbs(rowSrcFrom, columnSrcFrom, cellWrapWH, cellMargin);
        var cellAbsDragTo = getCellAbs(rowNew, columnNew, cellWrapWH, cellMargin);

        if (rowSrcFrom == rowNew && columnSrcFrom == columnNew) {
            jQuery.osxUtils.logger.log('position, row=' + rowNew + ', column=' + columnNew + ' is the src position, do not need move');
            moveCellTo(jQuery.DesktopGrid.dataObj.currentScreen, $this, cellAbsDragFrom, rowSrcFrom, columnSrcFrom, rowSrcFrom, columnSrcFrom, false);
            return;
        }

        var cellIdDragTo = jQuery.DesktopGrid.dataObj.cellIdIJ[jQuery.DesktopGrid.dataObj.currentScreen + '_' + rowNew + '_' + columnNew];
        var $cellDragTo = $('#' + cellIdDragTo);
//            jQuery.osxUtils.logger.info('cellIdDragTo=' + cellIdDragTo);

        //the target cell is empty, so move cell which you dragged to the position directly
        if ($cellDragTo.size() == 0) {
            moveCellTo(jQuery.DesktopGrid.dataObj.currentScreen, $this, cellAbsDragTo, rowSrcFrom, columnSrcFrom, rowNew, columnNew, true);
        } else {
            //the target cell is already occupied
            if (jQuery.DesktopGrid.dataObj.exchangeCellContent) {
                jQuery.osxUtils.logger.log('position, row=' + rowNew + ', column=' + columnNew + ' is already occupied, exchange two cells content');
                moveCellTo(jQuery.DesktopGrid.dataObj.currentScreen, $this, cellAbsDragTo, rowSrcFrom, columnSrcFrom, rowNew, columnNew, false);
                moveCellTo(jQuery.DesktopGrid.dataObj.currentScreen, $cellDragTo, cellAbsDragFrom, rowNew, columnNew, rowSrcFrom, columnSrcFrom, false);
            } else {
                jQuery.osxUtils.logger.log('position, row=' + rowNew + ', column=' + columnNew + ' is already occupied, please change other position');
                moveCellTo(jQuery.DesktopGrid.dataObj.currentScreen, $this, cellAbsDragFrom, rowSrcFrom, columnSrcFrom, rowSrcFrom, columnSrcFrom, false);
            }
        }
    }

    /******* move cellContent to the right position and  change some properties in the same time *******/
    function moveCellTo(screen, $cell, cellAbs, rowSrc, columnSrc, rowNew, columnNew, setSrc) {
        $cell.attr({
            _row: rowNew,
            _column: columnNew,
            _top: cellAbs.top,
            _left: cellAbs.left
        }).css({
            'z-index': ++jQuery.DesktopGrid.dataObj.zIndex
        }).animate({
            top: cellAbs.top,
            left: cellAbs.left
        }, 300, $.DesktopGrid.dataObj.easingManner);

        if (setSrc)jQuery.DesktopGrid.dataObj.cellIdIJ[screen + '_' + rowSrc + '_' + columnSrc] = null;
        jQuery.DesktopGrid.dataObj.cellIdIJ[screen + '_' + rowNew + '_' + columnNew] = $cell.attr('id');
    }
})