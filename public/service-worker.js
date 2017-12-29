var CACHE_STATIC = 'static-v2.0';
var CACHE_DYNAMIC = 'dynamic-v1.0';

self.addEventListener('install', function(event){
    console.log('[SW] 安裝(Install) Service Worker!',event);
    event.waitUntil(
      caches.open(CACHE_STATIC)
        .then(function(cache){
            console.log('[SW] ');
            // cache.add('/'); //cache 路徑
            // cache.add('/index.html');
            // cache.add('/src/js/app.js'); 
            // cache.add('/src/css/app.css');
            cache.addAll([
                '/',
                '/index.html',
                '/src/js/app.js',
                '/src/js/post.js',
                '/src/js/material.min.js',
                '/src/css/material.blue-red.min.css',
                '/src/css/app.css',
                '/src/images/demo.jpg',
                'https://fonts.googleapis.com/css?family=Roboto:400,700',
                'https://fonts.googleapis.com/icon?family=Material+Icons'
            ]);   
        })  
    ); 
});

self.addEventListener('activate', function(event){
    console.log('[SW] 觸發(Activate) Service Worker!',event);
    // caches.open('static').then(function(cache){
    //     cache.keys().then(function(keys){
    //         keys.forEach(function(request,index, array) {
    //             cache.delete(request);
    //         });
    //     });
    // })
    event.waitUntil(
        caches.keys()
            .then(function(keys){
                return Promise.all(keys.map(function(key){
                    if(key !== CACHE_STATIC &&
                        key !== CACHE_DYNAMIC){
                            console.log('[SW] 刪除舊的快取');
                            return caches.delete(key);
                        }
                        //如果 map不到就回傳null
                }));
            })
    );
    return self.clients.claim();
});

self.addEventListener('fetch', function(event){
    // console.log('[SW] 抓資料(Fetch)!',event);
    // event.respondWith(fetch(event.request));
    event.respondWith(
        caches.match(event.request)
            .then(function(response){
                //抓不到會拿到 null
                if(response){
                    return response;
                }else{
                    return fetch(event.request)
                        .then(function(res){
                            caches.open(CACHE_DYNAMIC)
                                .then(function(cache){
                                    cache.put(event.request.url, res.clone());
                                    return res;
                                })
                        });
                }
            })
    )
});