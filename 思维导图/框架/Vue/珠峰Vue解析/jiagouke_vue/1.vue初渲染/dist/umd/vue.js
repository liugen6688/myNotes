(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.Vue = factory());
}(this, (function () { 'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArrayLimit(arr, i) {
    if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(n);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  // ????????????????????????????????? 7??? push shift unshift pop reverse sort splice ?????????????????????????????????
  // slice()
  var oldArrayMethods = Array.prototype; // value.__proto__ = arrayMethods ??????????????????????????? ??????????????????????????????????????????????????????????????????????????????
  // arrayMethods.__proto__ = oldArrayMethods

  var arrayMethods = Object.create(oldArrayMethods);
  var methods = ['push', 'shift', 'unshift', 'pop', 'sort', 'splice', 'reverse'];
  methods.forEach(function (method) {
    arrayMethods[method] = function () {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var result = oldArrayMethods[method].apply(this, args); // ???????????????????????????
      // push unshift ???????????????????????????????????????

      var inserted; // ???????????????????????????

      var ob = this.__ob__;

      switch (method) {
        case 'push':
        case 'unshift':
          inserted = args;
          break;

        case 'splice':
          // 3???  ??????????????? splice ????????? ?????????????????? arr.splice(0,1,{name:1})
          inserted = args.slice(2);
      }

      if (inserted) ob.observerArray(inserted); // ???????????????????????????

      return result;
    };
  });

  /**
   * 
   * @param {*} data  ???????????????????????????
   */
  function isObject(data) {
    return _typeof(data) === 'object' && data !== null;
  }
  function def(data, key, value) {
    Object.defineProperty(data, key, {
      enumerable: false,
      configurable: false,
      value: value
    });
  } // ???????????????????????????

  function proxy(vm, source, key) {
    Object.defineProperty(vm, key, {
      get: function get() {
        return vm[source][key];
      },
      set: function set(newValue) {
        vm[source][key] = newValue;
      }
    });
  }

  var Observer = /*#__PURE__*/function () {
    function Observer(value) {
      _classCallCheck(this, Observer);

      // ???????????????????????????
      // vue??????????????????????????? ?????????????????????????????????????????????????????????set???get??????
      // value.__ob__ = this; // ????????????????????????????????????????????????__ob__??????
      def(value, '__ob__', this);

      if (Array.isArray(value)) {
        // ??????????????????????????????????????????????????? ???????????????????????????
        // ??????????????????????????? ??????????????? push shift unshift 
        value.__proto__ = arrayMethods; // ??????????????????????????????????????????

        this.observerArray(value);
      } else {
        // ???????????????
        this.walk(value); // ?????????????????????
      }
    }

    _createClass(Observer, [{
      key: "observerArray",
      value: function observerArray(value) {
        // [{}]
        for (var i = 0; i < value.length; i++) {
          observe(value[i]);
        }
      }
    }, {
      key: "walk",
      value: function walk(data) {
        var keys = Object.keys(data); // [name,age,address]
        // ????????????data ???????????? ??????reurn

        keys.forEach(function (key) {
          defineReactive(data, key, data[key]);
        });
      }
    }]);

    return Observer;
  }();

  function defineReactive(data, key, value) {
    observe(value); // ????????????????????????

    Object.defineProperty(data, key, {
      configurable: true,
      enumerable: false,
      get: function get() {
        //  ?????????????????????????????????
        return value;
      },
      set: function set(newValue) {
        // ????????????????????????
        console.log('????????????');
        if (newValue === value) return;
        observe(newValue); // ?????????????????????????????????????????????????????????????????????????????????

        value = newValue;
      }
    });
  }

  function observe(data) {
    var isObj = isObject(data);

    if (!isObj) {
      return;
    }

    return new Observer(data); // ??????????????????
  }

  function initState(vm) {
    var opts = vm.$options; // vue??????????????? ?????? ?????? ?????? ???????????? watch

    if (opts.props) ;

    if (opts.methods) ;

    if (opts.data) {
      initData(vm);
    }

    if (opts.computed) ;

    if (opts.watch) ;
  }

  function initData(vm) {
    // ?????????????????????
    var data = vm.$options.data; // ???????????????data

    data = vm._data = typeof data === 'function' ? data.call(vm) : data; // ???????????? ????????????????????? ??????????????????????????? =??? ????????????
    // MVVM?????? ???????????????????????????????????? 
    // Object.defineProperty () ???????????????get?????????set??????
    // ?????????????????????????????? ?????????????????????vm.xxx

    for (var key in data) {
      proxy(vm, '_data', key);
    }

    observe(data); // ???????????????
  }

  var ncname = "[a-zA-Z_][\\-\\.0-9_a-zA-Z]*"; // abc-aaa

  var qnameCapture = "((?:".concat(ncname, "\\:)?").concat(ncname, ")"); // <aaa:asdads>

  var startTagOpen = new RegExp("^<".concat(qnameCapture)); // ????????????????????? ???????????????????????????

  var endTag = new RegExp("^<\\/".concat(qnameCapture, "[^>]*>")); // ????????????????????? </div>

  var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // ???????????????

  var startTagClose = /^\s*(\/?)>/; // ????????????????????? >  <div>
  var root = null; // ast??????????????????

  var currentParent; // ????????????????????????

  var stack = [];
  var ELEMENT_TYPE = 1;
  var TEXT_TYPE = 3;

  function createASTElement(tagName, attrs) {
    return {
      tag: tagName,
      type: ELEMENT_TYPE,
      children: [],
      attrs: attrs,
      parent: null
    };
  }

  function start(tagName, attrs) {
    // ?????????????????? ???????????????ast??????s
    var element = createASTElement(tagName, attrs);

    if (!root) {
      root = element;
    }

    currentParent = element; // ???????????????????????????ast???

    stack.push(element); // ??????????????????????????????
  }

  function chars(text) {
    text = text.replace(/\s/g, '');

    if (text) {
      currentParent.children.push({
        text: text,
        type: TEXT_TYPE
      });
    }
  }

  function end(tagName) {
    var element = stack.pop(); // ????????????ast??????
    // ????????????????????????p???????????????div????????????

    currentParent = stack[stack.length - 1];

    if (currentParent) {
      element.parent = currentParent;
      currentParent.children.push(element); // ?????????????????????????????????
    }
  }

  function parseHTML(html) {
    // ??????????????????html?????????
    while (html) {
      var textEnd = html.indexOf('<');

      if (textEnd == 0) {
        // ?????????????????????0 ????????????????????? ???????????? ????????????
        var startTagMatch = parseStartTag(); // ?????????????????????????????????????????? tagName,attrs

        if (startTagMatch) {
          start(startTagMatch.tagName, startTagMatch.attrs); // 1??????????????????

          continue; // ????????????????????????????????? ??????????????? ??????
        }

        var endTagMatch = html.match(endTag);

        if (endTagMatch) {
          advance(endTagMatch[0].length);
          end(endTagMatch[1]); // 2??????????????????

          continue;
        }
      }

      var text = void 0;

      if (textEnd >= 0) {
        text = html.substring(0, textEnd);
      }

      if (text) {
        advance(text.length);
        chars(text); // 3????????????
      }
    }

    function advance(n) {
      html = html.substring(n);
    }

    function parseStartTag() {
      var start = html.match(startTagOpen);

      if (start) {
        var match = {
          tagName: start[1],
          attrs: []
        };
        advance(start[0].length); // ???????????????

        var _end, attr;

        while (!(_end = html.match(startTagClose)) && (attr = html.match(attribute))) {
          // ?????????????????????
          advance(attr[0].length); // ???????????????

          match.attrs.push({
            name: attr[1],
            value: attr[3] || attr[4] || attr[5]
          });
        }

        if (_end) {
          // ????????????????????? >
          advance(_end[0].length);
          return match;
        }
      }
    }

    return root;
  }

  var defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;

  function genProps(attrs) {
    // ???????????? ???????????????????????????
    var str = '';

    for (var i = 0; i < attrs.length; i++) {
      var attr = attrs[i];

      if (attr.name === 'style') {
        (function () {
          // style="color: red;fontSize:14px" => {style:{color:'red'},id:name,}
          var obj = {};
          attr.value.split(';').forEach(function (item) {
            var _item$split = item.split(':'),
                _item$split2 = _slicedToArray(_item$split, 2),
                key = _item$split2[0],
                value = _item$split2[1];

            obj[key] = value;
          });
          attr.value = obj;
        })();
      }

      str += "".concat(attr.name, ":").concat(JSON.stringify(attr.value), ",");
    }

    return "{".concat(str.slice(0, -1), "}");
  }

  function genChildren(el) {
    var children = el.children;

    if (children && children.length > 0) {
      return "".concat(children.map(function (c) {
        return gen(c);
      }).join(','));
    } else {
      return false;
    }
  }

  function gen(node) {
    if (node.type == 1) {
      // ????????????
      return generate(node);
    } else {
      var text = node.text; //   <div>a {{  name  }} b{{age}} c</div>

      var tokens = [];
      var match, index; // ?????????????????? buffer.split()

      var lastIndex = defaultTagRE.lastIndex = 0; // ????????????????????? ????????????lastIndex???????????????????????????0???

      while (match = defaultTagRE.exec(text)) {
        index = match.index;

        if (index > lastIndex) {
          tokens.push(JSON.stringify(text.slice(lastIndex, index)));
        }

        tokens.push("_s(".concat(match[1].trim(), ")"));
        lastIndex = index + match[0].length;
      }

      if (lastIndex < text.length) {
        tokens.push(JSON.stringify(text.slice(lastIndex)));
      }

      return "_v(".concat(tokens.join('+'), ")");
    }
  }

  function generate(el) {
    // [{name:'id',value:'app'},{}]  {id:app,a:1,b:2}
    var children = genChildren(el);
    var code = "_c(\"".concat(el.tag, "\",").concat(el.attrs.length ? genProps(el.attrs) : 'undefined').concat(children ? ",".concat(children) : '', ")\n    ");
    return code;
  }

  function compileToFunction(template) {
    // 1) ??????html????????? ???html????????? => ast?????????
    var root = parseHTML(template); // ?????????ast????????????????????????render??????  ????????????????????? ??????????????????

    var code = generate(root); // ???????????????????????????????????? ?????????????????????
    //  <div id="app"><p>hello {{name}}</p> hello</div>
    // ???ast??? ???????????????js?????????
    //  _c("div",{id:app},_c("p",undefined,_v('hello' + _s(name) )),_v('hello'))
    // ??????????????????????????? ?????????new Function + with

    var renderFn = new Function("with(this){ return ".concat(code, "}")); // vue???render ?????????????????????dom

    return renderFn;
  } //   hellpo
  //      <p></p>
  // </div>
  // let root = {
  //     tag:'div',
  //     attrs:[{name:'id',value:'app'}],
  //     parent:null,
  //     type:1,
  //     children:[{
  //         tag:'p',
  //         attrs:[],
  //         parent:root,
  //         type:1,
  //         children:[
  //             {
  //                 text:'hello',
  //                 type:3
  //             }
  //         ]
  //     }]
  // }

  var Watcher = /*#__PURE__*/function () {
    function Watcher(vm, exprOrFn, callback, options) {
      _classCallCheck(this, Watcher);

      this.vm = vm;
      this.callback = callback;
      this.options = options;
      this.getter = exprOrFn; // ????????????????????????????????? ??????getter?????????

      this.get();
    }

    _createClass(Watcher, [{
      key: "get",
      value: function get() {
        this.getter();
      }
    }]);

    return Watcher;
  }();

  function patch(oldVnode, vnode) {
    // 1.??????????????????????????????
    var isRealElement = oldVnode.nodeType;

    if (isRealElement) {
      var oldElm = oldVnode; // div id="app"

      var parentElm = oldElm.parentNode; // body

      var el = createElm(vnode);
      parentElm.insertBefore(el, oldElm.nextSibling);
      parentElm.removeChild(oldElm);
    } // ???????????????????????? ?????????????????????

  }

  function createElm(vnode) {
    // ???????????????????????????????????????
    var tag = vnode.tag,
        children = vnode.children,
        key = vnode.key,
        data = vnode.data,
        text = vnode.text; // ????????????????????????

    if (typeof tag === 'string') {
      vnode.el = document.createElement(tag);
      updateProperties(vnode);
      children.forEach(function (child) {
        // ????????????????????????????????????????????????????????????
        return vnode.el.appendChild(createElm(child));
      });
    } else {
      // ??????dom??????????????????dom  ????????????????????????
      vnode.el = document.createTextNode(text);
    } // ??????????????????????????????


    return vnode.el;
  } // ????????????


  function updateProperties(vnode) {
    var newProps = vnode.data;
    var el = vnode.el;

    for (var key in newProps) {
      if (key === 'style') {
        for (var styleName in newProps.style) {
          el.style[styleName] = newProps.style[styleName];
        }
      } else if (key === 'class') {
        el.className = newProps["class"];
      } else {
        el.setAttribute(key, newProps[key]);
      }
    }
  }

  function lifecycleMixin(Vue) {
    Vue.prototype._update = function (vnode) {
      var vm = this;
      vm.$el = patch(vm.$el, vnode); // ?????????????????????????????????????????? ????????? ?????????$el
      // ???????????????????????? ??????????????????dom
    };
  }
  function mountComponent(vm, el) {
    var options = vm.$options; // render

    vm.$el = el; // ?????????dom??????
    // Watcher ?????????????????????
    // vm._render ???????????????render?????? ???????????????dom _c _v _s
    // vm._update ????????????dom ???????????????dom  
    // ????????????

    var updateComponent = function updateComponent() {
      // ????????????????????????????????????????????????
      // ??????????????????dom
      vm._update(vm._render());
    }; // ??????watcher ????????????????????????watcher   


    new Watcher(vm, updateComponent, function () {}, true); // true????????????????????????watcher
  }

  function initMixin(Vue) {
    // ???????????????
    Vue.prototype._init = function (options) {
      // ???????????????
      var vm = this; // vue????????? this.$options ????????????????????????????????????

      vm.$options = options; // ???????????????

      initState(vm); // ????????????
      // ?????????????????????el?????? ???????????????????????????
      // ?????????????????????el ????????????????????????

      if (vm.$options.el) {
        vm.$mount(vm.$options.el);
      }
    };

    Vue.prototype.$mount = function (el) {
      var vm = this;
      var options = vm.$options;
      el = document.querySelector(el); // ???????????????????????????render???????????????render ??? ??????template template???????????????el????????????

      if (!options.render) {
        // ?????????????????????
        var template = options.template; // ????????????

        if (!template && el) {
          template = el.outerHTML;
        }

        var render = compileToFunction(template);
        options.render = render; // ???????????????template ?????????render?????? vue1.0 2.0??????dom

        console.log(render);
      } // options.render
      // ????????????????????? ??????????????????


      mountComponent(vm, el);
    };
  }

  function createElement(tag) {
    var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var key = data.key;

    if (key) {
      delete data.key;
    }

    for (var _len = arguments.length, children = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      children[_key - 2] = arguments[_key];
    }

    return vnode(tag, data, key, children, undefined);
  }
  function createTextNode(text) {
    return vnode(undefined, undefined, undefined, undefined, text);
  }

  function vnode(tag, data, key, children, text) {
    return {
      tag: tag,
      data: data,
      key: key,
      children: children,
      text: text
    };
  } // ???????????? ????????????_c _v ????????????????????????dom????????? ????????????
  // 1) ???template?????????ast?????????-> ??????render?????? -> ????????????dom -> ?????????dom
  //  ??????????????????dom -> ??????dom

  function renderMixin(Vue) {
    // _c ???????????????????????????
    // _v ???????????????????????????
    // _s JSON.stringify
    Vue.prototype._c = function () {
      return createElement.apply(void 0, arguments); // tag,data,children1,children2
    };

    Vue.prototype._v = function (text) {
      return createTextNode(text);
    };

    Vue.prototype._s = function (val) {
      return val == null ? '' : _typeof(val) === 'object' ? JSON.stringify(val) : val;
    };

    Vue.prototype._render = function () {
      var vm = this;
      var render = vm.$options.render;
      var vnode = render.call(vm); // ???????????? ??????

      return vnode;
    };
  }

  // Vue??????????????? ??????Vue???????????????

  function Vue(options) {
    // ??????Vue??????????????????
    this._init(options);
  } // ??????????????????????????? ???Vue?????????????????????


  initMixin(Vue); // ???Vue?????????????????????_init??????

  renderMixin(Vue);
  lifecycleMixin(Vue);

  return Vue;

})));
//# sourceMappingURL=vue.js.map
