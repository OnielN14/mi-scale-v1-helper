/**
 * The sample based on : https://googlechrome.github.io/samples/web-bluetooth/automatic-reconnect.html
 */

import MiScaleV1Weight from "mi-scale-v1-helper"

const appShell = document.getElementById('app')

let miScaleDevice: BluetoothDevice | null = null

appShell!.querySelector<HTMLButtonElement>('button')!.onclick = async function(e) {
  console.log("test")

  miScaleDevice = await navigator.bluetooth.requestDevice({
    filters:[
      { name:'MI_SCALE' }
    ],
    optionalServices:
    [MiScaleV1Weight.BLUETOOTH_SERVICE_WEIGHT_SCALE]
  })

  if (miScaleDevice) {
    connect()
    miScaleDevice.ongattserverdisconnected = (ev) => {
      time('Disconnect. Reconnecting...')
      connect()
    }
  }
}

async function connect (): Promise<void> {
  exponentialBackoff(3, 2, 
    async () => {
      let connectedGattServer: BluetoothRemoteGATTServer | null = null

      await miScaleDevice!.gatt!.connect()
      .then(gattServer => {
        time('Connected to Mi Scale v1')
        connectedGattServer = gattServer
        return gattServer.getPrimaryService(MiScaleV1Weight.BLUETOOTH_SERVICE_WEIGHT_SCALE)
      })
      .then((service) => {
        return service.getCharacteristic(MiScaleV1Weight.BLUETOOTH_CHARACTERISTIC_WEIGHT_MEASUREMENT)
      })
      .then(async (characteristic) => {
        await characteristic.startNotifications()
        time('Notification Activated')
        characteristic.oncharacteristicvaluechanged = ({currentTarget}) => {
          const { value } = currentTarget as BluetoothRemoteGATTCharacteristic
          const scaleWeight = new MiScaleV1Weight(value!)

          if (scaleWeight.isStabilized()) {
            console.log(`Weight : ${scaleWeight.getWeight()}`)
          }
        }
      })

      return connectedGattServer!
    },
    () => {
      time('Bluetooth Device Connected')
    },
    () => {
      time('Bluetooth Device Failed to Connect')
    }
  )
}

async function exponentialBackoff(max: number, delay: number, toTry:() => Promise<BluetoothRemoteGATTServer>, success: (gattServer?: BluetoothRemoteGATTServer) => void, fail: () => void): Promise<void> {
  try {
    const result = await toTry()
    success(result)
  } catch(error) {
    if (max === 0) {
      return fail();
    }
    time('Retrying in ' + delay + 's... (' + max + ' tries left)')

    setTimeout(function() {
      exponentialBackoff(--max, delay * 2, toTry, success, fail)
    }, delay * 1000);
  }
}

function time(text: string) {
  console.log('[' + new Date().toJSON().substr(11, 8) + '] ' + text);
}