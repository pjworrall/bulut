import {Template} from 'meteor/templating';

import {Howl} from 'howler';

import {ReactiveVar} from 'meteor/reactive-var';

import './player.html';

Template.player.onCreated(function () {
    this.sound = undefined;
    this.position = new ReactiveVar();
});

Template.player.onRendered(function () {
    // this.playBtn = ;
    // this.pauseBtn = ;

});


Template.player.helpers({

    position() {
        return Template.instance().position.get();
    },
    tracks() {

        let tracks = [ {file: '25 Miles.mp3' },
            {file: '80s_vibe.mp3'},
            {file: 'Ain\'t No Business.mp3'},
            {file: 'Country Boogie.mp3'},
            {file: 'Flash Chordin\'.mp3'},
            {file: 'graveyard.mp4'}];

        return tracks;
    }

});

Template.player.events({
    'click .js-open'(event, instance) {

        let fileName = instance.find('select[name=track]').value;

        console.log("fileName: " + fileName);

        //audio/rave_digger.mp3

        instance.sound = new Howl({
            src: ['/audio/' + fileName]
        });

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

        // reveal the pause button
        instance.find('#pauseBtn').style.display = 'none';

        // hide play button
        instance.find('#playBtn').style.display = 'block';
    },
    'click #notesBtn'(event, instance) {
        instance.sound.pause();

        let seek = instance.sound.seek();

        let position = parseFloat(Math.round(seek * 100) / 100).toFixed(2);

        instance.position.set(position) ;

        console.log("position=" + position);

        instance.find('#myModal').style.display = 'block';

    },
    'click #modalCloseBtn'(event, instance) {
        instance.find('#myModal').style.display = 'none';
        instance.sound.play();
    }
});
