const DemoContent = ( function() { // eslint-disable-line no-unused-vars

  /**
  * Models Demo Content
  * test data
  *
  */

  'use strict';

  const ethAddresses = {
    one: '0xe438d672987b63591d2dc49482734e0389f0b110',
    two: '0x3107b077b7745994cd93d85092db034ca1984d46',
    three: 'none', //'0xaa95dbb75e08d3dff45b1471efcff68a2d24f86b',
    four: 'none', // '0x623fed039bb4b321eadd1d94aee9778d365bb48f',
    five: 'none', // '0xd7b9425876ccdfaac0999c645803e4bfd4b593df',
    six: 'none', // '0xed86eb7a300119fee3ace44cdf0da2383789b628',
    seven: 'none', // '0x3250c42056ac611876522dab5e6c05f69f36efca',
    eight: 'none', // '0x249f01414972c2667fb2c8610237a08aa6f1f43e',
    nine: 'none', // '0x10dee3399b9c819c2465fd61bc59ecd61b63567e',
    ten: 'none', // '0xd601fa8bab4df5bcb1b72f031f8643263917b81b',
  };
  // use mnemonic:
  // bachelor subway public potato crunch domain carbon scissors scene gauge what congress

  return {
    mongoArr: [
      {
        title: 'Community',
        role: 'community',
        location: 'Berlin, Germany',
        lat: 52.5200,
        lng: 13.4050,
        description: 'The community account',
        unit: 'day',
        target: 400,
        ethAddress: ethAddresses.one
      },
      {
        title: 'Community Contribution',
        role: 'community-contribution',
        location: 'Berlin, Germany',
        lat: 52.5200,
        lng: 13.4050,
        description: 'The community contribution account',
        unit: 'day',
        target: 400,
        ethAddress: ethAddresses.two
      },
      {
        title: 'Accountant',
        role: 'job',
        location: 'Berlin, Germany',
        lat: 52.5200,
        lng: 13.4050,
        description: 'We need an accountant for our monthly reporting',
        unit: 'day',
        target: 400,
        ethAddress: ethAddresses.three
      },
      {
        title: 'Frontend Developer',
        role: 'job',
        location: 'Amsterdam, Netherlands',
        lat: 52.3667,
        lng: 4.8945,
        description: 'Must know Vue JS and related frameworks. Knowledge of Kotlin also of advantage.',
        unit: 'day',
        target: 395,
        ethAddress: ethAddresses.four
      },
      {
        title: 'Expert in NodeJS',
        role: 'skill',
        location: 'Paris, France',
        lat: 48.85661,
        lng: 2.35222,
        description: 'My skill is in developing NodeJS driven backends',
        unit: 'day',
        target: 420,
        ethAddress: ethAddresses.five
      },
      {
        title: 'Solidity EVM Developer',
        role: 'skill',
        location: 'Tunis, Tunisia',
        lat: 36.8064,
        lng: 10.1815,
        description: 'Contact me for smart contract development',
        unit: 'day',
        target: 415,
        ethAddress: ethAddresses.six
      },
      {
        title: 'Gardening and Tree Trimming',
        role: 'skill',
        location: 'Hamburg, Germany',
        lat: 53.55108,
        lng: 9.99368,
        description: 'Your Gardening needs are covered with our full service offer',
        unit: 'day',
        target: 375,
        ethAddress: ethAddresses.seven
      },
      {
        title: 'Tailored Suits',
        role: 'skill',
        location: 'Rome, Italy',
        lat: 41.90278,
        lng: 12.49637,
        description: 'Bespoke Tailored Suites, 24/7 Service with appointment',
        unit: 'piece',
        target: 2490,
        ethAddress: ethAddresses.eight
      },
      {
        title: 'CO2 Capture Plant',
        role: 'media',
        location: 'Hinwil, Switzerland',
        lat: 47.3075,
        lng: 8.8205,
        description: 'https://youtu.be/63S0t4k_Glw',
        unit: 'view',
        target: 10,
        ethAddress: ethAddresses.nine
      },
      {
        title: 'Robot delivery',
        role: 'media',
        location: 'Pacific Ocean',
        lat: 52.0406,
        lng: 0.7594,
        description: 'https://youtu.be/P_zRwq9c8LY',
        unit: 'delivery',
        target: 5,
        ethAddress: ethAddresses.ten
      },
      {
        title: 'Solar Energy Marocco',
        role: 'media',
        location: 'Marocco',
        lat: 31.7917,
        lng: 7.0926,
        description: 'https://youtu.be/1lJVi3DRGYI',
        unit: '',
        target: 0,
        ethAddress: 'none'
      },
      {
        title: 'The Ocean Cleanup',
        role: 'media',
        location: 'Pacific Ocean',
        lat: 37.8610,
        lng: -142.7596,
        description: 'https://youtu.be/du5d5PUrH0I',
        unit: 'view',
        target: 10,
        ethAddress: 'none'
      },
      {
        title: 'Web Developing',
        role: 'mooc',
        location: 'Berlin, Germany',
        lat: 52.5200,
        lng: 13.4050,
        description: 'https://youtu.be/u-FWvnweTQ8',
        unit: 'view',
        target: 10,
        ethAddress: 'none'
      },
      {
        title: 'Learning Strategies',
        role: 'mooc',
        location: 'Berlin, Germany',
        lat: 52.5200,
        lng: 13.4050,
        description: 'https://youtu.be/O6WtKeQrJmY',
        unit: 'view',
        target: 10,
        ethAddress: 'none'
      },
    ],
    accountData: {
      Balance: 3129,
      Lifetime: 163,
      In: 1770,
      Out: 686 + 53,
      Tx: 137
    },
    transactionsArr: [
      {
        title: 'Sheela Anand #3565',
        image: 'assets/img/flat.jpg',
        desc: 'Super nice studio apartment with balcony and sun all day. 48 sqm.',
        price: 40,
        amount: 14,
        type: 'out',
        unit: 'V per day',
        for: 'e-van hire in march',
        by: 'Kris Thomas Jensson #2121',
        loc: 'Berlin, Deutschland'
      },
      {
        title: 'Make Light Company #8949',
        image: 'assets/img/car.jpg',
        desc: 'The latest models and many extras such as a radio and cassette player',
        price: 275,
        amount: 6,
        type: 'in',
        unit: 'V per day',
        for: 'solar panel engineering work',
        by: 'Marvin Fowler #2121',
        loc: 'Budapest, Hungary'
      },
      {
        title: 'Anna Maria Blake #2121',
        image: 'assets/img/woods.jpg',
        desc: 'Enjoy a walk in nature by the river together with a local.',
        price: 120,
        amount: 1,
        type: 'in',
        unit: 'V per 45 min',
        for: 'welding work',
        by: 'Audun #2121',
        loc: 'Vuollerim, Sweden'
      },
      {
        title: 'Real Farmfood Store #8747',
        image: '',
        color: '#C4FAF8',
        desc: 'The latest models and many extras such as a radio and cassette player',
        price: 126,
        amount: 1,
        type: 'out',
        unit: 'V',
        for: 'Shopping Basket on checkout',
        by: 'Marvin Fowler #2121',
        loc: 'Budapest, Hungary'
      },
      {
        title: 'Community Account #2121',
        image: '',
        color: '#C4FAF8',
        desc: 'The latest models and many extras such as a radio and cassette player',
        price: 100,
        amount: 1,
        type: 'in',
        unit: 'V',
        for: 'Regular payout',
        by: 'Marvin Fowler #2121',
        loc: 'Budapest, Hungary'
      },
      {
        title: 'Real Farmfood Store #8747',
        image: '',
        color: '#C4FAF8',
        desc: 'The latest models and many extras such as a radio and cassette player',
        price: 16,
        amount: 1,
        type: 'out',
        unit: 'V',
        for: 'Shopping Basket on checkout',
        by: 'Marvin Fowler #2121',
        loc: 'Budapest, Hungary'
      },
    ],
    chatData: {
      Private: 569,
      Public: 8,
      Links: 36,
      Accounts: 3
    },
    chatsArr: [
      {
        sender: 'Me',
        msg: 'Hi, can I hire your e-van? Would like to book it from March 1st for two weeks? I got a lot of large crates of terra preta soil to move around',
      },
      {
        sender: 'Sheela Anand',
        msg: 'jo, Simon thanks for reaching out',
      },
      {
        sender: 'Sheela Anand',
        msg: 'This should not be a problem, shall we set the price per day to 40 V? This includes all energy needed.',
      },
      {
        sender: 'Me',
        msg: 'Cool, agreed. I will make the booking now then',
      },
      {
        sender: 'Sheela Anand',
        msg: 'Super! ;) Just type "send 560"',
      }
    ],
    entitiesArr: [
      {
        title: 'My Really Nice Studio Apartment Berlin #2121',
        image: 'assets/img/flat.jpg',
        desc: 'Super nice studio apartment with balcony and sun all day. 48 sqm.',
        price: 165,
        unit: 'V per night',
        by: 'Kris Thomas Jensson #2121',
        loc: 'Berlin, Deutschland'
      },
      {
        title: 'Car Hire Budapest #8949',
        image: 'assets/img/car.jpg',
        desc: 'The latest models and many extras such as a radio and cassette player',
        price: 275,
        unit: 'V per day',
        by: 'Marvin Fowler #2121',
        loc: 'Budapest, Hungary'
      },
      {
        title: 'Moontalk At Nasa #2121',
        image: '',
        color: '#BFFCC6',
        desc: 'Enjoy a talk by a NASA expert.',
        price: 120,
        unit: 'V per 45 min',
        by: 'Michael #2121',
        loc: 'Nasa, USA'
      },
      {
        title: 'My Really Nice Studio Apartment Berlin #2121',
        image: '',
        color: '#AFF8DB',
        desc: 'Super nice studio apartment with balcony and sun all day. 48 sqm.',
        price: 165,
        unit: 'V per night',
        by: 'Kris Thomas Jensson #2121',
        loc: 'Berlin, Deutschland'
      },
      {
        title: 'Car Hire Budapest #8949',
        image: '',
        color: '#C4FAF8',
        desc: 'The latest models and many extras such as a radio and cassette player',
        price: 275,
        unit: 'V per day',
        by: 'Marvin Fowler #2121',
        loc: 'Budapest, Hungary'
      },
      {
        title: 'Moontalk At Nasa #2121',
        image: '',
        color: '#BFFCC6',
        desc: 'Enjoy a talk by a NASA expert.',
        price: 120,
        unit: 'V per 45 min',
        by: 'Michael #2121',
        loc: 'Nasa, USA'
      },
      {
        title: 'The Collective #2121',
        image: '',
        color: '#CCDDFF',
        desc: 'Check out our projects',
        price: 0,
        unit: 'free',
        by: 'Created by Daniel #2121',
        loc: 'Berlin, Deutschland'
      }
    ],
    navArr: [

      /**
        * @c count
        * @l latest position (menu index)
        * @d display Name
        * @p page position after click
        * @f feature link
        */

      {
        id: '001',
        c: 0,
        l: -1,
        d: 'Games',
        p: 'feature',
        f: 'https://youtu.be/90FeqHdLe5s',
        // sub: [
        //   {id: '001s1', c: 0, l: -1, d: 'Shooter'},
        //   {id: '001s2', c: 0, l: -1, d: 'Quizz'},
        //   {id: '001s3', c: 0, l: -1, d: 'Lottery'},
        // ]
      },
      {
        id: '002',
        c: 0,
        l: -1,
        d: 'Jobs',
        p: 'peek',
        // sub: [
        //   {id: '002s1', c: 0, l: -1, d: 'Digital'},
        //   {id: '002s2', c: 0, l: -1, d: 'Construction'},
        //   {id: '002s3', c: 0, l: -1, d: 'Nature'},
        // ]
      },
      {
        id: '003',
        c: 0,
        l: -1,
        d: 'Skills',
        p: 'peek',
        // sub: [
        //   {id: '003s1', c: 0, l: -1, d: 'This'},
        //   {id: '003s2', c: 0, l: -1, d: 'That'},
        //   {id: '003s3', c: 0, l: -1, d: 'Other'},
        // ]
      },
      {
        id: '005',
        c: 0,
        l: -1,
        d: 'Map',
        p: 'closed',
        // sub: [
        //   {id: '005s1', c: 0, l: -1, d: 'This'},
        //   {id: '005s2', c: 0, l: -1, d: 'That'},
        //   {id: '005s3', c: 0, l: -1, d: 'Other'},
        // ]
      },
      // {
      //   id: '006',
      //   c: 0,
      //   l: -1,
      //   d: 'Media',
      //   p: 'feature',
      //   f: 'https://youtu.be/d5PBXMAFEPo'
      //   // sub: [
      //   //   {id: '006s1', c: 0, l: -1, d: 'Video'},
      //   //   {id: '006s2', c: 0, l: -1, d: 'Music'},
      //   //   {id: '006s3', c: 0, l: -1, d: 'Podcasts'},
      //   //   {id: '006s4', c: 0, l: -1, d: 'Books'},
      //   //   {id: '006s5', c: 0, l: -1, d: 'Audiobooks'},
      //   //   {id: '006s6', c: 0, l: -1, d: 'Documents'},
      //   // ]
      // },
      {
        id: '007',
        c: 0,
        l: -1,
        d: 'Chats',
        p: 'top',
        // sub: []
      },
      {
        id: '008',
        c: 0,
        l: -1,
        d: 'Members',
        p: 'top',
        // sub: []
      },
      {
        id: '009',
        c: 0,
        l: -1,
        d: 'Crowdfunding',
        p: 'peek',
        // sub: []
      },
      {
        id: '010',
        c: 0,
        l: -1,
        d: 'Events',
        p: 'peek',
        // sub: []
      },
      {
        id: '011',
        c: 0,
        l: -1,
        d: 'IoT',
        p: 'peek',
        // sub: [
        //   {id: '011s1', c: 0, l: -1, d: 'Robots'},
        //   {id: '011s2', c: 0, l: -1, d: 'Sensors'},
        // ]
      },
      {
        id: '012',
        c: 0,
        l: -1,
        d: 'Moocs',
        p: 'feature',
        f: 'https://youtu.be/eW3gMGqcZQc'
        // sub: [
        //   {id: '012s1', c: 0, l: -1, d: 'Software Development'},
        //   {id: '012s2', c: 0, l: -1, d: 'Makers'},
        // ]
      },
      {
        id: '013',
        c: 0,
        l: -1,
        d: 'Documents',
        p: 'top'
      }
    ],
    entitiesNavArr: [
      // c = count  d = display Name  l = latest position (menu index)   s = short name   o = online
      {
        id: '1001',
        c: 0,
        l: -1,
        f: 'Sheela Anand',
        title: 'SA',
        role: 'user',
        // draw: function() { Chat.draw() },
        o: true,
      },
      {
        id: '1002',
        c: 0,
        l: -1,
        f: 'Bertrand Arnaud',
        title: 'BJ',
        // draw: function() { Chat.draw() },
        o: true,
      },
      {
        id: '1003',
        c: 0,
        l: -1,
        f: 'Marc Woods',
        title: 'MG',
        role: 'user',
        // draw: function() { Chat.draw() },
        o: false,
      },
      {
        id: '1004',
        c: 0,
        l: -1,
        f: 'Missy Z',
        title: 'MZ',
        role: 'user',
        // draw: function() { Chat.draw() },
        o: true,
      },
      {
        id: '1005',
        c: 0,
        l: -1,
        f: 'Michael Jackson',
        title: 'MJ',
        role: 'user',
        // draw: function() { Chat.draw() },
        o: false,
      },
      {
        id: '1006',
        c: 0,
        l: -1,
        f: 'Tracy Chapman',
        role: 'user',
        title: 'TC',
        // draw: function() { Chat.draw() },
        o: true,
      },
      {
        id: '1007',
        c: 0,
        l: -1,
        f: 'Joe Cocker',
        title: 'JC',
        role: 'user',
        // draw: function() { Chat.draw() },
        o: true,
      },
      {
        id: '1008',
        c: 0,
        l: -1,
        f: 'Picasso',
        title: 'PC',
        role: 'user',
        // draw: function() { Chat.draw() },
        o: false,
      },
      {
        id: '1009',
        c: 0,
        l: -1,
        f: 'Vincent Van Gogh',
        title: 'VV',
        role: 'user',
        // draw: function() { Chat.draw() },
        o: false,
      },
      {
        id: '1010',
        c: 0,
        l: -1,
        f: 'Xavier Whoever',
        title: 'XW',
        role: 'user',
        // draw: function() { Chat.draw() },
        o: false,
      },
      {
        id: '1011',
        c: 0,
        l: -1,
        f: 'Sandra Bellingham',
        title: 'SB',
        role: 'user',
        // draw: function() { Chat.draw() },
        o: false,
      },
      {
        id: '1012',
        c: 0,
        l: -1,
        f: 'Gaby Wellington',
        title: 'GW',
        role: 'user',
        // draw: function() { Chat.draw() },
        o: false,
      },
    ],
    entitySubset: [
      'personal stream',
      'public chat',
      'private chat' /* in case of myself = notes */,
      'history',
      'download' /* if myself */,
      'profile'
    ]
  };

} )();
