import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
function MapCompo() {
  // co-ordinates of Banglore
  const position = [12.9716, 77.5946];

  // data is geoJson information
  const [data, setData] = useState();
  const [user, setUser] = useState([]);

  // sorting data Area-ID
  const [dataByID, setDataByID] = useState();

  // fetching Users
  async function getUser() {
    let ref = [];
    let response = await fetch("https://kyupid-api.vercel.app/api/users");
    let waitRes = await response.json();
    ref.push(waitRes);
    setUser(ref);
  }
  // fetching geoJson data
  async function getArea() {
    let response = await fetch("https://kyupid-api.vercel.app/api/areas");
    let waitRes = await response.json();
    setData(waitRes);
  }

  // collecting data by its AreaID
  function updateUser() {
    if (user.length > 0) {
      let info = [];

      user[0]?.users.map((element, i) => {
        if (
          Object.keys(info) == [] ||
          Object.keys(info).findIndex((ele) => ele == element.area_id) < 0
        ) {
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
    }
  }

  useEffect(() => {
    updateUser();
  }, [user]);

  useEffect(async () => {
    getUser();
    getArea();
  }, []);

  // map the updated data by POP-UP
  function onEachFeature(feature, layer) {
    let result = dataByID.find(
      (element) => element.area_id == feature.properties.area_id
    );
    if (feature.properties && result) {
      let detalis = `"Area-name": ${feature.properties.name},
      "Area-ID": ${feature.properties.area_id},
      "Area pin-code": ${feature.properties.pin_code},
      "User":${result?.user},
      "Pro-User":${result?.pro},
      "Male/Female":${result?.gender.male}/${result?.gender.female}`;
      layer.bindPopup(detalis);
    }
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
        </MapContainer>
      )}
    </div>
  );
}

export default MapCompo;
