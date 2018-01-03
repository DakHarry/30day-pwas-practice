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

function createData() {
  var cardFrame = document.createElement('div');
  cardFrame.className = 'shared-moment-card mdl-card mdl-shadow--2dp card-frame';

  var cardTitle = document.createElement('div');
  cardTitle.className = 'mdl-card__title';
  cardTitle.style.backgroundImage = 'url("src/images/taipei_street.PNG")';
  cardTitle.style.backgroundSize = 'cover';
  cardTitle.style.height = '200px';
  cardFrame.appendChild(cardTitle);
  var cardTitleText = document.createElement('h2');
  cardTitleText.style.color = '#fff';
  cardTitleText.className = 'mdl-card__title-text';
  cardTitleText.textContent = '台北市';
  cardTitle.appendChild(cardTitleText);
  var cardContentText = document.createElement('div');
  cardContentText.className = 'mdl-card__supporting-text';
  cardContentText.textContent = '到此一遊!';
  cardContentText.style.textAlign = 'center';
  var cardSaveButton = document.createElement('button');
  cardSaveButton.className = 'card-btn';
  cardSaveButton.textContent = '儲存';
  cardSaveButton.addEventListener('click', onSaveButtonClicked);
  cardContentText.appendChild(cardSaveButton);
  cardFrame.appendChild(cardContentText);
  componentHandler.upgradeElement(cardFrame);
  sharedMomentsArea.appendChild(cardFrame);
}

var url = 'https://httpbin.org/get';

if('caches' in window){
    caches.match(url)
        .then(function(response){
            if(response){
                return response.json();
            }
        })
        .then(function(data){
            console.log(data);
            createData();
        })
}
fetch(url)
    .then(function(response){
        return response.json();
    })
    .then(function(data){
        createData();
    });
