/**
 * WebOnspark Technologies — Form receiver (Google Apps Script)
 * ------------------------------------------------------------
 * Receives every form from the website and:
 *   1) saves it as a new row in a Google Sheet (one tab per form type:
 *      Login, Enquiry, Contact, Career, Question) → download anytime as Excel (.xlsx)
 *   2) emails the details to NOTIFY_EMAIL
 *   3) (optional) sends a polite auto-reply to the visitor
 *
 * Setup: see README.md → "Connect forms to Excel + Email".
 */

const NOTIFY_EMAIL = 'info.webonspark@gmail.com';
const SEND_AUTO_REPLY = true;          // set false to disable visitor auto-replies
const ALLOWED_TYPES = ['Login', 'Enquiry', 'Contact', 'Career', 'Question'];
const MAX_FIELD_LENGTH = 1500;

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000);
  try {
    const p = (e && e.parameter) || {};
    const type = ALLOWED_TYPES.indexOf(p.formType) > -1 ? p.formType : 'Other';

    console.log('Received ' + type + ' from ' + (p.email || '(no email)'));

    // Basic spam guard: honeypot + required email
    if (p.website) { console.warn('Skipped: honeypot filled (bot)'); return json({ ok: true }); }
    if (!p.email || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(p.email)) { console.warn('Skipped: invalid email ' + p.email); return json({ ok: false, error: 'invalid email' }); }

    // Clean values (strip HTML + prevent spreadsheet formula injection)
    const data = {};
    Object.keys(p).forEach(function (k) {
      if (k === 'website') return;
      let v = String(p[k] || '').replace(/[<>]/g, '').slice(0, MAX_FIELD_LENGTH);
      if (/^[=+\-@]/.test(v)) v = "'" + v;
      data[k] = v;
    });

    // ---- 1) Save to sheet ----
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(type);
    if (!sheet) sheet = ss.insertSheet(type);

    let headers = sheet.getLastRow() > 0
      ? sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0]
      : [];
    if (headers.length === 0) {
      headers = ['Received At'].concat(Object.keys(data));
      sheet.appendRow(headers);
      sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold').setBackground('#2f2065').setFontColor('#ffffff');
      sheet.setFrozenRows(1);
    }
    // add any new columns that appear later
    Object.keys(data).forEach(function (k) {
      if (headers.indexOf(k) === -1) {
        headers.push(k);
        sheet.getRange(1, headers.length).setValue(k).setFontWeight('bold').setBackground('#2f2065').setFontColor('#ffffff');
      }
    });
    const row = headers.map(function (h) { return h === 'Received At' ? new Date() : (data[h] || ''); });
    sheet.appendRow(row);

    // ---- 2) Email notification ----
    const rowsHtml = Object.keys(data).map(function (k) {
      return '<tr><td style="padding:8px 12px;background:#f6f4fc;font-weight:bold;border:1px solid #e6e2f2">' + k +
        '</td><td style="padding:8px 12px;border:1px solid #e6e2f2">' + data[k] + '</td></tr>';
    }).join('');
    MailApp.sendEmail({
      to: NOTIFY_EMAIL,
      replyTo: data.email,
      subject: '[' + type + '] New ' + type.toLowerCase() + ' from ' + (data.name || data.email) + ' — WebOnspark website',
      htmlBody:
        '<div style="font-family:Arial,sans-serif">' +
        '<h2 style="color:#2f2065;margin:0 0 12px">New ' + type + ' submission</h2>' +
        '<table style="border-collapse:collapse;font-size:14px">' + rowsHtml + '</table>' +
        '<p style="color:#888;font-size:12px">Saved to sheet: ' + ss.getUrl() + '</p></div>',
    });

    // ---- 3) Auto-reply to visitor ----
    if (SEND_AUTO_REPLY && type !== 'Login') {
      MailApp.sendEmail({
        to: data.email,
        replyTo: NOTIFY_EMAIL,
        name: 'WebOnspark Technologies',
        subject: 'Thanks for contacting WebOnspark Technologies',
        htmlBody:
          '<div style="font-family:Arial,sans-serif;color:#222">' +
          '<p>Hi ' + (data.name || 'there') + ',</p>' +
          '<p>Thank you for reaching out to <b>WebOnspark Technologies</b>. We have received your ' + type.toLowerCase() +
          ' and our team will get back to you within one working day.</p>' +
          '<p>For a faster response, WhatsApp us at <a href="https://wa.me/918608145177">+91 86081 45177</a>.</p>' +
          '<p>Warm regards,<br>Team WebOnspark<br>BTM Layout 2nd Stage, Bengaluru</p></div>',
      });
    }

    return json({ ok: true });
  } catch (err) {
    console.error('Form error: ' + err);
    return json({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  return json({ ok: true, service: 'WebOnspark form receiver' });
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
