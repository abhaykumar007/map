// import { geoJSON } from "leaflet";
import React, { useEffect, useState } from "react";
// import { Map } from "react-leaflet";
import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from "react-leaflet";
function MapCompo() {
  const position = [12.9716, 77.5946];
  const [data, setData] = useState([]);
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
          info[element.area_id] = [{ gender: { male: 1, female: 0 } }];
        } else {
          info[element.area_id] = [{ gender: { male: 0, female: 1 } }];
        }
        if (element.is_pro_user) {
          info[element.area_id].push({ pro: 1 });
        } else {
          info[element.area_id].push({ pro: 0 });
        }
        info[element.area_id].push({ length: 1 });
      } else {
        ref[element.area_id].push(element);
        if (element.gender == "M") {
          info[element.area_id][0].gender.male = ++info[element.area_id][0]
            .gender.male;
        } else {
          info[element.area_id][0].gender.female = ++info[element.area_id][0]
            .gender.female;
        }
        if (element.is_pro_user) {
          info[element.area_id][1].pro = ++info[element.area_id][1].pro;
        }

        info[element.area_id][2].length = ++info[element.area_id][2].length;
      }
    });
    // console.log("info M/F", info);
    setDataByID(info);
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
  // console.log("data", user, updated, dataByID);
  console.log("data", data);

  return (
    <div>
      <h1>Datting App</h1>
      <MapContainer
        style={{ height: "80vh" }}
        center={position}
        zoom={10}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <GeoJSON data={data.features} className="geoMap" />
      </MapContainer>
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
