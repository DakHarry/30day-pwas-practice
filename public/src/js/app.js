var deferredPrompt;

if('serviceWorker' in navigator){
    // navigator.serviceWorker
    //     .register('/service-worker.js')
    //     .then(function(){
    //         console.log('Service Worker 註冊成功');
    //     });
    window.addEventListener('load', function(){
        navigator.serviceWorker.register('/service-worker.js')
        .then(function(){
            console.log('Service Worker 註冊成功');
        });
    });
}



window.addEventListener('beforeinstallprompt', function(event){
    console.log('beforeinstallprompt fired');
    event.preventDefault();
    deferredPrompt = event;
    return false;
});



