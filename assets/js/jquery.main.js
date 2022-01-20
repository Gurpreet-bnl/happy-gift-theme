// Passive event listeners
jQuery.event.special.touchstart = {
    setup: function( _, ns, handle ) {
        this.addEventListener("touchstart", handle, { passive: !ns.includes("noPreventDefault") });
    }
};
jQuery.event.special.touchmove = {
    setup: function( _, ns, handle ) {
        this.addEventListener("touchmove", handle, { passive: !ns.includes("noPreventDefault") });
    }
};

jQuery(function() {
  initMobileNav();
  initAnchors();
  initCustomScript();
  initTabNav();
  initCustomForms();
});

// initialize custom form elements
function initCustomForms() {
  jcf.setOptions('Select', {
    maxVisibleItems: 8,
    wrapNative: false,
    wrapNativeOnMobile: false,
    fakeDropInBody: false,
  });
  jcf.replaceAll('.custom-form');
}

// mobile menu init
function initMobileNav() {
  jQuery('body').mobileNav({
    menuActiveClass: 'nav-active',
    menuOpener: '.nav-opener'
  });
}

// initialize smooth anchor links
function initAnchors() {
  new SmoothScroll({
    anchorLinks: 'a[href^="#"]:not([href="#"]):not([data-toggle="tab"]):not([data-toggle="collapse"])',
    extraOffset: 0,
    wheelBehavior: 'none'
  });
}

//custom script
function initCustomScript() {
  jQuery('a,input,select,button,textarea').keyboardFocus('key_focused');

  jQuery(document).on('click', '.data_exap_link', function(event) {
    event.preventDefault();
    jQuery(this).closest('tr').toggleClass('row_active');
  });

  jQuery(document).on('click', '.show_password', function(event) {
    event.preventDefault();
    var self = jQuery(this);

    self.parent().toggleClass('active');
    if(self.parent().find('input').attr('type') == 'password') {
      self.parent().find('input').attr('type', 'text');
    } else {
      self.parent().find('input').attr('type', 'password');
    }
  });
}

// &quot;tab&quot; key handling
function initTabNav() {
  jQuery('#nav').tabNav({
    items: 'li',
    opener: 'a,button,input'
  });
}

/*
 * Simple Mobile Navigation
 */
;(function($) {
  function MobileNav(options) {
    this.options = $.extend({
      container: null,
      hideOnClickOutside: false,
      menuActiveClass: 'nav-active',
      menuOpener: '.nav-opener',
      menuDrop: '.nav-drop',
      toggleEvent: 'click',
      outsideClickEvent: 'click touchstart pointerdown MSPointerDown'
    }, options);
    this.initStructure();
    this.attachEvents();
  }
  MobileNav.prototype = {
    initStructure: function() {
      this.page = $('html');
      this.container = $(this.options.container);
      this.opener = this.container.find(this.options.menuOpener);
      this.drop = this.container.find(this.options.menuDrop);
    },
    attachEvents: function() {
      var self = this;

      if(activateResizeHandler) {
        activateResizeHandler();
        activateResizeHandler = null;
      }

      this.outsideClickHandler = function(e) {
        if(self.isOpened()) {
          var target = $(e.target);
          if(!target.closest(self.opener).length && !target.closest(self.drop).length) {
            self.hide();
          }
        }
      };

      this.openerClickHandler = function(e) {
        e.preventDefault();
        self.toggle();
      };

      this.opener.on(this.options.toggleEvent, this.openerClickHandler);
    },
    isOpened: function() {
      return this.container.hasClass(this.options.menuActiveClass);
    },
    show: function() {
      this.container.addClass(this.options.menuActiveClass);
      if(this.options.hideOnClickOutside) {
        this.page.on(this.options.outsideClickEvent, this.outsideClickHandler);
      }
    },
    hide: function() {
      this.container.removeClass(this.options.menuActiveClass);
      if(this.options.hideOnClickOutside) {
        this.page.off(this.options.outsideClickEvent, this.outsideClickHandler);
      }
    },
    toggle: function() {
      if(this.isOpened()) {
        this.hide();
      } else {
        this.show();
      }
    },
    destroy: function() {
      this.container.removeClass(this.options.menuActiveClass);
      this.opener.off(this.options.toggleEvent, this.clickHandler);
      this.page.off(this.options.outsideClickEvent, this.outsideClickHandler);
    }
  };

  var activateResizeHandler = function() {
    var win = $(window),
      doc = $('html'),
      resizeClass = 'resize-active',
      flag, timer;
    var removeClassHandler = function() {
      flag = false;
      doc.removeClass(resizeClass);
    };
    var resizeHandler = function() {
      if(!flag) {
        flag = true;
        doc.addClass(resizeClass);
      }
      clearTimeout(timer);
      timer = setTimeout(removeClassHandler, 500);
    };
    win.on('resize orientationchange', resizeHandler);
  };

  $.fn.mobileNav = function(opt) {
    var args = Array.prototype.slice.call(arguments);
    var method = args[0];

    return this.each(function() {
      var $container = jQuery(this);
      var instance = $container.data('MobileNav');

      if (typeof opt === 'object' || typeof opt === 'undefined') {
        $container.data('MobileNav', new MobileNav($.extend({
          container: this
        }, opt)));
      } else if (typeof method === 'string' && instance) {
        if (typeof instance[method] === 'function') {
          args.shift();
          instance[method].apply(instance, args);
        }
      }
    });
  };
}(jQuery));

/*!
 * SmoothScroll module
 */
