import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import {AccountCircle} from '@material-ui/icons';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { IProps, IState } from './types';
import Dialog from "@material-ui/core/es/Dialog/Dialog";
import DialogTitle from "@material-ui/core/es/DialogTitle/DialogTitle";
import DialogContentText from "@material-ui/core/es/DialogContentText/DialogContentText";
import DialogContent from "@material-ui/core/es/DialogContent/DialogContent";
import Button from "@material-ui/core/es/Button/Button";
import DialogActions from "@material-ui/core/es/DialogActions/DialogActions";

const drawerWidth = 240;

const styles = (theme: any) => ({
    appBar: {
        position: 'absolute',
        backgroundColor: '#2196f3',
        marginLeft: drawerWidth,
        [theme.breakpoints.up('md')]: {
            width: `calc(100% - ${drawerWidth}px)`,
        },
    },
    navIconHide: {
        [theme.breakpoints.up('md')]: {
            display: 'none',
        },
    },
    accountBtn: {
        marginLeft: 'auto',
    },
    userName: {
        marginLeft: 'auto',
    },
});

class Topbar  extends React.Component<IProps, IState> {

    state: IState = {
        mobileOpen: false,
        anchorEl: undefined,
    };

    handleDrawerToggle = () => {
        this.setState((state: any) => ({ mobileOpen: !state.mobileOpen }));
    };

    handleClick = event => {
        this.setState({ anchorEl: event.currentTarget });
    };

    handleClose = () => {
        this.setState({ anchorEl: undefined });
    };

    handleLogOut = () => {
        console.log("hasta aca llegue");
        this.props.onClickLogOut();
        console.log("estoy abriendo el modal...");
        this.setState({ anchorEl: undefined });
    };

    handleCloseLogOut = () => {
        this.props.onCloseLogOut();
    };

    // handleConfirmLogOut = () => {
    //     this.props.onConfirmLogOut(this.props.professor as IProfessor);
    // };

    render() {
        const {classes}: any = this.props;
        const userName = "chabon";
        const { anchorEl } = this.state;
        const { isLogOutOpen } = this.props;

        {
            isLogOutOpen &&
            <Dialog open={true}>
                <DialogTitle>Confirm delete "{"Sapo"}"</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to log out?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleCloseLogOut } color="primary">
                        Cancel
                    </Button>
                    {/*<Button onClick={this.handleConfirmLogOut()} color="secondary" variant='contained'>*/}
                        {/*Confirm*/}
                    {/*</Button>*/}
                </DialogActions>
            </Dialog>
        }

        return (
            <div>
                <AppBar className={classes.appBar}>
                    <Toolbar>
                        <IconButton
                            color='inherit'
                            aria-label='Open drawer'
                            onClick={this.handleDrawerToggle}
                            className={classes.navIconHide}
                        >
                            <MenuIcon/>
                        </IconButton>
                        <Typography variant='title' color='inherit' noWrap>
                            {"PORTAL ASTRAL"}
                        </Typography>
                        <Typography className={classes.accountBtn} variant='title' color='inherit' noWrap>
                            {userName}
                        </Typography>
                        <IconButton
                            color="inherit"
                            aria-owns={anchorEl ? 'simple-menu' : undefined}
                            aria-haspopup="true"
                            onClick={this.handleClick}
                            >
                            <AccountCircle/>
                        </IconButton>
                        <Menu
                            id="simple-menu"
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={this.handleClose}
                        >
                            <MenuItem onClick={this.handleClose}>Profile</MenuItem>
                            <MenuItem onClick={this.handleLogOut}>Logout</MenuItem>
                        </Menu>
                    </Toolbar>
                </AppBar>
            </div>
        );
    }
}

export default withStyles(styles as any, { withTheme: true })(Topbar);
