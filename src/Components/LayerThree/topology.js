
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
        direction: 'LR',        // UD, DU, LR, RL
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


export function UpdateBgpTopology(ref, neighbors, routerId){

  
  Object.entries(neighbors).forEach((details, i) => {
    let test = Math.floor(Math.random() * 2)
    if(details[1].state ==='established'){

                    ref.body.data.edges.update({id: details[1]['neighbor-id'],
                    from: routerId, 
                    to: details[1]['neighbor-id'], 
                    color: 'green', label: details[1].state, 
                    font: font, 
                    arrows:{to: arrowEnabled, from: arrowEnabled}});
  }
  else{
      ref.body.data.edges.update({id: details[1]['neighbor-id'],
                  from: routerId, 
                  to: details[1]['neighbor-id'], 
                  color: 'yellow', 
                  label: details[1].state, 
                  font: font, 
                  arrows:{to: arrowEnabled, from: arrowEnabled}
                  });
  }
})

  return ref
}


export function BgpTopologyBuild(ref, neighbors, localAs, routerId, prefixes, topology){

    const nodes = []
    const edges = []

    nodes.push({id: routerId, 
                label: routerId + '\nAS: ' + localAs, 
                font: nodeFont
                })

    Object.entries(topology).forEach((neighbor, details) => {

      nodes.push({id: neighbor[0], 
                  label: neighbor[0] + '\nAS: ' + neighbor[1], 
                  font:nodeFont
                  })
    })

    Object.entries(neighbors).forEach((details, i) => {
      if(details[1].state ==='established'){

          edges.push({id: details[1]['neighbor-id'], 
                      from: routerId, 
                      to: details[1]['neighbor-id'], 
                      color: 'green', label: details[1].state, 
                      font: font, 
                      arrows:{to: arrowEnabled, from: arrowEnabled}
                    });
    }
    else{
        edges.push({id: details[1]['neighbor-id'],
                    from: routerId, 
                    to: details[1]['neighbor-id'], 
                    color: 'yellow', 
                    label: details[1].state, 
                    font: font, 
                    arrows:{to: arrowEnabled, from: arrowEnabled}
                    });
                  }
    })

    var data = {
      nodes: nodes,
      edges: edges,
    };

    var network = new Network(ref, data, options);
    
    return  network

    }

export function UpdateOspfTopology(ref, neighbors, topology){

  Object.entries(neighbors).forEach((details, i) => {
    if(details[1].state ==='ospf-nbr-full'){

      ref.body.data.edges.update({id: details[1]['neighbor-id'],
                                  from: topology[1], 
                                  to: details[1]['neighbor-id'], 
                                  color: 'green', label: 
                                  details[1].state, 
                                  font: font, 
                                  arrows:{to: arrowEnabled, from: arrowEnabled}});
    }
    else{
        ref.body.data.edges.update({id: details[1]['neighbor-id'],
                                    from: topology[1], 
                                    to: details[1]['neighbor-id'], 
                                    color: 'yellow', 
                                    label: details[1].state, 
                                    font: font, 
                                    arrows:{to: arrowEnabled, from: arrowEnabled}
                                    });
    }})
      return ref
    }


export function OspfTopologyBuild(ref, neighbors, topology){

    const nodes = []
    const edges = []

    nodes.push({id: topology[1], label: topology[1], font: nodeFont})
    Object.entries(topology[0]).forEach((neighbor, details) => {

      nodes.push({id: neighbor[0], 
                  label: neighbor[0], 
                  font: nodeFont
                  })
    })
    console.log(neighbors)
    Object.entries(neighbors).forEach((details, i) => {
      console.log(details)
    if(details[1].state ==='ospf-nbr-full'){

          edges.push({id: details[1]['neighbor-id'], 
                      from: topology[1], 
                      to: details[1]['neighbor-id'], 
                      color: 'green', 
                      label: details[1].state + '\nArea: ' + details[1]['area'], 
                      font: font, 
                      arrows:{to:arrowEnabled,from:arrowEnabled}
                    });
    }
    else{
        edges.push({id: details[1]['neighbor-id'],
                    from: topology[1], 
                    to: details[1]['neighbor-id'], 
                    color: 'yellow', 
                    label: details[1].state + '\nArea: ' + details[1]['area'], 
                    font: font, 
                    arrows:{to: {arrowEnabled}, from: {arrowEnabled}}
                    });
                  }
    })

    var data = {
      nodes: nodes,
      edges: edges,
    };

    var network = new Network(ref, data, options);
    
    return  network

    }
    
