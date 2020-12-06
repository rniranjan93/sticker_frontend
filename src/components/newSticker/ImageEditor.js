import React from "react";
import Cropper from "cropperjs";
import editHelper from "./utils/editHelper";
import "./ImageEditor.css";
import "cropperjs/dist/cropper.min.css";
import { loadModel } from "./autoCrop";

var cropper = null;
var ctx = null;
var displayCtx = null;

export default class ImageEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      toggle: true,
      display: "block",
      display2: "none",
      fun: () => {
        console.log("hello");
      },
      style: {},
    };
    this.imageElement = React.createRef();
    this.canvas = React.createRef();
    this.displayCanvas = React.createRef();
  }

  componentDidMount() {
    this.imageElement.current.onload = () => {
      if (this.state.toggle) {
        this.setState({ toggle: false });
        cropper = new Cropper(this.imageElement.current, {
          zoomable: true,
          scalable: true,
          restore: true,
          highlight: true,
          background: false,
          // aspectRatio: 1,
        });

        var scale = 0;
        ctx = this.canvas.current.getContext("2d");
        displayCtx = this.displayCanvas.current.getContext("2d");
        editHelper.setCtx(ctx, displayCtx, scale);

        var can = this.canvas;

        this.canvas.current.addEventListener(
          "touchmove",
          function (e) {
            e.preventDefault();
            if (editHelper.getTask() === 3) editHelper.drawText(can, e);
            else
              editHelper.mainDraw(
                parseInt(e.touches[0].clientX),
                parseInt(e.touches[0].clientY),
                can
              );
          },
          { passive: false }
        );
        this.canvas.current.addEventListener(
          "touchstart",
          function (e) {
            e.preventDefault();
            if (editHelper.getTask() === 3) editHelper.drawText(can, e);
            else
              editHelper.mainDraw(
                parseInt(e.touches[0].clientX),
                parseInt(e.touches[0].clientY),
                can
              );
          },
          { passive: false }
        );

        this.canvas.current.addEventListener("mousemove", function (e) {
          // editHelper.drawText(can, e);
          editHelper.mainDraw(parseInt(e.clientX), parseInt(e.clientY), can);
        });

        this.canvas.current.addEventListener("click", function (e) {
          editHelper.drawText(can, e);
        });

        this.canvas.current.addEventListener(
          "touchend",
          function (e) {
            e.preventDefault();
            editHelper.resetPastPoints();
          },
          { passive: false }
        );

        this.setState({
          fun: () => {
            cropper.replace(cropper.getCroppedCanvas().toDataURL());
          },
          swch: (task) => {
            console.log("entered swch");
            editHelper.setTask(task);
            if (this.state.display2 === "none") {
              ctx.drawImage(this.imageElement.current, 0, 0);
              var { height, width } = this.imageElement.current;
              if (height > width) {
                scale = 400 / height;
                this.setState({
                  style: {
                    height: "400px",
                  },
                });
                this.displayCanvas.current.height = 400;
                this.displayCanvas.current.width = parseInt(width * scale);
              } else {
                this.setState({
                  style: {
                    width: "400px",
                  },
                });
                scale = 400 / width;
                this.displayCanvas.current.width = 400;
                this.displayCanvas.current.height = parseInt(height * scale);
              }
              // this.displayCanvas.current.src = this.canvas.current.toDataURL();
              // displayCtx.scale(scale, scale);
              editHelper.setScale(scale);
              displayCtx.drawImage(
                editHelper.downScaleCanvas(this.canvas.current, scale),
                0,
                0
              );
              this.setState({ display: "none", display2: "block" });
            } else {
              this.setState({ display2: "none", display: "block" });
            }
          },
        });
      }
    };
  }
  render() {
    return (
      <div className="img-main-div">
        <div style={{ display: this.state.display }} className="img-container">
          <img
            alt="src"
            style={{ display: "none" }}
            ref={this.imageElement}
            src={this.props.src}
          />
        </div>
        <div
          style={{
            width: "400px",
            height: "400px",
            display: this.state.display2,
          }}
        >
          <canvas
            style={{
              display: "block",
              margin: "auto",
              verticalAlign: "middle",
            }}
            ref={this.displayCanvas}
          />
          <canvas
            className="trans"
            style={this.state.style}
            onMouseUp={() => {
              editHelper.setFlag(false);
              editHelper.resetPastPoints();
            }}
            onMouseDown={() => {
              editHelper.setFlag(true);
            }}
            ref={this.canvas}
          />
        </div>
        <input type="button" onClick={this.state.fun} value="crop" />
        <input
          type="button"
          onClick={async () => {
            cropper.replace(
              await loadModel(this.imageElement.current, this.canvas.current)
            );
          }}
          value="auto crop"
        />
        <input
          type="button"
          onClick={() => this.state.swch(1)}
          value="eraser"
        />
        <input
          type="button"
          onClick={() => this.state.swch(2)}
          value="un-erase"
        />
        <input type="button" onClick={() => this.state.swch(3)} value="text" />
        <input
          type="button"
          onClick={() => {
            this.setState({
              style: {
                height: "512px",
              },
            });
          }}
          value="save"
        />
        <input
          type="button"
          onClick={() => {
            this.displayCanvas.current.height = 512;
            this.displayCanvas.current.width = 512;
            const c = this.displayCanvas.current.getContext("2d");
            c.drawImage(
              editHelper.downScaleCanvas(this.canvas.current, 0.5),
              0,
              0
            );
            console.log("returned from omega");
            // var { height, width } = this.canvas.current;
            // c.putImageData(ctx.getImageData(0, 0, width, height), 0, 0);
          }}
          value="save"
        />
      </div>
    );
  }
}
