import React, { Fragment, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { CardHeader, CardActions, Button } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import Progress from "../progress/Progress";
import OndemandVideoIcon from "@material-ui/icons/OndemandVideo";
import Tooltip from "@material-ui/core/Tooltip";
import Popover from "@material-ui/core/Popover";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";

const useStyles = makeStyles({
  root: {
    minWidth: 275,
  },
  mainDiv: {
    display: "flex",
  },
  firstDiv: {
    width: "45%",
  },
  secondDiv: {
    width: "55%",
  },
  action: {
    marginTop: 0,
  },
});

export default function VehicleDetailsCard(props) {
  const classes = useStyles();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [value, setValue] = React.useState("");

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;


  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const deepDiveClickHandler = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const getValue = (data, field) => {
    const { suffix, key, convert } = field;
    let value = '';
    switch (key) {
      case 'currentLocation':
        value = data.lat && data.longitude && convert ? convert(data.lat, data.longitude) : '';
        break;
      case 'status':
        switch (data[key]) {
          case 'H':
            value = 'Hault';
            break;
          case 'S':
            value = 'Stopped';
            break;
          case 'M':
            value = 'Moving';
            break;
          default:
            value = '';
            break;
        }
        if (value && convert) {
          value = convert(value);
        }
        break;
      default:
        value = data[key] || '';
        if (value && convert) {
          value = convert(value);
        }
        break;
    }

    if (value && suffix) {
      value = `${value} ${suffix}`
    }
    return value;
  }

  const fields = [{
    key: "assetName",
    label: "Asset name",
    suffix: ""
  },
  {
    key: "regNo",
    label: "Registration No.",
    suffix: ""
  },
  {
    key: "fuelLevel",
    label: "Fuel level",
    suffix: "%",
    convert: (value) => {
      return Math.round(value * 100).toFixed(0);
    }
  },
  {
    key: "avgSpeed",
    label: "Avg. speed",
    suffix: "Km/Hr"
  },
  {
    key: "driverName",
    label: "Driver",
    suffix: ""
  },
  {
    key: "dateTime",
    label: "Time",
    suffix: ""
  },
  {
    key: "currentLocation",
    label: "Geofence",
    suffix: "",
    // convert: async (lat, lng) => {

    //     const geocoder = new window.google.maps.Geocoder();
    //     const request = { 'latLng': { lat: Number(lat), lng: Number(lng) } };
    //     const { results } = await geocoder.geocode(request);
    //     let returnValue = ''
    //     if (results && results[0]) {
    //       let adrs_comp = results[0].address_components, loc_name, area_name;
    //       for (let i = 0; i < adrs_comp.length; i++) {
    //         if (adrs_comp[i].types[0] === "locality") {
    //           loc_name = adrs_comp[i].long_name;
    //         }
    //         if (adrs_comp[i].types[0] === "administrative_area_level_1") {
    //           area_name = adrs_comp[i].long_name;
    //         }
    //       }
    //       returnValue = `${loc_name}, ${area_name}`;
    //     }
    //     else {
    //       returnValue =  '';
    //     }
    //   return returnValue;
    // }
  },
  // {
  //   key: "address",
  //   label: "Address"
  // },
  {
    key: "status",
    label: "Status",
    suffix: ""
  },
  {
    key: "odometer",
    label: "Oddometer",
    suffix: ""
  },
  {
    key: "engHrs",
    label: "Engine hours",
    suffix: "Hrs",
    convert: (value) => {
      return Math.round(value).toFixed(2);
    }
  },
  {
    key: "backupBattery",
    label: "Backup battery",
    suffix: "V"
  },
  {
    key: "vehicleBattery",
    label: "Battery Voltage",
    suffix: "V"
  },];


  return (
    <Fragment>
      <Card className={classes.root} variant="outlined">
        <CardHeader
          avatar={
            <Avatar src="https://www.materialui.co/materialIcons/notification/drive_eta_black_144x144.png" />
          }
          action={
            <Fragment>
              <Tooltip title="Deep Dive">
                <IconButton
                  onClick={deepDiveClickHandler}
                  aria-label="deep dive"
                >
                  <OndemandVideoIcon />
                </IconButton>
              </Tooltip>
              <IconButton onClick={props.onClose} aria-label="close">
                <CloseIcon />
              </IconButton>
            </Fragment>
          }
          title={props.vehicleDetails.vid}
          subheader={props.vehicleDetails.driver}
        />
        <CardContent>
          {fields.map(field => {
            return (
              <div className={classes.mainDiv}>
                <div className={classes.firstDiv}>
                  <Typography variant="body2" component="p">
                    {field.label}:
                  </Typography>
                </div>
                <div className={classes.secondDiv}>
                  <Typography variant="body2" component="p">
                    {getValue(props.vehicleDetails, field)}
                  </Typography>
                </div>
              </div>
            )
          })}
          <Typography component="div">
            <Progress value={props.vehicleDetails.speed} />
          </Typography>
        </CardContent>
      </Card>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "center",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "center",
          horizontal: "left",
        }}
      >
        <Card style={{ minWidth: 275 }} variant="outlined">
          <CardHeader
            action={
              <IconButton
                size="small"
                onClick={handleClose}
                aria-label="close-filter"
              >
                <CloseIcon />
              </IconButton>
            }
            classes={{ action: classes.action }}
            title={
              <Typography style={{ color: "green" }} variant="body1">
                Select Your Deep Dive time period
              </Typography>
            }
          />
          <CardContent style={{ paddingTop: 0 }}>
            <RadioGroup
              aria-label="duration"
              name="duration"
              value={value}
              onChange={handleChange}
            >
              <FormControlLabel
                value="lasthour"
                control={<Radio />}
                label="Last Hour"
              />
              <FormControlLabel
                value="lastday"
                control={<Radio />}
                label="Last Day"
              />
              <FormControlLabel
                value="lastweek"
                control={<Radio />}
                label="Last Week"
              />
            </RadioGroup>
          </CardContent>
          <CardActions style={{ justifyContent: "center" }}>
            <a
              style={{ textDecoration: "none" }}
              target="_blank"
              rel="noopener noreferrer"
              href={`/#vehicle/${props.vehicleDetails.assetId}/deepDive/${props.vehicleDetails.imei}/${value}/${sessionStorage.getItem("issuedToken")}`}
            >
              <Button disabled={!value} color="primary" variant="contained">
                Get me my deep dive
              </Button>
            </a>
          </CardActions>
        </Card>
      </Popover>
    </Fragment>
  );
}
