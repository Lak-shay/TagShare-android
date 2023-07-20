# TagShare

## Installation

1. [Set up android studio](https://reactnative.dev/docs/environment-setup)
2. Clone this repository
3. Firebase Setup
- Go to Firebase Console
- Create a new project
- Click on 'Add App' 
- Click on 'Web App'
- Follow the steps to get the firebaseConfig object
- Copy the firebaseConfig object in 'firebase/firebaseConfig.js' file
4. Youtube API Setup
- Get 'Youtube Data API v3' key from google cloud console.
- Insert the api key in '.env' file
5. The API keys are setup
6. Open your project in vscode.
7. Install the dependencies by running the command
```bash
npm install
```
8. Open the terminal and run the following command:
```bash
npm run android
```
9. Bundle your application : [Documentation](https://reactnative.dev/docs/signed-apk-android)
10. Generate apk:
After completing the 9th step, run the following commands:
```bash
cd android
./gradlew assembleRelease
```
11. Check that 'app-release.apk' if found in:
```bash
android/app/build/outputs/apk/release/
```
