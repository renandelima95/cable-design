// =============================================
// Boot Shrinks Database
// Edit this file to add/remove boot shrinks
//
// Fields:
//   PN                      - Part Number
//   MPN                     - Manufacturer Part Number
//   description             - Description
//   UOM                     - Unit of Measure
//   type                    - "straight" or "90-deg"
//   minBackshellDiameter    - Min backshell exit diameter it fits (mm) - ideal min, loose below this
//   maxBackshellDiameter    - Max backshell exit diameter it fits (mm) - hard max
//   minBundleDiameter       - Min bundle diameter at cable end (mm) - ideal min, loose below this
//   maxBundleDiameter       - Max bundle diameter at cable end (mm) - hard max
// =============================================
Database.bootShrinks = [
  // Straight (STR)
  { "PN": "33230304M", "MPN": "202K121", "description": "BOOT SHRINK STR .92 TO .41", "UOM": "un", "type": "straight", "minBackshellDiameter": 10.4, "maxBackshellDiameter": 24, "minBundleDiameter": 5.6, "maxBundleDiameter": 24 },
  { "PN": "33230306M", "MPN": "202K132", "description": "BOOT SHRINK STR 1.12 TO .56", "UOM": "un", "type": "straight", "minBackshellDiameter": 14.2, "maxBackshellDiameter": 30, "minBundleDiameter": 5.9, "maxBundleDiameter": 30 },
  { "PN": "34334702M", "MPN": "202K142", "description": "BOOT SHRINK STR 1.22 TO .70", "UOM": "un", "type": "straight", "minBackshellDiameter": 18, "maxBackshellDiameter": 31, "minBundleDiameter": 7.1, "maxBundleDiameter": 31 },
  { "PN": "33230301M", "MPN": "202K153", "description": "BOOT SHRINK STR 1.42 TO .88", "UOM": "un", "type": "straight", "minBackshellDiameter": 22.4, "maxBackshellDiameter": 36, "minBundleDiameter": 8.4, "maxBundleDiameter": 36 },
  { "PN": "33230302M", "MPN": "202K163", "description": "BOOT SHRINK STR 1.68 TO 1.11", "UOM": "un", "type": "straight", "minBackshellDiameter": 28.2, "maxBackshellDiameter": 43, "minBundleDiameter": 9.9, "maxBundleDiameter": 43 },
  { "PN": "00004792N", "MPN": "202K174", "description": "BOOT SHRINK STR 2.36 TO 1.38 ADH", "UOM": "un", "type": "straight", "minBackshellDiameter": 35.1, "maxBackshellDiameter": 60, "minBundleDiameter": 15.7, "maxBundleDiameter": 60 },
  { "PN": "00019384N", "MPN": "202K185", "description": "BOOT SHRINK STR 2.60 TO 1.75 A", "UOM": "un", "type": "straight", "minBackshellDiameter": 44.5, "maxBackshellDiameter": 66, "minBundleDiameter": 16.8, "maxBundleDiameter": 66 },

  // Right Angle (RA / 90-deg)
  { "PN": "34334806M", "MPN": "222K121", "description": "BOOT SHRINK RA .92 TO .41", "UOM": "un", "type": "90-deg", "minBackshellDiameter": 10.4, "maxBackshellDiameter": 24, "minBundleDiameter": 5.6, "maxBundleDiameter": 24 },
  { "PN": "34334801M", "MPN": "222K132", "description": "BOOT SHRINK RA 1.12 TO .56", "UOM": "un", "type": "90-deg", "minBackshellDiameter": 14.2, "maxBackshellDiameter": 30, "minBundleDiameter": 5.9, "maxBundleDiameter": 30 },
  { "PN": "34334802M", "MPN": "222K142", "description": "BOOT SHRINK RA 1.22 TO .70", "UOM": "un", "type": "90-deg", "minBackshellDiameter": 18, "maxBackshellDiameter": 31, "minBundleDiameter": 7.1, "maxBundleDiameter": 31 },
  { "PN": "34334803M", "MPN": "222K152", "description": "BOOT SHRINK RA 1.42 TO .88", "UOM": "un", "type": "90-deg", "minBackshellDiameter": 22.4, "maxBackshellDiameter": 36, "minBundleDiameter": 8.4, "maxBundleDiameter": 36 },
  { "PN": "34334804M", "MPN": "222K163", "description": "BOOT SHRINK RA 1.68 TO 1.11", "UOM": "un", "type": "90-deg", "minBackshellDiameter": 28.2, "maxBackshellDiameter": 43, "minBundleDiameter": 9.9, "maxBundleDiameter": 43 },
  { "PN": "34334805M", "MPN": "222K174", "description": "BOOT SHRINK RA 2.04 TO 1.38", "UOM": "un", "type": "90-deg", "minBackshellDiameter": 35.1, "maxBackshellDiameter": 60, "minBundleDiameter": 15.7, "maxBundleDiameter": 60 },
  { "PN": "00021719N", "MPN": "222K185", "description": "BOOT SHRINK RA 2.60 TO 1.75 AD", "UOM": "un", "type": "90-deg", "minBackshellDiameter": 44.5, "maxBackshellDiameter": 66, "minBundleDiameter": 16.8, "maxBundleDiameter": 66 }
];
