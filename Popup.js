class Popup {
    /**
     * Popup with full options
     * @param {String} _type Type of popup
     * @param {String} _params.title Title of popup
     * @param {String} _params.body HTML body
     * @param {Integer} _params.autoCloseTime Time[ms] after popup will be close
     * @param {Function} [_params.closeCB] Callback on close
     * @param {Function} [_params.saveCB] Callback on save
     * @param {Boolean} [_params.noDeleteOnClose] True to not delete instance when popup is close
     * @param {Boolean} [_params.noDirectShow] Not show popup at the end of init
     * @param {String} [_params.customCSS] Custom CSS of popup box
     */
     constructor(_type = 'message', _params = {}) {
        this.popupTemplate = popupsTemplates[_type];
        
        this.params = _params;
        this.params.autoClose = Boolean(this.params.autoCloseTime)

        this.popupID = new Date().getTime();

        var paramsKeys = Object.keys(this.params)
        var test = true;
        this.popupTemplate.requiredArgs.forEach(_arg => {
            if(!paramsKeys.includes(_arg)) {
                test = false;
            }
        });

        if(!test) {
            console.error("Missing a parameter in popup init\nRequired: " + this.popupTemplate.requiredArgs + '\nReceived: ' + paramsKeys)
            return;
        }

        this.createPopupEl();
    }

    createPopupEl() {
        var self = this;

        this.popupEl = document.createElement('div');

        this.popupEl.id = 'popup' + this.popupID;
        this.popupEl.classList.add('popup')
        this.popupEl.innerHTML = '';

        if(this.popupTemplate.css) {
            this.popupEl.innerHTML += '<style>' + this.popupTemplate.css + '</style>'
        }
        
        this.popupEl.innerHTML += this.popupTemplate.html;
        this.popupEl.querySelector('#popupTitle').innerHTML = this.params.title
        this.popupEl.querySelector('#popupBody').innerHTML = this.params.body

        if(this.params.customCSS) {
            this.popupEl.querySelector('#popupLegend').style = this.params.customCSS
        }

        if(this.popupEl.querySelector('#popupButtonClose')) {
            this.popupEl.querySelector('#popupButtonClose').addEventListener('click', function(){self.hidePopup()})
        }
        if(this.popupEl.querySelector('#popupButtonSave')) {
            this.popupEl.querySelector('#popupButtonSave').addEventListener('click', function(){self.saveAndHidePopup()})
        }
        if(this.popupEl.querySelector('#popupButtonConfirm')) {
            this.popupEl.querySelector('#popupButtonConfirm').addEventListener('click', function(){self.confirmAndHidePopup()})
        }

        document.body.appendChild(this.popupEl)

        if(!this.params.noDirectShow) {
            this.showPopup();
        }
    }

    /****************************************************/
    /*  Visibility                                      */
    /****************************************************/
    showPopup() {
        this.popupEl.style.display = 'block';

        if(this.params.autoClose) {
            this.setAutoClose(this.params.autoCloseTime)
        }
    }
    
    hidePopup() {
        if(this.params.closeCB) {
            this.params.closeCB()
        }

        this.popupEl.style.display = 'none';

        if(!this.params.noDeleteOnClose) {
            document.body.removeChild(document.getElementById('popup' + this.popupID))
            delete this;
        }
    }
    saveAndHidePopup() {
        if(this.params.saveCB) {
            this.params.saveCB();
        }
        this.hidePopup()
    }
    confirmAndHidePopup() {
        if(this.params.confirmCB) {
            this.params.confirmCB();
        }
        this.hidePopup();
    }

    /****************************************************/
    /*  Getters                                         */
    /****************************************************/
    getBodyEl() {
        return this.bodyEl;
    }

    /****************************************************/
    /*  Setters                                         */
    /****************************************************/
    setTitle(_newTitle) {
        this.popupEl.querySelector('#popupTitle').innerHTML = _newTitle;
    }
    setBody(_newBody) {
        this.popupEl.querySelector('#popupBody').innerHTML = _newBody;
    }
    setBodyEl(_el) {
        this.bodyEl = _el;

        this.setBody('');
        this.popupEl.querySelector('#popupBody').appendChild(_el);
    }
    setAutoClose(_time) {
        var self = this; 

        this.popupEl.querySelector('#popupProgressBarContainer').style.display = 'block';
        var counterGoal = _time / 10;
        var counter = 0;
        var popupAutocloseInterval = setInterval(function() {
            counter ++;
            if(counter >= counterGoal) {
                clearInterval(popupAutocloseInterval)
                self.popupEl.querySelector('#popupProgressBarContainer').style.display = 'none';
                self.hidePopup();
            }
            else {
                self.popupEl.querySelector('#popupProgressBar').style.width = (counter / counterGoal * 100) + '%';
            }
        }, 10)
    }
}

