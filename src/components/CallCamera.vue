<template>
  
    <div class="camareWrap" v-if="show&&isFull" ref="cwrap">
      <div class="btn btn-position"  @click="exit()">取消</div>
      <!-- <video ref="video"></video> -->
      <video
       
        ref="video"
        id="video"
        height="100%"
        x5-video-player-type="h5"
        x5-video-player-fullscreen="true"
        x5-video-orientation="portrait"
        webkit-playsinline="true"
        playsinline="true"
      ></video>
    </div>
  
</template>
<script>
import jsQR from "jsqr";

export default {
  data() {
    return {
      deviceIds: [],
      isFull: false,
      isPhone: false,
      agents: [
        "android",
        "iphone",
        "symbianos",
        "windows phone",
        "ipad",
        "ipod"
      ],
      streaming: null,
      randomnum: "",
      timer: null
    };
  },
  props: {
    value: {
      type: Object
    },
    show:{
      type:Boolean,
      required:true
    }
  },
  methods: {
    callCamera() {
      if (navigator.mediaDevices === undefined) {
        navigator.mediaDevices = {};
      }

      if (navigator.mediaDevices.getUserMedia === undefined) {
        navigator.mediaDevices.getUserMedia = function(constraints) {
          // 首先，如果有getUserMedia的话，就获得它
          var getUserMedia =
            navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

          // 一些浏览器根本没实现它 - 那么就返回一个error到promise的reject来保持一个统一的接口
          if (!getUserMedia) {
            return Promise.reject(
              new Error("getUserMedia is not implemented in this browser")
            );
          }

          // 否则，为老的navigator.getUserMedia方法包裹一个Promise
          return new Promise(function(resolve, reject) {
            getUserMedia.call(navigator, constraints, resolve, reject);
          });
        };
      }

      let deviceIndex = this.isPhone
        ? this.deviceIds.findIndex(d => d.kind === "videoinput") + 1
        : this.deviceIds.length - 1;

     
     
      const _this = this;

      // alert('full',JSON.stringify(deviceIdobj),deviceIdobj.deviceId )

      navigator.mediaDevices
        .getUserMedia({
          video: { deviceId: this.deviceIds[deviceIndex].deviceId}
          // video: true
        })
        .then(function(stream) {
           let video = _this.$refs.video;
           

          _this.streaming = stream;

          // _this.handleBack()

          if ("srcObject" in video) {
            video.srcObject = stream;
          } else {
            // 防止在新的浏览器里使用它，应为它已经不再支持了
            video.src = window.URL.createObjectURL(stream);
          }
          video.onloadedmetadata = function() {
            video.play();
          };
          _this.scan()
        })
        .catch(function(err) {
          if (err) {
            _this.isFull = false;
            alert('PlayError',err);
            
          }
        });
    },
    fnback() {
      // alert("返回啦");
      if (!this.streaming) return;
      const track = this.streaming.getTracks();
      track[0].stop();
      this.streaming = null;
      // this.exitFullScreen(document)
    },
    appBack() {
      console.log(this.randomnum, document.URL);

      let u = document.URL.replace(this.randomnum, "");
      console.log(u);
      this.randomnum = Math.random();

      if (window.history && window.history.pushState) {
        history.pushState(null, null, u + this.randomnum);
        window.addEventListener("popstate", this.fnback, false);
      }
    },
    fullScreen(element) {
      console.log(element)
      // alert(element)
      var requestMethod =
        element.requestFullScreen ||
        element.webkitRequestFullScreen ||
        element.mozRequestFullScreen ||
        element.msRequestFullScreen;
      if (requestMethod) {
        requestMethod.call(element);
      } else if (typeof window.ActiveXObject !== "undefined") {
      }
      this.isFull = true;
    },
    exit() {
      this.stopTake();
      this.isFull = false;
      this.$emit('update:show',false)
      this.exitFullScreen();
    },
    exitFullScreen() {
      // document.webkitExitFullscreen()
      let element = this.$refs.cwrap
      var exitMethod =
        element.exitFullscreen ||
        element.webkitExitFullscreen ||
        element.mozCancelFullScreen ||
        element.msExitFullscreen;
      if (exitMethod) {
        // exitMethod.call(element);
        setTimeout(() => exitMethod.call(element), 200);
      } else if (typeof window.ActiveXObject !== "undefined") {
        // var wscript = new ActiveXObject("WScript.Shell");
        // if (wscript !== null) {
        //   wscript.SendKeys("{F11}");
        // }
      }
    },
    handleBack() {
      let eventName = "webkitfullscreenchange";
      window.addEventListener(
        "webkitfullscreenchange",
        e => {
          // console.log(e)

          let isFull1 =
            window.fullScreen ||
            document.webkitIsFullScreen ||
            document.msFullscreenEnabled;
          // alert(isFull)
          if (!isFull1 && this.streaming) {
            console.log("stop");
            this.stopTake();
          }
        },
        false
      );
    },
    startTake() {
      //
      console.log(document)
      this.fullScreen(this.$el);
      // this.callCamera();
    },
    stopTake() {
      const track = this.streaming ? this.streaming.getTracks() : null;
      if (!track) return;
      track[0].stop();
      this.streaming = null;
      cancelAnimationFrame(this.timer);
    },
    scan() {
      let canvasImgData = this.takePhoto();

      this.decodePhoto(canvasImgData);
      this.timer = requestAnimationFrame(this.scan);
    },
    takePhoto() {
      const canvas = document.createElement("canvas");
      canvas.width = 200;
      canvas.height = 200;
      const context = canvas.getContext("2d");

      let video = document.querySelector("video");

      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      return context.getImageData(0, 0, canvas.width, canvas.height);
    },

    decodePhoto(canvasImgData) {
      const code = jsQR(
        canvasImgData.data,
        canvasImgData.width,
        canvasImgData.height
      );
      if (code) {
        // alert(JSON.stringify(code))
        // 需要的数据:code.data
        this.$emit("input", code);
        this.exit()
      }
    },
   async init() {
      let userAgentInfo = navigator.userAgent.toLowerCase();

      this.agents.forEach(i => {
        if (userAgentInfo.indexOf(i) > -1) this.isPhone = true;
        return;
      });

      if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
        alert("浏览器不支持调用摄像头");
        return;
      }
      const _this = this;
      try{
        let devices =await navigator.mediaDevices.enumerateDevices()
       
        devices.forEach(function(device) {
            _this.deviceIds.push(device);
          });
          this.startTake()

      }catch(err){
        alert('getDeviceError:'+err)

      }

     
       
     
    }
  },
  watch: {
    streaming(n, o) {
      if (!n || (n && !this.isFull && this.show)) {
        this.exit();
      } else {
      }
    },
    show(n,o){
      console.log(n)
      if(n){
        this.isFull = true
        this.init()
      }
     
    },
    
  },
  beforeMount() {},
  mounted() {
    console.log(this.show)
  },
  
};
</script>
<style scoped>
* {
  margin: 0;
  padding: 0;
}
.btn-position {
  position: absolute;
  top: 0;
  right: 0;
  padding: 5px;
  color: #fff;
  height: auto;
  z-index: 2;
}

.camareWrap {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background: #000;
  overflow: hidden;
  height: 100%;
  z-index: 9999;
}
.camareWrap:fullscreen{
  width: 100%;
  height: 100%;
}

.camera {
  height: 100%;
  /* overflow: hidden; */
}

video {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  
  z-index: 1;
}

.camareWrap::backdrop {
  height: 0;
  display: none;
}

canvas {
  position: absolute;
  border: 1px solid #ccc;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 20;
}
</style>


