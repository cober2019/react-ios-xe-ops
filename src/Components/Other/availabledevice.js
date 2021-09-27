import React from 'react';
import { Navbar } from '../Other/navbar';

export  function AvailableDevices(){

  return  <div>
            <Navbar/>
            <form>
            <div class="form-row align-items-center">
                <div className="row">
                    <div class="col-sm-3 my-1">
                        <label class="sr-only" for="inlineFormInputName">Name</label>
                        <input type="text" class="form-control" id="inlineFormInputName" placeholder="Jane Doe"/>
                    </div>
                    <div class="col-sm-4 my-1">
                        <label class="sr-only" for="inlineFormInputGroupUsername">Username</label>
                        <div class="input-group">
                            <div class="input-group-prepend">
                            <div class="input-group-text">@</div>
                            </div>
                            <input type="text" class="form-control" id="inlineFormInputGroupUsername" placeholder="Username"/>
                        </div>
                    </div>
                    <div class="col-sm-4 my-1">
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" id="autoSizingCheck2"/>
                            <label class="form-check-label" for="autoSizingCheck2">
                            Remember me
                            </label>
                        </div>
                    </div>
                    <div class="col-auto my-1">
                        <button type="submit" class="btn btn-primary">Submit</button>
                    </div>
                </div>
            </div>
            </form>
            
            <div class="row">
                        <div class="col-xl-12">
                            <div class="card">
                            <div class="card-header border-0">
                                <div class="row align-items-center">
                                <div class="col ">
                                    <span><h3 class="mb-0">Devices</h3></span>
                                </div>
                                </div>
                            </div>
                                <div class="table-responsive">
                                <table class="table align-items-center table-striped" id="interfaceTable">
                                    <thead class="thead-light">
                                    <tr>
                                        <th scope="col" class="text-left">Device</th>
                                        <th scope="col" class="text-left">Model</th>
                                        <th scope="col" class="text-left">Uptime</th>
                                        <th scope="col" class="text-left">Serial</th>
                                        <th scope="col" class="text-left">Last Poll</th>
                                        <th scope="col" class="text-right"></th>
                                    </tr>
                                    </thead>
                                </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
  }
