# Control Plane - Firebase Demo

This project demonstrates the ability to deploy an application to Control Plane that utilizes:

- Firebase Authentication
- Firestore
- reCAPTCHA v3

## Prerequisites

1. Existing Control Plane Org and GVC.
2. Control Plane CLI: https://docs.controlplane.com/reference/cli
3. Firebase Account: https://firebase.google.com/
   
## Steps to Deploy

1. Clone current repository.
2. Follow Step 1 in this guide to create a Firebase project and register your app: 
   1. https://firebase.google.com/docs/web/setup
3. Using the `firebaseConfig` from the registration step, update the `initializeApp` method in the file `./src/app/firebase.js`.
4. To configure Firebase authentication using Google:
   1. Click `Authentication` in the left menu.
   2. Click the `Get started` button.
   3. Click the `Google` button.
   4. Toggle the `Enable` button. Enter a project name and email (if required). Click `Save`.
5. To configure a new Firestore database:
   1. Click `Firestore Database` in the left menu.
   2. Click the `Create Database` button.
   3. Select `Start in test mode` and click `Next`.
   4. Select a location and click `Enable`. It will take a few minutes to create.
   5. Select `Rules` at the top menu and update the rule with the following and click `Publish`:
        ```
        rules_version = '2';
        service cloud.firestore {
        match /databases/{database}/documents {
            match /messages/{message} {
            allow read: if request.auth.uid != null;
            allow write: if request.auth.uid != null;
            }
          }
        }
        ```   
6. To configure reCAPTCHA v3:
   1. Browse to: https://www.google.com/recaptcha/admin
   2. The `Register a new site` page will be displayed or click the `+` button.
   3. Enter the following:
      1. Any name for the `Label`.
      2. Select `reCAPTCHA v3`.
      3. Enter `example.com` temporarily for the `Domains`. We'll add the real domain after creating the workload.
      4. Accept the `Terms of Service` and `Send alerts..` and click `Submit`.
      5. Save the `Site Key` and `Secret Key`.
   4. Update the `active` method on Line 19 with the `Site Key`.
   5. Return to the Firebase console for the project and select the gear icon to the right of the `Project Overview` and click `Project settings`.
   6. Select `App Check` on the top menu bar.
   7. Click the name of your `Web App`, click `reCAPTCHA`, enter the `Secret Key` and click `Save`.
7. To deploy to Control Plane:
   1. If necessary, authenticate using: `cpln login`.
   2. Containerize the application and push the image to the org's private image repository using the command (substitute ORG_NAME with the target Org):
      1. `cpln image build --name firebase-demo:1 --push --org ORG_NAME`
   3. Create a workload using the command (substitute ORG_NAME with the target Org and GVC_NAME with the target GVC):
      1. `cpln workload create --name firebase-demo --image //image/firebase-demo:1 --public --gvc GVC_NAME`
      2. Take note of the `ENDPOINT` URL.
8. Using the endpoint URL, the Firebase authentication's authorized domains must be updated.
   1. Return to the Firebase console and click `Authentication` in the left menu.
   2. Select `Sign-in method` from the top menu.
   3. Click `Add domain`. Enter the endpoint URL and click `Add`.
9. Using the endpoint URL, the reCAPTCHA v3 domain must be updated.
   1.  Return to: https://www.google.com/recaptcha/admin
   2.  Click the gear icon.
   3.  In the `Domains` section, to the right of the `+`, enter the endpoint URL and press enter.
   4.  Delete the `example.com` by clicking the `X` to the left of that domain.
   5.  Scroll to the bottom and click `Save`.

**The application has now been fully configured and ready to serve traffic.**

- Browse to the endpoint URL and the application will be displayed. 
- Click the `Sign In` button to log in using your Google credentials. 
- Once logged in, you can enter a chat message. Those messages are persisted using Firestore and are pushed to other users logged into the chat application.
- The header displays your name and the cloud provider that served the request.


