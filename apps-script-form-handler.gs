// ============================================================
// FORM SUBMISSION HANDLER (for Web Form)
// Copy this entire file into your existing Apps Script project
// ============================================================

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

  // ==== CONFIGURATION (same IDs you already use) ====
  var MAIN_FOLDER_ID   = "1PI-Znj4HIm6SJ0fNeUeK_p01iUckTg8H";
  var TM1_TEMPLATE_ID  = "1XE42w12VjBMUW7jdvRU-HHdhmFd6yTB7HtL6H27FCnE";
  var TM48_TEMPLATE_ID = "1EDAbs37UZekCrrNn3JKYWZcjMiuBW6bDUsfTg5AVAhc";

  // Upload image if provided
  var imageId = "";
  if (data.imageBase64) {
    var base64 = data.imageBase64.split(",")[1];
    var bytes  = Utilities.base64Decode(base64);
    var blob   = Utilities.newBlob(bytes, data.imageMime || "image/jpeg", data.imageName || "trademark.jpg");
    var folder = DriveApp.getFolderById(MAIN_FOLDER_ID);
    var file   = folder.createFile(blob);
    try {
      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    } catch (e) {}
    imageId = file.getId();
  }

  // Append new row
  var lastRow = sheet.getLastRow() + 1;
  var serial  = generateUniqueSerial(sheet);
  var today   = Utilities.formatDate(new Date(), "Asia/Karachi", "EEEE, dd MMMM yyyy");

  var rowValues = [
    "START 💫",          // A
    "STAGE 1",            // B
    serial,               // C
    data.tm || "",         // D
    data.folder || "",     // E
    today,                // F
    data.classNo || "",    // G
    data.classDesc || "",  // H
    data.appType || "",    // I
    data.appName || "",    // J
    data.appSo || "",      // K
    data.appCnic || "",    // L
    data.issueDate || "",  // M
    data.expiryDate || "", // N
    data.appTrade || "",   // O
    data.appAdd || "",     // P
    data.year || "",       // Q
    data.conName || "",    // R
    data.conAdd || "",     // S
    imageId,              // T
    data.noImg || "[NO IMAGE PROVIDED]" // U
  ];

  sheet.getRange(lastRow, 1, 1, 21).setValues([rowValues]);

  // Process
  sheet.getRange(lastRow, 1).setValue("ON IT 👉");
  SpreadsheetApp.flush();

  var processResult = processRowAndReturnLinks(sheet, lastRow, MAIN_FOLDER_ID, TM1_TEMPLATE_ID, TM48_TEMPLATE_ID);

  sheet.getRange(lastRow, 1).setValue("DONE ✅");

  return {
    serialNo: serial,
    row: lastRow,
    folderUrl: processResult.folderUrl,
    tm1Url: processResult.tm1Url,
    tm48Url: processResult.tm48Url
  };
}

function processRowAndReturnLinks(sheet, row, mainFolderId, tm1TemplateId, tm48TemplateId) {
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

  var newFolder;
  try {
    newFolder = parentFolder.createFolder(rowData.folder);
  } catch (e) {
    var folders = parentFolder.getFoldersByName(rowData.folder);
    newFolder = folders.hasNext() ? folders.next() : null;
    if (!newFolder) throw new Error("Folder create/find failed: " + rowData.folder);
  }

  var tmImageBlob = getImageFromDriveId(rowData.img);

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

  var tm1Doc = null;
  var tm48Doc = null;

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
