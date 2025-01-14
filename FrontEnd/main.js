const url = "http://localhost:3000/goals";
function sendRequest() {
  axios
    .post(url, {
      title: document.getElementById("new-item").value,
      isCompleted: false,
    })
    .then(
      (response) => {
        console.log(response);
      },
      (error) => {
        console.log(error);
      }
    );
}

async function fetchData() {
  try {
    const response = await axios.get(url);
    console.log(response.data);
    return response.data;
  } catch {
    console.error("Error:", error);
    return [];
  }
}

async function toggleItem(id, completed){
  try{
    await axios.put(`${url}/${id}`,{
      isCompleted: !completed,
    });

    updateList();
  } catch {
    console.error(error);
  }
}

async function editItem(id,title) {
 const titleText = document.getElementsByClassName("item-text");
  const newTitle = prompt('Edit item:', titleText.textContent);
  try {
    await axios.put(`${url}/${id}`,{
      title: newTitle.trim(),
    });
    updateList();
  } catch (error) {
    console.log(error)
  }
}

async function updateList() {
  const itemsList = document.getElementById("items-list");
  itemsList.innerHTML = "";
  let items = await fetchData();

  if (items.length === 0) {
    itemsList.innerHTML = `
            <div class="empty-state">
                No items in your bucket list yet. Add some dreams above!
            </div>
        `;
    return;
  }

  items.forEach((item) => {
    const itemElement = document.createElement("div");
    itemElement.className = "item";
    itemElement.innerHTML = `
            <div class="checkbox ${
              item.isCompleted ? "checked" : ""}" onclick="toggleItem(${item.id},${item.isCompleted})">
                ${item.isCompleted ? '<i class="fas fa-check"></i>' : ""}
            </div>
            <span class="item-text ${item.isCompleted ? "completed" : ""}">${
      item.title
    }</span>
            <div class="actions">
                <button class="action-btn edit" onclick="editItem(${item.id}, '${item.title.replace(/'/g, "\\'")}')">

                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn delete" onclick="deleteItem(${
                  item.id
                })">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
    itemsList.appendChild(itemElement);
  });
}

window.addEventListener("DOMContentLoaded", function () {
  updateList();
});
