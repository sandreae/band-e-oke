import React from "react";
import PropTypes from "prop-types";
import webAudioPeakMeter from '../../scripts/WebAudioPeakMeter';
import { connect } from "react-redux";
import * as newOverdubActions from "../../redux/actions/newOverdubActions";
import * as mediaActions from "../../redux/actions/mediaActions";
import { bindActionCreators } from "redux";
import * as overdubApi from "../../api/overdubApi";

function checkMediaConstraint(mediaConstraint) {
  let mediaType = Object.keys(mediaConstraint)[0];
  let constraint = mediaConstraint[mediaType];
  if (constraint) {
    if (typeof constraint !== "boolean" && typeof constraint !== "object") {
      return new Error(
        `The ${mediaType} prop must be either a boolean or MediaTrackConstraints object. Please check your React Media Recorder component`
      );
    }
  }
  if (typeof constraint === "object") {
    let supportedConstraints = navigator.mediaDevices.getSupportedConstraints();
    let unsupportedConstraints = Object.keys(constraint).filter(
      constraint => !supportedConstraints[constraint]
    );
    if (unsupportedConstraints.length > 0) {
      return new Error(
        `The constraint(s) [${unsupportedConstraints.join(
          ","
        )}] which you've supplied to the ${mediaType} prop are unsupported in this browser`
      );
    }
  }
}

let errors = {
  AbortError: "media_aborted",
  NotAllowedError: "permission_denied",
  NotFoundError: "no_specified_media_found",
  NotReadableError: "media_in_use",
  OverconstrainedError: "invalid_media_constraints",
  TypeError: "no_constraints"
};

class ReactMediaRecorder extends React.Component {
  state = {
    status: "idle"
  };
  chunks = [];

  constructor(props) {
    super(props);
    if (!window.MediaRecorder) {
      throw new Error("React Media Recorder: Unsupported browser");
    }
    let {
      audio,
      video,
      blobPropertyBag = video ? { type: "video/mp4" } : { type: "audio/wav" }
    } = props;

    if (Object.prototype.hasOwnProperty.call(props, "muted")) {
      console.warn(
        "React Media Recorder: Please use mute() and unmute() functions available in the render method for muting/unmuting audio. mute prop will be deprecated soon."
      );
    }
    props.muted && (this.state.status += `_muted`);
    this.requiredMedia = {
      audio: typeof audio === "boolean" ? !!audio : audio,
      video: typeof video === "boolean" ? !!video : video
    };
    this.blobPropertyBag = blobPropertyBag;
    this.meterRef = React.createRef()
  }

  componentDidMount = async () => {
    console.log("MEDIA RECORDER MOUNTED")
    const stream = await this.getMediaStream();
    if (this.props.video) {
      await stream.getVideoTracks()[0].applyConstraints({
        width: { min: 200, ideal: 200, max: 800 },
        height: { min: 150, ideal: 150, max: 600 },
        frameRate: {ideal: 5, max: 20}
      })
    }
    if (stream) {
      stream
        .getAudioTracks()
        .forEach(track => (track.enabled = !this.props.muted));
      this.stream = stream;
      this.props.streamRef.current.srcObject = stream

      var meter1 = webAudioPeakMeter();
      var sourceNode = this.props.audioContext.createMediaStreamSource(stream);
      var meterNode = meter1.createMeterNode(sourceNode, this.props.audioContext);
      meter1.createMeter(this.meterRef.current, meterNode, {});
    }
  };
  componentDidUpdate = prevProps => {
    console.log("MEDIA RECORDER UPDATED")
    if (prevProps.muted !== this.props.muted) {
      this.stream
        .getAudioTracks()
        .forEach(track => (track.enabled = !this.props.muted));
    }
    if (this.stream) {
      const isMuted = !this.stream
        .getAudioTracks()
        .every(track => track.enabled);
      if (isMuted && !this.state.status.includes("muted")) {
        this.setState(() => ({
          status: `${this.state.status}_muted`
        }));
      }
      if (!isMuted && this.state.status.includes("muted")) {
        this.setState(() => ({
          status: this.state.status.replace("_muted", "")
        }));
      }
    }
    if (this.props.recording && this.props.recording !== prevProps.recording) {
      this.startRecording()
    }
    if (!this.props.recording && this.props.recording !== prevProps.recording) {
      this.stopRecording()
    }
  };

  componentWillUnmount = () => {
    this.flush();
  };

