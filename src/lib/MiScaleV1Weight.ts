/**
 * Credit : https://github.com/Mnkai/OpenXiaomiScale
 * Referenced Source : https://github.com/Mnkai/OpenXiaomiScale/blob/master/app/src/main/java/moe/minori/openxiaomiscale/objects/Weight.java
 * 
 * Byte Position Reference : https://github.com/oliexdev/openScale/wiki/Xiaomi-Bluetooth-Mi-Scale
 */

export default class MiScaleV1Weight {
  public static MEASURE_TYPE_CATTY = 0
  public static MEASURE_TYPE_LBS = 1
  public static MEASURE_TYPE_KG = 2

  public static BLUETOOTH_DEVICE_NAME = 'MI_SCALE'
  public static BLUETOOTH_SERVICE_WEIGHT_SCALE = '0000181d-0000-1000-8000-00805f9b34fb'
  public static BLUETOOTH_CHARACTERISTIC_WEIGHT_MEASUREMENT = '00002a9d-0000-1000-8000-00805f9b34fb'

  private bufferData!: Uint8Array
  private firstByte!: number[]

  constructor (data: DataView) {
    this.bufferData = new Uint8Array(data.buffer)
    this.firstByte = this.integer2Binary(this.bufferData[0])
  }

  private integer2Binary (number: number): number[] {
    return (number >>> 0).toString(2).split('').map((value) => parseInt(value))
  }

  getMeasureSystem (): number {
    if (this.firstByte[7]) {
      return MiScaleV1Weight.MEASURE_TYPE_LBS
    }
    else if (this.firstByte[3]) {
      return MiScaleV1Weight.MEASURE_TYPE_CATTY
    }
    else {
      return MiScaleV1Weight.MEASURE_TYPE_KG
    }
  }

  getWeight (): number {
    const weightBufferData: string[] = []
    weightBufferData.push((this.bufferData[2] & 0xFF).toString(16))
    weightBufferData.push((this.bufferData[1] & 0xFF).toString(16))

    const weightInHexValue = `0x${weightBufferData.join('')}`

    const weightValueRaw = parseInt(weightInHexValue, 16)


    const measureSystem = this.getMeasureSystem()
    if (measureSystem === MiScaleV1Weight.MEASURE_TYPE_CATTY || measureSystem === MiScaleV1Weight.MEASURE_TYPE_LBS) {
      return weightValueRaw / 100.0
    }

    return weightValueRaw / 200.0
  }

  isStabilized (): boolean {
    if (this.firstByte[2]) return true

    return false
  }

  isWeightRemoved (): boolean {
    if (this.firstByte[0]) return true

    return false
  }
}