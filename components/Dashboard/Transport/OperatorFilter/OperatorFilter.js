import React from "react";
import { useOperator } from "../../../../Context/OperatorContext";
import styles from "./OperatorFilter.module.css";

const OperatorFilter = () => {
  const { selectedOperator, updateSelectedOperator, availableOperators } =
    useOperator();

  return (
    <div className={styles.filterContainer}>
      <label htmlFor="operatorSelect" className={styles.label}>
        Filter by Operator:
      </label>
      <select
        id="operatorSelect"
        className={styles.select}
        value={selectedOperator || ""}
        onChange={(e) => updateSelectedOperator(e.target.value || null)}
      >
        <option value="">All Operators</option>
        {availableOperators.map((operator) => (
          <option key={operator} value={operator}>
            {operator}
          </option>
        ))}
      </select>
    </div>
  );
};

export default OperatorFilter;
