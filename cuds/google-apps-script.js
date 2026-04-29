// Google Apps Script - Copy and paste this into Google Apps Script editor
// This script should be deployed as a web app and assigned to a Google Sheet

function doPost(e) {
  try {
    if (!e || !e.postData) {
      return HtmlService.createHtmlOutput(JSON.stringify({ success: false, error: 'Invalid request' })).setContentType('application/json');
    }
    const data = JSON.parse(e.postData.contents);
    const { surveyValues, members } = data;

    // Get or create the spreadsheet
    const sheet = SpreadsheetApp.getActiveSheet();
    
    // Initialize headers if the sheet is empty
    if (sheet.getLastRow() === 0) {
      const headers = [
        'Timestamp',
        'Province',
        'City',
        'Barangay',
        'Address',
        'Respondent Name',
        'Respondent Contact Number',
        'Household Head',
        'Household Head Contact Number',
        'Total Members',
        'Member Name',
        'Relationship',
        'Sex',
        'Age',
        'Marital Status',
        'Highest Education',
        'Currently Enrolled',
        'School Level',
        'Place of School',
        'Occupation',
        'Monthly Income',
        'Source of Income',
        'Place of Work',
        'Status of Work',
        'Registered Barangay'
      ];
      sheet.appendRow(headers);
    }

    // Process each household member
    members.forEach((member) => {
      const row = [
        new Date().toISOString(),
        surveyValues.province,
        surveyValues.city,
        surveyValues.barangay,
        surveyValues.address,
        surveyValues.respondent,
        surveyValues.contactNumber,
        surveyValues.householdHead,
        surveyValues.householdHeadContact || '',
        surveyValues.householdMembers,
        member.name,
        member.relationship,
        member.sex,
        member.age,
        member.maritalStatus || '',
        member.highestEducation || '',
        member.enrolled || '',
        member.schoolLevel || '',
        member.placeOfSchool || '',
        member.occupation || '',
        member.monthlyIncome || '',
        member.sourceOfIncome || '',
        member.placeOfWork || '',
        member.workStatus || '',
        member.registeredBarangay || ''
      ];
      sheet.appendRow(row);
    });

    // Format the sheet (make header bold)
    const headerRange = sheet.getRange(1, 1, 1, sheet.getLastColumn());
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#4472C4');
    headerRange.setFontColor('#FFFFFF');

    // Auto-resize columns
    for (let i = 1; i <= sheet.getLastColumn(); i++) {
      sheet.autoResizeColumn(i);
    }

    return HtmlService.createHtmlOutput(JSON.stringify({ success: true, message: 'Survey data saved successfully' }));

  } catch (error) {
    Logger.log('Error: ' + error.toString());
    return HtmlService.createHtmlOutput(JSON.stringify({ success: false, error: error.toString() }));
  }
}

function doGet() {
  return ContentService.createTextOutput(
    JSON.stringify({ message: 'Survey submission endpoint. Use POST method.' })
  ).setMimeType(ContentService.MimeType.JSON);
}
