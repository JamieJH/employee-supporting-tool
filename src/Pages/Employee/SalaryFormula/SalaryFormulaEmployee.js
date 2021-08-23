import React from 'react';
import { MainContentLayout } from '../../../Components';
import SalaryFormula from '../../../Containers/SalaryFormulaForms/SalaryFormula';

const SalaryFormulaEmployee = () => {
  return (
    <MainContentLayout
      title="Salary Formula"
      description="See how salary of each type of employee is calculated."
      applyMaxWidth={true}>

      <SalaryFormula />

    </MainContentLayout>
  );
}

export default SalaryFormulaEmployee;
