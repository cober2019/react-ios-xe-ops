import React, { useEffect } from 'react';
import { PlusRibEntriesTableHtml } from '../Other/chartConfigs';
import { RibDiffData } from '../Other/tables';
const $ = require('jquery');
$.DataTable = require('datatables.net');

export  function RibDiff(props){
  const ribDiffEntries = React.createRef()
  const plusEntriesTable = PlusRibEntriesTableHtml(ribDiffEntries)
  console.log(props.ribs)
  
  useEffect(() => {

    if(ribDiffEntries.current !== null){

      try{
        $(ribDiffEntries.current).DataTable().clear()
        $(ribDiffEntries.current).DataTable().rows.add(props.ribs)
        $(ribDiffEntries.current).DataTable().draw(false)
      }
      catch{}

    }
  
    }, [props.ribs])


  useEffect(() => {
      $(ribDiffEntries.current).DataTable().destroy()
      RibDiffData(ribDiffEntries.current, props.ribs)
  }, [])


    return  plusEntriesTable
                        
  };
