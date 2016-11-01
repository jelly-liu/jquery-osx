/**
 * first, you should import css and js to your html page
 */

/**
 * osx-message demo like follows
 * note, you can use all configuration of osx-window
 */
$(function(){
    //alert example
    $('<div>This is an alert</div>').osxMessage('alert', {
        title: 'Osx-Alert',
        windowBackgroundOpacity: 0.8
    });

    //confirm example
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

    //prompt example
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

    //note example
    $('<div>This is an note</div>').osxMessage('note', {
        title: 'Osx-Note',
        windowBackgroundOpacity: 0.8,
        timeout: 3,
        width: 150,
        height: 80,
        //tl,tc,tr,ml,mc,mr,bl,bc,br
        location: 'br',
        showManner: 'slideDown',
        hideManner: 'slideUp'
    });
})
