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

Supported operations organized by resource type:

### Objects

Objects represent your IoT devices

- [**Create object configuration**](https://rightech.io/en/developers/http/objects#create): Creates and configures IoT device connection object.
- [**Get configuration data and state**](https://rightech.io/en/developers/http/objects#get-one): Reads an entire object configuration and recorded state params.
- [**Get multiple objects**](https://rightech.io/en/developers/http/objects#get-all): Get configuration and state of multiple objects at once.
- [**Updates object configuration**](https://rightech.io/en/developers/http/objects#edit): Updates object configuration parameters based on its model.
- [**Get object telemetry history**](https://rightech.io/en/developers/terms): Get historic telemetry packets for a specific time range.
- [**Get object event log**](https://rightech.io/en/developers/handlers/create#generate-event): Get events related to the object.
- [**Send command to the object**](https://rightech.io/en/developers/http/objects#send-command): Sends any assigned command of the object to the device.
- [**Send telemetry packet to the object**](https://rightech.io/en/developers/models/protocols): Sends a customizable telemetry packet to the object, simulating device data.

### Models

Models define your object configuration shapes

- [**Get model configuration**](https://rightech.io/en/developers/http/models#get-one): Reads an entire model configuration tree.

### Scenarios

Automation scenarios enable stateful automations with visual tools

- [**Start scenario on an object**](https://rightech.io/en/developers/http/logic#execute-start): Starts a new scenario execution on the object.
- [**Stop scenario on an object**](https://rightech.io/en/developers/http/logic#execute-stop): Stops a running scenario execution on an object.

### Tables

Data tables define arbitrary data shapes and store data

- [**Get data table declaration**](https://rightech.io/en/developers/objects/table): Returns table declaration with column properties.
- [**Get table row**](https://rightech.io/en/developers/objects/table): Returns a specific table row.
- [**Get table rows**](https://rightech.io/en/developers/objects/table): Returns table rows matching selected conditions.

### Events

Event log stores all occurred events

- [**Get multiple events**](https://rightech.io/en/developers/handlers/create#generate-event): Get filtered events from the global event log.

### Users

Users of the platform instance

- [**Get a user**](https://rightech.io/en/developers/projects/admin): Loads platform user information
- [**Get multiple users**](https://rightech.io/en/developers/projects/admin): Loads multiple platform users at once
- [**Create a user**](https://rightech.io/en/developers/projects/admin): Creates a new platform user
- [**Update a user**](https://rightech.io/en/developers/projects/admin): Updates an existing platform user

### Tasks

Maintenance tasks assignable to platform users. Tasks can have different kinds, statuses, and properties defined by kinds.
Tasks expose temporary access to object commands for users in the related service app to enable maintenance scenarios.

- [**Get a task**](https://rightech.io/en/developers/tasks): Loads task information
- [**Get multiple tasks**](https://rightech.io/en/developers/tasks): Loads multiple tasks at once
- [**Create a task**](https://rightech.io/en/developers/tasks): Creates a new task
- [**Update a task**](https://rightech.io/en/developers/tasks): Updates task parameters

### Report builds

Build and load reports designed on the platform.

- [**Get a report build**](https://rightech.io/ru/developers/reports/generate): Loads report build status
- [**Get multiple report builds**](https://rightech.io/ru/developers/reports/generate): Loads multiple builds at once
- [**Create a new report build**](https://rightech.io/ru/developers/reports/generate): You can order to build a previously designed report, which takes some time to prepare data for you
- [**Cancel a report build**](https://rightech.io/ru/developers/reports/generate): Sometimes you may realize that your report build order was too large or simply a mistake
- [**Export a report build**](https://rightech.io/ru/developers/reports/generate): When report is ready you can export the built data in various formats, like tables or JSON

## Credentials

This node supports API Bearer auth credentials using [`rightechIotCoreApi`](credentials/RightechIotCoreApi.credentials.ts) credential. Read more about how to get access tokens here:
- [How to create an access token in RIC platform](https://rightech.io/en/developers/projects/admin#api-tokens)
- [How that access token is used in the API](https://rightech.io/en/developers/http/auth)

By default, credentials point to the public development and demonstration server at [`dev.rightech.io`](https://dev.rightech.io). You can change server to point at your own instance of the platform.

## Compatibility

This node is developed on and tested to work with the following configuration:

- **n8n**: Version 2.15.0 and higher
- **Node.js**: 24.25.0 or higher
- **npm**: 11.12.1 or higher

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
