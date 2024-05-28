let chartData;

let stockNameBookValueAndProfitDiv = document.querySelector('#stockNameBookValueAndProfit');
async function getChartData(){
    const url = 'https://stocks3.onrender.com/api/stocks/getstocksdata';
    const response = await fetch(url);
    const result = await response.json();
    // console.log(result.stocksData[0]);
    chartData = result.stocksData[0];
    
}

window.addEventListener('DOMContentLoaded', async () => {
  await getChartData();
  createChart('AAPL', '5y', chartData);
});


let myChart;
async function createChart(stockName, timeStamp, chartData){

  // Clear the existing buttons in the chart section
  const buttonsDiv = document.querySelector("#buttons-div");
  buttonsDiv.innerHTML = '';

  // Access the object corresponding to the selected stock and time 
  const dataObject = chartData[stockName][timeStamp];

  // Extract the values from the data object
  const labels = dataObject.timeStamp.map(timestamp => new Date(timestamp * 1000).toLocaleDateString());
  const data = dataObject.value;

  // Create the chart
  const ctx = document.getElementById('myChart');
  if (myChart) {
    myChart.destroy(); // Destroy the existing chart if it exists
  }
  myChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Stock Price',
        data: data,
        borderWidth: 3
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });

  // Create buttons for other time frames
  const buttonNames = ['5y', '1y', '1mo', '3mo'];
  buttonNames.forEach(timeFrame => {
    const button = document.createElement('button');
    button.textContent = timeFrame;
    button.classList.add('btn', 'btn-primary', 'm-2');
    button.addEventListener('click', () => createChart(stockName, timeFrame, chartData));
    buttonsDiv.appendChild(button);
  });
}
createChart('AMZN', '5y', chartData);


async function getStockDetails(stock , bookValue, profit){

    const url = 'https://stocks3.onrender.com/api/stocks/getstocksprofiledata';
    const response = await fetch(url);
    const result = await response.json();
    const stockName = document.getElementById('stockName');
    const stockBookValue = document.querySelector('#stockBookValue');
    const stockProfit = document.querySelector('#stockProfit');
    const summary = document.querySelector('#summary');
    
    stockName.textContent = stock;
    stockBookValue.textContent = `$${bookValue}  `;
    stockProfit.textContent = ` ${profit}%`;
    if(profit<=0){
      stockProfit.classList.add('text-danger');
    }
    else{
      stockProfit.classList.add('text-success');
    }
    summary.textContent = result.stocksProfileData[0][stock].summary;
    
}
getStockDetails('AAPL',3.95, 0.24);



async function stockList(){
    const url = 'https://stocks3.onrender.com/api/stocks/getstocksprofiledata';
    const response = await fetch(url);
    const result = await response.json();
    
}
stockList();

// stockList name, bookvalue, profit
async function stockListNameValueProfit(){
  const response = await fetch('https://stocks3.onrender.com/api/stocks/getstockstatsdata');
  const result = await response.json();

  const updatedResult = result.stocksStatsData;
  stockNameBookValueAndProfitDiv.innerHTML = '';

// Loop through each object in the array
const stockDetails = document.querySelector("#stockDetails");

updatedResult.forEach(object => {
  
  Object.keys(object).forEach(key => {

      const buttonAndContentDiv = document.createElement('div');
      const buttonTag = document.createElement('button');
      const bookvalueSpanTag = document.createElement('span');
      const profitSpanTag = document.createElement('span');

      stockNameBookValueAndProfitDiv.appendChild(buttonAndContentDiv);
      buttonAndContentDiv.appendChild(buttonTag);
      buttonAndContentDiv.appendChild(bookvalueSpanTag);
      buttonAndContentDiv.appendChild(profitSpanTag);

      buttonTag.setAttribute('id','sName');
      bookvalueSpanTag.setAttribute('id','bookvalue');
      profitSpanTag.setAttribute('id','profit');
      buttonTag.textContent = key;
      
      if (key != '_id') {
        buttonTag.textContent = key;
        buttonTag.classList.add('btn', 'btn-primary', 'mt-3', 'width-25');
        buttonTag.setAttribute('id', key);
      }

    
      const stockData = object[key];
      const {bookValue, profit} = stockData;

      const newBookValue = (bookValue !== undefined) ? bookValue.toFixed(2) : '';
      const newProfit = (profit !== undefined) ? profit.toFixed(2) : '';
      
      bookvalueSpanTag.innerHTML = newBookValue;
      
      profitSpanTag.innerHTML = newProfit;
      
      bookvalueSpanTag.classList.add('spanTextFormating');
      
      profitSpanTag.classList.add('spanTextFormating');
      if(profit<=0)
        profitSpanTag.classList.add('text-danger');
      else
      profitSpanTag.classList.add('text-success');


      //adding event to the button inside stock-list-and-price
    buttonTag.addEventListener('click', async ()=>{
      const response = await fetch('https://stocks3.onrender.com/api/stocks/getstocksdata');
      console.log(response);
      const result = await response.json();
      console.log(result);
      const updatedResult = result.stocksData[0];
      console.log(updatedResult);
      console.log(buttonTag);


      let stockName = buttonTag.id;
      console.log(stockName);
      let bookValue = newBookValue;
      let profit = newProfit;
      console.log('bookvalue :  ',newBookValue);
      console.log('profit :', newProfit);
      
      await getChartData();
      createChart(stockName, '5y', updatedResult);
      getStockDetails(stockName,bookValue,profit);
    });
  });
});

}
stockListNameValueProfit();