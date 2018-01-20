import React, { Component } from 'react';
import {STATUS} from './../Consts';
import Status from './Status'
import './where-info.css';

export default class WhereInfo extends Component {

    render() {
        return (
            <div className="where-info">
                <Status key={0} title={STATUS.OOO} people={["David", "Nir", "Saper"]} right="100px"/>
                <Status key={1} title={STATUS.WFH} people={["Shahar", "Ron", "Michael", "Renana", "just testing"]} />
                <Status key={2} title={STATUS.SICK} people={["Michel", "Rona", "Itamar", "Yuval"]} right="-100px"/>
            </div>
        );
    }
}