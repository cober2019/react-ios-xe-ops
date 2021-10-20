

export const BandwidthDiff = (cachedQuery, data) => {
    try{
        const lastQuery = cachedQuery.getQueryCache(localStorage.getItem('ip') + 'indexData').queries[0].state.data.interfaces;
        Object.values(lastQuery).map(cacheValue => {
          Object.values(data.interfaces).map(newValue => {
              if(newValue.data.name === cacheValue.data.name){

                const diffIn = parseFloat(newValue.data['statistics']['rx-kbps'] - parseFloat(cacheValue.data['statistics']['rx-kbps']));
                const diffOut = parseFloat(newValue.data['statistics']['tx-kbps'] - parseFloat(cacheValue.data['statistics']['tx-kbps']));

                if(Math.sign(diffIn) === 1){
                  newValue.data.inbandwidthDiff =  '+' + diffIn.toFixed(2)
                }
                else if(Math.sign(diffIn) === -1){
                  newValue.data.inbandwidthDiff = diffIn.toFixed(2)
                }
                else{
                  newValue.data.inbandwidthDiff = diffIn
                };                            
                
                if(Math.sign(diffOut) === 1){
                  newValue.data.outbandwidthDiff = '+' + diffOut.toFixed(2)
                }
                else if(Math.sign(diffOut) === -1){
                  newValue.data.outbandwidthDiff = diffOut.toFixed(2)
                }
                else{
                  newValue.data.outbandwidthDiff = diffOut
                };
              };
            });
          });
      }
      catch{}

    return data

}