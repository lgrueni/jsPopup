# jsPopup
jsPopup is a JS Class which allow to show popup on your website.

## Installation
Simply add the js file popup.js to your project and import in the head section of your html

## Use
When you want to use a popup, you have to create a new instance of the `Popup` class. First argument is the [type](readme.md#Types), second are params.
```
new Popup('message', {
    title: 'Hello world!',
    body: 'This is the body',
})
```

## Types
The arguments `type` can take followed values:
- message
- save
- confirm
- error
- noClose
- goodProcess
