<div align="center">

# Brandex IPO CMS

**Professional Trademark & IP Registry Management System**  
Built for **Brandex Law Associates**

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live-brightgreen?style=for-the-badge&logo=github)](https://0utLawzz.github.io/Brandex-Trademark-CMS/)
[![License](https://img.shields.io/badge/License-Private-red?style=for-the-badge)](#)
[![Status](https://img.shields.io/badge/Status-Active-success?style=for-the-badge)](#)

**Live Demo** → [https://0utLawzz.github.io/Brandex-Trademark-CMS/](https://0utLawzz.github.io/Brandex-Trademark-CMS/)

</div>

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [CMS Menu Structure](#cms-menu-structure)
- [Related Repositories](#related-repositories)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [How It Works](#how-it-works)
- [Image Upload Behaviour](#image-upload-behaviour)
- [File Structure](#file-structure)
- [Contributing](#contributing)
- [License](#license)
- [Credits](#credits)

---

## Overview

**Brandex Trademark CMS** is a clean, modern web-based Content Management System designed specifically for **Brandex Law Associates**.

It allows the team to generate official **TM-1** and **TM-48** trademark application documents, manage database records, access salary reports, ledgers, document tools, and journal builds — all from one unified dashboard.

---

## Features

| Feature | Description |
|---------|-------------|
| **Trademark Form** | Generate TM-1 & TM-48 documents with optional image upload |
| **Auto Folder Creation** | Creates a dedicated Google Drive folder for every client |
| **Image Handling** | Uploaded logo is named after the client folder and stored inside it |
| **Database CMS** | Quick access to the Database Webview Application |
| **Salary Tools** | Salary Logger + direct Google Sheet access |
| **Ledgers** | Consultant Ledger & Personal Ledger |
| **Document Enhancer** | Extra document processing tool |
| **Journal Builds** | Direct access to Journal Builds & Management Drive folder |
| **Responsive Design** | Works smoothly on desktop and mobile |
| **Uppercase Enforcement** | All form inputs automatically convert to UPPERCASE |

---

## CMS Menu Structure

| # | Menu Item | Type | Tag |
|---|-----------|------|-----|
| **01** | Trademark™ Application | Main | Trademark Application Setup |
| **02** | Database Record CMS | Main | Database Webview Application |
| ↳ | Database Google Sheet (View) | Sub | Google Sheet Link |
| **03** | Salary Logger | Main | Salary Reports & Management Form |
| ↳ | Salary Google Sheet (View) | Sub | Google Sheet Link |
| **04** | Ledger Consultants (Google Sheet) | Main | Google Sheet Link |
| **05** | Ledger Personal (Google Sheet) | Main | Google Sheet Link |
| **06** | Tools: Document Enhancer | Main | Web Application |
| **07** | Journal Builds & Management | Main | Google Drive Folder |

---

## Related Repositories

| Tool | Repository | Description |
|------|------------|-------------|
| **Database CMS** | [Brandex-Database-CMS](https://github.com/0utLawzz/Brandex-Database-CMS) | Fast, secure trademark case-management Datasheet (Supabase + React + Vercel) |
| **Salary / Payslip** | [Brandex-Payslip-Generator](https://github.com/0utLawzz/Brandex-Payslip-Generator) | Attendance & salary report generator with Google Sheets sync |
| **Document Enhancer** | [Document-Enhancer](https://github.com/0utLawzz/Document-Enhancer) | Privacy-first browser document enhancer (DocBright) |
| **Consultant Ledger** | [Consultant-Ledger-v2](https://github.com/0utLawzz/Consultant-Ledger-v2) | Modern consultant ledger with live KPIs and CSV export |
| **Drive Parser** | [Brandex-Drive-Parser](https://github.com/0utLawzz/Brandex-Drive-Parser) | Google Drive folder parser for trademark case files |

---

## Tech Stack

- **Frontend:** HTML5, CSS3 (Neobrutalism design), Vanilla JavaScript
- **Backend:** Google Apps Script
- **Storage:** Google Drive + Google Sheets
- **Hosting:** GitHub Pages
- **Document Generation:** Google Docs (via Apps Script mail-merge)

---

## Getting Started

### 1. Enable GitHub Pages

1. Go to the repository **Settings → Pages**
2. Under **Source**, select **Deploy from a branch**
3. Choose branch: `main` and folder: `/ (root)`
4. Click **Save**
5. Your CMS will be available at:  
   `https://0utLawzz.github.io/Brandex-Trademark-CMS/`

### 2. Google Apps Script Setup

1. Open your existing Brandex Google Apps Script project
2. Copy the entire content from `apps-script-form-handler.gs`
3. Ensure the required helper functions already exist in the project

### 3. Deploy Web App

1. In Apps Script → **Deploy → New deployment**
2. Type: **Web app**
3. Execute as: **Me**
4. Who has access: **Anyone**
5. Deploy and copy the Web App URL
6. Update `APPS_SCRIPT_URL` in `trademark-application.html` if needed

---

## How It Works

1. User fills the Trademark Application form
2. Optional trademark image can be uploaded
3. Data is sent to Google Apps Script
4. A new row is added to Sheet1
5. A client folder is created in Google Drive
6. TM-1 and TM-48 documents are generated
7. Uploaded image is saved inside the client folder using the folder name
8. User receives direct links to the folder and documents

---

## Image Upload Behaviour

| Behaviour | Details |
|-----------|---------|
| **Location** | Image is stored **inside** the newly created client folder |
| **Filename** | Uses the client/folder name (example: `ABC_COMPANY_logo.png`) |
| **Supported Formats** | PNG, JPG, JPEG, GIF, WEBP |
| **Optional** | Form works even without an image |

---

## File Structure

```text
Brandex-Trademark-CMS/
├── index.html                  # Main CMS dashboard
├── trademark-application.html  # Trademark form page
├── apps-script-form-handler.gs # Google Apps Script backend code
└── README.md                   # Project documentation
```

---

## Contributing

This is a private internal tool for **Brandex Law Associates**.

If you are part of the team and want to suggest improvements:

1. Create a new branch
2. Make your changes
3. Open a Pull Request with a clear description

---

## License

This project is **private** and intended for internal use by Brandex Law Associates only.  
Unauthorized distribution or commercial use is not permitted.

---

## Credits

**Developed for**  
**Brandex Law Associates**  
Trademark & IP Registry

**Maintained by**  
[0utLawzz](https://github.com/0utLawzz)

---

<div align="center">

**Brandex Trademark CMS** · Built with care for efficient trademark processing

</div>
