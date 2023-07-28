# TagShare

Introducing the efficient video management application, featuring two convenient portals: Admin and User. In the Admin Portal, you can easily tag and store videos fetched from YouTube API while seamlessly promoting users to admins.

The User Portal provides a user-friendly interface for effortless video searches and exploration based on tags. With the new list view feature on top, you can quickly access all tags and their associated videos.

## Features

1. Login and Register Page
<img width="181" alt="LoginPage" src="https://github.com/Lak-shay/TagShare-android/assets/88343117/dfa0c93d-c330-4ff4-b6b2-109f98f981d8">
<img width="197" alt="registerPage" src="https://github.com/Lak-shay/TagShare-android/assets/88343117/d5a40c5e-ee2d-4742-96cd-e2d6b45501cd">

2. Admin Portal
<img width="167" alt="adminPortal" src="https://github.com/Lak-shay/TagShare-android/assets/88343117/ebc6c97c-dd16-4857-a9f2-196fe70cca04">

The icons on the top left are: User Portal, List Users, List all tags

3. User Portal
<img width="173" alt="userPortal" src="https://github.com/Lak-shay/TagShare-android/assets/88343117/6bfae6a9-9a0f-470f-be9a-74fd6ef695e9">

4. Video Card
<img width="164" alt="videoCard" src="https://github.com/Lak-shay/TagShare-android/assets/88343117/4b1d1acb-77c5-4938-996f-a70525697e50">

5. Video Player (On clicking the video thumbnail)
<img width="182" alt="videoPlayer" src="https://github.com/Lak-shay/TagShare-android/assets/88343117/21012659-8274-4a5b-9c95-b64546eabdfc">

## Setup for your own team

1. [Set up android studio](https://reactnative.dev/docs/environment-setup)

2. Clone this repository

3. Firebase Setup
    * Go to Firebase Console
    * Create a new project
    * Click on 'Add App' 
    * Click on 'Web App'
    * Follow the steps to get the firebaseConfig Json Object
    * Copy the firebaseConfig object in 'firebase/firebaseConfig.js' file
    * Enable email-password as sign-in method in your authentication portal
    * Create db -> choose test mode -> choose mumbai location

4. Youtube API Setup
    * Get 'Youtube Data API v3' key from google cloud console.
    * Insert the api key in '.env' file

5. The API keys are setup

6. Open your project in vscode

7. Install the dependencies by running the command

```bash
npm install
```

8. Open the terminal and run the following command (In the root directory of the application):

```bash
npm run android
```

9. Bundle your application : [Documentation](https://reactnative.dev/docs/signed-apk-android)

10. Generate apk - After completing the 9th step, run the following commands:

```bash
cd android
./gradlew assembleRelease
```

11. Check that 'app-release.apk' if found in:
```bash
android/app/build/outputs/apk/release/
```


    