;(function($, exports) {
  // private variables
  var page,
    win = $(window),
    activeBlock, activeWheelHandler,
    wheelEvents = ('onwheel' in document || document.documentMode >= 9 ? 'wheel' : 'mousewheel DOMMouseScroll');

  // animation handlers
  function scrollTo(offset, options, callback) {
    // initialize variables
    var scrollBlock;
    if (document.body) {
      if (typeof options === 'number') {
        options = {
          duration: options
        };
      } else {
        options = options || {};
      }
      page = page || $('html, body');
      scrollBlock = options.container || page;
    } else {
      return;
    }

    // treat single number as scrollTop
    if (typeof offset === 'number') {
      offset = {
        top: offset
      };
    }

    // handle mousewheel/trackpad while animation is active
    if (activeBlock && activeWheelHandler) {
      activeBlock.off(wheelEvents, activeWheelHandler);
    }
    if (options.wheelBehavior && options.wheelBehavior !== 'none') {
      activeWheelHandler = function(e) {
        if (options.wheelBehavior === 'stop') {
          scrollBlock.off(wheelEvents, activeWheelHandler);
          scrollBlock.stop();
        } else if (options.wheelBehavior === 'ignore') {
          e.preventDefault();
        }
      };
      activeBlock = scrollBlock.on(wheelEvents, activeWheelHandler);
    }

    // start scrolling animation
    scrollBlock.stop().animate({
      scrollLeft: offset.left,
      scrollTop: offset.top
    }, options.duration, function() {
      if (activeWheelHandler) {
        scrollBlock.off(wheelEvents, activeWheelHandler);
      }
      if ($.isFunction(callback)) {
        callback();
      }
    });
  }

  // smooth scroll contstructor
  function SmoothScroll(options) {
    this.options = $.extend({
      anchorLinks: 'a[href^="#"]', // selector or jQuery object
      container: null, // specify container for scrolling (default - whole page)
      extraOffset: null, // function or fixed number
      activeClasses: null, // null, "link", "parent"
      easing: 'swing', // easing of scrolling
      animMode: 'duration', // or "speed" mode
      animDuration: 800, // total duration for scroll (any distance)
      animSpeed: 1500, // pixels per second
      anchorActiveClass: 'anchor-active',
      sectionActiveClass: 'section-active',
      wheelBehavior: 'stop', // "stop", "ignore" or "none"
      useNativeAnchorScrolling: false // do not handle click in devices with native smooth scrolling
    }, options);
    this.init();
  }
  SmoothScroll.prototype = {
    init: function() {
      this.initStructure();
      this.attachEvents();
      this.isInit = true;
    },
    initStructure: function() {
      var self = this;

      this.container = this.options.container ? $(this.options.container) : $('html,body');
      this.scrollContainer = this.options.container ? this.container : win;
      this.anchorLinks = jQuery(this.options.anchorLinks).filter(function() {
        return jQuery(self.getAnchorTarget(jQuery(this))).length;
      });
    },
    getId: function(str) {
      try {
        return '#' + str.replace(/^.*?(#|$)/, '');
      } catch (err) {
        return null;
      }
    },
    getAnchorTarget: function(link) {
      // get target block from link href
      var targetId = this.getId($(link).attr('href'));
      return $(targetId.length > 1 ? targetId : 'html');
    },
    getTargetOffset: function(block) {
      // get target offset
      var blockOffset = block.offset().top;
      if (this.options.container) {
        blockOffset -= this.container.offset().top - this.container.prop('scrollTop');
      }

      // handle extra offset
      if (typeof this.options.extraOffset === 'number') {
        blockOffset -= this.options.extraOffset;
      } else if (typeof this.options.extraOffset === 'function') {
        blockOffset -= this.options.extraOffset(block);
      }
      return {
        top: blockOffset
      };
    },
    attachEvents: function() {
      var self = this;

      // handle active classes
      if (this.options.activeClasses && this.anchorLinks.length) {
        // cache structure
        this.anchorData = [];

        for (var i = 0; i < this.anchorLinks.length; i++) {
          var link = jQuery(this.anchorLinks[i]),
            targetBlock = self.getAnchorTarget(link),
            anchorDataItem = null;

          $.each(self.anchorData, function(index, item) {
            if (item.block[0] === targetBlock[0]) {
              anchorDataItem = item;
            }
          });

          if (anchorDataItem) {
            anchorDataItem.link = anchorDataItem.link.add(link);
          } else {
            self.anchorData.push({
              link: link,
              block: targetBlock
            });
          }
        };

        // add additional event handlers
        this.resizeHandler = function() {
          if (!self.isInit) return;
          self.recalculateOffsets();
        };
        this.scrollHandler = function() {
          self.refreshActiveClass();
        };

        this.recalculateOffsets();
        this.scrollContainer.on('scroll', this.scrollHandler);
        win.on('resize load orientationchange refreshAnchor', this.resizeHandler);
      }

      // handle click event
      this.clickHandler = function(e) {
        self.onClick(e);
      };
      if (!this.options.useNativeAnchorScrolling) {
        this.anchorLinks.on('click', this.clickHandler);
      }
    },
    recalculateOffsets: function() {
      var self = this;
      $.each(this.anchorData, function(index, data) {
        data.offset = self.getTargetOffset(data.block);
        data.height = data.block.outerHeight();
      });
      this.refreshActiveClass();
    },
    toggleActiveClass: function(anchor, block, state) {
      anchor.toggleClass(this.options.anchorActiveClass, state);
      block.toggleClass(this.options.sectionActiveClass, state);
    },
    refreshActiveClass: function() {
      var self = this,
        foundFlag = false,
        containerHeight = this.container.prop('scrollHeight'),
        viewPortHeight = this.scrollContainer.height(),
        scrollTop = this.options.container ? this.container.prop('scrollTop') : win.scrollTop();

      // user function instead of default handler
      if (this.options.customScrollHandler) {
        this.options.customScrollHandler.call(this, scrollTop, this.anchorData);
        return;
      }

      // sort anchor data by offsets
      this.anchorData.sort(function(a, b) {
        return a.offset.top - b.offset.top;
      });

      // default active class handler
      $.each(this.anchorData, function(index) {
        var reverseIndex = self.anchorData.length - index - 1,
          data = self.anchorData[reverseIndex],
          anchorElement = (self.options.activeClasses === 'parent' ? data.link.parent() : data.link);

        if (scrollTop >= containerHeight - viewPortHeight) {
          // handle last section
          if (reverseIndex === self.anchorData.length - 1) {
            self.toggleActiveClass(anchorElement, data.block, true);
          } else {
            self.toggleActiveClass(anchorElement, data.block, false);
          }
        } else {
          // handle other sections
          if (!foundFlag && (scrollTop >= data.offset.top - 1 || reverseIndex === 0)) {
            foundFlag = true;
            self.toggleActiveClass(anchorElement, data.block, true);
          } else {
            self.toggleActiveClass(anchorElement, data.block, false);
          }
        }
      });
    },
    calculateScrollDuration: function(offset) {
      var distance;
      if (this.options.animMode === 'speed') {
        distance = Math.abs(this.scrollContainer.scrollTop() - offset.top);
        return (distance / this.options.animSpeed) * 1000;
      } else {
        return this.options.animDuration;
      }
    },
    onClick: function(e) {
      var targetBlock = this.getAnchorTarget(e.currentTarget),
        targetOffset = this.getTargetOffset(targetBlock);

      e.preventDefault();
      scrollTo(targetOffset, {
        container: this.container,
        wheelBehavior: this.options.wheelBehavior,
        duration: this.calculateScrollDuration(targetOffset)
      });
      this.makeCallback('onBeforeScroll', e.currentTarget);
    },
    makeCallback: function(name) {
      if (typeof this.options[name] === 'function') {
        var args = Array.prototype.slice.call(arguments);
        args.shift();
        this.options[name].apply(this, args);
      }
    },
    destroy: function() {
      var self = this;

      this.isInit = false;
      if (this.options.activeClasses) {
        win.off('resize load orientationchange refreshAnchor', this.resizeHandler);
        this.scrollContainer.off('scroll', this.scrollHandler);
        $.each(this.anchorData, function(index) {
          var reverseIndex = self.anchorData.length - index - 1,
            data = self.anchorData[reverseIndex],
            anchorElement = (self.options.activeClasses === 'parent' ? data.link.parent() : data.link);

          self.toggleActiveClass(anchorElement, data.block, false);
        });
      }
      this.anchorLinks.off('click', this.clickHandler);
    }
  };

  // public API
  $.extend(SmoothScroll, {
    scrollTo: function(blockOrOffset, durationOrOptions, callback) {
      scrollTo(blockOrOffset, durationOrOptions, callback);
    }
  });

  // export module
  exports.SmoothScroll = SmoothScroll;
}(jQuery, this));

/*
 * Accessible TAB navigation
 */
;(function($){
  var isWindowsPhone = /Windows Phone/.test(navigator.userAgent);
  var isTouchDevice = ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch;

  $.fn.tabNav = function(opt) {
    var options = $.extend({
      hoverClass: 'hover',
      items: 'li',
      opener: '>a',
      delay: 10
    },opt);

    if(isWindowsPhone || isTouchDevice) {
      return this;
    }

    return this.each(function() {
      var nav = $(this), items = nav.find(options.items);

      items.each(function(index, navItem) {
        var item = $(this), navActive, touchNavActive;
        var link = item.find(options.opener), timer;

        link.bind('focus', function() {
          navActive = nav.hasClass('js-nav-active');
          touchNavActive = window.TouchNav && TouchNav.isActiveOn(navItem);
          if(!navActive || touchNavActive) {
            initSimpleNav();
          }
          item.trigger(navActive && touchNavActive ? 'itemhover' : 'mouseenter');
        }).bind('blur', function() {
          item.trigger(navActive && touchNavActive ? 'itemleave' : 'mouseleave');
        });

        var initSimpleNav = function() {
          if(!initSimpleNav.done) {
            initSimpleNav.done = true;
            item.hover(function() {
              clearTimeout(timer);
              timer = setTimeout(function() {
                item.addClass(options.hoverClass);
              }, options.delay);
            }, function() {
              clearTimeout(timer);
              timer = setTimeout(function() {
                item.removeClass(options.hoverClass);
              }, options.delay);
            });
          }
        };
      });
    });
  };
}(jQuery));


/*!
 * JavaScript Custom Forms
 *
 * Copyright 2014-2015 PSD2HTML - http://psd2html.com/jcf
 * Released under the MIT license (LICENSE.txt)
 *
 * Version: 1.1.3
 */
;(function(root, factory) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['jquery'], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(require('jquery'));
  } else {
    root.jcf = factory(jQuery);
  }
}(this, function($) {
  'use strict';

  // define version
  var version = '1.1.3';

  // private variables
  var customInstances = [];

  // default global options
  var commonOptions = {
    optionsKey: 'jcf',
    dataKey: 'jcf-instance',
    rtlClass: 'jcf-rtl',
    focusClass: 'jcf-focus',
    pressedClass: 'jcf-pressed',
    disabledClass: 'jcf-disabled',
    hiddenClass: 'jcf-hidden',
    resetAppearanceClass: 'jcf-reset-appearance',
    unselectableClass: 'jcf-unselectable'
  };

  // detect device type
  var isTouchDevice = ('ontouchstart' in window) || window.DocumentTouch && document instanceof window.DocumentTouch,
    isWinPhoneDevice = /Windows Phone/.test(navigator.userAgent);
  commonOptions.isMobileDevice = !!(isTouchDevice || isWinPhoneDevice);
  
  var isIOS = /(iPad|iPhone).*OS ([0-9_]*) .*/.exec(navigator.userAgent);
  if(isIOS) isIOS = parseFloat(isIOS[2].replace(/_/g, '.'));
  commonOptions.ios = isIOS;

  // create global stylesheet if custom forms are used
  var createStyleSheet = function() {
    var styleTag = $('<style>').appendTo('head'),
      styleSheet = styleTag.prop('sheet') || styleTag.prop('styleSheet');

    // crossbrowser style handling
    var addCSSRule = function(selector, rules, index) {
      if (styleSheet.insertRule) {
        styleSheet.insertRule(selector + '{' + rules + '}', index);
      } else {
        styleSheet.addRule(selector, rules, index);
      }
    };

    // add special rules
    addCSSRule('.' + commonOptions.hiddenClass, 'position:absolute !important;left:-9999px !important;height:1px !important;width:1px !important;margin:0 !important;border-width:0 !important;-webkit-appearance:none;-moz-appearance:none;appearance:none');
    addCSSRule('.' + commonOptions.rtlClass + ' .' + commonOptions.hiddenClass, 'right:-9999px !important; left: auto !important');
    addCSSRule('.' + commonOptions.unselectableClass, '-webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; -webkit-tap-highlight-color: rgba(0,0,0,0);');
    addCSSRule('.' + commonOptions.resetAppearanceClass, 'background: none; border: none; -webkit-appearance: none; appearance: none; opacity: 0; filter: alpha(opacity=0);');

    // detect rtl pages
    var html = $('html'), body = $('body');
    if (html.css('direction') === 'rtl' || body.css('direction') === 'rtl') {
      html.addClass(commonOptions.rtlClass);
    }

    // handle form reset event
    html.on('reset', function() {
      setTimeout(function() {
        api.refreshAll();
      }, 0);
    });

    // mark stylesheet as created
    commonOptions.styleSheetCreated = true;
  };

  // simplified pointer events handler
  (function() {
    var pointerEventsSupported = navigator.pointerEnabled || navigator.msPointerEnabled,
      touchEventsSupported = ('ontouchstart' in window) || window.DocumentTouch && document instanceof window.DocumentTouch,
      eventList, eventMap = {}, eventPrefix = 'jcf-';

    // detect events to attach
    if (pointerEventsSupported) {
      eventList = {
        pointerover: navigator.pointerEnabled ? 'pointerover' : 'MSPointerOver',
        pointerdown: navigator.pointerEnabled ? 'pointerdown' : 'MSPointerDown',
        pointermove: navigator.pointerEnabled ? 'pointermove' : 'MSPointerMove',
        pointerup: navigator.pointerEnabled ? 'pointerup' : 'MSPointerUp'
      };
    } else {
      eventList = {
        pointerover: 'mouseover',
        pointerdown: 'mousedown' + (touchEventsSupported ? ' touchstart' : ''),
        pointermove: 'mousemove' + (touchEventsSupported ? ' touchmove' : ''),
        pointerup: 'mouseup' + (touchEventsSupported ? ' touchend' : '')
      };
    }

    // create event map
    $.each(eventList, function(targetEventName, fakeEventList) {
      $.each(fakeEventList.split(' '), function(index, fakeEventName) {
        eventMap[fakeEventName] = targetEventName;
      });
    });

    // jQuery event hooks
    $.each(eventList, function(eventName, eventHandlers) {
      eventHandlers = eventHandlers.split(' ');
      $.event.special[eventPrefix + eventName] = {
        setup: function() {
          var self = this;
          $.each(eventHandlers, function(index, fallbackEvent) {
            if (self.addEventListener) self.addEventListener(fallbackEvent, fixEvent, false);
            else self['on' + fallbackEvent] = fixEvent;
          });
        },
        teardown: function() {
          var self = this;
          $.each(eventHandlers, function(index, fallbackEvent) {
            if (self.addEventListener) self.removeEventListener(fallbackEvent, fixEvent, false);
            else self['on' + fallbackEvent] = null;
          });
        }
      };
    });

    // check that mouse event are not simulated by mobile browsers
    var lastTouch = null;
    var mouseEventSimulated = function(e) {
      var dx = Math.abs(e.pageX - lastTouch.x),
        dy = Math.abs(e.pageY - lastTouch.y),
        rangeDistance = 25;

      if (dx <= rangeDistance && dy <= rangeDistance) {
        return true;
      }
    };

    // normalize event
    var fixEvent = function(e) {
      var origEvent = e || window.event,
        touchEventData = null,
        targetEventName = eventMap[origEvent.type];

      e = $.event.fix(origEvent);
      e.type = eventPrefix + targetEventName;

      if (origEvent.pointerType) {
        switch (origEvent.pointerType) {
          case 2: e.pointerType = 'touch'; break;
          case 3: e.pointerType = 'pen'; break;
          case 4: e.pointerType = 'mouse'; break;
          default: e.pointerType = origEvent.pointerType;
        }
      } else {
        e.pointerType = origEvent.type.substr(0, 5); // "mouse" or "touch" word length
      }

      if (!e.pageX && !e.pageY) {
        touchEventData = origEvent.changedTouches ? origEvent.changedTouches[0] : origEvent;
        e.pageX = touchEventData.pageX;
        e.pageY = touchEventData.pageY;
      }

      if (origEvent.type === 'touchend') {
        lastTouch = { x: e.pageX, y: e.pageY };
      }
      if (e.pointerType === 'mouse' && lastTouch && mouseEventSimulated(e)) {
        return;
      } else {
        return ($.event.dispatch || $.event.handle).call(this, e);
      }
    };
  }());

  // custom mousewheel/trackpad handler
  (function() {
    var wheelEvents = ('onwheel' in document || document.documentMode >= 9 ? 'wheel' : 'mousewheel DOMMouseScroll').split(' '),
      shimEventName = 'jcf-mousewheel';

    $.event.special[shimEventName] = {
      setup: function() {
        var self = this;
        $.each(wheelEvents, function(index, fallbackEvent) {
          if (self.addEventListener) self.addEventListener(fallbackEvent, fixEvent, false);
          else self['on' + fallbackEvent] = fixEvent;
        });
      },
      teardown: function() {
        var self = this;
        $.each(wheelEvents, function(index, fallbackEvent) {
          if (self.addEventListener) self.removeEventListener(fallbackEvent, fixEvent, false);
          else self['on' + fallbackEvent] = null;
        });
      }
    };

    var fixEvent = function(e) {
      var origEvent = e || window.event;
      e = $.event.fix(origEvent);
      e.type = shimEventName;

      // old wheel events handler
      if ('detail'      in origEvent) { e.deltaY = -origEvent.detail;      }
      if ('wheelDelta'  in origEvent) { e.deltaY = -origEvent.wheelDelta;  }
      if ('wheelDeltaY' in origEvent) { e.deltaY = -origEvent.wheelDeltaY; }
      if ('wheelDeltaX' in origEvent) { e.deltaX = -origEvent.wheelDeltaX; }

      // modern wheel event handler
      if ('deltaY' in origEvent) {
        e.deltaY = origEvent.deltaY;
      }
      if ('deltaX' in origEvent) {
        e.deltaX = origEvent.deltaX;
      }

      // handle deltaMode for mouse wheel
      e.delta = e.deltaY || e.deltaX;
      if (origEvent.deltaMode === 1) {
        var lineHeight = 16;
        e.delta *= lineHeight;
        e.deltaY *= lineHeight;
        e.deltaX *= lineHeight;
      }

      return ($.event.dispatch || $.event.handle).call(this, e);
    };
  }());

  // extra module methods
  var moduleMixin = {
    // provide function for firing native events
    fireNativeEvent: function(elements, eventName) {
      $(elements).each(function() {
        var element = this, eventObject;
        if (element.dispatchEvent) {
          eventObject = document.createEvent('HTMLEvents');
          eventObject.initEvent(eventName, true, true);
          element.dispatchEvent(eventObject);
        } else if (document.createEventObject) {
          eventObject = document.createEventObject();
          eventObject.target = element;
          element.fireEvent('on' + eventName, eventObject);
        }
      });
    },
    // bind event handlers for module instance (functions beggining with "on")
    bindHandlers: function() {
      var self = this;
      $.each(self, function(propName, propValue) {
        if (propName.indexOf('on') === 0 && $.isFunction(propValue)) {
          // dont use $.proxy here because it doesn't create unique handler
          self[propName] = function() {
            return propValue.apply(self, arguments);
          };
        }
      });
    }
  };

  // public API
  var api = {
    version: version,
    modules: {},
    getOptions: function() {
      return $.extend({}, commonOptions);
    },
    setOptions: function(moduleName, moduleOptions) {
      if (arguments.length > 1) {
        // set module options
        if (this.modules[moduleName]) {
          $.extend(this.modules[moduleName].prototype.options, moduleOptions);
        }
      } else {
        // set common options
        $.extend(commonOptions, moduleName);
      }
    },
    addModule: function(proto) {
      // add module to list
      var Module = function(options) {
        // save instance to collection
        if (!options.element.data(commonOptions.dataKey)) {
          options.element.data(commonOptions.dataKey, this);
        }
        customInstances.push(this);

        // save options
        this.options = $.extend({}, commonOptions, this.options, getInlineOptions(options.element), options);

        // bind event handlers to instance
        this.bindHandlers();

        // call constructor
        this.init.apply(this, arguments);
      };

      // parse options from HTML attribute
      var getInlineOptions = function(element) {
        var dataOptions = element.data(commonOptions.optionsKey),
          attrOptions = element.attr(commonOptions.optionsKey);

        if (dataOptions) {
          return dataOptions;
        } else if (attrOptions) {
          try {
            return $.parseJSON(attrOptions);
          } catch (e) {
            // ignore invalid attributes
          }
        }
      };

      // set proto as prototype for new module
      Module.prototype = proto;

      // add mixin methods to module proto
      $.extend(proto, moduleMixin);
      if (proto.plugins) {
        $.each(proto.plugins, function(pluginName, plugin) {
          $.extend(plugin.prototype, moduleMixin);
        });
      }

      // override destroy method
      var originalDestroy = Module.prototype.destroy;
      Module.prototype.destroy = function() {
        this.options.element.removeData(this.options.dataKey);

        for (var i = customInstances.length - 1; i >= 0; i--) {
          if (customInstances[i] === this) {
            customInstances.splice(i, 1);
            break;
          }
        }

        if (originalDestroy) {
          originalDestroy.apply(this, arguments);
        }
      };

      // save module to list
      this.modules[proto.name] = Module;
    },
    getInstance: function(element) {
      return $(element).data(commonOptions.dataKey);
    },
    replace: function(elements, moduleName, customOptions) {
      var self = this,
        instance;

      if (!commonOptions.styleSheetCreated) {
        createStyleSheet();
      }

      $(elements).each(function() {
        var moduleOptions,
          element = $(this);

        instance = element.data(commonOptions.dataKey);
        if (instance) {
          instance.refresh();
        } else {
          if (!moduleName) {
            $.each(self.modules, function(currentModuleName, module) {
              if (module.prototype.matchElement.call(module.prototype, element)) {
                moduleName = currentModuleName;
                return false;
              }
            });
          }
          if (moduleName) {
            moduleOptions = $.extend({ element: element }, customOptions);
            instance = new self.modules[moduleName](moduleOptions);
          }
        }
      });
      return instance;
    },
    refresh: function(elements) {
      $(elements).each(function() {
        var instance = $(this).data(commonOptions.dataKey);
        if (instance) {
          instance.refresh();
        }
      });
    },
    destroy: function(elements) {
      $(elements).each(function() {
        var instance = $(this).data(commonOptions.dataKey);
        if (instance) {
          instance.destroy();
        }
      });
    },
    replaceAll: function(context) {
      var self = this;
      $.each(this.modules, function(moduleName, module) {
        $(module.prototype.selector, context).each(function() {
          if (this.className.indexOf('jcf-ignore') < 0) {
            self.replace(this, moduleName);
          }
        });
      });
    },
    refreshAll: function(context) {
      if (context) {
        $.each(this.modules, function(moduleName, module) {
          $(module.prototype.selector, context).each(function() {
            var instance = $(this).data(commonOptions.dataKey);
            if (instance) {
              instance.refresh();
            }
          });
        });
      } else {
        for (var i = customInstances.length - 1; i >= 0; i--) {
          customInstances[i].refresh();
        }
      }
    },
    destroyAll: function(context) {
      if (context) {
        $.each(this.modules, function(moduleName, module) {
          $(module.prototype.selector, context).each(function(index, element) {
            var instance = $(element).data(commonOptions.dataKey);
            if (instance) {
              instance.destroy();
            }
          });
        });
      } else {
        while (customInstances.length) {
          customInstances[0].destroy();
        }
      }
    }
  };

  // always export API to the global window object
  window.jcf = api;

  return api;
})); 

 /*!
 * JavaScript Custom Forms : Select Module
 *
 * Copyright 2014-2015 PSD2HTML - http://psd2html.com/jcf
 * Released under the MIT license (LICENSE.txt)
 *
 * Version: 1.1.3
 */
