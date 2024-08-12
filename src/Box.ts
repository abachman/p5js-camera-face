const SMOOTH = 4

class Box {
  x: number
  y: number
  w: number
  h: number

  private xs: number[] = []
  private ys: number[] = []
  private ws: number[] = []
  private hs: number[] = []

  constructor(x: number, y: number, w: number, h: number) {
    this.x = x
    this.y = y
    this.w = w
    this.h = h

    this.xs.push(this.x)
    this.ys.push(this.y)
    this.ws.push(this.w)
    this.hs.push(this.h)
  }

  // is this probably the same box?
  probably(ox: number, oy: number): boolean {
    return (
      Math.sqrt(
        Math.pow(Math.abs(this.x - ox), 2) + Math.pow(Math.abs(this.y - oy), 2),
      ) < 10
    )
  }

  mva(value: number, arr: number[]): number {
    arr.push(value)
    if (arr.length > SMOOTH) {
      arr.shift()
    }
    return arr.reduce((pv, cv) => pv + cv, 0) / arr.length
  }

  cx(): number {
    return this.x + this.w / 2
  }
  cy(): number {
    return this.y + this.h / 2
  }

  smooth(nx: number, ny: number, nw: number, nh: number) {
    this.x = this.mva(nx, this.xs)
    this.y = this.mva(ny, this.ys)
    this.w = this.mva(nw, this.ws)
    this.h = this.mva(nh, this.hs)
  }
}

export { Box }
