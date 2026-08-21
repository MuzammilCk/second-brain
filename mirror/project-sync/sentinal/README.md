---
source: project-sync
project: sentinal
original-path: D:\projects\sentinal\README.md
synced: 2026-08-03
---

# Sentinel

Sentinel is an Android application designed to protect users from audio-based scams using the Gemini API.

## Prerequisites

- **Android Studio**: The recommended IDE for Android development.
- **Java Development Kit (JDK)**: Required for building the project (usually bundled with Android Studio).

## Setup

1.  **Open the Project**:
    - Launch Android Studio.
    - Select **Open** and navigate to the project directory (`d:\projects\sentinal`).
    - Android Studio will automatically sync the project, download necessary Gradle dependencies, and generate the missing Gradle wrapper files if needed.

2.  **Configure API Key**:
    - The app requires a Gemini API key to function.
    - Open the `local.properties` file in the root directory (Project view). If it doesn't exist, create it.
    - Add your API key:
      ```properties
      GEMINI_API_KEY=your_actual_api_key_here
      ```
    - *Note: Do not commit this file to version control.*

## Running the Application

1.  **Connect a Device**:
    - **Physical Device**: Connect an Android device via USB. Ensure **USB Debugging** is enabled in the device's Developer Options.
    - **Emulator**: Open **Device Manager** in Android Studio and create/launch an Android Virtual Device (AVD).

2.  **Run**:
    - In the Android Studio toolbar, verify your device/emulator is selected in the dropdown.
    - Click the green **Run 'app'** button (or press `Shift + F10`).
    - The app will build, install, and launch on the selected device.

## Troubleshooting

- **"gradlew" command not found**: This project currently lacks the generated Gradle wrapper scripts in the codebase. Opening the project in Android Studio is the standard way to run it, as the IDE handles the build process internally.