;(function($, window) {
  'use strict';

  jcf.addModule({
    name: 'Select',
    selector: 'select',
    options: {
      element: null,
      multipleCompactStyle: false
    },
    plugins: {
      ListBox: ListBox,
      ComboBox: ComboBox,
      SelectList: SelectList
    },
    matchElement: function(element) {
      return element.is('select');
    },
    init: function() {
      this.element = $(this.options.element);
      this.createInstance();
    },
    isListBox: function() {
      return this.element.is('[size]:not([jcf-size]), [multiple]');
    },
    createInstance: function() {
      if (this.instance) {
        this.instance.destroy();
      }
      if (this.isListBox() && !this.options.multipleCompactStyle) {
        this.instance = new ListBox(this.options);
      } else {
        this.instance = new ComboBox(this.options);
      }
    },
    refresh: function() {
      var typeMismatch = (this.isListBox() && this.instance instanceof ComboBox) ||
                (!this.isListBox() && this.instance instanceof ListBox);

      if (typeMismatch) {
        this.createInstance();
      } else {
        this.instance.refresh();
      }
    },
    destroy: function() {
      this.instance.destroy();
    }
  });

  // combobox module
  function ComboBox(options) {
    this.options = $.extend({
      wrapNative: true,
      wrapNativeOnMobile: true,
      fakeDropInBody: true,
      useCustomScroll: true,
      flipDropToFit: true,
      maxVisibleItems: 10,
      fakeAreaStructure: '<span class="jcf-select"><span class="jcf-select-text"></span><span class="jcf-select-opener"></span></span>',
      fakeDropStructure: '<div class="jcf-select-drop"><div class="jcf-select-drop-content"></div></div>',
      optionClassPrefix: 'jcf-option-',
      selectClassPrefix: 'jcf-select-',
      dropContentSelector: '.jcf-select-drop-content',
      selectTextSelector: '.jcf-select-text',
      dropActiveClass: 'jcf-drop-active',
      flipDropClass: 'jcf-drop-flipped'
    }, options);
    this.init();
  }
  $.extend(ComboBox.prototype, {
    init: function() {
      this.initStructure();
      this.bindHandlers();
      this.attachEvents();
      this.refresh();
    },
    initStructure: function() {
      // prepare structure
      this.win = $(window);
      this.doc = $(document);
      this.realElement = $(this.options.element);
      this.fakeElement = $(this.options.fakeAreaStructure).insertAfter(this.realElement);
      this.selectTextContainer = this.fakeElement.find(this.options.selectTextSelector);
      this.selectText = $('<span></span>').appendTo(this.selectTextContainer);
      makeUnselectable(this.fakeElement);

      // copy classes from original select
      this.fakeElement.addClass(getPrefixedClasses(this.realElement.prop('className'), this.options.selectClassPrefix));

      // handle compact multiple style
      if (this.realElement.prop('multiple')) {
        this.fakeElement.addClass('jcf-compact-multiple');
      }

      // detect device type and dropdown behavior
      if (this.options.isMobileDevice && this.options.wrapNativeOnMobile && !this.options.wrapNative) {
        this.options.wrapNative = true;
      }

      if (this.options.wrapNative) {
        // wrap native select inside fake block
        this.realElement.prependTo(this.fakeElement).css({
          position: 'absolute',
          height: '100%',
          width: '100%'
        }).addClass(this.options.resetAppearanceClass);
      } else {
        // just hide native select
        this.realElement.addClass(this.options.hiddenClass);
        this.fakeElement.attr('title', this.realElement.attr('title'));
        this.fakeDropTarget = this.options.fakeDropInBody ? $('body') : this.fakeElement;
      }
    },
    attachEvents: function() {
      // delayed refresh handler
      var self = this;
      this.delayedRefresh = function() {
        setTimeout(function() {
          self.refresh();
          if (self.list) {
            self.list.refresh();
            self.list.scrollToActiveOption();
          }
        }, 1);
      };

      // native dropdown event handlers
      if (this.options.wrapNative) {
        this.realElement.on({
          focus: this.onFocus,
          change: this.onChange,
          click: this.onChange,
          keydown: this.onChange
        });
      } else {
        // custom dropdown event handlers
        this.realElement.on({
          focus: this.onFocus,
          change: this.onChange,
          keydown: this.onKeyDown
        });
        this.fakeElement.on({
          'jcf-pointerdown': this.onSelectAreaPress
        });
      }
    },
    onKeyDown: function(e) {
      if (e.which === 13) {
        this.toggleDropdown();
      } else if (this.dropActive) {
        this.delayedRefresh();
      }
    },
    onChange: function() {
      this.refresh();
    },
    onFocus: function() {
      if (!this.pressedFlag || !this.focusedFlag) {
        this.fakeElement.addClass(this.options.focusClass);
        this.realElement.on('blur', this.onBlur);
        this.toggleListMode(true);
        this.focusedFlag = true;
      }
    },
    onBlur: function() {
      if (!this.pressedFlag) {
        this.fakeElement.removeClass(this.options.focusClass);
        this.realElement.off('blur', this.onBlur);
        this.toggleListMode(false);
        this.focusedFlag = false;
      }
    },
    onResize: function() {
      if (this.dropActive) {
        this.hideDropdown();
      }
    },
    onSelectDropPress: function() {
      this.pressedFlag = true;
    },
    onSelectDropRelease: function(e, pointerEvent) {
      this.pressedFlag = false;
      if (pointerEvent.pointerType === 'mouse') {
        this.realElement.focus();
      }
    },
    onSelectAreaPress: function(e) {
      // skip click if drop inside fake element or real select is disabled
      var dropClickedInsideFakeElement = !this.options.fakeDropInBody && $(e.target).closest(this.dropdown).length;
      if (dropClickedInsideFakeElement || e.button > 1 || this.realElement.is(':disabled')) {
        return;
      }

      // toggle dropdown visibility
      this.selectOpenedByEvent = e.pointerType;
      this.toggleDropdown();

      // misc handlers
      if (!this.focusedFlag) {
        if (e.pointerType === 'mouse') {
          this.realElement.focus();
        } else {
          this.onFocus(e);
        }
      }
      this.pressedFlag = true;
      this.fakeElement.addClass(this.options.pressedClass);
      this.doc.on('jcf-pointerup', this.onSelectAreaRelease);
    },
    onSelectAreaRelease: function(e) {
      if (this.focusedFlag && e.pointerType === 'mouse') {
        this.realElement.focus();
      }
      this.pressedFlag = false;
      this.fakeElement.removeClass(this.options.pressedClass);
      this.doc.off('jcf-pointerup', this.onSelectAreaRelease);
    },
    onOutsideClick: function(e) {
      var target = $(e.target),
        clickedInsideSelect = target.closest(this.fakeElement).length || target.closest(this.dropdown).length;

      if (!clickedInsideSelect) {
        this.hideDropdown();
      }
    },
    onSelect: function() {
      this.refresh();

      if (this.realElement.prop('multiple')) {
        this.repositionDropdown();
      } else {
        this.hideDropdown();
      }

      this.fireNativeEvent(this.realElement, 'change');
    },
    toggleListMode: function(state) {
      if (!this.options.wrapNative) {
        if (state) {
          // temporary change select to list to avoid appearing of native dropdown
          this.realElement.attr({
            size: 4,
            'jcf-size': ''
          });
        } else {
          // restore select from list mode to dropdown select
          if (!this.options.wrapNative) {
            this.realElement.removeAttr('size jcf-size');
          }
        }
      }
    },
    createDropdown: function() {
      // destroy previous dropdown if needed
      if (this.dropdown) {
        this.list.destroy();
        this.dropdown.remove();
      }

      // create new drop container
      this.dropdown = $(this.options.fakeDropStructure).appendTo(this.fakeDropTarget);
      this.dropdown.addClass(getPrefixedClasses(this.realElement.prop('className'), this.options.selectClassPrefix));
      makeUnselectable(this.dropdown);

      // handle compact multiple style
      if (this.realElement.prop('multiple')) {
        this.dropdown.addClass('jcf-compact-multiple');
      }

      // set initial styles for dropdown in body
      if (this.options.fakeDropInBody) {
        this.dropdown.css({
          position: 'absolute',
          top: -9999
        });
      }

      // create new select list instance
      this.list = new SelectList({
        useHoverClass: true,
        handleResize: false,
        alwaysPreventMouseWheel: true,
        maxVisibleItems: this.options.maxVisibleItems,
        useCustomScroll: this.options.useCustomScroll,
        holder: this.dropdown.find(this.options.dropContentSelector),
        multipleSelectWithoutKey: this.realElement.prop('multiple'),
        element: this.realElement
      });
      $(this.list).on({
        select: this.onSelect,
        press: this.onSelectDropPress,
        release: this.onSelectDropRelease
      });
    },
    repositionDropdown: function() {
      var selectOffset = this.fakeElement.offset(),
        selectWidth = this.fakeElement.outerWidth(),
        selectHeight = this.fakeElement.outerHeight(),
        dropHeight = this.dropdown.css('width', selectWidth).outerHeight(),
        winScrollTop = this.win.scrollTop(),
        winHeight = this.win.height(),
        calcTop, calcLeft, bodyOffset, needFlipDrop = false;

      // check flip drop position
      if (selectOffset.top + selectHeight + dropHeight > winScrollTop + winHeight && selectOffset.top - dropHeight > winScrollTop) {
        needFlipDrop = true;
      }

      if (this.options.fakeDropInBody) {
        bodyOffset = this.fakeDropTarget.css('position') !== 'static' ? this.fakeDropTarget.offset().top : 0;
        if (this.options.flipDropToFit && needFlipDrop) {
          // calculate flipped dropdown position
          calcLeft = selectOffset.left;
          calcTop = selectOffset.top - dropHeight - bodyOffset;
        } else {
          // calculate default drop position
          calcLeft = selectOffset.left;
          calcTop = selectOffset.top + selectHeight - bodyOffset;
        }

        // update drop styles
        this.dropdown.css({
          width: selectWidth,
          left: calcLeft,
          top: calcTop
        });
      }

      // refresh flipped class
      this.dropdown.add(this.fakeElement).toggleClass(this.options.flipDropClass, this.options.flipDropToFit && needFlipDrop);
    },
    showDropdown: function() {
      // do not show empty custom dropdown
      if (!this.realElement.prop('options').length) {
        return;
      }

      // create options list if not created
      if (!this.dropdown) {
        this.createDropdown();
      }

      // show dropdown
      this.dropActive = true;
      this.dropdown.appendTo(this.fakeDropTarget);
      this.fakeElement.addClass(this.options.dropActiveClass);
      this.refreshSelectedText();
      this.repositionDropdown();
      this.list.setScrollTop(this.savedScrollTop);
      this.list.refresh();

      // add temporary event handlers
      this.win.on('resize', this.onResize);
      this.doc.on('jcf-pointerdown', this.onOutsideClick);
    },
    hideDropdown: function() {
      if (this.dropdown) {
        this.savedScrollTop = this.list.getScrollTop();
        this.fakeElement.removeClass(this.options.dropActiveClass + ' ' + this.options.flipDropClass);
        this.dropdown.removeClass(this.options.flipDropClass).detach();
        this.doc.off('jcf-pointerdown', this.onOutsideClick);
        this.win.off('resize', this.onResize);
        this.dropActive = false;
        if (this.selectOpenedByEvent === 'touch') {
          this.onBlur();
        }
      }
    },
    toggleDropdown: function() {
      if (this.dropActive) {
        this.hideDropdown();
      } else {
        this.showDropdown();
      }
    },
    refreshSelectedText: function() {
      // redraw selected area
      var selectedIndex = this.realElement.prop('selectedIndex'),
        selectedOption = this.realElement.prop('options')[selectedIndex],
        selectedOptionImage = selectedOption ? selectedOption.getAttribute('data-image') : null,
        selectedOptionText = '',
        selectedOptionClasses,
        self = this;

      if (this.realElement.prop('multiple')) {
        $.each(this.realElement.prop('options'), function(index, option) {
          if (option.selected) {
            selectedOptionText += (selectedOptionText ? ', ' : '') + option.innerHTML;
          }
        });
        if (!selectedOptionText) {
          selectedOptionText = self.realElement.attr('placeholder') || '';
        }
        this.selectText.removeAttr('class').html(selectedOptionText);
      } else if (!selectedOption) {
        if (this.selectImage) {
          this.selectImage.hide();
        }
        this.selectText.removeAttr('class').empty();
      } else if (this.currentSelectedText !== selectedOption.innerHTML || this.currentSelectedImage !== selectedOptionImage) {
        selectedOptionClasses = getPrefixedClasses(selectedOption.className, this.options.optionClassPrefix);
        this.selectText.attr('class', selectedOptionClasses).html(selectedOption.innerHTML);

        if (selectedOptionImage) {
          if (!this.selectImage) {
            this.selectImage = $('<img>').prependTo(this.selectTextContainer).hide();
          }
          this.selectImage.attr('src', selectedOptionImage).show();
        } else if (this.selectImage) {
          this.selectImage.hide();
        }

        this.currentSelectedText = selectedOption.innerHTML;
        this.currentSelectedImage = selectedOptionImage;
      }
    },
    refresh: function() {
      // refresh fake select visibility
      if (this.realElement.prop('style').display === 'none') {
        this.fakeElement.hide();
      } else {
        this.fakeElement.show();
      }

      // refresh selected text
      this.refreshSelectedText();

      // handle disabled state
      this.fakeElement.toggleClass(this.options.disabledClass, this.realElement.is(':disabled'));
    },
    destroy: function() {
      // restore structure
      if (this.options.wrapNative) {
        this.realElement.insertBefore(this.fakeElement).css({
          position: '',
          height: '',
          width: ''
        }).removeClass(this.options.resetAppearanceClass);
      } else {
        this.realElement.removeClass(this.options.hiddenClass);
        if (this.realElement.is('[jcf-size]')) {
          this.realElement.removeAttr('size jcf-size');
        }
      }

      // removing element will also remove its event handlers
      this.fakeElement.remove();

      // remove other event handlers
      this.doc.off('jcf-pointerup', this.onSelectAreaRelease);
      this.realElement.off({
        focus: this.onFocus
      });
    }
  });

  // listbox module
  function ListBox(options) {
    this.options = $.extend({
      wrapNative: true,
      useCustomScroll: true,
      fakeStructure: '<span class="jcf-list-box"><span class="jcf-list-wrapper"></span></span>',
      selectClassPrefix: 'jcf-select-',
      listHolder: '.jcf-list-wrapper'
    }, options);
    this.init();
  }
  $.extend(ListBox.prototype, {
    init: function() {
      this.bindHandlers();
      this.initStructure();
      this.attachEvents();
    },
    initStructure: function() {
      this.realElement = $(this.options.element);
      this.fakeElement = $(this.options.fakeStructure).insertAfter(this.realElement);
      this.listHolder = this.fakeElement.find(this.options.listHolder);
      makeUnselectable(this.fakeElement);

      // copy classes from original select
      this.fakeElement.addClass(getPrefixedClasses(this.realElement.prop('className'), this.options.selectClassPrefix));
      this.realElement.addClass(this.options.hiddenClass);

      this.list = new SelectList({
        useCustomScroll: this.options.useCustomScroll,
        holder: this.listHolder,
        selectOnClick: false,
        element: this.realElement
      });
    },
    attachEvents: function() {
      // delayed refresh handler
      var self = this;
      this.delayedRefresh = function(e) {
        if (e && e.which === 16) {
          // ignore SHIFT key
          return;
        } else {
          clearTimeout(self.refreshTimer);
          self.refreshTimer = setTimeout(function() {
            self.refresh();
            self.list.scrollToActiveOption();
          }, 1);
        }
      };

      // other event handlers
      this.realElement.on({
        focus: this.onFocus,
        click: this.delayedRefresh,
        keydown: this.delayedRefresh
      });

      // select list event handlers
      $(this.list).on({
        select: this.onSelect,
        press: this.onFakeOptionsPress,
        release: this.onFakeOptionsRelease
      });
    },
    onFakeOptionsPress: function(e, pointerEvent) {
      this.pressedFlag = true;
      if (pointerEvent.pointerType === 'mouse') {
        this.realElement.focus();
      }
    },
    onFakeOptionsRelease: function(e, pointerEvent) {
      this.pressedFlag = false;
      if (pointerEvent.pointerType === 'mouse') {
        this.realElement.focus();
      }
    },
    onSelect: function() {
      this.fireNativeEvent(this.realElement, 'change');
      this.fireNativeEvent(this.realElement, 'click');
    },
    onFocus: function() {
      if (!this.pressedFlag || !this.focusedFlag) {
        this.fakeElement.addClass(this.options.focusClass);
        this.realElement.on('blur', this.onBlur);
        this.focusedFlag = true;
      }
    },
    onBlur: function() {
      if (!this.pressedFlag) {
        this.fakeElement.removeClass(this.options.focusClass);
        this.realElement.off('blur', this.onBlur);
        this.focusedFlag = false;
      }
    },
    refresh: function() {
      this.fakeElement.toggleClass(this.options.disabledClass, this.realElement.is(':disabled'));
      this.list.refresh();
    },
    destroy: function() {
      this.list.destroy();
      this.realElement.insertBefore(this.fakeElement).removeClass(this.options.hiddenClass);
      this.fakeElement.remove();
    }
  });

  // options list module
  function SelectList(options) {
    this.options = $.extend({
      holder: null,
      maxVisibleItems: 10,
      selectOnClick: true,
      useHoverClass: false,
      useCustomScroll: false,
      handleResize: true,
      multipleSelectWithoutKey: false,
      alwaysPreventMouseWheel: false,
      indexAttribute: 'data-index',
      cloneClassPrefix: 'jcf-option-',
      containerStructure: '<span class="jcf-list"><span class="jcf-list-content"></span></span>',
      containerSelector: '.jcf-list-content',
      captionClass: 'jcf-optgroup-caption',
      disabledClass: 'jcf-disabled',
      optionClass: 'jcf-option',
      groupClass: 'jcf-optgroup',
      hoverClass: 'jcf-hover',
      selectedClass: 'jcf-selected',
      scrollClass: 'jcf-scroll-active'
    }, options);
    this.init();
  }
  $.extend(SelectList.prototype, {
    init: function() {
      this.initStructure();
      this.refreshSelectedClass();
      this.attachEvents();
    },
    initStructure: function() {
      this.element = $(this.options.element);
      this.indexSelector = '[' + this.options.indexAttribute + ']';
      this.container = $(this.options.containerStructure).appendTo(this.options.holder);
      this.listHolder = this.container.find(this.options.containerSelector);
      this.lastClickedIndex = this.element.prop('selectedIndex');
      this.rebuildList();
    },
    attachEvents: function() {
      this.bindHandlers();
      this.listHolder.on('jcf-pointerdown', this.indexSelector, this.onItemPress);
      this.listHolder.on('jcf-pointerdown', this.onPress);

      if (this.options.useHoverClass) {
        this.listHolder.on('jcf-pointerover', this.indexSelector, this.onHoverItem);
      }
    },
    onPress: function(e) {
      $(this).trigger('press', e);
      this.listHolder.on('jcf-pointerup', this.onRelease);
    },
    onRelease: function(e) {
      $(this).trigger('release', e);
      this.listHolder.off('jcf-pointerup', this.onRelease);
    },
    onHoverItem: function(e) {
      var hoverIndex = parseFloat(e.currentTarget.getAttribute(this.options.indexAttribute));
      this.fakeOptions.removeClass(this.options.hoverClass).eq(hoverIndex).addClass(this.options.hoverClass);
    },
    onItemPress: function(e) {
      if (e.pointerType === 'touch' || this.options.selectOnClick) {
        // select option after "click"
        this.tmpListOffsetTop = this.list.offset().top;
        this.listHolder.on('jcf-pointerup', this.indexSelector, this.onItemRelease);
      } else {
        // select option immediately
        this.onSelectItem(e);
      }
    },
    onItemRelease: function(e) {
      // remove event handlers and temporary data
      this.listHolder.off('jcf-pointerup', this.indexSelector, this.onItemRelease);

      // simulate item selection
      if (this.tmpListOffsetTop === this.list.offset().top) {
        this.listHolder.on('click', this.indexSelector, { savedPointerType: e.pointerType }, this.onSelectItem);
      }
      delete this.tmpListOffsetTop;
    },
    onSelectItem: function(e) {
      var clickedIndex = parseFloat(e.currentTarget.getAttribute(this.options.indexAttribute)),
        pointerType = e.data && e.data.savedPointerType || e.pointerType || 'mouse',
        range;

      // remove click event handler
      this.listHolder.off('click', this.indexSelector, this.onSelectItem);

      // ignore clicks on disabled options
      if (e.button > 1 || this.realOptions[clickedIndex].disabled) {
        return;
      }

      if (this.element.prop('multiple')) {
        if (e.metaKey || e.ctrlKey || pointerType === 'touch' || this.options.multipleSelectWithoutKey) {
          // if CTRL/CMD pressed or touch devices - toggle selected option
          this.realOptions[clickedIndex].selected = !this.realOptions[clickedIndex].selected;
        } else if (e.shiftKey) {
          // if SHIFT pressed - update selection
          range = [this.lastClickedIndex, clickedIndex].sort(function(a, b) {
            return a - b;
          });
          this.realOptions.each(function(index, option) {
            option.selected = (index >= range[0] && index <= range[1]);
          });
        } else {
          // set single selected index
          this.element.prop('selectedIndex', clickedIndex);
        }
      } else {
        this.element.prop('selectedIndex', clickedIndex);
      }

      // save last clicked option
      if (!e.shiftKey) {
        this.lastClickedIndex = clickedIndex;
      }

      // refresh classes
      this.refreshSelectedClass();

      // scroll to active item in desktop browsers
      if (pointerType === 'mouse') {
        this.scrollToActiveOption();
      }

      // make callback when item selected
      $(this).trigger('select');
    },
    rebuildList: function() {
      // rebuild options
      var self = this,
        rootElement = this.element[0];

      // recursively create fake options
      this.storedSelectHTML = rootElement.innerHTML;
      this.optionIndex = 0;
      this.list = $(this.createOptionsList(rootElement));
      this.listHolder.empty().append(this.list);
      this.realOptions = this.element.find('option');
      this.fakeOptions = this.list.find(this.indexSelector);
      this.fakeListItems = this.list.find('.' + this.options.captionClass + ',' + this.indexSelector);
      delete this.optionIndex;

      // detect max visible items
      var maxCount = this.options.maxVisibleItems,
        sizeValue = this.element.prop('size');
      if (sizeValue > 1 && !this.element.is('[jcf-size]')) {
        maxCount = sizeValue;
      }

      // handle scrollbar
      var needScrollBar = this.fakeOptions.length > maxCount;
      this.container.toggleClass(this.options.scrollClass, needScrollBar);
      if (needScrollBar) {
        // change max-height
        this.listHolder.css({
          maxHeight: this.getOverflowHeight(maxCount),
          overflow: 'auto'
        });

        if (this.options.useCustomScroll && jcf.modules.Scrollable) {
          // add custom scrollbar if specified in options
          jcf.replace(this.listHolder, 'Scrollable', {
            handleResize: this.options.handleResize,
            alwaysPreventMouseWheel: this.options.alwaysPreventMouseWheel
          });
          return;
        }
      }

      // disable edge wheel scrolling
      if (this.options.alwaysPreventMouseWheel) {
        this.preventWheelHandler = function(e) {
          var currentScrollTop = self.listHolder.scrollTop(),
            maxScrollTop = self.listHolder.prop('scrollHeight') - self.listHolder.innerHeight();

          // check edge cases
          if ((currentScrollTop <= 0 && e.deltaY < 0) || (currentScrollTop >= maxScrollTop && e.deltaY > 0)) {
            e.preventDefault();
          }
        };
        this.listHolder.on('jcf-mousewheel', this.preventWheelHandler);
      }
    },
    refreshSelectedClass: function() {
      var self = this,
        selectedItem,
        isMultiple = this.element.prop('multiple'),
        selectedIndex = this.element.prop('selectedIndex');

      if (isMultiple) {
        this.realOptions.each(function(index, option) {
          self.fakeOptions.eq(index).toggleClass(self.options.selectedClass, !!option.selected);
        });
      } else {
        this.fakeOptions.removeClass(this.options.selectedClass + ' ' + this.options.hoverClass);
        selectedItem = this.fakeOptions.eq(selectedIndex).addClass(this.options.selectedClass);
        if (this.options.useHoverClass) {
          selectedItem.addClass(this.options.hoverClass);
        }
      }
    },
    scrollToActiveOption: function() {
      // scroll to target option
      var targetOffset = this.getActiveOptionOffset();
      if (typeof targetOffset === 'number') {
        this.listHolder.prop('scrollTop', targetOffset);
      }
    },
    getSelectedIndexRange: function() {
      var firstSelected = -1, lastSelected = -1;
      this.realOptions.each(function(index, option) {
        if (option.selected) {
          if (firstSelected < 0) {
            firstSelected = index;
          }
          lastSelected = index;
        }
      });
      return [firstSelected, lastSelected];
    },
    getChangedSelectedIndex: function() {
      var selectedIndex = this.element.prop('selectedIndex'),
        targetIndex;

      if (this.element.prop('multiple')) {
        // multiple selects handling
        if (!this.previousRange) {
          this.previousRange = [selectedIndex, selectedIndex];
        }
        this.currentRange = this.getSelectedIndexRange();
        targetIndex = this.currentRange[this.currentRange[0] !== this.previousRange[0] ? 0 : 1];
        this.previousRange = this.currentRange;
        return targetIndex;
      } else {
        // single choice selects handling
        return selectedIndex;
      }
    },
    getActiveOptionOffset: function() {
      // calc values
      var dropHeight = this.listHolder.height(),
        dropScrollTop = this.listHolder.prop('scrollTop'),
        currentIndex = this.getChangedSelectedIndex(),
        fakeOption = this.fakeOptions.eq(currentIndex),
        fakeOptionOffset = fakeOption.offset().top - this.list.offset().top,
        fakeOptionHeight = fakeOption.innerHeight();

      // scroll list
      if (fakeOptionOffset + fakeOptionHeight >= dropScrollTop + dropHeight) {
        // scroll down (always scroll to option)
        return fakeOptionOffset - dropHeight + fakeOptionHeight;
      } else if (fakeOptionOffset < dropScrollTop) {
        // scroll up to option
        return fakeOptionOffset;
      }
    },
    getOverflowHeight: function(sizeValue) {
      var item = this.fakeListItems.eq(sizeValue - 1),
        listOffset = this.list.offset().top,
        itemOffset = item.offset().top,
        itemHeight = item.innerHeight();

      return itemOffset + itemHeight - listOffset;
    },
    getScrollTop: function() {
      return this.listHolder.scrollTop();
    },
    setScrollTop: function(value) {
      this.listHolder.scrollTop(value);
    },
    createOption: function(option) {
      var newOption = document.createElement('span');
      newOption.className = this.options.optionClass;
      newOption.innerHTML = option.innerHTML;
      newOption.setAttribute(this.options.indexAttribute, this.optionIndex++);

      var optionImage, optionImageSrc = option.getAttribute('data-image');
      if (optionImageSrc) {
        optionImage = document.createElement('img');
        optionImage.src = optionImageSrc;
        newOption.insertBefore(optionImage, newOption.childNodes[0]);
      }
      if (option.disabled) {
        newOption.className += ' ' + this.options.disabledClass;
      }
      if (option.className) {
        newOption.className += ' ' + getPrefixedClasses(option.className, this.options.cloneClassPrefix);
      }
      return newOption;
    },
    createOptGroup: function(optgroup) {
      var optGroupContainer = document.createElement('span'),
        optGroupName = optgroup.getAttribute('label'),
        optGroupCaption, optGroupList;

      // create caption
      optGroupCaption = document.createElement('span');
      optGroupCaption.className = this.options.captionClass;
      optGroupCaption.innerHTML = optGroupName;
      optGroupContainer.appendChild(optGroupCaption);

      // create list of options
      if (optgroup.children.length) {
        optGroupList = this.createOptionsList(optgroup);
        optGroupContainer.appendChild(optGroupList);
      }

      optGroupContainer.className = this.options.groupClass;
      return optGroupContainer;
    },
    createOptionContainer: function() {
      var optionContainer = document.createElement('li');
      return optionContainer;
    },
    createOptionsList: function(container) {
      var self = this,
        list = document.createElement('ul');

      $.each(container.children, function(index, currentNode) {
        var item = self.createOptionContainer(currentNode),
          newNode;

        switch (currentNode.tagName.toLowerCase()) {
          case 'option': newNode = self.createOption(currentNode); break;
          case 'optgroup': newNode = self.createOptGroup(currentNode); break;
        }
        list.appendChild(item).appendChild(newNode);
      });
      return list;
    },
    refresh: function() {
      // check for select innerHTML changes
      if (this.storedSelectHTML !== this.element.prop('innerHTML')) {
        this.rebuildList();
      }

      // refresh custom scrollbar
      var scrollInstance = jcf.getInstance(this.listHolder);
      if (scrollInstance) {
        scrollInstance.refresh();
      }

      // refresh selectes classes
      this.refreshSelectedClass();
    },
    destroy: function() {
      this.listHolder.off('jcf-mousewheel', this.preventWheelHandler);
      this.listHolder.off('jcf-pointerdown', this.indexSelector, this.onSelectItem);
      this.listHolder.off('jcf-pointerover', this.indexSelector, this.onHoverItem);
      this.listHolder.off('jcf-pointerdown', this.onPress);
    }
  });

  // helper functions
  var getPrefixedClasses = function(className, prefixToAdd) {
    return className ? className.replace(/[\s]*([\S]+)+[\s]*/gi, prefixToAdd + '$1 ') : '';
  };
  var makeUnselectable = (function() {
    var unselectableClass = jcf.getOptions().unselectableClass;
    function preventHandler(e) {
      e.preventDefault();
    }
    return function(node) {
      node.addClass(unselectableClass).on('selectstart', preventHandler);
    };
  }());

}(jQuery, this));
 

 /*!
 * JavaScript Custom Forms : File Module
 *
 * Copyright 2014-2015 PSD2HTML - http://psd2html.com/jcf
 * Released under the MIT license (LICENSE.txt)
 *
 * Version: 1.1.3
 */
