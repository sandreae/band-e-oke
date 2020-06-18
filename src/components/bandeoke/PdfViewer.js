import React, {Component} from "react";
import PropTypes from "prop-types";

class PdfViewer extends Component {
  renderPdfLinks(){
    if (this.props.scores){
      const scoreButtons = this.props.scores.map((score, i) => {
        return (
          <div  className="pdf-link"  key={i} >
            <a href={score.pdf} rel="noopener noreferrer" target='_blank' >
                <p>{score.name} pdf</p>
            </a>
          </div>
        )
      });
      return scoreButtons
    }
  }

  render(){
    return (
      <div className="pdf-links-wrapper flex">
        <div className="pdf-link-text"><p>Open score as pdf in new window:</p></div>
        {this.renderPdfLinks()}
      </div>
    )
  }
}

PdfViewer.propTypes = {
  scores: PropTypes.object.isRequired,
};

export default PdfViewer
