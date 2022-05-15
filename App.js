// STORAGE CONTROLLER --- STORAGE MODULE
const StorageControl = (function () {
  return {
    storeItem: (item) => {
      let items;

      if (localStorage.getItem('items') === null) {
        items = [];
        items.push(item);
        localStorage.setItem('items', JSON.stringify(items));
      } else {
        items = JSON.parse(localStorage.getItem('items'));
        items.push(item);
        localStorage.setItem('items', JSON.stringify(items));
      }
    },
    getItemsFromLS: () => {
      let items;
      if (localStorage.getItem(`items`) === null) {
        items = [];
      } else {
        items = JSON.parse(localStorage.getItem(`items`));
      }
      return items;
    },
    updateItemInLS: (updatedItem) => {
      let items = JSON.parse(localStorage.getItem('items'));

      items.forEach((item, index) => {
        if (updatedItem.ID === item.ID) {
          items.splice(index, 1, updatedItem);
        }
      });
      localStorage.setItem(`items`, JSON.stringify(items));
    },
    deleteItemFromLS: (ID) => {
      let items = JSON.parse(localStorage.getItem('items'));
  
      items.forEach((item, index) => {
        if (ID === item.ID) {
          items.splice(index, 1);
        }
      });
      localStorage.setItem(`items`, JSON.stringify(items));
    },
    clearAllItemsFromLS: () => {
      localStorage.removeItem(`items`);
    }
  }
})();


// ITEM CONTROLLER --- ITEM MODULE
const ItemControl = (function () {
  const Item = function (ID, name, price) {
    this.ID = ID;
    this.name = name;
    this.price = price;
  }

  const data = {
    items: StorageControl.getItemsFromLS(),
    currentItem: null,
    totalPrice: 0
  }

  return {
    getItems: () => {
      return data.items;
    },

    addItem: (name, price) => {
      // GENERATE IDS DYNAMICALLY
      let ID;
      if (data.items.length > 0) {
        ID = data.items[data.items.length - 1].ID + 1;
      } else {
        ID = 0;
      }
      price = parseInt(price);    // CONVERT PRICE TO INTEGER
      newItem = new Item(ID, name, price);
      data.items.push(newItem);   // ADD NEW ITEM TO ITEMS ARRAY
      
      return newItem;
    },

    getItemByID: (ID) => {
      let found = null;

      // LOOP THROUGH THE ITEMS
      data.items.forEach(item => {
        if (item.ID === ID) {
          found = item;
        }
      });
      return found;
    },

    updateItem: (name, price) => {
      price = parseInt(price);
      let found = null;

      data.items.forEach(item => {
        if (item.ID === data.currentItem.ID) {
          item.name = name;
          item.price = price;
          found = item;
        }
      });

      return found;
    },

    deleteItem: (ID) => {
      // GET THE IDS
      let ids = data.items.map(item => {
        return item.ID;
      });
      const index = ids.indexOf(ID);
      data.items.splice(index, 1);
    },
    
    clearAllItems: () => {
      data.items = [];
    },

    setCurrentItem: (item) => {
      data.currentItem = item;
    },

    getCurrentItem: () => {
      return data.currentItem;
    },

    getTotalPrice: () => {
      let total = 0;

      data.items.forEach(function(item){
        total += item.price;
      });

      data.totalPrice = total;
      return data.totalPrice;
    },

    logData: () => {
      return data;
    },
  }
})();


