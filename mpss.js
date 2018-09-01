(function(window, wkfunc, func) {
    (typeof window.webkit !== 'undefined' &&
    typeof window.webkit.messageHandlers !== 'undefined' &&
    typeof window.webkit.messageHandlers.MpssJSBridge !== 'undefined') && (MpssJSBridge = wkfunc());

    typeof MpssJSBridge !== 'undefined' && func(window);

    typeof MpssJSBridge !== 'undefined' || alert('MpssJSBridge未定义');
})(window, function() {
    var wkMpssJSBridge = window.webkit.messageHandlers.MpssJSBridge;
    var MpssJSBridge = {
        auth: function (key, auth) {
            wkMpssJSBridge.postMessage({key: key, auth: auth});
        },
        window: function (key, style) {
            wkMpssJSBridge.postMessage({key: key, style: style});
        },
        scanBarCode: function (key) {
            wkMpssJSBridge.postMessage({key: key});
        },
        scanQrCode: function (key) {
            wkMpssJSBridge.postMessage({key: key});
        },
        toExam: function (key, url) {
            wkMpssJSBridge.postMessage({key: key, url: url});
        },
        dialogTextarea: function (key) {
            wkMpssJSBridge.postMessage({key: key});
        },
        dialogAlert: function (key, msg) {
            wkMpssJSBridge.postMessage({key: key, msg: msg});
        },
        dialogBottomList: function (key, list) {
            wkMpssJSBridge.postMessage({key: key, list: list});
        },
        get: function (key, url, params) {
            wkMpssJSBridge.postMessage({key: key, url: url, params: params});
        },
        post: function (key, url, params) {
            wkMpssJSBridge.postMessage({key: key, url: url, params: params});
        },
        router: function (key, route) {
            wkMpssJSBridge.postMessage({key: key, route: route});
        },
        print: function (key, list) {
            wkMpssJSBridge.postMessage({key: key, list: list});
        },
        print: function (key) {
          wkMpssJSBridge.postMessage({key: key, list: list});
        }

    }
    return MpssJSBridge;
}, function(window) {
    var Mpss = {
        debug: false,
        config: {},
        $router: null,
        auth: function (obj) {
            var key = 'auth';
            this.config[key] = Object.assign(this.config[key] || {}, obj);

            this.debug = obj.debug? obj.debug: false;
            MpssJSBridge.auth(key, obj.auth);
        },
        window: function (obj) {
            var key = 'window';
            this.config[key] = obj;

            this.handleCallback(obj.style);
            console.log('style', obj.style);

            MpssJSBridge.window(key, JSON.stringify(obj.style));
        },
        scanBarCode: function(obj) {
            var key = 'scanBarCode';
            this.config[key] = obj;

            MpssJSBridge.scanBarCode(key);
        },
        scanQrCode: function(obj) {
            var key = 'scanQrCode';
            this.config[key] = obj;

            MpssJSBridge.scanQrCode(key);
        },
        toExam: function (obj) {
          var key = 'toExam';
          this.config[key] = obj;

          MpssJSBridge.toExam(key, obj.url);
        },
        dialogTextarea: function(obj) {
          var key = 'dialogTextarea';
          this.config[key] = obj;

          MpssJSBridge.dialogTextarea(key);
        },
        dialogAlert: function(obj) {
          var key = 'dialogAlert';
          this.config[key] = obj;

          MpssJSBridge.dialogAlert(key, obj.msg);
        },
        dialogBottomList: function(obj) {
          var key = 'dialogBottomList';
          this.config[key] = obj;

          console.log(obj.list);
          MpssJSBridge.dialogBottomList(key, JSON.stringify(obj.list));
        },
        get: function (obj) {
            var key = 'get';
            key = this.getRandomKey(key);
            this.config[key] = obj;

            var url = this.getApiUrl(obj.url);
            var params = obj.params? obj.params: {};
            MpssJSBridge.get(key, url, JSON.stringify(params));
        },
        post: function (obj) {
            var key = 'post';
            key = this.getRandomKey(key);
            this.config[key] = obj;

            var url =  this.getApiUrl(obj.url);
            obj.params = obj.params? obj.params: {};
            MpssJSBridge.post(key, url, JSON.stringify(obj.params));
        },
        router: function(type, data) {
            switch (type) {
              case 'push':
                  this.$router.push(data);
                  break;
              case 'replace':
                  this.$router.replace(data);
                  break;
              case 'go':
                  this.$router.go(data);
                  break;
              default:
                  alert('未知路由行为');
            }
        },
        print: function (obj) {
          var key = 'print';
          key = this.getRandomKey(key);
          this.config[key] = obj;

          MpssJSBridge.print(key, JSON.stringify(obj.list));
        },
        windowClose: function(obj) {
          var key = 'windowClose';
          key = this.getRandomKey(key);
          this.config[key] = obj;

          MpssJSBridge.windowClose(key);
        },
        handleCallback: function (style) {
            var key = 'callback'
            var randomKey = '';
            // 处理标题栏返回按钮回调行为
            if(typeof style.navBackBtn !== 'undefined' && style.navBackBtn.action === 'callback://') {
                randomKey = this.getRandomKey(key);
                style.navBackBtn.action += randomKey;
                this.config[randomKey] = Object.assign({}, style.navBackBtn);
                typeof style.navBackBtn.success !== 'undefined' && delete style.navBackBtn.success;
                typeof style.navBackBtn.fail !== 'undefined' && delete style.navBackBtn.fail;
            }
            // 处理标题栏右侧按钮回调行为
            if(typeof style.navRightBtn !== 'undefined' && style.navRightBtn.action === 'callback://') {
                randomKey = this.getRandomKey(key);
                style.navRightBtn.action += randomKey;
                this.config[randomKey] = Object.assign({}, style.navRightBtn);
                typeof style.navBackBtn.success !== 'undefined' && delete style.navBackBtn.success;
                typeof style.navBackBtn.fail !== 'undefined' && delete style.navBackBtn.fail;
            }
            // 处理标题栏下拉按钮回调行为
            if(typeof style.navRightDownBtns !== 'undefined') {
                for(var i = 0; i < style.navRightDownBtns.length; ++i) {
                    if(style.navRightDownBtns[i].action === 'callback://') {
                        randomKey = this.getRandomKey(key);
                        style.navRightDownBtns[i].action += randomKey;
                        this.config[randomKey] = Object.assign({}, style.navRightDownBtns[i]);
                        typeof style.navRightDownBtns[i].success !== 'undefined' && delete style.navRightDownBtns[i].success;
                        typeof style.navRightDownBtns[i].fail !== 'undefined' && delete style.navRightDownBtns[i].fail;
                    }
                }
            }
        },
        success: function (key, rs) {
            this.checkDebug(key) && this.printDebug(rs, key + ' success!');
            if(typeof this.config[key].success === 'function') {
                this.config[key].success(rs);
            }
            key.substr(0, 9) !== 'callback_' && delete this.config[key];
        },
        fail: function (key, rs) {
            this.debug && this.printDebug(rs, key + ' fail!');
            if(typeof this.config[key].fail === 'function') {
                this.config[key].fail(rs);
            }
            key.substr(0, 9) !== 'callback_' && delete this.config[key];
        },
        getApiUrl: function (url) {
            return '/app-api' + url;
        },
        toJSON: function (rs) {
            try {
                var json = JSON.parse(rs);
                return json;
            } catch(e) {
                return rs;
            }
        },
        checkDebug: function (key) {
            if(this.debug === true) {
                return true;
            } else if(Object.prototype.toString.call(this.debug) === '[object Array]') {
                var method = key.split('_')[0];
                if(this.inArray(method, this.debug)) {
                    return true;
                }
            }

            return false;
        },
        printDebug: function (rs, tips) {
            this.alert(rs, tips);
        },
        inArray: function (val, array) {
            for(var i in array)  {
                if(val == array[i]) {
                    return true;
                }
            }

            return false;
        },
        getRandomKey: function (key) {
            do {
                var randomKey = key + '_' + this.getRandomStr(16);
            } while (!!this.config[randomKey]);

            return randomKey;
        },
        getRandomStr: function (num) {
            var strArray = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
            var len = strArray.length;
            var randomStr = '';
            for(var i = 0; i < num; ++i) {
                var random = parseInt(Math.random() * len);
                randomStr += strArray[random];
            }
            return randomStr;
        },
        isEmpty: function (obj) {
            for(var name in obj) {
                return false;
            }
            return true;
        },
        toString: function (obj, level) {
            level || (level = 1);
            var type = typeof obj;
            var str = "{\n";
            var blank = new Array(level + 1).join('    ');
            switch (type) {
                case 'object':
                    for(var attr in obj) {
                        var t = typeof obj[attr];
                        var val = '';
                        switch (t) {
                            case 'object':
                                val = this.toString(obj[attr], level + 1) + blank + "}";
                                break;
                            case 'string':
                                val = '"' + obj[attr] + '"';
                                break;
                            default:
                                val = obj[attr];
                        }
                        str += blank + attr + ': ' + val + "\n";
                    }
                    break;
                default:
                    str = blank + obj + "\n";
                    break;
            }

            if(level == 1) {
                return "[" + type + "] " + str + '}';
            } else {
                return str;
            }
        },
        alert: function (obj, status) {
            alert(status + "\n" + this.toString(obj));
        }
    };
    window.Mpss = Mpss;
});