;(function($) {
  'use strict';

  jcf.addModule({
    name: 'File',
    selector: 'input[type="file"]:not(.ignore_custom)',
    options: {
      fakeStructure: '<span class="jcf-file"><span class="jcf-fake-input"></span><span class="jcf-upload-button"><span class="jcf-button-content"></span></span></span>',
      buttonText: 'Choose file',
      placeholderText: 'No file chosen',
      realElementClass: 'jcf-real-element',
      extensionPrefixClass: 'jcf-extension-',
      selectedFileBlock: '.jcf-fake-input',
      buttonTextBlock: '.jcf-button-content'
    },
    matchElement: function(element) {
      return element.is('input[type="file"]');
    },
    init: function() {
      this.initStructure();
      this.attachEvents();
      this.refresh();
    },
    initStructure: function() {
      this.doc = $(document);
      this.realElement = $(this.options.element).addClass(this.options.realElementClass);
      this.fakeElement = $(this.options.fakeStructure).insertBefore(this.realElement);
      this.fileNameBlock = this.fakeElement.find(this.options.selectedFileBlock);
      this.buttonTextBlock = this.fakeElement.find(this.options.buttonTextBlock).text(this.options.buttonText);

      this.realElement.appendTo(this.fakeElement).css({
        position: 'absolute',
        opacity: 0
      });
    },
    attachEvents: function() {
      this.realElement.on({
        'jcf-pointerdown': this.onPress,
        change: this.onChange,
        focus: this.onFocus
      });
    },
    onChange: function() {
      this.refresh();
    },
    onFocus: function() {
      this.fakeElement.addClass(this.options.focusClass);
      this.realElement.on('blur', this.onBlur);
    },
    onBlur: function() {
      this.fakeElement.removeClass(this.options.focusClass);
      this.realElement.off('blur', this.onBlur);
    },
    onPress: function() {
      this.fakeElement.addClass(this.options.pressedClass);
      this.doc.on('jcf-pointerup', this.onRelease);
    },
    onRelease: function() {
      this.fakeElement.removeClass(this.options.pressedClass);
      this.doc.off('jcf-pointerup', this.onRelease);
    },
    getFileName: function() {
      var resultFileName = '',
        files = this.realElement.prop('files');

      if (files && files.length) {
        $.each(files, function(index, file) {
          resultFileName += (index > 0 ? ', ' : '') + file.name;
        });
      } else {
        resultFileName = this.realElement.val().replace(/^[\s\S]*(?:\\|\/)([\s\S^\\\/]*)$/g, '$1');
      }

      return resultFileName;
    },
    getFileExtension: function() {
      var fileName = this.realElement.val();
      return fileName.lastIndexOf('.') < 0 ? '' : fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase();
    },
    updateExtensionClass: function() {
      var currentExtension = this.getFileExtension(),
        currentClassList = this.fakeElement.prop('className'),
        cleanedClassList = currentClassList.replace(new RegExp('(\\s|^)' + this.options.extensionPrefixClass + '[^ ]+','gi'), '');

      this.fakeElement.prop('className', cleanedClassList);
      if (currentExtension) {
        this.fakeElement.addClass(this.options.extensionPrefixClass + currentExtension);
      }
    },
    refresh: function() {
      var selectedFileName = this.getFileName() || this.options.placeholderText;
      this.fakeElement.toggleClass(this.options.disabledClass, this.realElement.is(':disabled'));
      this.fileNameBlock.text(selectedFileName);
      this.updateExtensionClass();
    },
    destroy: function() {
      // reset styles and restore element position
      this.realElement.insertBefore(this.fakeElement).removeClass(this.options.realElementClass).css({
        position: '',
        opacity: ''
      });
      this.fakeElement.remove();

      // remove event handlers
      this.realElement.off({
        'jcf-pointerdown': this.onPress,
        change: this.onChange,
        focus: this.onFocus,
        blur: this.onBlur
      });
      this.doc.off('jcf-pointerup', this.onRelease);
    }
  });

}(jQuery));

