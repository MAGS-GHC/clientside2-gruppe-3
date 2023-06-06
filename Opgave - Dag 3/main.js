/* fetch('https://magsapi.com/api/miles95')
  .then(response => response.json())
  .then(data => {
    // Process the retrieved data
    console.log(data);

    dataHandler(data);
  })
  .catch(error => {
    // Handle any errors that occurred during the fetch request
    console.error('Error:', error);
  });

function dataHandler(data) {
  console.log(data);

  var traces = []; // Array to store all trace objects

  for (let i = 0; i < data.length; i++) {
    var trace1 = {
      y: [data[i].PriceGross],
      x: [data[i].Date],
      type: 'scatter'
    };

    traces.push(trace1); // Add each trace object to the array
  }

  Plotly.newPlot('myDiv', traces);
}
 */
fetch('https://magsapi.com/api/miles95')
  .then(response => response.json())
  .then(data => {
    // Process the retrieved data
    console.log(data);

    dataHandler(data);
  })
  .catch(error => {
    // Handle any errors that occurred during the fetch request
    console.error('Error:', error);
  });

function dataHandler(data) {
  console.log(data);

  var trace1 = {
    x: [],
    y: [],
    type: 'scatter'
  };

  for (let i = 0; i < data.length; i++) {
    trace1.x.push(data[i].Date);
    trace1.y.push(data[i].PriceGross);
  }

  var dataToLine = [trace1];

  Plotly.newPlot('graph-container', dataToLine);
}
