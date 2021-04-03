import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import { toast } from 'react-toastify';
import { makeStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import ListItemText from '@material-ui/core/ListItemText';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';


  const useStyles = makeStyles(theme => ({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 220,
      maxWidth: 400,
    }
  }));
  
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };
  
  const GET_METRICS = gql`
  {
    getMetrics
  }
`;


  export default (props) => {
    const classes = useStyles(0);
    const { loading, error, data } = useQuery(GET_METRICS);

    if (loading) return (
      toast.info(`loading Please wait..`),
      <p>loading...</p>
    );
    if (error) return (
      toast.error(`Error Received: ${error}`),
      <p>Error...</p>
    );
      const {getMetrics} = data;
      
  
    const { handleChange, SelectedDataName} = props;
  return (
        <FormControl className={classes.formControl}>
          <InputLabel id="site-metric-Select">Work Site Metric Data</InputLabel>
          <Select
            labelId="site-metric-Select"
            id="work-site-metric-selecter"
            multiple
            value={SelectedDataName}
            onChange={handleChange}
            input={<Input />}
            renderValue={selected => selected.join(', ')}
            MenuProps={MenuProps}
          >
            {getMetrics.map(name => (
              <MenuItem key={name} value={name}>
                <Checkbox checked={SelectedDataName.indexOf(name) > -1} />
                <ListItemText primary={name} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>

  );
  };