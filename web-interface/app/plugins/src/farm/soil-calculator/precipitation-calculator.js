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
            const totalPrecipitation = Math.round( data.weather.reduce(
              ( acc, record ) => acc + ( record.precipitation || 0 ),
              0,
            ) );

            const station = data.sources && data.sources.length > 0 ? data.sources[0] : {};
            const stationName = station.station_name;
            const stationId = station.id;
            const stationLat = station.lat;
            const stationLon = station.lon;
            const first = formatDate( data.weather[0].timestamp );
            const last = formatDate( data.weather[data.weather.length - 1].timestamp );

            return {
              PCIPAPI: {
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
          console.warn( 'Error fetching weather data:', error );
          return null;
        }
      }
      else {
        console.warn( 'End date must be later than start date.' );
        return null;
      }
    }
    else {
      return null;
    }
  }

  function formatDate( dateString ) {
    if ( dateString === -1 ) {return null}
    return dateString.split( 'T' )[0];
  }

  return {
    getPcip: getPcip,
  };
} )();
