// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  '@@xstate/typegen': true;
  eventsCausingActions: {
    selectPhotoType: 'SELECT';
    render:
      | 'done.state.streamdeck.photo'
      | 'done.state.streamdeck.video'
      | 'SELECT'
      | 'DONE'
      | 'xstate.after(45000)#streamdeck.photo.reviewing.selecting';
  };
  internalEvents: {
    'xstate.after(45000)#streamdeck.photo.reviewing.selecting': {
      type: 'xstate.after(45000)#streamdeck.photo.reviewing.selecting';
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
    | 'photo.selecting'
    | 'photo.capturing'
    | 'photo.capturing.zero'
    | 'photo.capturing.one'
    | 'photo.capturing.two'
    | 'photo.capturing.three'
    | 'photo.capturing.done'
    | 'photo.reviewing'
    | 'photo.reviewing.selecting'
    | 'photo.reviewing.saving'
    | 'photo.reviewing.done'
    | 'photo.done'
    | 'video'
    | 'video.selecting'
    | 'video.readying'
    | 'video.recording'
    | 'video.reviewing'
    | 'video.done'
    | {
        main?: 'normal' | 'help';
        photo?:
          | 'selecting'
          | 'capturing'
          | 'reviewing'
          | 'done'
          | { capturing?: 'zero' | 'one' | 'two' | 'three' | 'done'; reviewing?: 'selecting' | 'saving' | 'done' };
        video?: 'selecting' | 'readying' | 'recording' | 'reviewing' | 'done';
      };
  tags: never;
}
