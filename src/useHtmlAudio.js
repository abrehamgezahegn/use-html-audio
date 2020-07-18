import React, { useEffect, useState, useRef } from "react";

const useHtmlAudio = ({
  queue = [],
  autoNext = false,
  autoPlay,
  hookName,
  autoLoad = false,
  cleanOnFinish = true,
}) => {
  let playImmediately = false;
  const ref = useRef(null);
  const [element, setElement] = useState(null);
  const [currentQueue, setQueue] = useState([]);
  const [currentTrack, setCurrentTrack] = useState();
  const [currentIndex, setIndex] = useState(0);
  const [currentDuration, setCurrentDuration] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isMuted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [audioEnded, setAudioEnded] = useState(false);
  const [buffering, setBuffering] = useState(false);

  /*





  */

  // hook effects
  useEffect(() => {
    console.log("new queue", queue);

    // if no queue is given, ditch effect
    if (!queue) return;

    // if empty queue is given, ditch effect
    if (queue.length === 0) {
      resetPlayer();
      return;
    }

    const currentTrackIndexInNewQueue = queue.findIndex(
      (item) => item.id === currentTrack?.id
    );

    if (currentTrackIndexInNewQueue < 0) {
      // fresh player
      resetPlayer();
    } else {
      // if the current track is in the queue
      setIndex(currentTrackIndexInNewQueue);
    }

    changeQueue(queue);
    // eslint-disable-next-line
  }, [queue]);

  useEffect(() => {
    if (currentQueue.length === 0) return;
    if (autoLoad) changeCurrentTrack(currentQueue[0]);
    // eslint-disable-next-line
  }, [currentQueue]);

  useEffect(() => {
    const progress = (currentDuration / duration) * 100;
    updateProgress(progress);
    // eslint-disable-next-line
  }, [currentDuration]);

  /*







  */

  // controllers
  const changeQueue = (queue) => {
    setQueue(queue);
  };

  const changeCurrentTrack = (track) => {
    setCurrentTrack(track);
    initializeAudio(track);
  };

  const togglePlay = (play) => {
    setPlaying(play);
    if (!ref.current) return;
    if (play) ref.current.play();
    if (!play) ref.current.pause();
  };

  const stop = () => {
    togglePlay(false);
    if (ref.current) ref.current.currentTime = 0;
  };

  const playNext = () => {
    let index = currentIndex;
    const track = currentQueue[++index];
    changeCurrentTrack(track);
    setIndex((prev) => --prev);
    playImmediately = true;
  };

  const playPrev = () => {
    let index = currentIndex;
    const track = currentQueue[--index];
    changeCurrentTrack(track);
    setIndex((prev) => --prev);
    playImmediately = true;
  };

  const playAtIndex = (index) => {
    if (index === currentIndex && playing) return;
    const track = currentQueue[index];
    if (!track) return;
    playImmediately = true;
    changeCurrentTrack(track);
    setIndex(index);
  };

  const playAtId = (id) => {
    const index = currentQueue.findIndex((item) => item.id === id);
    if (index === currentIndex && playing) return;
    if (index < 0) return;
    const track = currentQueue[index];
    changeCurrentTrack(track);
    setIndex(index);
    playImmediately = true;
  };

  const syncIndexWithId = (id) => {
    const index = currentQueue.findIndex((item) => item.id === id);
    if (index < 0) return index;
    setIndex(index);
    return index;
  };

  const seekBySec = (seconds) => {
    ref.current.currentTime = seconds;
  };

  const seekByPercent = (percent) => {
    ref.current.currentTime = percent * duration;
  };

  const toggleMute = () => {
    ref.current.muted = !isMuted;
    setMuted((prev) => !prev);
  };

  const updateProgress = (progress) => {
    setProgress(progress);
  };

  const cleanForNextTrack = () => {
    setDuration(0);
    setCurrentDuration(0);
    setProgress(0);
    setAudioEnded(false);
    setLoading(true);
    setPlaying(false);
    setCurrentTrack({});
    playImmediately = false;
  };

  const resetPlayer = () => {
    if (!currentTrack) return;
    stop();
    cleanForNextTrack();
    setCurrentTrack();
  };

  const initializeAudio = (track) => {
    // updated index
    syncIndexWithId(track.id);

    // initialize audio with event listeners

    const element = React.createElement("audio", {
      id: track.id,
      src: track.src,
      controls: false,
      preload: true,
      ref,
      onPlay,
      onPause,
      onWaiting: onBuffering,
      onPlaying: onPlaying,
      onEnded: onEnded,
      onTimeUpdate,
      onKeyDown,
      onLoadedMetadata: onDataLoaded,
      onSeeked,
      onError,
      onStalled,
    });
    setElement(element);
    if (playImmediately) togglePlay(true);
  };

  /*




  

  */
  // event handlers
  const onBuffering = () => {
    setBuffering(true);
  };

  const onPlaying = () => {
    setBuffering(false);
    // ran into a bug where onDataLoad isn't called
    //so had to set the duration here
    setDuration(ref.current.duration);
  };

  const onDataLoaded = () => {
    setDuration(ref.current.duration);
    setLoading(false);
    if (autoPlay || playImmediately) togglePlay(true);
  };

  const onTimeUpdate = () => {
    setCurrentDuration(ref.current.currentTime);
  };

  const onSeeked = () => {
    console.log("on seeked ");
  };

  const onPause = () => {
    console.log("audio paused");
    setPlaying(false);
  };

  const onPlay = () => {
    setPlaying(true);
    setBuffering(false);
    setLoading(false);
  };

  const onEnded = () => {
    setAudioEnded(true);
    if (cleanOnFinish) cleanForNextTrack();
    else setPlaying(false);
  };

  const onKeyDown = (key) => {
    console.log("on key down", key);
  };

  const onError = (err) => {
    console.log("something happened", err);
  };

  const onStalled = () => {
    console.log("on stalled running");
  };

  return {
    loading,
    duration,
    currentDuration,
    progress,
    playing,
    currentTrack,
    isMuted,
    currentIndex,
    element,
    buffering,
    audioEnded,
    togglePlay,
    seekBySec,
    seekByPercent,
    playNext,
    playPrev,
    playAtIndex,
    playAtId,
    toggleMute,
  };
};

export default useHtmlAudio;