// UI CONTROLLER --- UI MODULE
const UIControl = (function () {
  //? DOM SELECTORS
  const DOMSelectors = {
    itemNameInput: '#item-name',
    itemPriceInput: '#item-price',
    addButton: '.add-btn',
    updateButton: '.update-btn',
    deleteButton: '.delete-btn',
    backButton: '.back-btn',
    clearButton: '.clear-btn',
    itemList: '#item-list',
    inputForm: '.input-form',
    totalAmount: '.total-amount',
    itemListContainer: '.items-list-container',
    listItems: '#item-list li'
  }
  
  return {
    populateItemList: (items) => {
      let HTML = ``;
      items.forEach(item => {
        HTML += `
          <li id="item-${item.ID}" class="collection-item">
            <strong>${item.name}: </strong> <em>N${item.price}</em>
            <a href="#" class="secondary-content"><i class="fa fa-pencil-square-o edit-item"></i></a>
        </li>
        `;
      });

      document.querySelector(DOMSelectors.itemList).innerHTML = HTML;
    },
    
    getFormInput: () => {
      return {
        name: document.querySelector(DOMSelectors.itemNameInput).value,
        price: document.querySelector(DOMSelectors.itemPriceInput).value
      }
    },

    addListItem: (item) => {
      document.querySelector(DOMSelectors.itemListContainer).style.display = 'block';
      document.querySelector(DOMSelectors.itemListContainer).style.width = '100%';

      const itemList = document.querySelector(DOMSelectors.itemList);
      const li = document.createElement('li'); 
      li.className = `collection-item`;
      li.id = `item-${item.ID}`;
      li.innerHTML = `
        <strong>${item.name}: </strong> <em>N${item.price}</em>
        <a href="#" class="secondary-content">
        <i class="fa fa-pencil-square-o edit-item"></i>
        </a> `;
    
        itemList.insertAdjacentElement('beforeend', li);
      },
      
      updateListItem: (item) => {
        let listItems = document.querySelectorAll(DOMSelectors.listItems);
        
        listItems = Array.from(listItems);
        listItems.forEach(listItem => {
          const itemID = listItem.getAttribute('id');

        if (itemID === `item-${item.ID}`) {
          document.querySelector(`#${itemID}`).innerHTML = `
           <strong>${item.name}: </strong> <em>N${item.price}</em>
            <a href="#" class="secondary-content">
            <i class="fa fa-pencil-square-o edit-item"></i>
            </a>
            `
          }
      });
    },
      
    deleteListItem: (ID) => {
      const itemID = `#item-${ID}`;
      const item = document.querySelector(itemID);
      item.remove();
      
      const totalPrice = ItemControl.getTotalPrice();
      document.querySelector(DOMSelectors.totalAmount).innerHTML = totalPrice;
      UIControl.clearEditState();
    },
    
    clearInputs: () => {
      document.querySelector(DOMSelectors.itemNameInput).value = '';
      document.querySelector(DOMSelectors.itemPriceInput).value = '';
    },
    
    // FUNCTION TO UPDATE FORM INPUT FIELD TO THE VALUES OF THE CURRENT ITEM
    addCurrentItemToForm: () => {
      document.querySelector(DOMSelectors.itemNameInput).value = ItemControl.getCurrentItem().name;
      document.querySelector(DOMSelectors.itemPriceInput).value = ItemControl.getCurrentItem().price
      
      UIControl.showEditState();
    },
    
    removeItems: () => {
      let listItems = document.querySelectorAll(DOMSelectors.listItems);
      listItems.forEach(listItem => {
        listItem.remove();
      });
    },

    hideListContainer: () => {
      document.querySelector(DOMSelectors.itemListContainer).style.display = 'none';
    },
    
    updatePrice: (totalPrice) => {
      document.querySelector(DOMSelectors.totalAmount).innerHTML = totalPrice;
    },

    // DISPLAY EDIT & DELETE BUTTONS TO NONE ON PAGE LOAD
    clearEditState: () => {
      UIControl.clearInputs();
      document.querySelector(DOMSelectors.addButton).style.display = 'inline';
      document.querySelector(DOMSelectors.updateButton).style.display = 'none';
      document.querySelector(DOMSelectors.deleteButton).style.display = 'none';
      document.querySelector(DOMSelectors.backButton).style.display = 'none';
    },
    // DISPLAY EDIT & DELETE BUTTONS -- ACTIVATE EDIT STATE
    showEditState: () => {
      document.querySelector(DOMSelectors.addButton).style.display = 'none';
      document.querySelector(DOMSelectors.updateButton).style.display = 'inline';
      document.querySelector(DOMSelectors.deleteButton).style.display = 'inline';
      document.querySelector(DOMSelectors.backButton).style.display = 'inline';
    },
    discardEditState: () => {
      UIControl.clearInputs();
      document.querySelector(DOMSelectors.updateButton).style.display = 'none';
      document.querySelector(DOMSelectors.deleteButton).style.display = 'none';
      document.querySelector(DOMSelectors.backButton).style.display = 'none';
    },

    getSelectors: () => {
      return DOMSelectors;
    }
  }
})();


