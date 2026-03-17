import React, { createContext, useContext, useState, useEffect } from "react";

const OperatorContext = createContext();

export const OperatorProvider = ({ children }) => {
  const [selectedOperator, setSelectedOperator] = useState(null);
  const [currentOperator, setCurrentOperator] = useState(null);
  const [availableOperators, setAvailableOperators] = useState([]);

  // Load saved filter from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("selectedOperatorFilter");
    if (saved) {
      setSelectedOperator(saved);
    }
  }, []);

  // Fetch available operators
  useEffect(() => {
    const fetchOperators = async () => {
      try {
        const res = await fetch("/api/transport/operators");
        if (res.ok) {
          const data = await res.json();
          setAvailableOperators(data.operators || []);
        }
      } catch (error) {
        console.error("Error fetching operators:", error);
      }
    };
    fetchOperators();
  }, []);

  const updateSelectedOperator = (operator) => {
    setSelectedOperator(operator);
    if (operator) {
      localStorage.setItem("selectedOperatorFilter", operator);
    } else {
      localStorage.removeItem("selectedOperatorFilter");
    }
  };

  return (
    <OperatorContext.Provider
      value={{
        selectedOperator,
        updateSelectedOperator,
        currentOperator,
        setCurrentOperator,
        availableOperators,
      }}
    >
      {children}
    </OperatorContext.Provider>
  );
};

export const useOperator = () => {
  const context = useContext(OperatorContext);
  if (!context) {
    throw new Error("useOperator must be used within OperatorProvider");
  }
  return context;
};
