import { Card, CardContent, FormControl, MenuItem, Select } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import './App.css';
import InfoBox from "./InfoBox"
import Map from "./Map"
import Table from "./Table"
import { prettyPrintStat, sortData } from './util';
import LineGraph from "./LineGraph"
import "leaflet/dist/leaflet.css"

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide');
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] =useState([]);
  const [mapCenter, setMapCenter] = useState ({ lat:34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState (3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState ("cases");

  //worldwide numbers
  useEffect (() => {
    fetch("https://disease.sh/v3/covid-19/all")
    .then(response => response.json())
    .then(data => {
      setCountryInfo(data);
    })

  }, [])

  useEffect(() =>{
    //code here will run once when the component loads and the [variable] changes
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then((response) => response.json())
      .then((data) => {
        const countries = data.map((country) =>(
          {
            name: country.country,//canada, bangladesh
            value: country.countryInfo.iso2 //ca, bd
          }
        ));
        
        const sortedData = sortData(data);
        setTableData(sortedData); //sorted data, can change to alphabatically >> use 'data' not 'sortData'
        setCountries(countries);
        setMapCountries(data)
      })
    }
    getCountriesData();
  }, []);

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;    
    setCountry(countryCode);

    const url = countryCode === 'worldwide' ? 'https://disease.sh/v3/covid-19/all' : 
    `https://disease.sh/v3/covid-19/countries/${countryCode}`
    
    await fetch(url)
    .then(response => response.json())
    .then(data => {
      setCountry(countryCode);
      setCountryInfo(data);//all data from country

      setMapCenter([data.countryInfo.lat, data.countryInfo.long])
      setMapZoom(4)

    })
    
  }
  

  //useeffect = runs a code based on condition 




  return (
    <div className="app">
      <div className="app_left" >
        <div className="app_header">
          <h1 className="app_title" >Covid-19 Tracker</h1>
          <FormControl className = "app_dropdown">
            <Select 
            variant = "outlined" 
            value ={country}
            onChange = {onCountryChange}
            >

              {/**loop through all countries and show on drop down */}
              <MenuItem value = "worldwide">Worldwide</MenuItem>
              {
                countries.map(country => (
                  <MenuItem value = {country.value}> {country.name} </MenuItem> 
                ))
              }            
            </Select>
          </FormControl>
        </div>
        
        <div className = "app_stats">
          <InfoBox 
          isOrange
          active={casesType === "cases"}
          onClick = {e => setCasesType('cases')}
          title = "Coronavirus Cases Today" 
          total={prettyPrintStat(countryInfo.cases)} 
          cases={prettyPrintStat(countryInfo.todayCases)} />
          <InfoBox 
          isGreen
          active={casesType === "recovered"}
          onClick = {e => setCasesType('recovered')}
          title = "Recoveries Today" 
          total={prettyPrintStat(countryInfo.recovered)} 
          cases={prettyPrintStat(countryInfo.todayRecovered)}/>
          <InfoBox 
          isRed
          active={casesType === "deaths"}
          onClick = {e => setCasesType('deaths')}
          title = "Deaths Today" 
          total={prettyPrintStat(countryInfo.deaths)} 
          cases={prettyPrintStat(countryInfo.todayDeaths)}/>               
        </div>             

        <Map 
        casesType = {casesType}
        countries = {mapCountries}
        center={mapCenter}
        zoom={mapZoom} />
        
      </div>
      <Card className="app_right">
        <CardContent>
          <h3>Live Cases by Country</h3>
          <Table countries={tableData}/> 
          <h3 className="app_graphTitle">Worldwide {casesType}</h3>   
          <LineGraph className="app_graph" casesTypes={casesType}/>      
          
        </CardContent>
        
      </Card>

    </div>
  );
}

export default App;
