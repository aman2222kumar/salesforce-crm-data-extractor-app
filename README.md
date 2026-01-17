Salesforce CRM Data Extractor

A powerful Chrome extension for extracting and managing Salesforce CRM data directly from your browser. Automatically captures Leads, Contacts, Accounts, Opportunities, and Tasks with intelligent field detection and local storage.

📑 Table of Contents

Installation

Features

Data Extraction Strategy

Storage Schema

Supported Objects

Development

🚀 Installation
For Users

Install from the Chrome Web Store (link will be available after publication).

For Developers

Clone the repository

git clone https://github.com/aman2222kumar/salesforce-crm-data-extractor-app
cd salesforce-crm-data-extractor


Install dependencies

npm install


Build the extension

npm run build


Load the extension in Chrome

Open chrome://extensions/

Enable Developer mode (top-right toggle)

Click Load unpacked

Select the project root folder

The extension icon will appear in your toolbar

Development mode (auto-rebuild)

npm run dev

✨ Features

Automatic Object Detection – Detects Salesforce objects from URL and page context

Intelligent Data Extraction – Uses multiple strategies to maximize accuracy

Secure Local Storage – Stores data in chrome.storage.local

Deduplication – Prevents duplicate records using Salesforce IDs

Multi-Object Support – Supports Leads, Contacts, Accounts, Opportunities, and Tasks

🔍 Data Extraction Strategy

The extension uses a dual extraction approach to ensure reliable data capture.

Object Detection

The extension detects the current object using:

URL Pattern Matching
Example:

/lightning/o/Lead/
/lightning/o/Contact/


Fallback Detection
Uses document title and page structure when URL detection fails.

Supported Objects
Lead, Contact, Account, Opportunity, Task

Primary Extraction: Lightning Data Tables

For standard list views and data tables:

Row selector:

[role="row"]


Cell selector:

[role="gridcell"]


Each row is parsed sequentially to extract visible fields.

Works best for:

List views

Standard Lightning tables

Report-style layouts

Fallback Extraction: Link-Based Record Detection

Used when table extraction fails (Kanban views, custom layouts):

Scans all hyperlinks on the page

Detects Salesforce 18-character record IDs by prefix:

Leads → 00Q

Contacts → 003

Accounts → 001

Opportunities → 006

Tasks → 00T

Extracts ID using:

/([a-zA-Z0-9]{18})(?:\/|$|\?)/


Captures:

Record ID

Display name (link text)

Contextual fields from surrounding content

Contextual Field Extraction

When fields are not directly visible, the extension extracts them using pattern matching:

Email → RFC 5322 compliant regex

Phone → International / local formats

Company / Account → Matches keywords like company: or account:

Status → Common Salesforce values

Source / Type → Common picklist values

Owner → Matches owner: or assigned:

📦 Storage Schema

All data is stored in:

chrome.storage.local → salesforce_data

Example Structure
{
  "salesforce_data": {
    "leads": [],
    "contacts": [],
    "accounts": [],
    "opportunities": [],
    "tasks": [],
    "lastSync": {
      "leads": 1706208000000,
      "contacts": 1706208000000,
      "accounts": 1706208000000,
      "opportunities": 1706208000000,
      "tasks": 1706208000000
    }
  }
}

🛡 Data Integrity

Deduplication
Records are uniquely identified by their 18-character Salesforce ID.
Existing records are updated instead of duplicated.

Validation
Records must contain at least two populated fields (ID alone is ignored).

Atomic Storage
All storage operations are handled centrally to prevent race conditions.

📊 Supported Objects & Fields
Leads

Name

Company

Email

Phone

Status

Lead Source

Owner

Contacts

Name

Email

Phone

Account Name

Title

Owner

Mailing Address

Accounts

Account Name

Website

Phone

Industry

Type

Owner

Annual Revenue

Opportunities

Opportunity Name

Amount

Stage

Probability

Close Date

Forecast Category

Owner

Associated Account

Tasks

Subject

Due Date

Status

Priority

Related To

Assigned To

🛠 Development
Available Scripts
npm run build   # Production build
npm run dev     # Development mode with watch
npm run start   # Development server with hot reload

🧩 Troubleshooting

Extension not visible
Ensure Developer Mode is enabled and the correct folder is loaded.

Data not extracting
Confirm the current Salesforce object is supported and visible in the UI.

Support
Contact: gauravmshinde017@gmail.com

🤝 Contributing

Fork the repository

Create a branch

git checkout -b feature/YourFeature


Commit your changes

git commit -m "Add your message"


Push the branch

git push origin feature/YourFeature


Open a Pull Request