export default function MediaPreviewCell({ imageUrl, videoUrl, fileBaseUrl }) {
  if (imageUrl) {
    return <img className="table-media-thumb" src={`${fileBaseUrl}${imageUrl}`} alt="Complaint evidence" />;
  }
  if (videoUrl) {
    return (
      <video className="table-media-thumb" controls>
        <source src={`${fileBaseUrl}${videoUrl}`} />
      </video>
    );
  }
  return <span className="muted-text">No media</span>;
}
