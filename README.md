# n8n Nodes - <img src="logo.svg" width="32" height="32" alt="Rightech IoT Core" align="center"> Rightech IoT Core

This is an n8n community node that provides some basic integration with [<img src="logo.svg" width="16" height="16" alt="Rightech IoT Core" align="center"> Rightech IoT Core (aka RIC)](https://rightech.io).
It lets you interact with your IoT devices and automations through the platform.

The [<img src="logo.svg" width="16" height="16" alt="Rightech IoT Core" align="center"> RIC](https://rightech.io) platform is an intermediate link between devices (sensors, actuators, etc.) on the one hand, and applications on the other.
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

Supported operations organized by resource type:

### Objects

Objects represent your IoT devices

- **Get configuration data and state**: Reads an entire object configuration and recorded state params.
- **Get multiple objects**: Get configuration and state of multiple objects at once.
- **Create object configuration**: Creates and configures IoT device connection object.
- **Updates object configuration**: Updates object configuration parameters based on its model.
- **Get object event log**: Get events related to the object.
- **Send command to the object**: Sends any assigned command of the object to the device.
- **Get object telemetry history**: Get historic telemetry packets for a specific time range.
- **Send telemetry packet to the object**: Sends a customizable telemetry packet to the object, simulating device data.

### Models

Models define your object configuration shapes

- **Get model configuration**: Reads an entire model configuration tree.

### Scenarios

Automation scenarios enable stateful automations with visual tools

- **Start scenario on an object**: Starts a new scenario execution on the object.
- **Stop scenario on an object**: Stops a running scenario execution on an object.

### Tables

Data tables define arbitrary data shapes and store data

- **Get data table declaration**: Returns table declaration with column properties.
- **Get table row**: Returns a specific table row.
- **Get table rows**: Returns table rows matching selected conditions.

### Events

Event log stores all occurred events

- **Get multiple events**: Get filtered events from the global event log.

### Users

Users of the platform instance

- **Get a user**: Loads platform user information
- **Get multiple users**: Loads multiple platform users at once
- **Create a user**: Creates a new platform user
- **Update a user**: Updates an existing platform user

### Tasks

Maintenance tasks assignable to platform users. Tasks can have different kinds, statuses, and properties defined by kinds.
Tasks expose temporary access to object commands for users in the related service app to enable maintenance scenarios.

- **Get a task**: Loads task information
- **Get multiple tasks**: Loads multiple tasks at once
- **Create a task**: Creates a new task
- **Update a task**: Updates task parameters

### Report builds

Build and load reports designed on the platform.

- **Get a report build**: Loads report build status
- **Get multiple report builds**: Loads multiple builds at once
- **Create a new report build**: You can order to build a previously designed report, which takes some time to prepare data for you
- **Cancel a report build**: Sometimes you may realize that your report build order was too large or simply a mistake
- **Export a report build**: When report is ready you can export the built data in various formats, like tables or JSON

## Credentials

This node supports API Bearer auth credentials using [`rightechIotCoreApi`](credentials/RightechIotCoreApi.credentials.ts) credential.
By default, credentials point to the public development and demo server at [`dev.rightech.io`](https://dev.rightech.io).
You can change server to point at your own instance of the platform.

An API token is required to use the platform's HTTP API.
It is used as a standard [Bearer authentication](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Authentication#bearer) token in [Authorization header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Authorization): `Authorization: Bearer <ACCESS_TOKEN>`.

To create an API token, open the platform web UI and navigate to "Project settings" > "API tokens".
Select an appropriate expiration time - otherwise the new token will be short-lived.
Select the "Scopes" of the API you need for you automation.

> [!TIP]
> A "Scope" is a set of URI available in the API. Each resource and operation in this node requires a certain "Scope" to work.

Click "Issue", and the newly created token will be copied to your clipboard, and also displayed in the window.
Make sure to save it where it's needed since you won't be able to get unencrypted token later.

> [!IMPORTANT]
> The token only works for requests that were marked when it was created.
> If you use other methods, you will get an error `HTTP 403 Forbidden`.
> For security reasons it is not recommended to include "All" methods - instead keep selection as narrow as possible.
> By selecting only certain methods you minimize attack surface if accidentally leak the token.

## Compatibility

This node is developed on and tested to work with the following configuration:

- **n8n**: Version 2.15.0 and higher
- **Node.js**: 24.25.0 or higher
- **npm**: 11.12.1 or higher

## Resources

- [n8n community nodes documentation](https://docs.n8n.io/integrations/#community-nodes)
- [<img src="logo.svg" width="16" height="16" alt="Rightech IoT Core" align="center"> RIC resources](https://rightech.io)
  - [Platform introduction](/docs/intro.md)
  - [Glossary](/docs/terms.md)
  - [Forums](https://forum.rightech.io/)
  - [Solutions](https://store.rightech.io/solutions)
  - [Tech Support](mailto:development@rightech.io)
  - [Cases and examples](https://github.com/Rightech/ric-public)
  - [Trial version](/docs/trial.md)
