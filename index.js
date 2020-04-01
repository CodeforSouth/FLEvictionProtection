

$.getJSON(
    "https://spreadsheets.google.com/feeds/cells/1xEz5wfWSwXbAgWhgvJxfxSDhNGf5w8hqVpAFbbAViEo/1/public/full?alt=json", // ",
    function(data) {
     //Success! Do stuff with data.
      console.log(data.feed.entry.length);
   //Define columns and rows count    
      columns=Number(data.feed.gs$colCount.$t)
      rows=Number(data.feed.gs$rowCount.$t)
   //Define database retrieved
   let database=[...data.feed.entry]
   
   //Get list of counties and column title count/location
   let countylist=[]
   let colHeads=[]
  
      for (let i=1;i<database.length;i++){
         if(database[i].title.$t.slice(1)==1){
         colHeads.push(
           {
           title:database[i].content.$t,
           colLetter:database[i].title.$t.slice(0,1)     
         })
         }
         if (database[i].title.$t.includes('A')){
         let county={
           rowNumber: database[i].title.$t.slice(1),
           name: database[i].content.$t
         }
         
         countylist.push(county)
        }
      }
   //Array of the columns 
   let columnCollection=[]
   
   colHeads.forEach(eachTitle=>{
      let columnGroup=database.filter(eachCell=>{
          return eachCell.title.$t.slice(0,1)==eachTitle.colLetter
        })
        columnCollection.push(columnGroup);
   })
   
  //This builds category object with each column title as properties
  for (let i=0;i<countylist.length;i++){
    let step=[]
    for (let j=0; j<colHeads.length;j++){
      let holder=columnCollection[j].filter(eachCollection=>{
        return eachCollection.title.$t.slice(1)==countylist[i].rowNumber
      })
      if (holder.length===1){
        step.push(holder[0].content.$t)
      }else{
        step.push( "n/a")
      }
      
    }
    let columnModel={
    Circuit: step[0],
    RentPastDue: step[1],
    LandlordsSendNotice:step[2],
    Landlordfilesforevictionincourt:step[3],
    Clerkissuessummons:step[4],
    Tenantisservedevictionpapers:step[5],
    IstheClerkAcceptingRentPostinginPerson:step[6],
    Tenantmustrespondandpaypastduerenttocourt:step[7],
    Until:step[8],
    Landlordfilesfordefaultjudgment:step[9],
    JudgerulesNohearingrequired:step[10],
    ClerkissuesWritofPossession:step[11],
    SheriffenforcesWritofPossession:step[12],
    EndDate:step[13],
    NumofRenterHouseholds:step[14],
    NumofLowIncomeCostBurdenedRenterHouseholds:step[15],
    LinktoSources:step[16],
    Notes:step[17],
    BottomLine:step[18],
    ClerkWebsite:step[19],
    CircuitCourtWebsite:step[20],
    LegalAid:step[21]
    }
    countylist[i].categories=columnModel
  
  } 
      console.log(countylist)//will show the list of county objects in console
    }
  );