# IndustrialWatch

## Overview

IndustrialWatch is an AI-powered monitoring system designed to enhance workplace efficiency and product quality in industrial settings. This project integrates advanced AI technologies to monitor employee performance and detect defective products, promoting compliance with workplace rules and maintaining high production standards.

## Features

### Employee Performance Monitoring

The system leverages AI camera monitoring to track and evaluate employee activities based on specific rules:

- **Cigarette Detection**: Monitors smoking in the workplace, logging violations and imposing fines.
- **Mobile Usage Detection**: Identifies unauthorized mobile phone use during work hours, enforcing penalties.
- **Posture Detection**: Ensures proper posture by detecting incorrect sitting positions and issuing alerts.

### Defective Product Detection

AI models are trained to identify defects in various products:

- **Centrifugal Discs**: Detects anomalies to ensure product quality.
- **Water Bottles**: Monitors for defects such as missing caps or labels to maintain product integrity.
- **Textile Defects**: Identifies weaving faults and fabric damage in textile products.

## Frontend Integration

The project includes a frontend developed in React Native, offering a user-friendly mobile application.

## Technology Stack

- **Backend**: Python
- **AI Models**: YOLOv8, PyTorch
- **Database**: SQL Server

## Installation and Setup

The app is built with Expo (SDK 57) and needs Node 22 (`nvm use`).

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the backend (see the `industrial-watch-backend` README).

3. Start the app:
   ```bash
   npx expo start
   ```
   Scan the QR code with Expo Go on your phone (same Wi-Fi as your computer), or press `a` / `i`
   for the Android emulator / iOS simulator.

4. On the login screen, tap **IP Address** and enter your computer's LAN IP
   (e.g. `ipconfig getifaddr en0` on macOS). Default login is `admin` / `admin`.

## Contact

For any inquiries, please contact [usama.fayyaz157@gmail.com].

![Alt text](./images/Slide_1.png)
![Alt text](./images/Slide_2.png)
![Alt text](./images/Slide_3.png)
