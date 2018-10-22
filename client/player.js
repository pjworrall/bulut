import {Template} from 'meteor/templating';

import {Howl} from 'howler';

import {ReactiveVar} from 'meteor/reactive-var';

import {NoteData} from "../imports/startup/client/localstore";

import './player.html';

Template.player.onCreated(function () {

    this.position = new ReactiveVar();
    this.tracks = [ {file: '25 Miles.mp3', title: "25 Miles" },
        {file: '80s_vibe.mp3', title: "80's Vibe"},
        {file: 'Ain\'t No Business.mp3', title: "Ain\'t No Business"},
        {file: 'Country Boogie.mp3', title: "Country Boogie"},
        {file: 'Flash Chordin\'.mp3', title: "Flash Chordin'"},
        {file: 'graveyard.mp4', title: "Company Graveyard"}];

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
    }

});

Template.player.events({
    'click .list-song'(event, instance) {

        let trackIndex = event.target.id;

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

        let playList = instance.find('#playList');

        (playList.style.display === 'block') ?
            playList.style.display = 'none' : playList.style.display = 'block' ;

    },
    'click #playBtn'(event, instance) {
        instance.sound.play();

        // hide play button
        instance.find('#playBtn').style.display = 'none';

        // reveal the pause button
        instance.find('#pauseBtn').style.display = 'block';
        // reveal the annotation button
        instance.find('#notesBtn').style.display = 'block';

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

        instance.position.set(position) ;

        instance.find('#myModal').style.display = 'block';
    },
    'click #modalCloseBtn'(event, instance) {
        instance.find('#myModal').style.display = 'none';
        instance.sound.play();
    },
    'click #modalSaveBtn'(event, instance) {

        let seek = instance.sound.seek();

        let note = instance.find('input[name=note]').value;

        console.log("note:" + note);

        NoteData.insert({
            type: "Note",
            note: note,
            date: new Date(),
            position: seek,
        });

        instance.find('#myModal').style.display = 'none';
        instance.sound.play();
    }
});
