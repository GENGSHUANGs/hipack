/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { Component } from 'react';
import { DatePicker } from 'antd';

import cx from 'classnames';
import s from './Box.scss';

class Header extends Component {
	componentWillMount(){
		this.setState({
			red:true,
			startValue: null,
			endValue: null,
		});
	}

	handleClick(event){
		this.setState({red:!this.state.red});
	}

	disabledStartDate(startValue) {
		if (!startValue || !this.state.endValue) {
		return false;
		}
		return startValue.getTime() >= this.state.endValue.getTime();
	}

	disabledEndDate(endValue) {
		if (!endValue || !this.state.startValue) {
		return false;
		}
		return endValue.getTime() <= this.state.startValue.getTime();
	}

	onChange(field, value) {
		console.log(field, 'change', value);
		this.setState({
		[field]: value,
		});
	}

	render() {
		return (
			<div>
			<div className={s.box} style={{borderSize:'3px',borderStyle:'solid',borderColor:this.state.red ? 'red' : 'green'}} onClick={this.handleClick.bind(this)}>Click me to toggle</div>
			<div className={s.whiteBox}>
				<DatePicker disabledDate={this.disabledStartDate.bind(this)}
					value={this.state.startValue}
					placeholder="开始日期"
					onChange={this.onChange.bind(this, 'startValue')} />&nbsp;
				<DatePicker disabledDate={this.disabledEndDate.bind(this)}
					value={this.state.endValue}
					placeholder="结束日期"
					onChange={this.onChange.bind(this, 'endValue')} />
			</div>
			</div>
		);
	}

}

export default Header;
