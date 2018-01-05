var dbPromise = idb.open('articles', 1, function(db){
    if(!db.objectStoreNames.contains('article'))
        db.createObjectStore('article', {keyPath: 'id'});
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