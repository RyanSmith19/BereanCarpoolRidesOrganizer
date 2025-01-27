
# Carpool Script

## Overview
This script automates the organization of carpools using Google Sheets. It matches drivers and riders based on availability, location, and preferences, and outputs the results into organized sheets for easy management. The script is triggered in real-time by Google Form submissions, ensuring up-to-date carpool data.

---

## Features

- 🚗 **Automated Driver and Rider Matching**: Matches riders to drivers based on available seats, gender, and location preferences.
- ❌ **Unmatched Rider Handling**: Identifies and lists riders who could not be matched with a driver.
- ⏱️ **Real-Time Updates**: Automatically processes new submissions as they come in through a linked Google Form.
- 📊 **Detailed Outputs**: Results are displayed in two Google Sheets:
  - 📝 **Matched Carpools**: Lists drivers, their available seats, and assigned riders.
  - 🙋‍♂️ **Unmatched Riders**: Lists riders who could not be matched, along with their preferences.

---

## Script Workflow

1. 📥 **Form Submission**:
   - Triggered by Google Form submissions.
   - Fetches data from the "Form Responses 2" sheet.

2. 🗂️ **Data Organization**:
   - Separates drivers and riders based on seat availability.
   - Organizes data by ride date.

3. 🔄 **Carpool Matching**:
   - Matches riders to drivers, prioritizing same-gender assignments if possible.
   - Handles drivers with excess seats and reassigns unmatched solo drivers as riders when applicable.

4. 📤 **Output to Sheets**:
   - Writes matched carpools to the "Matched Carpools" sheet.
   - Lists unmatched riders in the "Unmatched Riders" sheet.

---

## Sheet Descriptions

### 1. Matched Carpools Sheet
Columns:
- 📅 **Date**: The date of the ride.
- 🚘 **Driver**: The driver's name.
- 🪑 **Seats Still Available**: Number of seats still available in the driver's car.
- 🧍‍♂️🧍‍♀️ **Riders**: Names and pickup locations of assigned riders.

### 2. Unmatched Riders Sheet
Columns:
- 📅 **Date**: The date of the ride.
- 🙋‍♂️ **Rider**: The unmatched rider's name.
- 🚻 **Gender**: The rider's gender.
- 📍 **Location**: Pickup location.
- 🤝 **Friend**: Preferred friend or carpool companion.

---

## Key Functions

### `onFormSubmit(e)`
- 🔧 Main function triggered by form submissions.
- Processes responses and organizes data into carpools.

### `organizeCarpools(data)`
- 🗂️ Separates and matches drivers and riders.
- ❌ Handles unmatched riders and organizes them into lists.

### `findRiderIndex(riders, driver, sameGenderOnly)`
- 🔍 Finds a suitable rider for a driver, optionally prioritizing same-gender matches.

### `matchSoloDriversToCarpools(carpools)`
- 🔄 Reassigns unmatched solo drivers as riders in existing carpools with available seats.

### `outputCarpools(carpoolsData)`
- 📤 Outputs matched carpools and unmatched riders into respective sheets.

### `formatDate(dateString)`
- 📆 Formats date strings for easy readability.

### `setupTrigger()`
- ⚙️ Sets up a Google Apps Script trigger to automatically run the script on form submissions.

---

## Setup Instructions

1. **Google Sheet Setup**:
   - 🗒️ Create a Google Sheet with the following tabs:
     - "Form Responses 2" (linked to your Google Form)
     - "Matched Carpools"
     - "Unmatched Riders"

2. **Google Apps Script**:
   - 🖋️ Open the Script Editor in the Google Sheet.
   - Paste the script into the editor.

3. **Set Up Trigger**:
   - ⏱️ Run the `setupTrigger()` function to enable real-time updates upon form submissions.

4. **Customize Form Fields**:
   - 📝 Ensure your Google Form captures the required fields:
     - Rider/Driver designation
     - Date of ride
     - Name
     - Phone number
     - Gender
     - Food preference
     - Friend preference
     - Pickup location
     - Seats available (for drivers)

---

## Usage

1. 📝 Fill out the Google Form to submit carpool data.
2. ✅ The script will automatically process the submission and update the sheets:
   - View matched carpools in the "Matched Carpools" sheet.
   - Check the "Unmatched Riders" sheet for any unmatched riders.

---

## Limitations



