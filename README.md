# Brandex Mail Merge

Neo-Brutalism CMS for Brandex Law Associates — Trademark Application Processor + tool links.

## Live Pages

> CMS Home:
https://0utlawzz.github.io/Brandex-MailMerge/

> Trademark Form:
https://0utlawzz.github.io/Brandex-MailMerge/trademark-application.html

## Apps Script (IMPORTANT)

Use **only one Apps Script source file**:

**`Brandex-MailMerge-Full.gs`**

Do not also copy `apps-script-form-handler.gs` into the same Apps Script project. That duplicate handler has been removed from this branch because duplicate `doPost`, `processFormSubmission`, and image-processing functions can cause the wrong implementation to run.

### How to deploy

1. Open your Google Sheet → Extensions → Apps Script.
2. Remove old/duplicate handler code from the Apps Script project.
3. Copy the complete contents of `Brandex-MailMerge-Full.gs` into the Apps Script project.
4. Save.
5. Deploy → Manage deployments → Edit.
6. Select **New version** and deploy it.
7. Use the same Web App URL configured in `trademark-application.html`:
   `https://script.google.com/macros/s/AKfycbwuhiV8I22JNBX-hNRQBJqIkYfqe6o844aCGENYQdV4INR2KkAxUgESFbOUaQWeqVI7CQ/exec`

**Saving the Apps Script project is not enough. The web app must be redeployed as a new version for the public form to use the changed code.**

### Image behavior

- Creates or finds the client folder under the configured main Drive folder.
- Saves the uploaded trademark image **directly inside that client folder**.
- Image filename is `FOLDERNAME_logo.png`, `.jpg`, `.gif`, or `.webp` as applicable.
- Writes the image file ID to Sheet1 column T.
- Generates TM-1 and TM-48 in the same client folder.

## Config IDs

```text
  MAIN_FOLDER_ID   = "1R-cQ1qYLat0DlnYKs699kXBX0zr7BZDP"
  TM1_TEMPLATE_ID  = "1STwQUmtknPf1TcWuK1YtEib1ZWiM1yN3tyILlVGwglg"
  TM48_TEMPLATE_ID = "1HyQyz-_tMFIy1X1bH0-sAToZmE2QJL5NFhGUwI_vLgE"
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
