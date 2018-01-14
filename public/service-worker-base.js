importScripts('workbox-sw.prod.v2.1.2.js');
importScripts('/src/js/idb.js');
importScripts('/src/js/indexedDB.js');

const workboxSW = new self.WorkboxSW();

//https://firebasestorage.googleapis.com/v0/b/days-pwas-practice.appspot.co
//https://fonts.gstatic.com/s/materialicons/v34/2fcrYFNaTjcS6g4U3t-Y5ZjZjT5FdEJ140U2DJYC3mY.woff2
workboxSW.router.registerRoute(/.*(?:googleapis|gstatic)\.com.*$/, workboxSW.strategies.staleWhileRevalidate({
    cacheName: 'fonts-and-firebase-images',
    cacheExpiration: {
        maxAgeSeconds: 60 * 60 * 24 * 30
    }
}));

workboxSW.router.registerRoute('https://days-pwas-practice.firebaseio.com/article.json', function(args){
    return fetch(args.event.request)
            .then(function(response){
                var copyRes = response.clone();
                clearAllData('article')
                    .then(function(){
                        return copyRes.json();
                    })
                    .then(function(data){
                        console.log('copyRes.json()',data);
                        for(var key in data){
                            console.log('key',key);
                            writeData('article',data[key]);
                        }
                    });
                return response;
            })
    }
);

workboxSW.router.registerRoute(function (routeData){
    return (routeData.event.request.headers.get('accept').includes('text/html'));
}, function(args){
    return  caches.match(args.event.request)
        .then(function(response){
            if(response){
                return response;
            }else{
                return fetch(args.event.request)
                    .then(function(res){
                        return caches.open('dynamic')
                            .then(function(cache){
                                    cache.put(event.request.url, res.clone());
                                    return res;
                            })
                            .catch(function(err){
                                return caches.match('/offlinePage.html')
                                    .then(function(res){
                                        return res;
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
    }
);

workboxSW.precache([]);