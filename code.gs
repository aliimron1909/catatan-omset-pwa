function doGet(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = sheet.getDataRange().getValues();
  var records = [];
  
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    if (row[0]) {
      records.push({
        id: String(row[0]),
        tanggal: formatDate(row[1]),
        siklus: Number(row[2]),
        hariKe: Number(row[3]),
        omsetKotor: Number(row[4]),
        tabungan: Number(row[5]),
        pengeluaran: Number(row[6]),
        catatanPengeluaran: String(row[7] || '')
      });
    }
  }
  
  return ContentService.createTextOutput(JSON.stringify({ status: 'success', records: records }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    var contents = JSON.parse(e.postData.contents);
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    if (contents.action === 'syncAll') {
      var lastRow = sheet.getLastRow();
      if (lastRow > 1) {
        sheet.getRange(2, 1, lastRow - 1, 8).clearContent();
      }
      
      var rows = contents.records.map(function(r) {
        return [r.id, r.tanggal, r.siklus, r.hariKe, r.omsetKotor, r.tabungan, r.pengeluaran, r.catatanPengeluaran];
      });
      
      if (rows.length > 0) {
        sheet.getRange(2, 1, rows.length, 8).setValues(rows);
      }
      
      return ContentService.createTextOutput(JSON.stringify({ status: 'success' }))
        .setMimeType(ContentService.MimeType.JSON);
    }
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function formatDate(d) {
  if (d instanceof Date) {
    var year = d.getFullYear();
    var month = ("0" + (d.getMonth() + 1)).slice(-2);
    var day = ("0" + d.getDate()).slice(-2);
    return year + "-" + month + "-" + day;
  }
  return String(d);
}