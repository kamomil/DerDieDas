(function() {
    var d, k = function(a) {
            return a.replace(/^\s+|\s+$/g, "")
        },
        u = function(a, b) {
            var c = new XMLHttpRequest;
            c.open("GET", a, !0);
            c.onload = function() {
                var a = null;
                200 === this.status && (a = c.response);
                return b(a)
            };
            c.send()
        },
        y = function() {
            u(chrome.runtime.getURL("content.css"),
                function(a) {
                    var b = function(b) {
                        console.log('in b func')
                        this.K = b.instanceId;
                        this.J = a;
                        b = document.createElement("div");
                        this.b = b.cloneNode(!1);
                        this.b.id = "gdx-bubble-host";
                        this.D = this.b.createShadowRoot ? this.b.createShadowRoot() : this.b.webkitCreateShadowRoot();
                        var f = document.createElement("style");
                        f.innerHTML = this.J;
                        this.D.appendChild(f);
                        this.a = b.cloneNode(!1);
                        this.a.id = "gdx-bubble-main";
                        this.D.appendChild(this.a);
                        this.g = b.cloneNode(!1);
                        this.g.id = "gdx-bubble-query-row";
                        this.C = b.cloneNode(!1);
                        this.C.id = "gdx-bubble-query";
                        this.g.appendChild(this.C);
                        this.w = b.cloneNode(!1);
                        this.w.id = "gdx-bubble-close";
                        this.a.appendChild(this.w);
                        this.a.appendChild(this.g);
                        x(this)
                    }.bind(this);
                    chrome.runtime.sendMessage({
                        type: "initialize"
                    }, b)
                }.bind(this))
        },
    d = y.prototype;
    d.J = "";
    d.u = 0;
    d.b = null;
    d.D = null;
    d.a = null;
    d.g = null;
    d.C = null;
    d.w = null;
    d.h = null;
    d.o = null;
    d.G = null;
    var x = function(a) {
            a.G = a.N.bind(a);
            window.addEventListener("resize", a.j.bind(a));
            document.addEventListener("mouseup", a.P.bind(a));
            document.addEventListener("dblclick", a.L.bind(a));
            document.addEventListener("keydown", a.O.bind(a));
            a.w.onclick = a.j.bind(a);

            var b = function(a) {
                a.preventDefault();
                a.stopPropagation()
            };
            a.w.onmousedown = b;
            chrome.runtime.onMessage.addListener(D);
            chrome.runtime.onMessage.addListener(a.G)
        },
        E = function(a, b, c, g) {
            console.log({a,b,c,g})
            this.top = a;
            this.right = b;
            this.bottom = c;
            this.left = g
        },
        F = function(a) {
            a.a.style.left = "0";
            a.a.style.top = "0";
            var xxxx = 90
            var b =
                a.a.offsetWidth,
                c = a.a.offsetHeight,
                g = [window.pageXOffset, window.pageYOffset],
                f = g[0],
                e = [a.o.left + f, a.o.top + g[1]],
                n = a.o.bottom - a.o.top,
                A = e[0] + (a.o.right - a.o.left) / 2;
            g = f + document.documentElement.offsetWidth;
            var l = A - b / 2;
            l + b > g && (l = g - b);
            l < f && (l = f);
            var r = e[1] - c - xxxx + 1,
                m = e[1] + n + xxxx - 1;

            if (b = new E(r, l + b, r + c, l), b.top < window.pageYOffset) {
                console.log("F: in if!")
                 r = m;
            }
            e = A - xxxx;
            a.a.style.top = r + "px";
            a.a.style.left = l + "px"
        };
    //this is the function that recieve the meaning back from the request and set content in the bubble
    y.prototype.M = function(a) {
        this.j();
        if (a.meaningObj) {
            var b = a.meaningObj;
            this.g.className = "";
            this.C.innerHTML = a.meaningObj;
        } else {
            this.g.className = "display-none";
        }
        document.documentElement.appendChild(this.b);
        F(this)
    };

    H = function(a, b) {
        b = b.getBoundingClientRect();
        console.log("call E 3")
        a.o = new E(b.top, b.right, b.bottom, b.left)
    };
    y.prototype.j = function() {
        console.log(" in j 1!!!")
        this.u++;
        var a = this.b;
        a && a.parentNode && a.parentNode.removeChild(a);
    };
    //close the window uppon escape
    y.prototype.O = function(a) {
        27 === a.keyCode && this.j()
    };
    //return true if I clicked the bubble
    //if I click outside the bubble then the bubble should be closed
    J = function(a, b) {
        for (b = b.target; b; b = b.parentNode)
            if (b === a.b) return !0;
        return !1
    },
    //this is the callback that set the bubble just before calling the remote request for the dictionary,
    //it calls a "fetch_raw" message
    K = function(a, b, c) {
        console.log("in K")

        if("dblclick" !== c) {
            console.warn("Unexpected eventType: " + c);
            return
        }
        f = null;
        e = "";
        if (window.getSelection) {
            e = window.getSelection();
            if (1 > e.rangeCount) return;
            f = e.getRangeAt(0);
            e = k(e.toString())
        } else document.selection && (f = document.selection.createRange(), e = k(f.text));
        if (e && 1 < e.length && 64 < e.charCodeAt(0) && e.charCodeAt(0) < 91 && -1 === e.indexOf(" ")) {
            a.u++;
            var n = a.u;
            J(a, b) || H(a, f); //if a bubble does not already exist then set the position
            window.setTimeout(function() {
                n ===
                    this.u && (this.g.className = "display-none", document.documentElement.appendChild(this.b), F(this))
            }.bind(a), 300), chrome.runtime.sendMessage({
                type: "fetch_raw",
                eventKey: n,
                instanceId: a.K,
                query: e
            }, a.M.bind(a))
        }

    };
    y.prototype.P = function(a) {
        console.log(" in P, CALL j")
        J(this, a) || this.j();
    };

    y.prototype.L = function(a) {
        var b = function() {
            K(this, a, "dblclick")
        }.bind(this);
        b()
    };
    var D = function(a, b, c) {
        "get_selection" === a.type && (a = k(window.getSelection().toString())) && c({
            selection: a
        })
    };
    y.prototype.N = function(a) {
        console.log("in N, CALL j")
        "hide" === a.type && a.instanceId === this.K && this.j()
    };
    var M = M || !1;
    if (!M) {
        console.log("content.js: not M")
        if (window.gdxBubbleInstance) {
            var N = window.gdxBubbleInstance;
            chrome.runtime.onMessage.removeListener(D);
            chrome.runtime.onMessage.removeListener(N.G);
            console.log("no M but gdxBubbleInstance exist, caling N.j")
            N.j()
        }
        window.gdxBubbleInstance = new y
    } else {console.log("content.js: M already exist")};
})();
