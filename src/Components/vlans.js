import React, { useState, useEffect } from 'react';
import { VlanTableHtml } from './chartConfigs';
const $ = require('jquery');
$.DataTable = require('datatables.net');

export  function Vlans(props){
  const [chartStatus, setChartStatus] = useState(false)
  const vlanTableRef = React.createRef()
  const vlantable = VlanTableHtml(vlanTableRef)

  useEffect(() => {
    if(chartStatus !== true){
        $(vlanTableRef.current).DataTable().destroy()
          try{
            $(vlanTableRef.current).DataTable({
              data: props.vlans,
              columns:  [
                { data: 'id' },
                { data: 'name' },
                { data: 'status' },
                { data: 'interfaces'}
            ]});
          }
        catch{}
      setChartStatus(true)
      }

  }, [])

  return  <div className="col-xl-6">
            <div className="card text-white bg-dark">
              <div className="card-body">
              <h4 class="card-title">Vlans</h4>
              {vlantable}
              </div>
            </div>
          </div>
  }
  