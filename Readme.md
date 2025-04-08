# Backend-youtube

## Overview

Backend-youtube is a project designed to handle backend functionalities for a YouTube-like application. This project is primarily written in JavaScript, with some CSS and HTML components. The project aims to provide a robust backend solution to manage video uploads, user authentication, and other related features.

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Features

- User Authentication
- Video Uploads and Management
- Real-time Notifications
- Comment and Like System
- RESTful API

## Prerequisites

Before you begin, ensure you have met the following requirements:
- Node.js and npm installed
- MongoDB installed and running

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/RaoUmair55/Backend-youtube.git
    ```
2. Navigate to the project directory:
    ```sh
    cd Backend-youtube
    ```
3. Install the dependencies:
    ```sh
    npm install
    ```
4. Set up environment variables by creating a `.env` file in the root directory:
    ```sh
    touch .env
    ```
    Add the following variables to your `.env` file:
    ```env
    MONGODB_URI=your_mongodb_uri
    JWT_SECRET=your_jwt_secret
    ```

## Usage

To start the server, run the following command:
```sh
npm start
