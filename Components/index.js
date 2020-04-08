// Credits to
// Francesca Jeah No Lee https://codepen.io/Francesca_G
// Raphael Burkhardt https://codepen.io/zibobilo

// Visit https://florida.evictionprotection.org/ to see the interface in action.

// API Call
$.getJSON(
  "https://spreadsheets.google.com/feeds/cells/1xEz5wfWSwXbAgWhgvJxfxSDhNGf5w8hqVpAFbbAViEo/1/public/full?alt=json",
  function (data) {
    //Success
    console.log(`# Total Fields : ${data.feed.entry.length}`);
    //Define columns and rows count    
    columns = Number(data.feed.gs$colCount.$t)
    rows = Number(data.feed.gs$rowCount.$t)
    //console.log(columns)
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

    allCounty.sort()

    // Populate dropdown with counties
    let list = document.getElementById("countyList")

    for (let i = 0; i < allCounty.length; i++) {
      list.innerHTML += `<option value="${allCounty[i]}">`
    }
    // console.log(list.innerHTML)
    function stopGoClass(value) {
      if (value == "✖") {
        return "stop"
      } else {
        return "go"
      }
    }
    console.log(allCounty)

    const selectElement = document.querySelector('.citySelector')

    selectElement.addEventListener('change', (event) => {
      const result = document.querySelector('.timeline')

      //Only the match between input and database values will retrieve results
      if (allCounty.includes(event.target.value)) {
        console.log(event.target.value)
        let row = []
        let previousCellNum

        // building the row for the county selected
        function buildRow(countySelection) {

          for (let j = 0; j < database.length; j++) {
            

            if (database[j].content.$t.includes(countySelection) && database[j].gs$cell.col == 1) {
              console.log(j)
              console.log(database[j].gs$cell)
              console.log(database[j].content.$t)
              let sameRow = database[j].gs$cell.row
              //will iterate through the 26 columns for a-z
              for (let r = j; r < j + columns; r++) {

                if (sameRow == database[r].gs$cell.row) {
                  console.log("hello")
                  row.push({ cellnum: database[r].title.$t.slice(0, 1), text: database[r].content.$t })
                }
              }
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
            if (row[n].title=== "Clerk issues summons") {
            //strng +=`<li class="date">${row[n].title}: ${row[n].text}</li>`
             strng += `<li class=${stopGoClass(row[n].text)}>${row[n].title} <span class="tooltip" data-tooltip="More information on what this means">?</span></li>`
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
            } else
              if (row[n].cellnum === "O") {
                strng += `<li class="date">${row[n].title}: ${row[n].text}</li>`
              } else
                if (row[n].title === "Bottom Line") {
                  bottomLine += `<li class="bottomLine">${row[n].title}: ${row[n].text}</li>`
                } else
                  if (cells.includes(row[n].cellnum)) {
                    links += `<li class="county-links"><a href=${row[n].text}>${row[n].title}</a></li>`
                  } else
                    if (row[n].cellnum === "S") {
                      notes += `<li class="notes">${row[n].title}: ${row[n].text}</li>`
                    }
        }
        result.innerHTML = `<h2 class="cityTitle">${event.target.value} County</h2>
      <ol>${bottomLine}<li class="go">Step is Active</li>
      <li class="stop">Step is Not Active</li><li></li>${strng + links + notes}</ol>`
      }
    })
  }
)