// Overdub template page using a class
import React from "react";
import { PDFObject } from 'react-pdfobject'
import { connect } from "react-redux";
import * as overdubApi from "../../api/overdubApi";
import { PropTypes } from "prop-types";
import * as overdubActions from "../../redux/actions/overdubActions";
import * as newOverdubActions from "../../redux/actions/newOverdubActions";
import * as  backingTrackActions from "../../redux/actions/backingTrackActions";
import * as metaActions from "../../redux/actions/metaActions";
import * as playerActions from "../../redux/actions/playerActions";
import { bindActionCreators } from "redux";
import Overdubs from "./Overdubs";
import AudioMeter from "./AudioMeter";
import Button from "./Button";
import NewOverdubItem from "./NewOverdubItem";
import MediaRecorder from "./MediaRecorder";
import LoadingBar from 'react-redux-loading-bar'
import PdfDownloadLinks from './PdfDownloadLinks'

const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const streamRef = React.createRef()

class Bandeoke extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      uploading: false,
      loadScore: false,
      score: '',
      pdf: this.props.scores[0].pdf,
      backingTrackProcessed: false,
    };

    this.onPlayClick = this.onPlayClick.bind(this);
    this.onStopClick = this.onStopClick.bind(this);
    this.onRecordClick = this.onRecordClick.bind(this);
    this.onSaveClick = this.onSaveClick.bind(this);
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
		this.handleMouseLeave = this.handleMouseLeave.bind(this);
    this.keyboardFunction = this.keyboardFunction.bind(this);
    this.onLoadScoreClick = this.onLoadScoreClick.bind(this);
  }

  componentDidMount() {
    console.log(this.props)
    const { actions, songId, track } = this.props;
    document.addEventListener("keydown", this.keyboardFunction, false);
    actions.setTitle(songId)
    if (this.props.track){
      overdubApi.createBufferFromUrl(audioContext, track)
        .then((buffer) => {
          actions.setBackingTrackBuffer(buffer)
          this.setState(()=> ({backingTrackProcessed: true}))
        })
    } else {
      actions.setBackingTrackBuffer(null)
      this.setState(()=> ({backingTrackProcessed: true}))
    }
    overdubApi.loadOverdubs(audioContext, this.props.songId)
      .then(overdubs=> {
        actions.loadOverdubsSuccess(overdubs)
      })
      .catch(error => {
        console.log("Loading overdubs failed: " + error);
      })
    }

  componentWillUnmount(){
    document.removeEventListener("keydown", this.keyboardFunction, false);
  }

  keyboardFunction(){
    if(event.keyCode === 82) {
      this.props.player.playing ? this.onStopClick() : this.onRecordClick()
    }
    if(event.keyCode === 80) {
      this.props.player.playing ? this.onStopClick() : this.onPlayClick()
    }
  }

  handleMouseEnter = () => {
    this.props.actions.sidebarActive(true)

  };

  handleMouseLeave = () => {
    this.props.actions.sidebarActive(false)
  };

  onPlayClick() {
    this.props.actions.play(true)
  }

  onStopClick() {
    this.props.actions.play(false)
    this.props.player.recording ? this.props.actions.record(false) : null
  }

  onSaveClick() {
    overdubApi.saveAllOverdubs(this.props.overdubs)
    if (this.props.newOverdub.buffer) {
      this.uploadNewOverdub()
    }
  }

  onRecordClick() {
    this.props.actions.record(true)
    this.props.actions.play(true)
  }

  onLoadScoreClick(score) {
    this.setState(state => state.pdf = score.pdf);
  }

  uploadNewOverdub = () => {
    this.setState(() => ({uploading: true}));
    overdubApi.upload(this.props.newOverdub, this.props.meta.title)
      .then(()=>{
        overdubApi.loadOverdubs(audioContext, this.props.songId)
      .then(overdubs=> {
        this.props.actions.loadOverdubsSuccess(overdubs)
        this.props.actions.removeNewOverdub(this.props.newOverdub.url);
        this.setState(() => ({uploading: false}));
      })
    })
    // this.props.actions.upload(this.props.newOverdub)
  }

  renderController(disabled) {
    return (
      <div className="controls-wrapper--flex-column">
        <AudioMeter overdub={this.props.backingTrack} playing={this.props.player.playing} audioContext={audioContext}/>
        <div className="controls-item"><Button disabled={disabled} name={'PLAY'} onClick={this.onPlayClick} /></div>
        <div className="controls-item"><Button disabled={!disabled} name={'STOP'} onClick={this.onStopClick} /></div>
        <div className="controls-item"><Button disabled={disabled || this.props.newOverdub.url !== null} name={'RECORD'} onClick={this.onRecordClick} /></div>
        <div className="controls-item"><Button disabled={disabled} name={'SAVE'} onClick={this.onSaveClick} /></div>
        {this.renderMediaRecorder()}
      </div>
    )
  }

  renderMediaRecorder(){
    if (this.props.media.streamStatus === "NotFoundError"){
      return <div className='media-error audio-meter'></div>
    }
    return (
      <MediaRecorder
        audio
        streamRef={streamRef}
        playing={this.props.player.playing}
        recording={this.props.player.recording}
        audioContext={audioContext}
      />
    )
  }

  renderScore(){
    if (this.state.pdf){
      var fallbackLink = "<div id='fallback-message'>Sorry, your device doesn't support embedded pdf files, please <a href='[url]' target='_blank'>download</a> the score and read locally or try another device</div>"
      return <PDFObject height="100rem" url={this.state.pdf} fallbackLink={fallbackLink}/>
    }
  }

  renderScoreButtons(){
    if (this.props.scores){
      const scoreButtons = this.props.scores.map((item, i) => {
        return <Button key={i} disabled={this.props.player.playing} name={item.name} onClick={() => this.onLoadScoreClick(item)} />
      });
      return scoreButtons
    }
  }

  render() {
    const disabled = this.props.player.playing || this.props.media.scoreStatus === 'loading' || this.state.uploading
    const loading = !this.props.overdubs || !this.state.backingTrackProcessed
    if (loading) return "loading"
    return (
      <div className="app-wrapper">
        <LoadingBar />
          <div
            className={`left-sidebar--flex-column ${this.props.sidebarActive ? 'active' : ''}`}
            onMouseEnter={(e) => { this.handleMouseEnter(e) }}
            onMouseLeave={(e) => { this.handleMouseLeave(e) }}
            onTouchStart={(e) => { this.handleMouseEnter(e) }}
          >

            {this.renderController(disabled)}

            <NewOverdubItem
              songId={this.props.songId}
              disabled={disabled}
              playing={this.props.player.playing}
              audioContext={audioContext}
            />
            <Overdubs
              disabled={disabled}
              playing={this.props.player.playing}
              overdubs={this.props.overdubs}
              audioContext={audioContext}
            />
            <div className="score-buttons-wrapper--flex-row">
              {this.renderScoreButtons()}
            </div>
          </div>
          <div className='score-wrapper' onTouchStart={(e) => { this.handleMouseLeave(e) }}>
            {this.renderScore()}
          </div>
          <footer>
            <PdfDownloadLinks height="100%" scores={this.props.scores}/>
          </footer>
      </div>
    );
  }
}

