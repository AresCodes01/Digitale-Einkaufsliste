var url = "http://127.0.0.1:8000/";

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
const csrftoken = getCookie('csrftoken');

// Function to set up everything
function start() {

    fetch(url + "checkLoginStatus")
    .then(response => response.json())
    .then(data => {
        if (data.loggedIn) {
            //Debug
            //console.log('User is logged in');
            getList();
            getTheme();
        } else {
            //Debug
            //console.log('User is not logged in');
            modalLoad();
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

// General function for POST requests
function post(subUrl, data) {

    return fetch(url + subUrl, {
        method: 'POST',
        body: data,
        headers: {
            "X-CSRFToken": csrftoken
        }
    }).then(response => response.json());

}

// Adding some EventListeners to elements that are loaded from the beginning
document.addEventListener("DOMContentLoaded", function() {
    var addListModal = document.getElementById("addList");
    var firstInputField = document.getElementById("itemInput1").children[1];
    var timer;
    var darkmodeSwitch = document.getElementById("darkmodeSwitch");
  
    addListModal.addEventListener("hidden.bs.modal", function() {
      removeInputs();
    });

    firstInputField.addEventListener("input", function() {
        clearTimeout(timer)
        timer = setTimeout(function() {
            brocadeSearch(firstInputField.value);
        }, 1000);
    });

    darkmodeSwitch.addEventListener("change", function() {
        var themeJson = {
            theme: ""
        }
        if (darkmodeSwitch.checked) {
            themeJson.theme = "dark";
            document.body.setAttribute("data-bs-theme", "dark");
        } else {
            themeJson.theme = "light"
            document.body.setAttribute("data-bs-theme", "light");
        }
        //Debug
        console.log(JSON.stringify(themeJson));
        post("themeSet", JSON.stringify(themeJson));
    });
});

var newInputFields = 2;

// Creates new item input fields inside the "Add List" modal
function itemToListInput() {

    // Adding new Item Input Field
    var addListBody = document.getElementById("addListBody");

    var inputGroup = document.createElement("div");
    inputGroup.className = "input-group input-group-sm mb-3";
    inputGroup.id = "itemInput" + newInputFields.toString();

    var text = document.createElement("span");
    text.className = "input-group-text";
    text.innerHTML = "Item"

    var field = document.createElement("input");
    field.type = "text";
    field.className = "form-control";
    field.setAttribute("list", "itemSearchList");
    field.ariaRoleDescription = "button-addon" + newInputFields.toString();
    field.setAttribute("placeholder", "Name/EAN")
    var timer;
    field.addEventListener("input", function() {
        clearTimeout(timer)
        timer = setTimeout(function() {
            brocadeSearch(field.value);
        }, 1000);
    });

    var amount = document.createElement("input");
    amount.type = "number";
    amount.value = 1;
    amount.className = "amount";

    var unit = document.createElement("select");
    unit.className = "unit";
    var pc = document.createElement("option");
    pc.value = "x";
    pc.innerHTML = "pc.";
    pc.selected = true;
    var l = document.createElement("option");
    l.value = "litres";
    l.innerHTML = "l";
    var kg = document.createElement("option");
    kg.value = "kilograms";
    kg.innerHTML = "kg";
    unit.appendChild(pc);
    unit.appendChild(l);
    unit.appendChild(kg);

    var fieldButton = document.createElement("button");
    fieldButton.className = "btn btn-primary";
    fieldButton.id = "button-addon" + newInputFields.toString();
    fieldButton.innerHTML = "Add";
    var oldButton = document.getElementById("button-addon" + (newInputFields-1).toString());
    fieldButton.onclick = oldButton.onclick;
    oldButton.remove();

    addListBody.appendChild(inputGroup);
    inputGroup.appendChild(text);
    inputGroup.appendChild(field);
    inputGroup.appendChild(amount);
    inputGroup.appendChild(unit);
    inputGroup.appendChild(fieldButton);

    newInputFields += 1;

}

// Removing other inputs when modal is closed
function removeInputs() {
    document.getElementById("listName").children[0].value = "";
    document.getElementById("itemInput1").children[1].value = "";
    document.getElementById("itemInput1").children[2].value = "1";
    document.getElementById("itemInput1").children[3].value = "x";
    if (document.getElementById("button-addon1") === null) {
        for (let i = 2; i < newInputFields; i++) {
            var inputField = document.getElementById("itemInput" + i.toString());
            inputField.remove();
        }

        // Adding back the button
        var fieldButton = document.createElement("button");
        fieldButton.className = "btn btn-primary";
        fieldButton.id = "button-addon1";
        fieldButton.innerHTML = "Add";
        fieldButton.onclick = function() {itemToListInput()};

        document.getElementById("itemInput1").appendChild(fieldButton);

        newInputFields = 2;
    }
}

// Counts item input fields inside list modal to iterate through them later
function countItemFields() {
    fields = 1;
    while(document.getElementById("itemInput" + fields.toString()) != undefined) {
        fields++;
    }
    return fields-1;
}

// Submitting a list to the backend/database
function submitList() {
    var List = {
        name: "",
        items: []
    };

    //console.log("Add List")
    var listName = document.getElementById("listName").children[0].value;
    List.name = listName;

    for (i = 1; i <= countItemFields(); i++) {
        itemName = document.getElementById("itemInput" + i.toString()).children[1].value;
        itemAmount = document.getElementById("itemInput" + i.toString()).children[2].value;
        itemUnit = document.getElementById("itemInput" + i.toString()).children[3].value;

        if (itemName == "") {
            continue;
        };

        // Temporary Fix
        if (itemAmount == "") {
            itemAmount = 0;
        }
        
        List.items.push({
            name: itemName,
            amount: itemAmount,
            unit: itemUnit
        });
    };


    jsonList = JSON.stringify(List)

    //Debug
    console.log(jsonList);

    removeInputs();

    post("List", jsonList);
    window.location.reload();
} 

// Send new item to backend/database
function submitItem(id){
    var List = {
        listid: "",
        items: []
    };

    List.listid = id; 
    
    var i = 1;
    while (document.getElementById("newItemInput" + i)) {
        var itemName = document.getElementById("newItemInput" + i).children[0].value;
        itemAmount = document.getElementById("newItemInput" + i).children[1].value;
        itemUnit = document.getElementById("newItemInput" + i).children[2].value;

        if (itemName == "") {
            i++;
            continue;
        };

        // Temporary Fix
        if (itemAmount == "") {
            itemAmount = 0;
        }

        List.items.push({
            name: itemName,
            amount: itemAmount,
            unit: itemUnit
        });
        i++;
    }

    //Debug
    //console.log(List);

    jsonList = JSON.stringify(List)

    removeInputs();

    post("addItem", jsonList);
    window.location.reload();
}


// Creating visible list cards on page
var listCounter = 1;
function createCard(id, listName, items) {
    var card = document.createElement("div");
    card.className = "card " + "card" + listCounter%2;
    card.setAttribute("data-bs-toggle", "modal");
    card.setAttribute("data-bs-target", "#listModal" + id.toString());
    card.id = "listCard" + id;

    var header = document.createElement("div");
    header.className = "card-header";
    header.innerHTML = "<b>"+ listName + "</b>";

    var body = document.createElement("div");
    body.className = "card-body";

    // Display only first three items on card
    var i = 0;
    for (var item of items) {
        var text = document.createElement("p");
        text.className = "card-text";
        if (i <= 2) {

            text.id = "cardItem" + item.itemid;
            if (item.done == "false") {
                text.innerHTML = "• " + item.amount + item.unit + " " + item.itemname;
                body.appendChild(text);
            } else {
                var streak = document.createElement("s");
                text.innerHTML = "• ";
                streak.innerHTML = item.amount + item.unit + " " + item.itemname;
                text.appendChild(streak);
                body.appendChild(text);
            };
        } else {
            text.innerHTML = "...";
            body.appendChild(text);
            break;
        }
        i++;
    }

    card.appendChild(header);
    card.appendChild(body);
    document.getElementById("listContainer").appendChild(card);

    // First List in a row will create a new row element, second element will be added to that row
    /* if (listCounter%2 == 1) {
        var row = document.createElement("div");
        row.className = "listRow";
        row.id = "row" + Math.ceil(listCounter/2);
        document.getElementById("listContainer").appendChild(row);
        row.appendChild(card);
    } else {
        document.getElementById("row" + listCounter/2).appendChild(card);
    } */

    listCounter++;
}

// Creating Modals that open up when clicking on cards
function createListModal(id, listName, items) {
    var modal = document.createElement("div");
    modal.className = "modal fade listModal";
    modal.id = "listModal" + id;
    modal.setAttribute("tabindex", "-1");
    modal.setAttribute("aria-labelledby", "listModal" + id + "Label");
    modal.setAttribute("aria-hidden", "true");

    var dialog = document.createElement("div");
    dialog.className = "modal-dialog listDialog";

    var content = document.createElement("div");
    content.className = "modal-content";

    var header = document.createElement("div");
    header.className = "modal-header";

    var title = document.createElement("h1");
    title.className = "modal-title fs-5";
    title.id = "ModalLabelList" + id;
    title.innerHTML = listName;

    var close = document.createElement("button");
    close.type = "button";
    close.className = "btn-close";
    close.setAttribute("data-bs-dismiss", "modal");
    close.setAttribute("aria-label", "Close");

    var body = document.createElement("div");
    body.className = "modal-body";

    // Creating checkboxes for each item
    items.forEach(function(item) {
        var input = document.createElement("input");
        input.className = "form-check-input itemCheckbox"
        input.type = "checkbox";
        input.id = "item" + item.itemid;
        input.value = item.itemid;

        var label = document.createElement("label");
        label.className = "form-check-label";
        label.setAttribute("for", "item" + item.itemid);

        // Cross out and check if item was already marked as done
        if (item.done == "true") {
            input.checked = "true";

            var strike = document.createElement("s");
            strike.innerHTML = item.amount + item.unit + " " + item.itemname;
            label.appendChild(strike);

        } else {
            label.innerHTML = item.amount + item.unit + " " + item.itemname;;

        }

        // Crossing out when checking box and vice versa
        input.addEventListener("change", function(event) {
            var cardText = document.getElementById("cardItem" + item.itemid);
            if (event.target.checked) {
                // Update Modal
                label.innerHTML = "";
                var strike = document.createElement("s");
                strike.innerHTML = item.amount + item.unit + " " + item.itemname;
                label.appendChild(strike);

                // Update Card
                if (cardText != null) {
                    var streak = document.createElement("s");
                    cardText.innerHTML = "• ";
                    streak.innerHTML = item.amount + item.unit + " " + item.itemname;
                    cardText.appendChild(streak);
                }

                checkedItems();
            } else {
                // Update Modal
                label.innerHTML = item.amount + item.unit + " " + item.itemname;

                // Update Card
                if (cardText != null) {
                    cardText.innerHTML = "• " + item.amount + item.unit + " " + item.itemname;
                }

                checkedItems();
            }
          });

        var itemOuterDiv = document.createElement("div");
        itemOuterDiv.className = "itemOuter";

        var itemInnerDiv = document.createElement("div");
        itemInnerDiv.className = "itemInner";

        var deleteItemButton = document.createElement("button");
        deleteItemButton.className = "btn btn-danger deleteItem";
        deleteItemButton.innerHTML = "<svg xmlns='http://www.w3.org/2000/svg' width='8' height='8' fill='currentColor' class='bi bi-trash-fill' viewBox='0 0 16 16'><path d='M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z'/></svg>"

        deleteItemButton.addEventListener('click', () => {
            //Debug
            //console.log("Delete Item " + item.itemid);
            deleteItems(item.itemid);
            // hier andere delete funktion
        });

        itemInnerDiv.appendChild(input);
        itemInnerDiv.appendChild(label);
        itemOuterDiv.appendChild(itemInnerDiv);
        itemOuterDiv.appendChild(deleteItemButton);
        body.appendChild(itemOuterDiv);
        // body.appendChild(document.createElement("br"));
    })
    var footer=document.createElement("div");
    footer.className="modal-footer";


    // Creating the footer for the list modal
    var buttons = document.createElement("div");
    buttons.className = "buttonsDiv";

    var submitItemButton=document.createElement("button");
    submitItemButton.className="btn btn-primary";
    submitItemButton.id="submitItem"+id;
    submitItemButton.innerHTML="Save";
    submitItemButton.setAttribute("data-bs-toggle", "modal");
    submitItemButton.setAttribute("data-bs-target", "#" + modal.id);
    submitItemButton.addEventListener('click', () => {
        submitItem(id);
    });
  
    var newItemButton = document.createElement("button");
    newItemButton.className="btn btn-primary add";
    newItemButton.id="newItemButton"+id;
    newItemButton.innerHTML="Add Item";
    newItemButton.addEventListener('click', () => {
        newItemInputs(id);
    });

    createDeleteListModal(id, listName);

    var deleteListButton = document.createElement("button");
    deleteListButton.className="btn btn-danger delete";
    deleteListButton.id="deleteListButton"+id;
    deleteListButton.innerHTML="Delete List";
    deleteListButton.setAttribute("data-bs-toggle", "modal");
    deleteListButton.setAttribute("data-bs-target", "#deleteListModal" + id);

    header.appendChild(title);
    header.appendChild(close);
    content.appendChild(header);
    content.appendChild(body);
    dialog.appendChild(content);
    modal.appendChild(dialog);
    document.getElementById("listContainer").appendChild(modal);
    content.appendChild(footer);
    footer.appendChild(deleteListButton);
    buttons.appendChild(newItemButton);
    buttons.appendChild(submitItemButton);
    footer.appendChild(buttons);

    modal.addEventListener("hidden.bs.modal", function() {
        var i = 1;
        while(document.getElementById("newItemInput"+i)) {
            document.getElementById("tempId" + i).remove();
            document.getElementById("newItemInput"+i).parentElement.remove();
            i++;
        }
        newItemInputsCount = 1;
    });

}

function createDeleteListModal(id, listName) {
    var modal = document.createElement("div");
    modal.className = "modal fade";
    modal.id = "deleteListModal" + id;

    var dialog = document.createElement("div");
    dialog.className = "modal-dialog modal-dialog-centered";

    var content = document.createElement("div");
    content.className = "modal-content";

    var header = document.createElement("div");
    header.className = "modal-header";

    var title = document.createElement("h1");
    title.innerHTML = "Delete List";
    title.className = "modal-title fs-5";

    var body = document.createElement("div");
    body.className = "modal-body";

    var alert = document.createElement("div");
    alert.className = "alert alert-warning";

    var text = document.createElement("div");
    text.className = "text-center";
    text.innerHTML = "Are you sure you want to delete '" + listName + "'?";

    var footer = document.createElement("div");
    footer.className = "modal-footer";

    var close = document.createElement("button");
    close.className = "btn btn-secondary";
    close.setAttribute("data-bs-dismiss", "modal");
    close.innerHTML = "Cancel";

    var deleteButton = document.createElement("button");
    deleteButton.className = "btn btn-danger";
    deleteButton.innerHTML = "Delete";
    deleteButton.addEventListener("click", function() {
        deleteLists(id);
    });

    document.body.appendChild(modal);
    modal.appendChild(dialog);
    dialog.appendChild(content);
    content.appendChild(header);
    header.appendChild(title);
    content.appendChild(body);
    body.appendChild(alert);
    alert.appendChild(text);
    body.appendChild(footer);
    footer.appendChild(close);
    footer.appendChild(deleteButton);
}

// Update the "done" value in the database to check off items
function checkedItems() {
    var checkboxes = document.getElementsByClassName("itemCheckbox");

    var checkedItems = [];

    Array.from(checkboxes).forEach(function (checkbox) {
        checkedItems.push({
            itemId: checkbox.value,
            checked: checkbox.checked
        })
    });

    var checkedItemsJson = JSON.stringify(checkedItems);
    //Debug
    //console.log(checkedItemsJson);
    post("checkedItems", checkedItemsJson);
}

function getList() {

    fetch(url + "getList")
    .then(response => response.json())
    .then(data => {
        //Debug
        //console.log(data);
        createList(data);
    })

}

function createList(userLists) {

    userLists.forEach(function(list) {
        var listId = list.listid;
        var listName = list.listname;
        var items = list.items;

        createCard(listId, listName, items);
        createListModal(listId, listName, items);
    })

}

// Creating Input Fields inside the list modal
var newItemInputsCount = 1;
function newItemInputs(id) {

    var modalBody = document.getElementById("listModal" + id).children[0].children[0].children[1];

    // Adding new Item Input Field
    var itemOuter = document.createElement("div");
    itemOuter.className = "itemOuter itemOuterTemp"

    var inputGroup = document.createElement("div");
    inputGroup.className = "input-group input-group-sm mb-3 newItemInputGroup";
    inputGroup.id = "newItemInput" + newItemInputsCount.toString();

    //var text = document.createElement("span");
    //text.className = "input-group-text";
    //text.innerHTML = "Item"

    var box = document.createElement("input");
    box.type = "checkbox";
    box.className = "form-check-input"
    box.id = "tempId" + newItemInputsCount;

    var label = document.createElement("label");
    label.className = "form-check-label";
    label.setAttribute("for", "tempId" + newItemInputsCount);

    var field = document.createElement("input");
    field.type = "text";
    field.className = "form-control newItemInputField";
    field.setAttribute("list", "itemSearchList");
    field.setAttribute("placeholder", "Name/EAN");
    field.ariaRoleDescription = "button-addon" + newItemInputsCount.toString();
    var timer;
    field.addEventListener("input", function() {
        clearTimeout(timer)
        timer = setTimeout(function() {
            brocadeSearch(field.value);
        }, 1000);
    });

    var amount = document.createElement("input");
    amount.type = "number";
    amount.value = 1;
    amount.className = "amount";

    var unit = document.createElement("select");
    unit.className = "unit";
    var pc = document.createElement("option");
    pc.value = "x";
    pc.innerHTML = "pc.";
    pc.selected = true;
    var l = document.createElement("option");
    l.value = "l";
    l.innerHTML = "l";
    var kg = document.createElement("option");
    kg.value = "kg";
    kg.innerHTML = "kg";
    unit.appendChild(pc);
    unit.appendChild(l);
    unit.appendChild(kg);

    var scannerButton = document.createElement("button");
    scannerButton.className = "btn btn-primary scannerButton";
    scannerButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-camera" viewBox="0 0 16 16"><path d="M15 12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h1.172a3 3 0 0 0 2.12-.879l.83-.828A1 1 0 0 1 6.827 3h2.344a1 1 0 0 1 .707.293l.828.828A3 3 0 0 0 12.828 5H14a1 1 0 0 1 1 1v6zM2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4H2z"/><path d="M8 11a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5zm0 1a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM3 6.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0z"/></svg>'
    // ID so that the Barcode content is written in the correct field
    scannerButton.id = "scannerFor" + newItemInputsCount;
    scannerButton.addEventListener("click", function() {
        openScannerModal(id, field);
    });
    // Disable the button if browser doesn't support
    if (!("BarcodeDetector" in window)) {
        scannerButton.disabled = true;
    }

    modalBody.appendChild(itemOuter);
    itemOuter.appendChild(box);
    itemOuter.appendChild(label)
    label.appendChild(inputGroup);
    inputGroup.appendChild(field);
    inputGroup.appendChild(amount);
    inputGroup.appendChild(unit);
    inputGroup.appendChild(scannerButton);


    newItemInputsCount++;
}

function deleteLists(id){
    post("deleteLists", id);
    window.location.reload();
}

function deleteItems(id){
    post("deleteItems", id);
    window.location.reload();
}

function brocadeSearch(inputContent) {

    //Debug
    //console.log(inputContent);
    post("searchBrocadeItem", inputContent).then(responseJson => {
        //Debug
        //console.log(responseJson);
        var list = document.getElementById("itemSearchList");
        list.innerHTML = null;

        for (var i = 0; i < 5; i++) {
            if (responseJson[i] != null) {
                var option = document.createElement("option");
                option.value = responseJson[i].name;
                option.innerHTML = responseJson[i].gtin14;
                list.appendChild(option);
            } else if (!isNaN(inputContent) && responseJson.status === undefined) {
                var option = document.createElement("option");
                option.value = responseJson.name;
                option.innerHTML = responseJson.gtin14;
                list.appendChild(option);
                i=5;
            }
        }

    });
}

function setTheme() {
    var themeButton = document.getElementById("darkmodeSwitch");
    var themeJson = {
        theme: ""
    }
    if (themeButton.checked) {
        themeJson.theme = "dark";
    } else {
        themeJson.theme = "light"
    }
    post("themeSet", themeJson);
}

function getTheme() {
    fetch(url + "themeGet")
    .then(response => response.json())
    .then(data => {
        //Debug
        //console.log(data);
        if (data.theme == "dark") {
            document.body.setAttribute("data-bs-theme", "dark");
        } else {
            document.body.setAttribute("data-bs-theme", "light");
            document.getElementById("darkmodeSwitch").checked = false;
        }
    })
}