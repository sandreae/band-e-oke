import React from 'react'
import { PropTypes } from "prop-types";

const BackingTrack = React.forwardRef((props, ref) => (
  <div className='flex backing-track' width='200px'><video className='backing-track' muted src={props.track} ref={ref} /></div>
))

BackingTrack.displayName = 'BackingTrack';

BackingTrack.propTypes = {
  track: PropTypes.string.isRequired,
};

export default BackingTrack
