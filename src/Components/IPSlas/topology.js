
import router from '../Images/router.png';
import { Network } from "vis-network";

var font = { size: 15, strokeWidth: 0, color: 'white'}
var arrowEnabled = {enabled: true}
var nodeFont = { size: 16, color: "white"}
var options = {
  nodes: {
    shape: 'image',
    image: router,
    size: 35,
    color: {
      border: 'black',
      background: '#166F20',
      highlight: {
        border: '#2B7CE9',
        background: '#D2E5FF'
          }
        }
      },
    layout: {
      randomSeed: undefined,
      improvedLayout:true,
      clusterThreshold: 150,
      hierarchical: {
        enabled:true,
        levelSeparation: 500,
        treeSpacing: 150,
        edgeMinimization: true,
        parentCentralization: true,
        direction: 'RL',        // UD, DU, LR, RL
        sortMethod: 'hubsize',  // hubsize, directed
        shakeTowards: 'roots'  // roots, leaves
          }
      },
      physics:{
      enabled: true,
      hierarchicalRepulsion: {
        centralGravity: 0.0,
        springLength: 0,
        springConstant: 0.01,
        nodeDistance: 200,
        damping: 1,
        avoidOverlap: 1
      },
    },

}

export function UpdateIpSlaTopology(ref, sla, localIp){

    
    if(sla['latest-return-code'] !== 'ret-code-ok'){
        ref.body.data.edges.update({id: 2000,
                        from: 1, 
                        to: localIp, 
                        color: 'yellow', 
                        label: 'Latest: ' + sla['latest-return-code'] + '\nSuccess: ' +sla['success-count'] +  '\nFailures: ' + sla['failure-count'], 
                        })
    }
    else{
        ref.body.data.edges.update({id: 2000,
            from: 1, 
            to: localIp, 
            color: 'green', 
            label: 'Latest: ' + sla['latest-return-code'] + '\nSuccess: ' +sla['success-count'] + '\nFailures: ' + sla['failure-count'],  
        })
    }
    
    return  ref

    }



export function IpSlaTopologyBuild(ref, sla, localIp){

    const nodes = []
    const edges = []

    nodes.push({id: 1, label: 'Responder', font: nodeFont})
    nodes.push({id: localIp, label: localIp, font: nodeFont})

    
    if(sla['latest-return-code'] !== 'ret-code-ok'){
        edges.push({id: 2000,
                        from: 1, 
                        to: localIp, 
                        color: 'yellow', 
                        label: 'Latest: ' + sla['latest-return-code'] +  '\nSuccess: ' +sla['success-count'] + '\nFailures: ' + sla['failure-count'], 
                        font: font, 
                        arrows:{from: arrowEnabled}
        })
    }
    else{
        edges.push({id: 2000,
            from: 1, 
            to: localIp, 
            color: 'green', 
            label: 'Latest: ' + sla['latest-return-code'] + '\nSuccess: ' +sla['success-count'] + '\nFailures: ' + sla['failure-count'], 
            font: font, 
            arrows:{from: arrowEnabled}
        })
    }


    var data = {
      nodes: nodes,
      edges: edges,
    };

    var network = new Network(ref, data, options);
    
    return  network

    }

