import router from '../Images/router.png';
import { Network } from "vis-network";

var font = { size: 15, strokeWidth: 0, color: 'white'}
var nodeFont = { size: 16, color: "white"}


const options = (lineColor, direction, image) => {
  return  {nodes: {
    shape: image,
    size: 35,
    color: {
      border: lineColor,
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
        levelSeparation: 300,
        treeSpacing: 200,
        edgeMinimization: true,
        parentCentralization: true,
        direction: direction,        // UD, DU, LR, RL
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
  }}


export function UpdateHsrpTopology(ref, interfaces, localIp){

  Object.entries(interfaces).forEach((details, i) => {
           
    if (details[1].standby === 'unknown' || details[1].state === 'Init'){
        ref.body.data.edges.update({id: details[1].vlanInt, 
          from: localIp, 
          to: i, 
          color: 'yellow',
          label: details[1].vlanInt + '\n' + details[1].state + "\n" + details[1].active, 
          font: font
          });

    }
    else{
        ref.body.data.edges.update({id: details[1].vlanInt, 
                  from: localIp, 
                  to: i, 
                  color: 'green',
                  label: details[1].vlanInt + '\n' + details[1].state + "\n" + details[1].active, 
                  font: font
                  });
    }})
    
    return  ref

    }

export function HsrpTopologyBuild(ref, interfaces, localIp){

    const nodes = []
    const edges = []

    nodes.push({id: localIp, label: 'Local\n' + localIp, font: nodeFont })

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

    var network = new Network(ref, {nodes: nodes, edges: edges}, options('green', 'DU'));
    
    return  network

    }

export function UpdateQosTopology(ref, policyDetails){

  policyDetails.queues.map(queueDetails => {
    if(queueDetails['queue-name'].includes('Parent Queue:')){
      ref.body.data.edges.update({id: 'ParentToClassifier', from: 'Classifier', to: 'ParentQueue', label: queueDetails.rate})
    }
    else{
      if(parseInt(queueDetails.rate) > 0){
        ref.body.data.edges.update({id: policyDetails.interface_policy + queueDetails['queue-name'], 
        label: 'Rate: ' + queueDetails.rate + "\n" + 'TailDrops: ' + queueDetails['tail-drops'], 
        color: 'yellow'});
      }
      else{
        ref.body.data.edges.update({id: policyDetails.interface_policy + queueDetails['queue-name'], 
        label: 'Rate: ' + queueDetails.rate + "\n" + 'TailDrops: ' + queueDetails['tail-drops'], 
      });

      if(parseInt(queueDetails['tail-drops']) > 0){
        ref.body.data.edges.update({id: policyDetails.interface_policy + queueDetails['queue-name'], 
        label: 'Rate: ' + queueDetails.rate + "\n" + 'TailDrops: ' + queueDetails['tail-drops'], 
        color: 'red'});
      }
     

      }
    }
  })
   
  return  ref
    
  }
    
export function QosTopologyBuild(ref, policyDetails, deviceInterface){

  const nodes = []
  const edges = []

  nodes.push({id: policyDetails.interface_policy, label: deviceInterface , font: nodeFont, shape: 'image', image: router})
  nodes.push({id: 'Classifier', label: 'Classifier', font: nodeFont, shape: 'triangle'})
  edges.push({id: policyDetails.interface_policy + 'Classifier', from: 'Classifier', to: policyDetails.interface_policy, label: policyDetails.interface_policy, font: font, arrows: {from: {enabled: true,type: "arrow"}}})
  
  policyDetails.queues.map(queueDetails => {
    if(queueDetails['queue-name'].includes('Parent Queue:')){
      nodes.push({id: 'ParentQueue', font: font, label: queueDetails['queue-name']});
    }
    else{
      nodes.push({id: queueDetails['queue-name'], font: font, label: queueDetails['queue-name']});
    }
  });

  policyDetails.queues.map(queueDetails => {
    if(queueDetails['queue-name'].includes('Parent Queue:')){
      edges.push({id: policyDetails.interface_policy + queueDetails['queue-name'], from: queueDetails['queue-name'], to: 'Classifier', font: font,
                  arrows: {from: {enabled: true, type: "arrow"}}});
      edges.push({id: 'ParentToClassifier', from: 'Classifier', to: 'ParentQueue', label: queueDetails.rate, font: font, arrows: {to: {enabled: true,type: "arrow"}}})
    }
    else{
      if(parseInt(queueDetails.rate) > 0){
        edges.push({id: policyDetails.interface_policy + queueDetails['queue-name'], from: queueDetails['queue-name'], to: 'ParentQueue', 
        font: font, 
        label: 'Rate: ' + queueDetails.rate + "\n" + 'TailDrops: ' + queueDetails['tail-drops'], 
        color: 'yellow',
        arrows: {from: {enabled: true, type: "arrow"}}});
      }
      else{
        edges.push({id: policyDetails.interface_policy + queueDetails['queue-name'], from: queueDetails['queue-name'], to: 'ParentQueue', 
        font: font, 
        label: 'Rate: ' + queueDetails.rate + "\n" + 'TailDrops: ' + queueDetails['tail-drops'], 
        arrows: {from: {enabled: true, type: "arrow"}}});
      }

      if(parseInt(queueDetails['tail-drops']) > 0){
        edges.push({id: policyDetails.interface_policy + queueDetails['queue-name'], from: queueDetails['queue-name'], to: 'ParentQueue', 
        font: font, 
        label: 'Rate: ' + queueDetails.rate + "\n" + 'TailDrops: ' + queueDetails['tail-drops'], 
        color: 'red',
        arrows: {from: {enabled: true, type: "arrow"}}});
      }
    }
  });
  
  var network = new Network(ref, {nodes: nodes, edges: edges}, options('green', 'DU', 'square'));
  
  return network

  }