// ═════════════════════════════════════════════════════════════════════
// BRANDEX LAW ASSOCIATES — FULL MAILMERGE + WEB FORM HANDLER
// Copy this ENTIRE file into your Google Apps Script project
// Then: Deploy → Manage deployments → Edit → New version → Deploy
// ═════════════════════════════════════════════════════════════════════

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

  var MAIN_FOLDER_ID   = "1PI-Znj4HIm6SJ0fNeUeK_p01iUckTg8H";
  var TM1_TEMPLATE_ID  = "1XE42w12VjBMUW7jdvRU-HHdhmFd6yTB7HtL6H27FCnE";
  var TM48_TEMPLATE_ID = "1EDAbs37UZekCrrNn3JKYWZcjMiuBW6bDUsfTg5AVAhc";

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
        sheet.getRange(currentRow, 1).setValue("START 💫");
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

  var MAIN_FOLDER_ID   = "1PI-Znj4HIm6SJ0fNeUeK_p01iUckTg8H";
  var TM1_TEMPLATE_ID  = "1XE42w12VjBMUW7jdvRU-HHdhmFd6yTB7HtL6H27FCnE";
  var TM48_TEMPLATE_ID = "1EDAbs37UZekCrrNn3JKYWZcjMiuBW6bDUsfTg5AVAhc";

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
    SpreadsheetApp.getUi().alert("Error", "❌ " + error.message, SpreadsheetApp.getUi().ButtonSet.OK);
  }
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

    var newFolder;
    try {
      newFolder = parentFolder.createFolder(rowData.folder);
    } catch (e) {
      var folders = parentFolder.getFoldersByName(rowData.folder);
      newFolder   = folders.hasNext() ? folders.next() : null;
      if (!newFolder) throw new Error("Folder create/find nahi hua: " + rowData.folder);
    }

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
      SpreadsheetApp.newDataValidation().requireValueInList(["START 💫", "ON IT 👉", "DONE ✅"]).setAllowInvalid(false).build()
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


// Sidebar helpers (optional)
function showImageUploader() {
  var html = HtmlService.createHtmlOutputFromFile("ImageUploader")
    .setTitle("📤 Upload TM Image").setWidth(380);
  SpreadsheetApp.getUi().showSidebar(html);
}

function uploadToDrive(base64Data, fileName, mimeType, rowNumber) {
  var base64 = base64Data.split(",")[1];
  var bytes  = Utilities.base64Decode(base64);
  var sheet  = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Sheet1");
  var targetFolder = DriveApp.getFolderById("1PI-Znj4HIm6SJ0fNeUeK_p01iUckTg8H");
  var safeName = "trademark";

  if (sheet && rowNumber) {
    var rowData = getRowData(sheet, rowNumber);
    if (rowData.folder) {
      targetFolder = getOrCreateFolder(targetFolder, rowData.folder);
      safeName = rowData.folder;
    }
  }

  var logoFolder = getOrCreateFolder(targetFolder, "Logo");
  var ext = getImageExtension(mimeType, fileName);
  var imageFileName = sanitizeDriveName(safeName || fileName || "trademark") + "_logo." + ext;
  var blob = Utilities.newBlob(bytes, mimeType || "image/jpeg", imageFileName);
  var file = logoFolder.createFile(blob);
  try { file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW); } catch(e){}
  return file.getId();
}

function writeImageIdToSheet(rowNumber, fileId) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Sheet1");
  sheet.getRange(rowNumber, 20).setValue(fileId);
  return true;
}


// ═════════════════════════════════════════════════════════════════════
// WEB FORM HANDLER (doPost)
// Image is saved INSIDE generated client folder > Logo as FOLDERNAME_logo.ext
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
        tm48Url: result.tm48Url
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

  var MAIN_FOLDER_ID   = "1PI-Znj4HIm6SJ0fNeUeK_p01iUckTg8H";
  var TM1_TEMPLATE_ID  = "1XE42w12VjBMUW7jdvRU-HHdhmFd6yTB7HtL6H27FCnE";
  var TM48_TEMPLATE_ID = "1EDAbs37UZekCrrNn3JKYWZcjMiuBW6bDUsfTg5AVAhc";

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

  var processResult = processRowAndReturnLinks(
    sheet, lastRow, MAIN_FOLDER_ID, TM1_TEMPLATE_ID, TM48_TEMPLATE_ID, data
  );

  sheet.getRange(lastRow, 1).setValue("DONE ✅");

  return {
    serialNo: serial,
    row: lastRow,
    folderUrl: processResult.folderUrl,
    tm1Url: processResult.tm1Url,
    tm48Url: processResult.tm48Url
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

  try {
    var parentFolder = DriveApp.getFolderById(mainFolderId);
    parentFolder.getName();
  } catch (folderErr) {
    throw new Error("Main Drive folder inaccessible. Check Apps Script Drive permission and MAIN_FOLDER_ID: " + mainFolderId);
  }

  var newFolder = getOrCreateFolder(parentFolder, rowData.folder);

  // ========== IMAGE → CLIENT FOLDER / LOGO + FOLDER NAME AS FILENAME ==========
  var imageId = "";
  var tmImageBlob = null;

  if (formData && formData.imageBase64) {
    try {
      var base64 = formData.imageBase64.split(",")[1];
      var bytes  = Utilities.base64Decode(base64);
      var ext = getImageExtension(formData.imageMime, formData.imageName);
      var logoFolder = getOrCreateFolder(newFolder, "Logo");
      var safeName = sanitizeDriveName(rowData.folder || "trademark");
      var imageFileName = safeName + "_logo." + ext;

      var blob = Utilities.newBlob(bytes, formData.imageMime || "image/jpeg", imageFileName);
      var file = logoFolder.createFile(blob); // INSIDE client folder > Logo
      try { file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW); } catch (e) {}
      imageId = file.getId();
      tmImageBlob = blob;
      sheet.getRange(row, 20).setValue(imageId); // Col T

      Logger.log("✅ Image saved inside client Logo folder: " + newFolder.getName() +
                 " | File: " + imageFileName + " | ID: " + imageId);
    } catch (imgErr) {
      Logger.log("Image upload failed: " + imgErr);
      throw new Error("Logo upload failed. Check Drive permission/folder access. " + (imgErr.message || imgErr));
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
    tm48Url: tm48Doc ? tm48Doc.getUrl() : null
  };
}

function sanitizeDriveName(name) {
  var cleaned = (name || "trademark").toString().replace(/[\\/:*?"<>|]/g, "_").trim();
  return cleaned || "trademark";
}

function getImageExtension(mimeType, fileName) {
  var mime = (mimeType || "").toLowerCase();
  if (mime.indexOf("png") !== -1) return "png";
  if (mime.indexOf("gif") !== -1) return "gif";
  if (mime.indexOf("webp") !== -1) return "webp";
  if (mime.indexOf("jpeg") !== -1 || mime.indexOf("jpg") !== -1) return "jpg";

  var match = (fileName || "").toString().toLowerCase().match(/\.([a-z0-9]+)$/);
  return match ? match[1] : "jpg";
}

function getOrCreateFolder(parentFolder, folderName) {
  var safeFolderName = sanitizeDriveName(folderName);
  var folders = parentFolder.getFoldersByName(safeFolderName);
  if (folders.hasNext()) return folders.next();
  return parentFolder.createFolder(safeFolderName);
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
