var dbPromise = idb.open('articles', 1, function(db){
    if(!db.objectStoreNames.contains('article'))
        db.createObjectStore('article', {keyPath: 'id'});
    if(!db.objectStoreNames.contains('sync-posts'))
        db.createObjectStore('sync-posts', {keyPath: 'id'});
});

function writeData(table,data){
    return dbPromise
            .then(function(db){
                var transaction = db.transaction(table, 'readwrite');
                var article = transaction.objectStore(table);
                article.put(data);
                return transaction.complete;
            });
}

function readAllData(table){
    return dbPromise
            .then(function(db){
                var transaction = db.transaction(table, 'readonly');
                var store = transaction.objectStore(table);
                return store.getAll();
            });
}

function clearAllData(table){
    return dbPromise
            .then(function(db){
                var transaction = db.transaction(table, 'readwrite');
                var store = transaction.objectStore(table);
                store.clear();
                return transaction.complete;
            });
}

function deleteArticleData(table, id){
     return dbPromise
            .then(function(db){
                var transaction = db.transaction(table, 'readwrite');
                var store = transaction.objectStore(table);
                store.delete(id);
                return transaction.complete;
            });
}

function getArticleData(table, id){
    return dbPromise
            .then(function(){
                var transaction = db.transaction(table, 'readonly');
                var store = transaction.objectStore(table);
                return store.get(id);
            })
            .then(function(data){
                console.log('article:',data);
            });
}