// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  '@@xstate/typegen': true;
  eventsCausingActions: {
    render: 'DONE' | 'done.state.streamdeck.photo' | 'done.state.streamdeck.video' | 'SELECT' | 'GET_HELP';
  };
  internalEvents: {
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
    | 'photo'
    | 'photo.selecting'
    | 'photo.capturing'
    | 'photo.reviewing'
    | 'photo.done'
    | 'video'
    | 'video.selecting'
    | 'video.recording'
    | 'video.reviewing'
    | 'video.done'
    | 'help'
    | {
        photo?: 'selecting' | 'capturing' | 'reviewing' | 'done';
        video?: 'selecting' | 'recording' | 'reviewing' | 'done';
      };
  tags: never;
}
