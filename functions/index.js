var functions = require('firebase-functions');
var admin = require('firebase-admin');
var cors = require('cors')({orgin: true});
var webpush = require('web-push');

var vapidKeys = {
    publicKey: 'BNaAfuqm_lOcGE8H8z-ad1BjE3gBmDQDppECZC1btjfVs4fpSAJbKUujBa31GYiUzOmwHQW4FX1qxGfXTsqBym8',
    privateKey: 'GKukjt9CaJccs88FK7Wqt3MrH9E9EmqOLjYYodZukZY'
}
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
var serviceAccount = require("./pwa-firebase-pk.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://days-pwas-practice.firebaseio.com/'
});

exports.storePostData = functions.https.onRequest(function(request, response) {
    cors(request, response, function(){
        admin.database().ref('article').push({
            id: request.body.id,
            title: request.body.title,
            location: request.body.location,
            image: request.body.image,
            content: request.body.content
        })
        .then(function(){
            webpush.setVapidDetails('mailto:monkey030210@gmail.com',
             vapidKeys.publicKey,
             vapidKeys.privateKey
             );
             return admin.database().ref('subscriptions').once('value');
        })
        .then(function(subs){
            subs.forEach(function(sub){
                var pushConfig = {
                    endpoint: sub.val().endpoint,
                    keys: {
                        auth: sub.val().keys.auth,
                        p256dh: sub.val().keys.p256dh
                    }
                };
                webpush.sendNotification(pushConfig, JSON.stringify({title: '回來逛逛哦', content: '再撐一下就到30天啦'}))
                    .catch(function(err){
                        console.log('Server 推播失敗',err);
                    });
            });
            response.status(201).json({message: '資料送出', id: request.body.id});
            
        })
        .catch(function(err) {
            response.status(500).json({error: err});
        });
    });
})