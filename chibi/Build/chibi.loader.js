function createUnityInstance(t, n, l) {
  function c(e, t) {
    if (!c.aborted && n.showBanner)
      return "error" == t && (c.aborted = !0), n.showBanner(e, t);
    switch (t) {
      case "error":
        console.error(e);
        break;
      case "warning":
        console.warn(e);
        break;
      default:
        console.log(e);
    }
  }
  function r(e) {
    var t = e.reason || e.error,
      n = t ? t.toString() : e.message || e.reason || "",
      r = t && t.stack ? t.stack.toString() : "";
    (n += "\n" + (r = r.startsWith(n) ? r.substring(n.length) : r).trim()) &&
      u.stackTraceRegExp &&
      u.stackTraceRegExp.test(n) &&
      x(
        n,
        e.filename || (t && (t.fileName || t.sourceURL)) || "",
        e.lineno || (t && (t.lineNumber || t.line)) || 0
      );
  }
  function e(e, t, n) {
    var r = e[t];
    (void 0 !== r && r) ||
      (console.warn(
        'Config option "' +
          t +
          '" is missing or empty. Falling back to default value: "' +
          n +
          '". Consider updating your WebGL template to include the missing config option.'
      ),
      (e[t] = n));
  }
  l = l || function () {};
  var o,
    u = {
      canvas: t,
      webglContextAttributes: { preserveDrawingBuffer: !1, powerPreference: 2 },
      cacheControl: function (e) {
        return e == u.dataUrl || e.match(/\.bundle/)
          ? "must-revalidate"
          : "no-store";
      },
      streamingAssetsUrl: "StreamingAssets",
      downloadProgress: {},
      deinitializers: [],
      intervals: {},
      setInterval: function (e, t) {
        e = window.setInterval(e, t);
        return (this.intervals[e] = !0), e;
      },
      clearInterval: function (e) {
        delete this.intervals[e], window.clearInterval(e);
      },
      preRun: [],
      postRun: [],
      print: function (e) {
        console.log(e);
      },
      printErr: function (e) {
        console.error(e),
          "string" == typeof e &&
            -1 != e.indexOf("wasm streaming compile failed") &&
            (-1 != e.toLowerCase().indexOf("mime")
              ? c(
                  'HTTP Response Header "Content-Type" configured incorrectly on the server for file ' +
                    u.codeUrl +
                    ' , should be "application/wasm". Startup time performance will suffer.',
                  "warning"
                )
              : c(
                  'WebAssembly streaming compilation failed! This can happen for example if "Content-Encoding" HTTP header is incorrectly enabled on the server for file ' +
                    u.codeUrl +
                    ", but the file is not pre-compressed on disk (or vice versa). Check the Network tab in browser Devtools to debug server header configuration.",
                  "warning"
                ));
      },
      locateFile: function (e) {
        return e;
      },
      disabledCanvasEvents: ["contextmenu", "dragstart"],
    };
  for (o in (e(n, "companyName", "Unity"),
  e(n, "productName", "WebGL Player"),
  e(n, "productVersion", "0.17"),
  n))
    u[o] = n[o];
  u.streamingAssetsUrl = new URL(u.streamingAssetsUrl, document.URL).href;
  var a = u.disabledCanvasEvents.slice();
  function i(e) {
    e.preventDefault();
  }
  a.forEach(function (e) {
    t.addEventListener(e, i);
  }),
    window.addEventListener("error", r),
    window.addEventListener("unhandledrejection", r);
  var s = "",
    d = "";
  function f(e) {
    document.webkitCurrentFullScreenElement === t
      ? t.style.width &&
        ((s = t.style.width),
        (d = t.style.height),
        (t.style.width = "100%"),
        (t.style.height = "100%"))
      : s && ((t.style.width = s), (t.style.height = d), (d = s = ""));
  }
  document.addEventListener("webkitfullscreenchange", f),
    u.deinitializers.push(function () {
      for (var e in (u.disableAccessToMediaDevices(),
      a.forEach(function (e) {
        t.removeEventListener(e, i);
      }),
      window.removeEventListener("error", r),
      window.removeEventListener("unhandledrejection", r),
      document.removeEventListener("webkitfullscreenchange", f),
      u.intervals))
        window.clearInterval(e);
      u.intervals = {};
    }),
    (u.QuitCleanup = function () {
      for (var e = 0; e < u.deinitializers.length; e++) u.deinitializers[e]();
      (u.deinitializers = []), "function" == typeof u.onQuit && u.onQuit();
    });
  var h,
    m,
    b,
    g,
    p,
    w,
    v,
    y,
    k,
    gl,
    glVersion,
    _ = {
      Module: u,
      SetFullscreen: function () {
        if (u.SetFullscreen) return u.SetFullscreen.apply(u, arguments);
        u.print("Failed to set Fullscreen mode: Player not loaded yet.");
      },
      SendMessage: function () {
        if (u.SendMessage) return u.SendMessage.apply(u, arguments);
        u.print("Failed to execute SendMessage: Player not loaded yet.");
      },
      Quit: function () {
        return new Promise(function (e, t) {
          (u.shouldQuit = !0), (u.onQuit = e);
        });
      },
      GetMemoryInfo: function () {
        var e = u._getMemInfo();
        return {
          totalWASMHeapSize: u.HEAPU32[e >> 2],
          usedWASMHeapSize: u.HEAPU32[1 + (e >> 2)],
          totalJSHeapSize: u.HEAPF64[1 + (e >> 3)],
          usedJSHeapSize: u.HEAPF64[2 + (e >> 3)],
        };
      },
    };
  function x(e, t, n) {
    -1 == e.indexOf("fullscreen error") &&
      (u.startupErrorHandler
        ? u.startupErrorHandler(e, t, n)
        : (u.errorHandler && u.errorHandler(e, t, n)) ||
          (console.log("Invoking error handler due to\n" + e),
          "function" == typeof dump &&
            dump("Invoking error handler due to\n" + e),
          x.didShowErrorMessage ||
            (-1 !=
            (e =
              "An error occurred running the Unity content on this page. See your browser JavaScript console for more info. The error was:\n" +
              e).indexOf("DISABLE_EXCEPTION_CATCHING")
              ? (e =
                  "An exception has occurred, but exception handling has been disabled in this build. If you are the developer of this content, enable exceptions in your project WebGL player settings to be able to catch the exception or see the stack trace.")
              : -1 != e.indexOf("Cannot enlarge memory arrays")
              ? (e =
                  "Out of memory. If you are the developer of this content, try allocating more memory to your WebGL build in the WebGL player settings.")
              : (-1 == e.indexOf("Invalid array buffer length") &&
                  -1 == e.indexOf("Invalid typed array length") &&
                  -1 == e.indexOf("out of memory") &&
                  -1 == e.indexOf("could not allocate memory")) ||
                (e =
                  "The browser could not allocate enough memory for the WebGL content. If you are the developer of this content, try allocating less memory to your WebGL build in the WebGL player settings."),
            alert(e),
            (x.didShowErrorMessage = !0))));
  }
  function S(e, t) {
    if ("symbolsUrl" != e) {
      var n = u.downloadProgress[e],
        r =
          ((n =
            n ||
            (u.downloadProgress[e] = {
              started: !1,
              finished: !1,
              lengthComputable: !1,
              total: 0,
              loaded: 0,
            })),
          "object" != typeof t ||
            ("progress" != t.type && "load" != t.type) ||
            (n.started ||
              ((n.started = !0), (n.lengthComputable = t.lengthComputable)),
            (n.total = t.total),
            (n.loaded = t.loaded),
            "load" == t.type && (n.finished = !0)),
          0),
        o = 0,
        a = 0,
        i = 0,
        s = 0;
      for (e in u.downloadProgress) {
        if (!(n = u.downloadProgress[e]).started) return;
        a++,
          n.lengthComputable
            ? ((r += n.loaded), (o += n.total), i++)
            : n.finished || s++;
      }
      l(0.9 * (a ? (a - s - (o ? (i * (o - r)) / o : 0)) / a : 0));
    }
  }
  function C() {
    var e = this;
    (this.isConnected = this.connect().then(function () {
      return e.cleanUpCache();
    })),
      this.isConnected.catch(function (e) {
        (e = "Error when initializing cache: " + e),
          console.log("[UnityCache] " + e);
      });
  }
  function E(e) {
    console.log("[UnityCache] " + e);
  }
  function U(e) {
    return (
      (U.link = U.link || document.createElement("a")),
      (U.link.href = e),
      U.link.href
    );
  }
  (u.SystemInfo = (function () {
    var e,
      t,
      n,
      r,
      o = navigator.userAgent + " ",
      a = [
        ["Firefox", "Firefox"],
        ["OPR", "Opera"],
        ["Edg", "Edge"],
        ["SamsungBrowser", "Samsung Browser"],
        ["Trident", "Internet Explorer"],
        ["MSIE", "Internet Explorer"],
        ["Chrome", "Chrome"],
        ["CriOS", "Chrome on iOS Safari"],
        ["FxiOS", "Firefox on iOS Safari"],
        ["Safari", "Safari"],
      ];
    function i(e, t, n) {
      return (e = RegExp(e, "i").exec(t)) && e[n];
    }
    for (var s = 0; s < a.length; ++s)
      if ((t = i(a[s][0] + "[/ ](.*?)[ \\)]", o, 1))) {
        e = a[s][1];
        break;
      }
    "Safari" == e && (t = i("Version/(.*?) ", o, 1)),
      "Internet Explorer" == e && (t = i("rv:(.*?)\\)? ", o, 1) || t);
    for (
      var l = [
          ["Windows (.*?)[;)]", "Windows"],
          ["Android ([0-9_.]+)", "Android"],
          ["iPhone OS ([0-9_.]+)", "iPhoneOS"],
          ["iPad.*? OS ([0-9_.]+)", "iPadOS"],
          ["FreeBSD( )", "FreeBSD"],
          ["OpenBSD( )", "OpenBSD"],
          ["Linux|X11()", "Linux"],
          ["Mac OS X ([0-9_\\.]+)", "MacOS"],
          ["bot|google|baidu|bing|msn|teoma|slurp|yandex", "Search Bot"],
        ],
        c = 0;
      c < l.length;
      ++c
    )
      if ((d = i(l[c][0], o, 1))) {
        (n = l[c][1]), (d = d.replace(/_/g, "."));
        break;
      }
    var d =
        {
          "NT 5.0": "2000",
          "NT 5.1": "XP",
          "NT 5.2": "Server 2003",
          "NT 6.0": "Vista",
          "NT 6.1": "7",
          "NT 6.2": "8",
          "NT 6.3": "8.1",
          "NT 10.0": "10",
        }[d] || d,
      u =
        ((u = document.createElement("canvas")) &&
          ((gl = u.getContext("webgl2")),
          (glVersion = gl ? 2 : 0),
          gl || ((gl = u && u.getContext("webgl")) && (glVersion = 1)),
          gl &&
            (r =
              (gl.getExtension("WEBGL_debug_renderer_info") &&
                gl.getParameter(37446)) ||
              gl.getParameter(7937))),
        "undefined" != typeof SharedArrayBuffer),
      f =
        "object" == typeof WebAssembly &&
        "function" == typeof WebAssembly.compile;
    return {
      width: screen.width,
      height: screen.height,
      userAgent: o.trim(),
      browser: e || "Unknown browser",
      browserVersion: t || "Unknown version",
      mobile: /Mobile|Android|iP(ad|hone)/.test(navigator.appVersion),
      os: n || "Unknown OS",
      osVersion: d || "Unknown OS Version",
      gpu: r || "Unknown GPU",
      language: navigator.userLanguage || navigator.language,
      hasWebGL: glVersion,
      hasCursorLock: !!document.body.requestPointerLock,
      hasFullscreen:
        !!document.body.requestFullscreen ||
        !!document.body.webkitRequestFullscreen,
      hasThreads: u,
      hasWasm: f,
      hasWasmThreads: !1,
    };
  })()),
    (u.abortHandler = function (e) {
      return x(e, "", 0), !0;
    }),
    (Error.stackTraceLimit = Math.max(Error.stackTraceLimit || 0, 50)),
    (u.readBodyWithProgress = function (a, i, s) {
      var e = a.body ? a.body.getReader() : void 0,
        l = void 0 !== a.headers.get("Content-Length"),
        c = (function (e, t) {
          if (!t) return 0;
          var t = e.headers.get("Content-Encoding"),
            n = parseInt(e.headers.get("Content-Length"));
          switch (t) {
            case "br":
              return Math.round(5 * n);
            case "gzip":
              return Math.round(4 * n);
            default:
              return n;
          }
        })(a, l),
        d = new Uint8Array(c),
        u = [],
        f = 0,
        h = 0;
      return (
        l ||
          console.warn(
            "[UnityCache] Response is served without Content-Length header. Please reconfigure server to include valid Content-Length for better download performance."
          ),
        (function o() {
          return void 0 === e
            ? a.arrayBuffer().then(function (e) {
                var t = new Uint8Array(e);
                return (
                  i({
                    type: "progress",
                    response: a,
                    total: e.length,
                    loaded: 0,
                    lengthComputable: l,
                    chunk: s ? t : null,
                  }),
                  t
                );
              })
            : e.read().then(function (e) {
                if (e.done) {
                  if (f === c) return d;
                  if (f < c) return d.slice(0, f);
                  for (
                    var t = new Uint8Array(f), n = (t.set(d, 0), h), r = 0;
                    r < u.length;
                    ++r
                  )
                    t.set(u[r], n), (n += u[r].length);
                  return t;
                }
                return (
                  f + e.value.length <= d.length
                    ? (d.set(e.value, f), (h = f + e.value.length))
                    : u.push(e.value),
                  (f += e.value.length),
                  i({
                    type: "progress",
                    response: a,
                    total: Math.max(c, f),
                    loaded: f,
                    lengthComputable: l,
                    chunk: s ? e.value : null,
                  }),
                  o()
                );
              });
        })().then(function (e) {
          return (
            i({
              type: "load",
              response: a,
              total: e.length,
              loaded: e.length,
              lengthComputable: l,
              chunk: null,
            }),
            (a.parsedBody = e),
            a
          );
        })
      );
    }),
    (u.fetchWithProgress = function (e, t) {
      var n = function () {};
      return (
        t && t.onProgress && (n = t.onProgress),
        fetch(e, t).then(function (e) {
          return u.readBodyWithProgress(e, n, t.enableStreamingDownload);
        })
      );
    }),
    (u.UnityCache =
      ((h = { name: "UnityCache", version: 4 }),
      (m = { name: "RequestMetaDataStore", version: 1 }),
      (b = "RequestStore"),
      (g = "WebAssembly"),
      (p =
        window.indexedDB ||
        window.mozIndexedDB ||
        window.webkitIndexedDB ||
        window.msIndexedDB),
      (w = null),
      (C.getInstance = function () {
        return (w = w || new C());
      }),
      (C.destroyInstance = function () {
        return w
          ? w.close().then(function () {
              w = null;
            })
          : Promise.resolve();
      }),
      (C.prototype.clearCache = function () {
        var r = this;
        return this.isConnected
          .then(function () {
            return r.execute(m.name, "clear", []);
          })
          .then(function () {
            return r.cache.keys();
          })
          .then(function e(t) {
            var n;
            return 0 === t.length
              ? Promise.resolve()
              : ((n = t.pop()),
                r.cache.delete(n).then(function () {
                  return e(t);
                }));
          });
      }),
      (C.UnityCacheDatabase = h),
      (C.RequestMetaDataStore = m),
      (C.MaximumCacheSize = 1073741824),
      (C.prototype.loadRequest = function (e) {
        var t = this;
        return t.isConnected
          .then(function () {
            return Promise.all([t.cache.match(e), t.loadRequestMetaData(e)]);
          })
          .then(function (e) {
            if (void 0 !== e[0] && void 0 !== e[1])
              return { response: e[0], metaData: e[1] };
          });
      }),
      (C.prototype.loadRequestMetaData = function (e) {
        e = "string" == typeof e ? e : e.url;
        return this.execute(m.name, "get", [e]);
      }),
      (C.prototype.updateRequestMetaData = function (e) {
        return this.execute(m.name, "put", [e]);
      }),
      (C.prototype.storeRequest = function (e, t) {
        var n = this;
        return n.isConnected.then(function () {
          return n.cache.put(e, t);
        });
      }),
      (C.prototype.close = function () {
        return this.isConnected.then(
          function () {
            this.database && (this.database.close(), (this.database = null)),
              this.cache && (this.cache = null);
          }.bind(this)
        );
      }),
      (C.prototype.connect = function () {
        var o = this;
        return void 0 === p
          ? Promise.reject(
              new Error(
                "Could not connect to cache: IndexedDB is not supported."
              )
            )
          : void 0 === window.caches
          ? Promise.reject(
              new Error(
                "Could not connect to cache: Cache API is not supported."
              )
            )
          : new Promise(function (t, n) {
              try {
                function r() {
                  o.openDBTimeout &&
                    (clearTimeout(o.openDBTimeout), (o.openDBTimeout = null));
                }
                o.openDBTimeout = setTimeout(function () {
                  void 0 === o.database &&
                    n(
                      new Error("Could not connect to cache: Database timeout.")
                    );
                }, 2e4);
                var e = p.open(h.name, h.version);
                (e.onupgradeneeded = o.upgradeDatabase.bind(o)),
                  (e.onsuccess = function (e) {
                    r(), (o.database = e.target.result), t();
                  }),
                  (e.onerror = function (e) {
                    r(),
                      (o.database = null),
                      n(new Error("Could not connect to database."));
                  });
              } catch (e) {
                r(),
                  (o.database = null),
                  (o.cache = null),
                  n(
                    new Error(
                      "Could not connect to cache: Could not connect to database."
                    )
                  );
              }
            })
              .then(function () {
                var e = h.name + "_" + u.companyName + "_" + u.productName;
                return caches.open(e);
              })
              .then(function (e) {
                o.cache = e;
              });
      }),
      (C.prototype.upgradeDatabase = function (e) {
        var t,
          e = e.target.result;
        e.objectStoreNames.contains(m.name) ||
          ((t = e.createObjectStore(m.name, { keyPath: "url" })),
          ["accessedAt", "updatedAt"].forEach(function (e) {
            t.createIndex(e, e);
          })),
          e.objectStoreNames.contains(b) && e.deleteObjectStore(b),
          e.objectStoreNames.contains(g) && e.deleteObjectStore(g);
      }),
      (C.prototype.execute = function (a, i, s) {
        return this.isConnected.then(
          function () {
            return new Promise(
              function (t, n) {
                try {
                  var e, r, o;
                  null === this.database
                    ? n(new Error("indexedDB access denied"))
                    : ((e =
                        -1 != ["put", "delete", "clear"].indexOf(i)
                          ? "readwrite"
                          : "readonly"),
                      (r = this.database.transaction([a], e).objectStore(a)),
                      "openKeyCursor" == i &&
                        ((r = r.index(s[0])), (s = s.slice(1))),
                      ((o = r[i].apply(r, s)).onsuccess = function (e) {
                        t(e.target.result);
                      }),
                      (o.onerror = function (e) {
                        n(e);
                      }));
                } catch (e) {
                  n(e);
                }
              }.bind(this)
            );
          }.bind(this)
        );
      }),
      (C.prototype.getMetaDataEntries = function () {
        var r = this,
          o = 0,
          a = [];
        return new Promise(function (t, n) {
          var e = r.database
            .transaction([m.name], "readonly")
            .objectStore(m.name)
            .openCursor();
          (e.onsuccess = function (e) {
            e = e.target.result;
            e
              ? ((o += e.value.size), a.push(e.value), e.continue())
              : t({ metaDataEntries: a, cacheSize: o });
          }),
            (e.onerror = function (e) {
              n(e);
            });
        });
      }),
      (C.prototype.cleanUpCache = function () {
        var i = this;
        return this.getMetaDataEntries().then(function (e) {
          for (
            var t = e.metaDataEntries, n = e.cacheSize, r = [], o = [], a = 0;
            a < t.length;
            ++a
          )
            t[a].version == u.productVersion
              ? o.push(t[a])
              : (r.push(t[a]), (n -= t[a].size));
          o.sort(function (e, t) {
            return e.accessedAt - t.accessedAt;
          });
          for (a = 0; a < o.length && !(n < C.MaximumCacheSize); ++a)
            r.push(o[a]), (n -= o[a].size);
          return (function e() {
            var t;
            return 0 === r.length
              ? Promise.resolve()
              : ((t = r.pop()),
                i.cache
                  .delete(t.url)
                  .then(function (e) {
                    if (e)
                      return (
                        (r = t.url),
                        new Promise(function (e, t) {
                          var n = i.database.transaction([m.name], "readwrite");
                          n.objectStore(m.name).delete(r),
                            (n.oncomplete = e),
                            (n.onerror = t);
                        })
                      );
                    var r;
                  })
                  .then(e));
          })();
        });
      }),
      C)),
    (u.cachedFetch =
      ((v = u.UnityCache),
      (y = u.fetchWithProgress),
      (k = u.readBodyWithProgress),
      function (o, a) {
        var e,
          t,
          i = v.getInstance(),
          s = U("string" == typeof o ? o : o.url),
          l = {
            enabled:
              ((e = s),
              (!(t = a) || !t.method || "GET" === t.method) &&
                (!t ||
                  -1 != ["must-revalidate", "immutable"].indexOf(t.control)) &&
                !!e.match("^https?://")),
          };
        function c(n, r) {
          return fetch(n, r).then(function (e) {
            var t;
            return !l.enabled || l.revalidated
              ? e
              : 304 === e.status
              ? ((l.revalidated = !0),
                i
                  .updateRequestMetaData(l.metaData)
                  .then(function () {
                    E(
                      "'" +
                        l.metaData.url +
                        "' successfully revalidated and served from the indexedDB cache"
                    );
                  })
                  .catch(function (e) {
                    E(
                      "'" +
                        l.metaData.url +
                        "' successfully revalidated but not stored in the indexedDB cache due to the error: " +
                        e
                    );
                  }),
                k(l.response, r.onProgress, r.enableStreamingDownload))
              : 200 == e.status
              ? ((l.response = e),
                (l.metaData.updatedAt = l.metaData.accessedAt),
                (l.revalidated = !0),
                (t = e.clone()),
                k(e, r.onProgress, r.enableStreamingDownload).then(function (
                  e
                ) {
                  return (
                    (l.metaData.size = e.parsedBody.length),
                    Promise.all([
                      i.storeRequest(n, t),
                      i.updateRequestMetaData(l.metaData),
                    ])
                      .then(function () {
                        E(
                          "'" +
                            s +
                            "' successfully downloaded and stored in the indexedDB cache"
                        );
                      })
                      .catch(function (e) {
                        E(
                          "'" +
                            s +
                            "' successfully downloaded but not stored in the indexedDB cache due to the error: " +
                            e
                        );
                      }),
                    e
                  );
                }))
              : (E(
                  "'" +
                    s +
                    "' request failed with status: " +
                    e.status +
                    " " +
                    e.statusText
                ),
                k(e, r.onProgress, r.enableStreamingDownload));
          });
        }
        return (
          a &&
            ((l.control = a.control),
            (l.companyName = a.companyName),
            (l.productName = a.productName),
            (l.productVersion = a.productVersion)),
          (l.revalidated = !1),
          (l.metaData = {
            url: s,
            accessedAt: Date.now(),
            version: l.productVersion,
          }),
          (l.response = null),
          l.enabled
            ? i
                .loadRequest(s)
                .then(function (e) {
                  var n, r, t;
                  return e
                    ? ((n = e.response),
                      (r = e.metaData),
                      (l.response = n),
                      (l.metaData.size = r.size),
                      (l.metaData.updatedAt = r.updatedAt),
                      "immutable" == l.control
                        ? ((l.revalidated = !0),
                          i.updateRequestMetaData(r).then(function () {
                            E(
                              "'" +
                                l.metaData.url +
                                "' served from the indexedDB cache without revalidation"
                            );
                          }),
                          k(n, a.onProgress, a.enableStreamingDownload))
                        : ((e = s),
                          ((t =
                            window.location.href.match(/^[a-z]+:\/\/[^\/]+/)) &&
                            !e.lastIndexOf(t[0], 0)) ||
                          (!n.headers.get("Last-Modified") &&
                            !n.headers.get("ETag"))
                            ? ((e = (a = a || {}).headers || {}),
                              (a.headers = e),
                              n.headers.get("Last-Modified")
                                ? ((e["If-Modified-Since"] =
                                    n.headers.get("Last-Modified")),
                                  (e["Cache-Control"] = "no-cache"))
                                : n.headers.get("ETag") &&
                                  ((e["If-None-Match"] = n.headers.get("ETag")),
                                  (e["Cache-Control"] = "no-cache")),
                              c(o, a))
                            : fetch(s, { method: "HEAD" }).then(function (t) {
                                return (
                                  (l.revalidated = [
                                    "Last-Modified",
                                    "ETag",
                                  ].every(function (e) {
                                    return (
                                      !n.headers.get(e) ||
                                      n.headers.get(e) == t.headers.get(e)
                                    );
                                  })),
                                  l.revalidated
                                    ? (i
                                        .updateRequestMetaData(r)
                                        .then(function () {
                                          E(
                                            "'" +
                                              l.metaData.url +
                                              "' successfully revalidated and served from the indexedDB cache"
                                          );
                                        }),
                                      k(
                                        l.response,
                                        a.onProgress,
                                        a.enableStreamingDownload
                                      ))
                                    : c(o, a)
                                );
                              })))
                    : c(o, a);
                })
                .catch(function (e) {
                  return (
                    E(
                      "Failed to load '" +
                        l.metaData.url +
                        "' from indexedDB cache due to the error: " +
                        e
                    ),
                    y(o, a)
                  );
                })
            : y(o, a)
        );
      }));
  var D = {
    gzip: {
      require: function (e) {
        var t,
          n = {
            "inflate.js": function (e, t, n) {
              "use strict";
              var u = e("./zlib/inflate"),
                f = e("./utils/common"),
                h = e("./utils/strings"),
                m = e("./zlib/constants"),
                r = e("./zlib/messages"),
                o = e("./zlib/zstream"),
                a = e("./zlib/gzheader"),
                b = Object.prototype.toString;
              function i(e) {
                if (!(this instanceof i)) return new i(e);
                this.options = f.assign(
                  { chunkSize: 16384, windowBits: 0, to: "" },
                  e || {}
                );
                var t = this.options;
                if (
                  (t.raw &&
                    0 <= t.windowBits &&
                    t.windowBits < 16 &&
                    ((t.windowBits = -t.windowBits),
                    0 === t.windowBits && (t.windowBits = -15)),
                  !(0 <= t.windowBits && t.windowBits < 16) ||
                    (e && e.windowBits) ||
                    (t.windowBits += 32),
                  15 < t.windowBits &&
                    t.windowBits < 48 &&
                    0 == (15 & t.windowBits) &&
                    (t.windowBits |= 15),
                  (this.err = 0),
                  (this.msg = ""),
                  (this.ended = !1),
                  (this.chunks = []),
                  (this.strm = new o()),
                  (this.strm.avail_out = 0),
                  (e = u.inflateInit2(this.strm, t.windowBits)) !== m.Z_OK)
                )
                  throw new Error(r[e]);
                (this.header = new a()),
                  u.inflateGetHeader(this.strm, this.header);
              }
              function s(e, t) {
                if (((t = new i(t)).push(e, !0), t.err))
                  throw t.msg || r[t.err];
                return t.result;
              }
              (i.prototype.push = function (e, t) {
                var n,
                  r,
                  o,
                  a,
                  i,
                  s = this.strm,
                  l = this.options.chunkSize,
                  c = this.options.dictionary,
                  d = !1;
                if (this.ended) return !1;
                (r = t === ~~t ? t : !0 === t ? m.Z_FINISH : m.Z_NO_FLUSH),
                  "string" == typeof e
                    ? (s.input = h.binstring2buf(e))
                    : "[object ArrayBuffer]" === b.call(e)
                    ? (s.input = new Uint8Array(e))
                    : (s.input = e),
                  (s.next_in = 0),
                  (s.avail_in = s.input.length);
                do {
                  if (
                    (0 === s.avail_out &&
                      ((s.output = new f.Buf8(l)),
                      (s.next_out = 0),
                      (s.avail_out = l)),
                    (n = u.inflate(s, m.Z_NO_FLUSH)) === m.Z_NEED_DICT &&
                      c &&
                      ((i =
                        "string" == typeof c
                          ? h.string2buf(c)
                          : "[object ArrayBuffer]" === b.call(c)
                          ? new Uint8Array(c)
                          : c),
                      (n = u.inflateSetDictionary(this.strm, i))),
                    n === m.Z_BUF_ERROR && !0 === d && ((n = m.Z_OK), (d = !1)),
                    n !== m.Z_STREAM_END && n !== m.Z_OK)
                  )
                    return this.onEnd(n), !(this.ended = !0);
                } while (
                  (!s.next_out ||
                    (0 !== s.avail_out &&
                      n !== m.Z_STREAM_END &&
                      (0 !== s.avail_in ||
                        (r !== m.Z_FINISH && r !== m.Z_SYNC_FLUSH))) ||
                    ("string" === this.options.to
                      ? ((i = h.utf8border(s.output, s.next_out)),
                        (o = s.next_out - i),
                        (a = h.buf2string(s.output, i)),
                        (s.next_out = o),
                        (s.avail_out = l - o),
                        o && f.arraySet(s.output, s.output, i, o, 0),
                        this.onData(a))
                      : this.onData(f.shrinkBuf(s.output, s.next_out))),
                  0 === s.avail_in && 0 === s.avail_out && (d = !0),
                  (0 < s.avail_in || 0 === s.avail_out) && n !== m.Z_STREAM_END)
                );
                return (r = n === m.Z_STREAM_END ? m.Z_FINISH : r) ===
                  m.Z_FINISH
                  ? ((n = u.inflateEnd(this.strm)),
                    this.onEnd(n),
                    (this.ended = !0),
                    n === m.Z_OK)
                  : r !== m.Z_SYNC_FLUSH ||
                      (this.onEnd(m.Z_OK), !(s.avail_out = 0));
              }),
                (i.prototype.onData = function (e) {
                  this.chunks.push(e);
                }),
                (i.prototype.onEnd = function (e) {
                  e === m.Z_OK &&
                    ("string" === this.options.to
                      ? (this.result = this.chunks.join(""))
                      : (this.result = f.flattenChunks(this.chunks))),
                    (this.chunks = []),
                    (this.err = e),
                    (this.msg = this.strm.msg);
                }),
                (n.Inflate = i),
                (n.inflate = s),
                (n.inflateRaw = function (e, t) {
                  return ((t = t || {}).raw = !0), s(e, t);
                }),
                (n.ungzip = s);
            },
            "utils/common.js": function (e, t, n) {
              "use strict";
              var r =
                  "undefined" != typeof Uint8Array &&
                  "undefined" != typeof Uint16Array &&
                  "undefined" != typeof Int32Array,
                o =
                  ((n.assign = function (e) {
                    for (
                      var t = Array.prototype.slice.call(arguments, 1);
                      t.length;

                    ) {
                      var n = t.shift();
                      if (n) {
                        if ("object" != typeof n)
                          throw new TypeError(n + "must be non-object");
                        for (var r in n) n.hasOwnProperty(r) && (e[r] = n[r]);
                      }
                    }
                    return e;
                  }),
                  (n.shrinkBuf = function (e, t) {
                    if (e.length !== t) {
                      if (e.subarray) return e.subarray(0, t);
                      e.length = t;
                    }
                    return e;
                  }),
                  {
                    arraySet: function (e, t, n, r, o) {
                      if (t.subarray && e.subarray)
                        e.set(t.subarray(n, n + r), o);
                      else for (var a = 0; a < r; a++) e[o + a] = t[n + a];
                    },
                    flattenChunks: function (e) {
                      for (var t, n, r, o = 0, a = 0, i = e.length; a < i; a++)
                        o += e[a].length;
                      for (
                        r = new Uint8Array(o), a = t = 0, i = e.length;
                        a < i;
                        a++
                      )
                        (n = e[a]), r.set(n, t), (t += n.length);
                      return r;
                    },
                  }),
                a = {
                  arraySet: function (e, t, n, r, o) {
                    for (var a = 0; a < r; a++) e[o + a] = t[n + a];
                  },
                  flattenChunks: function (e) {
                    return [].concat.apply([], e);
                  },
                };
              (n.setTyped = function (e) {
                e
                  ? ((n.Buf8 = Uint8Array),
                    (n.Buf16 = Uint16Array),
                    (n.Buf32 = Int32Array),
                    n.assign(n, o))
                  : ((n.Buf8 = Array),
                    (n.Buf16 = Array),
                    (n.Buf32 = Array),
                    n.assign(n, a));
              }),
                n.setTyped(r);
            },
            "utils/strings.js": function (e, t, n) {
              "use strict";
              var l = e("./common"),
                o = !0,
                a = !0;
              try {
                String.fromCharCode.apply(null, [0]);
              } catch (e) {
                o = !1;
              }
              try {
                String.fromCharCode.apply(null, new Uint8Array(1));
              } catch (e) {
                a = !1;
              }
              for (var c = new l.Buf8(256), r = 0; r < 256; r++)
                c[r] =
                  252 <= r
                    ? 6
                    : 248 <= r
                    ? 5
                    : 240 <= r
                    ? 4
                    : 224 <= r
                    ? 3
                    : 192 <= r
                    ? 2
                    : 1;
              function d(e, t) {
                if (t < 65537 && ((e.subarray && a) || (!e.subarray && o)))
                  return String.fromCharCode.apply(null, l.shrinkBuf(e, t));
                for (var n = "", r = 0; r < t; r++)
                  n += String.fromCharCode(e[r]);
                return n;
              }
              (c[254] = c[254] = 1),
                (n.string2buf = function (e) {
                  for (var t, n, r, o, a = e.length, i = 0, s = 0; s < a; s++)
                    55296 == (64512 & (n = e.charCodeAt(s))) &&
                      s + 1 < a &&
                      56320 == (64512 & (r = e.charCodeAt(s + 1))) &&
                      ((n = 65536 + ((n - 55296) << 10) + (r - 56320)), s++),
                      (i += n < 128 ? 1 : n < 2048 ? 2 : n < 65536 ? 3 : 4);
                  for (t = new l.Buf8(i), s = o = 0; o < i; s++)
                    55296 == (64512 & (n = e.charCodeAt(s))) &&
                      s + 1 < a &&
                      56320 == (64512 & (r = e.charCodeAt(s + 1))) &&
                      ((n = 65536 + ((n - 55296) << 10) + (r - 56320)), s++),
                      n < 128
                        ? (t[o++] = n)
                        : (n < 2048
                            ? (t[o++] = 192 | (n >>> 6))
                            : (n < 65536
                                ? (t[o++] = 224 | (n >>> 12))
                                : ((t[o++] = 240 | (n >>> 18)),
                                  (t[o++] = 128 | ((n >>> 12) & 63))),
                              (t[o++] = 128 | ((n >>> 6) & 63))),
                          (t[o++] = 128 | (63 & n)));
                  return t;
                }),
                (n.buf2binstring = function (e) {
                  return d(e, e.length);
                }),
                (n.binstring2buf = function (e) {
                  for (
                    var t = new l.Buf8(e.length), n = 0, r = t.length;
                    n < r;
                    n++
                  )
                    t[n] = e.charCodeAt(n);
                  return t;
                }),
                (n.buf2string = function (e, t) {
                  for (
                    var n,
                      r,
                      o = t || e.length,
                      a = new Array(2 * o),
                      i = 0,
                      s = 0;
                    s < o;

                  )
                    if ((n = e[s++]) < 128) a[i++] = n;
                    else if (4 < (r = c[n])) (a[i++] = 65533), (s += r - 1);
                    else {
                      for (
                        n &= 2 === r ? 31 : 3 === r ? 15 : 7;
                        1 < r && s < o;

                      )
                        (n = (n << 6) | (63 & e[s++])), r--;
                      1 < r
                        ? (a[i++] = 65533)
                        : n < 65536
                        ? (a[i++] = n)
                        : ((n -= 65536),
                          (a[i++] = 55296 | ((n >> 10) & 1023)),
                          (a[i++] = 56320 | (1023 & n)));
                    }
                  return d(a, i);
                }),
                (n.utf8border = function (e, t) {
                  for (
                    var n =
                      (t = (t = t || e.length) > e.length ? e.length : t) - 1;
                    0 <= n && 128 == (192 & e[n]);

                  )
                    n--;
                  return !(n < 0) && 0 !== n && n + c[e[n]] > t ? n : t;
                });
            },
            "zlib/inflate.js": function (e, t, n) {
              "use strict";
              var T = e("../utils/common"),
                R = e("./adler32"),
                P = e("./crc32"),
                I = e("./inffast"),
                L = e("./inftrees"),
                z = 0,
                O = -2,
                N = 1,
                r = 852,
                o = 592;
              function F(e) {
                return (
                  ((e >>> 24) & 255) +
                  ((e >>> 8) & 65280) +
                  ((65280 & e) << 8) +
                  ((255 & e) << 24)
                );
              }
              function a() {
                (this.mode = 0),
                  (this.last = !1),
                  (this.wrap = 0),
                  (this.havedict = !1),
                  (this.flags = 0),
                  (this.dmax = 0),
                  (this.check = 0),
                  (this.total = 0),
                  (this.head = null),
                  (this.wbits = 0),
                  (this.wsize = 0),
                  (this.whave = 0),
                  (this.wnext = 0),
                  (this.window = null),
                  (this.hold = 0),
                  (this.bits = 0),
                  (this.length = 0),
                  (this.offset = 0),
                  (this.extra = 0),
                  (this.lencode = null),
                  (this.distcode = null),
                  (this.lenbits = 0),
                  (this.distbits = 0),
                  (this.ncode = 0),
                  (this.nlen = 0),
                  (this.ndist = 0),
                  (this.have = 0),
                  (this.next = null),
                  (this.lens = new T.Buf16(320)),
                  (this.work = new T.Buf16(288)),
                  (this.lendyn = null),
                  (this.distdyn = null),
                  (this.sane = 0),
                  (this.back = 0),
                  (this.was = 0);
              }
              function i(e) {
                var t;
                return e && e.state
                  ? ((t = e.state),
                    (e.total_in = e.total_out = t.total = 0),
                    (e.msg = ""),
                    t.wrap && (e.adler = 1 & t.wrap),
                    (t.mode = N),
                    (t.last = 0),
                    (t.havedict = 0),
                    (t.dmax = 32768),
                    (t.head = null),
                    (t.hold = 0),
                    (t.bits = 0),
                    (t.lencode = t.lendyn = new T.Buf32(r)),
                    (t.distcode = t.distdyn = new T.Buf32(o)),
                    (t.sane = 1),
                    (t.back = -1),
                    z)
                  : O;
              }
              function s(e) {
                var t;
                return e && e.state
                  ? (((t = e.state).wsize = 0),
                    (t.whave = 0),
                    (t.wnext = 0),
                    i(e))
                  : O;
              }
              function l(e, t) {
                var n, r;
                return !e ||
                  !e.state ||
                  ((r = e.state),
                  t < 0
                    ? ((n = 0), (t = -t))
                    : ((n = 1 + (t >> 4)), t < 48 && (t &= 15)),
                  t && (t < 8 || 15 < t))
                  ? O
                  : (null !== r.window && r.wbits !== t && (r.window = null),
                    (r.wrap = n),
                    (r.wbits = t),
                    s(e));
              }
              function c(e, t) {
                var n;
                return e
                  ? ((n = new a()),
                    ((e.state = n).window = null),
                    (n = l(e, t)) !== z && (e.state = null),
                    n)
                  : O;
              }
              var M,
                H,
                Z = !0;
              function j(e, t, n, r) {
                var o;
                return (
                  null === (e = e.state).window &&
                    ((e.wsize = 1 << e.wbits),
                    (e.wnext = 0),
                    (e.whave = 0),
                    (e.window = new T.Buf8(e.wsize))),
                  r >= e.wsize
                    ? (T.arraySet(e.window, t, n - e.wsize, e.wsize, 0),
                      (e.wnext = 0),
                      (e.whave = e.wsize))
                    : (r < (o = e.wsize - e.wnext) && (o = r),
                      T.arraySet(e.window, t, n - r, o, e.wnext),
                      (r -= o)
                        ? (T.arraySet(e.window, t, n - r, r, 0),
                          (e.wnext = r),
                          (e.whave = e.wsize))
                        : ((e.wnext += o),
                          e.wnext === e.wsize && (e.wnext = 0),
                          e.whave < e.wsize && (e.whave += o))),
                  0
                );
              }
              (n.inflateReset = s),
                (n.inflateReset2 = l),
                (n.inflateResetKeep = i),
                (n.inflateInit = function (e) {
                  return c(e, 15);
                }),
                (n.inflateInit2 = c),
                (n.inflate = function (e, t) {
                  var n,
                    r,
                    o,
                    a,
                    i,
                    s,
                    l,
                    c,
                    d,
                    u,
                    f,
                    h,
                    m,
                    b,
                    g,
                    p,
                    w,
                    v,
                    y,
                    k,
                    _,
                    x,
                    S,
                    C,
                    E = 0,
                    U = new T.Buf8(4),
                    D = [
                      16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14,
                      1, 15,
                    ];
                  if (
                    !e ||
                    !e.state ||
                    !e.output ||
                    (!e.input && 0 !== e.avail_in)
                  )
                    return O;
                  12 === (n = e.state).mode && (n.mode = 13),
                    (i = e.next_out),
                    (o = e.output),
                    (l = e.avail_out),
                    (a = e.next_in),
                    (r = e.input),
                    (s = e.avail_in),
                    (c = n.hold),
                    (d = n.bits),
                    (u = s),
                    (f = l),
                    (x = z);
                  e: for (;;)
                    switch (n.mode) {
                      case N:
                        if (0 === n.wrap) n.mode = 13;
                        else {
                          for (; d < 16; ) {
                            if (0 === s) break e;
                            s--, (c += r[a++] << d), (d += 8);
                          }
                          if (2 & n.wrap && 35615 === c)
                            (U[(n.check = 0)] = 255 & c),
                              (U[1] = (c >>> 8) & 255),
                              (n.check = P(n.check, U, 2, 0)),
                              (d = c = 0),
                              (n.mode = 2);
                          else if (
                            ((n.flags = 0),
                            n.head && (n.head.done = !1),
                            !(1 & n.wrap) || (((255 & c) << 8) + (c >> 8)) % 31)
                          )
                            (e.msg = "incorrect header check"), (n.mode = 30);
                          else if (8 != (15 & c))
                            (e.msg = "unknown compression method"),
                              (n.mode = 30);
                          else {
                            if (
                              ((d -= 4),
                              (_ = 8 + (15 & (c >>>= 4))),
                              0 === n.wbits)
                            )
                              n.wbits = _;
                            else if (_ > n.wbits) {
                              (e.msg = "invalid window size"), (n.mode = 30);
                              break;
                            }
                            (n.dmax = 1 << _),
                              (e.adler = n.check = 1),
                              (n.mode = 512 & c ? 10 : 12),
                              (d = c = 0);
                          }
                        }
                        break;
                      case 2:
                        for (; d < 16; ) {
                          if (0 === s) break e;
                          s--, (c += r[a++] << d), (d += 8);
                        }
                        if (((n.flags = c), 8 != (255 & n.flags))) {
                          (e.msg = "unknown compression method"), (n.mode = 30);
                          break;
                        }
                        if (57344 & n.flags) {
                          (e.msg = "unknown header flags set"), (n.mode = 30);
                          break;
                        }
                        n.head && (n.head.text = (c >> 8) & 1),
                          512 & n.flags &&
                            ((U[0] = 255 & c),
                            (U[1] = (c >>> 8) & 255),
                            (n.check = P(n.check, U, 2, 0))),
                          (d = c = 0),
                          (n.mode = 3);
                      case 3:
                        for (; d < 32; ) {
                          if (0 === s) break e;
                          s--, (c += r[a++] << d), (d += 8);
                        }
                        n.head && (n.head.time = c),
                          512 & n.flags &&
                            ((U[0] = 255 & c),
                            (U[1] = (c >>> 8) & 255),
                            (U[2] = (c >>> 16) & 255),
                            (U[3] = (c >>> 24) & 255),
                            (n.check = P(n.check, U, 4, 0))),
                          (d = c = 0),
                          (n.mode = 4);
                      case 4:
                        for (; d < 16; ) {
                          if (0 === s) break e;
                          s--, (c += r[a++] << d), (d += 8);
                        }
                        n.head &&
                          ((n.head.xflags = 255 & c), (n.head.os = c >> 8)),
                          512 & n.flags &&
                            ((U[0] = 255 & c),
                            (U[1] = (c >>> 8) & 255),
                            (n.check = P(n.check, U, 2, 0))),
                          (d = c = 0),
                          (n.mode = 5);
                      case 5:
                        if (1024 & n.flags) {
                          for (; d < 16; ) {
                            if (0 === s) break e;
                            s--, (c += r[a++] << d), (d += 8);
                          }
                          (n.length = c),
                            n.head && (n.head.extra_len = c),
                            512 & n.flags &&
                              ((U[0] = 255 & c),
                              (U[1] = (c >>> 8) & 255),
                              (n.check = P(n.check, U, 2, 0))),
                            (d = c = 0);
                        } else n.head && (n.head.extra = null);
                        n.mode = 6;
                      case 6:
                        if (
                          1024 & n.flags &&
                          ((h = s < (h = n.length) ? s : h) &&
                            (n.head &&
                              ((_ = n.head.extra_len - n.length),
                              n.head.extra ||
                                (n.head.extra = new Array(n.head.extra_len)),
                              T.arraySet(n.head.extra, r, a, h, _)),
                            512 & n.flags && (n.check = P(n.check, r, h, a)),
                            (s -= h),
                            (a += h),
                            (n.length -= h)),
                          n.length)
                        )
                          break e;
                        (n.length = 0), (n.mode = 7);
                      case 7:
                        if (2048 & n.flags) {
                          if (0 === s) break e;
                          for (
                            h = 0;
                            (_ = r[a + h++]),
                              n.head &&
                                _ &&
                                n.length < 65536 &&
                                (n.head.name += String.fromCharCode(_)),
                              _ && h < s;

                          );
                          if (
                            (512 & n.flags && (n.check = P(n.check, r, h, a)),
                            (s -= h),
                            (a += h),
                            _)
                          )
                            break e;
                        } else n.head && (n.head.name = null);
                        (n.length = 0), (n.mode = 8);
                      case 8:
                        if (4096 & n.flags) {
                          if (0 === s) break e;
                          for (
                            h = 0;
                            (_ = r[a + h++]),
                              n.head &&
                                _ &&
                                n.length < 65536 &&
                                (n.head.comment += String.fromCharCode(_)),
                              _ && h < s;

                          );
                          if (
                            (512 & n.flags && (n.check = P(n.check, r, h, a)),
                            (s -= h),
                            (a += h),
                            _)
                          )
                            break e;
                        } else n.head && (n.head.comment = null);
                        n.mode = 9;
                      case 9:
                        if (512 & n.flags) {
                          for (; d < 16; ) {
                            if (0 === s) break e;
                            s--, (c += r[a++] << d), (d += 8);
                          }
                          if (c !== (65535 & n.check)) {
                            (e.msg = "header crc mismatch"), (n.mode = 30);
                            break;
                          }
                          d = c = 0;
                        }
                        n.head &&
                          ((n.head.hcrc = (n.flags >> 9) & 1),
                          (n.head.done = !0)),
                          (e.adler = n.check = 0),
                          (n.mode = 12);
                        break;
                      case 10:
                        for (; d < 32; ) {
                          if (0 === s) break e;
                          s--, (c += r[a++] << d), (d += 8);
                        }
                        (e.adler = n.check = F(c)), (d = c = 0), (n.mode = 11);
                      case 11:
                        if (0 === n.havedict)
                          return (
                            (e.next_out = i),
                            (e.avail_out = l),
                            (e.next_in = a),
                            (e.avail_in = s),
                            (n.hold = c),
                            (n.bits = d),
                            2
                          );
                        (e.adler = n.check = 1), (n.mode = 12);
                      case 12:
                        if (5 === t || 6 === t) break e;
                      case 13:
                        if (n.last) (c >>>= 7 & d), (d -= 7 & d), (n.mode = 27);
                        else {
                          for (; d < 3; ) {
                            if (0 === s) break e;
                            s--, (c += r[a++] << d), (d += 8);
                          }
                          switch (((n.last = 1 & c), --d, 3 & (c >>>= 1))) {
                            case 0:
                              n.mode = 14;
                              break;
                            case 1:
                              var B,
                                B = (A = void 0),
                                A = n;
                              if (Z) {
                                for (
                                  M = new T.Buf32(512),
                                    H = new T.Buf32(32),
                                    B = 0;
                                  B < 144;

                                )
                                  A.lens[B++] = 8;
                                for (; B < 256; ) A.lens[B++] = 9;
                                for (; B < 280; ) A.lens[B++] = 7;
                                for (; B < 288; ) A.lens[B++] = 8;
                                for (
                                  L(1, A.lens, 0, 288, M, 0, A.work, {
                                    bits: 9,
                                  }),
                                    B = 0;
                                  B < 32;

                                )
                                  A.lens[B++] = 5;
                                L(2, A.lens, 0, 32, H, 0, A.work, { bits: 5 }),
                                  (Z = !1);
                              }
                              if (
                                ((A.lencode = M),
                                (A.lenbits = 9),
                                (A.distcode = H),
                                (A.distbits = 5),
                                (n.mode = 20),
                                6 !== t)
                              )
                                break;
                              (c >>>= 2), (d -= 2);
                              break e;
                            case 2:
                              n.mode = 17;
                              break;
                            case 3:
                              (e.msg = "invalid block type"), (n.mode = 30);
                          }
                          (c >>>= 2), (d -= 2);
                        }
                        break;
                      case 14:
                        for (c >>>= 7 & d, d -= 7 & d; d < 32; ) {
                          if (0 === s) break e;
                          s--, (c += r[a++] << d), (d += 8);
                        }
                        if ((65535 & c) != ((c >>> 16) ^ 65535)) {
                          (e.msg = "invalid stored block lengths"),
                            (n.mode = 30);
                          break;
                        }
                        if (
                          ((n.length = 65535 & c),
                          (d = c = 0),
                          (n.mode = 15),
                          6 === t)
                        )
                          break e;
                      case 15:
                        n.mode = 16;
                      case 16:
                        if ((h = n.length)) {
                          if (0 === (h = l < (h = s < h ? s : h) ? l : h))
                            break e;
                          T.arraySet(o, r, a, h, i),
                            (s -= h),
                            (a += h),
                            (l -= h),
                            (i += h),
                            (n.length -= h);
                        } else n.mode = 12;
                        break;
                      case 17:
                        for (; d < 14; ) {
                          if (0 === s) break e;
                          s--, (c += r[a++] << d), (d += 8);
                        }
                        if (
                          ((n.nlen = 257 + (31 & c)),
                          (c >>>= 5),
                          (d -= 5),
                          (n.ndist = 1 + (31 & c)),
                          (c >>>= 5),
                          (d -= 5),
                          (n.ncode = 4 + (15 & c)),
                          (c >>>= 4),
                          (d -= 4),
                          286 < n.nlen || 30 < n.ndist)
                        ) {
                          (e.msg = "too many length or distance symbols"),
                            (n.mode = 30);
                          break;
                        }
                        (n.have = 0), (n.mode = 18);
                      case 18:
                        for (; n.have < n.ncode; ) {
                          for (; d < 3; ) {
                            if (0 === s) break e;
                            s--, (c += r[a++] << d), (d += 8);
                          }
                          (n.lens[D[n.have++]] = 7 & c), (c >>>= 3), (d -= 3);
                        }
                        for (; n.have < 19; ) n.lens[D[n.have++]] = 0;
                        if (
                          ((n.lencode = n.lendyn),
                          (n.lenbits = 7),
                          (S = { bits: n.lenbits }),
                          (x = L(0, n.lens, 0, 19, n.lencode, 0, n.work, S)),
                          (n.lenbits = S.bits),
                          x)
                        ) {
                          (e.msg = "invalid code lengths set"), (n.mode = 30);
                          break;
                        }
                        (n.have = 0), (n.mode = 19);
                      case 19:
                        for (; n.have < n.nlen + n.ndist; ) {
                          for (
                            ;
                            (p =
                              ((E = n.lencode[c & ((1 << n.lenbits) - 1)]) >>>
                                16) &
                              255),
                              (w = 65535 & E),
                              !((g = E >>> 24) <= d);

                          ) {
                            if (0 === s) break e;
                            s--, (c += r[a++] << d), (d += 8);
                          }
                          if (w < 16)
                            (c >>>= g), (d -= g), (n.lens[n.have++] = w);
                          else {
                            if (16 === w) {
                              for (C = g + 2; d < C; ) {
                                if (0 === s) break e;
                                s--, (c += r[a++] << d), (d += 8);
                              }
                              if (((c >>>= g), (d -= g), 0 === n.have)) {
                                (e.msg = "invalid bit length repeat"),
                                  (n.mode = 30);
                                break;
                              }
                              (_ = n.lens[n.have - 1]),
                                (h = 3 + (3 & c)),
                                (c >>>= 2),
                                (d -= 2);
                            } else if (17 === w) {
                              for (C = g + 3; d < C; ) {
                                if (0 === s) break e;
                                s--, (c += r[a++] << d), (d += 8);
                              }
                              (_ = 0),
                                (h = 3 + (7 & (c >>>= g))),
                                (c >>>= 3),
                                (d = d - g - 3);
                            } else {
                              for (C = g + 7; d < C; ) {
                                if (0 === s) break e;
                                s--, (c += r[a++] << d), (d += 8);
                              }
                              (_ = 0),
                                (h = 11 + (127 & (c >>>= g))),
                                (c >>>= 7),
                                (d = d - g - 7);
                            }
                            if (n.have + h > n.nlen + n.ndist) {
                              (e.msg = "invalid bit length repeat"),
                                (n.mode = 30);
                              break;
                            }
                            for (; h--; ) n.lens[n.have++] = _;
                          }
                        }
                        if (30 === n.mode) break;
                        if (0 === n.lens[256]) {
                          (e.msg = "invalid code -- missing end-of-block"),
                            (n.mode = 30);
                          break;
                        }
                        if (
                          ((n.lenbits = 9),
                          (S = { bits: n.lenbits }),
                          (x = L(
                            1,
                            n.lens,
                            0,
                            n.nlen,
                            n.lencode,
                            0,
                            n.work,
                            S
                          )),
                          (n.lenbits = S.bits),
                          x)
                        ) {
                          (e.msg = "invalid literal/lengths set"),
                            (n.mode = 30);
                          break;
                        }
                        if (
                          ((n.distbits = 6),
                          (n.distcode = n.distdyn),
                          (S = { bits: n.distbits }),
                          (x = L(
                            2,
                            n.lens,
                            n.nlen,
                            n.ndist,
                            n.distcode,
                            0,
                            n.work,
                            S
                          )),
                          (n.distbits = S.bits),
                          x)
                        ) {
                          (e.msg = "invalid distances set"), (n.mode = 30);
                          break;
                        }
                        if (((n.mode = 20), 6 === t)) break e;
                      case 20:
                        n.mode = 21;
                      case 21:
                        if (6 <= s && 258 <= l) {
                          (e.next_out = i),
                            (e.avail_out = l),
                            (e.next_in = a),
                            (e.avail_in = s),
                            (n.hold = c),
                            (n.bits = d),
                            I(e, f),
                            (i = e.next_out),
                            (o = e.output),
                            (l = e.avail_out),
                            (a = e.next_in),
                            (r = e.input),
                            (s = e.avail_in),
                            (c = n.hold),
                            (d = n.bits),
                            12 === n.mode && (n.back = -1);
                          break;
                        }
                        for (
                          n.back = 0;
                          (p =
                            ((E = n.lencode[c & ((1 << n.lenbits) - 1)]) >>>
                              16) &
                            255),
                            (w = 65535 & E),
                            !((g = E >>> 24) <= d);

                        ) {
                          if (0 === s) break e;
                          s--, (c += r[a++] << d), (d += 8);
                        }
                        if (p && 0 == (240 & p)) {
                          for (
                            v = g, y = p, k = w;
                            (p =
                              ((E =
                                n.lencode[
                                  k + ((c & ((1 << (v + y)) - 1)) >> v)
                                ]) >>>
                                16) &
                              255),
                              (w = 65535 & E),
                              !(v + (g = E >>> 24) <= d);

                          ) {
                            if (0 === s) break e;
                            s--, (c += r[a++] << d), (d += 8);
                          }
                          (c >>>= v), (d -= v), (n.back += v);
                        }
                        if (
                          ((c >>>= g),
                          (d -= g),
                          (n.back += g),
                          (n.length = w),
                          0 === p)
                        ) {
                          n.mode = 26;
                          break;
                        }
                        if (32 & p) {
                          (n.back = -1), (n.mode = 12);
                          break;
                        }
                        if (64 & p) {
                          (e.msg = "invalid literal/length code"),
                            (n.mode = 30);
                          break;
                        }
                        (n.extra = 15 & p), (n.mode = 22);
                      case 22:
                        if (n.extra) {
                          for (C = n.extra; d < C; ) {
                            if (0 === s) break e;
                            s--, (c += r[a++] << d), (d += 8);
                          }
                          (n.length += c & ((1 << n.extra) - 1)),
                            (c >>>= n.extra),
                            (d -= n.extra),
                            (n.back += n.extra);
                        }
                        (n.was = n.length), (n.mode = 23);
                      case 23:
                        for (
                          ;
                          (p =
                            ((E = n.distcode[c & ((1 << n.distbits) - 1)]) >>>
                              16) &
                            255),
                            (w = 65535 & E),
                            !((g = E >>> 24) <= d);

                        ) {
                          if (0 === s) break e;
                          s--, (c += r[a++] << d), (d += 8);
                        }
                        if (0 == (240 & p)) {
                          for (
                            v = g, y = p, k = w;
                            (p =
                              ((E =
                                n.distcode[
                                  k + ((c & ((1 << (v + y)) - 1)) >> v)
                                ]) >>>
                                16) &
                              255),
                              (w = 65535 & E),
                              !(v + (g = E >>> 24) <= d);

                          ) {
                            if (0 === s) break e;
                            s--, (c += r[a++] << d), (d += 8);
                          }
                          (c >>>= v), (d -= v), (n.back += v);
                        }
                        if (((c >>>= g), (d -= g), (n.back += g), 64 & p)) {
                          (e.msg = "invalid distance code"), (n.mode = 30);
                          break;
                        }
                        (n.offset = w), (n.extra = 15 & p), (n.mode = 24);
                      case 24:
                        if (n.extra) {
                          for (C = n.extra; d < C; ) {
                            if (0 === s) break e;
                            s--, (c += r[a++] << d), (d += 8);
                          }
                          (n.offset += c & ((1 << n.extra) - 1)),
                            (c >>>= n.extra),
                            (d -= n.extra),
                            (n.back += n.extra);
                        }
                        if (n.offset > n.dmax) {
                          (e.msg = "invalid distance too far back"),
                            (n.mode = 30);
                          break;
                        }
                        n.mode = 25;
                      case 25:
                        if (0 === l) break e;
                        if (n.offset > (h = f - l)) {
                          if ((h = n.offset - h) > n.whave && n.sane) {
                            (e.msg = "invalid distance too far back"),
                              (n.mode = 30);
                            break;
                          }
                          (m =
                            h > n.wnext
                              ? ((h -= n.wnext), n.wsize - h)
                              : n.wnext - h),
                            h > n.length && (h = n.length),
                            (b = n.window);
                        } else (b = o), (m = i - n.offset), (h = n.length);
                        for (
                          l -= h = l < h ? l : h, n.length -= h;
                          (o[i++] = b[m++]), --h;

                        );
                        0 === n.length && (n.mode = 21);
                        break;
                      case 26:
                        if (0 === l) break e;
                        (o[i++] = n.length), l--, (n.mode = 21);
                        break;
                      case 27:
                        if (n.wrap) {
                          for (; d < 32; ) {
                            if (0 === s) break e;
                            s--, (c |= r[a++] << d), (d += 8);
                          }
                          if (
                            ((f -= l),
                            (e.total_out += f),
                            (n.total += f),
                            f &&
                              (e.adler = n.check =
                                (n.flags ? P : R)(n.check, o, f, i - f)),
                            (f = l),
                            (n.flags ? c : F(c)) !== n.check)
                          ) {
                            (e.msg = "incorrect data check"), (n.mode = 30);
                            break;
                          }
                          d = c = 0;
                        }
                        n.mode = 28;
                      case 28:
                        if (n.wrap && n.flags) {
                          for (; d < 32; ) {
                            if (0 === s) break e;
                            s--, (c += r[a++] << d), (d += 8);
                          }
                          if (c !== (4294967295 & n.total)) {
                            (e.msg = "incorrect length check"), (n.mode = 30);
                            break;
                          }
                          d = c = 0;
                        }
                        n.mode = 29;
                      case 29:
                        x = 1;
                        break e;
                      case 30:
                        x = -3;
                        break e;
                      case 31:
                        return -4;
                      default:
                        return O;
                    }
                  return (
                    (e.next_out = i),
                    (e.avail_out = l),
                    (e.next_in = a),
                    (e.avail_in = s),
                    (n.hold = c),
                    (n.bits = d),
                    (n.wsize ||
                      (f !== e.avail_out &&
                        n.mode < 30 &&
                        (n.mode < 27 || 4 !== t))) &&
                    j(e, e.output, e.next_out, f - e.avail_out)
                      ? ((n.mode = 31), -4)
                      : ((u -= e.avail_in),
                        (f -= e.avail_out),
                        (e.total_in += u),
                        (e.total_out += f),
                        (n.total += f),
                        n.wrap &&
                          f &&
                          (e.adler = n.check =
                            (n.flags ? P : R)(n.check, o, f, e.next_out - f)),
                        (e.data_type =
                          n.bits +
                          (n.last ? 64 : 0) +
                          (12 === n.mode ? 128 : 0) +
                          (20 === n.mode || 15 === n.mode ? 256 : 0)),
                        ((0 == u && 0 === f) || 4 === t) && x === z ? -5 : x)
                  );
                }),
                (n.inflateEnd = function (e) {
                  var t;
                  return e && e.state
                    ? ((t = e.state).window && (t.window = null),
                      (e.state = null),
                      z)
                    : O;
                }),
                (n.inflateGetHeader = function (e, t) {
                  return e && e.state && 0 != (2 & (e = e.state).wrap)
                    ? (((e.head = t).done = !1), z)
                    : O;
                }),
                (n.inflateSetDictionary = function (e, t) {
                  var n,
                    r = t.length;
                  return !e ||
                    !e.state ||
                    (0 !== (n = e.state).wrap && 11 !== n.mode)
                    ? O
                    : 11 === n.mode && R(1, t, r, 0) !== n.check
                    ? -3
                    : j(e, t, r, r)
                    ? ((n.mode = 31), -4)
                    : ((n.havedict = 1), z);
                }),
                (n.inflateInfo = "pako inflate (from Nodeca project)");
            },
            "zlib/constants.js": function (e, t, n) {
              "use strict";
              t.exports = {
                Z_NO_FLUSH: 0,
                Z_PARTIAL_FLUSH: 1,
                Z_SYNC_FLUSH: 2,
                Z_FULL_FLUSH: 3,
                Z_FINISH: 4,
                Z_BLOCK: 5,
                Z_TREES: 6,
                Z_OK: 0,
                Z_STREAM_END: 1,
                Z_NEED_DICT: 2,
                Z_ERRNO: -1,
                Z_STREAM_ERROR: -2,
                Z_DATA_ERROR: -3,
                Z_BUF_ERROR: -5,
                Z_NO_COMPRESSION: 0,
                Z_BEST_SPEED: 1,
                Z_BEST_COMPRESSION: 9,
                Z_DEFAULT_COMPRESSION: -1,
                Z_FILTERED: 1,
                Z_HUFFMAN_ONLY: 2,
                Z_RLE: 3,
                Z_FIXED: 4,
                Z_DEFAULT_STRATEGY: 0,
                Z_BINARY: 0,
                Z_TEXT: 1,
                Z_UNKNOWN: 2,
                Z_DEFLATED: 8,
              };
            },
            "zlib/messages.js": function (e, t, n) {
              "use strict";
              t.exports = {
                2: "need dictionary",
                1: "stream end",
                0: "",
                "-1": "file error",
                "-2": "stream error",
                "-3": "data error",
                "-4": "insufficient memory",
                "-5": "buffer error",
                "-6": "incompatible version",
              };
            },
            "zlib/zstream.js": function (e, t, n) {
              "use strict";
              t.exports = function () {
                (this.input = null),
                  (this.next_in = 0),
                  (this.avail_in = 0),
                  (this.total_in = 0),
                  (this.output = null),
                  (this.next_out = 0),
                  (this.avail_out = 0),
                  (this.total_out = 0),
                  (this.msg = ""),
                  (this.state = null),
                  (this.data_type = 2),
                  (this.adler = 0);
              };
            },
            "zlib/gzheader.js": function (e, t, n) {
              "use strict";
              t.exports = function () {
                (this.text = 0),
                  (this.time = 0),
                  (this.xflags = 0),
                  (this.os = 0),
                  (this.extra = null),
                  (this.extra_len = 0),
                  (this.name = ""),
                  (this.comment = ""),
                  (this.hcrc = 0),
                  (this.done = !1);
              };
            },
            "zlib/adler32.js": function (e, t, n) {
              "use strict";
              t.exports = function (e, t, n, r) {
                for (
                  var o = (65535 & e) | 0, a = ((e >>> 16) & 65535) | 0, i = 0;
                  0 !== n;

                ) {
                  for (
                    n -= i = 2e3 < n ? 2e3 : n;
                    (a = (a + (o = (o + t[r++]) | 0)) | 0), --i;

                  );
                  (o %= 65521), (a %= 65521);
                }
                return o | (a << 16) | 0;
              };
            },
            "zlib/crc32.js": function (e, t, n) {
              "use strict";
              var s = (function () {
                for (var e = [], t = 0; t < 256; t++) {
                  for (var n = t, r = 0; r < 8; r++)
                    n = 1 & n ? 3988292384 ^ (n >>> 1) : n >>> 1;
                  e[t] = n;
                }
                return e;
              })();
              t.exports = function (e, t, n, r) {
                var o = s,
                  a = r + n;
                e ^= -1;
                for (var i = r; i < a; i++) e = (e >>> 8) ^ o[255 & (e ^ t[i])];
                return -1 ^ e;
              };
            },
            "zlib/inffast.js": function (e, t, n) {
              "use strict";
              t.exports = function (e, t) {
                var n,
                  r,
                  o,
                  a,
                  i,
                  s,
                  l = e.state,
                  c = e.next_in,
                  d = e.input,
                  u = c + (e.avail_in - 5),
                  f = e.next_out,
                  h = e.output,
                  m = f - (t - e.avail_out),
                  b = f + (e.avail_out - 257),
                  g = l.dmax,
                  p = l.wsize,
                  w = l.whave,
                  v = l.wnext,
                  y = l.window,
                  k = l.hold,
                  _ = l.bits,
                  x = l.lencode,
                  S = l.distcode,
                  C = (1 << l.lenbits) - 1,
                  E = (1 << l.distbits) - 1;
                e: do {
                  for (
                    _ < 15 &&
                      ((k += d[c++] << _),
                      (_ += 8),
                      (k += d[c++] << _),
                      (_ += 8)),
                      n = x[k & C];
                    ;

                  ) {
                    if (
                      ((k >>>= r = n >>> 24),
                      (_ -= r),
                      0 == (r = (n >>> 16) & 255))
                    )
                      h[f++] = 65535 & n;
                    else {
                      if (!(16 & r)) {
                        if (0 == (64 & r)) {
                          n = x[(65535 & n) + (k & ((1 << r) - 1))];
                          continue;
                        }
                        if (32 & r) {
                          l.mode = 12;
                          break e;
                        }
                        (e.msg = "invalid literal/length code"), (l.mode = 30);
                        break e;
                      }
                      for (
                        o = 65535 & n,
                          (r &= 15) &&
                            (_ < r && ((k += d[c++] << _), (_ += 8)),
                            (o += k & ((1 << r) - 1)),
                            (k >>>= r),
                            (_ -= r)),
                          _ < 15 &&
                            ((k += d[c++] << _),
                            (_ += 8),
                            (k += d[c++] << _),
                            (_ += 8)),
                          n = S[k & E];
                        ;

                      ) {
                        if (
                          ((k >>>= r = n >>> 24),
                          (_ -= r),
                          !(16 & (r = (n >>> 16) & 255)))
                        ) {
                          if (0 == (64 & r)) {
                            n = S[(65535 & n) + (k & ((1 << r) - 1))];
                            continue;
                          }
                          (e.msg = "invalid distance code"), (l.mode = 30);
                          break e;
                        }
                        if (
                          ((a = 65535 & n),
                          _ < (r &= 15) &&
                            ((k += d[c++] << _),
                            (_ += 8) < r && ((k += d[c++] << _), (_ += 8))),
                          g < (a += k & ((1 << r) - 1)))
                        ) {
                          (e.msg = "invalid distance too far back"),
                            (l.mode = 30);
                          break e;
                        }
                        if (((k >>>= r), (_ -= r), (r = f - m) < a)) {
                          if (w < (r = a - r) && l.sane) {
                            (e.msg = "invalid distance too far back"),
                              (l.mode = 30);
                            break e;
                          }
                          if (((s = y), (i = 0) === v)) {
                            if (((i += p - r), r < o)) {
                              for (o -= r; (h[f++] = y[i++]), --r; );
                              (i = f - a), (s = h);
                            }
                          } else if (v < r) {
                            if (((i += p + v - r), (r -= v) < o)) {
                              for (o -= r; (h[f++] = y[i++]), --r; );
                              if (((i = 0), v < o)) {
                                for (o -= r = v; (h[f++] = y[i++]), --r; );
                                (i = f - a), (s = h);
                              }
                            }
                          } else if (((i += v - r), r < o)) {
                            for (o -= r; (h[f++] = y[i++]), --r; );
                            (i = f - a), (s = h);
                          }
                          for (; 2 < o; )
                            (h[f++] = s[i++]),
                              (h[f++] = s[i++]),
                              (h[f++] = s[i++]),
                              (o -= 3);
                          o && ((h[f++] = s[i++]), 1 < o && (h[f++] = s[i++]));
                        } else {
                          for (
                            i = f - a;
                            (h[f++] = h[i++]),
                              (h[f++] = h[i++]),
                              (h[f++] = h[i++]),
                              2 < (o -= 3);

                          );
                          o && ((h[f++] = h[i++]), 1 < o && (h[f++] = h[i++]));
                        }
                        break;
                      }
                    }
                    break;
                  }
                } while (c < u && f < b);
                (k &= (1 << (_ -= (o = _ >> 3) << 3)) - 1),
                  (e.next_in = c -= o),
                  (e.next_out = f),
                  (e.avail_in = c < u ? u - c + 5 : 5 - (c - u)),
                  (e.avail_out = f < b ? b - f + 257 : 257 - (f - b)),
                  (l.hold = k),
                  (l.bits = _);
              };
            },
            "zlib/inftrees.js": function (e, t, n) {
              "use strict";
              var I = e("../utils/common"),
                L = [
                  3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35,
                  43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0,
                ],
                z = [
                  16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 18, 18, 18,
                  18, 19, 19, 19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 16, 72,
                  78,
                ],
                O = [
                  1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193,
                  257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193,
                  12289, 16385, 24577, 0, 0,
                ],
                N = [
                  16, 16, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22,
                  22, 23, 23, 24, 24, 25, 25, 26, 26, 27, 27, 28, 28, 29, 29,
                  64, 64,
                ];
              t.exports = function (e, t, n, r, o, a, i, s) {
                for (
                  var l,
                    c,
                    d,
                    u,
                    f,
                    h,
                    m,
                    b,
                    g,
                    p = s.bits,
                    w = 0,
                    v = 0,
                    y = 0,
                    k = 0,
                    _ = 0,
                    x = 0,
                    S = 0,
                    C = 0,
                    E = 0,
                    U = 0,
                    D = null,
                    B = 0,
                    A = new I.Buf16(16),
                    T = new I.Buf16(16),
                    R = null,
                    P = 0,
                    w = 0;
                  w <= 15;
                  w++
                )
                  A[w] = 0;
                for (v = 0; v < r; v++) A[t[n + v]]++;
                for (_ = p, k = 15; 1 <= k && 0 === A[k]; k--);
                if ((k < _ && (_ = k), 0 === k))
                  (o[a++] = 20971520), (o[a++] = 20971520), (s.bits = 1);
                else {
                  for (y = 1; y < k && 0 === A[y]; y++);
                  for (_ < y && (_ = y), w = C = 1; w <= 15; w++)
                    if ((C = (C <<= 1) - A[w]) < 0) return -1;
                  if (0 < C && (0 === e || 1 !== k)) return -1;
                  for (T[1] = 0, w = 1; w < 15; w++) T[w + 1] = T[w] + A[w];
                  for (v = 0; v < r; v++)
                    0 !== t[n + v] && (i[T[t[n + v]]++] = v);
                  if (
                    ((h =
                      0 === e
                        ? ((D = R = i), 19)
                        : 1 === e
                        ? ((D = L), (B -= 257), (R = z), (P -= 257), 256)
                        : ((D = O), (R = N), -1)),
                    (w = y),
                    (f = a),
                    (S = v = U = 0),
                    (d = -1),
                    (u = (E = 1 << (x = _)) - 1),
                    (1 === e && 852 < E) || (2 === e && 592 < E))
                  )
                    return 1;
                  for (;;) {
                    for (
                      g =
                        i[v] < h
                          ? ((b = 0), i[v])
                          : i[v] > h
                          ? ((b = R[P + i[v]]), D[B + i[v]])
                          : ((b = 96), 0),
                        l = 1 << (m = w - S),
                        y = c = 1 << x;
                      (o[f + (U >> S) + (c -= l)] =
                        (m << 24) | (b << 16) | g | 0),
                        0 !== c;

                    );
                    for (l = 1 << (w - 1); U & l; ) l >>= 1;
                    if (
                      ((U = 0 !== l ? (U & (l - 1)) + l : 0), v++, 0 == --A[w])
                    ) {
                      if (w === k) break;
                      w = t[n + i[v]];
                    }
                    if (_ < w && (U & u) !== d) {
                      for (
                        f += y, C = 1 << (x = w - (S = 0 === S ? _ : S));
                        x + S < k && !((C -= A[x + S]) <= 0);

                      )
                        x++, (C <<= 1);
                      if (
                        ((E += 1 << x),
                        (1 === e && 852 < E) || (2 === e && 592 < E))
                      )
                        return 1;
                      o[(d = U & u)] = (_ << 24) | (x << 16) | (f - a) | 0;
                    }
                  }
                  0 !== U && (o[f + U] = ((w - S) << 24) | (64 << 16) | 0),
                    (s.bits = _);
                }
                return 0;
              };
            },
          };
        for (t in n) n[t].folder = t.substring(0, t.lastIndexOf("/") + 1);
        function r(e, t) {
          var n = t.match(/^\//)
            ? null
            : e
            ? t.match(/^\.\.?\//)
              ? o(e.folder + t)
              : a(e, t)
            : o(t);
          if (n)
            return (
              n.exports ||
                ((n.parent = e), n(r.bind(null, n), n, (n.exports = {}))),
              n.exports
            );
          throw "module not found: " + t;
        }
        var o = function (e) {
            var t = [];
            return (e = e.split("/").every(function (e) {
              return ".." == e ? t.pop() : "." == e || "" == e || t.push(e);
            })
              ? t.join("/")
              : null)
              ? n[e] || n[e + ".js"] || n[e + "/index.js"]
              : null;
          },
          a = function (e, t) {
            return e
              ? o(e.folder + "node_modules/" + t) || a(e.parent, t)
              : null;
          };
        return r(null, e);
      },
      decompress: function (e) {
        this.exports || (this.exports = this.require("inflate.js"));
        try {
          return this.exports.inflate(e);
        } catch (e) {}
      },
      hasUnityMarker: function (e) {
        var t = 10,
          n = "UnityWeb Compressed Content (gzip)";
        if (t > e.length || 31 != e[0] || 139 != e[1]) return !1;
        var r = e[3];
        if (4 & r) {
          if (t + 2 > e.length) return !1;
          if ((t += 2 + e[t] + (e[t + 1] << 8)) > e.length) return !1;
        }
        if (8 & r) {
          for (; t < e.length && e[t]; ) t++;
          if (t + 1 > e.length) return !1;
          t++;
        }
        return (
          16 & r &&
          String.fromCharCode.apply(null, e.subarray(t, t + n.length + 1)) ==
            n + "\0"
        );
      },
    },
  };
  function B(n) {
    S(n);
    var e = u.cacheControl(u[n]),
      t = u.companyName && u.productName ? u.cachedFetch : u.fetchWithProgress,
      r = u[n],
      r = /file:\/\//.exec(r) ? "same-origin" : void 0;
    return t(u[n], {
      method: "GET",
      companyName: u.companyName,
      productName: u.productName,
      productVersion: u.productVersion,
      control: e,
      mode: r,
      onProgress: function (e) {
        S(n, e);
      },
    })
      .then(function (e) {
        return (
          (i = e.parsedBody),
          (s = u[n]),
          new Promise(function (e, t) {
            try {
              for (var n in D) {
                var r, o, a;
                if (D[n].hasUnityMarker(i))
                  return (
                    s &&
                      console.log(
                        'You can reduce startup time if you configure your web server to add "Content-Encoding: ' +
                          n +
                          '" response header when serving "' +
                          s +
                          '" file.'
                      ),
                    (r = D[n]).worker ||
                      ((o = URL.createObjectURL(
                        new Blob(
                          [
                            "this.require = ",
                            r.require.toString(),
                            "; this.decompress = ",
                            r.decompress.toString(),
                            "; this.onmessage = ",
                            function (e) {
                              e = {
                                id: e.data.id,
                                decompressed: this.decompress(
                                  e.data.compressed
                                ),
                              };
                              postMessage(
                                e,
                                e.decompressed ? [e.decompressed.buffer] : []
                              );
                            }.toString(),
                            "; postMessage({ ready: true });",
                          ],
                          { type: "application/javascript" }
                        )
                      )),
                      (r.worker = new Worker(o)),
                      (r.worker.onmessage = function (e) {
                        e.data.ready
                          ? URL.revokeObjectURL(o)
                          : (this.callbacks[e.data.id](e.data.decompressed),
                            delete this.callbacks[e.data.id]);
                      }),
                      (r.worker.callbacks = {}),
                      (r.worker.nextCallbackId = 0)),
                    (a = r.worker.nextCallbackId++),
                    (r.worker.callbacks[a] = e),
                    void r.worker.postMessage({ id: a, compressed: i }, [
                      i.buffer,
                    ])
                  );
              }
              e(i);
            } catch (e) {
              t(e);
            }
          })
        );
        var i, s;
      })
      .catch(function (e) {
        var t = "Failed to download file " + u[n];
        "file:" == location.protocol
          ? c(
              t +
                ". Loading web pages via a file:// URL without a web server is not supported by this browser. Please use a local development web server to host Unity content, or use the Unity Build and Run option.",
              "error"
            )
          : console.error(t);
      });
  }
  function A() {
    Promise.all([
      B("frameworkUrl").then(function (e) {
        var s = URL.createObjectURL(
          new Blob([e], { type: "application/javascript" })
        );
        return new Promise(function (a, e) {
          var i = document.createElement("script");
          (i.src = s),
            (i.onload = function () {
              if ("undefined" == typeof unityFramework || !unityFramework) {
                var e,
                  t = [
                    ["br", "br"],
                    ["gz", "gzip"],
                  ];
                for (e in t) {
                  var n,
                    r = t[e];
                  if (u.frameworkUrl.endsWith("." + r[0]))
                    return (
                      (n = "Unable to parse " + u.frameworkUrl + "!"),
                      "file:" == location.protocol
                        ? void c(
                            n +
                              " Loading pre-compressed (brotli or gzip) content via a file:// URL without a web server is not supported by this browser. Please use a local development web server to host compressed Unity content, or use the Unity Build and Run option.",
                            "error"
                          )
                        : ((n +=
                            ' This can happen if build compression was enabled but web server hosting the content was misconfigured to not serve the file with HTTP Response Header "Content-Encoding: ' +
                            r[1] +
                            '" present. Check browser Console and Devtools Network tab to debug.'),
                          "br" == r[0] &&
                            "http:" == location.protocol &&
                            ((r =
                              -1 !=
                              ["localhost", "127.0.0.1"].indexOf(
                                location.hostname
                              )
                                ? ""
                                : "Migrate your server to use HTTPS."),
                            (n = /Firefox/.test(navigator.userAgent)
                              ? "Unable to parse " +
                                u.frameworkUrl +
                                '!<br>If using custom web server, verify that web server is sending .br files with HTTP Response Header "Content-Encoding: br". Brotli compression may not be supported in Firefox over HTTP connections. ' +
                                r +
                                ' See <a href="https://bugzilla.mozilla.org/show_bug.cgi?id=1670675">https://bugzilla.mozilla.org/show_bug.cgi?id=1670675</a> for more information.'
                              : "Unable to parse " +
                                u.frameworkUrl +
                                '!<br>If using custom web server, verify that web server is sending .br files with HTTP Response Header "Content-Encoding: br". Brotli compression may not be supported over HTTP connections. Migrate your server to use HTTPS.')),
                          void c(n, "error"))
                    );
                }
                c(
                  "Unable to parse " +
                    u.frameworkUrl +
                    "! The file is corrupt, or compression was misconfigured? (check Content-Encoding HTTP Response Header on web server)",
                  "error"
                );
              }
              var o = unityFramework;
              (unityFramework = null),
                (i.onload = null),
                URL.revokeObjectURL(s),
                a(o);
            }),
            (i.onerror = function (e) {
              c(
                "Unable to load file " +
                  u.frameworkUrl +
                  "! Check that the file exists on the remote server. (also check browser Console and Devtools Network tab to debug)",
                "error"
              );
            }),
            document.body.appendChild(i),
            u.deinitializers.push(function () {
              document.body.removeChild(i);
            });
        });
      }),
      B("codeUrl"),
    ]).then(function (e) {
      (u.wasmBinary = e[1]), e[0](u);
    });
    var e = B("dataUrl");
    u.preRun.push(function () {
      u.addRunDependency("dataUrl"),
        e.then(function (e) {
          var t = new DataView(e.buffer, e.byteOffset, e.byteLength),
            n = 0,
            r = "UnityWebData1.0\0";
          if (
            !String.fromCharCode.apply(null, e.subarray(n, n + r.length)) == r
          )
            throw "unknown data format";
          var o = t.getUint32((n += r.length), !0);
          for (n += 4; n < o; ) {
            var a = t.getUint32(n, !0),
              i = ((n += 4), t.getUint32(n, !0)),
              s = ((n += 4), t.getUint32(n, !0)),
              l =
                ((n += 4),
                String.fromCharCode.apply(null, e.subarray(n, n + s)));
            n += s;
            for (
              var c = 0, d = l.indexOf("/", c) + 1;
              0 < d;
              c = d, d = l.indexOf("/", c) + 1
            )
              u.FS_createPath(l.substring(0, c), l.substring(c, d - 1), !0, !0);
            u.FS_createDataFile(l, null, e.subarray(a, a + i), !0, !0, !0);
          }
          u.removeRunDependency("dataUrl");
        });
    });
  }
  return new Promise(function (e, t) {
    var n;
    u.SystemInfo.hasWebGL
      ? 1 == u.SystemInfo.hasWebGL
        ? ((n =
            'Your browser does not support graphics API "WebGL 2" which is required for this content.'),
          "Safari" == u.SystemInfo.browser &&
            parseInt(u.SystemInfo.browserVersion) < 15 &&
            (u.SystemInfo.mobile || 1 < navigator.maxTouchPoints
              ? (n += "\nUpgrade to iOS 15 or later.")
              : (n += "\nUpgrade to Safari 15 or later.")),
          t(n))
        : u.SystemInfo.hasWasm
        ? ((u.startupErrorHandler = t),
          l(0),
          u.postRun.push(function () {
            l(1), delete u.startupErrorHandler, e(_);
          }),
          A())
        : t("Your browser does not support WebAssembly.")
      : t("Your browser does not support WebGL.");
  });
}

export default createUnityInstance