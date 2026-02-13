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
  // Series 20 - Wall Mount Receptacle
  { "PN": "99932736M", "MPN": "20WE35PN", "description": "RECEPT CIRC 55 P NO.17", "UOM": "ea", "series": "MIL-DTL-38999", "shellSize": "17", "numberOfContacts": 55, "contactArrangement": "E35" },

  // Series 24 - Jam Nut Receptacle, Coating W (Olive Drab Cadmium)
  { "PN": "99933349M", "MPN": "24WA35PN", "description": "RECEPT CIRC 6 P NO.9", "UOM": "ea", "series": "MIL-DTL-38999", "shellSize": "9", "numberOfContacts": 6, "contactArrangement": "A35" },
  { "PN": "99941868M", "MPN": "24WA35SN", "description": "RECEPT CIRC 6 S NO.9 J/N", "UOM": "ea", "series": "MIL-DTL-38999", "shellSize": "9", "numberOfContacts": 6, "contactArrangement": "A35" },
  { "PN": "99933382M", "MPN": "24WB35PN", "description": "RECEPT CIRC 13 P NO.11 J/N", "UOM": "ea", "series": "MIL-DTL-38999", "shellSize": "11", "numberOfContacts": 13, "contactArrangement": "B35" },
  { "PN": "99941939M", "MPN": "24WB35SA", "description": "RECEPT CIRC 13 S NO.11 POL-A", "UOM": "ea", "series": "MIL-DTL-38999", "shellSize": "11", "numberOfContacts": 13, "contactArrangement": "B35" },
  { "PN": "99941869M", "MPN": "24WB35SB", "description": "RECEPT CIRC 13 S NO.11 POL-B", "UOM": "ea", "series": "MIL-DTL-38999", "shellSize": "11", "numberOfContacts": 13, "contactArrangement": "B35" },
  { "PN": "00175353N", "MPN": "24WB35SC", "description": "RECEPT CIRC 13 S NO.11 C J/N", "UOM": "ea", "series": "MIL-DTL-38999", "shellSize": "11", "numberOfContacts": 13, "contactArrangement": "B35" },
  { "PN": "99933384M", "MPN": "24WB35SN", "description": "RECEPT CIRC 13 S NO.11 J/N", "UOM": "ea", "series": "MIL-DTL-38999", "shellSize": "11", "numberOfContacts": 13, "contactArrangement": "B35" },
  { "PN": "99933379M", "MPN": "24WC35PN", "description": "RECEPT CIRC 22 P NO.13 J/N", "UOM": "ea", "series": "MIL-DTL-38999", "shellSize": "13", "numberOfContacts": 22, "contactArrangement": "C35" },
  { "PN": "20007787L", "MPN": "24WD19SN", "description": "RECEPT CIRC 19 S NO.15 J/N", "UOM": "ea", "series": "MIL-DTL-38999", "shellSize": "15", "numberOfContacts": 19, "contactArrangement": "D19" },
  { "PN": "00013783N", "MPN": "24WD35PA", "description": "RECEPT CIRC 37 P NO.15 P-A", "UOM": "ea", "series": "MIL-DTL-38999", "shellSize": "15", "numberOfContacts": 37, "contactArrangement": "D35" },
  { "PN": "99622498M", "MPN": "24WD35PN", "description": "RECEPT CIRC 37 P NO.15 J/N", "UOM": "ea", "series": "MIL-DTL-38999", "shellSize": "15", "numberOfContacts": 37, "contactArrangement": "D35" },
  { "PN": "99933345M", "MPN": "24WD35SA", "description": "RECEPT CIRC 37 S NO.15 POL-A", "UOM": "ea", "series": "MIL-DTL-38999", "shellSize": "15", "numberOfContacts": 37, "contactArrangement": "D35" },
  { "PN": "99930156M", "MPN": "24WD35SN", "description": "RECEPT CIRC 37 S NO.15 J/N", "UOM": "ea", "series": "MIL-DTL-38999", "shellSize": "15", "numberOfContacts": 37, "contactArrangement": "D35" },
  { "PN": "99933344M", "MPN": "24WE35SN", "description": "RECEPT CIRC 55 S NO.17", "UOM": "ea", "series": "MIL-DTL-38999", "shellSize": "17", "numberOfContacts": 55, "contactArrangement": "E35" },
  { "PN": "99940520M", "MPN": "24WE6SN", "description": "RECEPT CIRC 6 S NO.17", "UOM": "ea", "series": "MIL-DTL-38999", "shellSize": "17", "numberOfContacts": 6, "contactArrangement": "E6" },
  { "PN": "00063610N", "MPN": "24WF35PN", "description": "RECEPT CIRC 66 P NO.19 J/N CADM", "UOM": "ea", "series": "MIL-DTL-38999", "shellSize": "19", "numberOfContacts": 66, "contactArrangement": "F35" },
  { "PN": "55573308N", "MPN": "24WG35SN", "description": "RECEPT CIRC 79 S G35 J/N CRIMP", "UOM": "ea", "series": "MIL-DTL-38999", "shellSize": "21", "numberOfContacts": 79, "contactArrangement": "G35" },

  // Series 24 - Jam Nut Receptacle, Coating Z (Black Nickel)
  { "PN": "00087158N", "MPN": "24ZB35PN", "description": "RECEPT CIRC 13 P NO.11 ZN NI", "UOM": "ea", "series": "MIL-DTL-38999", "shellSize": "11", "numberOfContacts": 13, "contactArrangement": "B35" },
  { "PN": "00110873N", "MPN": "24ZB35SN", "description": "RECEPT CIRC 13 S NO.11 ZN", "UOM": "ea", "series": "MIL-DTL-38999", "shellSize": "11", "numberOfContacts": 13, "contactArrangement": "B35" },
  { "PN": "00185407N", "MPN": "24ZD19PN", "description": "RECEPT CIRC 19 P NO.15 TREAT Z", "UOM": "ea", "series": "MIL-DTL-38999", "shellSize": "15", "numberOfContacts": 19, "contactArrangement": "D19" },
  { "PN": "00155780N", "MPN": "24ZD19SN", "description": "RECEPT CIRC 19 S NO.15 CRIMP", "UOM": "ea", "series": "MIL-DTL-38999", "shellSize": "15", "numberOfContacts": 19, "contactArrangement": "D19" },
  { "PN": "00105672N", "MPN": "24ZD35SN", "description": "RECEPT CIRC 37 S NO.15 ZN NI", "UOM": "ea", "series": "MIL-DTL-38999", "shellSize": "15", "numberOfContacts": 37, "contactArrangement": "D35" },
  { "PN": "00186088N", "MPN": "24ZE35PB", "description": "RECEPT CIRC 55 P NO.17 ZN POL-B", "UOM": "ea", "series": "MIL-DTL-38999", "shellSize": "17", "numberOfContacts": 55, "contactArrangement": "E35" },
  { "PN": "00108438N", "MPN": "24ZE35SN", "description": "RECEPT CIRC 55 S NO.17 ZN NI", "UOM": "ea", "series": "MIL-DTL-38999", "shellSize": "17", "numberOfContacts": 55, "contactArrangement": "E35" },
  { "PN": "00155438N", "MPN": "24ZE6PN", "description": "RECEPT CIRC 6 P NO.17 J/N", "UOM": "ea", "series": "MIL-DTL-38999", "shellSize": "17", "numberOfContacts": 6, "contactArrangement": "E6" },
  { "PN": "00186087N", "MPN": "24ZE6SN", "description": "RECEPT CIRC 6 S NO.17 ZN", "UOM": "ea", "series": "MIL-DTL-38999", "shellSize": "17", "numberOfContacts": 6, "contactArrangement": "E6" },
  { "PN": "00181302F", "MPN": "24ZG35PN", "description": "RECEPT CIRC 79 P NO.21 ZN NI", "UOM": "ea", "series": "MIL-DTL-38999", "shellSize": "21", "numberOfContacts": 79, "contactArrangement": "G35" },
  { "PN": "00185410N", "MPN": "24ZH35PN", "description": "RECEPT CIRC 100 P NO.23 TREAT Z", "UOM": "ea", "series": "MIL-DTL-38999", "shellSize": "23", "numberOfContacts": 100, "contactArrangement": "H35" },
  { "PN": "00156595N", "MPN": "24ZH35SN", "description": "RECEPT CIRC 100 S NO.23 ZN NI", "UOM": "ea", "series": "MIL-DTL-38999", "shellSize": "23", "numberOfContacts": 100, "contactArrangement": "H35" },

  // Series 26 - Plug, Coating W (Olive Drab Cadmium)
  { "PN": "99946665M", "MPN": "26WA35SA", "description": "PLUG CIRC 6 S NO.9 POL-A", "UOM": "ea", "series": "MIL-DTL-38999", "shellSize": "9", "numberOfContacts": 6, "contactArrangement": "A35" },
  { "PN": "00042839N", "MPN": "26WA35SB", "description": "PLUG CIRC 6 S NO.9 POL-B", "UOM": "ea", "series": "MIL-DTL-38999", "shellSize": "9", "numberOfContacts": 6, "contactArrangement": "A35" },
  { "PN": "99933354M", "MPN": "26WA35SN", "description": "PLUG CIRC 6 S NO.9", "UOM": "ea", "series": "MIL-DTL-38999", "shellSize": "9", "numberOfContacts": 6, "contactArrangement": "A35" },
  { "PN": "99937592M", "MPN": "26WA98SN", "description": "PLUG CIRC 3 S NO.9", "UOM": "ea", "series": "MIL-DTL-38999", "shellSize": "9", "numberOfContacts": 3, "contactArrangement": "A98" },
  { "PN": "99941940M", "MPN": "26WB35PA", "description": "PLUG CIRC 13 P NO.11 POL-A", "UOM": "ea", "series": "MIL-DTL-38999", "shellSize": "11", "numberOfContacts": 13, "contactArrangement": "B35" },
  { "PN": "99941872M", "MPN": "26WB35PB", "description": "PLUG CIRC 13 P NO.11 POL-B", "UOM": "ea", "series": "MIL-DTL-38999", "shellSize": "11", "numberOfContacts": 13, "contactArrangement": "B35" },
  { "PN": "00073400N", "MPN": "26WB35PC", "description": "PLUG CIRC 13 P NO.11 POL-C", "UOM": "ea", "series": "MIL-DTL-38999", "shellSize": "11", "numberOfContacts": 13, "contactArrangement": "B35" },
  { "PN": "99933385M", "MPN": "26WB35PN", "description": "PLUG CIRC 13 P NO.11", "UOM": "ea", "series": "MIL-DTL-38999", "shellSize": "11", "numberOfContacts": 13, "contactArrangement": "B35" },
  { "PN": "99933383M", "MPN": "26WB35SN", "description": "PLUG CIRC 13 S NO.11", "UOM": "ea", "series": "MIL-DTL-38999", "shellSize": "11", "numberOfContacts": 13, "contactArrangement": "B35" },
  { "PN": "99939960M", "MPN": "26WB98SN", "description": "PLUG CIRC 6 S NO.11", "UOM": "ea", "series": "MIL-DTL-38999", "shellSize": "11", "numberOfContacts": 6, "contactArrangement": "B98" },
  { "PN": "99933209M", "MPN": "26WC35PA", "description": "PLUG CIRC 22 P NO.13 POL-A", "UOM": "ea", "series": "MIL-DTL-38999", "shellSize": "13", "numberOfContacts": 22, "contactArrangement": "C35" },
  { "PN": "99941845M", "MPN": "26WC35PB", "description": "PLUG CIRC 22 P NO.13 POL-B", "UOM": "ea", "series": "MIL-DTL-38999", "shellSize": "13", "numberOfContacts": 22, "contactArrangement": "C35" },
  { "PN": "99621189M", "MPN": "26WC35PN", "description": "PLUG CIRC 22 P NO.13", "UOM": "ea", "series": "MIL-DTL-38999", "shellSize": "13", "numberOfContacts": 22, "contactArrangement": "C35" },
  { "PN": "99937594M", "MPN": "26WC35SA", "description": "PLUG CIRC 22 S NO.13 POL-A", "UOM": "ea", "series": "MIL-DTL-38999", "shellSize": "13", "numberOfContacts": 22, "contactArrangement": "C35" },
  { "PN": "99933380M", "MPN": "26WC35SN", "description": "PLUG CIRC 22 S NO.13", "UOM": "ea", "series": "MIL-DTL-38999", "shellSize": "13", "numberOfContacts": 22, "contactArrangement": "C35" },
  { "PN": "99942351M", "MPN": "26WC8SN", "description": "PLUG CIRC 8 S NO.13", "UOM": "ea", "series": "MIL-DTL-38999", "shellSize": "13", "numberOfContacts": 8, "contactArrangement": "C8" },
  { "PN": "99946420M", "MPN": "26WD19PA", "description": "PLUG CIRC 19 P NO.15 POL-A", "UOM": "ea", "series": "MIL-DTL-38999", "shellSize": "15", "numberOfContacts": 19, "contactArrangement": "D19" },
  { "PN": "99944867M", "MPN": "26WD19PN", "description": "PLUG CIRC 19 P NO.15", "UOM": "ea", "series": "MIL-DTL-38999", "shellSize": "15", "numberOfContacts": 19, "contactArrangement": "D19" },
  { "PN": "99933376M", "MPN": "26WD35PA", "description": "PLUG CIRC 37 P NO.15 POL-A", "UOM": "ea", "series": "MIL-DTL-38999", "shellSize": "15", "numberOfContacts": 37, "contactArrangement": "D35" },
  { "PN": "99936596M", "MPN": "26WD35PB", "description": "PLUG CIRC 37 P NO.15 POL-B", "UOM": "ea", "series": "MIL-DTL-38999", "shellSize": "15", "numberOfContacts": 37, "contactArrangement": "D35" },
  { "PN": "00027131N", "MPN": "26WD35PC", "description": "PLUG CIRC 37 P NO.15 POL-C", "UOM": "ea", "series": "MIL-DTL-38999", "shellSize": "15", "numberOfContacts": 37, "contactArrangement": "D35" },
  { "PN": "99930155M", "MPN": "26WD35PN", "description": "PLUG CIRC 37 P NO.15", "UOM": "ea", "series": "MIL-DTL-38999", "shellSize": "15", "numberOfContacts": 37, "contactArrangement": "D35" },
  { "PN": "99941377M", "MPN": "26WD35SA", "description": "PLUG CIRC 37 S NO.15 POL-A", "UOM": "ea", "series": "MIL-DTL-38999", "shellSize": "15", "numberOfContacts": 37, "contactArrangement": "D35" },
  { "PN": "99622499M", "MPN": "26WD35SN", "description": "PLUG CIRC 37 S NO.15", "UOM": "ea", "series": "MIL-DTL-38999", "shellSize": "15", "numberOfContacts": 37, "contactArrangement": "D35" },
  { "PN": "99939101M", "MPN": "26WD5SA", "description": "PLUG CIRC 5 S NO.15 STR", "UOM": "ea", "series": "MIL-DTL-38999", "shellSize": "15", "numberOfContacts": 5, "contactArrangement": "D5" },
  { "PN": "99933375M", "MPN": "26WE35PA", "description": "PLUG CIRC 55 P NO.17 POL-A", "UOM": "ea", "series": "MIL-DTL-38999", "shellSize": "17", "numberOfContacts": 55, "contactArrangement": "E35" },
  { "PN": "99941446M", "MPN": "26WE35PB", "description": "PLUG CIRC 55 P NO.17 POL-B", "UOM": "ea", "series": "MIL-DTL-38999", "shellSize": "17", "numberOfContacts": 55, "contactArrangement": "E35" },
  { "PN": "99933381M", "MPN": "26WE35PN", "description": "PLUG CIRC 55 P NO.17", "UOM": "ea", "series": "MIL-DTL-38999", "shellSize": "17", "numberOfContacts": 55, "contactArrangement": "E35" },
  { "PN": "99941376M", "MPN": "26WE35SB", "description": "PLUG CIRC 55 S NO.17 POL-B", "UOM": "ea", "series": "MIL-DTL-38999", "shellSize": "17", "numberOfContacts": 55, "contactArrangement": "E35" },
  { "PN": "99933386M", "MPN": "26WE35SN", "description": "PLUG CIRC 55 S NO.17", "UOM": "ea", "series": "MIL-DTL-38999", "shellSize": "17", "numberOfContacts": 55, "contactArrangement": "E35" },
  { "PN": "99931031M", "MPN": "26WE6PN", "description": "PLUG CIRC 6 P NO.17", "UOM": "ea", "series": "MIL-DTL-38999", "shellSize": "17", "numberOfContacts": 6, "contactArrangement": "E6" },
  { "PN": "99931029M", "MPN": "26WE6SN", "description": "PLUG CIRC 6 S NO.17", "UOM": "ea", "series": "MIL-DTL-38999", "shellSize": "17", "numberOfContacts": 6, "contactArrangement": "E6" },
  { "PN": "99939958M", "MPN": "26WF32SN", "description": "PLUG CIRC 32 S NO.19", "UOM": "ea", "series": "MIL-DTL-38999", "shellSize": "19", "numberOfContacts": 32, "contactArrangement": "F32" },
  { "PN": "99933353M", "MPN": "26WF35PN", "description": "PLUG CIRC 66 P NO.19", "UOM": "ea", "series": "MIL-DTL-38999", "shellSize": "19", "numberOfContacts": 66, "contactArrangement": "F35" },
  { "PN": "99622948M", "MPN": "26WF35SN", "description": "PLUG CIRC 66 S NO.19", "UOM": "ea", "series": "MIL-DTL-38999", "shellSize": "19", "numberOfContacts": 66, "contactArrangement": "F35" },
  { "PN": "99945352M", "MPN": "26WG11PA", "description": "PLUG CIRC 11 P NO.21 POL-A", "UOM": "ea", "series": "MIL-DTL-38999", "shellSize": "21", "numberOfContacts": 11, "contactArrangement": "G11" },
  { "PN": "99934940M", "MPN": "26WG35PA", "description": "PLUG CIRC 79 P NO.21 POL-A", "UOM": "ea", "series": "MIL-DTL-38999", "shellSize": "21", "numberOfContacts": 79, "contactArrangement": "G35" },
  { "PN": "99934939M", "MPN": "26WG35PN", "description": "PLUG CIRC 79 P NO.21", "UOM": "ea", "series": "MIL-DTL-38999", "shellSize": "21", "numberOfContacts": 79, "contactArrangement": "G35" },
  { "PN": "99934867M", "MPN": "26WG35SN", "description": "PLUG CIRC 79 S NO.21", "UOM": "ea", "series": "MIL-DTL-38999", "shellSize": "21", "numberOfContacts": 79, "contactArrangement": "G35" },
  { "PN": "99623199M", "MPN": "26WH35PN", "description": "PLUG CIRC 100 P NO.23", "UOM": "ea", "series": "MIL-DTL-38999", "shellSize": "23", "numberOfContacts": 100, "contactArrangement": "H35" },
  { "PN": "99623362M", "MPN": "26WH35SN", "description": "PLUG CIRC 100 S NO.23", "UOM": "ea", "series": "MIL-DTL-38999", "shellSize": "23", "numberOfContacts": 100, "contactArrangement": "H35" },

  // Series 26 - Plug, Coating Z (Black Nickel)
  { "PN": "00155779N", "MPN": "26ZD19PN", "description": "PLUG CIRC 19 P NO.15 CRIMP", "UOM": "ea", "series": "MIL-DTL-38999", "shellSize": "15", "numberOfContacts": 19, "contactArrangement": "D19" },
  { "PN": "00156598N", "MPN": "26ZH35PN", "description": "PLUG CIRC 100 P NO.23 ZN NI", "UOM": "ea", "series": "MIL-DTL-38999", "shellSize": "23", "numberOfContacts": 100, "contactArrangement": "H35" }
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
