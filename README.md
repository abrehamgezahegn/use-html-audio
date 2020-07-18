# use-html-audio

A react custom hook for html audio player purpose with queue support.

## Install

using npm:

```
$ npm install use-html-audio
```

using yarn:

```
$ yarn add use-html-audio

```

## Usage

```

import { useHtmlAudio } from "use-html-audio";

const MyComponent = () => {
  const player = useHtmlAudio(hookInputs);

  // player.element should be included somewhere in the jsx
  // it wont affect the UI in any way (it is a hidden <audio> element).
  return <div>{player.element}</div>;
};

```

### hookInputs

| name     |         type         |                  desc                   |
| :------- | :------------------: | :-------------------------------------: |
| queue\*  | [{src:"" , id: "" }] | an array of audio urls with a unique id |
| autoNext |       boolean        | automatically play next track on finish |
| autoPlay |       boolean        |   automatically play the first track    |
| autoLoad |       boolean        |   automatically load the first track    |

### player

| name            |     type     |                     desc                     |
| :-------------- | :----------: | :------------------------------------------: |
| element         | html element | an <audio> tag that should be put in the jsx |
| loading         |   boolean    |                                              |
| duration        | number (sec) |       full length of the current track       |
| currentDuration | number(sec)  |               current duration               |
| progress        |    number    |                                              |
| playing         |   boolean    |                                              |
| currentTrack    |    object    |                                              |
| isMuted         |   boolean    |                                              |
| currentIndex    |    number    |                                              |
| buffering       |   boolean    |                                              |
| audioEnded      |   boolean    |                                              |
| togglePlay      |   funtion    |                                              |
| seekBySec       |   funtion    |              seekByPercent(sec)              |
| seekByPercent   |   funtion    |    seekByPercent(percent), percent = 0-1     |
| playNext        |   function   |
| playPrev        |   funtion    |                                              |
| playAtIndex     |   funtion    |                                              |
| playAtId        |   funtion    |                                              |
| toggleMute      |   funtion    |                                              |
