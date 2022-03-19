const InitHuman = ( function() { // eslint-disable-line no-unused-vars

    /**
     * V Theme Module for creation of a profile for a human being
     *
     */
  
    'use strict';

   
  
    /* ============== user interface strings ============== */
  

  
    /* ================== event handlers ================== */
  


  
    /* ================== private methods ================= */
    
    // presenter
    async function presenter( which ) {
        return which 
    }

    // view 

    function view( which ) {
        V.setNode( 'body', JoinComponents.joinOverlay());

        Google.launch();
        
        console.log( 'new human', which );
    }
 

  
    /* ================  public components ================ */
    
    // draw

    function draw( which ) {
        presenter( which ).then( viewData => { view( viewData ) } );
      }
    
    /* ====================== export ====================== */
  
    return {
        draw: draw,
    };
  
  } )();
  