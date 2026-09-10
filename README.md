<div align="center">

# Brandex Trademark CMS

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
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [1. Enable GitHub Pages](#1-enable-github-pages)
  - [2. Google Apps Script Setup](#2-google-apps-script-setup)
  - [3. Deploy Web App](#3-deploy-web-app)
- [How It Works](#how-it-works)
- [Image Upload Behaviour](#image-upload-behaviour)
- [File Structure](#file-structure)
- [Contributing](#contributing)
- [License](#license)
- [Credits](#credits)

---

## Overview

**Brandex Trademark CMS** is a clean, modern web-based Content Management System designed specifically for **Brandex Law Associates**.  

It allows the team to:

- Generate official **TM-1** and **TM-48** trademark application documents
- Manage database records
- Access salary reports and ledgers
- Open Google Sheets directly
- Use additional document tools

All from a single, beautifully designed dashboard with a neobrutalism visual style.

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
| **Responsive Design** | Works smoothly on desktop and mobile |
| **Uppercase Enforcement** | All form inputs automatically convert to UPPERCASE |

---

## CMS Menu Structure

| # | Menu Item | Type | Tag |
|---|-----------|------|-----|
| **01** | Trademark™ Application | Main | Trademark Application Setup |
| **02** | Database Record CMS | Main | Database Webview Application |
| ↳ | Database Google Sheet (View) | Sub | Google Sheet Link |
| **04** | Salary Logger | Main | Salary Reports & Management Form |
| ↳ | Salary Google Sheet (View) | Sub | Google Sheet Link |
| **06** | Ledger Consultants (Google Sheet) | Main | Google Sheet Link |
| **07** | Ledger Personal (Google Sheet) | Main | Google Sheet Link |
| **08** | Tools: Document Enhancer | Main | Web Application |

> **Note:** Items under 02 and 04 are indented sub-links for better visual hierarchy.

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

---

### 2. Google Apps Script Setup

1. Open your existing Brandex Google Apps Script project
2. Create a new file or replace the content of the form handler
3. Copy the entire content from `apps-script-form-handler.gs`
4. Make sure the following helper functions already exist in your project:
   - `generateUniqueSerial`
   - `getRowData`
   - `validateRequiredData`
   - `getImageFromDriveId`
   - `replaceTextWithImage`
   - `escapeRegex`

---

### 3. Deploy Web App

1. In the Apps Script editor click **Deploy → New deployment**
2. Select type: **Web app**
3. Set **Execute as**: `Me`
4. Set **Who has access**: `Anyone`
5. Click **Deploy**
6. Copy the Web App URL
7. Paste the URL into the constant `APPS_SCRIPT_URL` inside `trademark-application.html` (if it has changed)

---

## How It Works

1. User fills the **Trademark Application** form
2. Optional trademark image can be uploaded
3. On submit, data is sent to Google Apps Script
4. A new row is added to **Sheet1**
5. A client folder is created in Google Drive
6. TM-1 and TM-48 documents are generated from templates
7. Uploaded image is saved inside the client folder using the folder name
8. User receives direct links to the folder and both documents

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

Please follow the existing code style and naming conventions.

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
