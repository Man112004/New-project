import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Link } from "react-router-dom";

export default function MapPanel({ complaints = [], center = [20.5937, 78.9629], zoom = 5 }) {
  return (
    <div className="map-shell">
      <MapContainer center={center} zoom={zoom} scrollWheelZoom className="leaflet-map">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {complaints.map((complaint) => (
          <Marker key={complaint.id} position={[complaint.latitude, complaint.longitude]}>
            <Popup>
              <strong>{complaint.title}</strong>
              <p>{complaint.category}</p>
              <p>{complaint.status}</p>
              <Link to={`/complaints/${complaint.id}`}>View details</Link>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
