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
      let ref = {};
      user[0]?.users.forEach((element) => {
        if (!ref[element.area_id]) {
          ref[element.area_id] = {
            area_id: element.area_id,
            count: 1,
            male: element.gender == "M" ? 1 : 0,
            female: element.gender == "F" ? 1 : 0,
            pro: element.is_pro_user ? 1 : 0,
          };
        } else {
          ref[element.area_id] = {
            ...ref[element.area_id],
            count: ref[element.area_id].count + 1,
            male:
              element.gender == "M"
                ? ref[element.area_id].male + 1
                : ref[element.area_id].male,
            female:
              element.gender == "F"
                ? ref[element.area_id].female + 1
                : ref[element.area_id].female,
            pro: element.is_pro_user
              ? ref[element.area_id].pro + 1
              : ref[element.area_id].pro,
          };
        }
      });
      setDataByID(ref);
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
    if (feature.properties && dataByID) {
      let detalis = `"Area-name": ${feature.properties.name},
      "Area-ID": ${feature.properties.area_id},
      "Area pin-code": ${feature.properties.pin_code},
      "User":${dataByID[feature.properties.area_id].user},
      "Pro-User":${dataByID[feature.properties.area_id].pro},
      "Male/Female":${dataByID[feature.properties.area_id].male}/${
        dataByID[feature.properties.area_id].female
      }`;

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
          />
        </MapContainer>
      )}
    </div>
  );
}

export default MapCompo;
