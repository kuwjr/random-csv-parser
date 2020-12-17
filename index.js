const fs = require('fs');
const CSVToJSON = require('csvtojson');
const readline = require('readline');

filePath = './assets/Person Data.csv';

var filterObj = {}

csvData = fs.readFile(filePath,'utf8', (err, csvData)=>{
  let result = []
  rows = csvData.split('\n').map(function(item) {
    return item.trim();
  });
  //get headers
  headers = rows[0].split(",")
  //add each row to an object
  for(let i=1; i<rows.length; i++){
	  let obj = {};
	  let currentline=rows[i].split(",");
	  for(let j=0; j<headers.length; j++){
		  obj[headers[j]] = currentline[j];
	  }
	  result.push(obj);
  }
  console.log(JSON.stringify(result))
})

// convert users.csv file to JSON array
CSVToJSON().fromFile(filePath)
    .then(data => {
      //get header names
      filterObj.keyNames = Object.keys(data[0])
      //create prompt
      _interface = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });
      //prompt interface
      _interface.question("Filter data on?\n"+filterObj.keyNames+': ', (str)=>{
          //get the column name using 'str'
          filterObj.columnName = filterObj.keyNames[str]
          //get all values in columnName
          filterObj.allValues = []
          for(let i=0; i<data.length; i++){
            filterObj.allValues.push(data[i][filterObj.columnName])
          }
          //get unique values from all values
          filterObj.uniqueValues = [ ...new Set(filterObj.allValues)]

          //prompt interface2
          _interface.question("Pick a value to filter:\n"+filterObj.uniqueValues+': ', (str2)=>{
              //get column value from str2
              filterObj.columnValue = filterObj.uniqueValues[str2]
              console.log(filterObj.columnValue+'======'+filterObj.columnName)
              //get filtered array with given columnName and columnValue
              filterObj.filteredArray = []
              for(let i=0; i<data.length; i++){
                //console.log(data[i][filterObj.columnName] === filterObj.columnValue)
                if(data[i][filterObj.columnName] === filterObj.columnValue){
                    filterObj.filteredArray.push(data[i])
                }
              }
              max = filterObj.filteredArray.length
              random = Math.floor((Math.random() * max) + 0);
              console.log(filterObj.filteredArray[random])
              _interface.close();
          })
      })
    }).catch(err => {
        console.log(err);
    });