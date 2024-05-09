import React from "react";
import DashLayout from "../../../components/Dashboard/DashboardLayout/DashLayout";
import PreviousWeek from "../../../components/Dashboard/PreviousWeek/PreviousWeek";
import OperatorPrevious from "../../../components/Dashboard/OperatorWeeklyCashups/OperatorPrevious";
import AdminPrevious from "../../../components/Dashboard/OperatorWeeklyCashups/AdminPrevious";

const Previousweek = () => {
  return (
    <DashLayout>
      <PreviousWeek />
      <AdminPrevious/>
      <OperatorPrevious/>
    </DashLayout>
  );
};

export default Previousweek;
