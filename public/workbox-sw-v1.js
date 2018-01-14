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

workboxSW.precache([
  {
    "url": "404.html",
    "revision": "a4e2271d19eb1f6f93a15e1b7a4e74dd"
  },
  {
    "url": "favicon.ico",
    "revision": "2492a2100948e283b0a649316f4855ec"
  },
  {
    "url": "index.html",
    "revision": "52a949775b07f237810c02c9a9048a90"
  },
  {
    "url": "manifest.json",
    "revision": "bfad5d891467053a32096572804568a4"
  },
  {
    "url": "offlinePage.html",
    "revision": "4b3993fad1e541464db1f4f455f4ebec"
  },
  {
    "url": "service-worker-base.js",
    "revision": "deca2d16ebbebf400821d3d104548b52"
  },
  {
    "url": "service-worker.js",
    "revision": "233ea44a3c8d0cc242ec2f02743ea3ed"
  },
  {
    "url": "src/css/app.css",
    "revision": "7620583a4c8fa6966e104e34ea6fb12c"
  },
  {
    "url": "src/css/material.blue-red.min.css",
    "revision": "94d102abda0d2af727a4c547d7b6580c"
  },
  {
    "url": "src/js/app.js",
    "revision": "c3a60cee1d4f328641d37a78f9f1883f"
  },
  {
    "url": "src/js/idb.js",
    "revision": "edfbee0bb03a5947b5a680c980ecdc9f"
  },
  {
    "url": "src/js/indexedDB.js",
    "revision": "520b110fd18719506e237d6ae611e8cd"
  },
  {
    "url": "src/js/material.min.js",
    "revision": "e68511951f1285c5cbf4aa510e8a2faf"
  },
  {
    "url": "src/js/post.js",
    "revision": "1b355d09bf7011a03ad8602e5e7e655c"
  },
  {
    "url": "workbox-sw-v1.js",
    "revision": "6d7b919afe6820d8ae12bf072f3549cf"
  },
  {
    "url": "workbox-sw.prod.v2.1.2.js",
    "revision": "685d1ceb6b9a9f94aacf71d6aeef8b51"
  },
  {
    "url": "src/images/demo.JPG",
    "revision": "e4304b8082f3ba0f0eb4c43d365fb1fc"
  },
  {
    "url": "src/images/Fukuoka.PNG",
    "revision": "68a730dab62daa6662fdb50a5828f628"
  },
  {
    "url": "src/images/taipei_street.PNG",
    "revision": "d1cd1d1cf63103479cd7ae1b01eed4d5"
  }
]);