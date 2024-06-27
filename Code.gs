function onFormSubmit(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Form Responses 2");
  var responses = sheet.getDataRange().getValues();
  var headers = responses[0];
  var data = responses.slice(1); // Exclude headers

  var carpoolsData = organizeCarpools(data);
  outputCarpools(carpoolsData);
}

function organizeCarpools(data) {
  var carpools = {};
  var unmatchedRiders = {};

  data.forEach(function(row) {
    if (row[0] === '') {
      return;
    }

    var date = row[1]; // Date of Ride
    var seatsAvailable = parseInt(row[5]);

    if (!carpools[date]) {
      carpools[date] = { 'drivers': [], 'riders': [] };
    }

    var person = {
      'name': row[2], // Name
      'phone': row[3], // Phone Number
      'gender': row[4], // Gender
      'loc': row[8], // Pickup Location
      'food': row[6], // Food Preference
      'friend': row[7], // Friend Preference
      'matched': false
    };

    if (seatsAvailable > 0) {
      person['seatsAvailable'] = seatsAvailable;
      person['seatsAvailableOriginal'] = seatsAvailable;
      person['riders'] = [];
      carpools[date].drivers.push(person);
    } else {
      carpools[date].riders.push(person);
    }
  });

  for (var date in carpools) {
    var drivers = carpools[date].drivers;
    var riders = carpools[date].riders;

    drivers.forEach(function(driver) {
      while (driver.seatsAvailable > 0 && riders.length > 0) {
        var riderIndex = findRiderIndex(riders, driver, true);

        if (riderIndex === -1) {
          riderIndex = findRiderIndex(riders, driver, false);
        }

        if (riderIndex >= 0) {
          var rider = riders.splice(riderIndex, 1)[0];
          driver.riders.push(rider);
          rider.matched = true;
          driver.seatsAvailable--;
        }
      }
    });

    unmatchedRiders[date] = riders.filter(rider => !rider.matched);
  }

  matchSoloDriversToCarpools(carpools);

  return { 'matchedCarpools': carpools, 'unmatchedRiders': unmatchedRiders };
}

function findRiderIndex(riders, driver, sameGenderOnly) {
  return riders.findIndex(rider =>
    (sameGenderOnly ? rider.gender === driver.gender : true)
  );
}

function matchSoloDriversToCarpools(carpools) {
  var soloDrivers = [];
  var carsWithOpenSeats = [];

  // Identify solo drivers and cars with open seats
  for (var date in carpools.matchedCarpools) {
    var drivers = carpools.matchedCarpools[date].drivers;
    drivers.forEach(function(driver) {
      if (driver.riders.length === 0 && driver.seatsAvailable > 0) {
        soloDrivers.push(driver);
      } else if (driver.seatsAvailable > 0) {
        carsWithOpenSeats.push(driver);
      }
    });
  }

  // Attempt to place solo drivers in cars with open seats
  soloDrivers.forEach(function(soloDriver) {
    for (var i = 0; i < carsWithOpenSeats.length; i++) {
      var car = carsWithOpenSeats[i];
      if (car.seatsAvailable > 0) {
        // Add solo driver to this car as a rider
        car.riders.push({name: soloDriver.name, loc: soloDriver.loc});
        car.seatsAvailable--;
        soloDriver.seatsAvailable = 0; // Solo driver is no longer driving
        break; // Move to the next solo driver
      }
    }
  });

  // Update carpool data
  // carpools.matchedCarpools[date].drivers = drivers.filter(driver => driver.seatsAvailable > 0);
}


function outputCarpools(carpoolsData) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var matchedCarpoolsSheet = ss.getSheetByName('Matched Carpools');
  var unmatchedRidersSheet = ss.getSheetByName('Unmatched Riders');

  matchedCarpoolsSheet.clear();
  unmatchedRidersSheet.clear();

  matchedCarpoolsSheet.appendRow(['Date', 'Driver', 'Seats Still Available', 'Riders']);
  unmatchedRidersSheet.appendRow(['Date', 'Rider', 'Gender', 'Location', 'Friend']);

  for (var date in carpoolsData.matchedCarpools) {
    var formattedDate = formatDate(date);
    var drivers = carpoolsData.matchedCarpools[date].drivers;
    drivers.forEach(function(driver) {
      
      var riderDetails = driver.riders.map(function(rider) {
        return rider.name + ' (' + rider.loc + ')';
      });
      var riderDetailsString = riderDetails.join(', ');
      matchedCarpoolsSheet.appendRow([formattedDate, driver.name, driver.seatsAvailable, riderDetailsString]);
    });
  }

  /*for (var date in carpoolsData.matchedCarpools) {
    var formattedDate = formatDate(date);
    var drivers = carpoolsData.matchedCarpools[date].drivers;
    drivers.forEach(function(driver) {
      // Create a string for each rider that includes the name and location
      var riderDetails = driver.riders.map(function(rider) {
        return rider.name + ' (' + rider.loc + ')';
      });


      // Join the rider details into a single string
      var riderDetailsString = riderDetails.join(', ');


      matchedCarpoolsSheet.appendRow([formattedDate, driver.name, riderDetailsString, driver.seatsAvailable]);
    });
  }*/

  for (var date in carpoolsData.unmatchedRiders) {
    var formattedDate = formatDate(date);
    var riders = carpoolsData.unmatchedRiders[date];
    riders.forEach(function(rider) {
      unmatchedRidersSheet.appendRow([formattedDate, rider.name, rider.gender, rider.loc, rider.friend]);
    });
  }
}

function formatDate(dateString) {
 // var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
 var date = new Date(dateString);
 // var dayOfWeek = days[date.getDay()];
 var month = date.getMonth() + 1;
 var dayOfMonth = date.getDate();
 return '(' + month + '/' + dayOfMonth + ')';
}

function setupTrigger() {
 var sheet = SpreadsheetApp.getActiveSpreadsheet();
 ScriptApp.newTrigger('onFormSubmit')
          .forSpreadsheet(sheet)
          .onFormSubmit()
          .create();
}
