import "@tensorflow/tfjs-backend-webgl"
import * as faceDetection from "@tensorflow-models/face-detection"
import * as mpFaceDetection from "@mediapipe/face_detection"

class Detector {
  detector?: faceDetection.FaceDetector
  el?: HTMLVideoElement

  constructor() {}

  async init(el: HTMLVideoElement) {
    this.el = el

    const model = faceDetection.SupportedModels.MediaPipeFaceDetector
    this.detector = await faceDetection.createDetector(model, {
      runtime: "mediapipe",
      solutionPath: `https://cdn.jsdelivr.net/npm/@mediapipe/face_detection@${
        mpFaceDetection.VERSION
      }`,
    })

    console.log("initialized face detector with video element:", this.el)
  }

  ready(): boolean {
    return !!(this.detector && this.el)
  }

  async detect(input?: faceDetection.FaceDetectorInput) {
    if (!this.detector || !this.el) {
      return Promise.reject("Detector not initialized")
    }
    return this.detector.estimateFaces(input || this.el)
  }
}

export { Detector }
