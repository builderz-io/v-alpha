const validator = require( 'validator' );

module.exports = data => {

  const target = data.profileInputServerSide.target;
  const unit = data.profileInputServerSide.unit;
  const role = data.c;

  if ( target || unit ) {
    if ( !validator.isNumeric( target + '' ) ) {
      throw new Error( '-5152 target must be a number' );
    }
    else if ( !validator.isAlphanumeric( unit + '' ) ) {
      throw new Error( '-5153 unit must be alphanumeric' );
    }
    else if ( unit.length >= 10 ) {
      throw new Error( '-5154 max 10 chars in unit' );
    }
    else if ( Number( target ) < 1 ||  Number( target ) > 9999 ) {
      throw new Error( '-5151 target must be between 1 - 9999' );
    }
    else if ( role == 'Pool' && !target ) {
      throw new Error( '-5155 pools must have a target' );
    }
    else if ( role != 'Pool' && ( !target || !unit ) ) {
      throw new Error( '-5150 both target and unit, such as "hour", must be present' );
    }
    else {
      data.profileInputServerSide.target = Number( target );
    }

  }

  return true;
};
