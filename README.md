# ISEA Phase-III Certificate Verification Portal

A scalable, serverless web application designed to verify digital certificates for various technical programs, workshops, and faculty updation programs organized under the ISEA Project Phase-III at MNNIT Allahabad[cite: 1]. 

This portal uses a **GitHub Pages** frontend and a **Google Sheets + Apps Script** backend. It is built with a highly scalable architecture: new events can be added in minutes by editing a single configuration file, without modifying any core HTML or JavaScript logic.

## Features

* **Single-File Configuration:** Add new programs simply by updating a JSON object in `config.js`.
* **Serverless Architecture:** Completely free hosting utilizing GitHub Pages and Google's infrastructure.
* **Dynamic UI:** Automatically populates the event dropdown based on available configurations.
* **Real-time Verification:** Connects to specific Google Sheets via Apps Script to validate certificate IDs on the fly.
* **Responsive Design:** Clean, mobile-friendly interface with loading spinners and distinct success/error states.
* **Integrated Actions:** Direct buttons for certificate downloads and correction requests.

## Tech Stack

* **Frontend:** HTML5, CSS3, Vanilla JavaScript
* **Backend:** Google Apps Script (acting as a REST API)
* **Database:** Google Sheets
* **Hosting:** GitHub Pages

## File Structure

```text
isea-verification-portal/
├── index.html       # The static UI skeleton
├── style.css        # Styling for the portal and result cards
├── config.js        # The central configuration file for all programs
└── script.js        # Core logic for dynamic UI and API fetching
