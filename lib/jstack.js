var JSTACK = JSTACK || {};
JSTACK.VERSION = "0.1";
JSTACK.AUTHORS = "GING";
JSTACK.Comm = function(d, c) {
  var e = function(f, d, b, a, g, i) {
    var e = new XMLHttpRequest;
    e.open(f, d, !0);
    e.setRequestHeader("Content-Type", "application/json");
    e.setRequestHeader("Accept", "application/json");
    e.onreadystatechange = function() {
      if(4 == e.readyState) {
        switch(e.status) {
          case 100:
          ;
          case 200:
          ;
          case 201:
          ;
          case 202:
          ;
          case 203:
          ;
          case 204:
          ;
          case 205:
            var a = c;
            e.responseText != c && "" != e.responseText && (a = JSON.parse(e.responseText));
            g(a);
            break;
          case 400:
            i("400 Bad Request");
            break;
          case 401:
            i("401 Unauthorized");
            break;
          case 403:
            i("403 Forbidden");
            break;
          default:
            i(e.status + " Error")
        }
      }
    };
    a != c && e.setRequestHeader("X-Auth-Token", a);
    b != c ? (f = JSON.stringify(b), e.send(f)) : e.send()
  };
  return{get:function(f, d, b, a) {
    e("GET", f, c, d, b, a)
  }, post:function(c, d, b, a, g) {
    e("POST", c, d, b, a, g)
  }, put:function(c, d, b, a, g) {
    e("PUT", c, d, b, a, g)
  }, del:function(d, h, b, a) {
    e("DELETE", d, c, h, b, a)
  }}
}(JSTACK);
JSTACK.Utils = function(d) {
  return{encode:function(c) {
    var e = "", f, h, b, a, g, i, k = 0, c = c.replace(/\r\n/g, "\n");
    h = "";
    for(b = 0;b < c.length;b++) {
      a = c.charCodeAt(b), 128 > a ? h += String.fromCharCode(a) : (127 < a && 2048 > a ? h += String.fromCharCode(a >> 6 | 192) : (h += String.fromCharCode(a >> 12 | 224), h += String.fromCharCode(a >> 6 & 63 | 128)), h += String.fromCharCode(a & 63 | 128))
    }
    for(c = h;k < c.length;) {
      f = c.charCodeAt(k++), h = c.charCodeAt(k++), b = c.charCodeAt(k++), a = f >> 2, f = (f & 3) << 4 | h >> 4, g = (h & 15) << 2 | b >> 6, i = b & 63, isNaN(h) ? g = i = 64 : isNaN(b) && (i = 64), e = e + d.Utils._keyStr.charAt(a) + Base64._keyStr.charAt(f) + d.Utils._keyStr.charAt(g) + Base64._keyStr.charAt(i)
    }
    return e
  }, decode:function(c) {
    for(var e = "", f, h, b, a, g, i = 0, c = c.replace(/[^A-Za-z0-9\+\/\=]/g, "");i < c.length;) {
      f = d.Utils._keyStr.indexOf(c.charAt(i++)), h = d.Utils._keyStr.indexOf(c.charAt(i++)), a = d.Utils._keyStr.indexOf(c.charAt(i++)), g = d.Utils._keyStr.indexOf(c.charAt(i++)), f = f << 2 | h >> 4, h = (h & 15) << 4 | a >> 2, b = (a & 3) << 6 | g, e += String.fromCharCode(f), 64 != a && (e += String.fromCharCode(h)), 64 != g && (e += String.fromCharCode(b))
    }
    c = e;
    e = "";
    for(g = c1 = c2 = a = 0;a < c.length;) {
      g = c.charCodeAt(a), 128 > g ? (e += String.fromCharCode(g), a++) : 191 < g && 224 > g ? (c2 = c.charCodeAt(a + 1), e += String.fromCharCode((g & 31) << 6 | c2 & 63), a += 2) : (c2 = c.charCodeAt(a + 1), c3 = c.charCodeAt(a + 2), e += String.fromCharCode((g & 15) << 12 | (c2 & 63) << 6 | c3 & 63), a += 3)
    }
    return e
  }}
}(JSTACK);
JSTACK.Keystone = function(d, c) {
  var e = {DISCONNECTED:0, AUTHENTICATING:1, AUTHENTICATED:2, AUTHENTICATION_ERROR:3}, f = {url:c, currentstate:c, access:c, token:c};
  return{STATES:e, params:f, init:function(d) {
    f.url = d;
    f.access = c;
    f.token = c;
    f.currentstate = e.DISCONNECTED
  }, authenticate:function(h, b, a, g, i, k) {
    var j = {}, j = a != c ? {auth:{token:{id:a}}} : {auth:{passwordCredentials:{username:h, password:b}}};
    g !== c && (j.auth.tenantId = g);
    f.currentstate = e.AUTHENTICATING;
    d.Comm.post(f.url + "tokens", j, c, function(a) {
      f.currentstate = d.Keystone.STATES.AUTHENTICATED;
      f.access = a.access;
      f.token = f.access.token.id;
      i != c && i(a)
    }, function(a) {
      f.currentstate = e.AUTHENTICATION_ERROR;
      k(a)
    })
  }, gettenants:function(e) {
    f.currentstate == d.Keystone.STATES.AUTHENTICATED && d.Comm.get(f.url + "tenants", f.token, function(b) {
      e != c && e(b)
    }, function(b) {
      throw Error(b);
    })
  }, getservice:function(d) {
    if(f.currentstate != e.AUTHENTICATED) {
      return c
    }
    for(var b in f.access.serviceCatalog) {
      var a = f.access.serviceCatalog[b];
      if(d == a.type) {
        return a
      }
    }
    return c
  }, getservicelist:function() {
    return f.currentstate != e.AUTHENTICATED ? c : f.access.serviceCatalog
  }}
}(JSTACK);
JSTACK.Nova = function(d, c) {
  var e = c, f = function() {
    return d.Keystone != c && d.Keystone.params.currentstate == d.Keystone.STATES.AUTHENTICATED ? (e = d.Keystone.getservice("compute").endpoints[0].adminURL, !0) : !1
  }, h = function(b, a, g, i) {
    f() && d.Comm.post(e + "/servers/" + b + "/action", a, d.Keystone.params.token, function(a) {
      i != c && i(a)
    }, function(a) {
      throw Error(a);
    })
  };
  return{getserverlist:function(b, a, g) {
    if(f()) {
      var i = e + "/servers";
      b != c & b && (i += "/detail");
      a && (i += "?all_tenants=" + a);
      d.Comm.get(i, d.Keystone.params.token, function(a) {
        g != c && g(a)
      }, function(a) {
        throw Error(a);
      })
    }
  }, getserverdetail:function(b, a) {
    f() && d.Comm.get(e + "/servers/" + b, d.Keystone.params.token, function(b) {
      a != c && a(b)
    }, function(a) {
      throw Error(a);
    })
  }, getserverips:function(b, a, g) {
    f() && (b = e + "/servers/" + b + "/ips", a != c && (b += "/" + a), d.Comm.get(b, d.Keystone.params.token, function(a) {
      g != c && g(a)
    }, function(a) {
      throw Error(a);
    }))
  }, updateserver:function(b, a, g) {
    f() && a != c && d.Comm.put(e + "/servers/" + b, {server:{name:a}}, d.Keystone.params.token, function(a) {
      g != c && g(a)
    }, function(a) {
      throw Error(a);
    })
  }, createserver:function(b, a, g, i, h, j, l, m, n, o) {
    if(f()) {
      b = {server:{name:b, imageRef:a, flavorRef:g}};
      i != c && (b.server.key_name = i);
      h != c && (b.server.user_data = d.Utils.encode(h));
      if(j != c) {
        var i = [], p;
        for(p in j) {
          i.push({name:j[p]})
        }
        b.server.security_groups = i
      }
      l == c && (l = 1);
      b.server.min_count = l;
      m == c && (m = 1);
      b.server.max_count = m;
      n != c && (b.server.availability_zone = d.Utils.encode(n));
      d.Comm.post(e + "/servers", b, d.Keystone.params.token, function(a) {
        o != c && o(a)
      }, function(a) {
        throw Error(a);
      })
    }
  }, deleteserver:function(b, a) {
    f() && d.Comm.del(e + "/servers/" + b, d.Keystone.params.token, function(b) {
      a != c && a(b)
    }, function(a) {
      throw Error(a);
    })
  }, changepasswordserver:function(b, a, g) {
    a != c && h(b, {changePassword:{adminPass:a}}, g)
  }, rebootserverhard:function(b, a) {
    h(b, {reboot:{type:"HARD"}}, a)
  }, rebootserversoft:function(b, a) {
    h(b, {reboot:{type:"SOFT"}}, a)
  }, resizeserver:function(b, a, c) {
    h(b, {resize:{flavorRef:a}}, c)
  }, confirmresizedserver:function(b, a) {
    h(b, {confirmResize:null}, a)
  }, revertresizedserver:function(b, a) {
    h(b, {revertResize:null}, a)
  }, createimage:function(b, a, g, d) {
    a = {createImage:{name:a}};
    a.creageImage.metadata = {};
    g != c && (a.creageImage.metadata = g);
    h(b, a, d)
  }, getflavorlist:function(b, a) {
    if(f()) {
      var g = e + "/flavors";
      b != c & b && (g += "/detail");
      d.Comm.get(g, d.Keystone.params.token, function(b) {
        a != c && a(b)
      }, function(a) {
        throw Error(a);
      })
    }
  }, getflavordetail:function(b, a) {
    f() && d.Comm.get(e + "/flavors/" + b, d.Keystone.params.token, function(b) {
      a != c && a(b)
    }, function(a) {
      throw Error(a);
    })
  }, createflavor:function(b, a, g, h, k, j, l, m, n) {
    if(f()) {
      var o = e + "/flavors", b = {flavor:{name:b, ram:a, vcpus:g, disk:h, id:k, swap:0, "OS-FLV-EXT-DATA:ephemeral":0, rxtx_factor:0}};
      j != c && (b.flavor["OS-FLV-EXT-DATA:ephemeral"] = j);
      l != c && (b.flavor.swap = l);
      m != c && (b.flavor.rxtx_factor = m);
      d.Comm.post(o, b, d.Keystone.params.token, function(a) {
        n != c && n(a)
      }, function(a) {
        throw Error(a);
      })
    }
  }, deleteflavor:function(b, a) {
    f() && d.Comm.del(e + "/flavors/" + b, d.Keystone.params.token, function(b) {
      a != c && a(b)
    }, function(a) {
      throw Error(a);
    })
  }, getimagelist:function(b, a) {
    if(f()) {
      var g = e + "/images";
      b != c & b && (g += "/detail");
      d.Comm.get(g, d.Keystone.params.token, function(b) {
        a != c && a(b)
      }, function(a) {
        throw Error(a);
      })
    }
  }, getimagedetail:function(b, a) {
    f() && d.Comm.get(e + "/images/" + b, d.Keystone.params.token, function(b) {
      a != c && a(b)
    }, function(a) {
      throw Error(a);
    })
  }, deleteimage:function(b, a) {
    f() && d.Comm.del(e + "/images/" + b, d.Keystone.params.token, function(b) {
      a != c && a(b)
    }, function(a) {
      throw Error(a);
    })
  }, getkeypairlist:function(b) {
    f() && d.Comm.get(e + "/os-keypairs", d.Keystone.params.token, function(a) {
      b != c && b(a)
    }, function(a) {
      throw Error(a);
    })
  }, createkeypair:function(b, a, g) {
    if(f()) {
      var h = e + "/os-keypairs", b = {keypair:{name:b}};
      a != c && (b.keypair.public_key = public_key);
      d.Comm.post(h, b, d.Keystone.params.token, function(a) {
        g != c && g(a)
      }, function(a) {
        throw Error(a);
      })
    }
  }, deletekeypair:function(b, a) {
    f() && d.Comm.del(e + "/os-keypairs/" + b, d.Keystone.params.token, function(b) {
      a != c && a(b)
    }, function(a) {
      throw Error(a);
    })
  }, getvncconsole:function(b, a, d) {
    if(f()) {
      if(a == c || !a) {
        a = "novnc"
      }
      h(b, {"os-getVNCConsole":{type:a}}, null, d)
    }
  }, getconsoleoutput:function(b, a, d) {
    if(f()) {
      if(a == c || !a) {
        a = 35
      }
      h(b, {"os-getConsoleOutput":{length:a}}, null, d)
    }
  }}
}(JSTACK);
JSTACK.Glance = function(d, c) {
  var e = c;
  return{getimagelist:function(f, h) {
    var b;
    d.Keystone != c && d.Keystone.params.currentstate == d.Keystone.STATES.AUTHENTICATED ? (e = d.Keystone.getservice("image").endpoints[0].adminURL, b = !0) : b = !1;
    b && (b = e + "/images", f != c & f && (b += "/detail"), d.Comm.get(b, d.Keystone.params.token, function(a) {
      h != c && h(a)
    }, function(a) {
      throw Error(a);
    }))
  }}
}(JSTACK);