//keyboard focus js
!function(a){function b(b,d,e){e=e.replace(/\./g,"");var f;b.on("mousedown.keyboardFocus",d,function(b){a(b.target).removeClass(e)}),b.on("focus.keyboardFocus",d,function(b){c&&(f=a(b.target),f.addClass(e),f.trigger("keyboardFocus"))}),b.on("blur.keyboardFocus",d,function(b){f=a(b.target),f.removeClass(e),c&&f.trigger("keyboardBlur")})}var c=!0;a(document).on("keydown.keyboardFocusGlobal",function(a){c=!0}),a(document).on("mousedown.keyboardFocusGlobal",function(a){c=!1}),a.keyboardFocus=function(c){if(!c)throw new Error("Please pass a mapping of selectors to focus class names to `keyboardFocus`.");for(var d in c)c.hasOwnProperty(d)&&b(a(document),d,c[d])},a.offKeyboardFocus=function(){a(document).off(".keyboardFocus")},a.fn.keyboardFocus=function(a){if(!a)throw new Error("Please pass your focus class names into `$(...).keyboardFocus(...)`.");return b(this,null,a),this},a.fn.offKeyboardFocus=function(){this.off(".keyboardFocus")}}(jQuery);

/*! Picturefill - v3.0.1 - 2015-09-30
 * http://scottjehl.github.io/picturefill
 * Copyright (c) 2015 https://github.com/scottjehl/picturefill/blob/master/Authors.txt; Licensed MIT
 */
