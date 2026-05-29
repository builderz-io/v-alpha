#!/usr/bin/env node
/**
 * Seed a dev Person + Plot with soil-calculator data for local testing.
 *
 * Usage: node seed-dev-plot.js
 * Requires: MongoDB on localhost, entity store not required.
 */

const mongoose = require( 'mongoose' );
const EntityDB = require( './models/v-entity-model' );
const {
  buildPlotServicefields,
  DEV_UPHRASE,
  DEV_PERSON_FULL_ID,
  DEV_PLOT_FULL_ID,
} = require( './lib/soil-calc-dev-data' );

const DB = 'v-alpha-local';
const PERSON_TAG = '#1001';
const PLOT_TAG = '#2121';

async function main() {
  await mongoose.connect( 'mongodb://127.0.0.1/' + DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } );

  const personUuid = 'devtest01';
  const plotUuid = 'devplot01';
  const now = new Date();

  await EntityDB.deleteMany( {
    fullId: { $in: [DEV_PERSON_FULL_ID, DEV_PLOT_FULL_ID] },
  } );

  const person = new EntityDB( {
    fullId: DEV_PERSON_FULL_ID,
    path: '/profile/dev-tester-1001',
    private: {
      uPhrase: DEV_UPHRASE,
      evmCredentials: {
        address: '0x0000000000000000000000000000000000000001',
        privateKey: '0x0000000000000000000000000000000000000000000000000000000000000001',
        issuer: 'IDXNS',
      },
    },
    profile: {
      fullId: DEV_PERSON_FULL_ID,
      title: 'Dev Tester',
      tag: PERSON_TAG,
      creator: 'Dev Tester',
      creatorTag: PERSON_TAG,
      role: 'Person',
      joined: { date: now.toString(), unix: Math.floor( now / 1000 ) },
      uuidV4: personUuid,
    },
    paths: {
      entity: '/profile/dev-tester-1001',
      base64: '/' + personUuid,
    },
    status: { active: true, verified: true },
    evmCredentials: {
      address: '0x0000000000000000000000000000000000000001',
      issuer: 'IDXNS',
    },
    receivingAddresses: { evm: '0x0000000000000000000000000000000000000001' },
    geometry: {
      type: 'Point',
      coordinates: [13.405, 52.52],
      rand: false,
    },
    properties: {
      description: 'Local dev account for soil calculator testing',
      target: 0,
      unit: 'day',
      baseLocation: 'Berlin, Germany',
    },
    holderOf: [{
      a: plotUuid,
      c: 'ap',
      fullId: DEV_PLOT_FULL_ID,
    }],
    onChain: { balance: 1000, lastMove: Math.floor( now / 1000 ), timeToZero: 365 },
  } );

  const plot = new EntityDB( {
    fullId: DEV_PLOT_FULL_ID,
    path: '/profile/demo-field-2121',
    private: {
      uPhrase: 'vx' + plotUuid + 'plotkeyxx',
      evmCredentials: {
        address: '0x0000000000000000000000000000000000000002',
        privateKey: '0x0000000000000000000000000000000000000000000000000000000000000002',
        issuer: 'IDXNS',
      },
    },
    profile: {
      fullId: DEV_PLOT_FULL_ID,
      title: 'Demo Field',
      tag: PLOT_TAG,
      creator: 'Dev Tester',
      creatorTag: PERSON_TAG,
      role: 'Plot',
      joined: { date: now.toString(), unix: Math.floor( now / 1000 ) },
      uuidV4: plotUuid,
    },
    paths: {
      entity: '/profile/demo-field-2121',
      base64: '/' + plotUuid,
    },
    status: { active: true, verified: true },
    evmCredentials: {
      address: '0x0000000000000000000000000000000000000002',
      issuer: 'IDXNS',
    },
    geometry: {
      type: 'Point',
      coordinates: [13.41, 52.521],
      rand: false,
    },
    properties: {
      description: 'Demo plot with two crop seasons for soil calculator UX testing',
      target: 0,
      unit: 'day',
      baseLocation: 'Berlin, Germany',
    },
    holders: [DEV_PERSON_FULL_ID],
    servicefields: buildPlotServicefields(),
    onChain: { balance: 100, lastMove: Math.floor( now / 1000 ), timeToZero: 365 },
  } );

  await person.save();
  await plot.save();

  console.log( '\nDev seed complete.\n' );
  console.log( '  Person:', DEV_PERSON_FULL_ID );
  console.log( '  Plot:  ', DEV_PLOT_FULL_ID );
  console.log( '  Key:   ', DEV_UPHRASE );
  console.log( '\nOpen http://localhost:4021 — the app will auto-load this plot when devSeedPlot is enabled.\n' );

  await mongoose.disconnect();
}

main().catch( err => {
  console.error( err );
  process.exit( 1 );
} );
