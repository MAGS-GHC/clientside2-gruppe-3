function saveName() {
  var inputField = document.getElementById("name-input");
  var name = inputField.value;
  localStorage.setItem("savedName", name);
  console.log("Name saved: " + name);
  window.location.href = "game/index.html";
}