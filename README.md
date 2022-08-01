# Melita Profile Filter

|           |                                                                                                   |
| --------- | ------------------------------------------------------------------------------------------------- |
| Name      | Melita Profile Filter                                                                             |
| Version   | v1.0.0                                                                                            |
| DockerHub | [weevenetwork/melita-profile-filter](https://hub.docker.com/r/weevenetwork/melita-profile-filter) |
| Authors   | Mesud Pasic                                                                                       |

- [Melita Profile Filter](#Innotas-water-sensor-decoder)
  - [Description](#description)
  - [Features](#features)
  - [Environment Variables](#environment-variables)
    - [Module Specific](#module-specific)
    - [Set by the weeve Agent on the edge-node](#set-by-the-weeve-agent-on-the-edge-node)
  - [Dependencies](#dependencies)

## Description

Module filters Melita payloads by profile IDs and matched payloads forwards to new endpoint while others forwards to regular next EGRESS module in pipeline.

- Incoming and outgoing payloads looks like this

```js
{
  "applicationID": "201",
  "applicationName": "101857881-102108017-",
  "deviceName": "B0B353FFFE40366A",
  "devEUI": "sLNT//5ANmo=",
  "rxInfo": [
    {
      "gatewayID": "cnb/AC4IAkQ=",
      "time": "2022-07-11T10:44:40.458589Z",
      "timeSinceGPSEpoch": null,
      "rssi": -98,
      "loRaSNR": 8.2,
      "channel": 5,
      "rfChain": 0,
      "board": 21,
      "antenna": 0,
      "location": {
        "latitude": 53.55903244018555,
        "longitude": 9.893827438354492,
        "altitude": 37,
        "source": "UNKNOWN",
        "accuracy": 0
      },
      "fineTimestampType": "NONE",
      "context": "+dHXLA==",
      "uplinkID": "kK0pNEsCSiOIz0uG0WEn3w==",
      "crcStatus": "CRC_OK"
    }
  ],
  "txInfo": {
    "frequency": 868100000,
    "modulation": "LORA",
    "loRaModulationInfo": {
      "bandwidth": 125,
      "spreadingFactor": 7,
      "codeRate": "4/5",
      "polarizationInversion": false
    }
  },
  "adr": true,
  "dr": 5,
  "fCnt": 300,
  "fPort": 3,
  "data": "AAADjQ==",
  "objectJSON": "",
  "tags": {
    "deviceProfileId": "0c86cf8b-a8b2-45b1-ad36-a59c20404b24",
    "deviceProfileName": "Innotas Wasserzähler Aufsatz"
  },
  "confirmedUplink": true,
  "devAddr": "AUIKYQ=="
}
```

## Features

- Filtering Melita payloads based on profile IDs

## Environment Variables

| Environment Variables | type   | Description                                              |
| --------------------- | ------ | -------------------------------------------------------- |
| PROFILE_IDS           | string | List of profile IDs to match                             |
| ACTION_TYPE           | string | Action taken on payload if profile IDs match             |
| NA_ACTION_TYPE        | string | Action taken on payload if profile IDs are not available |

### Module Specific

### Set by the weeve Agent on the edge-node

| Environment Variables | type   | Description                                    |
| --------------------- | ------ | ---------------------------------------------- |
| MODULE_NAME           | string | Name of the module                             |
| MODULE_TYPE           | string | Type of the module (Input, Processing, Output) |
| INGRESS_HOST          | string | Host where app is running                      |
| INGRESS_PORT          | string | Port where app is running                      |
| EGRESS_URLS           | string | HTTP ReST endpoint for the next module         |

## Dependencies

```js
"dependencies": {
    "body-parser": "^1.19.2",
    "express": "^4.17.3",
    "express-winston": "^4.2.0",
    "node-fetch": "^2.6.1",
    "winston": "^3.6.0"
}
```
