/* global Firebase  */

'use strict';

var app = angular.module('cmagg');

app.value('firebaseRef', new Firebase('https://scorching-torch-3316.firebaseio.com'));

app.factory('PlaylistItemFactory', ['$FirebaseArray', 'metadataService', function ($FirebaseArray, metadataService) {
  return $FirebaseArray.$extendFactory({
    onRemove: function (handler) {
      this.handlers = this.handlers || [];
      var handlers = this.handlers;
      handlers.push(handler);
      this.$watch(function (e) {
        if (e.event === 'child_removed') {
          handlers.forEach(function (handler) {
            handler(e.key);
          });
        }
      });
    },
    add: function (item) {
      var that = this;
      return metadataService.fetch(item.url).then(function (metadata) {
        item.title = metadata.title;
        item.img = metadata.img || null;
        item.type = metadata.label;
        return that.$add(item);
      });
    }
  });
}]);

app.factory('PlaylistFactory', ['$FirebaseObject', '$firebase', function ($FirebaseObject, $firebase) {
  return $FirebaseObject.$extendFactory({
    getItems: function () {
      var items = this.$inst().$ref().child('items');
      return $firebase(items, {arrayFactory: 'PlaylistItemFactory'}).$asArray();
    }
  });
}]);

app.factory('Playlist', ['$firebase', 'firebaseRef', 'uuid4', function ($firebase, firebaseRef, uuid4) {
  var playlists = firebaseRef.child('playlists');
  return function (id) {
    if (id) {
      return $firebase(playlists.child(id), {objectFactory: 'PlaylistFactory'}).$asObject();
    } else {
      id = uuid4.generate();
      var playlist = $firebase(playlists.child(id), {objectFactory: 'PlaylistFactory'});
      playlist.$set({name: 'My awesome playlist', items: [], player: {}});
      return playlist.$asObject();
    }
  };
}]);

app.factory('PlayerFactory', ['$FirebaseObject', function ($FirebaseObject) {
  return $FirebaseObject.$extendFactory({
    play: function (track) {
      this.paused = false;
      this.currentTrack = track;
      this.currentTrack.id = track.$id;
      this.$save();
    },
    toggle: function (paused) {
      this.paused = paused || !this.paused;
      this.$save();
    },
    stop: function () {
      this.paused = false;
      this.currentTrack = null;
      this.$save();
    },
    isCurrent: function (track) {
      return this.currentTrack && this.currentTrack.id === track.$id;
    }
  });
}]);

app.factory('Player', ['$firebase', 'firebaseRef', function ($firebase, firebaseRef) {
  var playlists = firebaseRef.child('playlists');
  return function (id) {
    return $firebase(playlists.child(id).child('player'), {objectFactory: 'PlayerFactory'}).$asObject();
  };
}]);
