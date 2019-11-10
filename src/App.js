import React, {useState} from 'react';
import {ThemeProvider} from '@material-ui/styles';
import {createMuiTheme, makeStyles} from '@material-ui/core/styles';
import {Card, CardContent, Button} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import InputAdornment from '@material-ui/core/InputAdornment';
import MaterialTable from 'material-table';
import {blue} from '@material-ui/core/colors';
import Axios from 'axios';

import './App.css';

const useStyles = makeStyles(theme => ({
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
  flex: {
    display: 'flex',
  },
}));

const testItems = [
  {
    name: 'Item 1',
    cost: 250,
    unit: 1,
    amount: 250,
  },
];

const COLUMNS = [
  {title: 'Name', field: 'name'},
  {title: 'Cost', field: 'cost', type: 'numeric'},
  {title: 'Unit', field: 'unit', type: 'numeric'},
  {
    title: 'Amount',
    field: 'amount',
    render: rowData => {
      if (rowData) {
        const {cost, unit} = rowData;
        return cost * unit;
      } else return null;
    },
    editable: 'never',
  },
];

const theme = createMuiTheme({
  palette: {
    primary: blue,
  },
});

function App() {
  const classes = useStyles();

  const initialState = {
    name: '',
    email: '',
    phone: '',
    invoiceNumber: '',
    date: new Date().toString().substr(4, 11),
    loading: false,
  };

  const [state, setState] = useState(initialState);
  const [items, setItems] = useState({
    columns: COLUMNS,
    data: testItems,
  });

  const handleChange = prop => event => {
    setState({...state, [prop]: event.target.value});
  };

  const handleSubmit = async () => {
    try {
      setState({...state, loading: true});
      const {data} = items;

      let subTotal = 0;

      data.forEach(obj => {
        subTotal += obj.amount;
      });

      const tax = subTotal * 0.12;

      const total = subTotal + tax;

      const res = await Axios({
        method: 'POST',
        url: '/get-invoice',
        data: {
          data,
          state,
          subTotal: subTotal.toFixed(2),
          tax: tax.toFixed(2),
          total: total.toFixed(2),
        },
      });

      const {secure_url: url} = res.data;

      window.open(url, '_blank');

      setState(initialState);
      setItems({
        columns: COLUMNS,
        data: testItems,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const onRowAdd = newData =>
    new Promise(resolve => {
      setTimeout(() => {
        resolve();
        const data = [...items.data];
        const {cost, unit} = newData;
        const updatedData = {
          ...newData,
          amount: cost * unit,
        };
        data.push(updatedData);
        setItems({...items, data});
      }, 600);
    });

  const onRowUpdate = (newData, oldData) =>
    new Promise(resolve => {
      setTimeout(() => {
        resolve();
        const data = [...items.data];
        data[data.indexOf(oldData)] = newData;
        setItems({...items, data});
      }, 600);
    });

  const onRowDelete = oldData =>
    new Promise(resolve => {
      setTimeout(() => {
        resolve();
        const data = [...items.data];
        data.splice(data.indexOf(oldData), 1);
        setItems({...items, data});
      }, 600);
    });

  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <div>
          <Card className={classes.card}>
            <MaterialTable
              title="Invoice"
              columns={items.columns}
              data={items.data}
              options={{
                search: false,
              }}
              editable={{
                onRowAdd,
                onRowUpdate,
                onRowDelete,
              }}
            />
          </Card>
        </div>

        <div className={classes.flex}>
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
                className={classes.flex}
                style={{
                  flexDirection: 'column',
                }}>
                <TextField
                  className={classes.inputField}
                  id="outlined-name"
                  label="Name"
                  value={state.name}
                  onChange={handleChange('name')}
                />
                <TextField
                  className={classes.inputField}
                  id="outlined-name"
                  label="Email"
                  value={state.email}
                  onChange={handleChange('email')}
                />
                <TextField
                  className={classes.inputField}
                  id="outlined-name"
                  label="Phone Number"
                  value={state.phone}
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
                className={classes.flex}
                style={{
                  marginTop: '10px',
                  flexDirection: 'column',
                }}>
                <TextField
                  className={classes.inputField}
                  id="outlined-name"
                  label="Invoice Number"
                  value={state.invoiceNumber}
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

        {!state.loading ? (
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Generate Bill
          </Button>
        ) : (
          <CircularProgress />
        )}
      </div>
    </ThemeProvider>
  );
}

export default App;
