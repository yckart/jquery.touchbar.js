/*!
 * jquery.touchbar.js 0.1 - https://github.com/yckart/jquery.touchbar.js
 * Touchable sidebar!
 *
 * Inspired by Facebook.
 *
 * Copyright (c) 2012 Yannick Albert (http://yckart.com)
 * Licensed under the MIT license (http://www.opensource.org/licenses/mit-license.php).
 * 2013/01/19
 */
(function ($, window, document) {
    'use strict';

    if(window.jQuery) $.event.props.push("touches");

    var pluginName = 'touchbar',
        defaults = {
            content: '#content',
            body: document,
            start: 40,
            animation: {
                duration: 200,
                easing: '',
                complete: $.noop
            },
            onSlide: $.noop
        };

    function Plugin(elem, options) {
        options = $.extend({}, defaults, options);

        var sidebar = $(elem),
            content = $(options.content),
            stop = sidebar.width(),

            offsetX = 0,
            clientX = 0,
            prevX = 0,
            isLeft = 0,
            animObj = {},

            isStart = false,
            isMove = false;

        var onStart = function(e){
            isStart = true;
            offsetX = content.offset().left;
            clientX = e.touches[0].clientX;
        };

        var onMove = function(e){
            if(!isStart) return;
            isMove = true;

            var endX = offsetX + e.touches[0].clientX - clientX;
            isLeft = prevX >= e.touches[0].clientX;
            prevX = e.touches[0].clientX;

            if (endX > 0 && endX < stop && e.touches.length === 1) {
                content.css({
                    '-webkit-transition': '',
                    '-webkit-transform': 'translateX(' + endX + 'px)'
                });
                if(endX > 5 && endX < stop - 5) e.preventDefault();
            }
        };

        var onEnd = function(){
            if(!isMove) return;

            offsetX = content.offset().left;

            if (offsetX < (options.start.left || options.start)) {
                animObj['-webkit-transform'] = 'translateX(0)';
            } else if (offsetX > stop - (options.start.right || options.start)) {
                animObj['-webkit-transform'] = 'translateX(' + stop + 'px)';
            } else {
                animObj['-webkit-transform'] = 'translateX(' + (isLeft ? 0 : stop) + 'px)';
            }

            options.animation.step = options.onSlide;
            animObj['-webkit-transition'] = 'all .2s';
            content.css(animObj, options.animation);

            isStart = isMove = false;
        };

        $(options.body).on({
            touchstart: onStart,
            touchmove: onMove,
            touchend: onEnd
        });

        sidebar.on('open close', function(e,a){
            content.css({
                '-webkit-transition': 'all .2s',
                '-webkit-transform': 'translateX(' + (e.type === 'open' ? stop : 0) + 'px)'
            }, options.animation);
        });
    }

    $.fn[pluginName] = function(options){
        return this.each(function(){
            new Plugin(this, options);
        });
    };

})(window.jQuery || window.Zepto, window, document);