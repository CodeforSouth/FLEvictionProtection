// Credits to :
// Francesca Jeah No Lee https://codepen.io/Francesca_G
// Raphael Burkhardt https://codepen.io/zibobilo

// Visit https://florida.evictionprotection.org/ to see the interface in action.

// ------------------------------------------------

// Setting the text for each element of the chevrons

// general
let detailsText = "<h5>- Click for details -</h5>"

// Green chevron elements
let greenTitle = `<h4>Eviction Active</h4>`
let greenText = `<div><p>Eviction cases will continue through the county court process, and the sheriff will enforce the removal of tenants (writs of possession) who lose their case.</p></div>`

// Red chevron elements
let redTitle = `<h4>Eviction Suspended</h4>`
let redText = `<div><p>- Some part of the eviction court process has been paused or suspended, giving you more time to fight for your right to stay.<br><br>- Removal of tenants who have previously lost their case is paused, either because the clerk has temporarily stopped issuing writs of possession or because the sheriff is not enforcing them</p></div>`

// Blue chevron elements
let blueTitle = `<h4>Eviction cases active / <br> Tenant removal innactive</h4>`
let blueText = `<div><p>New and existing eviction cases will continue through the county court process. However, the removal of tenants who lose their case is paused, either because the clerk has temporarily stopped issuing writs of possession or because the sheriff is not enforcing them.</p></div>`


// Setting variables to call the Chevrons on demand
let addChevron = document.querySelector('.statuscolor')
let greenChevron = `<div class="chevron greencolor" onclick="greenExtra()" id="greench">${greenTitle}${detailsText}</div>`
let redChevron = `<div class="chevron redcolor" onclick="redExtra()" id="redch">${redTitle}${detailsText}</div>`
let blueChevron = `<div class="chevron bluecolor" onclick="blueExtra()" id="bluech">${blueTitle}${detailsText}</div>`

addChevron.innerHTML = `${greenChevron}${redChevron}${blueChevron}`


// onclick chevrons event handler functions
function greenExtra() {
 let x = document.getElementById("greench")
 if (x.innerHTML == `${greenTitle}${detailsText}`) { 
   x.innerHTML = `${greenTitle}${greenText}` 
 } else { 
   x.innerHTML = `${greenTitle}${detailsText}` 
 }
}

function redExtra() {
  let x = document.getElementById("redch")
  if (x.innerHTML == `${redTitle}${detailsText}`) {
    x.innerHTML = `${redTitle}${redText}`
  } else {
    x.innerHTML = `${redTitle}${detailsText}`
  }
}

function blueExtra() {
  let x = document.getElementById("bluech")
  if (x.innerHTML == `${blueTitle}${detailsText}`) { 
    x.innerHTML = `${blueTitle}${blueText}`
  } else {
    x.innerHTML = `${blueTitle}${detailsText}`
  }
}

// API Call
$.getJSON("https://spreadsheets.google.com/feeds/cells/1xEz5wfWSwXbAgWhgvJxfxSDhNGf5w8hqVpAFbbAViEo/1/public/full?alt=json",
  function (data) {
    // Success
    // console.log(`# Total Fields : ${data.feed.entry.length}`);
    
    //Define columns and rows count    
    columns = Number(data.feed.gs$colCount.$t)
    rows = Number(data.feed.gs$rowCount.$t)
    
    //Define database retrieved
    let database = [...data.feed.entry]

    //Get list of counties and column title count/location
    let countylist = []
    let colHeads = []
    let allCounty = []

    for (let i = 0; i < database.length; i++) {
      if (database[i].gs$cell.row == 1) {
        colHeads.push({ title: database[i].content.$t, colNum: database[i].title.$t.slice(0, 1) })
      }
      if (database[i].gs$cell.col == 1 && i !== 0) {
        let county = { name: database[i].content.$t, rowNumber: database[i].gs$cell.row }
        countylist.push(county)
        allCounty.push(database[i].content.$t)
      }
    }
    
    //Sorting the counties by alphabetical order
    allCounty.sort()

    // Populate dropdown with counties
    let list = document.getElementById("countyList")

    for (let i = 0; i < allCounty.length; i++) {
      list.innerHTML += `<option value="${allCounty[i]}">`
    }
    
    //Attributing classes from data cell content to innerHTML
    function stopGoClass(value) {
      if (value == "✖") {
        return "stop"
      } else {
        return "go"
      }
    }

    const selectElement = document.querySelector('.citySelector')

    selectElement.addEventListener('input', (event) => {
      
      const result = document.querySelector('.timeline')
      const status = document.querySelector('.statuscolor')

      //Only the match between input and database values will retrieve results
      if (allCounty.includes(event.target.value)) {
        
        selectElement.setAttribute("placeholder", event.target.value);
        let row = []

        // building the row for the county selected
        function buildRow(countySelection) {

          for (let j = 0; j < database.length; j++) {

            if (database[j].content.$t.includes(countySelection) && database[j].gs$cell.col == 1) {
              let sameRow = database[j].gs$cell.row
              //will iterate through the 26 columns for a-z
              for (let r = j; r < database.length; r++) {

                if (sameRow == database[r].gs$cell.row) {
                  row.push({ cellnum: database[r].title.$t.slice(0, 1), text: database[r].content.$t })
                } else {
                  break;
                }
              }
              break;
            }
          }
        }
        
        buildRow(event.target.value);
        //console.log(row)
        //console.log(colHeads)

        row.map(eachItem => {
          for (let m = 0; m < colHeads.length; m++) {
            if (eachItem.cellnum == colHeads[m].colNum) {
              eachItem.title = colHeads[m].title
            }
          }
        })

        //Build string for html text
        let strng = ''
        let bottomLine = ""
        let links = ""
        let notes = ""
        let cells = ["R", "U", "V", "W"]
        let counter = 0
        
        for (n = 2; n < row.length; n++) {

          if (row[n].title === "Until") {
            //strng +=`<li class="date">${row[n].title}: ${row[n].text}</li>`
            strng = strng
          } else
            if (row[n].cellnum < "O" && row[n].cellnum != "H") {
              counter++
              strng += `<li class=${stopGoClass(row[n].text)}>${row[n].title}</li>`
              if (counter === 2) {
                strng += '<br><li class="textbetween">3 Days </li><br>'
              } else if (counter === 5) {
                strng += '<br><li class="textbetween">5 Days </li><br>'
              } else if (counter === 6) {
                strng += '<br><li class="textbetween"> Cannot Pay </li><br>'
              }
            } else if (row[n].cellnum === "O") {
                strng += `<li class="date">${row[n].title}: ${row[n].text}</li>`
            } else if (row[n].title === "Bottom Line") {
                if (row[n].text == "Evictions Suspended by Statewide Moratorium") {
                  bottomLine += `${blueChevron}`}
                else if (row[n].text == "Evictions Suspended") {
                  bottomLine += `${redChevron}`}
                else if (row[n].text == "Evictions Active") {
                  bottomLine += `${greenChevron}`}
            } else if (cells.includes(row[n].cellnum)) {
                links += `<li class="county-links"><a href=${row[n].text}>${row[n].title}</a></li>`
            } else if (row[n].cellnum === "S") {
                notes += `<li class="notes">${row[n].title}: ${row[n].text}</li>`
            }
        }
        status.innerHTML = `<h2 class="cityTitle">${event.target.value} County</h2>${bottomLine}`
        result.innerHTML = `<ol>${strng + links + notes}</ol>`
      }
    })
  }
)
