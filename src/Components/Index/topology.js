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
        treeSpacing: 300,
        edgeMinimization: true,
        parentCentralization: true,
        direction: 'DU',        // UD, DU, LR, RL
        sortMethod: 'directed',  // hubsize, directed
        shakeTowards: 'leaves'  // roots, leaves
          }
      },
      physics:{
      enabled: true,
      hierarchicalRepulsion: {
        centralGravity: 0.0,
        springLength: 0,
        springConstant: 0.01,
        nodeDistance: 250,
        damping: 1,
        avoidOverlap: 1
      },
    },

}

export function UpdateHsrpTopology(ref, interfaces, localIp){

  Object.entries(interfaces).forEach((details, i) => {
           
    if (details[1].standby === 'unknown' || details[1].state === 'Init'){
        ref.body.data.edges.update({
            
            id: details[1].vlanInt, 
            from: localIp, 
            to: i, 
            color: 'yellow',

            });
    }
    else{
        ref.body.data.edges.update({
            id: details[1].vlanInt, 
            from: localIp, 
            to: i, 
            color: 'green',
            });
    }})
    
    return  ref

    }

export function HsrpTopologyBuild(ref, interfaces, localIp){

    const nodes = []
    const edges = []

    nodes.push({id: localIp, label: 'Local' + '\n' + localIp, font: nodeFont })

    Object.entries(interfaces).forEach((details, i) => {
        nodes.push({id: details[0], label: details[1].vlanInt + "\n" + details[1].vip, font: font});
        nodes.push({id: i, label: details[1].vlanInt + "\n" + details[1].vip, font: font});
    })

    Object.entries(interfaces).forEach((details, i) => {
          if (details[1].standby === 'unknown' || details[1].state === 'Init'){
                edges.push({id: details[1].vlanInt, 
                            from: localIp, 
                            to: i, 
                            color: 'yellow',
                            label: details[1].vlanInt + '\n' + details[1].state + "\n" + details[1].active, 
                            font: font
                            });
                }
                else{
                    edges.push({id: details[1].vlanInt, 
                        from: localIp, 
                        to: i, 
                        color: 'green',
                        label: details[1].vlanInt + '\n' + details[1].state + "\n" + details[1].active, 
                        font: font
                        });
                }})

    var network = new Network(ref, {nodes: nodes, edges: edges}, options);
    
    return  network

    }