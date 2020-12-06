import "./Single.css";
import ImageEditor from "./ImageEditor";
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
    console.log(event.target.files);
    this.setState({
      file: URL.createObjectURL(
        event.target.files[event.target.files.length - 1]
      ),
    });
  }

  render() {
    return (
      <div>
        <input id="market" type="file" onChange={this.handleChange} />
        <ImageEditor src={this.state.file} />
      </div>
    );
  }
}
export default Single;
