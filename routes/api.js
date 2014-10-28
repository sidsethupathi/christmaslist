
var FB              = require('../fb'),
    config          = require('../config');

exports.christmas = function(req, res) {
    FB.api('michael.norton.3726/feed', {
        limit:          200,
        access_token:   req.session.access_token
    }, function(result) {
        if(!result || result.error) {
            return res.send(500, 'error');
        }
        
        data = {};
        data.posts = [];
        data.people = {};
        var people = [];
        var comments = [];

        for(var p in result.data) {
            //console.log(p);
            //var regExp = /^([0-9]+)\. ([^\-]+) \- ([a-zA-Z0-9\-\.\, ]*).*$/gim;
            var regExp = /^([0-9]+)\. (.*) \- ([a-zA-Z0-9\-\.\, ]*).*$/gim,
                post = result.data[p],
                message = result.data[p].message,
                match = regExp.exec(message),
                likes_count = 0,
                comments_count = 0;

            if(match !== null) {
                if(post.hasOwnProperty("likes")) {
                    likes_count = post.likes.data.length;
                    for(var i in post.likes.data) {
                        var name = post["likes"].data[i].name;
                        if(!people.hasOwnProperty(name)) {
                            people[name] = [];
                        }
                        people[name].push(match[1]);
                    }
                }
                if(post.hasOwnProperty("comments")) {
                    comments_count = post.comments.data.length;
                    for(var j in post.comments.data) {
                        var name = post["comments"].data[j].from.name;
                        if(!comments.hasOwnProperty(name)) {
                            comments[name] = [];
                        }
                        comments[name].push(match[1]);
                    }
                }

                data.posts.push({
                    name: match[1] + '. ' + match[2] + ' - ' + match[3],
                    likes: likes_count,
                    comments: comments_count
                });
                console.log(match[2] + ' - ' + match[3]);
            }
        }

        // clean people data
        data.people.likes = [];
        data.people.comments = [];

        for(var key in people) {
            var count = people[key].length;

            data.people.likes.push({
                name: key,
                count: count
            });
        }

        for(key in comments) {
            var count = comments[key].length;

            data.people.comments.push({
                name: key,
                count: count
            });
        }

        console.log(data.people);
        res.send(data);
    });
};