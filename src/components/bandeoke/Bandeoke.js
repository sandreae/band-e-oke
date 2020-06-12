// Overdub template page using a class
import React from "react";
import { connect } from "react-redux";
import { PropTypes } from "prop-types";
import * as overdubActions from "../../redux/actions/overdubActions";
import * as mediaActions from "../../redux/actions/mediaActions";
import * as metaActions from "../../redux/actions/metaActions";
import * as playerActions from "../../redux/actions/playerActions";
import { bindActionCreators } from "redux";
import VideoGrid from "./VideoGrid";
import AudioPlayer from "./AudioPlayer";
import BackingTrack from "./BackingTrack";
import Button from "./Button";
import OverdubVideo from "./OverdubVideo";
import Score from "./Score";
import ReactMediaRecorder from "./MediaRecorder";
import LoadingBar from 'react-redux-loading-bar'

const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const syncRef = React.createRef()
const streamRef = React.createRef()
const tempo = '140'

class Bandeoke extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loadScore: false,
      score: '',
    };

    this.onPlayClick = this.onPlayClick.bind(this);
    this.onStopClick = this.onStopClick.bind(this);
    this.onRecordClick = this.onRecordClick.bind(this);
    this.onSaveClick = this.onSaveClick.bind(this);
    this.onChangeStreamClick = this.onChangeStreamClick.bind(this);
    this.keyboardFunction = this.keyboardFunction.bind(this);
    this.onLoadScoreClick = this.onLoadScoreClick.bind(this);
  }

  componentDidMount() {
    const { overdubs, actions, songId } = this.props;
    document.addEventListener("keydown", this.keyboardFunction, false);

    actions.setTitle(songId)

    if (overdubs.length === 0) {
      actions.loadOverdubs(this.props.songId).catch(error => {
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
      this.props.player.playing ? this.onStopClick() : this.onRecordClick()
    }
    if(event.keyCode === 32) {
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

  onLoadScoreClick(score) {
    this.setState(state => state.loadScore = false);
    this.setState(state => state.score = score);
    this.setState(state => state.loadScore = true);
  }

  renderVideoGrid(disabled) {
    if (this.props.overdubs.length === 0) {
      return null
    }
    if (this.props.media.videoSyncSet) {
      return <VideoGrid disabled={disabled} overdubs={this.props.overdubs} media={this.props.media}/>
    }
    return null
  }

  renderButtons(disabled) {
    const playing = this.props.playing
    return (
      <div className='controls-wrapper flex-column'>
      <BackingTrack playing={playing} track={this.props.track} ref={syncRef} media={this.props.media} />
      <Button disabled={disabled} name={'PLAY'} onClick={this.onPlayClick} />
      <Button disabled={!disabled} name={'STOP'} onClick={this.onStopClick} />
      <Button disabled={disabled || this.props.newOverdub.url !== null} name={'RECORD'} onClick={this.onRecordClick} />
      <Button disabled={disabled} name={'SAVE'} onClick={this.onSaveClick} />
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

  renderScore(){
    console.log(this.state.score)
    if (this.state.loadScore){
      return (
        <Score
        scoreOffset={this.props.scoreOffset}
        score={this.state.score}
        tempo={tempo}
        />
      )
    }
  }

  renderScoreButtons(){
    console.log(this.props.scores)
    console.log('hello')
    if (this.props.scores){
      const scoreButtons = this.props.scores.map((item, i) => {
        return <Button key={i} disabled={this.props.playing} name={item.name} onClick={() => this.onLoadScoreClick(item.score)} />
      });
      return scoreButtons
    }
  }

  render() {
    const disabled = this.props.playing || !this.props.audio.overdubsComplete || !this.props.audio.backingTrackComplete
    const loading = this.props.media.scoreStatus === 'loading' || !this.props.audio.overdubsComplete || !this.props.audio.backingTrackComplete
    return (
      <div width='100%'>
      <div id='score-loading-overlay' style={{display: loading ? 'block' : 'none'}}></div>
      <LoadingBar />
        <div className="flex-column" width='1200px'>
          <div><h2>{this.props.title}</h2></div>
          <div className='flex top-panel-wrapper'>
            <div className='flex-column top-panel-wrapper-left'>
              <div className='flex'>
                {this.renderButtons(disabled)}
                {this.renderMediaRecorder()}
                <OverdubVideo
                  disabled={disabled}
                />
              </div>
              <div className="flex-column">
                <div>load score</div>
                <div className="scores flex">
                  {this.renderScoreButtons()}
                </div>
              </div>
            </div>
            {this.renderVideoGrid(disabled)}
          </div>
          <div className='score-wrapper'>
            {this.renderScore()}
          </div>
          <div>
            <AudioPlayer
            backingTrack={this.props.track}
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
  audio: PropTypes.object.isRequired,
  scores: PropTypes.object.isRequired,
  track: PropTypes.string.isRequired,
  songId: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
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
    audio: state.audio,
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
      setTitle: bindActionCreators(metaActions.setTitle, dispatch),
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Bandeoke);
