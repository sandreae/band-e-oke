// Overdub template page using a class
import React from "react";
import { connect } from "react-redux";
import { PropTypes } from "prop-types";
import * as overdubActions from "../../redux/actions/overdubActions";
import * as mediaActions from "../../redux/actions/mediaActions";
import * as playerActions from "../../redux/actions/playerActions";
import { bindActionCreators } from "redux";
import VideoGrid from "./VideoGrid";
import AudioPlayer from "./AudioPlayer";
import BackingTrack from "./BackingTrack";
import Button from "./Button";
import OverdubVideo from "./OverdubVideo";
import Score from "./Score";
import track from '../../../public/legal.mp3'
import score from '../../../public/legal-Eb.musicxml'
import ReactMediaRecorder from "./MediaRecorder";
import LoadingBar from 'react-redux-loading-bar'

const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const syncRef = React.createRef()
const streamRef = React.createRef()
const tempo = '140'

class Bandeoke extends React.Component {
  constructor(props) {
    super(props);
    this.onPlayClick = this.onPlayClick.bind(this);
    this.onStopClick = this.onStopClick.bind(this);
    this.onRecordClick = this.onRecordClick.bind(this);
    this.onSaveClick = this.onSaveClick.bind(this);
    this.onChangeStreamClick = this.onChangeStreamClick.bind(this);
    this.keyboardFunction = this.keyboardFunction.bind(this);
  }

  componentDidMount() {
    const { overdubs, actions } = this.props;
    document.addEventListener("keydown", this.keyboardFunction, false);

    if (overdubs.length === 0) {
      actions.loadOverdubs().catch(error => {
        alert("Loading overdubs failed: " + error);
      })
    }
  }

  componentDidUpdate() {
    if ((this.props.media.videoSyncSet === false) && syncRef.current) {
      this.props.actions.setVideoSync(syncRef.current)
    }
  }

  componentWillUnmount(){
    document.removeEventListener("keydown", this.keyboardFunction, false);
  }

  keyboardFunction(){
    if(event.keyCode === 82) {
      console.log('space')
      this.props.player.playing ? this.onStopClick() : this.onRecordClick()
    }
    if(event.keyCode === 32) {
      console.log('space')
      this.props.player.playing ? this.onStopClick() : this.onPlayClick()
    }
  }

  onPlayClick() {
    this.props.actions.play(true)
    syncRef.current.play()
  }

  onStopClick() {
    this.props.actions.play(false)
    this.props.player.recording ? this.props.actions.record(false) : null
    syncRef.current.pause()
    syncRef.current.currentTime = 0
  }

  onSaveClick() {
    this.props.actions.saveOverdubs(this.props.overdubs)
  }

  onRecordClick() {
    let count = 0.5
    let time = audioContext.currentTime
    const actions = this.props.actions

    function scheduler() {
      if(time + count < audioContext.currentTime) {
        window.clearTimeout()
        actions.record(true)
      } else {
        window.setTimeout(scheduler, 10.0)
      }
    }
    scheduler()
    actions.play(true)
  }

  onChangeStreamClick(){
    this.props.actions.videoStream(false)
  }

  renderVideoGrid() {
    if (this.props.overdubs.length === 0) {
      return null
    }
    if (this.props.media.videoSyncSet) {
      return <VideoGrid overdubs={this.props.overdubs} media={this.props.media}/>
    }
    return null
  }

  renderButtons() {
    return (
      <div className='controls-wrapper'>
      <BackingTrack playing={this.props.playing} track={track} ref={syncRef} media={this.props.media} />
      <Button disabled={this.props.playing} name={'PLAY'} onClick={this.onPlayClick} />
      <Button disabled={!this.props.playing} name={'STOP'} onClick={this.onStopClick} />
      <Button disabled={this.props.playing || this.props.newOverdub.url !== null} name={'RECORD'} onClick={this.onRecordClick} />
      <Button disabled={this.props.playing} name={'SAVE'} onClick={this.onSaveClick} />
      </div>
    )
  }

  renderMediaRecorder(){
    if (this.props.media.streamStatus === "NotFoundError"){
      return <div className='media-error'>Sorry, could not detect camera, try with just audio? <Button name='YES' onClick={this.onChangeStreamClick} /></div>
    }
    return (
      <ReactMediaRecorder
        audio
        video={this.props.media.videoStream}
        streamRef={streamRef}
        recording={this.props.recording}
        muted={false}
      />
    )
  }

  render() {
    return (
      <div width='100%'>
      <div id='score-loading-overlay' style={{display: this.props.media.scoreStatus === 'loading' ? 'block' : 'none'}}></div>
      <LoadingBar />
        <div className="flex-column" width='1200px'>
          <div className='flex'>
            {this.renderButtons()}
            {this.renderMediaRecorder()}
            <OverdubVideo />
            <div>
              {this.renderVideoGrid()}
            </div>
          </div>
          <div className='score-wrapper'>
            <Score
            scoreOffset={this.props.scoreOffset}
            playing={this.props.playing}
            score={score}
            tempo={tempo}
            />
          </div>
          <div>
            <AudioPlayer
            backingTrack={track}
            audioContext={audioContext}
            playing={this.props.playing}
            />
          </div>
        </div>
      </div>
    );
  }
}

Bandeoke.propTypes = {
  actions: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  overdubs: PropTypes.array.isRequired,
  playing: PropTypes.bool.isRequired,
  recording: PropTypes.bool.isRequired,
  media: PropTypes.object.isRequired,
  player: PropTypes.object.isRequired,
  scoreOffset: PropTypes.number.isRequired,
  newOverdub: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    loading: state.apiCallsInProgress > 0,
    overdubs: state.overdubs,
    playing: state.player.playing,
    recording: state.player.recording,
    media: state.media,
    player: state.player,
    scoreOffset: state.media.scoreOffset,
    newOverdub: state.newOverdub,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      loadOverdubs: bindActionCreators(overdubActions.loadOverdubs, dispatch),
      saveOverdubs: bindActionCreators(overdubActions.saveOverdubs, dispatch),
      play: bindActionCreators(playerActions.play, dispatch),
      record: bindActionCreators(playerActions.record, dispatch),
      setVideoSync: bindActionCreators(mediaActions.setVideoSync, dispatch),
      videoStream: bindActionCreators(mediaActions.videoStream, dispatch),
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Bandeoke);