/****************************************************/
/*  Templates                                       */
/****************************************************/
var messagePopup = {
    html: `
    <div id="popupLegend" class="insideBlock">
        <div id="popupProgressBarContainer" class="popupProgressBar">
            <div id="popupProgressBar" class="bar"></div>
        </div>
        <div id="popupTitle" class="title"></div>
        <hr>
        <div id="popupBody" class="body"></div>
        <button id="popupButtonClose">Close</button>
    </div>
    `,
    requiredArgs: ['title', 'body']
}

var confirmPopup = {
    html: `
    <div id="popupLegend" class="insideBlock">
        <div id="popupProgressBarContainer" class="popupProgressBar">
            <div id="popupProgressBar" class="bar"></div>
        </div>
        <div id="popupTitle" class="title"></div>
        <hr>
        <div id="popupBody" class="body"></div>
        <button id="popupButtonClose">Close</button>
        <button id="popupButtonConfirm">Confirm</button>
    </div>
    `,
    requiredArgs: ['title', 'body', 'confirmCB']
}

var savePopup = {
    html: `
    <div id="popupLegend" class="insideBlock">
        <div id="popupProgressBarContainer" class="popupProgressBar">
            <div id="popupProgressBar" class="bar"></div>
        </div>
        <div id="popupTitle" class="title"></div>
        <hr>
        <div id="popupBody" class="body"></div>
        <button id="popupButtonClose">Close</button>
        <button id="popupButtonSave">Confirm</button>
    </div>
    `,
    css: `
    .textArea {
        width: -webkit-fill-available;
        font-size: 25px;
        font-family: Calibri;
    };
    `,
    requiredArgs: ['title', 'body', 'saveCB']
}

var errorPopup = {
    html: `
    <div id="popupLegend" class="insideBlock insideBlockError">
        <div id="popupProgressBarContainer" class="popupProgressBar">
            <div id="popupProgressBar" class="bar"></div>
        </div>
        <div id="popupTitle" class="title"></div>
        <hr>
        <div id="popupBody" class="body"></div>
        <button id="popupButtonClose">Close</button>
    </div>
    `,
    css: `
    .insideBlockError {
        background-color: rgb(255, 199, 206) !important;
        color: rgb(156, 0, 6) !important;
    };
    `,
    requiredArgs: ['title', 'body']
}

var noClosePopup = {
    html: `
    <div id="popupLegend" class="insideBlock">
        <div id="popupProgressBarContainer" class="popupProgressBar">
            <div id="popupProgressBar" class="bar"></div>
        </div>
        <div id="popupTitle" class="title"></div>
        <hr>
        <div id="popupBody" class="body"></div>
    </div>
    `,
    requiredArgs: ['title', 'body']
}

var goodProcessPopup = {
    html: `
    <div id="popupLegend" class="insideBlock insideBlockGoodProcess">
        <div id="popupProgressBarContainer" class="popupProgressBar">
            <div id="popupProgressBar" class="bar"></div>
        </div>
        <div id="popupTitle" class="title"></div>
        <hr>
        <div id="popupBody" class="body"></div>
        <button id="popupButtonClose">Close</button>
    </div>
    `,
    css: `
    .insideBlockGoodProcess {
        background-color: rgb(198, 239, 206) !important;
        color: rgb(0, 97, 0) !important;
    };
    `,
    requiredArgs: ['title', 'body'],
}

//Key is popup type
var popupsTemplates = {
    message: messagePopup,
    save: savePopup,
    confirm: confirmPopup,
    error: errorPopup,
    noClose: noClosePopup,
    goodProcess: goodProcessPopup,
}

//Put CSS in head
var popupStyle = document.createElement('style')
popupStyle.innerHTML = `
.popup {
    display: none;
    position: fixed;
    left: 0px;
    top: 0px;
    background-color: rgba(0, 0 ,0 , 0.5);
    width: 100%;
    height: 100%;
    z-index: 1;
}
.popup .insideBlock {
    margin: 10% auto;
    width : fit-content;
    max-width: 80%;
    min-width: 20%;
    background-color: white;
    padding: 1em;
    box-shadow: 0 15px 20px rgba(0, 0, 0, 0.3);
    border-radius: 5px;
    color: var(--TrackBodyText);
    overflow: auto;
}

.popup .insideBlock .popupProgressBar {
    width: 100%;
    display: none;
}
.popup .insideBlock .popupProgressBar .bar {
    width: 1%;
    height: 3px;
    margin-bottom: 3%;
    background-color: black;
}

.popup .insideBlock .title {
    font-size: 1.2em;
    font-weight: bold;
    text-align: left;
}
.popup .insideBlock .body {
    font-size: 1em;
}
.popup .insideBlock button {
    padding: 0.5em;
    font-size: 1em;
    float: right;
}`
document.getElementsByTagName('head')[0].appendChild(popupStyle)