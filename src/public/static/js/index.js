// ====================== SOME VARS ================

if(!env){var env={}}
const address = env.SERVER_ADDRESS || "";
const MOCKUP_ROOM = "room-x";

// ================= CONFIGURE GUI ELEMENTS ======================

class CustomMockup {
    /** A class for manage a mockup with a GUI. */
    constructor(){ 
        this.loadGUI();
        this.configureGUI();
        this.configureControlButtons();
        this.configureSocket();
        this.configureTimers();
        this.configureVariables();
    }

    /** Loads the GUI */
    loadGUI = () => {
        this.image = new CustomImage("image");
        this.connectSerialBtn = new ToogleButton("connectSerialBtn", "button is-light", "button is-light");
        this.updateSerialBtn = new CustomButton("updateSerialBtn");
        this.portSelect = new CustomSelect("portSelect");
        this.btn1 = new ToogleButton("btn1", "button is-light", "button is-black");
        this.btn2 = new ToogleButton("btn2", "button is-light", "button is-black");
        this.btn3 = new ToogleButton("btn3", "button is-light", "button is-black");
        this.ledSocket = new ToogleButton("ledSocket", "led led-on mx-2", "led led-off mx-2");
        this.ledSerial = new ToogleButton("ledSerial", "led led-on mx-2", "led led-off mx-2");
        this.serverConnectBtn = new CustomButton("serverConnectBtn");
        this.serverAddressInput = document.getElementById("serverAddressInput");
    }

    /** Configures Buttons */
    configureGUI = () => {
        this.ledSocket.setEnabled(false);
        this.ledSerial.setEnabled(false);
        setTimeout(this.SuperviseVariablesStreaming, 500);
    }

    /** Configures control buttons events. */
    configureControlButtons = () => {
        this.btn1.on("click", () => this.streamVariables("btn1", this.btn1.isChecked()));
        this.btn2.on("click", () => this.streamVariables("btn2", this.btn2.isChecked()));
        this.btn3.on("click", () => this.streamVariables("btn3", this.btn3.isChecked()));
    }

    /** Configures the socketio events */
    configureSocket = () => {
        this.socket = io.connect(address, {secure: false});
        this.socket.on("connect", this.updateConnectionStatus);
        this.socket.on("disconnect", this.updateConnectionStatus);

        this.socket.on(STREAM_SERVER_WEB, this.updateVideo);
        this.socket.on(DATA_SERVER_WEB, this.receiveVariables);
        this.socket.on(DATA_OK_SERVER_WEB, this.streamVariablesOK);
    }

    /** Configures timers */
    configureTimers = () => {
        this.variablesTimer = new ReusableTimer(this.SuperviseVariablesStreaming, 1000);
    }

    /** Configures variables */
    configureVariables = () => {
        this.variables = new Variables({
            "btn1": false,
            "btn2": false,
            "btn3": false,
        });
    }

    /** locks the GUI elements  */
    lockGUI(){
        this.btn1.setEnabled(false);
        this.btn2.setEnabled(false);
        this.btn3.setEnabled(false);
    }

    /** Unlocks the GUI elements */
    unlockGUI(){
        this.btn1.setEnabled(true);
        this.btn2.setEnabled(true);
        this.btn3.setEnabled(true);
    }

    /** Sets variables on the GUI. */
    setVariablesOnGUI = () => {
        const data = this.variables.values();
        this.btn1.setChecked(data["btn1"]);
        this.btn2.setChecked(data["btn2"]);
        this.btn3.setChecked(data["btn3"]);
    }

    /** Checks the variables updated status and restores the backup if necessary. */
    SuperviseVariablesStreaming = () => {
        // if variables were not received restore the backup.
        if(!this.variables.updated()){
            this.variables.restore();
            this.setVariablesOnGUI();
        }

        // Reset updated variables status and unlock the GUI
        this.variables.setUpdated(false);
        this.variablesTimer.stop();
        this.unlockGUI();
    }

    /** 
     * Updates video frame mjpeg.
     * @param {String} frame - a base64 encoded video frame.
     */
    updateVideo = (frame) => {
        if(typeof frame === 'object'){
            this.image.setBase64Source(frame["webcam"]);
        }else{
            this.image.setBase64Source(frame);
        }
    }

    /**
     * It's called when a socket connection ocurrs.
     */
    updateConnectionStatus = () => {
        const status = this.socket.connected;
        this.ledSocket.setChecked(status);
        if(status){this.socket.emit(JOIN_ROOM_WEB, MOCKUP_ROOM)}
    }

    /** 
     * Receives variables coming from the server. 
     * @param {string} data - received variables
     * */
     receiveVariables = (data) => {
        this.variables.update(data);
        this.setVariablesOnGUI();
        this.socket.emit(DATA_OK_WEB_SERVER);
    }

    /**
     * Streams variables to the server
     * @param {string} key - name of the variable.
     * @param {*} value  - new value of the variable.
     */
    streamVariables = (key, value) => {
        this.variables.set(key, value);
        this.variables.setUpdated(false);

        // Send variables changes to the server
        this.socket.emit(DATA_WEB_SERVER, this.variables.values());

        // Lock the GUI a wait for a response
        this.lockGUI();
        this.variablesTimer.start();
    }

    /**
     * It's called when the server notifies variables were received correctly.
     */
    streamVariablesOK = () => {
        this.variables.setUpdated(true);
    }
}


const mockup = new CustomMockup();
