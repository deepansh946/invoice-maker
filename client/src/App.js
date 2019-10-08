import React, {useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {Card, CardContent, CardHeader} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import './App.css';

const useStyles = makeStyles({
  card: {
    margin: 10,
    minWidth: 350,
  },
  bold: {
    fontWeight: 600,
  },
  inputField: {
    marginRight: 20,
    marginTop: 10,
  },
});

const testItems = [
  {
    name: 'Item 1',
    cost: 200,
    unit: 2,
  },
  {
    name: 'Item 2',
    cost: 900,
    unit: 1,
  },
  {
    name: 'Item 3',
    cost: 400,
    unit: 8,
  },
  {
    name: 'Item 4',
    cost: 200,
    unit: 5,
  },
];

function App() {
  const classes = useStyles();
  const [values, setValues] = useState({
    name: '',
    email: '',
    phone: '',
    invoiceNumber: '',
    date: new Date().toString().substr(4, 11),
  });

  const [items, setItems] = useState([]);

  const handleChange = prop => event => {
    setValues({...values, [prop]: event.target.value});
  };

  return (
    <div className="App">
      <div>
        <Card className={classes.card}>
          <CardHeader component={() => <div>header</div>} />
          <CardContent>
            {testItems.map((item, index) => (
              <div key={index}>
                {item.name} {item.cost} {item.unit}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div
        style={{
          display: 'flex',
        }}>
        <Card className={classes.card}>
          <CardContent>
            <Typography
              style={{
                marginBottom: '20px',
              }}
              variant="h5"
              className={classes.bold}
              color="textPrimary"
              gutterBottom>
              Client
            </Typography>
            <Typography
              variant="h6"
              style={{
                marginBottom: '10px',
              }}
              color="textPrimary">
              Bill To
            </Typography>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
              }}>
              <TextField
                className={classes.inputField}
                id="outlined-name"
                label="Name"
                value={values.name}
                onChange={handleChange('name')}
              />
              <TextField
                className={classes.inputField}
                id="outlined-name"
                label="Email"
                value={values.email}
                onChange={handleChange('email')}
              />
              <TextField
                className={classes.inputField}
                id="outlined-name"
                label="Phone Number"
                value={values.phone}
                onChange={handleChange('phone')}
              />
            </div>
          </CardContent>
        </Card>
        <Card className={classes.card}>
          <CardContent>
            <Typography
              style={{
                marginBottom: '20px',
              }}
              variant="h5"
              className={classes.bold}
              color="textPrimary"
              gutterBottom>
              Invoice
            </Typography>
            <Typography
              variant="h6"
              style={{
                marginBottom: '10px',
              }}
              color="textPrimary">
              Details
            </Typography>
            <div
              style={{
                display: 'flex',
                marginTop: '10px',
                flexDirection: 'column',
              }}>
              <TextField
                className={classes.inputField}
                id="outlined-name"
                label="Invoice Number"
                value={values.invoiceNumber}
                onChange={handleChange('invoiceNumber')}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">#</InputAdornment>
                  ),
                }}
              />
              <TextField
                className={classes.inputField}
                id="outlined-name"
                label="Date"
                value={new Date().toString().substr(4, 11)}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default App;
