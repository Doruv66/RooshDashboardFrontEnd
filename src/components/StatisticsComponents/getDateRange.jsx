// getDateRange.js
export const getDateRange = (range) => {
    let startDate = new Date();
  
    switch (range) {
      case "This Week":
        startDate.setDate(startDate.getDate() - startDate.getDay());
        break;
      case "Last Week":
        startDate.setDate(startDate.getDate() - startDate.getDay() - 7);
        break;
      case "This Month":
        startDate.setDate(1);
        break;
      case "Last Month":
        startDate = new Date(startDate.getFullYear(), startDate.getMonth() - 1, 1);
        break;
      case "This Year":
        startDate = new Date(startDate.getFullYear(), 0, 1);
        break;
      case "Last Year":
        startDate = new Date(startDate.getFullYear() - 1, 0, 1);
        break;
      default:
        break;
    }
  
    const formatAsDate = (date) => date.toISOString().split('T')[0];
  
    return {
      startDate: formatAsDate(startDate),
    };
  };
  