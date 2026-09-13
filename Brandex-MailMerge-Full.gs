// ═════════════════════════════════════════════════════════════════════
// BRANDEX LAW ASSOCIATES — FULL MAILMERGE + WEB FORM HANDLER
// Copy this ENTIRE file into your Google Apps Script project
// Then: Deploy → Manage deployments → Edit → New version → Deploy
// ═════════════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────────────
// ⚙️ CONFIG — SIRF YAHAN CHANGE KAREIN (ek hi jagah)
// ─────────────────────────────────────────────────────────────────────
// FIX: Pehle ye 3 IDs har function ke andar ALAG SE hardcoded thi
// (4 jagah — kahin variable, kahin bilkul raw string). Is wajah se
// jab aap ek jagah ID change karte thay, baqi 3 jagah PURANI ID hi
// reh jati thi — aur script kabhi purani, kabhi nayi folder use karti
// thi (isi liye "kabhi kabhi purani shared folder" wala issue aa raha tha).
//
// AB: Sirf yahan neeche teeno values update karein — poori script
// automatically nayi value use karegi. Kahin aur ye IDs dobara mat likhein.

var MAIN_FOLDER_ID   = "1R-cQ1qYLat0DlnYKs699kXBX0zr7BZDP"; // Apni Drive ka MAIN folder ID (jahan client folders banti hain)
var TM1_TEMPLATE_ID  = "1STwQUmtknPf1TcWuK1YtEib1ZWiM1yN3tyILlVGwglg"; // TM-1 Google Doc template ki ID
var TM48_TEMPLATE_ID = "1HyQyz-_tMFIy1X1bH0-sAToZmE2QJL5NFhGUwI_vLgE"; // TM-48 Google Doc template ki ID

// ─────────────────────────────────────────────────────────────────────
// MENU
// ─────────────────────────────────────────────────────────────────────
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('🛠️ TOOLS')
    .addItem("📊 Setup Headers",    "setupSpreadsheet")
    .addItem("🔽 Setup Dropdowns",  "setupDropdowns")
    .addSeparator()
    .addItem("🎯 Process One",        "processOneApplication")
    .addToUi();
}


