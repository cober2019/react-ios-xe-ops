// hello.test.js

import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import { Index }  from '../Index/Index-Parent'
import { LayerTwo }  from '../LayerTwo/layerTwo-Parent.js';
import { Environment }  from '../Environment/Env-Parent.js';
import { Routing }  from '../LayerThree/Routing-Parent.js';
import { Dmvpn }  from '../DMVPN/Dmvpn-Parent.js';
import { RestConfig }  from '../Config/config.js';
import { RibIndex }  from '../RibStatus/RIB-Parent.js';
import { DeviceAuth }  from '../Other/login.js';
import { IpSlas }  from '../IPSlas/SlaParent.js';
import { LiveInterfaces }  from '../InterfaceGraphs/liveInterface.js';
import { MacData, SpanData, VlansData, TrunkData, AccessData, DpData } from './testData'


let container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

it("renders with or without a name", () => {

  act(() => {
    const bridgeGlobalTble = '' 
    const trunk = TrunkData()
    const access = AccessData ()  
    localStorage.setItem('ip', '1.1.1.1');
    render(<LayerTwo span={SpanData[0]['Cisco-IOS-XE-spanning-tree-oper:stp-details']['stp-detail']}  dpNeighbors={DpData} vlans={VlansData} trunks={trunk}
                                        mac_addresses={MacData} access={access} bridgeGlobalTble={bridgeGlobalTble} />, container);
  });
  expect(container);

})

