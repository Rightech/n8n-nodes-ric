# Glossary

**Automation (automation script)** is an algorithm that specifies the logic of behavior of an
of an object. It is a finite automaton including states and transitions between them.
between them.

**Project Administration** is an area of the platform that allows you to manage the
project team, roles and issue API tokens.

**Argument (in the model)** is a parameter that passes a device to the platform
(e.g., the current sensor measurement). Arguments can be numeric,
boolean, string, or an object or array.

**Bot** is an emulator of the device as a data source built into the platform. Bot
works as a client connected to the platform via MQTT or Wialon IPS protocol.

**Geozone** - a bounded area, line, marker or route on a geographical map.
map. Geofences can be used for entry/exit control in automation scenarios.
automation scenarios.

**Group Actions** - actions that can be applied to several objects at once: change objects, send a command, modify objects, send a command, send a command to a group of objects.
objects: change objects, send a command, change geofence events.

**Two-Factor Authentication (2FA)** - a type of multi-factor authentication,
used for additional protection of the platform user account.

**Action (in the model)** is an operation that is needed to send a command to a
device or to start an automaton.

**Essence Identifier** is a unique name of a platform element used for
recognition when accessing the API.

**Import** - adding a ready-made entity from a file or by reference for
to be used in the project.

**Packet History** - section in the objects interface, where you can get the history of data packets from the device for the selected period.
history of data packets from the device for the selected period.

**Essence Card** - rectangular area for selecting a specific representative of an entity from the list.
representative of an entity from the list. The card contains
some information about the entity, as well as a button to select one of the actions:
API link, create a copy, edit and delete.

**Project Team** - project users with specific roles.

**Command (in an entity)** - an action that can be performed by the device.

**Configuration (in a model)** - type of model node, the value of which can be set in the object interface.
object interface. Configuration is used to store additional
information that does not come in the data packet.

**Configurator** - a program designed to set configurations,
firmware updates, checking the performance of devices. In particular
is used to connect a device to a certain server by specifying its host and port.
its host and port.

**License** - subscription to use the platform with the necessary parameters
for objects, number of users, payment period and other customizable criteria.
customizable criteria.

**Personal Area** - an area of the platform that allows you to manage your profile, settings, projects and payments,
settings, projects and payments of the user.

**Label** - a device attribute that can be added to the object.

**Model** - formalized representation of the device to be connected to the platform.
platform. The model describes the parameters that the device sends and the control commands it can issue.
control commands that it can work.

**Processor** - code that allows to process an input data packet in order to correct or augment it.
for the purpose of correcting or supplementing it. A handler can also be triggered by a webhook.
triggered by a webhook.

**Object** - virtual analog of a particular connected device. Each
object reflects the state of the device and its control capabilities.

**Alerts** - additional indication when a critical message is received: browser push notification, object card icon, "ripples" around the object.
level: browser push-notification, icon on the object card, "ripples" around the object marker on the map, audible indication when a critical message is received.
marker of the object on the map, sound notification.

**Data packet** - a block of data transmitted over the network between the device and the
platform and organized according to one of the data transfer protocols.

**Transition (in automaton)** - moving from one state of automaton to another due to change of process properties.
due to change of process properties. Transitions are initiated by events
that occurred in the control system of the device. Also in the transition can be
additional conditions can also be prescribed in a transition.

**Platform** is the Internet of Things platform that solves a set of
tasks of IoT projects on interaction with devices, providing convenient and
functional web interfaces.

**Subsystem (in a model)** - a type of model node that serves to organize the
model structure, allowing to combine parameters into groups. Subsystem
implies that this node contains several elements in the form of tree structure branches.
branches of the tree structure.

**Port** - number of TCP or UDP network port, which is the point of connection of the device to the platform, depends on the data transfer protocol.
device to the platform, depends on the data transfer protocol.

**Invite to project** - the ability to add a user with a certain role to the project.
role to the project. The invitation can be sent by a link or e-mail.
e-mail address.

**Project** - an isolated space for creating an IoT case, which
contains models, objects, and other entities of the platform. Projects are also
are also used to collaborate on a solution with other users of the
of the platform.

**Bandwidth** - speed with which the platform processes
a certain amount of data per unit of time.

**Data Transfer Protocol** - a system of rules that defines the format of data exchange between different devices.
between different devices. The protocol defines a uniform way of
of message transmission and error handling during software communication
software.

**Test mode (in the handler)** - possibility to test the handler before it is run on the object.
before it is run on the object. In the testing mode some
input data and check the correctness of the output data after execution of the
handler.

**Role in the project** - a mechanism for assigning user access rights to work in the
project.

**Service** - a program module of the platform, which allows to realize separate functionality.
functional capabilities.

**X.509 Certificate** - client certificate, which provides encryption of transmitted data, if the device supports TLS.
encryption of transmitted data, if the device supports TLS. Authenticity
certificate authenticity is checked at the first stage of connection establishment.

**Event** - occurrence of certain conditions, which either was recorded by the
by the object or occurred in applications external to the object of control.

**Messages** - notifications displayed in the platform interface in the messages panel.
messages. Messages are sent from the automaton and can be customized with one of
three levels: informational, important, and critical. For messages of critical
level, the platform provides additional configurable indication.

**State (in the automaton)** - the period of time during which there were no
events involved in the automation scenario operation logic have not been recorded. By
by default, the automaton always has the initial and the final state. Initial
state means the moment when the scenario execution is started, it is used in any automaton.
automaton. The final state means the end of the scenario execution, it is not used in automata with cyclic execution.
is not used in automata with cyclic execution.

**State (in object)** - display in the log of actual data received from the device, connection status and time of the last packet.
from the device, connection status and time of the last packet. Interface
data display interface is formed on the basis of the selected object model.

**Statistics** - display in the object log information about the activity of the device: traffic and number of packets.
of the device: traffic and number of sent commands.

**Essence** - a platform element with certain functionality: model,
object, automation scenario, handler, label, geofence.

**Token** - a unique identifier that the platform uses to
providing access to API with certain rights.

**Node (in the model)** - an element of the tree structure of the model, can be one of the following types: subsystem, argument, configuration, geo-zone.
the following types: subsystem, argument, configuration, action.

**Indication levels** - thresholds of icon and text color change near the value of
of the parameter in the object interface.

**Filter** - search in the list of objects that meet certain criteria. By default
By default, the following presets are available for filters: online, offline, tracked, and alerted.
and with warning.

**Storage** - the amount of memory allocated for storing the data received from the device.
data. If the storage size is exceeded, old data is replaced by newer data.

**Template (model)** - a prepared model structure based on a certain protocol.
protocol.

**Export** - downloading an entity as a file.

**Route Emulation** - automatically navigates the bot along a road graph on a map
between two specified points.

**API** - program interface that allows to use entities of the
entities of the platform for integration with external systems.

**JSON** - JavaScript-based text-based data exchange format.

**HTTP request** - a message sent by a client to initiate a response from a server.
from the server.

**WebSocket** - A communication protocol on top of a TCP connection designed for the
asynchronous exchange of messages between a client and a server in real time.
real time.
