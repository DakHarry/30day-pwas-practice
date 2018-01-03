var CACHE_STATIC = 'static-v6.2';
var CACHE_DYNAMIC = 'dynamic-v4.2';

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
                '/offlinePage.html',
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

// self.addEventListener('fetch', function(event){
//     // console.log('[SW] 抓資料(Fetch)!',event);
//     // event.respondWith(fetch(event.request));
//     event.respondWith(
//         caches.match(event.request)
//             .then(function(response){
//                 //抓不到會拿到 null
//                 if(response){
//                     return response;
//                 }else{
//                     return fetch(event.request)
//                         .then(function(res){
//                             caches.open(CACHE_DYNAMIC)
//                                 .then(function(cache){
//                                     cache.put(event.request.url, res.clone());
//                                     return res;
//                                 })
//                         });
//                 }
//             })
//     )
// });

// self.addEventListener('fetch', function(event){
//     console.log('Cache only!');
//     event.respondWith(
//         caches.match(event.request)
//     );
// });

// self.addEventListener('fetch', function(event){
//     console.log('Network only!');
//     event.respondWith(
//         fetch(event.request)
//     );
// });

// self.addEventListener('fetch', function(event){
//     console.log('Network with Cache Fallback');
//     event.respondWith(
//         fetch(event.request)
//         .then(function(response){
//             return caches.open(CACHE_DYNAMIC)
//                     .then(function(cache){
//                         cache.put(event.request.url, response.clone());
//                         return response;
//                     })
//         })
//         .catch(function(err){
//             return caches.match(event.request);
//         })      
//     );
// });

// self.addEventListener('fetch', function(event){
//     console.log('動態快取網路資源',event);
//     event.respondWith(
//         caches.open(CACHE_DYNAMIC)
//             .then(function(cache){
//                 return fetch(event.request)
//                         .then(function(response){
//                             cache.put(event.request, response.clone());
//                             return response;
//                         });
//             })      
//     );
// });

self.addEventListener('fetch', function(event){
    console.log('url:',event.request.url);
    var url = 'https://httpbin.org/get';
    if(-1 <　event.request.url.indexOf(url)){
        event.respondWith(
            caches.open(CACHE_DYNAMIC)
                .then(function(cache){
                    return fetch(event.request)
                            .then(function(response){
                            cache.put(event.request, response.clone());
                            return response;
                            });
                })      
        );
    } else{
        event.respondWith(
             caches.match(event.request)
                .then(function(response){
                    if(response){
                        return response;
                    }else{
                        return fetch(event.request)
                            .then(function(res){
                                return caches.open(CACHE_DYNAMIC)
                                    .then(function(cache){
                                            cache.put(event.request.url, res.clone());
                                            return res;
                                    })
                                    .catch(function(err){
                                        return caches.open(CACHE_STATIC)
                                            .then(function(cahce){
                                                return caches.match('/ErrorPage.html');
                                            });
                                    });                                   
                            });
                    }
                })
                .catch(function(err){
                    return caches.open(CACHE_STATIC)
                            .then(function(cache){
                                return cache.match('/offlinePage.html');
                            });
                })
        );
    }
});
