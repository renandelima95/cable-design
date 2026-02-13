// =============================================
// Connectors Database
// Edit this file to add/remove connectors
//
// Fields:
//   PN                 - Part Number
//   MPN                - Manufacturer Part Number
//   description        - Description
//   UOM                - Unit of Measure
//   series             - Connector series (e.g. "MIL-DTL-38999")
//   shellSize          - Shell size (e.g. "11", "13", "15")
//   numberOfContacts   - Number of contacts
//   contactArrangement - Contact arrangement code
// =============================================
Database.connectors = [
  // Add your connector data here, example:
  // { "PN": "CN-001", "MPN": "26WD35SN", "description": "D38999 Plug Shell 15 - 37 pin", "UOM": "un", "series": "MIL-DTL-38999", "shellSize": "15", "numberOfContacts": 37, "contactArrangement": "D35" }
];

// =============================================
// D38999 Series III - MPN Configuration
// MPN format: [Series][Coating][ShellSize][InsertArr][ContactType][Polarity]
// Example: 26WD35SN
// =============================================
Database.d38999Config = {
    series: [
        { code: '20', name: 'Wall Mount Receptacle', nodePrefix: 'J' },
        { code: '24', name: 'Jam Nut Receptacle', nodePrefix: 'J' },
        { code: '26', name: 'Plug', nodePrefix: 'P' }
    ],
    coatings: [
        { code: 'W', name: 'Olive Drab Cadmium' },
        { code: 'Z', name: 'Black Nickel' }
    ],
    shellSizes: [
        { letter: 'A', number: '9' },
        { letter: 'B', number: '11' },
        { letter: 'C', number: '13' },
        { letter: 'D', number: '15' },
        { letter: 'E', number: '17' },
        { letter: 'F', number: '19' },
        { letter: 'G', number: '21' },
        { letter: 'H', number: '23' },
        { letter: 'J', number: '25' }
    ],
    contactTypes: [
        { code: 'S', name: 'Socket' },
        { code: 'P', name: 'Pin' },
        { code: 'A', name: 'Less Pin' },
        { code: 'B', name: 'Less Socket' }
    ],
    polarities: [
        { code: 'N', name: 'Normal' },
        { code: 'A', name: 'A' },
        { code: 'B', name: 'B' },
        { code: 'C', name: 'C' }
    ],
    // Insert arrangements per shell size letter
    // pins: { gauge: count }, total: sum of all contacts
    insertArrangements: {
        'A': [
            { code: '35', pins: { '22D': 6 }, total: 6 },
            { code: '98', pins: { '20': 3 }, total: 3 }
        ],
        'B': [
            { code: '2',  pins: { '16': 2 }, total: 2 },
            { code: '4',  pins: { '20': 4 }, total: 4 },
            { code: '5',  pins: { '20': 5 }, total: 5 },
            { code: '35', pins: { '22D': 13 }, total: 13 },
            { code: '98', pins: { '20': 6 }, total: 6 },
            { code: '99', pins: { '20': 7 }, total: 7 }
        ],
        'C': [
            { code: '4',  pins: { '16': 4 }, total: 4 },
            { code: '8',  pins: { '20': 8 }, total: 8 },
            { code: '35', pins: { '22D': 22 }, total: 22 },
            { code: '98', pins: { '20': 10 }, total: 10 }
        ],
        'D': [
            { code: '5',  pins: { '16': 5 }, total: 5 },
            { code: '15', pins: { '20': 14, '16': 1 }, total: 15 },
            { code: '18', pins: { '20': 18 }, total: 18 },
            { code: '19', pins: { '20': 19 }, total: 19 },
            { code: '35', pins: { '22D': 37 }, total: 37 },
            { code: '97', pins: { '20': 8, '16': 4 }, total: 12 }
        ],
        'E': [
            { code: '6',  pins: { '12': 6 }, total: 6 },
            { code: '8',  pins: { '16': 8 }, total: 8 },
            { code: '26', pins: { '20': 26 }, total: 26 },
            { code: '35', pins: { '22D': 55 }, total: 55 },
            { code: '99', pins: { '20': 21, '16': 2 }, total: 23 }
        ],
        'F': [
            { code: '11', pins: { '16': 11 }, total: 11 },
            { code: '28', pins: { '20': 26, '16': 2 }, total: 28 },
            { code: '30', pins: { '20': 29, '16': 1 }, total: 30 },
            { code: '32', pins: { '20': 32 }, total: 32 },
            { code: '35', pins: { '22D': 66 }, total: 66 },
            { code: '45', pins: { '22D': 67 }, total: 67 }
        ],
        'G': [
            { code: '11', pins: { '16': 11 }, total: 11 },
            { code: '16', pins: { '16': 16 }, total: 16 },
            { code: '24', pins: { '20': 24 }, total: 24 },
            { code: '25', pins: { '20': 25 }, total: 25 },
            { code: '27', pins: { '20': 27 }, total: 27 },
            { code: '35', pins: { '22D': 79 }, total: 79 },
            { code: '39', pins: { '20': 37, '16': 2 }, total: 39 },
            { code: '41', pins: { '20': 41 }, total: 41 }
        ],
        'H': [
            { code: '21', pins: { '16': 21 }, total: 21 },
            { code: '32', pins: { '20': 32 }, total: 32 },
            { code: '34', pins: { '20': 34 }, total: 34 },
            { code: '35', pins: { '22D': 100 }, total: 100 },
            { code: '36', pins: { '20': 36 }, total: 36 },
            { code: '53', pins: { '20': 53 }, total: 53 },
            { code: '55', pins: { '20': 55 }, total: 55 },
            { code: '97', pins: { '16': 16 }, total: 16 },
            { code: '99', pins: { '16': 11 }, total: 11 }
        ],
        'J': [
            { code: '4',  pins: { '20': 48, '16': 8 }, total: 56 },
            { code: '19', pins: { '16': 19 }, total: 19 },
            { code: '24', pins: { '20': 12, '16': 12 }, total: 24 },
            { code: '29', pins: { '20': 29 }, total: 29 },
            { code: '35', pins: { '22D': 128 }, total: 128 },
            { code: '43', pins: { '20': 23, '16': 20 }, total: 43 },
            { code: '61', pins: { '20': 61 }, total: 61 }
        ]
    }
};
