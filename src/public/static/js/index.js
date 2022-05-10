// ================== SOME VARS ================
try{ 
    console.log("env: ", env)
  }catch(err){
      console.log("err: ", err);
      var env = {};
  }
  if(!env){env={}}
  const address = env.SERVER_ADDRESS || "";
  console.log("address: ", address);
  let socket = io.connect(address, {secure: false});
  const session = {
      "room": "experiment-x",
  }
  const image = new CustomImage("image");
  const connectSerialBtn = new ToogleButton("connectSerialBtn", "button is-light", "button is-light");
  const updateSerialBtn = new CustomButton("updateSerialBtn");
  const portSelect = new CustomSelect("portSelect");
  const btn1 = new ToogleButton("btn1", "button is-light", "button is-black");
  const btn2 = new ToogleButton("btn2", "button is-light", "button is-black");
  const btn3 = new ToogleButton("btn3", "button is-light", "button is-black");
  const ledSocket = new ToogleButton("ledSocket", "led led-on mx-2", "led led-off mx-2");
  const ledSerial = new ToogleButton("ledSerial", "led led-on mx-2", "led led-off mx-2");
  const serverConnectBtn = new CustomButton("serverConnectBtn");
  const serverAddressInput = document.getElementById("serverAddressInput");
  ledSocket.setEnabled(false);
  ledSerial.setEnabled(false);
  
  connectSerialBtn.on("click", () => {
      let event = null;
      if(!ledSocket.isChecked()){
          event = {"serial": {"connect": portSelect.value()}}
      }else{
          event = {"serial": {"disconnect": null}};
      }
      if(event){
          socket.emit(EVENT_WEB_SERVER, event);
      }
  
  })
  
  updateSerialBtn.on("click", ()=>{
      const event = {"serial": {"ports": []}}
      socket.emit(EVENT_WEB_SERVER, event);
  });
  
  function configure(socket){
          // ================ SOCKETIO EVENTS ================
      console.log("configuring...")
      socket.on("connect", () => {
          console.log("connected: ", socket.id);
          ledSocket.setChecked(true);
          socket.emit(JOIN_ROOM_WEB, "room-x");
      });
  
      socket.on("disconnect", () => {
          ledSocket.setChecked(false);
      });
  
      socket.on(STREAM_SERVER_WEB, (data) => {
          const { webcam } = data;
          image.setBase64Source(webcam);
      });
  
      socket.on(EVENT_SERVER_WEB, (event) => {
          if(event.serial){
              if(event.serial.ports){
                  portSelect.clear();
                  portSelect.setItems(event.serial.ports);
              }
  
              if(event.serial.connection){
                  ledSerial.setChecked(event.serial.connection);
              }
  
          }
      });
  }
  
  configure(socket);
  
  
  serverConnectBtn.on("click", () => {
      const server = serverAddressInput.value;
      console.log("connecting to: ", server);
      if(socket){
          if(socket.connected){
              socket.disconnect();
              socket = null;
          }else{
              socket = io(server, {
                  withCredentials: false,
                  
              });
              configure(socket);
          }
      }else{
          socket = io(server, {withCredentials:false});
          configure(socket);
      }
  });