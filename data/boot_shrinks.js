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
//   minBackshellDiameter    - Min backshell exit diameter it fits (mm)
//   maxBackshellDiameter    - Max backshell exit diameter it fits (mm)
//   minBundleDiameter       - Min bundle diameter at cable end (mm)
//   maxBundleDiameter       - Max bundle diameter at cable end (mm)
// =============================================
Database.bootShrinks = [
  // Add your boot shrink data here, example:
  // { "PN": "BK-001", "MPN": "", "description": "Straight Boot Shrink", "UOM": "un", "type": "straight", "minBackshellDiameter": 10, "maxBackshellDiameter": 15, "minBundleDiameter": 3, "maxBundleDiameter": 8 }
];
