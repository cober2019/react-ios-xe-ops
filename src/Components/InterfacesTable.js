import React, { useState, useEffect } from 'react';
import { InterfacesTableHtml } from './chartConfigs';
const $ = require('jquery');
$.DataTable = require('datatables.net');

export  function InterfaceTable(props){
  const [chartStatus, setChartStatus] = useState(false)
  const interfacesTableRef = React.createRef()
  const interfacestable = InterfacesTableHtml(interfacesTableRef)
  $.fn.dataTable.ext.errMode = 'none';
  
  useEffect(() => {
    $(interfacesTableRef.current).DataTable().clear()
    $(interfacesTableRef.current).DataTable().rows.add(Object.values(props.interfaces))
    $(interfacesTableRef.current).DataTable().draw(false)

    }, [props.interfaces])


  useEffect(() => {
    $(interfacesTableRef.current).DataTable().destroy()
    try{
      $(interfacesTableRef.current).DataTable({
        pageLength: 10,
        data: Object.values(props.interfaces),
        columns:  [
          { data: 'data.name'},
          { data: 'data.oper-status'},
          { data: 'data.description' },
          { data: 'data.ipv4' },
          { data: 'data.ipv4-subnet-mask'},
          { data: 'data.statistics.tx-kbps'},
          { data: 'data.statistics.rx-kbps'},
          { data: 'data.statistics.rx-pps'},
          { data: 'data.statistics.tx-pps'}
      ]});
    }
  catch{}
  setChartStatus(true)

}, [])

  return  <div className="col-12">
            <div className="card text-white bg-dark">
                <div className="card-body">
                <h4 class="card-title mb-4">Interfaces</h4>
                  {interfacestable}
                </div>
              </div>
            </div>
  }
  