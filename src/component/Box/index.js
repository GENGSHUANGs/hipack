/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { Component } from 'react';
import cx from 'classnames';
import s from './Box.scss';

class Header extends Component {
	componentWillMount(){
		this.setState({red:true});
	}

	handleClick(event){
		this.setState({red:!this.state.red});
	}

	render() {
		return (
			<div className={s.root} style={{backgroundColor:this.state.red ? 'red' : 'green'}} onClick={this.handleClick.bind(this)}>Click me to toggle</div>
		);
	}

}

export default Header;
