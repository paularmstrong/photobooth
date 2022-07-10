// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  '@@xstate/typegen': true;
  eventsCausingActions: {
    selectPhotoType: 'SELECT';
    saveMedia: 'DONE';
    render:
      | 'done.state.photobooth.photo'
      | 'done.state.photobooth.video'
      | 'CONFIRM'
      | 'DONE'
      | 'xstate.after(45000)#photobooth.photo.reviewing.selecting'
      | 'done.state.photobooth.video.recording';
  };
  internalEvents: {
    'xstate.after(45000)#photobooth.photo.reviewing.selecting': {
      type: 'xstate.after(45000)#photobooth.photo.reviewing.selecting';
    };
    'xstate.init': { type: 'xstate.init' };
  };
  invokeSrcNameMap: {};
  missingImplementations: {
    actions: never;
    services: never;
    guards: never;
    delays: never;
  };
  eventsCausingServices: {};
  eventsCausingGuards: {};
  eventsCausingDelays: {};
  matchesStates:
    | 'main'
    | 'main.normal'
    | 'main.help'
    | 'photo'
    | 'photo.confirming'
    | 'photo.capturing'
    | 'photo.reviewing'
    | 'photo.reviewing.selecting'
    | 'photo.reviewing.saving'
    | 'photo.reviewing.done'
    | 'photo.done'
    | 'video'
    | 'video.confirming'
    | 'video.recording'
    | 'video.recording.readying'
    | 'video.recording.recording'
    | 'video.recording.saving'
    | 'video.recording.done'
    | 'video.reviewing'
    | 'video.done'
    | {
        main?: 'normal' | 'help';
        photo?: 'confirming' | 'capturing' | 'reviewing' | 'done' | { reviewing?: 'selecting' | 'saving' | 'done' };
        video?:
          | 'confirming'
          | 'recording'
          | 'reviewing'
          | 'done'
          | { recording?: 'readying' | 'recording' | 'saving' | 'done' };
      };
  tags: never;
}
