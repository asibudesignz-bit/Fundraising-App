/**
 * Google Apps Script for UNIMA MAGSO Fundraising Manager
 * 
 * Instructions:
 * 1. Open your Google Sheet.
 * 2. Create three tabs: "Members", "Transactions", and "Tasks".
 * 3. In "Members", add headers: Name, Email, Reg_Number, Program, Year, Role, Total_Owed, Status
 * 4. In "Transactions", add headers: Date, Member_Name, Activity, Amount, Mode, Verified_By_Treasurer
 * 5. In "Tasks", add headers: Task_Name, Assigned_To, Due_Date, Status, Priority
 * 6. Go to Extensions > Apps Script.
 * 7. Paste this code and click Save.
 * 8. Click "Deploy" > "New Deployment".
 * 9. Select "Web App".
 * 10. Set "Execute as" to "Me" and "Who has access" to "Anyone".
 * 11. Copy the Web App URL and paste it into your .env file as VITE_GOOGLE_SCRIPT_URL.
 */

function doGet(e) {
  const sheetName = e.parameter.sheet;
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(sheetName);
  
  if (!sheet) {
    return ContentService.createTextOutput(JSON.stringify({ error: "Sheet not found" }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const rows = data.slice(1);
  
  const result = rows.map(row => {
    const obj = {};
    headers.forEach((header, index) => {
      obj[header] = row[index];
    });
    return obj;
  });
  
  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  const params = JSON.parse(e.postData.contents);
  const action = params.action;
  const sheetName = params.sheet;
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(sheetName);
  
  if (!sheet) {
    return ContentService.createTextOutput(JSON.stringify({ error: "Sheet not found" }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  if (action === "add") {
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    const newRow = headers.map(header => params.data[header] || "");
    sheet.appendRow(newRow);
    return ContentService.createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  if (action === "update") {
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    const data = sheet.getDataRange().getValues();
    const idColumnIndex = headers.indexOf(params.idField);
    
    if (idColumnIndex === -1) {
      return ContentService.createTextOutput(JSON.stringify({ error: "ID field not found" }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    for (let i = 1; i < data.length; i++) {
      if (data[i][idColumnIndex] == params.idValue) {
        const rowRange = sheet.getRange(i + 1, 1, 1, headers.length);
        const updatedRow = headers.map(header => {
          return params.data.hasOwnProperty(header) ? params.data[header] : data[i][headers.indexOf(header)];
        });
        rowRange.setValues([updatedRow]);
        return ContentService.createTextOutput(JSON.stringify({ success: true }))
          .setMimeType(ContentService.MimeType.JSON);
      }
    }
  }
  
  return ContentService.createTextOutput(JSON.stringify({ error: "Action not supported" }))
    .setMimeType(ContentService.MimeType.JSON);
}
