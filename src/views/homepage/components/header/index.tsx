import { AppBar, Container, Toolbar, Typography, Box, IconButton, Button, Menu, MenuItem } from '@mui/material';
import React, { useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import ConfirmAlert from '../../../components/confirmAlert';

interface ButtonsModel {
    text: string
    func: () => void
}

interface HeaderProps {
    setHideCompleted: (hide: boolean) => void
    hideCompleted: boolean
    deleteAllTasks: () => void
}

const Header: React.FC<HeaderProps> = ({ hideCompleted, setHideCompleted, deleteAllTasks }) => {
    const [showAlert, setShowAlert] = useState(false);
    const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const buttons: ButtonsModel[] = [
        {
            text: hideCompleted ? "Show All" : 'Hide Completed',
            func: () => setHideCompleted(!hideCompleted)
        },
        {
            text: 'Clear All',
            func: () => setShowAlert(true) // otherwise some crap gets passed in (when doing func: deleteAllTasks)
        }
    ];

    return (
        <>
            <AppBar position="static">
                <Container maxWidth="xl">
                    <Toolbar disableGutters>
                        <Typography
                            variant="h5"
                            noWrap
                            component="div"
                            sx={{ mr: 2, display: { xs: 'none', md: 'flex' } }}
                        >
                            BUG TRACKER
                        </Typography>

                        <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                            <IconButton
                                size="large"
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleOpenNavMenu}
                                color="inherit"
                            >
                                <MenuIcon />
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorElNav}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left',
                                }}
                                open={Boolean(anchorElNav)}
                                onClose={handleCloseNavMenu}
                                onClick={handleCloseNavMenu}
                                sx={{
                                    display: { xs: 'block', md: 'none' },
                                }}
                            >
                                {buttons.map((btn) => (
                                    <MenuItem key={btn.text} onClick={btn.func}>
                                        <Typography textAlign="center">{btn.text}</Typography>
                                    </MenuItem>
                                ))}
                            </Menu>
                        </Box>

                        <Typography
                            variant="h6"
                            noWrap
                            component="div"
                            sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}
                        >
                            BUG TRACKER
                        </Typography>
                        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }} onClick={handleCloseNavMenu}>
                            {buttons.map((btn) => (
                                <Button
                                    key={btn.text}
                                    onClick={btn.func}
                                    sx={{ my: 2, color: 'white', display: 'block' }}
                                >
                                    {btn.text}
                                </Button>
                            ))}
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>

            <ConfirmAlert show={showAlert} setShow={setShowAlert} desc='Are you sure you want to delete ALL your tasks?' onConfirm={deleteAllTasks} />
        </>
    )
}

export default Header;