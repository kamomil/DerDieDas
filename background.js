(function() {
        t = 0,
        u = -1,
        v = -1,
        w = function(a) {
            a = a.replace(/<[^>]*>/g, "");
            return a = a.replace(/[<>]/g, "")
        },
        x = function(a) {
            a = w(a);
            return a = a.substring(0, 100)
        },
        //upon extension load, call the callback that initialize the bubble -set all the areas
        initialize_listener = function(a, b, c) {
            "initialize" === a.type && c({
                instanceId: t++
            })
        },

        query_listener = function(a, b, c) {
            console.log("in query_listener")
            console.log(b)
            console.log(c)
            if ("fetch_raw" !== a.type && "fetch_html" !== a.type) return !1;
            - 1 !== u && v !== a.instanceId && chrome.tabs.sendMessage(u, {
                type: "hide",
                instanceId: v
            });
            "fetch_raw" === a.type ? (u = b.tab.id, v = a.instanceId) : v = u = -1;
            var d = x(a.query);
            var g = {
                eventKey: a.eventKey,
                meaningObj: ":(",
            }

            var E_callback = function(data) {
                console.log(data);
                if (data.error) {
                    c(g)
                    return !0
                }
                wikitext = data.parse.wikitext["*"]

                var german_def = wikitext.match(new RegExp("\\{\\{Sprache\\|Deutsch\\}\\}(.*)(\\{\\{Sprache\\|)?", "m"));
                console.log(german_def)
                reg = /\{\{[mfn]\}\}/
                first_gender = wikitext.match(reg)
                console.log(first_gender)
                if (!first_gender) {
                    var singular_match = wikitext.match(new RegExp("Plural des Substantivs '''\\[\\[(.*)\\]\\]'''"))
                    console.log(singular_match)
                    if(singular_match && singular_match[1]) {
                        console.log(singular_match[1])
                        send_wiki_request(singular_match[1], "auto",E_callback)
                        return
                    }
                    g.meaningObj = ":("
                } else if (first_gender[0] === "{{m}}"){
                    g.meaningObj = "Der"
                } else if (first_gender[0] === '{{f}}') {
                    g.meaningObj = "Die"
                } else if (first_gender[0] === '{{n}}') {
                    g.meaningObj = "Das"
                }
                c(g)
            };
            send_wiki_request(d, "auto",E_callback);
            return !0
        },

        send_wiki_request = function(a, b, c) {
            console.log("in E about to call GET")
            console.log(b)
            console.log(encodeURIComponent(a))
            a = "https://de.wiktionary.org/w/api.php?action=parse&format=json&prop=wikitext&page=" + encodeURIComponent(a);
            console.log(a)
            var d = new XMLHttpRequest;
            d.open("GET",
                a, !0);
            d.onload = function() {
                var a = null;
                if (200 === this.status) try {
                    a = JSON.parse(d.response)
                } catch (n) {}
                return c(a)
            };
            d.send()
        },
        //called when the extension is loaded
        P = function() {
            chrome.runtime.onMessage.addListener(initialize_listener);
            chrome.runtime.onMessage.addListener(query_listener);
        };
    var Q = Q || !1;
    Q || P();
})();
