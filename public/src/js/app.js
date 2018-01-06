var deferredPrompt;

if('serviceWorker' in navigator){
    window.addEventListener('load', function(){
        navigator.serviceWorker.register('/service-worker.js')
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