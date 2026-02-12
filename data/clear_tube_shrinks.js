// =============================================
// Clear Tube Shrinks Database
// (Used over marker sleeves for protection)
// Edit this file to add/remove clear tube shrinks
//
// Fields:
//   PN              - Part Number
//   MPN             - Manufacturer Part Number
//   description     - Description
//   UOM             - Unit of Measure
//   minDiameter     - Min diameter it fits over (mm)
//   maxDiameter     - Max diameter it fits over (mm)
//   shrinkRatio     - Shrink ratio (e.g. "2:1")
//   wallThickness   - Wall thickness after shrinking (mm)
// =============================================
Database.clearTubeShrinks = [
  // Add your clear tube shrink data here, example:
  // { "PN": "CT-001", "MPN": "", "description": "Clear Tube Shrink 4-8mm", "UOM": "m", "minDiameter": 4, "maxDiameter": 8, "shrinkRatio": "2:1", "wallThickness": 0.3 }
];
