import React, {Component} from "react";
import PropTypes from "prop-types";

class PdfViewer extends Component {
  renderPdfLinks(){
    if (this.props.scores){
      const scoreButtons = this.props.scores.map((score, i) => {
        return (
          <div key={i}>
            <a href={score.pdf} target="_blank" rel="noopener noreferrer" download >
              {score.name}
            </a>
          </div>
        )
      });
      return scoreButtons
    }
  }

  render(){
    return (
      <div className="pdf-links-wrapper--flex-row">
        <div>Download scores:</div>
        {this.renderPdfLinks()}
      </div>
    )
  }
}

PdfViewer.propTypes = {
  scores: PropTypes.array.isRequired,
};

export default PdfViewer
