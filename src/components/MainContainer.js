import React, { Component } from 'react';
import { Card, Button }  from 'antd';

import '../styles/MainContainer.css';

class MainContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOverlayShowing: false,
      liveCamStyles: {
        hideCam: 'hide-cam',
      },
      overlayClasses: {
        show: 'show-overlay ant-card Data-card ant-card-bordered',
        hide: 'hide-overlay'
      }
    }
  }

  componentDidMount() {
    console.log('Inital state', this.state)
    let video = document.getElementById('video');
    let screenshotCanvas = document.getElementById('canvas');
    let context = screenshotCanvas.getContext('2d');
    let overlayCard = document.getElementById('canv-card')
    let liveCamCard = document.getElementById('live-cam-card')

    document.getElementById("takePicture").addEventListener("click", () => {
      console.log(`Taking image & changing inital state of overlay ${this.state.isOverlayShowing}`)
      this.setState({
        isOverlayShowing: true
      })

      overlayCard.className = this.state.overlayClasses.show;
      console.log(`Changes on Overlay ${overlayCard}`)
      context.drawImage(video, 0, 0, 640, 480); 
      console.log(`Overlay state changed ${this.state.isOverlayShowing}`)
    });

    document.getElementById('confirm-btn').addEventListener('click', () => {
      console.log('Context:', context)
      let requestHeaders = new Headers({
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      })

      let serverUri = 'https://localhost:4000/saveImage';

      fetch(serverUri, {
        method: 'POST',
        headers: requestHeaders,
        body: screenshotCanvas.toDataURL()
      }).then((response) => {
        response.json().then((gifUrl) => {
          console.log(`Gif URL: ${gifUrl}`)
        })
      })

      liveCamCard.className = this.state.liveCamStyles.hideCam
      console.log('bfb')
    });
    
    if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
        video.src = window.URL.createObjectURL(stream);
        video.play();
      })
    }
  }

  render() {
    console.log('Overlay state', this.state.isOverlayShowing)
    return (
      <div className="MainContainer-wrap">
        <Card id="live-cam-card" className="Data-card">
          <div className="custom-image">
            <video id="video" width="600" height="400" autoPlay></video>
          </div>

          <div className="overlay-actions">
            <Button type="primary" shape="circle" icon="camera" id="takePicture"></Button>
          </div> 
        </Card>

        <Card id="canv-card" className="test">
          <div className="custom-image">
            <canvas id="canvas" width="600" height="400"></canvas>  
          </div>

          <div className="overlay-actions">
            <Button id="confirm-btn" type="primary" shape="circle" icon="check" />
            <div className="spacer"></div>
            <Button type="primary" shape="circle" icon="delete" />
          </div> 
        </Card>
       </div>
    );
  }
}

export default MainContainer;
