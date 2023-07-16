document.addEventListener('DOMContentLoaded', function() {
    var wishlistForm = document.getElementById('wishlistForm');
    var viewWishlistBtn = document.getElementById('viewWishlistBtn');
    var wishlistItems = document.getElementById('wishlistItems');
    var wishlistContainer = document.getElementById('wishlistContainer');
    var itemInput = document.getElementById('item');
  
    wishlistForm.addEventListener('submit', function(event) {
      event.preventDefault();
  
      var item = itemInput.value;
      var details = document.getElementById('details').value;
      var url = '';
  
      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        var activeTab = tabs[0];
        url = activeTab.url;
  
        // Save the item, details, and URL to storage
        saveToWishlist(item, details, url);
  
        // Reset the form fields
        itemInput.value = '';
        details.value = '';
  
        // Optional: Show a success message to the user
        alert('Item added to wishlist!');
      });
    });
  
    viewWishlistBtn.addEventListener('click', function() {
      // Retrieve the wishlist items from storage
      getWishlistItems(function(items) {
        // Clear the existing wishlist items
        wishlistItems.innerHTML = '';
  
        // Render the wishlist items
        items.forEach(function(item, index) {
          var listItem = document.createElement('li');
          listItem.setAttribute('data-index', index);
  
          var itemLink = document.createElement('a');
          itemLink.textContent = item.item;
          itemLink.href = item.url;
          itemLink.target = '_blank';
  
          var detailsText = document.createTextNode(' - ' + item.details);
  
          var deleteBtn = document.createElement('button');
          deleteBtn.textContent = 'Delete';
          deleteBtn.addEventListener('click', function() {
            var index = this.parentElement.getAttribute('data-index');
            deleteFromWishlist(index);
          });
  
          listItem.appendChild(itemLink);
          listItem.appendChild(detailsText);
          listItem.appendChild(deleteBtn);
  
          wishlistItems.appendChild(listItem);
        });
  
        // Optional: Show a message if the wishlist is empty
        if (items.length === 0) {
          var emptyMessage = document.createElement('li');
          emptyMessage.textContent = 'Your wishlist is empty';
          wishlistItems.appendChild(emptyMessage);
        }
  
        // Show the wishlist container and hide the form
        wishlistContainer.style.display = 'block';
        wishlistForm.style.display = 'none';
      });
    });
  
    var backBtn = document.getElementById('backBtn');
    backBtn.addEventListener('click', function() {
      // Hide the wishlist container and show the form
      wishlistContainer.style.display = 'none';
      wishlistForm.style.display = 'block';
    });
  
    // Automatically extract the product name from the active tab
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      var activeTab = tabs[0];
      chrome.tabs.executeScript(activeTab.id, { code: 'document.title' }, function(result) {
        var pageTitle = result[0];
        itemInput.value = pageTitle; // Set the value of the item input field to the extracted product name
      });
    });
  });
  
  function saveToWishlist(item, details, url) {
    chrome.storage.sync.get({ wishlist: [] }, function(result) {
      var wishlist = result.wishlist;
      wishlist.push({ item: item, details: details, url: url });
  
      chrome.storage.sync.set({ wishlist: wishlist });
    });
  }
  
  function getWishlistItems(callback) {
    chrome.storage.sync.get({ wishlist: [] }, function(result) {
      var wishlist = result.wishlist;
      callback(wishlist);
    });
  }
  
  function deleteFromWishlist(index) {
    chrome.storage.sync.get({ wishlist: [] }, function(result) {
      var wishlist = result.wishlist;
  
      if (index >= 0 && index < wishlist.length) {
        wishlist.splice(index, 1);
        chrome.storage.sync.set({ wishlist: wishlist }, function() {
          // Optional: Show a success message to the user
          alert('Item deleted from wishlist!');
          // Refresh the view
          viewWishlistBtn.click();
        });
      }
    });
  }
  