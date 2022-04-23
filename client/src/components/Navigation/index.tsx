import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import React from 'react';
import HomeIcon from '@mui/icons-material/Home';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';

const Navigation: React.FC = () => {
    return (
        <BottomNavigation
            showLabels
        // value={value}
        // onChange={(event, newValue) => {
        //     setValue(newValue);
        // }}
        >
            <BottomNavigationAction label="Home" icon={<HomeIcon />} />
            <BottomNavigationAction label="Settings" icon={<SettingsIcon />} />
            <BottomNavigationAction label="Logout" icon={<LogoutIcon />} />
        </BottomNavigation>
    )
}

export default Navigation;