import React, { useEffect } from 'react';
import { VlanTableHtml } from './chartConfigs';
const $ = require('jquery');
$.DataTable = require('datatables.net');

export  function Vlans(props){
  const vlanTableRef = React.createRef()
  const vlantable = VlanTableHtml(vlanTableRef)

  useEffect(() => {
    $(vlanTableRef.current).DataTable().destroy()
        $(vlanTableRef.current).DataTable({
          data: props.vlans,
          language: {
            emptyTable: "No Vlans Configured"
          },
          columns:  [
            { data: 'id' },
            { data: 'name' },
            { data: 'status' },
            { data: 'interfaces'}
        ]});
  }, [])

  return  <div className="col-xl-6">
            <div className="card text-white bg-dark">
              <div className="card-body">
              <h4 class="card-title mb-3">Vlans</h4>
              {vlantable}
              </div>
            </div>
          </div>
  }
  