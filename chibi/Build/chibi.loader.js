function createUnityInstance(t, n, c) {
    function d(e, t) {
        if (!d.aborted && n.showBanner) return "error" == t && (d.aborted = !0), n.showBanner(e, t);
        switch (t) {
            case "error":
                console.error(e);
                break;
            case "warning":
                console.warn(e);
                break;
            default:
                console.log(e)
        }
    }

    function r(e) {
        var t = e.reason || e.error, n = t ? t.toString() : e.message || e.reason || "",
            r = t && t.stack ? t.stack.toString() : "";
        (n += "\n" + (r = r.startsWith(n) ? r.substring(n.length) : r).trim()) && l.stackTraceRegExp && l.stackTraceRegExp.test(n) && k(n, e.filename || t && (t.fileName || t.sourceURL) || "", e.lineno || t && (t.lineNumber || t.line) || 0)
    }

    function e(e, t, n) {
        var r = e[t];
        void 0 !== r && r || (console.warn('Config option "' + t + '" is missing or empty. Falling back to default value: "' + n + '". Consider updating your WebGL template to include the missing config option.'), e[t] = n)
    }

    c = c || function () {
    };
    var o, l = {
        canvas: t,
        webglContextAttributes: {preserveDrawingBuffer: !1, powerPreference: 2},
        cacheControl: function (e) {
            return e == l.dataUrl || e.match(/\.bundle/) ? "must-revalidate" : "no-store"
        },
        streamingAssetsUrl: "StreamingAssets",
        downloadProgress: {},
        deinitializers: [],
        intervals: {},
        setInterval: function (e, t) {
            e = window.setInterval(e, t);
            return this.intervals[e] = !0, e
        },
        clearInterval: function (e) {
            delete this.intervals[e], window.clearInterval(e)
        },
        preRun: [],
        postRun: [],
        print: function (e) {
            console.log(e)
        },
        printErr: function (e) {
            console.error(e), "string" == typeof e && -1 != e.indexOf("wasm streaming compile failed") && (-1 != e.toLowerCase().indexOf("mime") ? d('HTTP Response Header "Content-Type" configured incorrectly on the server for file ' + l.codeUrl + ' , should be "application/wasm". Startup time performance will suffer.', "warning") : d('WebAssembly streaming compilation failed! This can happen for example if "Content-Encoding" HTTP header is incorrectly enabled on the server for file ' + l.codeUrl + ", but the file is not pre-compressed on disk (or vice versa). Check the Network tab in browser Devtools to debug server header configuration.", "warning"))
        },
        locateFile: function (e) {
            return e
        },
        disabledCanvasEvents: ["contextmenu", "dragstart"]
    };
    for (o in e(n, "companyName", "Unity"), e(n, "productName", "WebGL Player"), e(n, "productVersion", "0.20"), n) l[o] = n[o];
    l.streamingAssetsUrl = new URL(l.streamingAssetsUrl, document.URL).href;
    var a = l.disabledCanvasEvents.slice();

    function i(e) {
        e.preventDefault()
    }

    a.forEach(function (e) {
        t.addEventListener(e, i)
    }), window.addEventListener("error", r), window.addEventListener("unhandledrejection", r);
    var s = "", u = "";

    function h(e) {
        document.webkitCurrentFullScreenElement === t ? t.style.width && (s = t.style.width, u = t.style.height, t.style.width = "100%", t.style.height = "100%") : s && (t.style.width = s, t.style.height = u, u = s = "")
    }

    document.addEventListener("webkitfullscreenchange", h), l.deinitializers.push(function () {
        for (var e in l.disableAccessToMediaDevices(), a.forEach(function (e) {
            t.removeEventListener(e, i)
        }), window.removeEventListener("error", r), window.removeEventListener("unhandledrejection", r), document.removeEventListener("webkitfullscreenchange", h), l.intervals) window.clearInterval(e);
        l.intervals = {}
    }), l.QuitCleanup = function () {
        for (var e = 0; e < l.deinitializers.length; e++) l.deinitializers[e]();
        l.deinitializers = [], "function" == typeof l.onQuit && l.onQuit()
    };
    var f, p, m, g, b, v, w, y, S, C = {
        Module: l, SetFullscreen: function () {
            if (l.SetFullscreen) return l.SetFullscreen.apply(l, arguments);
            l.print("Failed to set Fullscreen mode: Player not loaded yet.")
        }, SendMessage: function () {
            if (l.SendMessage) return l.SendMessage.apply(l, arguments);
            l.print("Failed to execute SendMessage: Player not loaded yet.")
        }, Quit: function () {
            return new Promise(function (e, t) {
                l.shouldQuit = !0, l.onQuit = e
            })
        }, GetMemoryInfo: function () {
            var e = l._getMemInfo();
            return {
                totalWASMHeapSize: l.HEAPU32[e >> 2],
                usedWASMHeapSize: l.HEAPU32[1 + (e >> 2)],
                totalJSHeapSize: l.HEAPF64[1 + (e >> 3)],
                usedJSHeapSize: l.HEAPF64[2 + (e >> 3)]
            }
        }
    };

    function k(e, t, n) {
        -1 == e.indexOf("fullscreen error") && (l.startupErrorHandler ? l.startupErrorHandler(e, t, n) : l.errorHandler && l.errorHandler(e, t, n) || (console.log("Invoking error handler due to\n" + e), "function" == typeof dump && dump("Invoking error handler due to\n" + e), k.didShowErrorMessage || (-1 != (e = "An error occurred running the Unity content on this page. See your browser JavaScript console for more info. The error was:\n" + e).indexOf("DISABLE_EXCEPTION_CATCHING") ? e = "An exception has occurred, but exception handling has been disabled in this build. If you are the developer of this content, enable exceptions in your project WebGL player settings to be able to catch the exception or see the stack trace." : -1 != e.indexOf("Cannot enlarge memory arrays") ? e = "Out of memory. If you are the developer of this content, try allocating more memory to your WebGL build in the WebGL player settings." : -1 == e.indexOf("Invalid array buffer length") && -1 == e.indexOf("Invalid typed array length") && -1 == e.indexOf("out of memory") && -1 == e.indexOf("could not allocate memory") || (e = "The browser could not allocate enough memory for the WebGL content. If you are the developer of this content, try allocating less memory to your WebGL build in the WebGL player settings."), alert(e), k.didShowErrorMessage = !0)))
    }

    function D(e, t) {
        if ("symbolsUrl" != e) {
            var n = l.downloadProgress[e], r = (n = n || (l.downloadProgress[e] = {
                    started: !1,
                    finished: !1,
                    lengthComputable: !1,
                    total: 0,
                    loaded: 0
                }), "object" != typeof t || "progress" != t.type && "load" != t.type || (n.started || (n.started = !0, n.lengthComputable = t.lengthComputable), n.total = t.total, n.loaded = t.loaded, "load" == t.type && (n.finished = !0)), 0),
                o = 0, a = 0, i = 0, s = 0;
            for (e in l.downloadProgress) {
                if (!(n = l.downloadProgress[e]).started) return;
                a++, n.lengthComputable ? (r += n.loaded, o += n.total, i++) : n.finished || s++
            }
            c(.9 * (a ? (a - s - (o ? i * (o - r) / o : 0)) / a : 0))
        }
    }

    function P() {
        var e = this;
        this.isConnected = this.connect().then(function () {
            return e.cleanUpCache()
        }), this.isConnected.catch(function (e) {
            e = "Error when initializing cache: " + e, console.log("[UnityCache] " + e)
        })
    }

    function x(e) {
        console.log("[UnityCache] " + e)
    }

    function U(e) {
        return U.link = U.link || document.createElement("a"), U.link.href = e, U.link.href
    }

    l.SystemInfo = function () {
        let gl, glVersion
        var e, t, n, r, o = navigator.userAgent + " ",
            a = [["Firefox", "Firefox"], ["OPR", "Opera"], ["Edg", "Edge"], ["SamsungBrowser", "Samsung Browser"], ["Trident", "Internet Explorer"], ["MSIE", "Internet Explorer"], ["Chrome", "Chrome"], ["CriOS", "Chrome on iOS Safari"], ["FxiOS", "Firefox on iOS Safari"], ["Safari", "Safari"]];

        function i(e, t, n) {
            return (e = RegExp(e, "i").exec(t)) && e[n]
        }

        for (var s = 0; s < a.length; ++s) if (t = i(a[s][0] + "[/ ](.*?)[ \\)]", o, 1)) {
            e = a[s][1];
            break
        }
        "Safari" == e && (t = i("Version/(.*?) ", o, 1)), "Internet Explorer" == e && (t = i("rv:(.*?)\\)? ", o, 1) || t);
        for (var c = [["Windows (.*?)[;)]", "Windows"], ["Android ([0-9_.]+)", "Android"], ["iPhone OS ([0-9_.]+)", "iPhoneOS"], ["iPad.*? OS ([0-9_.]+)", "iPadOS"], ["FreeBSD( )", "FreeBSD"], ["OpenBSD( )", "OpenBSD"], ["Linux|X11()", "Linux"], ["Mac OS X ([0-9_\\.]+)", "MacOS"], ["bot|google|baidu|bing|msn|teoma|slurp|yandex", "Search Bot"]], d = 0; d < c.length; ++d) if (u = i(c[d][0], o, 1)) {
            n = c[d][1], u = u.replace(/_/g, ".");
            break
        }
        var u = {
                "NT 5.0": "2000",
                "NT 5.1": "XP",
                "NT 5.2": "Server 2003",
                "NT 6.0": "Vista",
                "NT 6.1": "7",
                "NT 6.2": "8",
                "NT 6.3": "8.1",
                "NT 10.0": "10"
            }[u] || u,
            l = ((l = document.createElement("canvas")) && (gl = l.getContext("webgl2"), glVersion = gl ? 2 : 0, gl || (gl = l && l.getContext("webgl")) && (glVersion = 1), gl && (r = gl.getExtension("WEBGL_debug_renderer_info") && gl.getParameter(37446) || gl.getParameter(7937))), "undefined" != typeof SharedArrayBuffer),
            h = "object" == typeof WebAssembly && "function" == typeof WebAssembly.compile;
        return {
            width: screen.width,
            height: screen.height,
            userAgent: o.trim(),
            browser: e || "Unknown browser",
            browserVersion: t || "Unknown version",
            mobile: /Mobile|Android|iP(ad|hone)/.test(navigator.appVersion),
            os: n || "Unknown OS",
            osVersion: u || "Unknown OS Version",
            gpu: r || "Unknown GPU",
            language: navigator.userLanguage || navigator.language,
            hasWebGL: glVersion,
            hasCursorLock: !!document.body.requestPointerLock,
            hasFullscreen: !!document.body.requestFullscreen || !!document.body.webkitRequestFullscreen,
            hasThreads: l,
            hasWasm: h,
            hasWasmThreads: !1
        }
    }(), l.abortHandler = function (e) {
        return k(e, "", 0), !0
    }, Error.stackTraceLimit = Math.max(Error.stackTraceLimit || 0, 50), l.readBodyWithProgress = function (a, i, s) {
        var e = a.body ? a.body.getReader() : void 0, c = void 0 !== a.headers.get("Content-Length"),
            d = function (e, t) {
                if (!t) return 0;
                var t = e.headers.get("Content-Encoding"), n = parseInt(e.headers.get("Content-Length"));
                switch (t) {
                    case "br":
                        return Math.round(5 * n);
                    case "gzip":
                        return Math.round(4 * n);
                    default:
                        return n
                }
            }(a, c), u = new Uint8Array(d), l = [], h = 0, f = 0;
        return c || console.warn("[UnityCache] Response is served without Content-Length header. Please reconfigure server to include valid Content-Length for better download performance."), function o() {
            return void 0 === e ? a.arrayBuffer().then(function (e) {
                var t = new Uint8Array(e);
                return i({
                    type: "progress",
                    response: a,
                    total: e.length,
                    loaded: 0,
                    lengthComputable: c,
                    chunk: s ? t : null
                }), t
            }) : e.read().then(function (e) {
                if (e.done) {
                    if (h === d) return u;
                    if (h < d) return u.slice(0, h);
                    for (var t = new Uint8Array(h), n = (t.set(u, 0), f), r = 0; r < l.length; ++r) t.set(l[r], n), n += l[r].length;
                    return t
                }
                return h + e.value.length <= u.length ? (u.set(e.value, h), f = h + e.value.length) : l.push(e.value), h += e.value.length, i({
                    type: "progress",
                    response: a,
                    total: Math.max(d, h),
                    loaded: h,
                    lengthComputable: c,
                    chunk: s ? e.value : null
                }), o()
            })
        }().then(function (e) {
            return i({
                type: "load",
                response: a,
                total: e.length,
                loaded: e.length,
                lengthComputable: c,
                chunk: null
            }), a.parsedBody = e, a
        })
    }, l.fetchWithProgress = function (e, t) {
        var n = function () {
        };
        return t && t.onProgress && (n = t.onProgress), fetch(e, t).then(function (e) {
            return l.readBodyWithProgress(e, n, t.enableStreamingDownload)
        })
    }, l.UnityCache = (f = {name: "UnityCache", version: 4}, p = {
        name: "RequestMetaDataStore",
        version: 1
    }, m = "RequestStore", g = "WebAssembly", b = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB, v = null, P.getInstance = function () {
        return v = v || new P
    }, P.destroyInstance = function () {
        return v ? v.close().then(function () {
            v = null
        }) : Promise.resolve()
    }, P.prototype.clearCache = function () {
        var r = this;
        return this.isConnected.then(function () {
            return r.execute(p.name, "clear", [])
        }).then(function () {
            return r.cache.keys()
        }).then(function e(t) {
            var n;
            return 0 === t.length ? Promise.resolve() : (n = t.pop(), r.cache.delete(n).then(function () {
                return e(t)
            }))
        })
    }, P.UnityCacheDatabase = f, P.RequestMetaDataStore = p, P.MaximumCacheSize = 1073741824, P.prototype.loadRequest = function (e) {
        var t = this;
        return t.isConnected.then(function () {
            return Promise.all([t.cache.match(e), t.loadRequestMetaData(e)])
        }).then(function (e) {
            if (void 0 !== e[0] && void 0 !== e[1]) return {response: e[0], metaData: e[1]}
        })
    }, P.prototype.loadRequestMetaData = function (e) {
        e = "string" == typeof e ? e : e.url;
        return this.execute(p.name, "get", [e])
    }, P.prototype.updateRequestMetaData = function (e) {
        return this.execute(p.name, "put", [e])
    }, P.prototype.storeRequest = function (e, t) {
        var n = this;
        return n.isConnected.then(function () {
            return n.cache.put(e, t)
        })
    }, P.prototype.close = function () {
        return this.isConnected.then(function () {
            this.database && (this.database.close(), this.database = null), this.cache && (this.cache = null)
        }.bind(this))
    }, P.prototype.connect = function () {
        var o = this;
        return void 0 === b ? Promise.reject(new Error("Could not connect to cache: IndexedDB is not supported.")) : void 0 === window.caches ? Promise.reject(new Error("Could not connect to cache: Cache API is not supported.")) : new Promise(function (t, n) {
            try {
                function r() {
                    o.openDBTimeout && (clearTimeout(o.openDBTimeout), o.openDBTimeout = null)
                }

                o.openDBTimeout = setTimeout(function () {
                    void 0 === o.database && n(new Error("Could not connect to cache: Database timeout."))
                }, 2e4);
                var e = b.open(f.name, f.version);
                e.onupgradeneeded = o.upgradeDatabase.bind(o), e.onsuccess = function (e) {
                    r(), o.database = e.target.result, t()
                }, e.onerror = function (e) {
                    r(), o.database = null, n(new Error("Could not connect to database."))
                }
            } catch (e) {
                r(), o.database = null, o.cache = null, n(new Error("Could not connect to cache: Could not connect to database."))
            }
        }).then(function () {
            var e = f.name + "_" + l.companyName + "_" + l.productName;
            return caches.open(e)
        }).then(function (e) {
            o.cache = e
        })
    }, P.prototype.upgradeDatabase = function (e) {
        var t, e = e.target.result;
        e.objectStoreNames.contains(p.name) || (t = e.createObjectStore(p.name, {keyPath: "url"}), ["accessedAt", "updatedAt"].forEach(function (e) {
            t.createIndex(e, e)
        })), e.objectStoreNames.contains(m) && e.deleteObjectStore(m), e.objectStoreNames.contains(g) && e.deleteObjectStore(g)
    }, P.prototype.execute = function (a, i, s) {
        return this.isConnected.then(function () {
            return new Promise(function (t, n) {
                try {
                    var e, r, o;
                    null === this.database ? n(new Error("indexedDB access denied")) : (e = -1 != ["put", "delete", "clear"].indexOf(i) ? "readwrite" : "readonly", r = this.database.transaction([a], e).objectStore(a), "openKeyCursor" == i && (r = r.index(s[0]), s = s.slice(1)), (o = r[i].apply(r, s)).onsuccess = function (e) {
                        t(e.target.result)
                    }, o.onerror = function (e) {
                        n(e)
                    })
                } catch (e) {
                    n(e)
                }
            }.bind(this))
        }.bind(this))
    }, P.prototype.getMetaDataEntries = function () {
        var r = this, o = 0, a = [];
        return new Promise(function (t, n) {
            var e = r.database.transaction([p.name], "readonly").objectStore(p.name).openCursor();
            e.onsuccess = function (e) {
                e = e.target.result;
                e ? (o += e.value.size, a.push(e.value), e.continue()) : t({metaDataEntries: a, cacheSize: o})
            }, e.onerror = function (e) {
                n(e)
            }
        })
    }, P.prototype.cleanUpCache = function () {
        var i = this;
        return this.getMetaDataEntries().then(function (e) {
            for (var t = e.metaDataEntries, n = e.cacheSize, r = [], o = [], a = 0; a < t.length; ++a) t[a].version == l.productVersion ? o.push(t[a]) : (r.push(t[a]), n -= t[a].size);
            o.sort(function (e, t) {
                return e.accessedAt - t.accessedAt
            });
            for (a = 0; a < o.length && !(n < P.MaximumCacheSize); ++a) r.push(o[a]), n -= o[a].size;
            return function e() {
                var t;
                return 0 === r.length ? Promise.resolve() : (t = r.pop(), i.cache.delete(t.url).then(function (e) {
                    if (e) return r = t.url, new Promise(function (e, t) {
                        var n = i.database.transaction([p.name], "readwrite");
                        n.objectStore(p.name).delete(r), n.oncomplete = e, n.onerror = t
                    });
                    var r
                }).then(e))
            }()
        })
    }, P), l.cachedFetch = (w = l.UnityCache, y = l.fetchWithProgress, S = l.readBodyWithProgress, function (o, a) {
        var e, t, i = w.getInstance(), s = U("string" == typeof o ? o : o.url),
            c = {enabled: (e = s, (!(t = a) || !t.method || "GET" === t.method) && ((!t || -1 != ["must-revalidate", "immutable"].indexOf(t.control)) && !!e.match("^https?://")))};

        function d(n, r) {
            return fetch(n, r).then(function (e) {
                var t;
                return !c.enabled || c.revalidated ? e : 304 === e.status ? (c.revalidated = !0, i.updateRequestMetaData(c.metaData).then(function () {
                    x("'" + c.metaData.url + "' successfully revalidated and served from the indexedDB cache")
                }).catch(function (e) {
                    x("'" + c.metaData.url + "' successfully revalidated but not stored in the indexedDB cache due to the error: " + e)
                }), S(c.response, r.onProgress, r.enableStreamingDownload)) : 200 == e.status ? (c.response = e, c.metaData.updatedAt = c.metaData.accessedAt, c.revalidated = !0, t = e.clone(), S(e, r.onProgress, r.enableStreamingDownload).then(function (e) {
                    return c.metaData.size = e.parsedBody.length, Promise.all([i.storeRequest(n, t), i.updateRequestMetaData(c.metaData)]).then(function () {
                        x("'" + s + "' successfully downloaded and stored in the indexedDB cache")
                    }).catch(function (e) {
                        x("'" + s + "' successfully downloaded but not stored in the indexedDB cache due to the error: " + e)
                    }), e
                })) : (x("'" + s + "' request failed with status: " + e.status + " " + e.statusText), S(e, r.onProgress, r.enableStreamingDownload))
            })
        }

        return a && (c.control = a.control, c.companyName = a.companyName, c.productName = a.productName, c.productVersion = a.productVersion), c.revalidated = !1, c.metaData = {
            url: s,
            accessedAt: Date.now(),
            version: c.productVersion
        }, c.response = null, c.enabled ? i.loadRequest(s).then(function (e) {
            var n, r, t;
            return e ? (n = e.response, r = e.metaData, c.response = n, c.metaData.size = r.size, c.metaData.updatedAt = r.updatedAt, "immutable" == c.control ? (c.revalidated = !0, i.updateRequestMetaData(r).then(function () {
                x("'" + c.metaData.url + "' served from the indexedDB cache without revalidation")
            }), S(n, a.onProgress, a.enableStreamingDownload)) : (e = s, (t = window.location.href.match(/^[a-z]+:\/\/[^\/]+/)) && !e.lastIndexOf(t[0], 0) || !n.headers.get("Last-Modified") && !n.headers.get("ETag") ? (e = (a = a || {}).headers || {}, a.headers = e, n.headers.get("Last-Modified") ? (e["If-Modified-Since"] = n.headers.get("Last-Modified"), e["Cache-Control"] = "no-cache") : n.headers.get("ETag") && (e["If-None-Match"] = n.headers.get("ETag"), e["Cache-Control"] = "no-cache"), d(o, a)) : fetch(s, {method: "HEAD"}).then(function (t) {
                return c.revalidated = ["Last-Modified", "ETag"].every(function (e) {
                    return !n.headers.get(e) || n.headers.get(e) == t.headers.get(e)
                }), c.revalidated ? (i.updateRequestMetaData(r).then(function () {
                    x("'" + c.metaData.url + "' successfully revalidated and served from the indexedDB cache")
                }), S(c.response, a.onProgress, a.enableStreamingDownload)) : d(o, a)
            }))) : d(o, a)
        }).catch(function (e) {
            return x("Failed to load '" + c.metaData.url + "' from indexedDB cache due to the error: " + e), y(o, a)
        }) : y(o, a)
    });
    var E = {};

    function T(n) {
        D(n);
        var e = l.cacheControl(l[n]), t = l.companyName && l.productName ? l.cachedFetch : l.fetchWithProgress,
            r = l[n], r = /file:\/\//.exec(r) ? "same-origin" : void 0;
        return t(l[n], {
            method: "GET",
            companyName: l.companyName,
            productName: l.productName,
            productVersion: l.productVersion,
            control: e,
            mode: r,
            onProgress: function (e) {
                D(n, e)
            }
        }).then(function (e) {
            return i = e.parsedBody, s = l[n], new Promise(function (e, t) {
                try {
                    for (var n in E) {
                        var r, o, a;
                        if (E[n].hasUnityMarker(i)) return s && console.log('You can reduce startup time if you configure your web server to add "Content-Encoding: ' + n + '" response header when serving "' + s + '" file.'), (r = E[n]).worker || (o = URL.createObjectURL(new Blob(["this.require = ", r.require.toString(), "; this.decompress = ", r.decompress.toString(), "; this.onmessage = ", function (e) {
                            e = {id: e.data.id, decompressed: this.decompress(e.data.compressed)};
                            postMessage(e, e.decompressed ? [e.decompressed.buffer] : [])
                        }.toString(), "; postMessage({ ready: true });"], {type: "application/javascript"})), r.worker = new Worker(o), r.worker.onmessage = function (e) {
                            e.data.ready ? URL.revokeObjectURL(o) : (this.callbacks[e.data.id](e.data.decompressed), delete this.callbacks[e.data.id])
                        }, r.worker.callbacks = {}, r.worker.nextCallbackId = 0), a = r.worker.nextCallbackId++, r.worker.callbacks[a] = e, void r.worker.postMessage({
                            id: a,
                            compressed: i
                        }, [i.buffer])
                    }
                    e(i)
                } catch (e) {
                    t(e)
                }
            });
            var i, s
        }).catch(function (e) {
            var t = "Failed to download file " + l[n];
            "file:" == location.protocol ? d(t + ". Loading web pages via a file:// URL without a web server is not supported by this browser. Please use a local development web server to host Unity content, or use the Unity Build and Run option.", "error") : console.error(t)
        })
    }

    function L() {
        Promise.all([T("frameworkUrl").then(function (e) {
            var s = URL.createObjectURL(new Blob([e], {type: "application/javascript"}));
            return new Promise(function (a, e) {
                var i = document.createElement("script");
                i.src = s, i.onload = function () {
                    if ("undefined" == typeof unityFramework || !unityFramework) {
                        var e, t = [["br", "br"], ["gz", "gzip"]];
                        for (e in t) {
                            var n, r = t[e];
                            if (l.frameworkUrl.endsWith("." + r[0])) return n = "Unable to parse " + l.frameworkUrl + "!", "file:" == location.protocol ? void d(n + " Loading pre-compressed (brotli or gzip) content via a file:// URL without a web server is not supported by this browser. Please use a local development web server to host compressed Unity content, or use the Unity Build and Run option.", "error") : (n += ' This can happen if build compression was enabled but web server hosting the content was misconfigured to not serve the file with HTTP Response Header "Content-Encoding: ' + r[1] + '" present. Check browser Console and Devtools Network tab to debug.', "br" == r[0] && "http:" == location.protocol && (r = -1 != ["localhost", "127.0.0.1"].indexOf(location.hostname) ? "" : "Migrate your server to use HTTPS.", n = /Firefox/.test(navigator.userAgent) ? "Unable to parse " + l.frameworkUrl + '!<br>If using custom web server, verify that web server is sending .br files with HTTP Response Header "Content-Encoding: br". Brotli compression may not be supported in Firefox over HTTP connections. ' + r + ' See <a href="https://bugzilla.mozilla.org/show_bug.cgi?id=1670675">https://bugzilla.mozilla.org/show_bug.cgi?id=1670675</a> for more information.' : "Unable to parse " + l.frameworkUrl + '!<br>If using custom web server, verify that web server is sending .br files with HTTP Response Header "Content-Encoding: br". Brotli compression may not be supported over HTTP connections. Migrate your server to use HTTPS.'), void d(n, "error"))
                        }
                        d("Unable to parse " + l.frameworkUrl + "! The file is corrupt, or compression was misconfigured? (check Content-Encoding HTTP Response Header on web server)", "error")
                    }
                    var o = unityFramework;
                    unityFramework = null, i.onload = null, URL.revokeObjectURL(s), a(o)
                }, i.onerror = function (e) {
                    d("Unable to load file " + l.frameworkUrl + "! Check that the file exists on the remote server. (also check browser Console and Devtools Network tab to debug)", "error")
                }, document.body.appendChild(i), l.deinitializers.push(function () {
                    document.body.removeChild(i)
                })
            })
        }), T("codeUrl")]).then(function (e) {
            l.wasmBinary = e[1], e[0](l)
        });
        var e = T("dataUrl");
        l.preRun.push(function () {
            l.addRunDependency("dataUrl"), e.then(function (e) {
                var t = new DataView(e.buffer, e.byteOffset, e.byteLength), n = 0, r = "UnityWebData1.0\0";
                if (!String.fromCharCode.apply(null, e.subarray(n, n + r.length)) == r) throw "unknown data format";
                var o = t.getUint32(n += r.length, !0);
                for (n += 4; n < o;) {
                    var a = t.getUint32(n, !0), i = (n += 4, t.getUint32(n, !0)), s = (n += 4, t.getUint32(n, !0)),
                        c = (n += 4, String.fromCharCode.apply(null, e.subarray(n, n + s)));
                    n += s;
                    for (var d = 0, u = c.indexOf("/", d) + 1; 0 < u; d = u, u = c.indexOf("/", d) + 1) l.FS_createPath(c.substring(0, d), c.substring(d, u - 1), !0, !0);
                    l.FS_createDataFile(c, null, e.subarray(a, a + i), !0, !0, !0)
                }
                l.removeRunDependency("dataUrl")
            })
        })
    }

    return new Promise(function (e, t) {
        var n;
        l.SystemInfo.hasWebGL ? 1 == l.SystemInfo.hasWebGL ? (n = 'Your browser does not support graphics API "WebGL 2" which is required for this content.', "Safari" == l.SystemInfo.browser && parseInt(l.SystemInfo.browserVersion) < 15 && (l.SystemInfo.mobile || 1 < navigator.maxTouchPoints ? n += "\nUpgrade to iOS 15 or later." : n += "\nUpgrade to Safari 15 or later."), t(n)) : l.SystemInfo.hasWasm ? (l.startupErrorHandler = t, c(0), l.postRun.push(function () {
            c(1), delete l.startupErrorHandler, e(C)
        }), L()) : t("Your browser does not support WebAssembly.") : t("Your browser does not support WebGL.")
    })
}

export default createUnityInstance