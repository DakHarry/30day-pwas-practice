var deferredPrompt;
var enableNotifications = document.querySelectorAll('.enable-notifications');

if('serviceWorker' in navigator){
    window.addEventListener('load', function(){
        //navigator.serviceWorker.register('/service-worker.js')
        navigator.serviceWorker.register('/workbox-sw-v1.js')
        .then(function(){
            console.log('Service Worker 註冊成功');
        })
        .catch(function(err){
            console.log(err);
        });
    });
}

window.addEventListener('beforeinstallprompt', function(event){
    console.log('beforeinstallprompt fired');
    event.preventDefault();
    deferredPrompt = event;
    return false;
});


// fetch('https://httpbin.org/get')
//     .then(function(response){
//         return response.json();
//     })
//     .then(function(data){
//         createData();
//     });
function onSaveButtonClicked(event) {
  console.log('點擊按鈕');
}

var sharedMomentsArea = document.querySelector('#shared-moments');

function createData(article) {
  var cardFrame = document.createElement('div');
  cardFrame.className = 'shared-moment-card mdl-card mdl-shadow--2dp card-frame';

  var cardTitle = document.createElement('div');
  cardTitle.className = 'mdl-card__title';
  cardTitle.style.backgroundImage = 'url('+article.image+')';
  cardTitle.style.backgroundSize = 'cover';
  cardTitle.style.height = '200px';
  cardFrame.appendChild(cardTitle);
  var cardTitleText = document.createElement('h2');
  cardTitleText.style.color = '#fff';
  cardTitleText.className = 'mdl-card__title-text';
  cardTitleText.textContent = article.location;
  cardTitle.appendChild(cardTitleText);
  var cardContentText = document.createElement('div');
  cardContentText.className = 'mdl-card__supporting-text';
  cardContentText.textContent = article.content;
  cardContentText.style.textAlign = 'center';
  var cardSaveButton = document.createElement('button');
  cardSaveButton.className = 'card-btn';
  cardSaveButton.textContent = '儲存';
  cardSaveButton.addEventListener('click', onSaveButtonClicked);
  cardContentText.appendChild(cardSaveButton);
  cardFrame.appendChild(cardContentText);
  sharedMomentsArea.appendChild(cardFrame);
}

// var url = 'https://httpbin.org/get';


// fetch(url)
//     .then(function(response){
//         return response.json();
//     })
//     .then(function(data){
//         createData();
//     });
function updateArticles(articles){
    for(var i =0; i < articles.length; i++){
        createData(articles[i]);
    }
}
function getArticleArray(data){
    var articles = [];
    for(var key in data){
        console.log('key',key);
        articles.push(data[key]);
    }
    return articles;
}

var dataFromNetwork = false;
var articleUrl = 'https://days-pwas-practice.firebaseio.com/article.json';

fetch(articleUrl)
.then(function(response){
    return response.json();
})
.then(function(data){
    dataFromNetwork = true;
    console.log('fetch in window',dataFromNetwork);
    
    updateArticles(getArticleArray(data));
})
.then(function(){
    getArticleFromDB();
})
.catch(function(){
    getArticleFromDB();    
});

function getArticleFromDB(){
    if ('indexedDB' in window){
        readAllData('article')
            .then(function(data){
                console.log('indexedDB in window',dataFromNetwork);
                if(!dataFromNetwork){
                    console.log('IndexedDB Data',data);
                    updateArticles(data);
                }
            });
    }
}

// if('caches' in window){
//     caches.match(articleUrl)
//         .then(function(response){
//             if(response){
//                 return response.json();
//             }
//         })
//         .then(function(data){
//             console.log(data);
//             if(!dataFromNetwork){
//             //    var articles = [];
//             //     for(var key in data){
//             //         articles.push(data[key]);
//             //     }
//                 updateArticles(getArticleArray(data));
//             }
//         });
// }
function displayNotification(){
    if('serviceWorker' in navigator){
        var options = {
            body: '歡迎進入30天PWA的世界',
            icon: '/src/images/icons/demo-icon96.png',
            image: '/src/images/demo.JPG',
            dir: 'ltr',
            lang: 'zh-Hant', //BCP 47
            vibrate: [100, 50, 200],
            badge: '/src/images/icons/demo-icon96.png',
            tag: 'confirm-notification',
            renotify: true,
            actions: [
                { action: 'confirm', title: '確認', icon: '/src/images/icons/demo-icon96.png'},
                { action: 'cancel', title: '取消', icon: '/src/images/icons/demo-icon96.png'}
            ]
        };
        navigator.serviceWorker.ready
            .then(function(sw){
                sw.showNotification('訂閱成功！！！', options);
            })
    }  
     
}

function setPushSubscribe(){
    if (!('serviceWorker' in navigator)) 
        return;
    var reg;
    navigator.serviceWorker.ready
        .then(function(sw){
            reg = sw;
          return sw.pushManager.getSubscription();
        })
        .then(function(sub){
            if(sub === null){
                //建立新的訂閱
                var vapidPKey = 'BNaAfuqm_lOcGE8H8z-ad1BjE3gBmDQDppECZC1btjfVs4fpSAJbKUujBa31GYiUzOmwHQW4FX1qxGfXTsqBym8';
                var convertedVapidPKey = urlBase64ToUint8Array(vapidPKey);
                return reg.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: convertedVapidPKey
                });
            }else{
                //已經訂閱
            }
        })
        .then(function(newSub){
            return fetch('https://days-pwas-practice.firebaseio.com/subscriptions.json', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(newSub)
            })
        })
        .then(function(response){
            if(response.ok)
                displayNotification();
        })
        .catch(function(err){
            console.log('訂閱失敗',err);
        });
}

function urlBase64ToUint8Array(base64String){
    var padding = '='.repeat((4 - base64String.length % 4) % 4);
    var base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g,'/');
    var rawData = window.atob(base64);
    var outputArr = new Uint8Array(rawData.length);

    for (var i = 0; i < rawData.length; ++i ){
        outputArr[i] = rawData.charCodeAt(i);
    }    
    return outputArr;
}

function askForNotificationPermission() {
    Notification.requestPermission(function(status){
        console.log('User Choice', status);
        if (status !== 'granted') {
            console.log('推播允許被拒絕了!');
        } else {
            // displayNotification();
            setPushSubscribe();
        }
    });
}

if ('Notification' in window && 'serviceWorker' in navigator) {
    for (var i= 0; i < enableNotifications.length; i++) {
        enableNotifications[i].style.display = 'inline-block';
        enableNotifications[i].addEventListener('click', askForNotificationPermission);
    }
}