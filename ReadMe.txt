# VascTrack

## Introduction
VascTrack can run on iOS or Android. Below are the installation instructions for installing and executing the app on either iOS and Android.

A video demonstration of the application can be seen at this link: https://universityofexeteruk-my.sharepoint.com/:v:/g/personal/js1544_exeter_ac_uk/Ef16onlDEKpKm7PzcJPp9bYBUnX2pC3eYzUjJfhOsxRkDg?e=WTyoc7

## Prerequisites
The following dependencies are required to be installed on your computer to run the application on either iOS or Android.

- Node.js
	- Download from this link: https://nodejs.org/en
- Expo CLI
	- Install via running `npm install -g expo-cli` 

## iOS Installation and Execution Instructions

1. Download Xcode from the App Store and Install
2. Install Homebrew system-wide from the following link: https://brew.sh
3. Install CocoaPods by running the following command in the terminal:

sudo gem install cocoapods


4. Open Xcode and navigate to Settings -> Locations and ensure that command line tools are installed
5. Goto Settings -> Accounts and ensure that you have an account added.
6. Enable Developer Mode on your iPhone. Head to Settings > Privacy & Security > Developer Mode, enable the toggle, and restart your device.
7. Plug the iPhone into the laptop, then head to Window -> Device and Simulators. Your device will appear in the list, click it and allow for any updates/processes to take place.
8. Goto root directory of VascTrack in the terminal.
9. Run the following commands:

npm install
cd ios
pod install
cd ..
open ios/*.xcworkspace


10. The previous command will open an Xcode window. Goto Project Navigator on the left hand side and click on the folder VascTrack. This opens a menu in the main view.
11. Click on the VascTrack target then click on Signing & Capabilities and under the Team option select your account.
12. If a Notification Capabilitie is appearing below this, remove it.
13. Goto root directory of VascTrack in the terminal.
14. Run the following command and select the iPhone you've plugged into your laptop from the list:

npx expo run:ios --device


15. The app will build and then install on the iPhone.
16. Note: The first time you build and install the app on the iPhone, you will need to allow it through the security as it is a development build. Head to Settings > General > VPN & Device Management and allow VascTrack to run



## Android Installation and Execution Instructions

1. Download Android Studio: https://developer.android.com/studio
2. During the installation select "Android Virtual Device (AVD)" to install the emulator component.
3. Once installed, from the Android Studio Welcome screen, select More Actions > Virtual Device Manager.
4. Click the plus and choose a device to create it, follow the steps through to install it, then click the play button to run it. Wait until the virtual device fully opens.
5. Goto root directory of VascTrack in the terminal.
6. Run the following commands:

npm install
cd andoid
./gradlew clean
cd ..
npx expo run:android --device


7. The last command will open a list of devices, choose the virtual device that you have just created.
8. The app will build and then install on the virtual device.