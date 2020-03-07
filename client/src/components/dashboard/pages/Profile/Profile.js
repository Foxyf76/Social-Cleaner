import React, { Fragment } from 'react';
import {
  Container,
  Typography,
  Paper,
  makeStyles,
  Grid,
  Divider,
  Button
} from '@material-ui/core';
import { Twitter, Face, Language, Facebook } from '@material-ui/icons';
import * as colors from '../../../../helpers/colors';

const useStyles = makeStyles(theme => ({
  paper: {
    margin: theme.spacing(2),
    padding: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  divider: {
    paddingBottom: theme.spacing(2),
    width: '40px',
    border: 0
  },
  paperHeader: {
    fontFamily: 'Raleway',
    textTransform: 'uppercase'
  }
}));

const Profile = () => {
  const classes = useStyles();
  return (
    <Container component='main' maxWidth='md'>
      <Paper elevation={2} className={classes.paper}>
        <Typography
          variant='h4'
          className={classes.paperHeader}
          style={{ display: 'flex' }}>
          <Face
            fontSize='large'
            style={{
              color: colors.colorPurple,
              paddingRight: '10px'
            }}
          />
          Profile
        </Typography>

        <hr
          className={classes.divider}
          style={{ borderTop: '2px solid' + colors.colorPurple }}
        />
      </Paper>

      <Paper elevation={2} className={classes.paper}>
        <Typography
          variant='h4'
          className={classes.paperHeader}
          style={{ display: 'flex' }}>
          <Language
            fontSize='large'
            style={{
              color: colors.colorPurple,
              paddingRight: '10px'
            }}
          />
          App Access
        </Typography>

        <hr
          className={classes.divider}
          style={{ borderTop: '2px solid' + colors.colorPurple }}
        />

        <Grid container direction='row' justify='center'>
          <Grid item xs={5} style={{ textAlign: 'center' }}>
            <Facebook
              fontSize='large'
              style={{ color: '#3b5998', height: 120, width: 120 }}
            />
            <br />
            <Button>Test</Button>
          </Grid>
          <Grid item>
            <Divider orientation='vertical' style={{ marginTop: '20px' }} />
          </Grid>
          <Grid item xs={5} style={{ textAlign: 'center' }}>
            <Twitter
              fontSize='large'
              style={{ color: '#1DA1F2', height: 120, width: 120 }}
            />
            <br />
            <Button>Test</Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Profile;
