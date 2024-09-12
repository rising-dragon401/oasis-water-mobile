# Get started

```
yarn install
```

```
yarn start
```

Create build

```
eas build --profile development --platform ios
```

```
eas build --profile development --platform android
```

Then run this to preview the app

```
npx expo start --dev-client
```

Local preview

```
eas build -p ios --profile preview --local

```

Submitting to iOS

```
eas build --platform ios
```

```
eas submit -p ios
```

Android development build

```
eas build --platform android --profile development
```

```
npx expo start
```

Creating android build

```
eas build --platform android
```

```
eas submit -p android
```

Trouble shooting

```
npx expo-doctor
```

```
npx expo run:ios
```

```
npx expo prebuild --platform ios
```

Reproduce Testflight crashing locally

```
npx expo start --no-dev --clear
```
