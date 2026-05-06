# n8n Nodes - <img src="logo.svg" width="32" height="32" alt="Rightech IoT Core" align="center"> Rightech IoT Core

This is an n8n community node that provides some basic integration with [<img src="logo.svg" width="16" height="16" alt="Rightech IoT Core" align="center"> Rightech IoT Core (aka RIC)](https://rightech.io/en).
It lets you interact with your IoT devices and automations through the platform.

The [<img src="logo.svg" width="16" height="16" alt="Rightech IoT Core" align="center"> RIC](https://rightech.io/en/about-platform) platform is an intermediate link between devices (sensors, actuators, etc.) on the one hand, and applications on the other.
Platform tools allow developers to create IoT solutions without extra code and developers reuse 90% of that solution to launch similar cases.
RIC is independent of specific equipment and protocols. So, it is easy to combine different devices under one solution.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/sustainable-use-license/) workflow automation platform.

## Contents

- [Installation](#installation)
- [Operations](#operations)
- [Credentials](#credentials)
- [Compatibility](#compatibility)
- [Resources](#resources)

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

## Operations

At the start, this node supports a bare minimum of operations you may need to interact with your IoT devices.

### Objects

- [**Get configuration data and state**](https://rightech.io/en/developers/http/objects#get-one): Reads an entire object configuration and recorded state params.
- [**Get multiple objects**](https://rightech.io/en/developers/http/objects#get-all): Get configuration and state of multiple objects at once.
- [**Updates object configuration**](https://rightech.io/en/developers/http/objects#edit): Updates object configuration parameters based on its model.
- [**Get object telemetry history**](https://rightech.io/en/developers/terms): Get historic telemetry packets for a specific time range.
- [**Send command to the object**](https://rightech.io/en/developers/http/objects#send-command): Sends any assigned command of the object to the device.

### Models

- [**Get model configuration**](https://rightech.io/en/developers/http/models#get-one): Reads an entire model configuration tree.

### Scenarios

- [**Start scenario on an object**](https://rightech.io/en/developers/http/logic#execute-start): Starts a new scenario execution on the object.
- [**Stop scenario on an object**](https://rightech.io/en/developers/http/logic#execute-stop): Stops a running scenario execution on an object.

### Tables

- [**Get data table declaration**](https://rightech.io/en/developers/objects/table): Returns table declaration with column properties.
- [**Get table row**](https://rightech.io/en/developers/objects/table): Returns a specific table row by ID.
- [**Get table rows**](https://rightech.io/en/developers/objects/table): Returns table rows matching selected conditions.

## Credentials

This node supports API Bearer auth credentials using [`rightechIotCoreApi`](credentials/RightechIotCoreApi.credentials.ts) credential. Read more about how to get access tokens here:
- [How to create an access token in RIC platform](https://rightech.io/en/developers/projects/admin#api-tokens)
- [How that access token is used in the API](https://rightech.io/en/developers/http/auth)

By default, credentials point to the public development and demonstration server at [`dev.rightech.io`](https://dev.rightech.io). You can change server to point at your own instance of the platform.

## Compatibility

This node is developed on and tested to work with the following configuration:

- **n8n**: Version 2.15.0 and higher
- **Node.js**: 24.x or higher
- **npm**: 11.6.2 or higher

## Resources

- [n8n community nodes documentation](https://docs.n8n.io/integrations/#community-nodes)
- [<img src="logo.svg" width="16" height="16" alt="Rightech IoT Core" align="center"> RIC resources](https://rightech.io/en)
  - [Introduction](https://rightech.io/en/developers/intro)
  - [Tutorials](https://rightech.io/en/tutorials)
  - [HTTP API](https://rightech.io/en/developers/http)
  - [Connecting devices](https://rightech.io/en/developers/connect)
  - [Forums](https://forum.rightech.io/)
  - [Solutions](https://store.rightech.io/solutions)
  - [Trial downloads](https://rightech.io/en/developers/trial/helm)
