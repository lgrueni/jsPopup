# jsPopup
jsPopup is a JS Class which allow to show popup on your website.

## Installation
Simply add the js file popup.js to your project and import in the head section of your html
```
<script type="text/javascript" src="Popup.js"¨></script>
```

## Use
When you want to use a popup, you have to create a new instance of the `Popup` class. First argument is the type, second are params. Arguments are detailed in the section [Arguments](README.md#arguments).
```
var myPopup = new Popup('message', {
    title: 'Hello world!',
    body: 'This is the body',
})
```
> Popup is showed direct. If you don't want, add `noDirectShow = true` in the argument `params`.

> A more detailed example is available in the folder "Example"

## Arguments
### Types
The argument `type` can takes followed string values:
- message
- save
- confirm
- error
- noClose
- goodProcess

### Params
The argument `params` is an Object can take followed keys:
- `title` - **Required** - Title of the popup
- `body` - **Required** - Body in HTML of the popup
- `autoCloseTime` - **Optional** - Time after which the popup closes
- `closeCB` - **Optional** - A function which call when popup is close
- `saveCB` - **Optional** - A function which call when save button is pressed. Work only with type `confirm`
- `noDeleteOnClose` - **Optional** - Set it to `true` if you don't want to delete the instance when popup closes (when hidePopup is called)
- `noDirectShow` - **Optional** - Set it to `true` if you don't want to show the popup direct after the instantiation
- `customCSS` - **Optional** - Add custom css (like background or text color) to the popup box

> Depends of the type, some `params` are required. If some of required one is not present, an error will be raised in the console with the name of the missed params.

## Methods
These methods are available if you want to change something
- `showPopup()` Show popup
- `hidePopup()` Hide popup
- `getBodyEl()` Get the body element
- `setTitle(title)` Set title when you want to change it after the instantiation
- `setBody(body)` Set body when you want to change it after the instantiation (only text)
- `setBodyEl(el)` Set body element
