import { useEffect, useState } from "react";
import { complaintApi, uploadApi } from "../../api/services";

const categories = [
  "ROAD_DAMAGE",
  "GARBAGE",
  "STREET_LIGHT",
  "WATER_LEAKAGE",
  "DRAINAGE",
  "TRAFFIC_SIGNAL",
  "ANIMAL_NUISANCE",
  "TREE_FALLEN",
  "OTHER_CIVIC_ISSUES"
];

export default function RaiseComplaintPage() {
  const [form, setForm] = useState({
    category: "ROAD_DAMAGE",
    title: "",
    description: "",
    imageUrl: "",
    videoUrl: "",
    latitude: "",
    longitude: "",
    address: "",
    city: "",
    ward: "",
    area: ""
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((position) => {
      setForm((prev) => ({
        ...prev,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      }));
    });
  }, []);

  async function handleUpload(type, file) {
    if (!file) return;
    const data = new FormData();
    data.append("file", file);
    const response = type === "image" ? await uploadApi.image(data) : await uploadApi.video(data);
    setForm((prev) => ({ ...prev, [type === "image" ? "imageUrl" : "videoUrl"]: response.data.url }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    await complaintApi.create({
      ...form,
      latitude: Number(form.latitude),
      longitude: Number(form.longitude)
    });
    setMessage("Complaint submitted successfully.");
  }

  return (
    <section className="section-stack">
      <div className="card">
        <h2>Raise Complaint</h2>
        <form className="form-grid" onSubmit={handleSubmit}>
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
            {categories.map((item) => <option key={item} value={item}>{item.replaceAll("_", " ")}</option>)}
          </select>
          <input placeholder="Complaint title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <textarea placeholder="Describe the issue" rows="5" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <input placeholder="Address / landmark" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          <div className="two-col">
            <input placeholder="Latitude" value={form.latitude} onChange={(e) => setForm({ ...form, latitude: e.target.value })} />
            <input placeholder="Longitude" value={form.longitude} onChange={(e) => setForm({ ...form, longitude: e.target.value })} />
          </div>
          <div className="three-col">
            <input placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
            <input placeholder="Ward" value={form.ward} onChange={(e) => setForm({ ...form, ward: e.target.value })} />
            <input placeholder="Area" value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} />
          </div>
          <label className="upload-field">
            Upload image
            <input type="file" accept="image/*" onChange={(e) => handleUpload("image", e.target.files?.[0])} />
          </label>
          <label className="upload-field">
            Upload video
            <input type="file" accept="video/*" onChange={(e) => handleUpload("video", e.target.files?.[0])} />
          </label>
          {message && <p className="success-text">{message}</p>}
          <button className="primary-btn" type="submit">Submit Complaint</button>
        </form>
      </div>
    </section>
  );
}
