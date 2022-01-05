// import { geoJSON } from "leaflet";
import React, { useEffect, useState, useRef } from "react";
// import { Map } from "react-leaflet";
import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from "react-leaflet";
function MapCompo() {
  const position = [12.9716, 77.5946];
  const [data, setData] = useState();
  const [user, setUser] = useState([]);
  const [updated, setUpdated] = useState([]);
  const [dataByID, setDataByID] = useState([]);
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
          // info[element.area_id].push({ pro: 1 });
        } else {
          // info[element.area_id].push({ pro: 0 });
          info[element.area_id] = { ...info[element.area_id], pro: 2 };
        }
        // info[element.area_id].push({ length: 1 });
        info[element.area_id] = { ...info[element.area_id], user: 1 };
        // info[element.area_id].push({ area_id: element.area_id });
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
    let result = dataByID.find(
      (element) => element.area_id == feature.properties.area_id
    );
    // console.log("result", result);
    if (
      feature.properties &&
      feature.properties.name &&
      feature.properties.area_id &&
      feature.properties.pin_code &&
      result
    ) {
      let detalis = `"Area-name": ${feature.properties.name} "Area-ID": ${feature.properties.area_id} "Area pin-code": ${feature.properties.pin_code} "User":${result?.user} "Pro-User":${result?.pro} "Male":${result?.gender.male} "Female":${result?.gender.female} `;
      layer.bindPopup(detalis);
    }
  }

  return (
    <div>
      {data && (
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

//  <MapContainer center={position} zoom={12}>
//    <TileLayer
//      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//      attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
//    />
//  </MapContainer>;

//  <MapContainer center={position} zoom={12} scrollWheelZoom={false}>
//    <TileLayer
//      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//    />
//    <Marker position={position}>
//      <Popup>
//        A pretty CSS3 popup. <br /> Easily customizable.
//      </Popup>
//    </Marker>
//  </MapContainer>;