// ============================================================
// generateUniqueSerial — Batch Read (FAST)
// Format: PB-ISB-XXXXXXXXXXXXXXXXXX
// ============================================================
function generateUniqueSerial(sheet) {
  var prefix = "PB-ISB-";

  function makeRandom18() {
    var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    var result = "";
    for (var i = 0; i < 18; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  var lastRow = sheet.getLastRow();
  var existingSerials = {};

  if (lastRow >= 2) {
    var allSerials = sheet.getRange(2, 3, lastRow - 1, 1).getValues();
    allSerials.forEach(function(rowArr) {
      var val = rowArr[0];
      if (val) existingSerials[val.toString().trim()] = true;
    });
  }

  var attempts = 0;
  var newSerial;
  do {
    newSerial = prefix + makeRandom18();
    attempts++;
  } while (existingSerials[newSerial] && attempts < 10);

  return newSerial;
}


// ============================================================
// processAllApplications — Bulk
// ============================================================
function processAllApplications() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Sheet1");

  // FIX: duplicate local ID declaration removed — ab MAIN_FOLDER_ID/TM1_TEMPLATE_ID/TM48_TEMPLATE_ID top ke CONFIG se aa rahi hain (ek hi jagah se).

  try {
    var lastRow = sheet.getLastRow();
    var processRows = [];

    for (var row = 2; row <= lastRow; row++) {
      var processStatus = sheet.getRange(row, 1).getValue();
      var triggerStatus = sheet.getRange(row, 2).getValue();

      if (
        processStatus && processStatus.toString().trim() === "START 💫" &&
        triggerStatus  && triggerStatus.toString().trim()  === "STAGE 1"
      ) {
        processRows.push(row);
      }
    }

    if (processRows.length === 0) {
      SpreadsheetApp.getUi().alert(
        "No Applications Found",
        "❌ Koi application nahi mili jis mein 'START 💫' aur 'STAGE 1' ho.",
        SpreadsheetApp.getUi().ButtonSet.OK
      );
      return;
    }

    var confirmMsg =
      "Found " + processRows.length + " applications.\n\nRows: " +
      processRows.join(", ") + "\n\nProceed?";
    var response = SpreadsheetApp.getUi().alert(
      "Confirm Bulk Processing", confirmMsg, SpreadsheetApp.getUi().ButtonSet.YES_NO
    );
    if (response !== SpreadsheetApp.getUi().Button.YES) return;

    var successCount = 0;
    var errorCount   = 0;

    for (var i = 0; i < processRows.length; i++) {
      var currentRow = processRows[i];
      try {
        sheet.getRange(currentRow, 1).setValue("ON IT 👉");
        SpreadsheetApp.flush();

        processRow(sheet, currentRow, MAIN_FOLDER_ID, TM1_TEMPLATE_ID, TM48_TEMPLATE_ID);
        sheet.getRange(currentRow, 1).setValue("DONE ✅");
        successCount++;
      } catch (error) {
        Logger.log("❌ Row " + currentRow + " error: " + error.toString());
        // FIX: pehle yahan "START 💫" set hota tha — matlab lagta tha row
        // kabhi process hi nahi hui. Ab "ERROR ❌" set hoga taake failed
        // rows clearly nazar aayein aur "not-yet-started" rows se alag pehchani ja sakein.
        sheet.getRange(currentRow, 1).setValue("ERROR ❌");
        SpreadsheetApp.getUi().alert(
          "Error in Row " + currentRow,
          error.message,
          SpreadsheetApp.getUi().ButtonSet.OK
        );
        errorCount++;
      }

      if (i < processRows.length - 1) Utilities.sleep(500);
    }

    var summary =
      "✅ Processing Complete!\n\n" +
      "Successfully processed: " + successCount + "\n" +
      (errorCount > 0 ? "Errors: " + errorCount + "\n" : "") +
      "\nCheck your Drive folder for documents.";
    SpreadsheetApp.getUi().alert("Results", summary, SpreadsheetApp.getUi().ButtonSet.OK);

  } catch (error) {
    Logger.log("Critical error: " + error.toString());
    SpreadsheetApp.getUi().alert("Critical Error", "❌ " + error.message, SpreadsheetApp.getUi().ButtonSet.OK);
  }
}


// ============================================================
// processOneApplication
// ============================================================
function processOneApplication() {
  var ss    = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Sheet1");

  // FIX: duplicate local ID declaration removed — ab MAIN_FOLDER_ID/TM1_TEMPLATE_ID/TM48_TEMPLATE_ID top ke CONFIG se aa rahi hain (ek hi jagah se).

  try {
    var lastRow = sheet.getLastRow();
    for (var row = 2; row <= lastRow; row++) {
      var processStatus = sheet.getRange(row, 1).getValue();
      var triggerStatus = sheet.getRange(row, 2).getValue();

      if (
        processStatus && processStatus.toString().trim() === "START 💫" &&
        triggerStatus  && triggerStatus.toString().trim()  === "STAGE 1"
      ) {
        sheet.getRange(row, 1).setValue("ON IT 👉");
        SpreadsheetApp.flush();

        processRow(sheet, row, MAIN_FOLDER_ID, TM1_TEMPLATE_ID, TM48_TEMPLATE_ID);
        sheet.getRange(row, 1).setValue("DONE ✅");

        SpreadsheetApp.getUi().alert(
          "Done",
          "✅ Row " + row + " successfully processed!",
          SpreadsheetApp.getUi().ButtonSet.OK
        );
        return;
      }
    }

    SpreadsheetApp.getUi().alert(
      "Not Found",
      "❌ Koi eligible application nahi mili.",
      SpreadsheetApp.getUi().ButtonSet.OK
    );
  } catch (error) {
    Logger.log("processOneApplication error: " + error.toString());
    // FIX: pehle yahan row ka status RESET NAHI hota tha — agar processRow()
    // beech mein fail ho jati, row hamesha "ON IT 👉" par hi atki reh jati thi,
    // aur lagta tha abhi bhi process ho raha hai. Ab clearly "ERROR ❌" set hoga.
    try {
      if (typeof row !== "undefined") sheet.getRange(row, 1).setValue("ERROR ❌");
    } catch (e2) {}
    SpreadsheetApp.getUi().alert("Error", "❌ " + error.message, SpreadsheetApp.getUi().ButtonSet.OK);
  }
}


// ============================================================
// getOrCreateClientFolder — SHARED FIX
// ------------------------------------------------------------
// PURPOSE: Pehle ye function EXISTING folder (same naam) DHOONDTA
// hai. Agar mil jaye to WAHI reuse karta hai. Agar na mile, tab
// hi NAYI folder banata hai.
//
// KYUN ZAROORI HAI: Google Drive ka "createFolder()" kabhi bhi
// duplicate naam par ERROR nahi deta — ye chup chap ek ALAG NAYI
// folder bana deta hai, chahe usi naam ki folder pehle se maujood
// ho. Purane code mein "try { createFolder() } catch { find }"
// likha tha — lekin createFolder() kabhi throw hi nahi karta, is
// liye "catch" wala find-existing hissa kabhi chalta hi nahi tha.
// NATEEJA: har submission par ek NAYI duplicate-naam folder ban
// rahi thi, aur upload ki gayi image usi NAYI (duplicate) folder
// ke andar chali jati thi — jo folder aap check kar rahe thay
// (purani wali), uske andar kabhi image aati hi nahi thi.
// ============================================================
function getOrCreateClientFolder(parentFolder, rawFolderName) {
  // Drive folder names mein invalid characters (\ / : * ? " < > |)
  // sanitize kiye ja rahe hain — taake filename aur folder name
  // dono hamesha match karein.
  var folderName = (rawFolderName || "UNTITLED").toString()
    .replace(/[\\/:*?"<>|]/g, "_").trim();

  var existing = parentFolder.getFoldersByName(folderName);
  if (existing.hasNext()) {
    return existing.next(); // ✅ EXISTING folder reuse — koi duplicate nahi banega
  }
  return parentFolder.createFolder(folderName); // Sirf tab banao jab pehle se na ho
}


// ============================================================
// processRow — Sheet menu path (existing image ID from Col T)
// ============================================================
function processRow(sheet, row, mainFolderId, tm1TemplateId, tm48TemplateId) {
  try {
    var rowData = getRowData(sheet, row);
    validateRequiredData(rowData, row);

    if (!rowData.serialNo || rowData.serialNo.toString().trim() === "") {
      rowData.serialNo = generateUniqueSerial(sheet);
      sheet.getRange(row, 3).setValue(rowData.serialNo);
    }

    if (!rowData.date) {
      rowData.date = Utilities.formatDate(new Date(), "Asia/Karachi", "EEEE, dd MMMM yyyy");
      sheet.getRange(row, 6).setValue(rowData.date);
    }

    var parentFolder;
    try {
      parentFolder = DriveApp.getFolderById(mainFolderId);
      parentFolder.getName();
    } catch (folderErr) {
      throw new Error(
        "❌ MAIN FOLDER ID GALAT YA INACCESSIBLE HAI!\n" +
        "ID: " + mainFolderId + "\n" +
        "Row: " + row
      );
    }

    // FIX: ab getOrCreateClientFolder() use ho raha hai (upar dekhein)
    // taake purani wali GENERATED folder hi reuse ho, nayi duplicate na bane.
    var newFolder = getOrCreateClientFolder(parentFolder, rowData.folder);

    var tmImageBlob = getImageFromDriveId(rowData.img);
    generateDocuments(rowData, newFolder, tm1TemplateId, tm48TemplateId, tmImageBlob);

    Logger.log("✅ Row " + row + " processed: " + rowData.folder);
  } catch (error) {
    Logger.log("❌ processRow error row " + row + ": " + error.toString());
    throw error;
  }
}


// ============================================================
// getRowData
// ============================================================
function getRowData(sheet, row) {
  var range  = sheet.getRange(row, 1, 1, 21);
  var values = range.getValues()[0];

  var dateVal = values[5];
  if (dateVal instanceof Date) {
    dateVal = Utilities.formatDate(dateVal, "Asia/Karachi", "EEEE, dd MMMM yyyy");
  } else if (dateVal) {
    dateVal = dateVal.toString();
  }

  var issueDateVal = values[12];
  if (issueDateVal instanceof Date) {
    issueDateVal = Utilities.formatDate(issueDateVal, "Asia/Karachi", "dd-MMM-yyyy, hh:mm:ss a").toUpperCase();
  } else if (issueDateVal) {
    issueDateVal = issueDateVal.toString();
  }

  var expiryDateVal = values[13];
  if (expiryDateVal instanceof Date) {
    expiryDateVal = Utilities.formatDate(expiryDateVal, "Asia/Karachi", "dd-MMM-yyyy, hh:mm:ss a").toUpperCase();
  } else if (expiryDateVal) {
    expiryDateVal = expiryDateVal.toString();
  }

  var classNumber    = values[6] ? parseInt(values[6].toString().replace(/\D/g, "")) : 0;
  var goodsServices  = (classNumber >= 1 && classNumber <= 34) ? "GOODS" : "SERVICES";

  return {
    process:    values[0],
    trigger:    values[1],
    serialNo:   values[2],
    tm:         values[3],
    folder:     values[4],
    date:       dateVal,
    classNo:    values[6],
    classDesc:  values[7],
    appType:    values[8],
    appName:    values[9],
    appSo:      values[10],
    appCnic:    values[11],
    issueDate:  issueDateVal,
    expiryDate: expiryDateVal,
    appTrade:   values[14],
    appAdd:     values[15],
    year:       values[16],
    conName:    values[17],
    conAdd:     values[18],
    img:        values[19],
    noImg:      values[20] || "[NO IMAGE PROVIDED]",
    goodsServices: goodsServices
  };
}


function validateRequiredData(rowData, row) {
  var missing = [];
  if (!rowData.folder)  missing.push("FOLDER (Col E)");
  if (!rowData.classNo) missing.push("CLASS (Col G)");
  if (!rowData.appType) missing.push("APP-TYPE (Col I)");
  if (!rowData.appName) missing.push("APP-NAME (Col J)");

  if (missing.length > 0) {
    throw new Error("Row " + row + " — Missing: " + missing.join(", "));
  }
}


function getImageFromDriveId(imageId) {
  try {
    if (!imageId || imageId.toString().trim() === "") return null;

    var cleanId = imageId.toString().trim();

    if (cleanId.indexOf("drive.google.com") !== -1) {
      var match = cleanId.match(/[-\w]{25,}/);
      if (match) cleanId = match[0];
      else return null;
    }

    var file     = DriveApp.getFileById(cleanId);
    var mimeType = file.getMimeType();

    if (!mimeType.startsWith("image/")) return null;

    return file.getBlob();
  } catch (error) {
    Logger.log("❌ getImageFromDriveId error: " + error.toString());
    return null;
  }
}


function generateDocuments(rowData, folder, tm1TemplateId, tm48TemplateId, imageBlob) {
  var mergeData = {
    "{{SERIAL}}":        rowData.serialNo    || "",
    "{{TM}}":            rowData.tm          || "",
    "{{CLASS}}":         rowData.classNo     || "",
    "{{CLASS_DESC}}":    rowData.classDesc   || "",
    "{{APP_TYPE}}":      rowData.appType     || "",
    "{{APP_NAME}}":      rowData.appName     || "",
    "{{APP_SO}}":        rowData.appSo       || "",
    "{{APP_CNIC}}":      rowData.appCnic     || "",
    "{{ISSUE_DATE}}":    rowData.issueDate   || "",
    "{{EXPIRY_DATE}}":   rowData.expiryDate  || "",
    "{{APP_TRADE}}":     rowData.appTrade    || "",
    "{{APP_ADD}}":       rowData.appAdd      || "",
    "{{YEAR}}":          rowData.year        || "",
    "{{CON_NAME}}":      rowData.conName     || "",
    "{{CON_ADD}}":       rowData.conAdd      || "",
    "{{GOODS_SERVICES}}":rowData.goodsServices,
    "{{DATE}}":          rowData.date        || "",
    "{{FOLDER}}":        rowData.folder      || ""
  };

  if (tm1TemplateId) {
    generateWordDoc(
      tm1TemplateId, folder, rowData.folder + " - TM-1",
      mergeData, imageBlob, "{{IMAGE}}", rowData.noImg, "TM1_TEMPLATE_ID"
    );
  }

  if (tm48TemplateId) {
    generateWordDoc(
      tm48TemplateId, folder, rowData.folder + " - TM-48",
      mergeData, imageBlob, "{{IMAGE}}", rowData.noImg, "TM48_TEMPLATE_ID"
    );
  }
}


function generateWordDoc(templateId, folder, docName, mergeData, imageBlob, imagePlaceholder, fallbackText, templateLabel) {
  try {
    var templateFile;
    try {
      templateFile = DriveApp.getFileById(templateId);
    } catch (templateErr) {
      throw new Error(
        "❌ TEMPLATE ID GALAT YA INACCESSIBLE HAI!\n" +
        "Template: " + (templateLabel || "UNKNOWN") + "\n" +
        "ID: " + templateId
      );
    }

    var doc      = templateFile.makeCopy(docName, folder);
    var document = DocumentApp.openById(doc.getId());
    var body     = document.getBody();

    for (var key in mergeData) {
      body.replaceText(escapeRegex(key), (mergeData[key] || "").toString());
    }

    if (imageBlob) {
      var imageInserted = replaceTextWithImage(body, imagePlaceholder, imageBlob);
      if (!imageInserted) {
        body.replaceText(escapeRegex(imagePlaceholder), fallbackText || "[IMAGE FAILED]");
      }
    } else {
      body.replaceText(escapeRegex(imagePlaceholder), fallbackText || "[NO IMAGE PROVIDED]");
    }

    document.saveAndClose();
    Logger.log("✅ Generated: " + docName);
  } catch (error) {
    Logger.log("❌ generateWordDoc failed [" + docName + "]: " + error.toString());
    throw error;
  }
}


function replaceTextWithImage(body, placeholder, imageBlob) {
  try {
    var searchResult = body.findText(escapeRegex(placeholder));
    if (!searchResult) return false;

    var textElement = searchResult.getElement();
    var parent      = textElement.getParent();
    var childIndex  = parent.getChildIndex(textElement);

    parent.removeChild(textElement);
    var image = parent.insertInlineImage(childIndex, imageBlob);
    image.setWidth(200);
    image.setHeight(200);
    return true;
  } catch (error) {
    Logger.log("❌ replaceTextWithImage error: " + error.toString());
    return false;
  }
}


function escapeRegex(str) {
  return str.replace(/[{}]/g, "\\$&");
}


function setupSpreadsheet() {
  var sheet = SpreadsheetApp.getActiveSheet();
  var headers = [
    "STATUS", "STAGE", "SR NO", "TM-NO", "NAME", "DATE L",
    "CLASS", "CLASS-DESC", "APP-TYPE", "APP-NAME",
    "APP-SO", "APP-CNIC", "ISSUE-DATE", "EXPIRY-DATE",
    "APP-TRADE", "APP-ADD", "YEAR", "CON-NAME", "CON-ADD",
    "IMG", "NO-IMG"
  ];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(1, 1, 1, headers.length)
    .setBackground("#1a1a2e").setFontColor("#e94560").setFontWeight("bold");
  SpreadsheetApp.getUi().alert("Setup Complete", "✅ Headers set (21 columns A–U).", SpreadsheetApp.getUi().ButtonSet.OK);
}


function setupDropdowns() {
  var sheet   = SpreadsheetApp.getActiveSheet();
  var lastRow = Math.max(sheet.getLastRow(), 100);
  try {
    sheet.getRange(2, 1, lastRow - 1, 1).setDataValidation(
      // FIX: "ERROR ❌" add ki gayi — ab fail hone par row is status par
      // clearly ruk jayegi, na ke "ON IT" par atki rahegi ya chup chap
      // "START" par wapas chali jaye.
      SpreadsheetApp.newDataValidation().requireValueInList(["START 💫", "ON IT 👉", "DONE ✅", "ERROR ❌"]).setAllowInvalid(false).build()
    );
    sheet.getRange(2, 2, lastRow - 1, 1).setDataValidation(
      SpreadsheetApp.newDataValidation().requireValueInList(["STAGE 1"]).setAllowInvalid(false).build()
    );
    sheet.getRange(2, 9, lastRow - 1, 1).setDataValidation(
      SpreadsheetApp.newDataValidation().requireValueInList(["SOLE PROPRIETOR", "PARTNERS", "A PAKISTANI COMPANY"]).setAllowInvalid(false).build()
    );
    sheet.getRange(2, 17, lastRow - 1, 1).setDataValidation(
      SpreadsheetApp.newDataValidation().requireValueInList(["2022", "2023", "2024", "2025", "2026"]).setAllowInvalid(false).build()
    );
    SpreadsheetApp.getUi().alert("Dropdowns Ready", "✅ Dropdowns set.", SpreadsheetApp.getUi().ButtonSet.OK);
  } catch (error) {
    SpreadsheetApp.getUi().alert("Error", "❌ " + error.message, SpreadsheetApp.getUi().ButtonSet.OK);
  }
}


// FIX: "Upload TM Image" sidebar tool (showImageUploader + uploadToDrive +
// writeImageIdToSheet) yahan se HATA DIYA GAYA hai — client ke mutabiq
// ab sheet mein manual kaam nahi hota, sab kuch web form se hota hai.
// Ye purani sidebar bhi asal mein image ko MAIN folder ke root mein daalti
// thi (client folder ke andar nahi) — is liye inconsistent bhi thi.
// Agar kabhi dobara zaroorat pare, purani copy Claude conversation history
// mein maujood hai.


// ═════════════════════════════════════════════════════════════════════
// WEB FORM HANDLER (doPost)
// Image is saved INSIDE the generated client folder as FOLDERNAME_logo.ext
// ═════════════════════════════════════════════════════════════════════

function doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents || "{}");

    if (body.action === "generateFromForm") {
      var result = processFormSubmission(body);
      return jsonResponse({
        ok: true,
        serialNo: result.serialNo,
        row: result.row,
        folderUrl: result.folderUrl,
        tm1Url: result.tm1Url,
        tm48Url: result.tm48Url,
        imageWarning: result.imageWarning || "" // FIX: frontend ab is field ko dikha sakta hai
      });
    }

    return jsonResponse({ ok: false, error: "Unknown action" });
  } catch (err) {
    return jsonResponse({ ok: false, error: String(err.message || err) });
  }
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function processFormSubmission(data) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Sheet1");
  if (!sheet) throw new Error("Sheet1 not found");

  // FIX: duplicate local ID declaration removed — ab MAIN_FOLDER_ID/TM1_TEMPLATE_ID/TM48_TEMPLATE_ID top ke CONFIG se aa rahi hain (ek hi jagah se).

  var lastRow = sheet.getLastRow() + 1;
  var serial  = generateUniqueSerial(sheet);
  var today   = Utilities.formatDate(new Date(), "Asia/Karachi", "EEEE, dd MMMM yyyy");

  var rowValues = [
    "START 💫", "STAGE 1", serial,
    data.tm || "", data.folder || "", today,
    data.classNo || "", data.classDesc || "", data.appType || "",
    data.appName || "", data.appSo || "", data.appCnic || "",
    data.issueDate || "", data.expiryDate || "", data.appTrade || "",
    data.appAdd || "", data.year || "", data.conName || "", data.conAdd || "",
    "", // T - imageId filled after upload into client folder
    data.noImg || "[NO IMAGE PROVIDED]"
  ];
  sheet.getRange(lastRow, 1, 1, 21).setValues([rowValues]);

  sheet.getRange(lastRow, 1).setValue("ON IT 👉");
  SpreadsheetApp.flush();

  // FIX: pehle agar processRowAndReturnLinks() beech mein fail ho jati
  // (missing field, folder issue, wagera), row hamesha "ON IT 👉" par
  // hi atki reh jati thi — dikhta tha jese abhi bhi process ho raha hai,
  // jabke woh fail ho chuki hoti thi. Ab clearly "ERROR ❌" set hoga.
  var processResult;
  try {
    processResult = processRowAndReturnLinks(
      sheet, lastRow, MAIN_FOLDER_ID, TM1_TEMPLATE_ID, TM48_TEMPLATE_ID, data
    );
  } catch (procErr) {
    sheet.getRange(lastRow, 1).setValue("ERROR ❌");
    throw procErr; // doPost() ka catch ise pakar kar frontend ko error dikha dega
  }

  sheet.getRange(lastRow, 1).setValue("DONE ✅");

  return {
    serialNo: serial,
    row: lastRow,
    folderUrl: processResult.folderUrl,
    tm1Url: processResult.tm1Url,
    tm48Url: processResult.tm48Url,
    imageWarning: processResult.imageWarning // FIX: forward to doPost()
  };
}

