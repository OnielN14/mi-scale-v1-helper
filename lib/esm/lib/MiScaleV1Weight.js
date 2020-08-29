/**
 * Credit : https://github.com/Mnkai/OpenXiaomiScale
 * Referenced Source : https://github.com/Mnkai/OpenXiaomiScale/blob/master/app/src/main/java/moe/minori/openxiaomiscale/objects/Weight.java
 *
 * Byte Position Reference : https://github.com/oliexdev/openScale/wiki/Xiaomi-Bluetooth-Mi-Scale
 */
var MiScaleV1Weight = /** @class */ (function () {
    function MiScaleV1Weight(data) {
        this.bufferData = new Uint8Array(data.buffer);
        this.firstByte = this.integer2Binary(this.bufferData[0]);
    }
    MiScaleV1Weight.prototype.integer2Binary = function (number) {
        return (number >>> 0).toString(2).split('').map(function (value) { return parseInt(value); });
    };
    MiScaleV1Weight.prototype.getMeasureSystem = function () {
        if (this.firstByte[7]) {
            return MiScaleV1Weight.MEASURE_TYPE_LBS;
        }
        else if (this.firstByte[3]) {
            return MiScaleV1Weight.MEASURE_TYPE_CATTY;
        }
        else {
            return MiScaleV1Weight.MEASURE_TYPE_KG;
        }
    };
    MiScaleV1Weight.prototype.getWeight = function () {
        var weightBufferData = [];
        weightBufferData.push((this.bufferData[2] & 0xFF).toString(16));
        weightBufferData.push((this.bufferData[1] & 0xFF).toString(16));
        var weightInHexValue = "0x" + weightBufferData.join('');
        var weightValueRaw = parseInt(weightInHexValue, 16);
        var measureSystem = this.getMeasureSystem();
        if (measureSystem === MiScaleV1Weight.MEASURE_TYPE_CATTY || measureSystem === MiScaleV1Weight.MEASURE_TYPE_LBS) {
            return weightValueRaw / 100.0;
        }
        return weightValueRaw / 200.0;
    };
    MiScaleV1Weight.prototype.isStabilized = function () {
        if (this.firstByte[2])
            return true;
        return false;
    };
    MiScaleV1Weight.prototype.isWeightRemoved = function () {
        if (this.firstByte[0])
            return true;
        return false;
    };
    MiScaleV1Weight.MEASURE_TYPE_CATTY = 0;
    MiScaleV1Weight.MEASURE_TYPE_LBS = 1;
    MiScaleV1Weight.MEASURE_TYPE_KG = 2;
    MiScaleV1Weight.BLUETOOTH_DEVICE_NAME = 'MI_SCALE';
    MiScaleV1Weight.BLUETOOTH_SERVICE_WEIGHT_SCALE = '0000181d-0000-1000-8000-00805f9b34fb';
    MiScaleV1Weight.BLUETOOTH_CHARACTERISTIC_WEIGHT_MEASUREMENT = '00002a9d-0000-1000-8000-00805f9b34fb';
    return MiScaleV1Weight;
}());
export default MiScaleV1Weight;
