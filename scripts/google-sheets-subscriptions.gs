function doPost(event) {
  const properties = PropertiesService.getScriptProperties();
  const secret = properties.getProperty("WEBHOOK_SECRET");
  let submission;
  try {
    submission = JSON.parse(event.postData.contents);
  } catch {
    return jsonResponse(false);
  }

  if (!secret || submission?.secret !== secret || submission.consent !== true) {
    return jsonResponse(false);
  }
  const email = typeof submission.email === "string" ? submission.email.trim().toLowerCase() : "";
  const createdAt = new Date(submission.createdAt);
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !Number.isFinite(createdAt.getTime())) {
    return jsonResponse(false);
  }

  const lock = LockService.getScriptLock();
  if (!lock.tryLock(5000)) return jsonResponse(false);
  try {
    const spreadsheet = SpreadsheetApp.openById(properties.getProperty("SPREADSHEET_ID"));
    const name = "출시 알림";
    const sheet = spreadsheet.getSheetByName(name) || spreadsheet.insertSheet(name);
    const lastRow = sheet.getLastRow();
    if (lastRow === 0) sheet.appendRow(["이메일", "신청 시각 (UTC)", "수집 동의"]);

    if (lastRow > 1 && sheet.getRange(2, 1, lastRow - 1, 1)
      .createTextFinder(email).matchEntireCell(true).findNext()) {
      return jsonResponse(true);
    }

    const emailCell = email.startsWith("=") || email.startsWith("'") ? "'" + email : email;
    sheet.appendRow([emailCell, createdAt.toISOString(), true]);
    SpreadsheetApp.flush();
    return jsonResponse(true);
  } finally {
    lock.releaseLock();
  }
}

function jsonResponse(ok) {
  return ContentService.createTextOutput(JSON.stringify({ ok }))
    .setMimeType(ContentService.MimeType.JSON);
}
