<template>
  <div class="camera">
    <div class="btn btn-position" @click="callCamera">唤起android相机</div>
    <div class="btn btn-position1" @click="exit1">退出全屏</div>
    <div class="camareWrap" >
      <!-- <video ref="video"></video> -->
      <video
        ref="video"
        x5-video-player-type="h5"
        x5-video-player-fullscreen="true"
        x5-video-orientation="portrait"
        webkit-playsinline="true"
        playsinline="true"
      ></video>
    </div>
  </div>
</template>
<script>
import { setTimeout } from "timers";
// import callCamera from "@/utils/callCamera.js";
export default {
  data() {
    return {
      deviceIds: [],
      isPhone: false,
      agents: [
        "android",
        "iphone",
        "symbianos",
        "windows phone",
        "ipad",
        "ipod"
      ],
      streaming: null
    };
  },
  methods: {
    callCamera() {
      this.appBack();
      if (navigator.mediaDevices === undefined) {
        navigator.mediaDevices = {};
      }

      // 一些浏览器部分支持 mediaDevices。我们不能直接给对象设置 getUserMedia
      // 因为这样可能会覆盖已有的属性。这里我们只会在没有getUserMedia属性的时候添加它。
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
      

      let deviceIdobj = this.isPhone
        ? this.deviceIds.find(d => d.label.indexOf("back") > -1)
        : this.deviceIds[this.deviceIds.length - 1];
      let video = this.$refs.video;
      const _this = this;

      //

      navigator.mediaDevices
        .getUserMedia({
          video: { deviceId: deviceIdobj.deviceId }
        })
        .then(function(stream) {
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
        })
        .catch(function(err) {
          alert(err.name + ": " + err.message);
        });
        this.fullScreen(video);
    },
    fnback() {
      // alert("返回啦");
      if(!this.streaming)return
      const track = this.streaming.getTracks();
      track[0].stop();
      this.streaming = null;
      // this.exitFullScreen(document)
      
    },
    appBack() {
      alert(document.URL);
      let randomnum = Math.random();

      if (window.history && window.history.pushState) {
        history.pushState(null, null, document.URL + randomnum);
        window.addEventListener("popstate", this.fnback, false);
      }
    },
    fullScreen(element) {
      // document.webkitFullscreenElement;
      console.log(element);
      var requestMethod =
        element.requestFullScreen ||
        element.webkitRequestFullScreen ||
        element.mozRequestFullScreen ||
        element.msRequestFullScreen;
      if (requestMethod) {
        requestMethod.call(element);
      } else if (typeof window.ActiveXObject !== "undefined") {
        // var wscript = new ActiveXObject("WScript.Shell");
        // if (wscript !== null) {
        //   wscript.SendKeys("{F11}");
        // }
      }
    },
    exit1() {
      setTimeout(() => this.exitFullScreen(document), 2000);
      // this.exitFullScreen(document)
    },
    exitFullScreen(element) {
      var exitMethod =
        element.exitFullscreen ||
        element.webkitExitFullscreen ||
        element.mozCancelFullScreen ||
        element.msExitFullscreen;
      if (exitMethod) {
        // exitMethod.call(element);
        setTimeout(() => exitMethod.call(element), 2000);
      } else if (typeof window.ActiveXObject !== "undefined") {
        // var wscript = new ActiveXObject("WScript.Shell");
        // if (wscript !== null) {
        //   wscript.SendKeys("{F11}");
        // }
      }
    },
    handleBack() {
      let eventName = ''
      window.addEventListener(
        "webkitfullscreenchange",
        e => {
          // console.log(e)
          e.preventDefault();
          let isFull =
            window.fullScreen ||
            document.webkitIsFullScreen ||
            document.msFullscreenEnabled;
          alert(isFull)
          if (!isFull) {
            const track = this.streaming.getTracks();
            track[0].stop();
            this.streaming = null;
          }
        },
        false
      );
    },
    isFullScreen() {}
  },
  watch: {
    //  streaming(n,o){
    //    if(!n){
    //      setTimeout(()=>this.exitFullScreen(document),2000)
    //    }
    //  }
  },
  beforeMount() {
    console.log("创建前：");
    console.log(window);
  },
  mounted() {
    this.handleBack()

    let userAgentInfo = navigator.userAgent.toLowerCase();

    this.agents.forEach(i => {
      if (userAgentInfo.indexOf(i) > -1) this.isPhone = true;
      return;
    });
    // this.isPhone =
    //   this.agents.findIndex(i => userAgentInfo.indexOf(i) > -1) > -1
    //     ? true
    //     : false;
    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
      alert("不支持 enumerateDevices() .");
      return;
    }
    const _this = this;
    navigator.mediaDevices
      .enumerateDevices()
      .then(devices => {
        console.log(devices);
        devices.forEach(function(device) {
          _this.deviceIds.push(device);
        });
      })
      .catch(function(err) {
        alert(err.name + ": " + err.message);
      });
  },
  destroyed() {
    window.removeEventListener("popstate", this.fnback, false);
  }
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
  left: 0;
  height: auto;
  z-index: 2;
}
.btn-position1 {
  position: absolute;
  top: 0;
  right: 0;
  height: auto;
  z-index: 2;
}
.camareWrap {
  position: relative;
  left: 0;
  top: 0;
  background: #000;
  overflow: hidden;
  /* height: 100%; */
}
.camera {
  height: 100%;
  /* overflow: hidden; */
}

video {
  position: absolute;
  left: 50%;
  top: 50%;
  z-index: 1;
  transform: translate(-50%, -50%);
  transform-origin: 50% 50%;
  height: 0;
  width: 0;
}
.camareWrap:-webkit-full-screen {
  height: 100%;
  width: 100%;
}
.camareWrap::backdrop {
  height: 0;
  display: none;
}
</style>


