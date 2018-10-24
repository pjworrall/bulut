# MusicNotes ![CI status](https://img.shields.io/badge/build-passing-brightgreen.svg)

MusicNotes is a tool for making notes against a music track. I created it to track guitar licks
I heard and to create relationships to the same lick in other tracks.

The plan is to create:

* a DSL (Domain Specific Language) for querying licks and their provenance so I can
navigate from one track to another to hear it played by another performer
* provide for publishing records to a public global data store for others to use
* use blockchain to attribute rights to the data and provide a Crypto asset for publisher to
receive payment for its use by others

## Installation

### Requirements
* Nodejs
* Meteorjs

`$ meteor run`

## Usage

TBD

## Development
### Todo

* Loading a _comparison_ track
* Volume adjustment
* Timer bug where adding a note stops timer
* Presenting play button when skipping to next track
* Move notes button to controls panel
* Align controls in control panel
* Style note modal window
* Add RDF data support
* Add an Ontology supporting relationships between locations on different tracks
* Provide for two track locations to be related in the node modal window
* Source tracks from a location on the device
* Source tracks from a service like Spotify
* Access track ID3 data
* Slow down a track
* Wind track backwards while listening to audio backwards
* Mute
* Note list view
* Search notes
* Note view
* Load and play tracks from a note
* Show notes in view when tracks play from a note

### Crypto Asset todo's

* Sign a notes
* Publish note into a cloud service
* Search notes in the cloud service
* Load tracks related to notes in the cloud
* Pay for use of a notes
* Report on payments for published notes

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)