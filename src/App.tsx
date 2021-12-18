import { Button, Grid, InputAdornment, Stack, TextField } from '@mui/material';
import React, { useState } from 'react';
import banner from './autoLoanHeader.png';
import './App.css';

interface FormValues {
  principal: number,
  years: number,
  interest: number
}

const defaultValues: FormValues = {
  principal: 0,
  years: 0,
  interest: 0
}

function App() {
  const [formValues, setFormValues] = useState<FormValues>(defaultValues);
  const [monthlyPayment, setMonthlyPayment] = useState<Number>(0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues({
      ...formValues,
      [e.target.id]: e.target.value
    })
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    // Prevent page from reloading
    e.preventDefault();
    // Calculate monthly payment (pluses next to form values convert to number)
    const r: number = +formValues.interest / 100;
    const i: number = r / 12;
    const n: number = 12 * +formValues.years;
    const x: number = (1 + i) ** n; // (i + 1) to the power n
    let p: number = (+formValues.principal * (i * x)) / (x - 1);
    // Round to 2 decimal places
    p = Math.round(p * 100) / 100;
    
    setMonthlyPayment(p);
  }

  const handleClear = () => {
    // Set form values and monthly payment back to defaults
    setFormValues(defaultValues)
    setMonthlyPayment(0);
  }

  return (
    <div className="App">
      <img src={banner} alt="AutoLoan Banner" style={{marginTop: '10px'}}/>
      <h1>Auto Loan Payment Calculator</h1>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2} justifyContent="center" alignItems="center" direction="column">
          <Grid item>
            <TextField 
              id="principal"
              value={formValues.principal}
              label="Amount Borrowed"
              variant="outlined"
              style={{width: '200px'}}
              InputProps={{
                // Inclusion of this adornment forces label to always be unfocused, which some (including me) view as a bug.
                // Discussion here: https://github.com/mui-org/material-ui/issues/13898
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
              inputProps={{
                inputMode: "numeric",
                pattern: "[0-9]*",
              }}
              onChange={handleChange} />
          </Grid>
          <Grid item>
            <TextField 
              id="interest"
              value={formValues.interest}
              label="Interest Rate"
              variant="outlined"
              style={{width: '200px'}}
              InputProps={{
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
              }}
              inputProps={{
                inputMode: "numeric",
                pattern: "[0-9]+(\\.?[0-9])*",
              }}
              onChange={handleChange} />
          </Grid>
          <Grid item>
            <TextField id="years"
              label="Years"
              value={formValues.years}
              variant="outlined"
              style={{width: '200px'}}
              inputProps={{
                inputMode: "numeric",
                pattern: "[0-9]*",
              }}
              onChange={handleChange} />
          </Grid>
          <Grid item>
            <Stack direction="row" spacing={1} style={{width: '200px'}}>
              <Button type="submit" variant="contained" color="success">Calculate</Button>
              <Button onClick={handleClear} variant="contained" color="error">Clear</Button>
            </Stack>
          </Grid>
        </Grid>
      </form>
      {monthlyPayment !== 0 && <h2>Monthly Payment: {monthlyPayment}</h2>}
    </div>
  );
}

export default App;