function processRowAndReturnLinks(sheet, row, mainFolderId, tm1TemplateId, tm48TemplateId, formData) {
  var rowData = getRowData(sheet, row);
  validateRequiredData(rowData, row);

  if (!rowData.serialNo || rowData.serialNo.toString().trim() === "") {
    rowData.serialNo = generateUniqueSerial(sheet);
    sheet.getRange(row, 3).setValue(rowData.serialNo);
  }
  if (!rowData.date) {
    rowData.date = Utilities.formatDate(new Date(), "Asia/Karachi", "EEEE, dd MMMM yyyy");
    sheet.getRange(row, 6).setValue(rowData.date);
  }

  var parentFolder = DriveApp.getFolderById(mainFolderId);
  // FIX: getOrCreateClientFolder() pehle EXISTING folder dhoondta hai,
  // sirf na milne par NAYI banata hai — is se duplicate-naam folders
  // banna band ho jayenge aur image hamesha SAHI (asal) folder mein jayegi.
  var newFolder = getOrCreateClientFolder(parentFolder, rowData.folder);

  // ========== IMAGE → CLIENT FOLDER + FOLDER NAME AS FILENAME ==========
  var imageId = "";
  var tmImageBlob = null;
  var imageWarning = ""; // FIX: agar image save fail ho to ye user tak jayega (pehle sirf Logger mein chup jata tha)

  if (formData && formData.imageBase64) {
    try {
      var base64 = formData.imageBase64.split(",")[1];
      var bytes  = Utilities.base64Decode(base64);
      var ext = "jpg";
      if (formData.imageMime) {
        if (formData.imageMime.indexOf("png") !== -1) ext = "png";
        else if (formData.imageMime.indexOf("gif") !== -1) ext = "gif";
        else if (formData.imageMime.indexOf("webp") !== -1) ext = "webp";
      }
      var safeName = (rowData.folder || "trademark").toString().replace(/[\\/:*?"<>|]/g, "_").trim();
      var imageFileName = safeName + "_logo." + ext;

      var blob = Utilities.newBlob(bytes, formData.imageMime || "image/jpeg", imageFileName);
      var file = newFolder.createFile(blob); // INSIDE client folder
      // FIX (confidentiality + speed): pehle yahan file.setSharing(ANYONE_WITH_LINK)
      // call hoti thi — matlab client ka trademark logo "kisi bhi link rakhne
      // wale" ke liye public view-able ban jata tha, filing se pehle hi. Ye
      // ek IP-confidentiality risk hai aur ek extra Drive API call (thora slow
      // bhi karta hai). Image doc ke andar embed ho hi jati hai — is liye
      // alag se public sharing ki zaroorat nahi. Hata diya.
      imageId = file.getId();
      tmImageBlob = blob;
      sheet.getRange(row, 20).setValue(imageId); // Col T

      Logger.log("✅ Image saved INSIDE client folder: " + newFolder.getName() +
                 " | File: " + imageFileName + " | ID: " + imageId);
    } catch (imgErr) {
      // FIX: ab error sirf Logger mein chup nahi jayega — ye variable
      // return value ke through frontend tak pohanchega (neeche return statement dekhein).
      imageWarning = "⚠️ Image upload folder ke andar save NAHI ho saki: " + imgErr;
      Logger.log("❌ Image upload failed: " + imgErr);
    }
  } else if (rowData.img) {
    tmImageBlob = getImageFromDriveId(rowData.img);
  }
  // ======================================================================

  var mergeData = {
    "{{SERIAL}}": rowData.serialNo || "",
    "{{TM}}": rowData.tm || "",
    "{{CLASS}}": rowData.classNo || "",
    "{{CLASS_DESC}}": rowData.classDesc || "",
    "{{APP_TYPE}}": rowData.appType || "",
    "{{APP_NAME}}": rowData.appName || "",
    "{{APP_SO}}": rowData.appSo || "",
    "{{APP_CNIC}}": rowData.appCnic || "",
    "{{ISSUE_DATE}}": rowData.issueDate || "",
    "{{EXPIRY_DATE}}": rowData.expiryDate || "",
    "{{APP_TRADE}}": rowData.appTrade || "",
    "{{APP_ADD}}": rowData.appAdd || "",
    "{{YEAR}}": rowData.year || "",
    "{{CON_NAME}}": rowData.conName || "",
    "{{CON_ADD}}": rowData.conAdd || "",
    "{{GOODS_SERVICES}}": rowData.goodsServices,
    "{{DATE}}": rowData.date || "",
    "{{FOLDER}}": rowData.folder || ""
  };

  var tm1Doc = null, tm48Doc = null;
  if (tm1TemplateId) {
    tm1Doc = generateWordDocReturn(tm1TemplateId, newFolder, rowData.folder + " - TM-1",
      mergeData, tmImageBlob, "{{IMAGE}}", rowData.noImg, "TM1_TEMPLATE_ID");
  }
  if (tm48TemplateId) {
    tm48Doc = generateWordDocReturn(tm48TemplateId, newFolder, rowData.folder + " - TM-48",
      mergeData, tmImageBlob, "{{IMAGE}}", rowData.noImg, "TM48_TEMPLATE_ID");
  }

  return {
    folderUrl: newFolder.getUrl(),
    tm1Url: tm1Doc ? tm1Doc.getUrl() : null,
    tm48Url: tm48Doc ? tm48Doc.getUrl() : null,
    imageWarning: imageWarning // FIX: empty string agar sab theek, warna warning message
  };
}

function generateWordDocReturn(templateId, folder, docName, mergeData, imageBlob, imagePlaceholder, fallbackText, templateLabel) {
  var templateFile = DriveApp.getFileById(templateId);
  var doc = templateFile.makeCopy(docName, folder);
  var document = DocumentApp.openById(doc.getId());
  var body = document.getBody();

  for (var key in mergeData) {
    body.replaceText(escapeRegex(key), (mergeData[key] || "").toString());
  }

  if (imageBlob) {
    var inserted = replaceTextWithImage(body, imagePlaceholder, imageBlob);
    if (!inserted) {
      body.replaceText(escapeRegex(imagePlaceholder), fallbackText || "[IMAGE FAILED]");
    }
  } else {
    body.replaceText(escapeRegex(imagePlaceholder), fallbackText || "[NO IMAGE PROVIDED]");
  }

  document.saveAndClose();
  return doc;
}
