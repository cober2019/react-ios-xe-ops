import React, { useEffect } from 'react';
import { ProtocolsTableHtml } from '../Other/chartConfigs';
const $ = require('jquery');
$.DataTable = require('datatables.net');

export  function RoutingProtocols(props){
  const routingProtocolsRef = React.createRef()
  const routingProtocolsTable = ProtocolsTableHtml(routingProtocolsRef)
  
  useEffect(() => {
        try{
            $(routingProtocolsRef.current).DataTable().destroy()
            $(routingProtocolsRef.current).DataTable({
              language: {
                emptyTable: "Something Went Wrong"
              },
              data: props.protocols,
              columns:  [
                { data: 'protocol' },
                { data: 'id' },
                { data: 'name' },
                { data: 'type' },
                { data: 'interfaces' },
            ]});
          }

        catch(e){console.log(e)}

  }, [])


    return <div className="col-6">
                    <div className="card border-0 mb-3 bg-dark">
                        <div className="card-body">
                            <h4 class="card-title mb-3">Routing Protocols</h4>
                            {routingProtocolsTable}
                            </div>
                        </div>
                    </div>
               
                        
  };
