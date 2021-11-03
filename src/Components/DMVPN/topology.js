import router from '../Images/router.png';
import { Network } from "vis-network";

var font = { size: 18, strokeWidth: 0, color: 'white'}
var Hubfont = { size: 18, strokeWidth: 0, color: 'orange'}
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
      clusterThreshold: 200,
      hierarchical: {
        enabled:true,
        levelSeparation: 500,
        treeSpacing: 300,
        edgeMinimization: true,
        parentCentralization: true,
        direction: 'DU',        // UD, DU, LR, RL
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
        nodeDistance: 250,
        damping: 1,
        avoidOverlap: 1
      },
    },

}

export function UpdateDmvpnTopology(ref, peers, localIp){
           
    Object.entries(peers).forEach((details, i) => {
      if (details[1].state !== 'UP'){
        ref.body.data.edges.push({id: details[1].peerNbma, 
                        from: localIp, 
                        to: i, 
                        color: 'yellow',
                        label: details[1].state + '\n' + details[1].peerTunnel + "\n" + details[1].attrb, 
                        font: font
                        });
            }
            else{
              ref.body.data.edges.push({id: details[1].vlanInt, 
                    from: localIp, 
                    to: i, 
                    color: 'green',
                    label: details[1].state + '\n' + details[1].peerTunnel + "\n" + details[1].attrb, 
                    font: font
                    });
            }})
    
    return  ref

    }

export function DmvpnTopologyBuild(ref, peers, localIp, hubs){

    const nodes = []
    const edges = []

    nodes.push({id: localIp, label: 'Local\n' + localIp, font: nodeFont })

    Object.entries(peers).forEach((details, i) => {

        if (hubs.some(ip => ip.hubNbma === details[1].peerNbma)){
          const spookeOrHub = details[1].peerNbma + ': Hub'
          nodes.push({id: details[0], label: spookeOrHub, font: Hubfont});
        }
        else{
          const spookeOrHub = details[1].peerNbma + ': Spoke'
          nodes.push({id: details[0], label: spookeOrHub, font: font});
        }

        
    })

    Object.entries(peers).forEach((details, i) => {


          if (details[1].state !== 'UP'){
                edges.push({id: details[1].peerNbma, 
                  from: localIp, 
                  to: i, 
                  color: 'yellow',
                  label: details[1].state + '\n' + details[1].peerTunnel + "\n" + details[1].attrb, 
                  font: font
                  });
          }
          else{
              edges.push({id: details[1].peerNbma, 
                  from: localIp, 
                  to: i, 
                  color: 'green',
                  label: details[1].state + '\n' + details[1].peerTunnel + "\n" + details[1].attrb, 
                  font: font
                  });
          }})

          var network = new Network(ref, {nodes: nodes, edges: edges}, options);
    
    return  network

    }