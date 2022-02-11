This is a simple prometheus exporter for the Tuya WiFi smart air box.
Provides access to the 5 different metrics of:
1. CO2 (Carbon Dioxide)
2. Temperature
3. Humidity
4. VOC (Volatile organic compounds)
5. CH2O (Formaldehyde)

# Obtaining the API key of the device

Please refer to the [instructions at tuyapi](https://github.com/codetheweb/tuyapi/blob/master/docs/SETUP.md) to find the token for the device.

# Configuring the exporter

The exporter requires a single configuration file `config.yml` with the following format:

```yaml
device:
  ip: <ip address of the device>
  id: <device virtual id>
  key: <device key>
  version: <api version, usually 3.3>
```

The http service listens on port `9355`, the metrics are available at `/metrics`.

# Running on docker

This project is also exported on dockerhub and can be run this way:

```bash
# docker run -d --name tuya-exporter \
    -v "/somewhere/local/config.yml:/usr/src/app/config.yml:ro" \
    -e TZ=Europe/Zurich \
    --restart always \
    -p 9355:9355 vexdev/tuya-wifi-smart-air-box-exporter
```