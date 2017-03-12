// @flow
import React, { Component } from 'react';
import SplitPane from 'react-split-pane';
import DOMViewer from '../../components/DOMViewer/DOMViewer';
import CSSViewer from '../../components/CSSViewer/CSSViewer';
import { setMinus, setPlus } from '../../utils/state';
import './Inspector.css';

class Inspector extends Component {
  props: {
    requestData: (Object) => void,
    rootNode: Node,
    styles: { [id: number]: Object },
  };

  state: {
    selected: Set<number>,
  };

  constructor(props) {
    super(props);
    this.toggleSelected = this.toggleSelected.bind(this);
    this.isSelected = this.isSelected.bind(this);

    this.state = {
      selected: new Set(),
    };
  }

  requestStyles(nodeId: number): void {
    this.props.requestData({
      type: 'REQUEST_STYLES',
      nodeId,
    });
  }

  toggleSelected(nodeId: number): void {
    let nextState;
    if (this.isSelected(nodeId)) {
      nextState = {
        selected: setMinus(this.state.selected, nodeId),
      };
    } else {
      nextState = {
        selected: setPlus(this.state.selected, nodeId),
      };
      this.requestStyles(nodeId);
    }
    // TODO: This will get dicey if the request fails.
    this.setState(nextState);
  }

  isSelected(nodeId: number): boolean {
    return this.state.selected.has(nodeId);
  }

  render() {
    const { rootNode, styles } = this.props;
    const splitPaneProps = {
      split: 'vertical',
      minSize: 50,
      defaultSize: 400,
    };
    const domViewerProps = {
      rootNode,
      toggleSelected: this.toggleSelected,
      isSelected: this.isSelected,
    };
    const cssViewerProps = {
      styles,
    };

    return (
      <div className="Inspector">
        <SplitPane {...splitPaneProps}>
          <DOMViewer {...domViewerProps} />
          <CSSViewer {...cssViewerProps} />
        </SplitPane>
      </div>
    );
  }
}

export default Inspector;
