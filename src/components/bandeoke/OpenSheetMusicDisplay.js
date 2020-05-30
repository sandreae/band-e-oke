
import React, { Component } from 'react';
import { OpenSheetMusicDisplay as OSMD } from 'opensheetmusicdisplay';
import { connect } from "react-redux";
import { PropTypes } from "prop-types";
import * as mediaActions from "../../redux/actions/mediaActions";
import { bindActionCreators } from "redux";
import { toast } from "react-toastify";

class OpenSheetMusicDisplay extends Component {
    constructor(props) {
      super(props);
      this.state = { dataReady: false };
      this.osmd = undefined;
      this.divRef = React.createRef();
    }

    setupOsmd() {
      this.props.actions.scoreLoading('loading')
      const options = {
        autoResize: false,
        renderSingleHorizontalStaffline: true,
        followCursor: false,
        drawingParameters: 'compact',
        disableCursor: false,
      }
      this.osmd = new OSMD(this.divRef.current, options);
      setTimeout(() => this.osmd.load(this.props.file).then(() => {
        this.osmd.render()
        this.props.actions.scoreLoading('ready')
      }), 500);
    }

    componentDidUpdate(){
      if(this.props.playing){
        const cursor = this.osmd.cursor
        cursor.reset()
        cursor.show()
        cursor.updateStyle(0, '#41e9f2')
        // let x = 0
        const audioContext = new AudioContext()
        let startTempo = cursor.iterator.currentMeasure.tempoInBPM
        let currentTime, thisTempo = startTempo, nextTempo = startTempo, tempoChangePointAudioContext = 0, tempoChangePointPlayPosition = 0, playPosition;

        const scheduler = () => {

          let cursorPosition = cursor.iterator.currentTimeStamp.realValue

          if (!this.props.playing) {
            window.clearInterval(playId);
            cursor.reset()
            this.props.actions.offsetScore(-20)
          }

          if (thisTempo !== nextTempo) {
            tempoChangePointAudioContext = audioContext.currentTime
            tempoChangePointPlayPosition = cursorPosition
          }

          thisTempo = cursor.iterator.currentMeasure.tempoInBPM
          currentTime = audioContext.currentTime - tempoChangePointAudioContext
          playPosition = (((cursorPosition - tempoChangePointPlayPosition) * 4) * (60 / thisTempo))

          if (this.props.playing && (playPosition <= currentTime) && !cursor.iterator.endReached) {
              cursor.next()
              nextTempo = cursor.iterator.currentMeasure.tempoInBPM
              this.props.actions.offsetScore(cursor.cursorElement.offsetLeft - 150)
          }
        }
        var playId = window.setInterval(() => scheduler(), 100);
      }
    }

    // Called after render
    componentDidMount() {
      this.setupOsmd();
    }

    render() {
      return (<div ref={this.divRef} />);
    }
  }

  OpenSheetMusicDisplay.propTypes = {
    actions: PropTypes.object.isRequired,
    playing: PropTypes.bool.isRequired,
    file: PropTypes.string.isRequired,
    tempo: PropTypes.string.isRequired,
  };

  function mapStateToProps(state) {
    return {
      playing: state.player.playing
    }
  }

  function mapDispatchToProps(dispatch) {
    return {
      actions: {
        offsetScore: bindActionCreators(mediaActions.offsetScore, dispatch),
        scoreLoading: bindActionCreators(mediaActions.scoreLoading, dispatch)
      }
    }
  }

  export default connect(mapStateToProps, mapDispatchToProps)(OpenSheetMusicDisplay);
