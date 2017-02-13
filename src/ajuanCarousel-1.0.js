/**
 * Created by 2144 on 2016/9/6.
 * ajuanCarousel-1.0.js版本
 * author：ChenZhigang
 * email：zhigang.chen@owulia.com
 * personal：http://www.owulia.com
 * github: https://github.com/Woshiajuana
 * company：http://www.2144.cn
 * 功能：
 *     图片轮播，兼容各大IE浏览器，原生js编写（在使用_a库的情况下）
 * 特别说明：
 *     _a对象，全名是Ajuan，是本人写的一个仿zepto的精简js库，如果在引用了该库的前提下，
 *     会优先使用该库，如果没有该库，则会使用jquery，没有jquery则会使用zepto库。
 * ajuanCarousel-1.0.js库：
 *     github: https://github.com/Woshiajuana/Carousel
 * Ajuan.js库：
 *     github: https://github.com/Woshiajuana/Ajuan
 */
;(function (win,doc,_a,undefined) {
    //定义变量
    var options, //用于接收用户传递的参数变量
        //默认参数
        DEFAULT = {
            click:'click',              //事件名
            fatherEleName: 'ul',        //父元素标签名，默认ul元素，可以是class：'.class'，也可以使id: '.id'
            sonEleName: 'li',           //子元素标签名，默认li元素
            index: 0,                   //轮播初始值，默认0
            speed : 4000,               //轮播频率，默认4000，单位ms
            isAuto: true,               //轮播是否自动滚动，可选(true | false)，默认为true
            isLoop: true,               //是否连续滚动，可选(true | false)，默认为true
            mode:'display',             //轮播图的风格，可选(display | custom | roll)，默认display，custom自定义，roll滚动
            custom:{                    //风格选择自定义的时候，该参数可用
                active:'active'         //风格样式默认class名为active
            },
            roll:{                      //风格选择滚动的时候，该参数可用
                width:0,                //用户指定的宽度，number类型，没有默认值
                height:0,               //用户指定的高度，number类型，没有默认值
                during:400,             //轮播速度，默认400，单位ms
                isAxisX:true            //滚动方向，X轴
            },
            btn:{                       //按钮配置信息
                prevEleName: '',        //元素标签名，可以是class：'.class'，也可以使id: '.id'
                nextEleName: ''         //元素标签名，可以是class：'.class'，也可以使id: '.id'
            },
            trigger:{                   //索引配置信息
                triEleName:'',          //元素标签名，可以是class：'.class'，也可以使id: '.id'
                sonEleTagName:'i',      //元素标签名
                sonEleClass:'',         //元素标签的样式
                active:'active',        //元素标签高亮样式
                triFun: ''              //回调函数，当索引滚动的样式不符合的时候，自定义方法
            },
            lazyLoad:{
                is:false,               //是否懒加载，默认不启用，
                attr:'data-src'         //启用懒加载的默认替换属性名
            },
            isPauseByHover:true,        //鼠标移动在主体上面，是否暂停滚动，默认true
            isAllSonForEle:true         //所有的元素参数名称是否属于主体DOM的子元素，默认为true
        };
    //构造函数
    function AjuanCarousel(ele,opt){
        //接收用户传递的参数变量，并且防止用户不传递参数报错
        options = opt || {};
        this.boxEle = _a(ele);                                                                  //主体DOM
        this.click = options.click || DEFAULT.click;                                            //事件名
        this.fatherEleName = options.fatherEleName || DEFAULT.fatherEleName;                    //父元素标签名，默认ul元素，可以是class：'.class'，也可以使id: '.id'
        this.sonEleName = options.sonEleName || DEFAULT.sonEleName;                             //子元素标签名，默认li元素
        this.index = options.index || DEFAULT.index;                                            //轮播初始值
        this.speed = options.speed || DEFAULT.speed;                                            //轮播频率
        this.isAuto = options.isAuto || DEFAULT.isAuto;                                         //是否自动滚动
        this.isLoop = options.isLoop || DEFAULT.isLoop;                                         //是否连续滚动
        this.btn = options.btn;                                                                 //按钮参数配置
        this.trigger = options.trigger;                                                         //索引参数配置
        this.mode = options.mode || DEFAULT.mode;                                               //轮播风格
        this.custom = options.custom || DEFAULT.custom;                                         //轮播风格为自定义，参数配置
        this.roll = options.roll || DEFAULT.roll;                                               //轮播风格为滚动，参数配置
        this.lazyLoad = options.lazyLoad || DEFAULT.lazyLoad;                                   //用户懒加载启用的参数
        this.isPauseByHover = options.isPauseByHover || DEFAULT.isPauseByHover;                 //鼠标移动在主体上面，是否暂停滚动，默认true
        this.isAllSonForEle = options.isAllSonForEle || DEFAULT.isAllSonForEle;                 //所有的元素参数名称是否属于主体DOM的子元素，默认为true
        this.callback = options.callback;                                                       //每滚动一屏，回调函数
    }
    //原型，暴露一些操作接口
    AjuanCarousel.prototype = {
        //初始化方法
        init: function () {
            achieveData(this);          //获取数据元素
            onEvent(this);              //绑定事件
            isModFun(this);             //判断轮播的风格
            autoRun(this);              //自动轮播
            return this;
        },
        //解除事件绑定的方法
        unEvent: function () {
            unEvent(this);
            return this;
        },
        //暂停滚动
        pause: function(){
            //清除定时器
            if(this.temp) clearInterval(this.temp);
            return this;
        },
        //滚动
        paly:function(){
            if(this.temp) clearInterval(this.temp);
            autoRun(this);              //自动轮播
            return this;
        }
    };
    //获取信息
    function achieveData(that){
        //获取信息
        that.fatherEle = that.boxEle.find(that.fatherEleName);      //获取轮播图父级元素对象
        that.sonEleArr = that.fatherEle.find(that.sonEleName);      //获取轮播图元素对象数组
        that.length = that.sonEleArr.length;                        //获取轮播图的总个数
        //判断是否有索引
        if(that.trigger && that.trigger.triEleName){
            //获取索引元素名称，如果未传递该参数，则使用默认元素
            var tagName = that.trigger.sonEleTagName || DEFAULT.trigger.sonEleTagName;
            //获取索引父级元素对象
            that.triEle = that.isAllSonForEle ? that.boxEle.find(that.trigger.triEleName) : _a(that.trigger.triEleName);
            //获取索引选中的样式，如果未传递该参数，则使用默认样式
            that.triActive = that.trigger.active || DEFAULT.trigger.active;
            //获取索引对象数组
            that.triSonEleArr = that.triEle.find( tagName );
            //判断页面上是否存有该对象
            if(!that.triSonEleArr.length)
                createTriggerSonEle(that,tagName);    //没有索引则去创建
        }
        //判断是否有索引函数
        if(that.trigger)
            that.triFun = that.trigger.triFun;
        //判断是否有按钮
        if(that.btn){
            if(that.btn.prevEleName)
                that.prevEle = that.isAllSonForEle ? that.boxEle.find(that.btn.prevEleName) : _a(that.btn.prevEleName);
            if(that.btn.nextEleName)
                that.nextEle = that.isAllSonForEle ? that.boxEle.find(that.btn.nextEleName) : _a(that.btn.nextEleName);
        }
        //判断是否要懒加载
        if(that.lazyLoad.is){
            if(!that.lazyLoad.attr) that.lazyLoad.attr = DEFAULT.lazyLoad.attr;
            that.lazyItemArr = [];
            that.boxEle.find('img').each(function (index, item) {
                var src = item.getAttribute(that.lazyLoad.attr);
                if(src){
                    item.src = src;
                    item.removeAttribute(that.lazyLoad.attr);
                }
            });
        }
    }
    //创建索引对象
    function createTriggerSonEle(that,tagName){
        var str = '',
            className = that.trigger.sonEleClass || '';  //给索引元素添加样式
        //循环添加索引元素
        for(var i = 0; i < that.length; i++){
            if(i === that.index)
                str += '<'+ tagName +' class="'+ className +' '+ that.triActive +'"></'+ tagName +'>';
            else
                str += '<'+ tagName +' class="'+ className +'"></'+ tagName +'>';
        }
        //添加到索引容器中
        that.triEle.html(str);
        //重新获取一次索引元素
        that.triSonEleArr = that.triEle.find(tagName);
    }
    //当轮播是滚动（roll）风格时，需要操作元素
    function operateEleByRoll(that){
        //复制对象
        var htmlStr = that.fatherEle.html();
        that.fatherEle.html(htmlStr + htmlStr);
        //如果滚动的方向是X轴，则
        if(that.roll.isAxisX){
            //给父元素宽度
            that.fatherEle[0].style.width = that.dir * 2 * that.length + 'px';
        }
    }
    //当轮播是滚动（roll）风格时，需要获取的数据
    function achieveDataByRoll(that){
        //方向
        that.axis = that.roll.isAxisX ? 'left' : 'top';
        //根据滚动的方向，获取滚动的距离
        that.dir = that.roll.isAxisX ? (that.roll.width || that.boxEle[0].clientWidth) : (that.roll.height || that.boxEle[0].clientHeight);
        //获取运动时间
        that.during = that.roll.during || DEFAULT.roll.during;
    }
    //判断风格
    function isModFun(that){
        //根据风格参数，判断轮播风格，再把滚动的函数赋予对应的方法
        switch (that.mode){
            case 'display':
                that.run = runByDisplay;
                break;
            case 'custom':
                that.run = runByCustom;
                break;
            case 'roll':
                that.run = runByRoll;
                achieveDataByRoll(that);
                operateEleByRoll(that);
                break;
        }
    }
    //自动轮播
    function autoRun(that){
        if(!that.isAuto) return;
        that.temp = setInterval(function () {
            that.index++;
            that.run && that.run(that);
        },that.speed)
    }
    //轮播一，display风格
    function runByDisplay(that){
        //判断当前页面和总数页面
        if(that.index >= that.length) that.index = 0;
        if(that.index < 0) that.index = that.length -1;
        //遍历页面
        that.sonEleArr.each(function (index, item) {
            //页面
            var b = index == that.index;
            item.style.display = b ? 'block' : 'none';
            //判断是否有索引容器
            if(that.triSonEleArr) {
                if(b){
                    _a(that.triSonEleArr[index]).addClass(that.triActive);
                }else{
                    _a(that.triSonEleArr[index]).removeClass(that.triActive);
                }
            }
            //判断是否有索引回调函数
            that.triFun && that.triFun(that.index);
            that.type = false;
            //回调函数
            that.callback && that.callback();
        })
    }
    //轮播二，custom风格
    function runByCustom(that){
        //判断当前页面和总数页面
        if(that.index >= that.length) that.index = 0;
        if(that.index < 0) that.index = that.length -1;
        var css = that.custom.active;
        //遍历页面
        that.sonEleArr.each(function (index, item) {
            //页面
            var b = index == that.index;
            if(b){
                _a(item).addClass(css);
            }else{
                _a(item).removeClass(css);
            }
            //判断是否有索引容器
            if(that.triSonEleArr) {
                if(b){
                    _a(that.triSonEleArr[index]).addClass(that.triActive);
                }else{
                    _a(that.triSonEleArr[index]).removeClass(that.triActive);
                }
            }
            //判断是否有索引回调函数
            that.triFun && that.triFun(that.index);
            that.type = false;
            //回调函数
            that.callback && that.callback();
        })
    }
    //轮播三，滚动风格
    function runByRoll(that){
        var obj = {},
            i = that.index;
        //判断当前页面和总数页面
        if(that.index >= that.length) i = 0;
        if(that.index < 0){
            i = that.length -1;
            that.fatherEle[0].style[that.axis] = '-' + that.dir * that.length +'px';
            that.index = that.length - 1;
        }
        //判断是否有索引容器
        if(that.triSonEleArr) {
            that.triSonEleArr.each(function (index, item) {
                if(i == index){
                    _a(item).addClass(that.triActive);
                }else{
                    _a(item).removeClass(that.triActive);
                }
            });
        }
        //判断是否有索引回调函数
        that.triFun && that.triFun(i);
        //移动轮播图
        obj[that.axis] = -(that.index) * that.dir;//获取参数对象
        //判断是否是jQuery
        if(that.fatherEle.animate){
            that.fatherEle.animate(obj,that.during, function () {
                //进行判断
                if(that.index >= that.length){
                    that.fatherEle[0].style[that.axis] = '-' + 0 + 'px';
                    that.index = 0;
                }
                that.type = false;
                that.callback && that.callback();
            })
        }else{
            //调用动画库
            packMove(that.fatherEle[0], obj, {duration: that.during}, function () {
                //进行判断
                if(that.index >= that.length){
                    that.fatherEle[0].style[that.axis] = '-' + 0 + 'px';
                    that.index = 0;
                }
                that.type = false;
                that.callback && that.callback();
            });
        }
    }
    //上一张点击事件
    function prevRunFun(that){
        if(that.type) return;
        that.type = true;
        //清除当前自动滚动
        clearInterval(that.temp);
        //当前值减一
        that.index--;
        //图片滚动
        that.run(that);
        //调用自动滚动
        autoRun(that);
    }
    //下一张点击事件
    function nextRunFun(that){
        if(that.type) return;
        that.type = true;
        //清除当前自动滚动
        clearInterval(that.temp);
        //当前值加一
        that.index++;
        //图片滚动
        that.run(that);
        //调用自动滚动
        autoRun(that);
    }
    //索引点击事件
    function triRunFun(that,target){
        if(that.type) return;
        that.type = true;
        //清除当前自动滚动
        clearInterval(that.temp);
        //判断是哪一页
        that.triSonEleArr.each(function (index, item) {
            if(item == target){
                that.index = index;
                return;
            }
        });
        //图片滚动
        that.run(that);
        //调用自动滚动
        autoRun(that);
    }
    //绑定事件的方法
    function onEvent(that){
        that.mouseOutEvent = function () {
            if(that.temp) clearInterval(that.temp);
            autoRun(that);
        };
        that.mouseOverEvent = function () {
            if(that.temp) clearInterval(that.temp);
        };
        that.clickEvent = function (event) {
            //获取事件event与目标target
            var event = event || win.event,
                target = event.target || event.srcElement;
            //事件委托机制
            //上一张按钮点击事件
            if(that.prevEle && target === that.prevEle[0]){
                //调用上一张的方法
                prevRunFun(that);
                return;
            }
            //下一张按钮点击事件
            if(that.nextEle && target === that.nextEle[0]){
                //调用下一张的方法
                nextRunFun(that);
                return;
            }
            //索引点击事件
            if(that.triEle && target.parentNode === that.triEle[0] &&
                ((that.trigger.sonEleTagName && target.nodeName.toLocaleLowerCase() == that.trigger.sonEleTagName) ||
                (target.nodeName.toLocaleLowerCase() == DEFAULT.trigger.sonEleTagName))){
                triRunFun(that,target);
                return;
            }
        };
        _a(doc.body).on(that.click, that.clickEvent);
        if(that.isPauseByHover){
            that.boxEle.on('mouseover', that.mouseOverEvent);
            that.boxEle.on('mouseout', that.mouseOutEvent);
        }
    }
    //解除事件绑定的方法
    function unEvent(that){
        if(that.clickEvent) _a(doc.body).unbind(that.click,that.clickEvent);
        if(that.isPauseByHover){
            that.boxEle.unbind('mouseover', that.mouseOverEvent);
            that.boxEle.unbind('mouseout', that.mouseOutEvent);
        }
    }
    //动画库
    var packMove = (function(){
            var getStyle = function(el, style){
                if(/msie/i.test(navigator.userAgent)){
                    style = style.replace(/\-(\w)/g, function(all, letter){
                        return letter.toUpperCase();
                    });
                    var value = el.currentStyle[style];
                    (value == "auto")&&(value = "0px" );
                    return value;
                }else{
                    return document.defaultView.getComputedStyle(el,null).getPropertyValue(style);
                }
            };
            var tween = {
                easeInQuad: function(pos){
                    return Math.pow(pos, 2);
                },
                easeOutQuad: function(pos){
                    return -(Math.pow((pos-1), 2) -1);
                },
                easeInOutQuad: function(pos){
                    if ((pos/=0.5) < 1) return 0.5*Math.pow(pos,2);
                    return -0.5 * ((pos-=2)*pos - 2);
                },
                easeInCubic: function(pos){
                    return Math.pow(pos, 3);
                },
                easeOutCubic: function(pos){
                    return (Math.pow((pos-1), 3) +1);
                },
                easeInOutCubic: function(pos){
                    if ((pos/=0.5) < 1) return 0.5*Math.pow(pos,3);
                    return 0.5 * (Math.pow((pos-2),3) + 2);
                },
                easeInQuart: function(pos){
                    return Math.pow(pos, 4);
                },
                easeOutQuart: function(pos){
                    return -(Math.pow((pos-1), 4) -1)
                },
                easeInOutQuart: function(pos){
                    if ((pos/=0.5) < 1) return 0.5*Math.pow(pos,4);
                    return -0.5 * ((pos-=2)*Math.pow(pos,3) - 2);
                },
                easeInQuint: function(pos){
                    return Math.pow(pos, 5);
                },
                easeOutQuint: function(pos){
                    return (Math.pow((pos-1), 5) +1);
                },
                easeInOutQuint: function(pos){
                    if ((pos/=0.5) < 1) return 0.5*Math.pow(pos,5);
                    return 0.5 * (Math.pow((pos-2),5) + 2);
                },
                easeInSine: function(pos){
                    return -Math.cos(pos * (Math.PI/2)) + 1;
                },
                easeOutSine: function(pos){
                    return Math.sin(pos * (Math.PI/2));
                },
                easeInOutSine: function(pos){
                    return (-.5 * (Math.cos(Math.PI*pos) -1));
                },
                easeInExpo: function(pos){
                    return (pos==0) ? 0 : Math.pow(2, 10 * (pos - 1));
                },
                easeOutExpo: function(pos){
                    return (pos==1) ? 1 : -Math.pow(2, -10 * pos) + 1;
                },
                easeInOutExpo: function(pos){
                    if(pos==0) return 0;
                    if(pos==1) return 1;
                    if((pos/=0.5) < 1) return 0.5 * Math.pow(2,10 * (pos-1));
                    return 0.5 * (-Math.pow(2, -10 * --pos) + 2);
                },
                easeInCirc: function(pos){
                    return -(Math.sqrt(1 - (pos*pos)) - 1);
                },
                easeOutCirc: function(pos){
                    return Math.sqrt(1 - Math.pow((pos-1), 2))
                },
                easeInOutCirc: function(pos){
                    if((pos/=0.5) < 1) return -0.5 * (Math.sqrt(1 - pos*pos) - 1);
                    return 0.5 * (Math.sqrt(1 - (pos-=2)*pos) + 1);
                },
                easeOutBounce: function(pos){
                    if ((pos) < (1/2.75)) {
                        return (7.5625*pos*pos);
                    } else if (pos < (2/2.75)) {
                        return (7.5625*(pos-=(1.5/2.75))*pos + .75);
                    } else if (pos < (2.5/2.75)) {
                        return (7.5625*(pos-=(2.25/2.75))*pos + .9375);
                    } else {
                        return (7.5625*(pos-=(2.625/2.75))*pos + .984375);
                    }
                },
                easeInBack: function(pos){
                    var s = 1.70158;
                    return (pos)*pos*((s+1)*pos - s);
                },
                easeOutBack: function(pos){
                    var s = 1.70158;
                    return (pos=pos-1)*pos*((s+1)*pos + s) + 1;
                },
                easeInOutBack: function(pos){
                    var s = 1.70158;
                    if((pos/=0.5) < 1) return 0.5*(pos*pos*(((s*=(1.525))+1)*pos -s));
                    return 0.5*((pos-=2)*pos*(((s*=(1.525))+1)*pos +s) +2);
                },
                elastic: function(pos) {
                    return -1 * Math.pow(4,-8*pos) * Math.sin((pos*6-1)*(2*Math.PI)/2) + 1;
                },
                swingFromTo: function(pos) {
                    var s = 1.70158;
                    return ((pos/=0.5) < 1) ? 0.5*(pos*pos*(((s*=(1.525))+1)*pos - s)) :
                    0.5*((pos-=2)*pos*(((s*=(1.525))+1)*pos + s) + 2);
                },

                swingFrom: function(pos) {
                    var s = 1.70158;
                    return pos*pos*((s+1)*pos - s);
                },
                swingTo: function(pos) {
                    var s = 1.70158;
                    return (pos-=1)*pos*((s+1)*pos + s) + 1;
                },
                bounce: function(pos) {
                    if (pos < (1/2.75)) {
                        return (7.5625*pos*pos);
                    } else if (pos < (2/2.75)) {
                        return (7.5625*(pos-=(1.5/2.75))*pos + .75);
                    } else if (pos < (2.5/2.75)) {
                        return (7.5625*(pos-=(2.25/2.75))*pos + .9375);
                    } else {
                        return (7.5625*(pos-=(2.625/2.75))*pos + .984375);
                    }
                },
                bouncePast: function(pos) {
                    if (pos < (1/2.75)) {
                        return (7.5625*pos*pos);
                    } else if (pos < (2/2.75)) {
                        return 2 - (7.5625*(pos-=(1.5/2.75))*pos + .75);
                    } else if (pos < (2.5/2.75)) {
                        return 2 - (7.5625*(pos-=(2.25/2.75))*pos + .9375);
                    } else {
                        return 2 - (7.5625*(pos-=(2.625/2.75))*pos + .984375);
                    }
                },
                easeFromTo: function(pos) {
                    if ((pos/=0.5) < 1) return 0.5*Math.pow(pos,4);
                    return -0.5 * ((pos-=2)*Math.pow(pos,3) - 2);
                },
                easeFrom: function(pos) {
                    return Math.pow(pos,4);
                },
                easeTo: function(pos) {
                    return Math.pow(pos,0.25);
                },
                linear:  function(pos) {
                    return pos;
                },
                sinusoidal: function(pos) {
                    return (-Math.cos(pos*Math.PI)/2) + 0.5;
                },
                reverse: function(pos) {
                    return 1 - pos;
                },
                mirror: function(pos, transition) {
                    transition = transition || tween.sinusoidal;
                    if(pos<0.5)
                        return transition(pos*2);
                    else
                        return transition(1-(pos-0.5)*2);
                },
                flicker: function(pos) {
                    var pos = pos + (Math.random()-0.5)/5;
                    return tween.sinusoidal(pos < 0 ? 0 : pos > 1 ? 1 : pos);
                },
                wobble: function(pos) {
                    return (-Math.cos(pos*Math.PI*(9*pos))/2) + 0.5;
                },
                pulse: function(pos, pulses) {
                    return (-Math.cos((pos*((pulses||5)-.5)*2)*Math.PI)/2) + .5;
                },
                blink: function(pos, blinks) {
                    return Math.round(pos*(blinks||5)) % 2;
                },
                spring: function(pos) {
                    return 1 - (Math.cos(pos * 4.5 * Math.PI) * Math.exp(-pos * 6));
                },
                none: function(pos){
                    return 0;
                },
                full: function(pos){
                    return 1;
                }
            };
            function move(elem,json,options,callback){
                options = options || {};
                options.duration = options.duration || 2000;
                options.ease = options.ease || tween.easeOutQuad;
                var start = {},distance = {};
                for(var atrr in json){
                    if(atrr == "opacity"){
                        start[atrr] = parseInt(100 * getStyle(elem, "opacity"));
                    }else{
                        start[atrr] = parseInt(getStyle(elem, atrr));
                    }
                    distance[atrr] = json[atrr] - start[atrr];
                    var speed = (json[atrr] - start[atrr])/options.duration;
                    speed=speed>0?Math.ceil(speed):Math.floor(speed);
                    var startTime = new Date().getTime();
                    (function(atrr){
                        setTimeout(function(){
                            var newTime = new Date().getTime();
                            var easetime = (newTime - startTime)/options.duration;
                            if (atrr == "opacity") {
                                elem.style.filter = "alpha(opacity:" + (start[atrr] + options.ease(easetime) * distance[atrr]) + ")";
                                elem.style.opacity = start[atrr]/100 + options.ease(easetime) * distance[atrr]/100;
                            }else{
                                elem.style[atrr] = Math.ceil(start[atrr] + options.ease(easetime) * distance[atrr]) + "px";
                            }
                            if(options.duration <= (newTime - startTime)){
                                elem.style[atrr] = json[atrr] + "px";
                                if(callback){
                                    callback();
                                }
                            }else{
                                setTimeout(arguments.callee,25);
                            }
                        },25)
                    })(atrr)
                }
            }
            return move;
        })();
    //判断是否为amd，并且把AjuanCarousel暴露出去
    if(typeof define === 'function' && define.amd){
        define('AjuanCarousel',[],function(){return AjuanCarousel});
    }else{
        // 绑定AjuanCarousel
        _a.fn.AjuanCarousel = function(options){
            var list = [];
            this.each(function(i, me){
                list.push(new AjuanCarousel(me, options).init());
            });
            return list;
        };
    }
})(window,document,window.Ajuan || window.jQuery || window.Zepto);