// APP CONTROLLER --- APP INIT MODULE
const App = (function (ItemControl, StorageControl, UIControl) {
  
  const loadEventListeners = () => {
    const DOMSelectors = UIControl.getSelectors();
    document.querySelector(DOMSelectors.addButton).addEventListener('click', addFormData);
    document.addEventListener('keypress', (e) => {
      if (e.keycode === 13 || e.which === 13) {
        e.preventDefault();
        return false;
      }
    });
    window.addEventListener('click', updateItem);
    document.querySelector(DOMSelectors.clearButton).addEventListener('click', deleteAllItems);
    document.querySelector(DOMSelectors.updateButton).addEventListener('click', updateItemInDOM);
    document.querySelector(DOMSelectors.deleteButton).addEventListener('click', deleteItemSubmit);
    document.querySelector(DOMSelectors.backButton).addEventListener('click', UIControl.clearEditState);
    
  }

  // ADD ITEM TO LIST --- WHEN FORM IS FILLED AND SUBMITTED
  const addFormData = (e) => {
    const input = UIControl.getFormInput();

    if (input.name !== '' && input.price !== '') {
      const newItem = ItemControl.addItem(input.name, input.price);
      UIControl.addListItem(newItem);

      const totalPrice = ItemControl.getTotalPrice();
      UIControl.updatePrice(totalPrice)
      UIControl.clearInputs();
      
      StorageControl.storeItem(newItem)
    }
    e.preventDefault();
  }

  // Activate EDIT-STATE for item when a pencil icon is clicked
  const updateItem = (e) => {
    if (e.target.classList.contains('edit-item')) {
      const listID = e.target.parentNode.parentNode.id;
      
      //Break ID into an array - split accross dash '-' && get the actual ID then set the current item on the EDIT-STATE
      const listIDArray = listID.split('-');
      const ID = parseInt(listIDArray[1])
      const itemToEdit = ItemControl.getItemByID(ID);
      
      ItemControl.setCurrentItem(itemToEdit);
      UIControl.addCurrentItemToForm();
    }
    e.preventDefault()
  }
  
  // UPDATE ITEM IN DOM --- WHEN FORM IS UPDATED & 'SAVE CHANGES' BUTTON CLICKED
  const updateItemInDOM = (e) => {
    const input = UIControl.getFormInput();
    const updatedItem = ItemControl.updateItem(input.name, input.price);
    UIControl.updateListItem(updatedItem);

    const totalPrice = ItemControl.getTotalPrice();
    UIControl.updatePrice(totalPrice);
    
    StorageControl.updateItemInLS(updatedItem);

    UIControl.clearEditState();
    e.preventDefault();
  }

  const deleteItemSubmit = (e) => {
    // GET CURRENT ITEM & DELETE CURRENT ITEM FROM DATA STRUCTURE
    const currentItem = ItemControl.getCurrentItem();
    ItemControl.deleteItem(currentItem.ID);
    UIControl.deleteListItem(currentItem.ID);
    UIControl.clearEditState();

    StorageControl.deleteItemFromLS(currentItem.ID);

    e.preventDefault();
  }

  const deleteAllItems = () => {
    ItemControl.clearAllItems();
    UIControl.removeItems();
    StorageControl.clearAllItemsFromLS();
    
    const totalPrice = ItemControl.getTotalPrice();
    UIControl.updatePrice(totalPrice);
    UIControl.hideListContainer();
  }

  return {
    init: () => {
      //CLEAR EDIT STATE INITIALLY
      UIControl.clearEditState();
      const items = ItemControl.getItems();

      if (items.length === 0) {
        UIControl.hideListContainer();
      } else {
        UIControl.populateItemList(items);
      }

      const totalPrice = ItemControl.getTotalPrice();
      UIControl.updatePrice(totalPrice);
      loadEventListeners();
    }
  }
})(ItemControl, StorageControl, UIControl);

App.init();