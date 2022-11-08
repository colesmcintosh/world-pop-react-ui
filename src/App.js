import * as React from 'react';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { Typography, Autocomplete, TextField } from '@mui/material';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

function Data(props) {
  const [country, setCountry] = React.useState(null);

  const data = props.data.sort((a,b) => (a.Country > b.Country) ? 1 : ((b.Country > a.Country) ? -1 : 0));

  const currentData = country === '' ? props.data.sort() : props.data.filter((item) => item.Country === country).sort();

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode !== 'dark' ? theme.palette.primary.main : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.mode !== 'dark' ? '#fff' : theme.palette.text.secondary,
    borderRadius: '0.5rem',
    borderColor: theme.palette.mode !== 'dark' ? "black" : theme.palette.text.secondary,
    borderStyle: 'solid',
    boxShadow: '1px 5px 1px 1px black',
  }));

  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );

  const options = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        display: false,
        position: 'top',
      },
      title: {
        display: true,
        text: 'Population Trend',
      },
    },
  };

  const labels = [
    '1970',
    '1980',
    '1990',
    '2000',
    '2010',
    '2020'
  ];

  const populationOvertimeChartData = {
    labels: labels,
    datasets: [
      {
        label: 'Population',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderColor: 'rgba(255, 99, 132, 1)',
        data: country !== null ? [currentData[0]._1970_Population, currentData[0]._1980_Population, currentData[0]._1990_Population, currentData[0]._2000_Population, currentData[0]._2010_Population, currentData[0]._2020_Population] : [0, 0, 0, 0, 0, 0],
      },
    ],
  };



  return (
    <div>
    <Box sx={{ minWidth: 120 }}>
      <Autocomplete
        options={data.map((row) => (
          row.Country
        ))}
        sx={{ width: 300, textAlign: "center", margin: "1rem auto" }}
        renderInput={(params) => <TextField {...params} label="Country" />}
        value={country}
        onChange={(event, newCountry) => {
          setCountry(newCountry);
        }}
      />
    </Box>
    {country !== null ? (
    <Box sx={{ flexGrow: 1, marginTop: "5vh" }}>
      <Grid container spacing={2}>
        <Grid item xs={4} sx={{height: "3rem"}}>
          <Typography sx={{textAlign: "center"}}>Population</Typography>
            <Item sx={{backgroundColor: "primary.main", color: "white"}}>{currentData.map((row) => row['_2022_Population'].toLocaleString("en-US"))}</Item>
        </Grid>
        <Grid item xs={4} sx={{height: "3rem"}}>
          <Typography sx={{textAlign: "center"}}>Area (Miles)</Typography>
            <Item>{currentData.map((row) => row['area_in_miles'].toLocaleString("en-US"))}</Item>
        </Grid>
        <Grid item xs={4} sx={{height: "3rem"}}>
        <Typography sx={{textAlign: "center"}}>People per mile</Typography>
          <Item>{currentData.map((row) => row['_2022_pop_density_miles'].toLocaleString("en-US"))}</Item>
        </Grid>
        <Grid item xs={4}>
        </Grid>
        <Grid item xs={4} sx={{margin: "4vh 0rem 5vh 0rem"}}>
        <Typography sx={{textAlign: "center"}}>Population Density</Typography>
          <Item>{currentData.map((row) => row['Pop_abstract'])}</Item>
        </Grid>
        <Grid item xs={4}>
        </Grid>
      </Grid>
      <Box sx={{position: "relative", height:"40vh", width:"80vw", marginLeft: "9vw"}}>
        <Line options={options} data={populationOvertimeChartData} />
      </Box>

    </Box>
    ) : (
      <Typography variant="h3" sx={{textAlign: "center", margin: "1rem 0rem"}}>Select a country</Typography>
    )}
      
    </div>
  );
}




function App() {

  const [data, setData] = React.useState([]);

  React.useEffect(() => {
    fetch('https://world-population-api-7aje.onrender.com/data')
      .then(response => response.json())
      .then(data => setData(data));
  }, []);

  if (data.length === 0) {
    return <Typography variant='h3' sx={{textAlign: "center", margin: "20rem auto", width: "60%"}}>Loading...</Typography>;
  }
  
  return (
    <div className="App">
      <Typography variant='h3' sx={{textAlign: "center", margin: "1rem auto"}}>World Population Analysis</Typography>
      <Data data={data} />
    </div>
  );
}

export default App;