  flush = () => {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
    }
    this.mediaRecorder = null;
    this.stream = null;
    this.chunks = [];
  };

  muteAudio = mute => {
    if (this.stream) {
      if (this.stream.getAudioTracks().every(track => track.enabled === mute)) {
        this.stream.getAudioTracks().forEach(track => (track.enabled = !mute));
        this.setState(this.state); // Dummy state update.
      }
    }
  };

  getMediaStream = async () => {
    try {
      const stream = await window.navigator.mediaDevices.getUserMedia(
        this.requiredMedia
      );
      return stream;
    } catch (error) {
      this.props.actions.streamStatus(error.name)
      this.setState({ status: errors[error.name] });
    }
  };

  onRecordingStop = () => {
    const blob = new Blob(this.chunks, this.blobPropertyBag);
    const url = URL.createObjectURL(blob);
    if (this.props.whenStopped) {
      this.props.whenStopped(blob, url);
    }
    overdubApi.createBufferFromUrl(this.props.audioContext, url).then((buffer)=>{
      console.log(buffer)
      this.props.actions.setOverdubBlob(url, buffer)
    })
    this.setState({ mediaBlob: blob, mediaUrl: url, status: "stopped" });
  };

  onRecordingActive = ({ data }) => {
    this.chunks.push(data);
  };

  initMediaRecorder = stream => {
    var options = {
      audioBitsPerSecond : 128000,
      videoBitsPerSecond : 100000,
    }

    const mediaRecorder = new MediaRecorder(stream, options);
    mediaRecorder.ondataavailable = this.onRecordingActive;
    mediaRecorder.onstop = this.onRecordingStop;
    mediaRecorder.onerror = () => this.setState({ status: "recorder_error" });
    return mediaRecorder;
  };

  startRecording = async () => {
    if (!this.stream || (this.stream && !this.stream.active)) {
      const stream = await this.getMediaStream();

      if (stream) {
        this.stream = stream;
      } else {
        return;
      }
    }
    this.mediaRecorder = this.initMediaRecorder(this.stream);
    this.chunks = [];
    this.setState({ mediaBlob: null, mediaUrl: null });
    setTimeout(() => {
      this.mediaRecorder.start();
      this.setState({ status: "recording" });
    }, this.props.delay);
    if (this.props.delay > 0) {
      this.setState({ status: "delayed_start" });
    }
  };

  pauseRecording = () => {
    if (this.mediaRecorder && this.mediaRecorder.state === "recording") {
      this.setState({ status: "paused" });
      this.mediaRecorder.pause();
    }
  };

  resumeRecording = () => {
    if (this.mediaRecorder && this.mediaRecorder.state === "paused") {
      this.setState({ status: "recording" });
      this.mediaRecorder.resume();
    }
  };

  stopRecording = () => {
    if (this.mediaRecorder && this.mediaRecorder.state !== "inactive") {
      this.mediaRecorder.stop();
      this.mediaRecorder = null;
    }
  };

  renderVisuals(){
    if (this.props.video){
      return <video muted autoPlay ref={this.props.streamRef} />
    } else {
      return (
        <span>
          <video muted autoPlay ref={this.props.streamRef} style={{display: "none"}}/>
          <div ref={this.meterRef} id="my-peak-meter" style={{width: "200px", height: "150px"}}></div>
        </span>
      )
    }
  }

  render(){
    return (
      <div className='flex-column media-stream-wrapper'>
        {this.renderVisuals()}
        <p>{status}</p>
      </div>
    )
  }
}

ReactMediaRecorder.propTypes = {
  audio: ({ audio }) => checkMediaConstraint({ audio }),
  video: ({ video }) => checkMediaConstraint({ video }, true),
  delay: PropTypes.number,
  muted: ({ muted, audio, video }) => {
    if (typeof muted !== "boolean") {
      return new Error(
        `Invalid prop: muted should be a boolan value. Please check your react-media-recorder component declaration`
      );
    }
    if (muted && (audio && !video)) {
      return new Error(
        `It looks like you tried to mute as well as record audio. Please check your react-media-recorder component declaration`
      );
    }
  },
  render: PropTypes.func.isRequired,
  blobPropertyBag: PropTypes.object,
  whenStopped: PropTypes.func,
  audioContext: PropTypes.object.isRequired,
  streamRef: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
  recording: PropTypes.bool.isRequired,
  streamStatus: PropTypes.string.isRequired,
};

ReactMediaRecorder.defaultProps = {
  audio: true,
  muted: false,
  delay: 0,
  render: () => null,
  whenStopped: () => null
};

function mapStateToProps(state) {
  return {
    streamStatus: state.media.streamStatus
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      setOverdubBlob: bindActionCreators(newOverdubActions.setOverdubBlob, dispatch),
      streamStatus: bindActionCreators(mediaActions.streamStatus, dispatch),
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ReactMediaRecorder);
