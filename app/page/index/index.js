import React from 'react';
import ReactDOM from 'react-dom';
class App extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        111111
      </div>
    )
  }
}


ReactDOM.render(
  <div>
    <App />
  </div>,
  document.getElementById('root')
);
