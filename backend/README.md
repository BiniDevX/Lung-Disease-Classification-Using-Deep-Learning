# Lung Disease Classification App - Backend

This directory contains the backend code for the Lung Disease Classification App. The backend is built using Flask and serves as the server-side application handling user authentication, patient data management, image processing, and diagnostic report generation.

## Table of Contents

- [Overview](#overview)
- [Installation](#installation)
- [Database Setup](#database-setup)
- [Running the Server](#running-the-server)

## Overview

The backend of the Lung Disease Classification App is responsible for:

- User authentication and management
- Patient data management
- Image processing and classification using a deep learning model
- Generating and serving diagnostic reports

## Installation

### Create a virtual environment and activate it:

```sh
python -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate`
```

### Install the required dependencies:

```sh
pip install -r requirements.txt
```

## Running the Server

### Run the backend server:

```sh
python run.py
```

The server will start on http://127.0.0.1:5000/.

### Database Setup

#### PostgreSQL Installation

If you do not have PostgreSQL installed, you can download and install it from the [official PostgreSQL website](https://www.postgresql.org/download/).

#### Database Creation

1. Start the PostgreSQL service and open the psql command-line tool:

   ```sh
   sudo service postgresql start
   psql -U postgres
   ```

2. Create a new PostgreSQL user (replace `your_username` with your desired username):

   ```sql
   CREATE USER your_username WITH PASSWORD 'your_password';
   ```

3. Create a new database:

   ```sql
   CREATE DATABASE lungappdb;
   ```

4. Grant all privileges on the database to the newly created user:

   ```sql
   GRANT ALL PRIVILEGES ON DATABASE lungappdb TO your_username;
   ```

5. Exit the psql command-line tool:

   ```sql
   \q
   ```

#### Database Migration

Initialize the database and create the necessary tables using Flask-Migrate.

1. Initialize the migration environment:

   ```sh
   flask db init
   ```

2. Generate an initial migration:

   ```sh
   flask db migrate -m "Initial migration."
   ```

3. Apply the migration to the database:

   ```sh
   flask db upgrade
   ```

### Running the Server

#### Run the backend server:

```sh
python run.py
```

The server will start on http://127.0.0.1:5000/.
