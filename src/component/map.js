import React, { useEffect, useState, useRef } from "react";
// import { Map } from "react-leaflet";
import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from "react-leaflet";
function MapCompo() {
  const position = [12.9716, 77.5946];
  const [data, setData] = useState();
  const [user, setUser] = useState([]);
  const [updated, setUpdated] = useState([]);
  const [dataByID, setDataByID] = useState();

  async function getUser() {
    let ref = [];
    let response = await fetch("https://kyupid-api.vercel.app/api/users");
    let waitRes = await response.json();
    ref.push(waitRes);
    setUser(ref);
  }

  function updateUser() {
    let ref = [];
    let info = [];
    // console.log("ref object", Object.keys(ref));

    user[0]?.users.map((element, i) => {
      if (
        Object.keys(ref) == [] ||
        Object.keys(ref).findIndex((ele) => ele == element.area_id) < 0
      ) {
        ref[element.area_id] = [element];

        if (element.gender == "M") {
          info[element.area_id] = { gender: { male: 1, female: 0 } };
        } else {
          info[element.area_id] = { gender: { male: 0, female: 1 } };
        }
        if (element.is_pro_user) {
          info[element.area_id] = { ...info[element.area_id], pro: 1 };
        } else {
          info[element.area_id] = { ...info[element.area_id], pro: 2 };
        }
        info[element.area_id] = { ...info[element.area_id], user: 1 };
        info[element.area_id] = {
          ...info[element.area_id],
          area_id: element.area_id,
        };
      } else {
        ref[element.area_id].push(element);
        if (element.gender == "M") {
          info[element.area_id].gender.male = ++info[element.area_id].gender
            .male;
        } else {
          info[element.area_id].gender.female = ++info[element.area_id].gender
            .female;
        }
        if (element.is_pro_user) {
          info[element.area_id].pro = ++info[element.area_id].pro;
        }

        info[element.area_id].user = ++info[element.area_id].user;
      }
    });
    // console.log("OBject array", Object.values(info));
    setDataByID(Object.values(info));
    setUpdated(ref);
  }
  async function getArea() {
    let response = await fetch("https://kyupid-api.vercel.app/api/areas");
    let waitRes = await response.json();
    setData(waitRes);
  }

  useEffect(() => {
    updateUser();
  }, [user]);

  useEffect(async () => {
    getUser();
    getArea();
  }, []);
  // console.log("data", dataByID);
  // console.log("data", data);
  function onEachFeature(feature, layer) {
    // let result = dataByID.find(
    //   (element) => element && element.area_id == feature.properties.area_id
    // );

    // dataByID.forEach((element) => console.log(element, typeof element));
    // console.log("results", result);
    // debugger;

    // console.log("feature", typeof feature.properties);
    let mix = [];
    console.log("type of databyId", typeof dataByID);
    if (dataByID && feature.properties) {
      let ref = [];
      ref.push(feature.properties);
      ref.map((element) => {
        let result = dataByID.find((ele) => ele.area_id == element.area_id);
        if (result) {
          element = { ...element, result };
          mix.push(element);
        }
      });
      console.log("dataUpdatedMIX", mix);
      if (mix && mix.length > 0 && mix[0].result) {
        let detalis = `"Area-name": ${mix[0].name},
        "Area-ID": ${mix[0].area_id},
        "Area pin-code": ${mix[0].pin_code},
        "User":${mix[0].result.user},
        "Pro-User":${mix[0].result.pro},
        "Male/Female":${mix[0].result.gender.male}/${mix[0].result.gender.female}`;
        layer.bindPopup(detalis);
      }
    }

    // if (
    //   feature.properties &&
    //   feature.properties.name &&
    //   feature.properties.area_id &&
    //   feature.properties.pin_code
    // ) {
    //   // let result = dataByID.find(
    //   //   (element) => element.area_id == feature.properties.area_id
    //   // );

    //   // let detalis = `"Area-name": ${feature.properties.name},
    //   // "Area-ID": ${feature.properties.area_id},
    //   // "Area pin-code": ${feature.properties.pin_code},
    //   // "User":${result?.user},
    //   // "Pro-User":${result?.pro},
    //   // "Male/Female":${result?.gender.male}/${result?.gender.female}`;

    //   let detalis = `"Area-name": ${feature.properties.name},
    //     "Area-ID": ${feature.properties.area_id},
    //     "Area pin-code": ${feature.properties.pin_code}`;
    //   layer.bindPopup(detalis);
    // }
  }

  return (
    <div>
      {data && dataByID && (
        <MapContainer
          style={{ height: "100vh" }}
          center={position}
          zoom={11}
          scrollWheelZoom={false}
        >
          {/* <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          /> */}
          <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <GeoJSON
            data={data.features}
            fillColor="green"
            weight={1}
            onEachFeature={onEachFeature}
            onclick={(event) => event.stopPropagation()}
          />
          {/* <Marker position={position}>
            <Popup>
              A pretty CSS3 popup. <br /> Easily customizable.
            </Popup>
          </Marker> */}
        </MapContainer>
      )}
    </div>
  );
}

export default MapCompo;

// https://www.youtube.com/watch?v=cCOL7MC4Pl0&t=513s
