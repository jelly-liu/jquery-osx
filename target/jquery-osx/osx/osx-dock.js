/**************************** osx dock css and event enhance ****************************/
$(function () {
    $('.osx-dock td.mid').each(function() {
        var $td = $(this);
        $(this).find('img').hover(function () {
                $(this).animate({
                    width: 72
                }, 'fast', function () {
                    $td.find('.titleProp').text($(this).attr('titleProp')).css({
                        left: $(this).position().left,
                        width: $(this).width()
                    }).show();
                });
            }, function () {
                $(this).animate({
                    width: 48
                }, 'fast', function () {
                    $td.find('.titleProp').hide();
                });
            }
        )
    })
})