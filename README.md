# Brandex IPO CMS

Neo-Brutalism CMS for Brandex Law Associates — Trademark Application Processor + tool links.

## Live Pages

- CMS Home: https://0utlawzz.github.io/Brandex-IPO-CMS/
- Trademark Form: https://0utlawzz.github.io/Brandex-IPO-CMS/trademark-application.html

## Apps Script (IMPORTANT)

File: **`Brandex-MailMerge-Full.gs`**

### How to deploy (so image goes inside client folder)

1. Open your Google Sheet → Extensions → Apps Script
2. Delete old code (or replace the whole project)
3. Copy **entire** content of `Brandex-MailMerge-Full.gs` from this repo
4. Paste → Save (`Ctrl+S`)
5. **Deploy → Manage deployments → Edit (pencil)**
6. **Version → New version**
7. Description: `image-in-client-folder`
8. Deploy
9. Confirm Web App URL is still:  
   `https://script.google.com/macros/s/AKfycbxod3G9xT8acKrQC8HbuRQbGEjjfvu8NBbYNTDFds4osUtZNv290r6q9h8Nf8FH2ZT9mQ/exec`

### What the form does with images

- Creates client folder under main Drive folder
- Saves image **inside that client folder**
- Filename = `FOLDERNAME_logo.png` (or jpg)
- Writes file ID to Sheet1 column T
- Generates TM-1 + TM-48 into the same client folder

**Just saving is NOT enough.** You must create a **New version** and redeploy.

## Config IDs (in script)

```
MAIN_FOLDER_ID   = 1PI-Znj4HIm6SJ0fNeUeK_p01iUckTg8H
TM1_TEMPLATE_ID  = 1XE42w12VjBMUW7jdvRU-HHdhmFd6yTB7HtL6H27FCnE
TM48_TEMPLATE_ID = 1EDAbs37UZekCrrNn3JKYWZcjMiuBW6bDUsfTg5AVAhc
```

## Menu tools

1. Trademark™ Application (form)
2. Database Record CMS
3. Database Google Sheet (View)
4. Salary Logger
5. Salary Google Sheet (View)
6. Ledger Consultants (Google Sheet)
7. Ledger Personal (Google Sheet)
8. Tools: Document Enhancer
