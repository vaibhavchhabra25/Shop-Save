document.addEventListener('DOMContentLoaded', function() {
    var wishlistForm = document.getElementById('wishlistForm');
    var viewWishlistBtn = document.getElementById('viewWishlistBtn');
    var wishlistItems = document.getElementById('wishlistItems');
    
    wishlistForm.addEventListener('submit', function(event) {
      event.preventDefault();
      
      var itemInput = document.getElementById('item');
      var detailsInput = document.getElementById('details');
      
      var item = itemInput.value;
      var details = detailsInput.value;
      var url = '';
      
      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        var activeTab = tabs[0];
        url = activeTab.url;
        
        // Save the item, details, and URL to storage
        saveToWishlist(item, details, url);
        
        // Reset the form fields
        itemInput.value = '';
        detailsInput.value = '';
        
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
        items.forEach(function(item) {
          var listItem = document.createElement('li');
          listItem.textContent = item.item + ' - ' + item.details;
          wishlistItems.appendChild(listItem);
        });
        
        // Optional: Show a message if the wishlist is empty
        if (items.length === 0) {
          var emptyMessage = document.createElement('li');
          emptyMessage.textContent = 'Your wishlist is empty';
          wishlistItems.appendChild(emptyMessage);
        }
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
  