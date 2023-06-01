let txt = "";
async function APIKald() {
  ind = document.getElementById("ind").value;
  url = "https://api.dataforsyningen.dk/postnumre/" + ind;
  var req = new Request(url);
  const response = await fetch(req);
  const Objekt = await response.json();
  document.getElementById("id1").innerHTML =
    Objekt.nr + " " + Objekt.navn;
  txt = "";
  Objekt.kommuner.forEach(myFunction);
  document.getElementById("ud").innerHTML = txt;
}
function myFunction(value, index, array) {
  txt += index + 1 + " " + value.navn + "<br>";
}