!function(a){var b=navigator.userAgent;a.HTMLPictureElement&&/ecko/.test(b)&&b.match(/rv\:(\d+)/)&&RegExp.$1<41&&addEventListener("resize",function(){var b,c=document.createElement("source"),d=function(a){var b,d,e=a.parentNode;"PICTURE"===e.nodeName.toUpperCase()?(b=c.cloneNode(),e.insertBefore(b,e.firstElementChild),setTimeout(function(){e.removeChild(b)})):(!a._pfLastSize||a.offsetWidth>a._pfLastSize)&&(a._pfLastSize=a.offsetWidth,d=a.sizes,a.sizes+=",100vw",setTimeout(function(){a.sizes=d}))},e=function(){var a,b=document.querySelectorAll("picture > img, img[srcset][sizes]");for(a=0;a<b.length;a++)d(b[a])},f=function(){clearTimeout(b),b=setTimeout(e,99)},g=a.matchMedia&&matchMedia("(orientation: landscape)"),h=function(){f(),g&&g.addListener&&g.addListener(f)};return c.srcset="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==",/^[c|i]|d$/.test(document.readyState||"")?h():document.addEventListener("DOMContentLoaded",h),f}())}(window),function(a,b,c){"use strict";function d(a){return" "===a||"  "===a||"\n"===a||"\f"===a||"\r"===a}function e(b,c){var d=new a.Image;return d.onerror=function(){z[b]=!1,aa()},d.onload=function(){z[b]=1===d.width,aa()},d.src=c,"pending"}function f(){L=!1,O=a.devicePixelRatio,M={},N={},s.DPR=O||1,P.width=Math.max(a.innerWidth||0,y.clientWidth),P.height=Math.max(a.innerHeight||0,y.clientHeight),P.vw=P.width/100,P.vh=P.height/100,r=[P.height,P.width,O].join("-"),P.em=s.getEmValue(),P.rem=P.em}function g(a,b,c,d){var e,f,g,h;return"saveData"===A.algorithm?a>2.7?h=c+1:(f=b-c,e=Math.pow(a-.6,1.5),g=f*e,d&&(g+=.1*e),h=a+g):h=c>1?Math.sqrt(a*b):a,h>c}function h(a){var b,c=s.getSet(a),d=!1;"pending"!==c&&(d=r,c&&(b=s.setRes(c),s.applySetCandidate(b,a))),a[s.ns].evaled=d}function i(a,b){return a.res-b.res}function j(a,b,c){var d;return!c&&b&&(c=a[s.ns].sets,c=c&&c[c.length-1]),d=k(b,c),d&&(b=s.makeUrl(b),a[s.ns].curSrc=b,a[s.ns].curCan=d,d.res||_(d,d.set.sizes)),d}function k(a,b){var c,d,e;if(a&&b)for(e=s.parseSet(b),a=s.makeUrl(a),c=0;c<e.length;c++)if(a===s.makeUrl(e[c].url)){d=e[c];break}return d}function l(a,b){var c,d,e,f,g=a.getElementsByTagName("source");for(c=0,d=g.length;d>c;c++)e=g[c],e[s.ns]=!0,f=e.getAttribute("srcset"),f&&b.push({srcset:f,media:e.getAttribute("media"),type:e.getAttribute("type"),sizes:e.getAttribute("sizes")})}function m(a,b){function c(b){var c,d=b.exec(a.substring(m));return d?(c=d[0],m+=c.length,c):void 0}function e(){var a,c,d,e,f,i,j,k,l,m=!1,o={};for(e=0;e<h.length;e++)f=h[e],i=f[f.length-1],j=f.substring(0,f.length-1),k=parseInt(j,10),l=parseFloat(j),W.test(j)&&"w"===i?((a||c)&&(m=!0),0===k?m=!0:a=k):X.test(j)&&"x"===i?((a||c||d)&&(m=!0),0>l?m=!0:c=l):W.test(j)&&"h"===i?((d||c)&&(m=!0),0===k?m=!0:d=k):m=!0;m||(o.url=g,a&&(o.w=a),c&&(o.d=c),d&&(o.h=d),d||c||a||(o.d=1),1===o.d&&(b.has1x=!0),o.set=b,n.push(o))}function f(){for(c(S),i="",j="in descriptor";;){if(k=a.charAt(m),"in descriptor"===j)if(d(k))i&&(h.push(i),i="",j="after descriptor");else{if(","===k)return m+=1,i&&h.push(i),void e();if("("===k)i+=k,j="in parens";else{if(""===k)return i&&h.push(i),void e();i+=k}}else if("in parens"===j)if(")"===k)i+=k,j="in descriptor";else{if(""===k)return h.push(i),void e();i+=k}else if("after descriptor"===j)if(d(k));else{if(""===k)return void e();j="in descriptor",m-=1}m+=1}}for(var g,h,i,j,k,l=a.length,m=0,n=[];;){if(c(T),m>=l)return n;g=c(U),h=[],","===g.slice(-1)?(g=g.replace(V,""),e()):f()}}function n(a){function b(a){function b(){f&&(g.push(f),f="")}function c(){g[0]&&(h.push(g),g=[])}for(var e,f="",g=[],h=[],i=0,j=0,k=!1;;){if(e=a.charAt(j),""===e)return b(),c(),h;if(k){if("*"===e&&"/"===a[j+1]){k=!1,j+=2,b();continue}j+=1}else{if(d(e)){if(a.charAt(j-1)&&d(a.charAt(j-1))||!f){j+=1;continue}if(0===i){b(),j+=1;continue}e=" "}else if("("===e)i+=1;else if(")"===e)i-=1;else{if(","===e){b(),c(),j+=1;continue}if("/"===e&&"*"===a.charAt(j+1)){k=!0,j+=2;continue}}f+=e,j+=1}}}function c(a){return k.test(a)&&parseFloat(a)>=0?!0:l.test(a)?!0:"0"===a||"-0"===a||"+0"===a?!0:!1}var e,f,g,h,i,j,k=/^(?:[+-]?[0-9]+|[0-9]*\.[0-9]+)(?:[eE][+-]?[0-9]+)?(?:ch|cm|em|ex|in|mm|pc|pt|px|rem|vh|vmin|vmax|vw)$/i,l=/^calc\((?:[0-9a-z \.\+\-\*\/\(\)]+)\)$/i;for(f=b(a),g=f.length,e=0;g>e;e++)if(h=f[e],i=h[h.length-1],c(i)){if(j=i,h.pop(),0===h.length)return j;if(h=h.join(" "),s.matchesMedia(h))return j}return"100vw"}b.createElement("picture");var o,p,q,r,s={},t=function(){},u=b.createElement("img"),v=u.getAttribute,w=u.setAttribute,x=u.removeAttribute,y=b.documentElement,z={},A={algorithm:""},B="data-pfsrc",C=B+"set",D=navigator.userAgent,E=/rident/.test(D)||/ecko/.test(D)&&D.match(/rv\:(\d+)/)&&RegExp.$1>35,F="currentSrc",G=/\s+\+?\d+(e\d+)?w/,H=/(\([^)]+\))?\s*(.+)/,I=a.picturefillCFG,J="position:absolute;left:0;visibility:hidden;display:block;padding:0;border:none;font-size:1em;width:1em;overflow:hidden;clip:rect(0px, 0px, 0px, 0px)",K="font-size:100%!important;",L=!0,M={},N={},O=a.devicePixelRatio,P={px:1,"in":96},Q=b.createElement("a"),R=!1,S=/^[ \t\n\r\u000c]+/,T=/^[, \t\n\r\u000c]+/,U=/^[^ \t\n\r\u000c]+/,V=/[,]+$/,W=/^\d+$/,X=/^-?(?:[0-9]+|[0-9]*\.[0-9]+)(?:[eE][+-]?[0-9]+)?$/,Y=function(a,b,c,d){a.addEventListener?a.addEventListener(b,c,d||!1):a.attachEvent&&a.attachEvent("on"+b,c)},Z=function(a){var b={};return function(c){return c in b||(b[c]=a(c)),b[c]}},$=function(){var a=/^([\d\.]+)(em|vw|px)$/,b=function(){for(var a=arguments,b=0,c=a[0];++b in a;)c=c.replace(a[b],a[++b]);return c},c=Z(function(a){return"return "+b((a||"").toLowerCase(),/\band\b/g,"&&",/,/g,"||",/min-([a-z-\s]+):/g,"e.$1>=",/max-([a-z-\s]+):/g,"e.$1<=",/calc([^)]+)/g,"($1)",/(\d+[\.]*[\d]*)([a-z]+)/g,"($1 * e.$2)",/^(?!(e.[a-z]|[0-9\.&=|><\+\-\*\(\)\/])).*/gi,"")+";"});return function(b,d){var e;if(!(b in M))if(M[b]=!1,d&&(e=b.match(a)))M[b]=e[1]*P[e[2]];else try{M[b]=new Function("e",c(b))(P)}catch(f){}return M[b]}}(),_=function(a,b){return a.w?(a.cWidth=s.calcListLength(b||"100vw"),a.res=a.w/a.cWidth):a.res=a.d,a},aa=function(a){var c,d,e,f=a||{};if(f.elements&&1===f.elements.nodeType&&("IMG"===f.elements.nodeName.toUpperCase()?f.elements=[f.elements]:(f.context=f.elements,f.elements=null)),c=f.elements||s.qsa(f.context||b,f.reevaluate||f.reselect?s.sel:s.selShort),e=c.length){for(s.setupRun(f),R=!0,d=0;e>d;d++)s.fillImg(c[d],f);s.teardownRun(f)}};o=a.console&&console.warn?function(a){console.warn(a)}:t,F in u||(F="src"),z["image/jpeg"]=!0,z["image/gif"]=!0,z["image/png"]=!0,z["image/svg+xml"]=b.implementation.hasFeature("http://wwwindow.w3.org/TR/SVG11/feature#Image","1.1"),s.ns=("pf"+(new Date).getTime()).substr(0,9),s.supSrcset="srcset"in u,s.supSizes="sizes"in u,s.supPicture=!!a.HTMLPictureElement,s.supSrcset&&s.supPicture&&!s.supSizes&&!function(a){u.srcset="data:,a",a.src="data:,a",s.supSrcset=u.complete===a.complete,s.supPicture=s.supSrcset&&s.supPicture}(b.createElement("img")),s.selShort="picture>img,img[srcset]",s.sel=s.selShort,s.cfg=A,s.supSrcset&&(s.sel+=",img["+C+"]"),s.DPR=O||1,s.u=P,s.types=z,q=s.supSrcset&&!s.supSizes,s.setSize=t,s.makeUrl=Z(function(a){return Q.href=a,Q.href}),s.qsa=function(a,b){return a.querySelectorAll(b)},s.matchesMedia=function(){return a.matchMedia&&(matchMedia("(min-width: 0.1em)")||{}).matches?s.matchesMedia=function(a){return!a||matchMedia(a).matches}:s.matchesMedia=s.mMQ,s.matchesMedia.apply(this,arguments)},s.mMQ=function(a){return a?$(a):!0},s.calcLength=function(a){var b=$(a,!0)||!1;return 0>b&&(b=!1),b},s.supportsType=function(a){return a?z[a]:!0},s.parseSize=Z(function(a){var b=(a||"").match(H);return{media:b&&b[1],length:b&&b[2]}}),s.parseSet=function(a){return a.cands||(a.cands=m(a.srcset,a)),a.cands},s.getEmValue=function(){var a;if(!p&&(a=b.body)){var c=b.createElement("div"),d=y.style.cssText,e=a.style.cssText;c.style.cssText=J,y.style.cssText=K,a.style.cssText=K,a.appendChild(c),p=c.offsetWidth,a.removeChild(c),p=parseFloat(p,10),y.style.cssText=d,a.style.cssText=e}return p||16},s.calcListLength=function(a){if(!(a in N)||A.uT){var b=s.calcLength(n(a));N[a]=b?b:P.width}return N[a]},s.setRes=function(a){var b;if(a){b=s.parseSet(a);for(var c=0,d=b.length;d>c;c++)_(b[c],a.sizes)}return b},s.setRes.res=_,s.applySetCandidate=function(a,b){if(a.length){var c,d,e,f,h,k,l,m,n,o=b[s.ns],p=s.DPR;if(k=o.curSrc||b[F],l=o.curCan||j(b,k,a[0].set),l&&l.set===a[0].set&&(n=E&&!b.complete&&l.res-.1>p,n||(l.cached=!0,l.res>=p&&(h=l))),!h)for(a.sort(i),f=a.length,h=a[f-1],d=0;f>d;d++)if(c=a[d],c.res>=p){e=d-1,h=a[e]&&(n||k!==s.makeUrl(c.url))&&g(a[e].res,c.res,p,a[e].cached)?a[e]:c;break}h&&(m=s.makeUrl(h.url),o.curSrc=m,o.curCan=h,m!==k&&s.setSrc(b,h),s.setSize(b))}},s.setSrc=function(a,b){var c;a.src=b.url,"image/svg+xml"===b.set.type&&(c=a.style.width,a.style.width=a.offsetWidth+1+"px",a.offsetWidth+1&&(a.style.width=c))},s.getSet=function(a){var b,c,d,e=!1,f=a[s.ns].sets;for(b=0;b<f.length&&!e;b++)if(c=f[b],c.srcset&&s.matchesMedia(c.media)&&(d=s.supportsType(c.type))){"pending"===d&&(c=d),e=c;break}return e},s.parseSets=function(a,b,d){var e,f,g,h,i=b&&"PICTURE"===b.nodeName.toUpperCase(),j=a[s.ns];(j.src===c||d.src)&&(j.src=v.call(a,"src"),j.src?w.call(a,B,j.src):x.call(a,B)),(j.srcset===c||d.srcset||!s.supSrcset||a.srcset)&&(e=v.call(a,"srcset"),j.srcset=e,h=!0),j.sets=[],i&&(j.pic=!0,l(b,j.sets)),j.srcset?(f={srcset:j.srcset,sizes:v.call(a,"sizes")},j.sets.push(f),g=(q||j.src)&&G.test(j.srcset||""),g||!j.src||k(j.src,f)||f.has1x||(f.srcset+=", "+j.src,f.cands.push({url:j.src,d:1,set:f}))):j.src&&j.sets.push({srcset:j.src,sizes:null}),j.curCan=null,j.curSrc=c,j.supported=!(i||f&&!s.supSrcset||g),h&&s.supSrcset&&!j.supported&&(e?(w.call(a,C,e),a.srcset=""):x.call(a,C)),j.supported&&!j.srcset&&(!j.src&&a.src||a.src!==s.makeUrl(j.src))&&(null===j.src?a.removeAttribute("src"):a.src=j.src),j.parsed=!0},s.fillImg=function(a,b){var c,d=b.reselect||b.reevaluate;a[s.ns]||(a[s.ns]={}),c=a[s.ns],(d||c.evaled!==r)&&((!c.parsed||b.reevaluate)&&s.parseSets(a,a.parentNode,b),c.supported?c.evaled=r:h(a))},s.setupRun=function(){(!R||L||O!==a.devicePixelRatio)&&f()},s.supPicture?(aa=t,s.fillImg=t):!function(){var c,d=a.attachEvent?/d$|^c/:/d$|^c|^i/,e=function(){var a=b.readyState||"";f=setTimeout(e,"loading"===a?200:999),b.body&&(s.fillImgs(),c=c||d.test(a),c&&clearTimeout(f))},f=setTimeout(e,b.body?9:99),g=function(a,b){var c,d,e=function(){var f=new Date-d;b>f?c=setTimeout(e,b-f):(c=null,a())};return function(){d=new Date,c||(c=setTimeout(e,b))}},h=y.clientHeight,i=function(){L=Math.max(a.innerWidth||0,y.clientWidth)!==P.width||y.clientHeight!==h,h=y.clientHeight,L&&s.fillImgs()};Y(a,"resize",g(i,99)),Y(b,"readystatechange",e)}(),s.picturefill=aa,s.fillImgs=aa,s.teardownRun=t,aa._=s,a.picturefillCFG={pf:s,push:function(a){var b=a.shift();"function"==typeof s[b]?s[b].apply(s,a):(A[b]=a[0],R&&s.fillImgs({reselect:!0}))}};for(;I&&I.length;)a.picturefillCFG.push(I.shift());a.picturefill=aa,"object"==typeof module&&"object"==typeof module.exports?module.exports=aa:"function"==typeof define&&define.amd&&define("picturefill",function(){return aa}),s.supPicture||(z["image/webp"]=e("image/webp","data:image/webp;base64,UklGRkoAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAwAAAABBxAR/Q9ERP8DAABWUDggGAAAADABAJ0BKgEAAQADADQlpAADcAD++/1QAA=="))}(window,document);

