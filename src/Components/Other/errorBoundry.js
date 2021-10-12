  
import React from 'react';


export classname ErrorBoundary extends React.Component {
    constructor(props) {
      super(props);
      this.state = { hasError: false,
                     error: undefined };
    }
  
    static getDerivedStateFromError(error) {
      console.log(error)
      // Update state so the next render will show the fallback UI.
      return { hasError: true, error: error };
    }
  
  
    render() {
      if (this.state.hasError) {
        // You can render any custom fallback UI
        return <div><div classname="alert alert-danger" role="alert" style={{textAlign: 'center', fontSize: 20}}>!Something Went Wrong!</div></div>
      }
      else{
        // You can render any custom fallback UI
        return this.props.children;     
      }
  
     
    }
  }