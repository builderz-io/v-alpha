const assert = require( 'assert' );
const controller = require( './v-entity-controller' );

const t = controller.__test;

function run() {
  const meta = t.castResearchMeta( {
    servicefields: {
      s32: JSON.stringify( {
        ownerUuid: 'owner1',
        roles: {
          researchOwner: ['owner1'],
          researchCollaborator: ['col1'],
          farmerMember: ['farmer1'],
          viewer: ['viewer1'],
        },
      } ),
    },
  } );

  assert.strictEqual( t.canManageResearch( 'owner1', meta ), true );
  assert.strictEqual( t.canManageResearch( 'col1', meta ), true );
  assert.strictEqual( t.canManageResearch( 'farmer1', meta ), false );

  assert.strictEqual( t.canViewFullData( 'owner1', meta ), true );
  assert.strictEqual( t.canViewFullData( 'col1', meta ), true );
  assert.strictEqual( t.canViewFullData( 'farmer1', meta ), true );
  assert.strictEqual( t.canViewFullData( 'viewer1', meta ), false );

  const grouped = t.castGroupedEntities( {
    servicefields: {
      s30: '["plotA","plotB"]',
    },
  } );
  assert.deepStrictEqual( grouped, ['plotA', 'plotB'] );

  const consent = t.castConsentRecords( {
    servicefields: {
      s34: JSON.stringify( [ { farmerUuid: 'farmer1', status: 'active' } ] ),
    },
  } );
  assert.strictEqual( consent.length, 1 );
  assert.strictEqual( consent[0].status, 'active' );
}

run();
console.log( 'v-entity-controller.test.js passed' );
