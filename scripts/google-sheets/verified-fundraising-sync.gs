/**
 * @OnlyCurrentDoc
 *
 * For The 22: Verified Fundraising sync (Google Apps Script)
 *
 * Pulls verified donations and approved sponsorships from the site's finance
 * API (docs/finance-api.md) into a "Verified Fundraising" tab of the
 * spreadsheet this script is attached to. The other tabs are never touched:
 * the API is authoritative for verified beneficiary fundraising, and the
 * existing ledger stays authoritative for campaign cash flow (Venmo,
 * merchandise, reimbursements, expenses).
 *
 * Permissions are pinned by appsscript.json (next to this file): this one
 * spreadsheet only, and outbound requests only to
 * https://forthe22.org/api/finance/. Apps Script refuses any other URL.
 *
 * Install (once):
 *   1. In the spreadsheet: Extensions → Apps Script. Paste this file over the
 *      default Code.gs. In Project Settings, tick "Show appsscript.json
 *      manifest file in editor", then replace appsscript.json with the one
 *      next to this file. Save.
 *   2. Project Settings (gear) → Script Properties → Add property:
 *        FINANCE_API_KEY = <contents of the key file>
 *   3. Back in the editor, pick `installDailySync` in the function menu and
 *      Run. Approve the permissions prompt (this spreadsheet + external
 *      requests). It runs one sync immediately, then daily around 6 AM.
 *   After that, the sheet has a "For The 22" menu → "Sync verified
 *   fundraising now".
 *
 * Behavior:
 *   - Rows are keyed by the API's stable `id` (column A). Re-syncing updates
 *     existing rows in place and appends new ones, so nothing is duplicated.
 *   - Columns to the right of the synced ones (e.g. your own "Notes" column)
 *     are left alone and stay with their row.
 *   - A row whose id disappears from the API (e.g. a donation un-verified) is
 *     not deleted. Its Sync status becomes "No longer on site" so you can
 *     review it.
 *   - Amounts are written as numbers so SUM/SUMIF work. "Pass-through" = TRUE
 *     means the donor gave straight to the beneficiary; FALSE means For The 22
 *     collected it (booth cash, Venmo) and owes it onward; blank means the
 *     site hasn't recorded who collected it. Set that in /admin/donations.
 */

var API_URL = 'https://forthe22.org/api/finance/transactions';
var TAB = 'Verified Fundraising';
var HEADER_ROW = 3;

/** [header, API field] — order is the column order in the sheet. */
var COLUMNS = [
  ['ID', 'id'],
  ['Date', 'date'],
  ['Type', 'type'],
  ['Kind', 'kind'],
  ['Amount', 'amount'],
  ['Counterparty', 'counterparty'],
  ['Anonymous', 'anonymous'],
  ['Beneficiary', 'beneficiary'],
  ['Received by', 'received_by'],
  ['Pass-through', 'pass_through'],
  ['Reference', 'reference'],
  ['Status', 'status'],
  ['Memo', 'memo'],
  ['Sync status', null],
];
var AMOUNT_COL = 5;
var SYNC_STATUS_COL = COLUMNS.length;

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('For The 22')
    .addItem('Sync verified fundraising now', 'syncVerifiedFundraising')
    .addToUi();
}

function installDailySync() {
  ScriptApp.getProjectTriggers().forEach(function (trigger) {
    if (trigger.getHandlerFunction() === 'syncVerifiedFundraising') ScriptApp.deleteTrigger(trigger);
  });
  ScriptApp.newTrigger('syncVerifiedFundraising').timeBased().everyDays(1).atHour(6).create();
  syncVerifiedFundraising();
}

