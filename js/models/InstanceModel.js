var Instance = Backbone.Model.extend({
    
    _action:function(method, options) {
        var model = this;
        options.success = function(resp) {
            model.trigger('sync', model, resp, options);
            if (options.callback!=undefined) {
                options.callback(resp);
            }
        }
        var xhr = (this.sync || Backbone.sync).call(this, method, this, options);
        return xhr;
    },
         
    reboot: function(soft, options) {
        options = options || {}; 
        
       	options.soft = soft;
      	return this._action("reboot", options);
    },
    
    resize: function(flavor, options) {
        options = options || {};
        options.flavor = flavor;
        return this._action('resize', options);
    },
    
    confirmresize: function(options) {
        return this._action('confirm-resize', options);
    },
    
    revertresize: function(options) {
        return this._action('revert-resize', options);
    },
    
    changepassword: function(adminPass, options) {
        options = options || {};
        options.adminPass = adminPass;
        return this._action('change-password', options);
    },
    
    createimage: function(options) {
        return this._action('create-image', options);        
    },
    
    vncconsole: function(options) {
        return this._action('get-vncconsole', options);
    },
    
    consoleoutput: function(options) {
        if (options == undefined) {
            options = {};
        }
        if (options.length == undefined) {
            options.length = 35;
        }
        return this._action('consoleoutput', options);
    },
    
    sync: function(method, model, options) {
        switch(method) {
            case "create":
                JSTACK.Nova.createserver(model.get("name"), model.get("imageReg"), model.get("flavorReg"), model.get("key_name"), 
                    model.get("user_data"), model.get("security_groups"), model.get("min_count"), model.get("max_count"), 
                    model.get("availability_zone"), options.success);
                break;
            case "delete":
                JSTACK.Nova.deleteserver(model.get("id"), options.success);
                break;
            case "update":
                console.log("Updating Instance: " + model.get("name"));
                JSTACK.Nova.updateserver(model.get("id"), model.get("name"), options.success);
                break;
            case "read":
                console.log("Reading Instance: " + model.get("id"));
                JSTACK.Nova.getserverdetail(model.get("id"), options.success);
                break;
            case "reboot":
                if (options.soft != undefined && options.soft) {
                    JSTACK.Nova.rebootserversoft(model.get("id"), options.success);
                } else {
                    JSTACK.Nova.rebootserverhard(model.get("id"), options.success);
                }
                break;
            case "resize":
                JSTACK.Nova.resizeserver(model.get("id"), options.flavor.id, options.success);
                break;
            case "confirm-resize":
                JSTACK.Nova.confirmresizedserver(model.get("id"), options.success);
                break;
            case "revert-resize":
                JSTACK.Nova.revertresizedserver(nmodel.get("id"), options.success);
                break;
            case "change-password":
                JSTACK.Nova.changepasswordserver(model.get("id"), options.adminPass, options.success);
                break;
            case "create-image":
                JSTACK.Nova.createimage(model.get("id"), options.success);
                break;
            case "get-vncconsole":
                JSTACK.Nova.getvncconsole(model.get("id"), "novnc", options.success);
                break;
            case "consoleoutput":
                JSTACK.Nova.getconsoleoutput(model.get("id"), options.length, options.success);
                break;
        }
    },
    
    parse: function(resp) {
        if (resp.server != undefined) {
            return resp.server;
        } else {
            return resp;
        }
    }
});

var Instances = Backbone.Collection.extend({
    
    model: Instance,
    
    sync: function(method, model, options) {
        switch(method) {
            case "read":
                JSTACK.Nova.getserverlist(true, this.alltenants, options.success);
                break;
        }
    },
    
    parse: function(resp) {
        return resp.servers;
    }
    
});