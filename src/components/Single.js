import "./Single.css";
const autoCrop = require("./autoCrop");
const React = require("react");

class Single extends React.Component {
  constructor(props) {
    super(props);
    this.canRef = React.createRef();
    this.canRef1 = React.createRef();
    this.state = {
      file: null,
      model: null,
    };
    this.handleChange = this.handleChange.bind(this);
  }

  async handleChange(event) {
    var model = autoCrop.loadModel();
    console.log(model);
    var ctx = this.canRef.current.getContext("2d");
    var ctx1 = this.canRef1.current.getContext("2d");
    var c = this.canRef1.current;
    var img = new Image();
    var k = this.canRef.current;
    img.onload = function () {
      console.log(`True image width ${img.width}`);
      k.height = img.height;
      k.width = img.width;
      ctx.drawImage(img, 0, 0);
      autoCrop
        .model(img)
        // .loadModel()
        // .then((model) => model.segment(img))
        .then(({ segmentationMap, width, height }) => {
          var i = new ImageData(segmentationMap, width, height);
          c.width = img.width;
          c.height = img.height;
          ctx1.putImageData(i, 0, 0);
          ctx1.scale(img.width / width, img.width / width);
          ctx1.drawImage(c, 0, 0);
          var filterImage = ctx1.getImageData(0, 0, img.width, img.height).data;
          var realImage = ctx.getImageData(0, 0, img.width, img.height).data;
          console.log(filterImage);
          for (var l = 3; l < realImage.length; l += 4)
            if (filterImage[l - 1] === 0 && filterImage[l - 2] === 0)
              realImage[l] = 0;
          console.log();
          ctx.putImageData(
            new ImageData(realImage, img.width, img.height),
            0,
            0
          );
          // img = canvas.toDataURL(img);
          // ctx.drawImage(img, 0, 0);
        });
    };
    img.src = URL.createObjectURL(event.target.files[0]);
    this.setState({
      file: URL.createObjectURL(event.target.files[0]),
    });
  }

  render() {
    return (
      <div>
        <input id="market" type="file" onChange={this.handleChange} />
        <img id="img1" style={{ display: "none" }} src={this.state.file} />
        <br />
        <canvas id="can" ref={this.canRef}></canvas>
        <canvas
          id="canva1"
          style={{ display: "none" }}
          ref={this.canRef1}
        ></canvas>
      </div>
    );
  }
}
export default Single; /*
var canvas = document.getElementById('can'); var ctx =
canvas.getContext('2d'); var image=
document.getElementById('market').files[0]
ctx.drawImage(image,0,0,90,90);*/
