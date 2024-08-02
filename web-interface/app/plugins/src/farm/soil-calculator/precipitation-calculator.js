const PcipCalculator = ( () => {

  async function getPcip( _ ) {
    
    if ( _.startDate && _.endDate ) {
      if ( new Date( _.startDate ) <= new Date( _.endDate ) ) {
        try {
          const response = await fetch(
            `https://api.brightsky.dev/weather?date=${_.startDate}&last_date=${_.endDate}&lat=${_.lat}&lon=${_.lng}&max_dist=${_.maxDist}`,
          );
          const data = await response.json();

          if ( data.weather.length > 0 ) {
            const totalPrecipitation = data.weather.reduce(
              ( acc, record ) => acc + ( record.precipitation || 0 ),
              0,
            );
            return totalPrecipitation;
          }
          else {
            return 'No data available for the selected date range.';
          }
        }
        catch ( error ) {
          console.error( 'Error fetching weather data:', error );
          return 'Error fetching data';
        }
      }
      else {
        alert( 'End date must be later than start date.' );
        return null;
      }
    }
    else {
      alert( 'Please select both start and end dates.' );
      return null;
    }
  }

  return {
    getPcip: getPcip,
  };

} )();