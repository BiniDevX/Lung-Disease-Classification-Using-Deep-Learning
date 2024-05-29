# Lung Disease Classification App - Frontend

This directory contains the frontend code for the Lung Disease Classification App. The frontend is built using React and provides the user interface for interacting with the backend services.

## Table of Contents

- [Overview](#overview)
- [Installation](#installation)
- [Running the Development Server](#running-the-development-server)
- [Project Structure](#project-structure)

## Overview

The frontend of the Lung Disease Classification App is responsible for:

- Providing a user-friendly interface for uploading lung X-ray images
- Displaying diagnostic results
- Managing user authentication and patient data

## Installation

### Navigate to the frontend directory:

```sh
cd frontend
```

### Install the required dependencies:

```sh
npm install
```

## Running the Development Server

### Start the development server:

```sh
npm start
```

The development server will start on http://localhost:3000/.

## Project Structure

```sh
frontend/
├── README.md
├── node_modules/
├── public/
│   ├── index.html
│   ├── favicon.ico
│   └── ...
├── src/
│   ├── components/
│   │   ├── Header.js
│   │   ├── Footer.js
│   │   ├── UploadForm.js
│   │   └── ...
│   ├── pages/
│   │   ├── HomePage.js
│   │   ├── LoginPage.js
│   │   ├── PatientPage.js
│   │   └── ...
│   ├── App.js
│   ├── index.js
│   └── ...
├── package-lock.json
├── package.json
├── postcss.config.js
└── README.md
```
