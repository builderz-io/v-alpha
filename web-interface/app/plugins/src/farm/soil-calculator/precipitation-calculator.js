const PcipCalculator = ( () => {
  

  async function getPcip( _ ) {
    if (
      _.startDate && _.endDate
      && ( _.startDate !== _.previousStartDate || _.endDate !== _.previousEndDate )
    ) {
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

            const station = data.sources && data.sources.length > 0 ? data.sources[0] : {};
            const stationName = station.station_name;
            const stationId = station.id;
            const stationLat = station.lat;
            const stationLon = station.lon;
            const first = data.weather[0].timestamp;
            const last = data.weather[data.weather.length - 1].timestamp;

            return {
              PCIP_MM: {
                MM: totalPrecipitation,
                STATION: {
                  ID: stationId,
                  NAME: stationName,
                  LAT: stationLat,
                  LON: stationLon,
                },
                DATE: {
                  FIRST: first,
                  LAST: last,
                },
              },
            };
          }
          else {
            return 0;
          }
        }
        catch ( error ) {
          console.error( 'Error fetching weather data:', error );
          return null;
        }
      }
      else {
        alert( 'End date must be later than start date.' );
        return null;
      }
    }
    else {
      return null;
    }
  }

  return {
    getPcip: getPcip,
  };
} )();
