var addPostButton = document.querySelector('#add-post-btn');
var createPostArea = document.querySelector('#create-post-form');
var closeModalButton = document.querySelector('#close-modal-btn');
var articleForm = document.querySelector('form#form__article');
var inputTitle = document.querySelector('#title');
var inputContent = document.querySelector('#content');
var inputLocation = document.querySelector('#location');

addPostButton.addEventListener('click', openCreatePostModal);

closeModalButton.addEventListener('click', closeCreatePostModal);

function openCreatePostModal() {
  // createPostArea.style.display = 'block';
  createPostArea.style.transform = 'translateY(0)';
  if(deferredPrompt){
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(function(choiceResult){
        console.log(choiceResult.outcome);
        if(choiceResult.outcome == 'dismissed')
            console.log('使用者取消安裝');
        else
            console.log('使用者安裝');
      });
      deferredPrompt = null;
  }
}

function closeCreatePostModal() {
  // createPostArea.style.display = 'none';
  createPostArea.style.transform = 'translateY(100vh)';
}
var articleUrl = 'https://days-pwas-practice.firebaseio.com/article.json';
function sendForm(){
  fetch(articleUrl,{
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      id: new Date().toISOString(),
      title: inputTitle.value,
      location: inputLocation.value,
      content: inputContent.value,
      image: '"https://firebasestorage.googleapis.com/v0/b/days-pwas-practice.appspot.com/o/taipei_street.PNG?alt=media&token=8736b68e-216c-4c63-a7d4-a129875ba71e"'
    })
  })
  .then(function (res) {
    console.log('送出表單',res);
    getArticleFromDB();
  });
}

articleForm.addEventListener('submit',function(){
  event.preventDefault();

  if(inputTitle.value.trim() === '' || inputContent.value.trim() === ''){
    alert('資料請填寫完整!');
    return;    
  }
  
  closeCreatePostModal();

  if('serviceWorker' in navigator && 'SyncManager' in window){
    navigator.serviceWorker.ready
      .then(function(sw){
        var form = {
          id: new Date().toISOString(),
          title: inputTitle.value,
          content: inputContent.value,
          location: inputLocation.value,
          image: '"https://firebasestorage.googleapis.com/v0/b/days-pwas-practice.appspot.com/o/taipei_street.PNG?alt=media&token=8736b68e-216c-4c63-a7d4-a129875ba71e"'
        };
        writeData('sync-posts', form)
          .then(function(){
            sw.sync.register('sync-new-post');
          })
          .then(function(){
            var snackbarContainer = document.querySelector('#confirmation-toast');
            var data = {message: '文章以使用Background Sync方式儲存'};
            console.log('文章以使用Background Sync方式儲存');
            //snackbarContainer.MaterialSnackbar.showSnackbar(data);
          })
          .catch(function(err){
            console.log('Error',err);
          });
      });
  } else{
    sendForm();
  }
})