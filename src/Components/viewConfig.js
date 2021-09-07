import React from 'react';
import { SubmitUpdatedUri } from './statusCode'

export class Selection extends React.Component {
    constructor(props) {
      super(props);
      this.state = {url: this.props.uri,
                    propsUri: this.props.uri,
                    username: this.props.username,
                    password: this.props.password,
                    leafs: this.props.leafs,
                    parentKey: this.props.parentKey,
                    config: this.props.config,
                    dict: '{PythonVar}',
                    software: this.props.software,
                    aciKeys: [],
                    loading: false
                    };

      this.getDeviceData = this.getDeviceData.bind(this);
      this.previousSelection = this.previousSelection.bind(this);
      this.capabilities = React.createRef();
      this.xpathHistory = [this.props.uri];
      this.pythonPath = [this.state.dict];
    }
    
    componentDidUpdate(prevProps, prevState){
        if (prevProps.config !== this.props.config){
            this.setState({ url: this.props.uri,
                            leafs: this.props.leafs,
                            parentKey: this.props.parentKey,
                            config: this.props.config,
                            prevUri: [this.props.uri],
                            software: this.props.software
            })
        };
    };

    async previousSelection() {
        
        if(this.xpathHistory.length !== 1)
            this.setState({loading: true})
            if (this.xpathHistory.length === 1){
                let previousUri = this.state.propsUri;
                let response = await SubmitUpdatedUri(this.previousUri, this.state.username, this.state.password, this.state.software);
                this.setState({url: previousUri, leafs: response.data.data, config: JSON.parse(response.data.config), parentKey: response.data.parent, loading: false});
            }
            else{
                let previousUri = this.xpathHistory[this.xpathHistory.length - 2];
                let previousPython = this.pythonPath[this.pythonPath.length - 2];
                let response = await SubmitUpdatedUri(previousUri, this.state.username, this.state.password, this.state.software);
                this.xpathHistory.pop();
                this.pythonPath.pop();
                this.setState({dict: previousPython, url: previousUri, leafs: response.data, config: JSON.parse(response.config), parentKey: response.parent, loading: false});
            }
    };

    async getDeviceData(nextPath) {

        this.setState({loading: true})
        let uri = this.state.url + '/' + nextPath;
        let dict = this.state.dict  + '.get(\'' + nextPath + '\')';
        let response = await SubmitUpdatedUri(uri, this.state.username, this.state.password, this.state.software);
        

        if (response.status === 404){
            let index = this.state.leafs.indexOf(nextPath);
            let uri = this.xpathHistory[this.xpathHistory.length - 1] + '=' + encodeURIComponent(nextPath);
            let response = await SubmitUpdatedUri(uri, this.state.username, this.state.password, this.state.software);

            if (response.data === 500 || response.status === 404){
               this.setState({loading: false});
               alert("End of the road")
            }
            else{
              let dict = this.state.dict  + '[' + index + ']';
              this.xpathHistory.push(uri);
              this.pythonPath.push(dict);
              this.setState({url: uri, dict: dict, leafs: response.data, parentKey: response.parent, config: JSON.parse(response.config), loading: false});
        }
        }
        else if (response.data === 500){
            this.setState({loading: false});
            alert("End of the road")
        }
        else{
            this.xpathHistory.push(uri);
            this.pythonPath.push(dict);
            this.setState({url: uri, dict: dict, leafs: response.data, parentKey: response.parent, config: JSON.parse(response.config), loading: false});
        }
    };

    render() {
            return( <div id="restconfig" className="card collapse show  border-primary mb-3">
                    <div className="card-body">
                        <div className="row">
                            <div className="col-3">
                                <button style={{marginBottom: '15px', fontWeight: 'bold'}} className="btn btn-success btn-md" onClick={(e) => this.previousSelection(e)}>Previous URI</button>
                            </div>
                        </div>
                        {this.state.loading ? <div className="overlay" onclick="off()" style={{display: "flex", justifyContent: "center"}}><div className='row'><div style={{marginTop: 300}} class="spinner"></div></div></div>: <div/>}
                        <div className="row">
                            <h5 style={{color: "blue", fontWeight: 'bold'}}>Current Path: </h5><h5 key={'currentpath'}className="fade-in" >{this.state.url}</h5>
                        </div>
                        <div className="row">
                            <h5 style={{color: "blue", fontWeight: 'bold'}}>Python Path: </h5><h5 key={'currentpath'}className="fade-in" >{this.state.dict}</h5>
                        </div>
                         <div className='row'>
                                <div className="col-12">
                                    { this.state.leafs.map((key, index) => (
                                        <button key={key + index} style={{marginTop: '3px', marginBottom: '3px', marginRight: '3px'}} className="btn btn-success fade-in" onClick={(e) => this.getDeviceData(key, e)}>{key}</button>
                                    ))
                                    }
                                </div>
                            </div>
                        <div className='row'>
                            <div className="col-12">
                                <pre  key={'test'} style={{fontWeight:'bold'}}>{JSON.stringify(this.state.config, null, 2)}</pre>
                            </div>
                        </div>
                    </div>
                </div>
                )
            }
        
    }