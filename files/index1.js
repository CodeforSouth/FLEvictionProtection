// API Call
$.getJSON(
    "https://spreadsheets.google.com/feeds/cells/1xEz5wfWSwXbAgWhgvJxfxSDhNGf5w8hqVpAFbbAViEo/1/public/full?alt=json", 
    function(data) {
   //Success
      console.log(`# Total Fields : ${data.feed.entry.length}`);
   //Define columns and rows count    
      columns = Number(data.feed.gs$colCount.$t)
      rows = Number(data.feed.gs$rowCount.$t)
      console.log(columns)
   //Define database retrieved
   let database = [...data.feed.entry]
   
   //Get list of counties and column title count/location
   let countylist = []
   let colHeads = []
   let allCounty = []
  
      for (let i = 0; i < database.length; i++) {
         if (database[i].gs$cell.row == 1) {
           colHeads.push({ title : database[i].content.$t, colNum : database[i].title.$t.slice(0,1) })
         }
         if (database[i].gs$cell.col == 1 && i !== 0) {
           let county = { name: database[i].content.$t, rowNumber: database[i].gs$cell.row}
           countylist.push(county)
           allCounty.push(database[i].content.$t)
         }
      }
      
     allCounty.sort()
      
  // Populate dropdown with counties
    let list = document.getElementById("countyList")
  
    for (let i = 0; i < allCounty.length; i++){
      list.innerHTML += `<option value="${allCounty[i]}">`
    }
  
    function stopGoClass(value) {
      if (value == "✖") {
        return "stop"
      } else {
        return "go"
      } 
    }
      
    const selectElement = document.querySelector('.citySelector')
  
    selectElement.addEventListener('change', (event) => {
      const result = document.querySelector('.timeline')
      
      //Only the match between input and database values will retrieve results
      if (allCounty.includes(event.target.value)) {
        let row = []
        let previousCellNum
        
        // building the row for the county selected
        function buildRow(countySelection) {
          
          for (let j = 0; j < database.length; j++ ) {
           
            if(database[j].content.$t.includes(countySelection) && database[j].gs$cell.col == 1) {
              let sameRow = database[j].gs$cell.row
              //will iterate through the 26 columns for a-z
              for (let r = j; r < j + columns; r++) {
              
                if(sameRow == database[r].gs$cell.row) {
                  row.push({cellnum: database[r].title.$t.slice(0,1), text: database[r].content.$t })
                }
              }
            }
          }
        }
        
        buildRow(event.target.value);
        console.log(row)
        console.log(colHeads)
        let countyDetails=[...row]
        row.map(eachItem=>{
          for (let m=0;m<colHeads.length;m++){
            if (eachItem.cellnum==colHeads[m].colNum){
              eachItem.title=colHeads[m].title
            }
          }
        })
  
        result.innerHTML = `
        <h2 class="cityTitle">County of ${event.target.value}</h2>
        <ol>
          <li class=${stopGoClass(row[2].text)}>${row[2].title}</li>
          <li class=${stopGoClass(row[3].text)}>${row[3].title}</li><br>
          <li class="textbetween">3 Days </li><br>
          <li class=${stopGoClass(row[4].text)}>${row[4].title}</li>
          <li class=${stopGoClass(row[5].text)}>${row[5].title}</li>
          <li class=${stopGoClass(row[6].text)}>${row[6].title}</li><br>
          <li class="textbetween">5 Days </li><br>
          <li class=${stopGoClass(row[7].text)}>${row[7].title}</li><br>
          <li class="textbetween">Can't Pay </li><br>
          <li class=${stopGoClass(row[8].text)}>${row[8].title}</li>
          <li class=${stopGoClass(row[9].text)}>${row[9].title}</li>
          <li class=${stopGoClass(row[10].text)}>${row[10].title}</li>
          <li class=${stopGoClass(row[11].text)}>${row[11].title}</li>
        </ol>`     
      }
    })
   }
  )