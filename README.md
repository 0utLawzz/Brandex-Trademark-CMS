# Trademark Application Processor

Web-based CMS for **Brandex Law Associates** that generates **TM-1** and **TM-48** trademark application documents through a clean form interface connected to a Google Apps Script backend.

**Live CMS:**  
https://0utLawzz.github.io/Trademark-Application-Processor/

---

## Features

- Clean neobrutalism-style CMS dashboard
- Trademark Application form with optional image upload
- Automatic generation of TM-1 and TM-48 Google Docs
- Creates a dedicated Google Drive folder for each client
- Saves a new row in **Sheet1** (Status → DONE ✅)
- Returns direct links to:
  - Client Drive Folder
  - TM-1 Document
  - TM-48 Document
- Uploaded trademark image is named after the client folder and stored inside that folder

---

## CMS Menu Structure

| #  | Label                              | Tag / Link Type                          |
|----|------------------------------------|------------------------------------------|
| 01 | Trademark™ Application             | Trademark Application Setup              |
| 02 | Database Record CMS                | Database Webview Application             |
| 03 | Database Google Sheet (View)       | Google Sheet Link                        |
| 04 | Salary Logger                      | Salary Reports & Management Form         |
| 05 | Salary Google Sheet (View)         | Google Sheet Link                        |
| 06 | Ledger Consultants (Google Sheet)  | Google Sheet Link                        |
| 07 | Ledger Personal (Google Sheet)     | Google Sheet Link                        |
| 08 | Tools: Document Enhancer           | Web Application                          |

---

## Setup Instructions

### 1. Enable GitHub Pages
1. Go to repository **Settings → Pages**
2. Source: **Deploy from a branch**
3. Branch: `main` / folder: `/ (root)`
4. Save. The CMS will be available at:  
   `https://0utLawzz.github.io/Trademark-Application-Processor/`

### 2. Add / Update Backend Code in Google Apps Script

Open your existing Brandex mail-merge Apps Script project and replace (or add) the form-handler code with the contents of `apps-script-form-handler.gs`.

Key improvement in the latest version:
- The uploaded trademark image is now created **inside the newly generated client folder**.
- The image filename uses the folder / client name (example: `ABC_COMPANY_logo.png`).

### 3. Deploy as Web App
1. In Apps Script → **Deploy → New deployment**
2. Type: **Web app**
3. Execute as: **Me**
4. Who has access: **Anyone**
5. Deploy → Copy the Web App URL
6. Paste that URL into the constant `APPS_SCRIPT_URL` inside `trademark-application.html` if it has changed.

---

## Notes

- Image upload is optional.
- Required fields: Folder / Client Name, Class, Application Type, Applicant Name.
- After successful generation a new row is added to **Sheet1** and marked **DONE ✅**.
- The form works on desktop and mobile browsers.
- All text input is automatically converted to UPPERCASE.

---

Made for **Brandex Law Associates**  
Trademark & IP Registry CMS
