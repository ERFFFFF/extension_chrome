# Chrome Extension boilerplate created with React Typescript

## Getting started

Create a project based on this boilerplate.

```
$ npx degit https://github.com/sivertschou/react-typescript-chrome-extension-boilerplate.git#christmas <project-name>
```

Navigate to the project directory and install the dependencies.

```
$ npm install
```

To build the extension, and rebuild it when the files are changed, run

```
$ npm start
```

After the project has been built, a directory named `dist` has been created. You have to add this directory to your Chrome browser:

1. Open Chrome.
2. Navigate to `chrome://extensions`.
3. Enable _Developer mode_.
4. Click _Load unpacked_.
5. Select the `dist` directory
  5.1 Downloaded from the release Tab.
  5.2 Build your projects for the dist folder and modify your permission if necesssary in the /public/manifest.json.


If the manifest/code is modified, you need to build again the project with `npm run-script build`

Configuration File (For 5.2 **ONLY**)
-------------------------

Create a `.env` file at the root of the project with the following data:
```
URL_USER_CONNECTED=https://cbjpeg.stream.highwebmedia.com/stream?room=
URL_USER_EXIST=https://chaturbate.com/api/panel_context/
URL_STREAM=https://chaturbate.com/
WATCHERS=anonymous1,anonymous2,anonymous3
```