/*
 * Responsive Layout helper
 */
window.ResponsiveHelper = (function($){
  // init variables
  var handlers = [],
    prevWinWidth,
    win = $(window),
    nativeMatchMedia = false;

  // detect match media support
  if(window.matchMedia) {
    if(window.Window && window.matchMedia === Window.prototype.matchMedia) {
      nativeMatchMedia = true;
    } else if(window.matchMedia.toString().indexOf('native') > -1) {
      nativeMatchMedia = true;
    }
  }

  // prepare resize handler
  function resizeHandler() {
    var winWidth = win.width();
    if(winWidth !== prevWinWidth) {
      prevWinWidth = winWidth;

      // loop through range groups
      $.each(handlers, function(index, rangeObject){
        // disable current active area if needed
        $.each(rangeObject.data, function(property, item) {
          if(item.currentActive && !matchRange(item.range[0], item.range[1])) {
            item.currentActive = false;
            if(typeof item.disableCallback === 'function') {
              item.disableCallback();
            }
          }
        });

        // enable areas that match current width
        $.each(rangeObject.data, function(property, item) {
          if(!item.currentActive && matchRange(item.range[0], item.range[1])) {
            // make callback
            item.currentActive = true;
            if(typeof item.enableCallback === 'function') {
              item.enableCallback();
            }
          }
        });
      });
    }
  }
  win.bind('load resize orientationchange', resizeHandler);

  // test range
  function matchRange(r1, r2) {
    var mediaQueryString = '';
    if(r1 > 0) {
      mediaQueryString += '(min-width: ' + r1 + 'px)';
    }
    if(r2 < Infinity) {
      mediaQueryString += (mediaQueryString ? ' and ' : '') + '(max-width: ' + r2 + 'px)';
    }
    return matchQuery(mediaQueryString, r1, r2);
  }

  // media query function
  function matchQuery(query, r1, r2) {
    if(window.matchMedia && nativeMatchMedia) {
      return matchMedia(query).matches;
    } else if(window.styleMedia) {
      return styleMedia.matchMedium(query);
    } else if(window.media) {
      return media.matchMedium(query);
    } else {
      return prevWinWidth >= r1 && prevWinWidth <= r2;
    }
  }

  // range parser
  function parseRange(rangeStr) {
    var rangeData = rangeStr.split('..');
    var x1 = parseInt(rangeData[0], 10) || -Infinity;
    var x2 = parseInt(rangeData[1], 10) || Infinity;
    return [x1, x2].sort(function(a, b){
      return a - b;
    });
  }

  // export public functions
  return {
    addRange: function(ranges) {
      // parse data and add items to collection
      var result = {data:{}};
      $.each(ranges, function(property, data){
        result.data[property] = {
          range: parseRange(property),
          enableCallback: data.on,
          disableCallback: data.off
        };
      });
      handlers.push(result);

      // call resizeHandler to recalculate all events
      prevWinWidth = null;
      resizeHandler();
    }
  };
}(jQuery));
document.addEventListener("touchstart", function(){}, true);