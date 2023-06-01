/* Inden jeg skriver forklarende tekst her vil jeg lige sige det er en untrolig mærkelig måde du laver dette fetch på eller er det bare mig? */

/* definere din txt string til bare at være en tom string */
let txt = "";

/* Laver din async function den er async så andet kan kører mens dette kører i baggrunden */
async function APIKald() {

  /* henter værdi fra dit input felt */
  ind = document.getElementById("ind").value;
  
  /* Dit api "adresse" hvor det sidste og det endelige url kommer fra dit inputfelt  */
  url = "https://api.dataforsyningen.dk/postnumre/" + ind;

  /* Laver et nyt Request object med url som parameter */
  var req = new Request(url);

  /* Definere dit response som fetcher med din request  */
  const response = await fetch(req);

  /* Bemærk at pga din await her venter den på at ovenstående linje er kørt før dette køres altså det er ikke async det gives væk med await som er et promise.  */
  const Objekt = await response.json();
  console.log(Objekt)
 


  /* Her skriver du så din data ud i din html du vælger hvad du vil skrive ud her udfra dit objekt så du vil gerne have hele objektet ud altså indtastede post nummer +  navn 
     Der bliver loopet så den dynamisk udskriver alt data der ville komme fra et pågældende postnummer f.eks 8800 Viborg giver:
     1 Silkeborg
     2 Viborg 
     
  */
  document.getElementById("id1").innerHTML =
    Objekt.nr + " " + Objekt.navn;
  txt = "";
  Objekt.kommuner.forEach(myFunction);
  document.getElementById("ud").innerHTML = txt;
}

/* Denne function printer listen for dig  */
function myFunction(value, index, array) {
  console.log(txt)
  txt += index + 1 + " " + value.navn + "<br>";
}