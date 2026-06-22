# Installation using Helm

### Trial Version of the Rightech IoT Core Platform
You can test the capabilities of our IoT platform for free by installing it locally in an on-premise format! This page contains instructions for installing the 30-day trial version.

### Requirements

- Kubernetes version 1.30+
- Minimum 4 GB of RAM

### Installing MicroK8s

For local installation you can use `microk8s`:

```bash
snap install microk8s --classic
```

After installation, you need to enable the `ingress` and `hostpath-storage` add-ons:

```bash
microk8s enable ingress
microk8s enable hostpath-storage
```

The add-ons may take some time to start.
Wait until their status becomes enabled.

### Installing the Platform

Start the installation using the Helm built into MicroK8s. The helm upgrade --install command will install the chart if it is not yet installed, or update the existing installation:

```bash
microk8s helm upgrade --install rightech oci://ghcr.io/rightech/charts/trial \
  --namespace rightech --create-namespace  \
  --set initWith.adminPassword=PleaseChange2026 \
  --set ingress.host=localhost
```

The installation process will take a few minutes. If successful, the following message will appear:

```txt
Release "rightech" does not exist. Installing it now.
NAME: rightech
LAST DEPLOYED: Fri Mar 13 10:04:34 2026
NAMESPACE: rightech
STATUS: deployed
REVISION: 1
TEST SUITE: None
```

If the installation fails, for example due to a timeout error, try running the command again.


### Configuration File

You can use a `values.yaml` file for installation:

```yaml
initWith:
  adminPassword: PleaseChange2026

ingress:
  host: localhost
  tls:
    enabled: false

inlets:
  mqtt:
    expose:
      type: nodePort
      nodePort: 31883
```

- `initWith.adminPassword` — password for the built-in administrator account.
	⚠️ Make sure to replace it with a secure password before using it in a production environment.

- `ingress.host` — the domain name through which the platform will be accessible.
	For local installation, `localhost` is suitable.


### Verifying the Installation

Wait until all pods reach the `Running` status:

```bash
microk8s kubectl -n rightech get pods
```

```txt
NAME                              READY   STATUS    RESTARTS        AGE
ric-auth-6dd77b9dd4-vn57h         1/1     Running   2 (43s ago)     4m21s
ric-bots-5df78bdfc4-vzts2         1/1     Running   3 (3m57s ago)   4m21s
ric-cmds-c97d577fc-kxj8w          1/1     Running   2 (37s ago)     4m20s
ric-code-5786dd46db-cbclp         1/1     Running   0               4m21s
ric-events-675f8654b7-xjwvw       1/1     Running   2 (39s ago)     4m20s
ric-gate-mqtt-6c5c48d789-2pnkr    1/1     Running   0               4m20s
ric-geo-v2-58668cf56b-85dht       1/1     Running   2 (32s ago)     4m20s
ric-handler-v3-75bd5df6d8-xq5g7   1/1     Running   3 (37s ago)     4m19s
ric-logger-6f4659d884-866rm       1/1     Running   3 (15s ago)     4m21s
ric-logic-v3-0                    1/1     Running   2 (35s ago)     4m20s
ric-mongodb-01-0                  1/1     Running   0               4m20s
ric-notify-v2-5977f4685c-hgnvv    1/1     Running   2 (15s ago)     4m19s
ric-pgts-01-0                     1/1     Running   0               4m20s
ric-rabbitmq-0                    1/1     Running   0               4m20s
ric-redis-0                       1/1     Running   0               4m19s
ric-reports-59448c7cc6-sgt76      1/1     Running   0               4m19s
ric-stats-v2-86b96879b7-ht99v     1/1     Running   0               4m19s
ric-tsdb-5c755cb6ff-lnxrl         1/1     Running   2 (22s ago)     4m19s
ric-web-85fb684b66-d6mnv          1/1     Running   2 (32s ago)     4m19s
ric-ws4-59c7c64d78-swzs4          1/1     Running   0               4m21s
```

After that, the platform will be available at the address specified in `ingress.host`.
With the default settings, open the following in your browser:

- [http://localhost](http://localhost)

and log in using the administrator credentials:

- Login: `rightech-admin`
- Password: the one specified during installation

Create a new device with the MQTT model and try sending data using:

```bash
mosquitto_pub -d \
    --host localhost \
    --port 31883 \
    -i mqtt-rightech-rooj8r \
    -t base/state/temperature \
    -m 36.6
```
