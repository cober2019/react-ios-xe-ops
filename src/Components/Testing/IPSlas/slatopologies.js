import React, { useEffect, useRef } from 'react';
import { IpSlaTopologyBuild, UpdateIpSlaTopology } from './topology';
const $ = require('jquery');
$.DataTable = require('datatables.net');

export  function BuildSlaTopologies(props){
  const slaTopologyRef = React.createRef()
  const slaTopology = useRef()


        slaTopology.current = IpSlaTopologyBuild(slaTopologyRef.current, props.sla, props.localIp)
        slaTopologyRef.current =  slaTopology.current


  return  <div ref={slaTopologyRef} className="bg-dark" style={{width: '100%', height: '300px'}}/>
               
  }
  