Bandeoke.propTypes = {
  actions: PropTypes.object.isRequired,
  backingTrack: PropTypes.object,
  media: PropTypes.object.isRequired,
  meta: PropTypes.object.isRequired,
  newOverdub: PropTypes.object.isRequired,
  overdubs: PropTypes.array,
  player: PropTypes.object.isRequired,
  scoreOffset: PropTypes.number.isRequired,
  scores: PropTypes.array.isRequired,
  songId: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  track: PropTypes.string.isRequired,
  sidebarActive: PropTypes.bool,
};

Bandeoke.defaultProps = {
  backingTrack: null,
}

function mapStateToProps(state) {
  return {
    backingTrack: state.backingTrack,
    media: state.media,
    newOverdub: state.newOverdub,
    overdubs: state.overdubs,
    player: state.player,
    scoreOffset: state.media.scoreOffset,
    meta: state.meta,
    sidebarActive: state.player.sidebarActive,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      loadOverdubsSuccess: bindActionCreators(overdubActions.loadOverdubsSuccess, dispatch),
      play: bindActionCreators(playerActions.play, dispatch),
      record: bindActionCreators(playerActions.record, dispatch),
      sidebarActive: bindActionCreators(playerActions.sidebarActive, dispatch),
      setBackingTrackBuffer: bindActionCreators(backingTrackActions.setBackingTrackBuffer, dispatch),
      setTitle: bindActionCreators(metaActions.setTitle, dispatch),
      removeNewOverdub: bindActionCreators(newOverdubActions.removeNewOverdub, dispatch),
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Bandeoke);
