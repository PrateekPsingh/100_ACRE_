import { Marker, Popup } from "react-leaflet";
import "./pin.scss";
import { Link } from "react-router-dom";
import {Icon} from 'leaflet';
function Pin({ item }) {
  return (
    <Marker position={[item.latitude, item.longitude]} icon={new Icon({iconUrl: '/icon.png', iconSize: [25, 41], iconAnchor: [12, 41]})}>
      <Popup>
        <div className="popupContainer">
          <img src={item.images[0]} alt="" />
          <div className="textContainer">
            <Link to={`/${item.id}`}>{item.title}</Link>
            <span>{item.bedroom} bedroom</span>
            <b>$ {item.price}</b>
          </div>
        </div>
      </Popup>
    </Marker>
  );
}

export default Pin;
