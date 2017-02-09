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
        clickEvent, //事件变量，存储事件函数
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
                active:'active'         //元素标签高亮样式
            },
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
        this.isAllSonForEle = options.isAllSonForEle || DEFAULT.isAllSonForEle;                 //所有的元素参数名称是否属于主体DOM的子元素，默认为true
        this.callback = options.callback;                                                       //每滚动一屏，回调函数
    }
    //原型
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
        //判断是否有按钮
        if(that.btn){
            if(that.btn.prevEleName)
                that.prevEle = that.isAllSonForEle ? that.boxEle.find(that.btn.prevEleName) : _a(that.btn.prevEleName);
            if(that.btn.nextEleName)
                that.nextEle = that.isAllSonForEle ? that.boxEle.find(that.btn.nextEleName) : _a(that.btn.nextEleName);
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
    //操作元素
    function operateEle(that){

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
            if(that.trigger) {
                if(b){
                    _a(that.triSonEleArr[index]).addClass(that.triActive);
                }else{
                    _a(that.triSonEleArr[index]).removeClass(that.triActive);
                }
            }
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
            if(that.trigger) {
                if(b){
                    _a(that.triSonEleArr[index]).addClass(that.triActive);
                }else{
                    _a(that.triSonEleArr[index]).removeClass(that.triActive);
                }
            }
            //回调函数
            that.callback && that.callback();
        })
    }
    //轮播三，滚动风格
    function runByRoll(that){

    }
    //上一张点击事件
    function prevRunFun(that){
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
        clickEvent = function (event) {
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
        _a(doc.body).on(that.click, clickEvent);
    }
    //解除事件绑定的方法
    function unEvent(that){
        if(clickEvent) _a(doc.body).unbind(that.click,clickEvent);
    }
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