function fetchLedger_() {
  var key = PropertiesService.getScriptProperties().getProperty('FINANCE_API_KEY');
  if (!key) throw new Error('Set the FINANCE_API_KEY script property first (Project Settings → Script Properties).');

  var response = UrlFetchApp.fetch(API_URL, {
    headers: { Authorization: 'Bearer ' + key },
    muteHttpExceptions: true,
  });
  var code = response.getResponseCode();
  if (code === 401) throw new Error('The finance API rejected the key (401). Check FINANCE_API_KEY.');
  if (code !== 200) throw new Error('Finance API returned ' + code + ': ' + response.getContentText().slice(0, 200));
  return JSON.parse(response.getContentText());
}

function ensureTab_(ss) {
  var sheet = ss.getSheetByName(TAB);
  if (sheet) return sheet;

  sheet = ss.insertSheet(TAB);
  sheet.getRange(1, 1).setValue('Verified Fundraising (synced from forthe22.org)').setFontWeight('bold').setFontSize(14);
  sheet
    .getRange(2, 1)
    .setValue('Columns A–' + columnLetter_(SYNC_STATUS_COL) + ' are overwritten on every sync. Add your own notes in columns to the right.')
    .setFontColor('#666666');
  sheet
    .getRange(HEADER_ROW, 1, 1, COLUMNS.length)
    .setValues([COLUMNS.map(function (c) { return c[0]; })])
    .setFontWeight('bold')
    .setBackground('#e8eaed');
  sheet.setFrozenRows(HEADER_ROW);
  return sheet;
}

function columnLetter_(n) {
  var s = '';
  while (n > 0) {
    var m = (n - 1) % 26;
    s = String.fromCharCode(65 + m) + s;
    n = Math.floor((n - 1) / 26);
  }
  return s;
}

function toCell_(field, value) {
  if (value === null || value === undefined) return '';
  if (field === 'amount') return Number(value);
  if (field === 'date') {
    var parts = String(value).split('-');
    return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
  }
  return value;
}

function syncVerifiedFundraising() {
  var lock = LockService.getDocumentLock();
  if (!lock.tryLock(30000)) return;
  try {
    var data = fetchLedger_();
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ensureTab_(ss);

    var firstDataRow = HEADER_ROW + 1;
    var lastRow = sheet.getLastRow();
    var existing = lastRow >= firstDataRow ? sheet.getRange(firstDataRow, 1, lastRow - HEADER_ROW, COLUMNS.length).getValues() : [];

    var rowById = {};
    existing.forEach(function (row, i) {
      if (row[0]) rowById[row[0]] = i;
    });

    var seen = {};
    var appended = 0;
    var updated = 0;
    data.transactions.forEach(function (tx) {
      var values = COLUMNS.map(function (c) {
        return c[1] ? toCell_(c[1], tx[c[1]]) : 'Synced';
      });
      seen[tx.id] = true;
      if (rowById.hasOwnProperty(tx.id)) {
        existing[rowById[tx.id]] = values;
        updated++;
      } else {
        rowById[tx.id] = existing.length;
        existing.push(values);
        appended++;
      }
    });

    var removed = 0;
    existing.forEach(function (row) {
      if (row[0] && !seen[row[0]]) {
        row[SYNC_STATUS_COL - 1] = 'No longer on site';
        removed++;
      }
    });

    if (existing.length) {
      sheet.getRange(firstDataRow, 1, existing.length, COLUMNS.length).setValues(existing);
      sheet.getRange(firstDataRow, 2, existing.length, 1).setNumberFormat('yyyy-mm-dd');
      sheet.getRange(firstDataRow, AMOUNT_COL, existing.length, 1).setNumberFormat('$#,##0.00');
    }

    sheet
      .getRange(2, SYNC_STATUS_COL + 2)
      .setValue(
        'Last synced ' +
          Utilities.formatDate(new Date(), ss.getSpreadsheetTimeZone(), 'yyyy-MM-dd HH:mm') +
          ' · ' + data.count + ' on site · ' + appended + ' new · ' + updated + ' updated' +
          (removed ? ' · ' + removed + ' no longer on site' : ''),
      )
      .setFontColor('#666666');
  } finally {
    lock.releaseLock();
  }
}
