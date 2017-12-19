var addPostButton = document.querySelector('#add-post-btn');
var createPostArea = document.querySelector('#create-post-form');
var closeModalButton = document.querySelector('#close-modal-btn');


addPostButton.addEventListener('click', openCreatePostModal);

closeModalButton.addEventListener('click', closeCreatePostModal);

function openCreatePostModal() {
  createPostArea.style.display = 'block';
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
  createPostArea.style.display = 'none';
}