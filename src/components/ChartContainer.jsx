import React, {useState} from 'react';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import { toast } from 'react-toastify';
import Card from '@material-ui/core/Card';
import CardHeader from './CardHeader';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import ChartCard from '../Features/API-Chart/ChartCard';
import ListSelect from '../Features/API-Chart/ListSelect';

const GET_EPOCH = gql`
{
  heartBeat
}
`;


const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  card: {
    margin: '5% 0.5%',
  }
}));


export default () => {
  const classes = useStyles(0);
  const [SelectedDataName, setSelectedDataName] = useState([]);
  const { loading, error, data } = useQuery(GET_EPOCH);

  if (loading) return (
    <p>loading...</p>
  );
  if (error) return (
    toast.error(`Error Received: ${error}`),
    <p>Error...</p>
  );

  // Hackey solution For scaling chart sizes Check what the current Amount of Selected items there are and it just size as necessary
  let numOfNames = SelectedDataName.length;
  let gridSize = 12;

  if (numOfNames >= 3) {
    gridSize = 4;
  } else if (numOfNames === 2) {
    gridSize = 6;
  }
  
  const handleChange = event => {
    setSelectedDataName(event.target.value);
  };

  return (
    <div className={classes.root}>
      <Card className={classes.card}>
        <CardHeader title="Select Metric to view" />
        <ListSelect handleChange={handleChange} SelectedDataName={SelectedDataName}/>
        <CardContent>
          <Grid container spacing={3}>
            {SelectedDataName.map(dataName => (
              <Grid item xs={gridSize} key={dataName}>
                <ChartCard daName={dataName} epochTime={data.heartBeat}/>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    </div>
  );
};
