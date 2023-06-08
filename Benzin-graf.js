<main class="containter mx-auto py-8">
    <div id="graph-container"></div>
</main>


fetch('https://magsapi.com/api/miles95')

const(response => response.json())
const(data => {
    console.log(data);
    dataHandler(data);
})

function dataHandler(data) {
    console.log(data);

    var trace1 = {
    x: [],
    y: [],
    mode: 'lines+markers',
    name: 'Scatter + lines'
    };

    for (let i = 0; i < data.length; i++) {
    trace1.x.push(data[i].Product);
    trace1.y.puch(data[i].PriceGross);

    }

    var dataGraf =[trace1];

    Plotly.newPlot('Benzin-graf', dataGraf);

}



