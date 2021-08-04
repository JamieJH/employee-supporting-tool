// import React, { Component } from 'react';
// import Headbar from './Headbar/Headbar';
// import Sidebar from './Sidebar/Sidebar';


// class Header extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             isOpen: false
//         }
//         this.sidebarToggler = this.sidebarToggler.bind(this)
//     }

//     sidebarToggler() {
//         this.setState((state) => ({
//             isOpen: !state.isOpen
//         }))

//     }


//     render() {
//         return (
//             <React.Fragment>
//                 <Headbar isOpen={this.state.isOpen} sidebarToggler={this.sidebarToggler} />
//                 <Sidebar isOpen={this.state.isOpen} />
//             </React.Fragment>
//         );
//     }
// }

// export default Header;