export const KPI_MASTER=[
  {
    "area": "M",
    "parameter": "Legal compliance(%)",
    "target102": "100%",
    "monthTarget": "100%",
    "freq": "Monthly",
    "target": 100,
    "direction": "higher"
  },
  {
    "area": "S",
    "parameter": "Accidents A, B, C,D (E) (Nos.)",
    "target102": "0",
    "monthTarget": "0",
    "freq": "Monthly",
    "target": 0,
    "direction": "lower"
  },
  {
    "area": "S",
    "parameter": "Fire Incident A B C D",
    "target102": "0",
    "monthTarget": "0",
    "freq": "Monthly",
    "target": 0,
    "direction": "lower"
  },
  {
    "area": "Q",
    "parameter": "Voltage (V)",
    "target102": "415",
    "monthTarget": "415",
    "freq": "Monthly",
    "target": 415,
    "direction": "range"
  },
  {
    "area": "Q",
    "parameter": "Power Factor",
    "target102": ">0.9",
    "monthTarget": ">0.9",
    "freq": "Monthly",
    "target": 0.9,
    "direction": "higher"
  },
  {
    "area": "Q",
    "parameter": "Air Dew Point",
    "target102": "<10",
    "monthTarget": "<10",
    "freq": "Monthly",
    "target": 10,
    "direction": "lower"
  },
  {
    "area": "Q",
    "parameter": "ETP Conductivity",
    "target102": "<10",
    "monthTarget": "<10",
    "freq": "Monthly",
    "target": 10,
    "direction": "lower"
  },
  {
    "area": "Q",
    "parameter": "STP COD",
    "target102": "<50",
    "monthTarget": "<50",
    "freq": "Monthly",
    "target": 50,
    "direction": "lower"
  },
  {
    "area": "Q",
    "parameter": "Utility cost (Rs/ Veh.)",
    "target102": "184",
    "monthTarget": "184",
    "freq": "Monthly",
    "target": 184,
    "direction": "lower"
  },
  {
    "area": "Q",
    "parameter": "PM adherence",
    "target102": "100%",
    "monthTarget": "100%",
    "freq": "Monthly",
    "target": 100,
    "direction": "higher"
  },
  {
    "area": "Q",
    "parameter": "No of repeated Issue FAC A maint",
    "target102": "0",
    "monthTarget": "0",
    "freq": "Monthly",
    "target": 0,
    "direction": "lower"
  },
  {
    "area": "Q",
    "parameter": "No of repeated Issue FAC B maint",
    "target102": "0",
    "monthTarget": "0",
    "freq": "Monthly",
    "target": 0,
    "direction": "lower"
  },
  {
    "area": "Q",
    "parameter": "Zero BD machine",
    "target102": "0",
    "monthTarget": "0",
    "freq": "Monthly",
    "target": 0,
    "direction": "lower"
  },
  {
    "area": "C",
    "parameter": "Utility cost (Rs/ Veh.)",
    "target102": "184.6",
    "monthTarget": "184.6",
    "freq": "Monthly",
    "target": 184.6,
    "direction": "lower"
  },
  {
    "area": "C",
    "parameter": "R & M Cost(Mill Rs)",
    "target102": "47.17",
    "monthTarget": "47.17",
    "freq": "Monthly",
    "target": 47.17,
    "direction": "lower"
  },
  {
    "area": "C",
    "parameter": "CR Themes (Mill Rs.)",
    "target102": "3.14",
    "monthTarget": "3.14",
    "freq": "Monthly",
    "target": 3.14,
    "direction": "higher"
  },
  {
    "area": "D",
    "parameter": "RFI → Fac A",
    "target102": "0.13",
    "monthTarget": "0.13",
    "freq": "Monthly",
    "target": 0.13,
    "direction": "lower"
  },
  {
    "area": "D",
    "parameter": "MTTR → Fac A",
    "target102": "328.7",
    "monthTarget": "328.7",
    "freq": "Monthly",
    "target": 328.7,
    "direction": "lower"
  },
  {
    "area": "D",
    "parameter": "MTBF → Fac A",
    "target102": "15.03",
    "monthTarget": "15.03",
    "freq": "Monthly",
    "target": 15.03,
    "direction": "higher"
  },
  {
    "area": "D",
    "parameter": "RFI → Fac B",
    "target102": "0.67",
    "monthTarget": "0.67",
    "freq": "Monthly",
    "target": 0.67,
    "direction": "lower"
  },
  {
    "area": "D",
    "parameter": "MTTR → Fac B",
    "target102": "250.62",
    "monthTarget": "250.62",
    "freq": "Monthly",
    "target": 250.62,
    "direction": "lower"
  },
  {
    "area": "D",
    "parameter": "MTBF → Fac B",
    "target102": "33.27",
    "monthTarget": "33.27",
    "freq": "Monthly",
    "target": 33.27,
    "direction": "higher"
  },
  {
    "area": "D",
    "parameter": "Power failure(Nos)",
    "target102": "0",
    "monthTarget": "0",
    "freq": "Monthly",
    "target": 0,
    "direction": "lower"
  },
  {
    "area": "E",
    "parameter": "Water consumption KL (Per/veh)",
    "target102": "0.07",
    "monthTarget": "0.07",
    "freq": "Monthly",
    "target": 0.07,
    "direction": "lower"
  },
  {
    "area": "E",
    "parameter": "Waste reduction (tons)",
    "target102": "109",
    "monthTarget": "109",
    "freq": "Monthly",
    "target": 109,
    "direction": "higher"
  },
  {
    "area": "E",
    "parameter": "Renewable energy(%)",
    "target102": "98",
    "monthTarget": "98",
    "freq": "Monthly",
    "target": 98,
    "direction": "higher"
  }
];
export const DEPTS=["MF", "ME", "UM", "UE", "SE"];
export const ABS_PARAMS=[
  {
    "section": "Manpower",
    "param": "Total Associates",
    "key": "totalAssoc",
    "type": "number",
    "calc": "sum",
    "target": "",
    "direction": "info"
  },
  {
    "section": "Manpower",
    "param": "JE+ Associates",
    "key": "jeAssoc",
    "type": "number",
    "calc": "sum",
    "target": "",
    "direction": "info"
  },
  {
    "section": "Manpower",
    "param": "LA + CC Associates",
    "key": "laAssoc",
    "type": "number",
    "calc": "sum",
    "target": "",
    "direction": "info"
  },
  {
    "section": "Manpower",
    "param": "Casual Associates",
    "key": "casAssoc",
    "type": "number",
    "calc": "sum",
    "target": "",
    "direction": "info"
  },
  {
    "section": "Absenteeism",
    "param": "Overall Actual Leaves",
    "key": "overallLeaves",
    "type": "number",
    "calc": "sum",
    "target": "",
    "direction": "lower"
  },
  {
    "section": "Absenteeism",
    "param": "Overall Working Days",
    "key": "overallWorkingDays",
    "type": "number",
    "calc": "avg",
    "target": "",
    "direction": "info"
  },
  {
    "section": "Absenteeism",
    "param": "Overall Absenteeism %",
    "key": "overallAbsPct",
    "type": "number",
    "calc": "avg",
    "target": 6,
    "direction": "lower"
  },
  {
    "section": "Absenteeism",
    "param": "JE+ Actual Leaves",
    "key": "jeLeaves",
    "type": "number",
    "calc": "sum",
    "target": "",
    "direction": "lower"
  },
  {
    "section": "Absenteeism",
    "param": "JE+ Working Days",
    "key": "jeWorkingDays",
    "type": "number",
    "calc": "avg",
    "target": "",
    "direction": "info"
  },
  {
    "section": "Absenteeism",
    "param": "JE+ Absenteeism %",
    "key": "jeAbsPct",
    "type": "number",
    "calc": "avg",
    "target": 6,
    "direction": "lower"
  },
  {
    "section": "Absenteeism",
    "param": "LA Actual Leaves",
    "key": "laLeaves",
    "type": "number",
    "calc": "sum",
    "target": "",
    "direction": "lower"
  },
  {
    "section": "Absenteeism",
    "param": "LA Working Days",
    "key": "laWorkingDays",
    "type": "number",
    "calc": "avg",
    "target": "",
    "direction": "info"
  },
  {
    "section": "Absenteeism",
    "param": "LA Absenteeism %",
    "key": "laAbsPct",
    "type": "number",
    "calc": "avg",
    "target": 6,
    "direction": "lower"
  },
  {
    "section": "Absenteeism",
    "param": "Casual Actual Leaves",
    "key": "casLeaves",
    "type": "number",
    "calc": "sum",
    "target": "",
    "direction": "lower"
  },
  {
    "section": "Absenteeism",
    "param": "Casual Working Days",
    "key": "casWorkingDays",
    "type": "number",
    "calc": "avg",
    "target": "",
    "direction": "info"
  },
  {
    "section": "Absenteeism",
    "param": "Casual Absenteeism %",
    "key": "casAbsPct",
    "type": "number",
    "calc": "avg",
    "target": 6,
    "direction": "lower"
  },
  {
    "section": "Absenteeism",
    "param": "Habitual Absenteeism Nos.",
    "key": "habitualNos",
    "type": "number",
    "calc": "sum",
    "target": 0,
    "direction": "lower"
  },
  {
    "section": "Overtime",
    "param": "Overall Total OT Hrs",
    "key": "overallOtHrs",
    "type": "number",
    "calc": "sum",
    "target": "",
    "direction": "lower"
  },
  {
    "section": "Overtime",
    "param": "Overall No. of Associates",
    "key": "overallOtAssoc",
    "type": "number",
    "calc": "sum",
    "target": "",
    "direction": "info"
  },
  {
    "section": "Overtime",
    "param": "Overall OT Hrs / Person",
    "key": "overallOtPer",
    "type": "number",
    "calc": "avg",
    "target": 16,
    "direction": "lower"
  },
  {
    "section": "Overtime",
    "param": "JE+ Total OT Hrs",
    "key": "jeOtHrs",
    "type": "number",
    "calc": "sum",
    "target": "",
    "direction": "lower"
  },
  {
    "section": "Overtime",
    "param": "JE+ No. of Associates",
    "key": "jeOtAssoc",
    "type": "number",
    "calc": "sum",
    "target": "",
    "direction": "info"
  },
  {
    "section": "Overtime",
    "param": "JE+ OT Hrs / Person",
    "key": "jeOtPer",
    "type": "number",
    "calc": "avg",
    "target": 16,
    "direction": "lower"
  },
  {
    "section": "Overtime",
    "param": "LA Total OT Hrs",
    "key": "laOtHrs",
    "type": "number",
    "calc": "sum",
    "target": "",
    "direction": "lower"
  },
  {
    "section": "Overtime",
    "param": "LA No. of Associates",
    "key": "laOtAssoc",
    "type": "number",
    "calc": "sum",
    "target": "",
    "direction": "info"
  },
  {
    "section": "Overtime",
    "param": "LA OT Hrs / Person",
    "key": "laOtPer",
    "type": "number",
    "calc": "avg",
    "target": 16,
    "direction": "lower"
  },
  {
    "section": "Overtime",
    "param": "Casual Total OT Hrs",
    "key": "casOtHrs",
    "type": "number",
    "calc": "sum",
    "target": "",
    "direction": "lower"
  },
  {
    "section": "Overtime",
    "param": "Casual No. of Associates",
    "key": "casOtAssoc",
    "type": "number",
    "calc": "sum",
    "target": "",
    "direction": "info"
  },
  {
    "section": "Overtime",
    "param": "Casual OT Hrs / Person",
    "key": "casOtPer",
    "type": "number",
    "calc": "avg",
    "target": 16,
    "direction": "lower"
  },
  {
    "section": "Overtime",
    "param": ">16 Hrs Overtime Nos.",
    "key": "otAbove16",
    "type": "number",
    "calc": "sum",
    "target": 0,
    "direction": "lower"
  },
  {
    "section": "Overtime",
    "param": ">10 Day Continuous Working Nos.",
    "key": "continuousAbove10",
    "type": "number",
    "calc": "sum",
    "target": 0,
    "direction": "lower"
  },
  {
    "section": "Remarks",
    "param": "Remarks",
    "key": "remarks",
    "type": "text",
    "calc": "text",
    "target": "",
    "direction": "info"
  }
];
