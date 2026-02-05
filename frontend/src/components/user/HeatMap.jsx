import React, { useEffect, useState } from "react";
import HeatMap from "@uiw/react-heat-map";

//generate activity
const generateActivityData = (startDate, endDate) => {
  const data = [];
  let currentDate = new Date(startDate);
  let end = new Date(endDate);
  
  while (currentDate <= end) {
    const count = Math.floor(Math.random() * 5);
    data.push({
      date: currentDate.toISOString().split("T")[0],
      count: count,
    });
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return data;
};

const HeatMapProfile = () => {
  const [activityData, setActivityData] = useState([]);

  useEffect(() => {
    const fetchData = () => {
      const startDate = "2024-01-01";
      const endDate = "2024-04-30";
      const data = generateActivityData(startDate, endDate);
      setActivityData(data);
    };
    fetchData();
  }, []);

  
  useEffect(() => {
    const textElements = document.querySelectorAll('.HeatMapProfile text');
    textElements.forEach(text => {
      text.style.fill = '#ffffff';
    });
  }, [activityData]);
  
  return (
    <div className="heatmap-container">
      <h4>Recent Contributions</h4>
      <HeatMap
        className="HeatMapProfile"
        value={activityData}
        width={750}
        legendCellSize={0}
        startDate={new Date('2024-01-01')}
        endDate={new Date('2024-04-30')}
        rectSize={12}
        space={3}
        weekLabels={['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']}
        monthLabels={['Jan', 'Feb', 'Mar', 'Apr']}
        panelColors={{
          0: '#000003',
          1: '#0e4429',
          2: '#006d32',
          3: '#26a641',
          4: '#39d353',
        }}
        rectProps={{
          rx: 2,
        }}
      />
    </div>
  );
};

export default HeatMapProfile;