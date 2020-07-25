// ======================
// VARIABLES
// ======================

// 1st: pull initial budgetItems/lastID from localStorage to set initial variables
let budgetItems = JSON.parse(localStorage.getItem("budgetItems")) || [];
let lastID = localStorage.getItem("lastID") || 0;


// ======================
// FUNCTIONS
// ======================

// 4th: function to update localStorage with latest budgetItems and latest lastID
const updateStorage = () => {
  localStorage.setItem("budgetItems", JSON.stringify(budgetItems));
  localStorage.setItem("lastID", lastID);
}

const renderItems = (items) => {
  if (!items) items = budgetItems;
  const tbody = $("#budgetItems tbody");
  tbody.empty();
  let total = 0;
  for (const {id, date, name, category, amount, notes} of items){
    tbody.append(`<tr data-id=${id}><td>${date}</td><td>${name}</td><td>${category}</td><td>$${parseFloat(amount).toFixed(2)}</td><td>${notes}</td><td class="delete"><span>x</span></td></tr>`);
    total += parseFloat(amount);
  }

  $("#total").text(`$${total.toFixed(2)}`)

}

$("#toggleFormButton, #hideForm").click(function(){
  $("#addItemForm").toggle("slow", function (){
    $("#toggleFormButton").text($(this).is(":visible")? "Hide Form" : "Add New Item")
  });
});

$("#addItem").click(function(event){
  event.preventDefault();
  
  const newItem = {
    id: ++lastID,
    date: moment().format("lll"),
    name : $("#name").val().trim(),
    category : $("#category").val(),
    amount : $("#amount").val().trim(),
    notes : $("#notes").val().trim(),
  };
  
  if (!newItem.name || !newItem.category || !newItem.amount){
    return alert ("Each budget item must have a valid name, category, and amount!")
  };

  budgetItems.push(newItem);
  $("input, select").val("");
  updateStorage();
  renderItems();
})

// 6th: wire up change event on the category select menu, show filtered budgetItems based on selection
$("#categoryFilter").change(function(){
  const category = $(this).val();

  if (category){
    const filteredItems = budgetItems.filter((item) => category === item.category);
    renderItems(filteredItems);
  } else {
    renderItems();
  }
});

// 7th: wire up click event on the delete button of a given row; on click delete that budgetItem

$("#budgetItems").on("click", ".delete", function(){
  const id = $(this).parents("tr").data("id");
  const remainingItems = budgetItems.filter ((item) => item.id !== id);
  budgetItems = remainingItems;
  updateStorage();
  renderItems();
})

renderItems();




