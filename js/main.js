const API = "http://localhost:8000/contacts";

const contactContainer = document.querySelector(".contact-container");
const addContacts = document.querySelector(".add-contacts");
const nameInput = document.querySelector("#name-input");
const surNameInput = document.querySelector("#surname-input");
const pictureInput = document.querySelector("#pfp-input");
const numberInput = document.querySelector("#number-input");

const editModal = document.querySelector("#edit-modal");
const closeModalBtn = document.querySelector("#close-modal");
const editNameInput = document.querySelector("#edit-name-input");
const editPictureInput = document.querySelector("#edit-picture-input");
const editNumberInput = document.querySelector("#edit-number-input");
const editSurNameInput = document.querySelector("#edit-surname-input");
const editCancel = document.querySelector("#edit-cancel");
const editSubmit = document.querySelector(".edit-submit");

// !Get
async function getData() {
  let res = await fetch(API);
  let data = await res.json();
  //   console.log(data);
  return data;
}
async function getOneContact(id) {
  const res = await fetch(`${API}/${id}`);
  const data = await res.json();
  return data;
}

// ! Post
async function addContact(newContact) {
  const res = await fetch(API, {
    method: "POST",
    body: JSON.stringify(newContact),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

// ! Delete

async function deleteContact(id) {
  await fetch(`${API}/${id}`, {
    method: "DELETE",
  });
}

// ! Patch , частично обновляет обьект

async function changeContact(newData, id) {
  await fetch(`${API}/${id}`, {
    method: "PATCH",
    body: JSON.stringify(newData),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

// ! Put , заменяет весь обьект

async function changeContact(newData, id) {
  await fetch(`${API}/${id}`, {
    method: "PUT",
    body: JSON.stringify(newData),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

//! render

render();

async function render() {
  const data = await getData();
  contactContainer.innerHTML = "";
  data.forEach((item) => [
    (contactContainer.innerHTML += `
    <div class="contact-item">
    <img class="img" src="${item.picture}" alt="" style="width:50px; height:50px">
    <div class="inputs_">
        <span class="name">${item.name}</span>
        <span class="name">${item.surname}</span>
        <span>${item.number}</span>
    </div>
    <div class="contact-item__buttons">
        <button id="${item.id}" class="edit-btn">Edit</button>
        <button id="${item.id}" class="delete-btn">Delete</button>
    </div>
  </div>
    `),
  ]);
}

addContacts.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (
    !nameInput.value.trim() ||
    !surNameInput.value.trim() ||
    !numberInput.value.trim() ||
    !pictureInput.value.trim()
  ) {
    alert("заполните все поля!!!лох");
    return;
  }
  const contact = {
    name: nameInput.value, //? содержимое инпута
    surname: surNameInput.value,
    picture: pictureInput.value,
    number: numberInput.value,
  };

  nameInput.value = "";
  surNameInput.value = "";
  pictureInput.value = "";
  numberInput.value = "";

  await addContact(contact);

  render();
});

document.addEventListener("click", async (e) => {
  if (e.target.classList.contains("delete-btn")) {
    await deleteContact(e.target.id);
    render();
  }
});

let id = null;

document.addEventListener("click", async (e) => {
  if (e.target.classList.contains("edit-btn")) {
    editModal.style.visibility = "visible";
    const contact = await getOneContact(e.target.id);
    id = e.target.id;
    editNameInput.value = contact.name;
    editSurNameInput.value = contact.surname;
    editPictureInput.value = contact.picture;
    editNumberInput.value = contact.number;
    editNameInput.focus();

    // render();
  }
});

function handleCloseModal() {
  editModal.style.visibility = "hidden";
}
closeModalBtn.addEventListener("click", (e) => {
  handleCloseModal();
});

editCancel.addEventListener("click", (e) => {
  handleCloseModal();
});
document.addEventListener("keydown", (e) => {
  if (e.key == "Escape") {
    handleCloseModal();
  }
});

editSubmit.addEventListener("click", async (e) => {
  if (
    !editNumberInput.value.trim() ||
    !editNameInput.value.trim() ||
    !editSurNameInput.value.trim() ||
    !editPictureInput.value.trim()
  ) {
    return;
  }
  const newData = {
    name: editNameInput.value,
    surname: editSurNameInput,
    picture: editPictureInput.value,
    number: editNumberInput.value,
  };

  await changeContact(newData, id);
  render();
  handleCloseModal();
});

document.addEventListener("keydown", async (e) => {
  if (e.key == "Enter") {
    if (
      !editNumberInput.value.trim() ||
      !editNameInput.value.trim() ||
      !editSurNameInput.value.trim() ||
      !editPictureInput.value.trim()
    ) {
      return;
    }
    const newData = {
      name: editNameInput.value,
      surname: editSurNameInput,
      picture: editPictureInput.value,
      number: editNumberInput.value,
    };

    await changeContact(newData, id);
    render();
    handleCloseModal();
  }
});
