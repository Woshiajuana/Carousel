/**
 * Created by 2144 on 2016/9/6.
 * Ajuan-1.0版本
 * author：zhigang.chen@owulia.com
 * jQuery简化版本
 */
;(function(win,doc,undefined){
    var Ajuan = (function (win,doc,undefined) {
        var _a,
            emptyArray = [],
            ajuan = {},
            emptyObject = {},
            core_toString = Object.prototype.toString,
            trimReg = /(^\s*)|(\s*$)/g,
            rclass = /[\t\r\n]/g,
            isArray = Array.isArray ||
                function(object){ return object instanceof Array };
        function Z(dom, selector) {
            var i,
                len = dom ? dom.length : 0;
            for (i = 0; i < len; i++) this[i] = dom[i]
            this.length = len;
            this.selector = selector || '';
        }
        function type(obj) {
            return obj == null ? String(obj) :
            emptyObject[emptyObject.toString.call(obj)] || "object"
        }
        ajuan.Z = function (dom,selector) {
            return new Z(dom,selector);
        };
        ajuan.isZ = function (object) {
            return object instanceof ajuan.Z
        };
        ajuan.init = function (selector) {
            var dom;
            if(!selector) return ajuan.Z();
            else if(typeof selector == 'string'){
                selector = selector.replace(trimReg,'');
                dom = ajuan.qsa(doc, selector)
            }else if(ajuan.isZ(selector)){
                return selector;
            }else if(type(selector) == "object"){
                if(isArray(selector)){
                    dom = selector;
                }else{
                    dom = [selector], selector = null;
                }
            }
            return ajuan.Z(dom,selector);
        };
        ajuan.qsa= function (element, selector) {
            var found,
                maybeID = selector.indexOf('#') > -1 ? true: false,//是否为ID
                maybeClass = !maybeID && selector.indexOf('.') > -1;//是否为class
            if(maybeID){
                found =  [element.getElementById(selector.replace('#',''))];
            }else if(maybeClass){
                found = element.querySelectorAll ? element.querySelectorAll(selector) : (function(ele){
                    selector = selector.replace('.','');
                    var ele = ele.getElementsByTagName('*'),
                        Result = [],
                        arr = [];
                    for(var i=0;i<ele.length;i++) {
                        arr = ele[i].className.split(' ');
                        for (var j=0;j<arr.length;j++) {
                            if(arr[j] == selector) {
                                Result.push(ele[i]);
                            }
                        }
                    }
                    return Result;
                }(element));
            }else{
                found = element.getElementsByTagName(selector);
            }
            return found;
        };
        ajuan.isFunction = function (obj) {
            return ajuan.type(obj) === "function";
        };
        ajuan.type = function (obj) {
            return obj == null ?
                String( obj ) :
            emptyObject[ core_toString.call(obj) ] || "object";
        };
        ajuan.each = function( obj, callback, args ) {
            var name,
                i = 0,
                length = obj.length,
                isObj = length === undefined || ajuan.isFunction( obj );
            if ( args ) {
                if ( isObj ) {
                    for ( name in obj ) {
                        if ( callback.apply( obj[ name ], args ) === false ) {
                            break;
                        }
                    }
                } else {
                    for ( ; i < length; ) {
                        if ( callback.apply( obj[ i++ ], args ) === false ) {
                            break;
                        }
                    }
                }
            } else {
                if ( isObj ) {
                    for ( name in obj ) {
                        if ( callback.call( obj[ name ], name, obj[ name ] ) === false ) {
                            break;
                        }
                    }
                } else {
                    for ( ; i < length; ) {
                        if ( callback.call( obj[ i ], i, obj[ i++ ] ) === false ) {
                            break;
                        }
                    }
                }
            }
            return obj;
        };
        //入口
        _a = function (selector) {
            return ajuan.init(selector);
        };
        //遍历
        _a.each = ajuan.each;
        //判断浏览器是否是IE，如果是IE则返回IE版本号，反之则返回false
        _a.IETester = function (userAgent) {
            var UA = userAgent || navigator.userAgent;
            if (/msie/i.test(UA)) {
                return UA.match(/msie (\d+\.\d+)/i)[1];
            } else if (~UA.toLowerCase().indexOf('trident') && ~UA.indexOf('rv')) {
                return UA.match(/rv:(\d+\.\d+)/)[1];
            }
            return false;
        };
        //去除前后空格
        _a.trim = function (str) {
            return str.replace(trimReg,'');
        };
        //获取event事件
        _a.event = function (event) {
            return event ? event : win.event;
        };
        //获取target
        _a.target = function (event) {
            var event = _a.event(event);
            return event.target || event.srcElement;
        };
        //阻止浏览器默认事件
        _a.preventDefault = function(event){
            var event = _a.event(event);
            if(event.preventDefault){
                event.preventDefault();
            }else{
                event.returnValue = false;
            }
        };
        //阻止冒泡事件
        _a.stopPropagation = function(event){
            var event = _a.event(event);
            if(event.stopPropagation){
                event.stopPropagation();
            }else{
                event.cancelBubble = true;
            }
        };
        //包含的方法
        _a.fn = {
            constructor: ajuan.Z,
            length: 0,
            forEach: emptyArray.forEach,
            reduce: emptyArray.reduce,
            push: emptyArray.push,
            sort: emptyArray.sort,
            splice: emptyArray.splice,
            indexOf: emptyArray.indexOf,
            //设置属性
            data: function (key,value) {
                return  key && value ? this.each(function () {
                    this.setAttribute(key,value);
                }):(0 in this ? this[0].getAttribute(key) : null);
            },
            //查找子元素
            find: function (selector) {
                var findEle = [];
                this.each(function () {
                    selector = selector.replace(trimReg,'');
                    //findEle.push.apply( findEle , ajuan.qsa(this, selector)) ;
                    var arr = ajuan.qsa(this, selector);
                    _a.each(arr, function (index,item) {
                        findEle.push(item);
                    })
                });
                return ajuan.Z(findEle,selector);
            },
            //改变元素内容
            html: function (htmlStr) {
                if(typeof htmlStr != 'undefined'){
                    return this.each(function () {
                        this.innerHTML = htmlStr;
                    })
                }else{
                    return 0 in this ? this[0].innerHTML : null;
                }
            },
            //显示元素
            show: function () {
                return this.each(function () {
                    this.style.display = 'block';
                });
            },
            //隐藏元素
            hide: function () {
                return this.each(function () {
                    this.style.display = 'none';
                });
            },
            //事件移除
            unbind: function(type,handler){
                return this.each(function () {
                    if(this.removeEventListener){
                        this.removeEventListener(type, handler, false);
                    }else if(this.attachEvent){
                        this.detachEvent('on' + type,handler);
                    }else{
                        this["on" + type] = null;
                    }
                });
            },
            //事件绑定
            on: function (type,handler) {
                return this.each(function () {
                    if(this.addEventListener){
                        this.addEventListener(type, handler, false);
                    }else if(this.attachEvent){
                        this.attachEvent('on' + type,handler);
                    }else{
                        this['on' + type] = handler;
                    }
                });
            },
            //添加样式
            addClass: function( className ) {
                className = _a.trim(className);
                if(!className) return this;
                return this.each(function () {
                    if(_a(this).hasClass(className)) return;
                    if(this.classList){
                        this.classList.add(className);
                    }else{
                        this.className = _a.trim(this.className + ' ' + className);
                    }
                });
            },
            //删除样式
            removeClass: function (className) {
                className = _a.trim(className);
                if(!className) return this;
                return this.each(function () {
                    if(!_a(this).hasClass(className)) return;
                    if(this.classList){
                        this.classList.remove(className);
                    }else{
                        this.className = _a.trim(this.className.replace(className,''));
                    }
                });
            },
            //判断是否有样式
            hasClass: function (className) {
                var className = " " + className + " ",
                    i = 0,
                    l = this.length;
                for ( ; i < l; i++ ) {
                    if ( this[i].nodeType === 1 && (" " + this[i].className + " ").replace(rclass, " ").indexOf( className ) >= 0 ) {
                        return true;
                    }
                }
                return false;
            },
            //遍历
            each: function (callback,args) {
                return ajuan.each( this, callback, args );
            }
        };
        ajuan.Z.prototype = Z.prototype = _a.fn;
        return _a;
    }(win,doc));
    if(typeof define === 'function' && define.amd){
        define('Ajuan',[],function(){return Ajuan});
    }else{
        win.Ajuan = Ajuan;
        win._a === undefined && ( win._a = Ajuan);
    }
}(this,document));