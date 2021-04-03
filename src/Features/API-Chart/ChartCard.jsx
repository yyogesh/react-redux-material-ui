import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Label } from 'recharts';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import { toast } from 'react-toastify';

const metricColor = {
  injValveOpen: '#eb4034',
  flareTemp: '#82ca9d',
  waterTemp: '#0a5e8f',
  tubingPressure: '#650a8f',
  oilTemp: '#0a8f72',
  casingPressure: '#03005c'
}

const GET_MEASUREMENTS = gql`
  query getMeasurements($metricInfo: MeasurementQuery) {
    getMeasurements(input: $metricInfo) {
      metric
      at
      value
      unit
    }
  }
`;

export default props => {
  //to get time and minus 30 min's and send back to sever as UINX time-stamp
  var queryTime = new Date(props.epochTime);
  queryTime.setMinutes(queryTime.getMinutes() - 30);
  const queryTimeUINX = Math.round(queryTime.getTime() / 1000);
  //get metric name
  const dataName = props.daName;
  //setup query
  const dataQ = { metricName: dataName, after: queryTimeUINX };

  const { loading, error, data } = useQuery(GET_MEASUREMENTS, {
    variables: { 'metricInfo': dataQ },
    pollInterval: 200,
  });
  //error handling/check if loading
  if (loading) {
    toast.info(`loading Please wait..`)
    return (<p>loading...</p>);
  }
  if (error) {
    console.error(error);
    toast.error(`Error Received: ${error}`)
    return (<p>Error...</p>)
  }
  const { getMeasurements } = data;

  const { unit } = getMeasurements[0];
  let measurementData = [];
  getMeasurements.forEach(measurement => {
    let newMeasurementWithTime = measurement;
    let dateTimeObj = new Date(measurement.at);

    let utcString = dateTimeObj.toUTCString();

    newMeasurementWithTime.dateTime = { Date_Time: utcString.slice(-11, -4) };
    newMeasurementWithTime.time = utcString.slice(-25, -4);
    measurementData.push(newMeasurementWithTime);
  });


  return (
    <React.Fragment>
      <h2>{`${dataName} Value: ${measurementData[measurementData.length - 1].value} ${unit}`}</h2>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={measurementData} margin={{ top: 4, right: 0, left: 5, bottom: 5 }}>
          <XAxis dataKey="time" interval="preserveStartEnd">
            <Label value={dataName} offset={-6} position="insideBottomLeft" />
          </XAxis>
          <YAxis offset={6} label={{ value: `units measured in ${unit}`, angle: -90, position: 'insideBottomLeft' }} />

          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="value" stroke={metricColor[dataName]} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </React.Fragment>
  );
};
