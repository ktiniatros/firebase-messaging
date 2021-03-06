var request = require("request");

function checkSet(json, opt, key, expected) {
    if (opt && opt[key] && typeof opt[key] == expected)
        json[key] = opt[key];
}

function firebase(api_key) {
    this.options = {
        url: "https://fcm.googleapis.com/fcm/send",
        method: "POST",
        headers: {
            "Authorization": "key=" + api_key,
            "Content-Type": "application/json"
        },
        json: {}
    };
}

firebase.prototype.send = function(to, data, opt, cb) {

    const options = JSON.parse(JSON.stringify(this.options));
    const json = options.json;

    if (typeof opt == "function")
        cb = opt;

    json.to = to;
    json.data = data;

    checkSet(json, opt, "priority", "string");
    checkSet(json, opt, "collapse_key", "string");
    checkSet(json, opt, "time_to_live", "number");
    checkSet(json, opt, "delay_while_idle", "boolean");
    checkSet(json, opt, "notification", "object");

    request(options, function(err, response, body) {

        if (cb)
            if (body != null)
                try {
                    cb(JSON.parse(body));
                } catch (err) {
                    cb(body);
                } else
                    cb(err);

    });

};

firebase.prototype.message = function(to, data, opt, cb) {
    this.send(to, data, opt, cb);
};

firebase.prototype.topic = function(topic, data, opt, cb) {
    this.send("/topics/" + topic, data, opt, cb);
};

module.exports = firebase;