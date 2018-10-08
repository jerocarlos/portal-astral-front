import * as React from 'react';
import { StyleRules, Theme, withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Hidden from '@material-ui/core/Hidden';
import SupervisorAccountOutlinedIcon from '@material-ui/icons/SupervisorAccountOutlined';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import SchoolIcon from '@material-ui/icons/School';
import ListItem from '@material-ui/core/ListItem/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText/ListItemText';
import { Props, State } from "./types";
import { Link, withRouter } from "react-router-dom";
import session from "../../../utils/session";

const drawerWidth = 240;

export const enum UserType {
  PROFESSOR, ADMINISTRATOR, STUDENT,
}

const styles = require('./Sidebar.pcss')

const _styles = (theme: Theme): StyleRules => ({
  // toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
    height: '100%',
    overflowY: 'hidden',
    [theme.breakpoints.up('md')]: {
      position: 'relative',
    },
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3,
  },
});

function AdminItem(props: { pathname: string }) {
  return <Link to={"/admins"} className={styles.link}>
    <ListItem className={styles.listItem} selected={props.pathname === '/admins'}>
      <ListItemIcon>
        <SupervisorAccountOutlinedIcon />
      </ListItemIcon>
      <ListItemText primary='Administradores' />
    </ListItem>
  </Link>;
}

function ProfessorItem(props: { pathname: string }) {
  return <Link to={"/professors"} className={styles.link}>
    <ListItem className={styles.listItem} selected={props.pathname === '/professors'}>
      <ListItemIcon>
        <AccountBalanceIcon />
      </ListItemIcon>
      <ListItemText primary='Profesores' />
    </ListItem>
  </Link>;
}

function StudentItem(props: { pathname: string }) {
  return <Link to={"/students"} className={styles.link}>
    <ListItem className={styles.listItem} selected={props.pathname === '/students'}>
      <ListItemIcon>
        <SchoolIcon />
      </ListItemIcon>
      <ListItemText primary='Alumnos' />
    </ListItem>
  </Link>;
}

class Sidebar extends React.Component<Props, State> {

  state: State = {
    mobileOpen: false,
    anchorEl: null,
  };

  handleDrawerToggle = () => {
    this.setState((state: any) => ({ mobileOpen: !state.mobileOpen }));
  };

  isUserLogged = () => {
    return !!sessionStorage.getItem('user');
  };

  render() {
    const { classes, theme } = this.props;

    if (!this.isUserLogged()) {
      return null;
    }

    const userType = session.getUserType();

    const { pathname } = this.props.location;

    const drawerContent = (
      <div>
        {/*<div className={classes.toolbar} />*/}
        <List>

          {userType === 'Admin' && <AdminItem pathname={pathname} />}

          {userType === 'Professor' || userType === 'Admin' && <ProfessorItem pathname={pathname} />}

          <StudentItem pathname={pathname} />

        </List>
      </div>
    );

    return (
      <div className={styles.container}>

        <Hidden mdUp className={styles.drawerContainer}>
          <Drawer
            variant='temporary'
            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
            open={this.state.mobileOpen}
            onClose={this.handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {drawerContent}
          </Drawer>
        </Hidden>

        <Hidden smDown implementation='css' className={styles.drawerContainer}>
          <Drawer
            variant='permanent'
            open
            classes={{
              paper: classes.drawerPaper,
            }}
            className={styles.drawer}
          >
            {drawerContent}
          </Drawer>
        </Hidden>

      </div>
    );
  }
}

export default withRouter(withStyles(_styles, { withTheme: true })(Sidebar));