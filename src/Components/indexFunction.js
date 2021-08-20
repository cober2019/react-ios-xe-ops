import { PollInterfaces, GetCpuStatus, GetEnvStatus, GetDpNeighbors} from './promises'

export async function PollInterfaceStats(ip, username, password, port){
    try{
        var interfaces = await PollInterfaces(ip, username, password, port)
        if(interfaces === undefined){
            var data = [[]]
        }
        else{
            var data = interfaces.data
        }
    }
    catch(e){
        var data = [[]]
    }
    return data
}

export async function PollDpNeighbors(){
    try{

        var dpNeighbors = await GetDpNeighbors(ip, username, password, port)
        if(dp_neighbors === undefined){
            var data = [[]]
        }
        else{
            var data = dpNeighbors.data.data
        }
    }
    catch(e){
        var data = [[]]
    }
    return data
}

export async function PollCpu(){
  try{
    var cpu = await GetCpuStatus(ip, username, password, port)
    if(cpu === undefined){
        var data = [[]]
    }
    else{
        var data = cpu
    }
  }
  catch(e){
    var data = [[]]
  }

  return data
}

export async function PollEnv(){
  try{
    var env = await GetEnvStatus(ip, username, password, port)
    if(env === undefined){
        var data = [[]]
    }
    else{
      var data = env.data.data
    }
  }
  catch(e){
    var data = [[]]
  }

    return data
}   