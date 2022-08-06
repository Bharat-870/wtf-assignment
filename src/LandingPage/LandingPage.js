import React, { useCallback, useState, useEffect } from "react";
import axios from "axios";
import starIcon from "../images/stars.png";
import navigationIcon from "../images/navigation.png";
import "./LandingPage.css";

const LandingPage = () => {
  const [value, setValue] = useState("");
  const [data, setData] = useState("");
  const [showResetBtn, setShowResetBtn] = useState(false);

  const [nearestGym, setNearestGym] = useState(null);
  const [imagesArr, setImagesArr] = useState(null);
  const [showPlaces, setShowPlaces] = useState(null);
  const [callNearestApi, setCallNearestApi] = useState(false);
  const [callPlacesApi, setCallPlacesApi] = useState(false);

  const handleClick = (val) => {
    setValue("");
  };
  const handleChange = (event) => {
    setValue(event.target.value);
  };
  const handleInput = useCallback((event) => {
    console.log("event: ", event)
    setShowResetBtn(true);
    const { name, value } = event.target;
    setData({ ...data, [name]: value });
  });

  const resetInputValues = () => {
    setData({
      ...data,
      pin: null,
      min: null,
      max: null,
      city: null,
    });
    setShowResetBtn(false);
    setCallNearestApi(true)
  };

  useEffect(() => {
    axios
      .get(
        "https://devapi.wtfup.me/gym/nearestgym?lat=30.325488815850512&long=78.0042384802231"
      )
      .then((response) => {
        if (response) {
          // console.log("response gym: ", response.data);
          setNearestGym(response.data.data);
          setImagesArr(response.data.terms);
        }
      });
  }, [callNearestApi]);

  useEffect(() => {
    axios.get(" https://devapi.wtfup.me/gym/places").then((response) => {
      setShowPlaces(response.data.data[0].addressComponent);
    });
  }, []);

  useEffect(() => {
    if (data.pin != "" && nearestGym) {
      let filterPin = nearestGym.filter((item) => item.pin.includes(data.pin));
      setNearestGym(filterPin);
    } else if (data.pin == "") {
      setCallNearestApi(true);
    }
    if (data.city != "" && nearestGym) {
      // console.log("data city: ", typeof data.city)
      let filterCity = nearestGym.filter((item) =>
        item.city.includes(data.city)
      );
      setNearestGym(filterCity);
    } else if (data.city == "") {
      setCallNearestApi(true);
    }
  }, [data]);

  return (
    <div className="maindiv">
      <nav class="navbar navbar-light ">
        <div>
          <input
            type="text"
            onChange={handleChange}
            value={value}
            placeholder="Search gym name here..."
            aria-label="Search"
          />
          <button className="clrbtn" onClick={handleClick}>
            Clear
          </button>
        </div>
      </nav>
      <div className="divafternav">
        <div className="leftside">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "15px",
            }}
          >
            <h1>Filters</h1>
            {showResetBtn ? (
              <button style={{ border: "none", background: "none" }}>
                <span onClick={resetInputValues} className="resetbtn">
                  Reset
                </span>
              </button>
            ) : null}
          </div>
          <label className="labelName">Pin</label> <br />
          <input
            name="pin"
            value={data.pin}
            onChange={handleInput}
            className="inputfield"
            placeholder="Enter location"
          />{" "}
          <br />
          <label className="labelName">Price</label> <br />
          <div style={{ display: "flex", width: "70%" }}>
            <input
              name="min"
              value={data.min}
              onChange={handleInput}
              className="inputfield"
              placeholder="Min"
            />
            <input
              name="max"
              value={data.max}
              onChange={handleInput}
              style={{ marginLeft: "10px" }}
              className="inputfield"
              placeholder="Max"
            />
          </div>
          <label className="labelName">Cities</label> <br />
          <select
            name="city"
            value={data.city}
            onChange={handleInput}
            className="inputfield"
          >
            {" "}
            <br />
            <option disabled selected value={""}>
              Select City
            </option>
            <option value="Noida">Noida</option>
          </select>
        </div>
        <div className="rightside">
          {/* ----------mapping---------- */}

          {nearestGym &&
            nearestGym.map((items, index) => {
              return (
                <div className="card">
                  <div className="cardleft">
                    <img src={items.cover_image} alt="image" />
                  </div>
                  <div className="cardright">
                    <h4>{items.gym_name}</h4>
                    <img className="star-icon" src={starIcon} />
                    <p className="samepara">
                      <img src={navigationIcon} className="navigation-icon" />
                      {`${items.address1}, ${items.address2}`}
                    </p>
                    <p className="samepara">{`${items.duration_text} | ${items.distance_text}`}</p>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        background: "none",
                      }}
                    >
                      <p className="diffpara">{items.plan_price}</p>
                      <button className="bookBtn">Book Now</button>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
