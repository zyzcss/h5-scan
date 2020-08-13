import React, { PureComponent } from 'react';
import jsQR from 'jsqr'
import showScanCode from './utils/show'

export interface ScanFuncProps {
  visible?: boolean;
  onCancel?: (callback: Function) => void
  onOk?: (scanData: string | string[], callback: Function) => void
  multiple?: boolean
}

interface IState {
  codes: string[]
}

class ScanCode extends PureComponent<ScanFuncProps, Readonly<IState>> {
  video: {
    mozSrcObject?: any
  } & HTMLVideoElement | undefined; // video ref
  canvas: HTMLCanvasElement | undefined; // canvas ref
  ctx: CanvasRenderingContext2D | undefined; // canvas ctx
  buffer: MediaStream | undefined;  // video buffer

  basicWidth = 0 // 宽度
  basicHeight = 0 // 高度

  qty = 0 // 计数 用以降低频率

  constructor(props: ScanFuncProps) {
    super(props);
    this.state = {
      codes: [],
    };
  }

  componentDidMount() {
    this.init()
  }

  componentWillUnmount() {
    this.closeCamera()
  }

  componentDidUpdate(preProps: ScanFuncProps) {
    const { visible: preVisible } = preProps
    const { visible } = this.props
    if (visible !== preVisible && !visible) {
      this.setState({
        codes: []
      })
    }
  }

  handleRef = (video: HTMLVideoElement) => {
    this.video = video
  }

  handleCanvas = (canvas: HTMLCanvasElement) => {
    this.canvas = canvas
  }

  // 初始化
  init = () => {
    const { canvas } = this
    if (!canvas) {
      return
    }
    const { width } = window.screen
    const ctx = canvas.getContext('2d');
    if (ctx) {
      this.ctx = ctx
    }
    const pix = 0.6
    // 4: 3的比例
    this.basicWidth = Math.floor(width * pix)
    this.basicHeight = Math.floor(this.basicWidth * 4 / 3)
    const { visible } = this.props
    if (visible) {
      // 打开摄像头
      this.invokingCarera()
      this.forceUpdate()
    }
  }

  // 开启摄像头
  invokingCarera = () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({
        audio: true,
        video: { facingMode: { exact: "environment" } } //true//
      })
        .then((mediaStream) => { this.getVideoStream(mediaStream) })
        .catch(function (error) {
          alert(error)
        })
    } else {
      // 引导下载浏览器
      alert('不支持摄像头调用！')
    }
  }

  // 从video中获取视频流
  getVideoStream = (stream: MediaStream) => {
    this.buffer = stream;
    const video = this.video
    if (!video) {
      return;
    }
    if (video.mozSrcObject !== undefined) {
      video.mozSrcObject = stream;
    } else {
      try {
        video.srcObject = stream;
      } catch (error) {
        video.src = window.URL && window.URL.createObjectURL(stream);
      }
    }
    const playAudioPromise = video.play();
    if (playAudioPromise) {
      playAudioPromise.then(() => {
        console.log('播放成功');
      }).catch(error => {
        alert('ios请点击进行扫描')
      })
      window.requestAnimationFrame(this.drawVideo);
    }
  }

  // 播放video流到canvas
  drawVideo = () => {
    const { video, ctx, basicWidth, basicHeight } = this
    if (!ctx || !video) {
      return;
    }
    ctx.drawImage(video, 0, 0, basicWidth, basicHeight);
    this.qty++
    if (this.qty %= 2) {
      // 每2帧扫描一次
      const { codes } = this.state
      const code = jsQR(ctx.getImageData(0, 0, basicWidth, basicHeight).data, basicWidth, basicHeight);
      if (code && !codes.includes(code.data)) {
        // 扫描成功
        const { multiple, onOk } = this.props
        if (multiple) {
          // 连续扫
          codes.push(code.data)
          this.setState({
            codes: [...codes],
          })
        } else {
          if (onOk) {
            onOk(code.data, () => {
              this.closeCamera()
            })
          }
        }
      }
    }
    requestAnimationFrame(this.drawVideo);
  }

  // 关闭摄像头
  closeCamera = () => {
    if (this.buffer && this.buffer.getTracks) {
      const trackes = this.buffer.getTracks()
      trackes.forEach((media => {
        if (media) {
          media.stop()
        }
      }))
    }
  }

  // 关闭摄像头
  handleClose = () => {
    const { onCancel } = this.props
    if (onCancel) {
      onCancel(() => {
        this.closeCamera()
      })
    }
  }

  // 确定
  handleOk = () => {
    const { onOk } = this.props
    const { codes } = this.state
    if (onOk) {
      onOk(codes, () => {
        this.closeCamera()
      })
    }
  }

  handleIosPlay = () => {
    if (!this.video) {
      return;
    }
    const playAudioPromise = this.video.play()
    if (playAudioPromise) {
      playAudioPromise.then(() => {
        console.log('播放成功');
      }).catch(error => {
        alert('ios请点击进行扫描')
      })
    }
  }

  render() {
    const { visible, multiple } = this.props
    const { codes } = this.state
    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          display: visible ? '' : 'none',
          width: '100vw',
          zIndex: 99,
        }}>
        <video
          src=""
          style={{ visibility: 'hidden', marginTop: -200 }}
          width="1px"
          height="1px"
          ref={this.handleRef}
        >
        </video>
        <div className="capture-wrap" onClick={this.handleIosPlay}>
          <canvas
            id="qr-canvas"
            width={this.basicWidth}
            height={this.basicHeight}
            className="capture"
            ref={this.handleCanvas}
          >
          </canvas>
          <div
            className="btns"
            style={{ width: this.basicWidth }}
          >
            <div
              onClick={this.handleClose}
              style={{ flex: 1 }}
            >
              取消
            </div>
            {multiple && (
              <div
                onClick={this.handleOk}
                style={{ flex: 1 }}
              >
                扫描完毕
            </div>)}
          </div>
          {multiple && (
            <div style={{ overflow: 'auto', height: 100 }}>
              {codes.map(d => (
                <div key={d} style={{ fontSize: 18, color: '#000' }}>{d}</div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default ScanCode;

export const show = showScanCode
