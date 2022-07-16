// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  '@@xstate/typegen': true;
  eventsCausingActions: {
    renderKeys:
      | 'done.state.photobooth.photo'
      | 'done.state.photobooth.video'
      | 'CONFIRM'
      | 'DONE'
      | 'xstate.after(45000)#photobooth.photo.reviewing.selecting'
      | 'done.invoke.photobooth.photo.saving:invocation[0]'
      | 'done.invoke.photobooth.video.saving:invocation[0]';
  };
  internalEvents: {
    'xstate.after(45000)#photobooth.photo.reviewing.selecting': {
      type: 'xstate.after(45000)#photobooth.photo.reviewing.selecting';
    };
    'done.invoke.photobooth.photo.saving:invocation[0]': {
      type: 'done.invoke.photobooth.photo.saving:invocation[0]';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'done.invoke.photobooth.video.saving:invocation[0]': {
      type: 'done.invoke.photobooth.video.saving:invocation[0]';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'xstate.init': { type: 'xstate.init' };
  };
  invokeSrcNameMap: {
    saveMedia:
      | 'done.invoke.photobooth.photo.saving:invocation[0]'
      | 'done.invoke.photobooth.video.saving:invocation[0]';
  };
  missingImplementations: {
    actions: never;
    services: never;
    guards: never;
    delays: never;
  };
  eventsCausingServices: {
    saveMedia: 'DONE';
  };
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
    | 'photo.saving'
    | 'photo.complete'
    | 'photo.done'
    | 'video'
    | 'video.confirming'
    | 'video.recording'
    | 'video.recording.readying'
    | 'video.recording.recording'
    | 'video.recording.saving'
    | 'video.saving'
    | 'video.reviewing'
    | 'video.done'
    | {
        main?: 'normal' | 'help';
        photo?:
          | 'confirming'
          | 'capturing'
          | 'reviewing'
          | 'saving'
          | 'complete'
          | 'done'
          | { reviewing?: 'selecting' | 'saving' };
        video?:
          | 'confirming'
          | 'recording'
          | 'saving'
          | 'reviewing'
          | 'done'
          | { recording?: 'readying' | 'recording' | 'saving' };
      };
  tags: never;
}
