/**
 * Credit : https://github.com/Mnkai/OpenXiaomiScale
 * Referenced Source : https://github.com/Mnkai/OpenXiaomiScale/blob/master/app/src/main/java/moe/minori/openxiaomiscale/objects/Weight.java
 *
 * Byte Position Reference : https://github.com/oliexdev/openScale/wiki/Xiaomi-Bluetooth-Mi-Scale
 */
export default class MiScaleV1Weight {
    static MEASURE_TYPE_CATTY: number;
    static MEASURE_TYPE_LBS: number;
    static MEASURE_TYPE_KG: number;
    static BLUETOOTH_DEVICE_NAME: string;
    static BLUETOOTH_SERVICE_WEIGHT_SCALE: string;
    static BLUETOOTH_CHARACTERISTIC_WEIGHT_MEASUREMENT: string;
    private bufferData;
    private firstByte;
    constructor(data: DataView);
    private integer2Binary;
    getMeasureSystem(): number;
    getWeight(): number;
    isStabilized(): boolean;
    isWeightRemoved(): boolean;
}
