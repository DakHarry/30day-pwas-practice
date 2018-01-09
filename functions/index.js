var functions = require('firebase-functions');
var admin = require('firebase-admin');
var cors = require('cors')({orgin: true});
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
            response.status(201).json({message: '資料送出', id: request.body.id});
        })
        .catch(function(err) {
            response.status(500).json({error: err});
        });
    });
})