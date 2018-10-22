// standard Meteorjs MongoDB store collection client side (no server side)
let NoteData = new Mongo.Collection('NoteData', {connection: null});


// local persist used to store the data to the browser store
let NoteDataObserver = new LocalPersist(NoteData, 'NoteDataObserver',
    {                                     // options are optional!
        maxDocuments: 500,                  // max number of docs to store
        storageFull: function (col, doc) {  // function to handle maximum being exceeded
            col.remove({_id: doc._id});
            alert('Restricted to storing 500 notes.');
        }
    });

export { NoteData };