import React from 'react';

import Avatar from './Avatar/Avatar';
import Layout from './Layout/Layout';
import Sidebar from './Sidebar/Sidebar';
import Headbar from './Headbar/Headbar';
import Menu from './Menu/Menu';
import NavItem from './NavItem/NavItem';
import CustomTable, { getListContentToDisplay } from './CustomTable/CustomTable';

const AddDataButton = React.lazy(() => import('./AddDataButton/AddDataButton'));
const IconButton = React.lazy(() => import('./IconButton/IconButton'));
const AvatarNameEmail = React.lazy(() => import('./AvatarNameEmail/AvatarNameEmail'));

export {
    Avatar, AvatarNameEmail, Layout, Sidebar, Headbar,
    Menu, NavItem, AddDataButton, IconButton, CustomTable,
    getListContentToDisplay
}
