document.addEventListener('DOMContentLoaded', function() {
    var wishlistItems = document.getElementById('wishlistItems');
    var backBtn = document.getElementById('backBtn');
  
    // Retrieve the wishlist items from storage
    getWishlistItems(function(items) {
      // Render the wishlist items
      items.forEach(function(item) {
        var listItem = document.createElement('li');
  
        var itemLink = document.createElement('a');
        itemLink.textContent = item.item;
        itemLink.href = item.url;
        itemLink.target = '_blank';
  
        var detailsText = document.createTextNode(' - ' + item.details);
  
        listItem.appendChild(itemLink);
        listItem.appendChild(detailsText);
  
        wishlistItems.appendChild(listItem);
      });
  
      // Optional: Show a message if the wishlist is empty
      if (items.length === 0) {
        var emptyMessage = document.createElement('li');
        emptyMessage.textContent = 'Your wishlist is empty';
        wishlistItems.appendChild(emptyMessage);
      }
    });
  
    backBtn.addEventListener('click', function() {
      // Close the current window (wishlist.html) and focus the popup window (popup.html)
      window.close();
      chrome.windows.getLastFocused({ populate: true }, function(window) {
        var popupTab = window.tabs.find(function(tab) {
          return tab.url === chrome.runtime.getURL('popup.html');
        });
        if (popupTab) {
          chrome.windows.update(window.id, { focused: true });
          chrome.tabs.update(popupTab.id, { active: true });
        } else {
          chrome.windows.create({ url: 'popup.html', type: 'popup', focused: true });
        }
      });
    });
  });