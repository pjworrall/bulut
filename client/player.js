import {Template} from 'meteor/templating';

import {Howl} from 'howler';

import jsonld from 'jsonld';

import jsmediatags from 'jsmediatags';

import {ReactiveVar} from 'meteor/reactive-var';

import {NoteData} from "../imports/startup/client/localstore";


import './player.html';

Template.player.onCreated(function () {

    this.position = new ReactiveVar();
    this.duration = new ReactiveVar();
    this.timer = new ReactiveVar();

    this.tracks = [{file: '25 Miles.mp3', title: "25 Miles"},
        {file: '80s_vibe.mp3', title: "80's Vibe"},
        {file: 'Ain\'t No Business.mp3', title: "Ain\'t No Business"},
        {file: 'Country Boogie.mp3', title: "Country Boogie"},
        {file: 'Flash Chordin\'.mp3', title: "Flash Chordin'"},
        {file: 'graveyard.mp4', title: "Company Graveyard"}];

    this.currentTrack = 0;

    this.trackID3 = new ReactiveVar();

    // initialise file to first in list
    this.sound = new Howl({
        src: ['/audio/' + this.tracks[0].file]
    });


    this.current = new ReactiveVar(this.tracks[0].title);


});

Template.player.onRendered(function () {
    // this.playBtn = ;
    // this.pauseBtn = ;

});


Template.player.helpers({

    position() {
        return Template.instance().position.get();
    },
    current() {
        return Template.instance().current.get();
    },
    tracks() {
        return Template.instance().tracks;
    },
    duration() {
        return Template.instance().duration.get();
    },
    timer() {
        return Template.instance().timer.get();
    },
    trackID3() {
        return Template.instance().trackID3.get();
    }

});

Template.player.events({
    'click .list-song'(event, instance) {

        let trackIndex = instance.currentTrack = event.target.id;

        console.log("trackIndex: " + trackIndex);

        instance.sound.unload();

        instance.sound = new Howl({
            src: ['/audio/' + instance.tracks[trackIndex].file]
        });

        instance.current.set(instance.tracks[trackIndex].title);

        instance.find('#playList').style.display = 'none';


    },
    'click #playListBtn'(event, instance) {
        // show the play list

        let playlist = instance.find('#playList');

        let display = (playlist.style.display === 'block') ? 'none' : 'block';

        setTimeout(function () {
            playlist.style.display = display;
        }, (display === 'block') ? 0 : 500);

        playlist.className = (display === 'block') ? 'fadein' : 'fadeout';

    },
    'click #playBtn'(event, instance) {

        let self = this;

        let sound = instance.sound;
        sound.play();

        instance.duration.set(Math.round(sound.duration()));

        let timer = document.getElementById('timer');

        function step() {
            let self = this;

            // Determine our current seek position.
            let seek = Math.round(sound.seek() || 0);

            let minutes = Math.floor(seek / 60) || 0;
            let seconds = (seek - minutes * 60) || 0;

            timer.innerHTML = minutes + ':' + (seconds < 10 ? '0' : '') + seconds;

            // If the sound is still playing, continue stepping.
            if (sound.playing()) {
                requestAnimationFrame(step.bind(self));
            }
        }

        requestAnimationFrame(step.bind(self));

        // hide play button
        instance.find('#playBtn').style.display = 'none';

        // reveal the pause button
        instance.find('#pauseBtn').style.display = 'block';
        // reveal the annotation button
        instance.find('#notesBtn').style.display = 'block';

    },
    'click #nextBtn'(event, instance) {

        instance.sound.unload();

        instance.currentTrack = ((instance.currentTrack + 1) >= instance.tracks.length) ? 0 : instance.currentTrack + 1;

        instance.current.set(instance.tracks[instance.currentTrack].title);

        instance.sound = new Howl({
            src: ['/audio/' + instance.tracks[instance.currentTrack].file]
        });

    },
    'click #prevBtn'(event, instance) {

        instance.sound.unload();

        instance.currentTrack = ((instance.currentTrack - 1) < 0) ? instance.tracks.length - 1 : instance.currentTrack - 1;

        instance.current.set(instance.tracks[instance.currentTrack].title);

        instance.sound = new Howl({
            src: ['/audio/' + instance.tracks[instance.currentTrack].file]
        });

    },
    'click #pauseBtn'(event, instance) {
        instance.sound.pause();

        // hide the pause and notes button
        instance.find('#pauseBtn').style.display = 'none';
        instance.find('#notesBtn').style.display = 'none';

        // reveal play button
        instance.find('#playBtn').style.display = 'block';
    },
    'click #notesBtn'(event, instance) {
        instance.sound.pause();

        let seek = instance.sound.seek();

        let position = parseFloat(Math.round(seek * 100) / 100).toFixed(2);

        instance.position.set(position);

        // get the ID3 meta data from the track

        let track = instance.tracks[instance.currentTrack].file;

        console.log("http://localhost:3000/audio/" + track);

        /// todo: this url will need to be derived

        jsmediatags.read("http://localhost:3000/audio/" + track, {
            onSuccess: function (tag) {
                console.log(tag);
                instance.trackID3.set(tag);
            },
            onError: function (error) {
                console.log(':(', error.type, error.info);
            }
        });

        instance.find('#myModal').style.display = 'block';
    },
    'click #modalCloseBtn'(event, instance) {
        instance.find('#myModal').style.display = 'none';
        instance.sound.play();
    },
    'click #modalSaveBtn'(event, instance) {

        let seek = instance.sound.seek();

        let note = instance.find('input[name=note]').value;

        // I want to use JSON-LD here when the object is saved

        // the context will leverage the Ontologies:
        // http://purl.org/ontology/mo/
        // http://purl.org/ontology/chord/

        // Class candidates - mo:Event, mo:Activity,mo:Instrument, mo:Movement
        // mo:MusicArtist, mo:Sound, mo:Track, mo:MusicalExpression,

        // Property candidates - mo:duration, mo:musicbrainz
        // mo:produced_sound, mo:similar_to, mo:time, time:TemporalEntity


        let context = {
            "mo": "http://purl.org/ontology/mo/",
            "dc": "http://purl.org/dc/elements/1.1/",
            "xsd": "http://www.w3.org/2001/XMLSchema#",
            "tl": "http://purl.org/NET/c4dm/timeline.owl#",
            "event": "http://purl.org/NET/c4dm/event.owl#",
            "foaf": "http://xmlns.com/foaf/0.1/",
            "rdfs": "http://www.w3.org/2000/01/rdf-schema#",
            "mn": "http://interition.net/MN/2018/01/"
        };

        let time = {
          "a": "tl:Interval",
          "tl:at":  seek
            // needs tl:duration eg. "PT1H"^^xsd:duration;
        };

        let record = {
            "event": { "event:time": time },
            "mn:note": { "@type": "mn:text", "@value":  note },
            "mn:date": new Date()
        };

       // print out the RDF

        jsonld.compact(record, context, function(err, compacted) {
            console.log(JSON.stringify(compacted, null, 2));
        });

        // store the note record
        NoteData.insert(record);

        instance.find('#myModal').style.display = 'none';
        instance.sound.play();
    }
});
