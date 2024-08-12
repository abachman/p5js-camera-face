import type p5 from "p5"
import { Detector } from "./Detector"
import { Box } from "./Box"

const SIZE = { width: 360, height: 270 }
const SCALE = 2

const sketch = (p5: p5) => {
  let detector: Detector
  let video: p5.Element

  p5.setup = async () => {
    p5.createCanvas(SIZE.width * SCALE, SIZE.height * SCALE)
    p5.frameRate(15)

    // Create a video capture (aka webcam input)
    video = p5.createCapture({
      audio: false,
      video: {
        facingMode: "user",
        width: SIZE.width,
        height: SIZE.height,
        frameRate: {
          ideal: 15,
        },
      },
    })
    video.size(SIZE.width, SIZE.height)
    video.hide()

    detector = new Detector()
    await new Promise((resolve) => {
      video.elt.addEventListener("loadeddata", () => {
        detector.init(video.elt).then(resolve)
      })
    })
  }
  const boxes: Box[] = []

  // smoothed bounding box widths and heights
  p5.draw = () => {
    p5.background(220)
    p5.image(video, 0, 0, SIZE.width * SCALE, SIZE.height * SCALE)

    if (detector.ready()) {
      detector.detect(video.elt).then((faces) => {
        faces.forEach(({ box, keypoints }) => {
          let ebox
          if (
            (boxes.length === 1 && (ebox = boxes[0])) ||
            (ebox = boxes.find((b) => b.probably(box.xMin, box.yMin)))
          ) {
            ebox.smooth(box.xMin, box.yMin, box.width, box.height)
          } else {
            boxes.push(
              (ebox = new Box(box.xMin, box.yMin, box.width, box.height)),
            )
          }

          p5.noFill()
          p5.stroke(255)
          p5.strokeWeight(2)
          p5.ellipseMode(p5.CENTER)
          p5.circle(
            ebox.cx() * SCALE,
            ebox.cy() * SCALE,
            ebox.w * SCALE,
            // ebox.h * SCALE,
          )
        })
      })
    }
  }

  p5.keyPressed = () => {
    if (p5.key === " ") {
      p5.noLoop()
    }
  }
}

export { sketch }
